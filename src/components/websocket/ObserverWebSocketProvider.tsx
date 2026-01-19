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

const ObserverWebSocketContext = createContext<WebSocketContextValue | null>(null);

interface ObserverWebSocketProviderProps {
    children: React.ReactNode;
    sessionId: string;
    autoConnect?: boolean;
}

export const ObserverWebSocketProvider: React.FC<ObserverWebSocketProviderProps> = ({
                                                                                  children,
                                                                                  sessionId,
                                                                                  autoConnect = true,
                                                                              }) => {
    const { user } = useAuthContext();

    const serviceRef = useRef<WebSocketService | null>(null);
    const isInitializedRef = useRef(false);

    const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
    const [error, setError] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [infoMessages, setInfoMessages] = useState<InfoMessage[]>([]);
    const [lastCommand, setLastCommand] = useState<CommandMessage | null>(null);

    const username = user?.username || null;
    const role = 'OBSERVER' as const;

    const getWebSocketUrl = useCallback(() => {
        const apiUrl = siteConfig.api.invokeUrl;
        const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
        const urlWithoutProtocol = apiUrl.replace(/^https?:\/\//, '');
        return `${wsProtocol}://${urlWithoutProtocol}/ws`;
    }, []);

    // Handle incoming messages
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

    // Initialize service (ONCE!)
    useEffect(() => {
        if (isInitializedRef.current) {
            console.log('⚠️ Service already initialized, skipping...');
            return;
        }

        console.log('🔧 Initializing WebSocket service for OBSERVER...');

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
            console.log(`🔌 OBSERVER connecting to session: ${sessionId}`, {
                username,
                hasToken: !!token,
                sessionId
            });
            serviceRef.current.connect(token, username, role, sessionId);
        }

        // Cleanup on unmount ONLY
        return () => {
            if (serviceRef.current?.isConnected()) {
                console.log('🔌 OBSERVER disconnecting...');
                serviceRef.current.disconnect();
            }
        };
    }, [username, sessionId, role, autoConnect, getWebSocketUrl]);

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
        // OBSERVER cannot send commands
        console.warn('OBSERVER cannot send commands', payload);
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

    return <ObserverWebSocketContext.Provider value={value}>{children}</ObserverWebSocketContext.Provider>;
};

export const useObserverWebSocket = (): WebSocketContextValue => {
    const context = useContext(ObserverWebSocketContext);
    if (!context) {
        throw new Error('useObserverWebSocket must be used within ObserverWebSocketProvider');
    }
    return context;
};
