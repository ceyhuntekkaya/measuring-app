'use client';

import { useState, useEffect } from 'react';
import { useAdminWebSocket } from '@/components/websocket/AdminWebSocketProvider';
import {ConnectionStatus, PresencePayload, PresenceSyncPayload, InfoType} from '@/types/websocket.types';

export function useOnlineStatus() {
    const { infoMessages, status } = useAdminWebSocket();
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (status !== ConnectionStatus.CONNECTED) {
            setOnlineUsers(new Set());
            return;
        }

        const users = new Set<string>();

        infoMessages.forEach((msg) => {
            // INFO mesajı mı kontrol et
            if (msg.type !== 'INFO') {
                return;
            }

            const payload = msg.payload;

            // InfoType.PRESENCE veya ALERT kontrolü
            if (payload && typeof payload === 'object' && 'infoType' in payload) {
                const infoType = payload.infoType;
                
                // ALERT mesajlarından username çıkar (test için heartbeat)
                if (infoType === InfoType.ALERT && 'metadata' in payload && payload.metadata) {
                    const metadata = payload.metadata as Record<string, unknown>;
                    if (metadata.username && typeof metadata.username === 'string') {
                        // ALERT mesajı gönderen kullanıcıyı online olarak işaretle
                        users.add(metadata.username);
                    }
                }
                
                // PRESENCE mesajlarını handle et
                if (infoType === InfoType.PRESENCE) {
                    console.log('🔍 Processing PRESENCE message:', {
                        payload,
                        hasMetadata: 'metadata' in payload && !!payload.metadata
                    });

                    // Metadata içinde presence bilgisi var mı?
                    if ('metadata' in payload && payload.metadata) {
                        const metadata = payload.metadata as Record<string, unknown>;
                        
                        // Array olarak gelebilir (presence-sync)
                        if (Array.isArray(metadata.users)) {
                            // Presence sync: Array of users
                            console.log('📋 Processing presence-sync (array):', {
                                usersCount: metadata.users.length,
                                users: metadata.users
                            });
                            const syncPayload = metadata as unknown as PresenceSyncPayload;
                            
                            syncPayload.users?.forEach((user: PresencePayload) => {
                                if (user.status === 'ONLINE' && user.username) {
                                    console.log('✅ Adding user to online list:', user.username);
                                    users.add(user.username);
                                } else if (user.status === 'OFFLINE' && user.username) {
                                    console.log('❌ Removing user from online list:', user.username);
                                    users.delete(user.username);
                                }
                            });
                        } else if (metadata.username && metadata.status) {
                            // Single presence: Single user
                            console.log('📡 Processing single presence:', {
                                username: metadata.username,
                                status: metadata.status
                            });
                            const presencePayload = metadata as unknown as PresencePayload;
                            if (presencePayload.status === 'ONLINE' && presencePayload.username) {
                                console.log('✅ Adding user to online list:', presencePayload.username);
                                users.add(presencePayload.username);
                            } else if (presencePayload.status === 'OFFLINE' && presencePayload.username) {
                                console.log('❌ Removing user from online list:', presencePayload.username);
                                users.delete(presencePayload.username);
                            }
                        } else {
                            console.warn('⚠️ PRESENCE metadata format not recognized:', metadata);
                        }
                    } else if ('username' in payload && 'status' in payload) {
                        // Direct presence payload (backward compatibility)
                        console.log('📡 Processing direct presence payload:', payload);
                        const presencePayload = payload as unknown as PresencePayload;
                        if (presencePayload.status === 'ONLINE' && presencePayload.username) {
                            console.log('✅ Adding user to online list:', presencePayload.username);
                            users.add(presencePayload.username);
                        } else if (presencePayload.status === 'OFFLINE' && presencePayload.username) {
                            console.log('❌ Removing user from online list:', presencePayload.username);
                            users.delete(presencePayload.username);
                        }
                    } else {
                        console.warn('⚠️ PRESENCE payload format not recognized:', payload);
                    }
                }
            }
        });

        console.log('👥 Final online users set:', Array.from(users));
        setOnlineUsers(users);
    }, [infoMessages, status]);

    const isOnline = (username: string): boolean => {
        const online = onlineUsers.has(username);
        return online;
    };

    return { isOnline, onlineUsers };
}