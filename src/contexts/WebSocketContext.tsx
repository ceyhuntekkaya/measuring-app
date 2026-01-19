'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { WebSocketService } from '@/services/websocket/WebSocketService';
import {
    WebSocketContextValue,
    ConnectionStatus,
    ChatMessage,
    InfoMessage,
    CommandMessage,
    MessageType,
    CommandPayload,
    InfoPayload,
    InfoType,
    WebSocketMessage,
} from '@/types/websocket.types';
import siteConfig from '@/config/config.json';
import { useAuthContext } from '@/contexts/auth-context';
import { useExamApplicationContext } from '@/contexts/ExamApplicationContext';

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

interface WebSocketProviderProps {
    children: React.ReactNode;
    autoConnect?: boolean;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
                                                                        children,
                                                                        autoConnect = true,
                                                                    }) => {
    const { candidate, examSession } = useAuthContext();
    const { examSession: examApplicationSession, application } = useExamApplicationContext();

    const serviceRef = useRef<WebSocketService | null>(null);
    const isConnectingRef = useRef(false); // Bağlantı sırasında tekrar bağlanmayı engelle

    const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
    const [error, setError] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [infoMessages, setInfoMessages] = useState<InfoMessage[]>([]);
    const [lastCommand, setLastCommand] = useState<CommandMessage | null>(null);

    const username = candidate?.username || null;
    const role = 'LEARNER' as const;
    // sessionId'yi öncelik sırasına göre al:
    // 1. examSession?.id (auth context)
    // 2. examApplicationSession?.id (ExamApplicationContext)
    // 3. application?.examSessionId (Application - en güvenilir)
    const sessionId = examSession?.id || examApplicationSession?.id || application?.examSessionId || null;

    const getWebSocketUrl = () => {
        const apiUrl = siteConfig.api.invokeUrl;
        const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
        const urlWithoutProtocol = apiUrl.replace(/^https?:\/\//, '');
        return `${wsProtocol}://${urlWithoutProtocol}/ws`;
    };

    // Initialize service ONCE
    useEffect(() => {
        if (serviceRef.current) return;

        const wsUrl = getWebSocketUrl();
        serviceRef.current = new WebSocketService({
            brokerURL: wsUrl,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: process.env.NODE_ENV === 'development',
        });

        serviceRef.current.onStatusChange((newStatus) => {
            setStatus(newStatus);
            if (newStatus === ConnectionStatus.CONNECTED || newStatus === ConnectionStatus.DISCONNECTED) {
                isConnectingRef.current = false;
            }
        });

        serviceRef.current.onError(setError);

        const unsubscribe = serviceRef.current.onMessage((message: WebSocketMessage) => {
            handleIncomingMessage(message);
        });

        return () => {
            unsubscribe();
            serviceRef.current?.disconnect();
            serviceRef.current = null;
        };
    }, []);

    // Connect when ready
    useEffect(() => {
        if (!autoConnect || !serviceRef.current || !username) {
            console.log('⚠️ LEARNER WebSocket: Missing requirements', {
                autoConnect,
                hasService: !!serviceRef.current,
                username
            });
            return;
        }

        if (!sessionId) {
            console.warn('⚠️ LEARNER WebSocket: sessionId is null, cannot connect', {
                examSessionId: examSession?.id,
                examApplicationSessionId: examApplicationSession?.id,
                applicationExamSessionId: application?.examSessionId
            });
            return;
        }

        // Zaten bağlıysa veya bağlanıyorsa çık
        if (serviceRef.current.isConnected() || isConnectingRef.current) {
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) return;

        isConnectingRef.current = true;
        console.log(`🔌 LEARNER connecting to session: ${sessionId}`, {
            username,
            hasToken: !!token,
            examSessionId: examSession?.id,
            examApplicationSessionId: examApplicationSession?.id,
            applicationExamSessionId: application?.examSessionId
        });
        serviceRef.current.connect(token, username, role, sessionId);
    }, [autoConnect, username, sessionId, role, examSession, examApplicationSession, application]);

    // LEARNER bağlandığında sessionState IN_PROGRESS ise INFO mesajı gönder
    useEffect(() => {
        if (status !== ConnectionStatus.CONNECTED || !serviceRef.current || role !== 'LEARNER') {
            return;
        }

        // examSession'ı kontrol et
        const currentExamSession = examSession || examApplicationSession;
        if (currentExamSession?.sessionState === 'IN_PROGRESS') {
            // INFO mesajı gönder
            const payload: InfoPayload = {
                infoType: InfoType.STATUS_CHANGE,
                metadata: {
                    sessionState: 'IN_PROGRESS',
                    username: username || '',
                    timestamp: new Date().toISOString()
                }
            };
            
            serviceRef.current.sendInfo(payload);
            console.log('📤 LEARNER sent sessionState IN_PROGRESS INFO message');
        }
    }, [status, examSession, examApplicationSession, username, role, serviceRef]);



    const handleIncomingMessage = useCallback((message: WebSocketMessage) => {
        switch (message.type) {
            case MessageType.CHAT:
                setChatMessages((prev) => [...prev, message as ChatMessage]);
                break;

            case MessageType.COMMAND:
                setLastCommand(message as CommandMessage);
                break;

            case MessageType.INFO:
                const infoMsg = message as InfoMessage;
                setInfoMessages((prev) => [...prev, infoMsg]);
                break;

            default:
                console.warn('Unknown message type:', message.type);
        }
    }, []);

    const sendChat = useCallback(
        (message: string, targetId: string, senderName: string) => {
            if (!serviceRef.current?.isConnected()) {
                console.warn('Cannot send chat: WebSocket not connected');
                return;
            }
            serviceRef.current.sendChat(message, targetId, senderName);
        },
        []
    );

    const sendCommand = useCallback((payload: CommandPayload) => {
        console.error('LEARNER cannot send commands', payload);
    }, []);

    const sendInfo = useCallback((payload: InfoPayload) => {
        if (!serviceRef.current?.isConnected()) {
            console.warn('Cannot send info: WebSocket not connected');
            return;
        }
        serviceRef.current.sendInfo(payload);
    }, []);

    const clearMessages = useCallback(() => {
        setChatMessages([]);
        setInfoMessages([]);
        setLastCommand(null);
    }, []);

    const value: WebSocketContextValue = {
        status,
        error,
        chatMessages,
        infoMessages,
        lastCommand,
        sendChat,
        sendCommand,
        sendInfo,
        clearMessages,
        sessionId,
    };

    return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = (): WebSocketContextValue => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within WebSocketProvider');
    }
    return context;
};