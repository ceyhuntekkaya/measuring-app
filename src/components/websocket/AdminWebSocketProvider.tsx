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
    WebSocketMessage,
} from '@/types/websocket.types';
import siteConfig from '@/config/config.json';
import { useAuthContext } from '@/contexts/auth-context';

const AdminWebSocketContext = createContext<WebSocketContextValue | null>(null);

interface AdminWebSocketProviderProps {
    children: React.ReactNode;
    sessionId: string;
    autoConnect?: boolean;
}

export const AdminWebSocketProvider: React.FC<AdminWebSocketProviderProps> = ({
                                                                                  children,
                                                                                  sessionId,
                                                                                  autoConnect = true,
                                                                              }) => {
    const { user } = useAuthContext();

    const serviceRef = useRef<WebSocketService | null>(null);
    const isInitializedRef = useRef(false); // 🔑 Önemli!

    const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
    const [error, setError] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [infoMessages, setInfoMessages] = useState<InfoMessage[]>([]);
    const [lastCommand, setLastCommand] = useState<CommandMessage | null>(null);

    const username = user?.username || null;
    const role = 'ADMIN' as const;

    const getWebSocketUrl = useCallback(() => {
        const apiUrl = siteConfig.api.invokeUrl;
        const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
        const urlWithoutProtocol = apiUrl.replace(/^https?:\/\//, '');
        return `${wsProtocol}://${urlWithoutProtocol}/ws`;
    }, []);

    // Handle incoming messages
    const handleIncomingMessage = useCallback((message: WebSocketMessage) => {
        console.log('📨 ADMIN received:', message.type, message); // 🔑 Tüm mesajı logla

        switch (message.type) {
            case MessageType.CHAT:
                setChatMessages((prev) => [...prev, message as ChatMessage]);
                break;

            case MessageType.COMMAND:
                setLastCommand(message as CommandMessage);
                break;

            case MessageType.INFO:
                console.log('ℹ️ INFO message payload:', message.payload); // 🔑 Payload'u logla
                setInfoMessages((prev) => [...prev, message as InfoMessage]);
                break;

            default:
                console.warn('Unknown message type:', message.type);
        }
    }, []);

    // Initialize service (ONCE!)
    useEffect(() => {
        if (isInitializedRef.current) {
            console.log('⚠️ Service already initialized, skipping...');
            return;
        }

        console.log('🔧 Initializing WebSocket service...');

        serviceRef.current = new WebSocketService({
            brokerURL: getWebSocketUrl(),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: process.env.NODE_ENV === 'development',
        });

        serviceRef.current.onStatusChange(setStatus);
        serviceRef.current.onError(setError);

        const unsubscribe = serviceRef.current.onMessage(handleIncomingMessage);

        isInitializedRef.current = true;

        return () => {
            console.log('🧹 Cleaning up WebSocket service...');
            unsubscribe();
            serviceRef.current?.disconnect();
            serviceRef.current = null;
            isInitializedRef.current = false;
        };
    }, []); // 🔑 Empty dependency array!

    // Auto-connect (ONCE!)
    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (
            autoConnect &&
            serviceRef.current &&
            token &&
            username &&
            sessionId &&
            !serviceRef.current.isConnected()
        ) {
            console.log(`🔌 ADMIN connecting to session: ${sessionId}`);
            serviceRef.current.connect(token, username, role, sessionId);
        }

        // Cleanup on unmount ONLY
        return () => {
            if (serviceRef.current?.isConnected()) {
                console.log('🔌 ADMIN disconnecting...');
                serviceRef.current.disconnect();
            }
        };
    }, [username, sessionId]); // 🔑 Sadece bu iki değer değişirse yeniden bağlan

    // Actions
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
        if (!serviceRef.current?.isConnected()) {
            console.warn('Cannot send command: WebSocket not connected');
            return;
        }
        serviceRef.current.sendCommand(payload);
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

    return <AdminWebSocketContext.Provider value={value}>{children}</AdminWebSocketContext.Provider>;
};

export const useAdminWebSocket = (): WebSocketContextValue => {
    const context = useContext(AdminWebSocketContext);
    if (!context) {
        throw new Error('useAdminWebSocket must be used within AdminWebSocketProvider');
    }
    return context;
};