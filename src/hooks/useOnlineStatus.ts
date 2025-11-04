'use client';

import { useState, useEffect } from 'react';
import { useAdminWebSocket } from '@/components/websocket/AdminWebSocketProvider';
import {ConnectionStatus, PresencePayload} from '@/types/websocket.types';

export function useOnlineStatus() {
    const { infoMessages, status } = useAdminWebSocket();
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (status !== ConnectionStatus.CONNECTED) {
            setOnlineUsers(new Set());
            return;
        }

        const users = new Set<string>();

        console.log('🔍 Processing info messages:', infoMessages.length);

        infoMessages.forEach((msg, index) => {
            const payload = msg.payload as unknown as PresencePayload;

            console.log(`📨 Message ${index}:`, {
                type: msg.type,
                senderId: msg.senderId,
                senderRole: msg.senderRole,
                payload: msg.payload,
            });

            // Presence mesajı kontrolü
            if (payload && typeof payload === 'object') {
                if (payload.status === 'ONLINE' && payload.username) {
                    users.add(payload.username);
                    console.log('🟢 Added online user:', payload.username);
                } else if (payload.status === 'OFFLINE' && payload.username) {
                    users.delete(payload.username);
                    console.log('🔴 Removed offline user:', payload.username);
                }
            }
        });

        console.log('📊 Final online users:', Array.from(users));
        setOnlineUsers(users);
    }, [infoMessages, status]);

    const isOnline = (username: string): boolean => {
        const online = onlineUsers.has(username);
        return online;
    };

    return { isOnline, onlineUsers };
}