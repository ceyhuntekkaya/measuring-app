import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import {
    WebSocketConfig,
    WebSocketMessage,
    ChatPayload,
    CommandPayload,
    InfoPayload,
    ConnectionStatus,
    InfoType
} from '@/types/websocket.types';

type MessageCallback = (message: WebSocketMessage) => void;
type StatusCallback = (status: ConnectionStatus) => void;
type ErrorCallback = (error: string) => void;

export class WebSocketService {
    private client: Client | null = null;
    private subscriptions: Map<string, StompSubscription> = new Map();
    private messageCallbacks: Set<MessageCallback> = new Set();
    private statusCallback: StatusCallback | null = null;
    private errorCallback: ErrorCallback | null = null;

    private currentUsername: string | null = null;
    private currentRole: 'ADMIN' | 'LEARNER' | null = null;
    private currentSessionId: string | null = null;

    constructor(private config: WebSocketConfig) {}

    /**
     * WebSocket bağlantısını başlat
     */
    connect(token: string, username: string, role: 'ADMIN' | 'LEARNER', sessionId: string): void {
        if (this.client?.active) {
      //      console.warn('WebSocket already connected');
            return;
        }

        this.currentUsername = username;
        this.currentRole = role;
        this.currentSessionId = sessionId;

        this.updateStatus(ConnectionStatus.CONNECTING);

        this.client = new Client({
            brokerURL: this.config.brokerURL,
            reconnectDelay: this.config.reconnectDelay ?? 5000,
            heartbeatIncoming: this.config.heartbeatIncoming ?? 4000,
            heartbeatOutgoing: this.config.heartbeatOutgoing ?? 4000,




            connectHeaders: {
                Authorization: `Bearer ${token}`,
                sessionId: sessionId,
            },

            debug: (str) => {
                if (this.config.debug) {
                    console.log('[STOMP]', str);
                }
            },

            onConnect: () => {
                console.log('✅ WebSocket Connected', {
                    role: this.currentRole,
                    username: this.currentUsername,
                    sessionId: this.currentSessionId,
                    connected: this.client?.connected
                });
                this.updateStatus(ConnectionStatus.CONNECTED);
                
                // Subscription'ları kurmak için kısa bir gecikme ekle
                setTimeout(() => {
                    this.setupSubscriptions();
                }, 100);
            },

            onDisconnect: () => {
                console.log('❌ WebSocket Disconnected', {
                    role: this.currentRole,
                    username: this.currentUsername,
                    sessionId: this.currentSessionId
                });
                this.updateStatus(ConnectionStatus.DISCONNECTED);
                this.clearSubscriptions();
            },

            onStompError: (frame) => {
                console.error('⚠️ STOMP Error:', frame.headers['message']);
                console.error('Details:', frame.body);
                console.error('Session Info:', {
                    role: this.currentRole,
                    username: this.currentUsername,
                    sessionId: this.currentSessionId
                });
                this.updateError(frame.headers['message'] || 'STOMP error occurred');
                this.updateStatus(ConnectionStatus.ERROR);
            },

            onWebSocketError: (event) => {
                console.error('🔴 WebSocket Error:', event);
                this.updateError('WebSocket connection error');
                this.updateStatus(ConnectionStatus.ERROR);
            },

            onWebSocketClose: () => {
                console.log('🔌 WebSocket Closed', {
                    role: this.currentRole,
                    username: this.currentUsername,
                    sessionId: this.currentSessionId
                });
                this.updateStatus(ConnectionStatus.RECONNECTING);
            },
        });
        console.log('🔌 WebSocket Connection Attempt:', {
            role,
            username,
            sessionId,
            brokerURL: this.config.brokerURL,
            hasToken: !!token
        });
        this.client.activate();
    }

    /**
     * Subscriptions kurulumu
     */





    private setupSubscriptions(): void {
        if (!this.client || !this.currentUsername || !this.currentRole || !this.currentSessionId) {
            return;
        }

        if (this.subscriptions.size > 0) {
            console.log('⚠️ Subscriptions already exist, skipping...');
            return;
        }

        // 1. Private Chat Messages
        this.subscribe(
            `/user/${this.currentUsername}/queue/chat`,
            (message) => this.handleMessage(message)
        );

        // 🆕 2. Presence Sync (initial online users)
        this.subscribe(
            `/user/${this.currentUsername}/queue/presence-sync`,
            (message) => this.handleMessage(message)
        );

        if (this.currentRole === 'LEARNER') {
            // 3. LEARNER: Commands
            this.subscribe(
                `/user/${this.currentUsername}/queue/commands`,
                (message) => this.handleMessage(message)
            );

            // 4. LEARNER: Broadcast commands
            this.subscribe(
                `/topic/exam-session/${this.currentSessionId}/commands`,
                (message) => this.handleMessage(message)
            );

            // 5. LEARNER: Info messages (ADMIN'den gelen ALERT mesajlarını görmek için)
            this.subscribe(
                `/topic/exam-session/${this.currentSessionId}/info`,
                (message) => this.handleMessage(message)
            );

            this.subscribe(
                `/topic/exam-session/${this.currentSessionId}/presence`,
                (message) => this.handleMessage(message)
            );

        }

        if (this.currentRole === 'ADMIN') {
            // 5. ADMIN: Info messages
            this.subscribe(
                `/topic/exam-session/${this.currentSessionId}/info`,
                (message) => this.handleMessage(message)
            );

            // 6. ADMIN: Private Chat Messages (learner'dan gelen mesajlar)
            this.subscribe(
                `/user/${this.currentUsername}/queue/chat`,
                (message) => this.handleMessage(message)
            );





            this.subscribe(
                `/topic/exam-session/${this.currentSessionId}/presence`,
                (message) => this.handleMessage(message)
            );
            this.subscribe(
                `/user/${this.currentUsername}/queue/presence-sync`,
                (message) => this.handleMessage(message)
            );

            // 6. ADMIN: LEARNER chat
            this.subscribe(
                `/topic/exam-session/${this.currentSessionId}/admin-chat`,
                (message) => this.handleMessage(message)
            );

            // 7. ADMIN: Presence
            this.subscribe(
                `/topic/exam-session/${this.currentSessionId}/presence`,
                (message) => this.handleMessage(message)
            );
        }

        // Subscription setup log'u kaldırıldı

        // Bağlantı kurulduğunda presence mesajı gönder (backend'e bildir)
        // Backend bu mesajı alıp presence'i yayınlamalı
        this.notifyConnection();
    }

    /**
     * Bağlantı kurulduğunda backend'e bildir
     * Backend bu mesajı alıp presence'i yayınlamalı
     */
    private notifyConnection(): void {
        if (!this.currentUsername || !this.currentSessionId) {
            return;
        }

        // Backend'e bağlantı kurulduğunu bildir
        // Backend bu mesajı alıp presence'i yayınlamalı
        const payload: InfoPayload = {
            infoType: InfoType.PRESENCE,
            metadata: {
                username: this.currentUsername,
                status: 'ONLINE',
                timestamp: new Date().toISOString()
            }
        };

        // Backend'in presence endpoint'ine gönder
        // Backend bu mesajı alıp presence'i yayınlamalı
        this.sendInfo(payload);
        console.log('📤 Notified backend about connection:', {
            username: this.currentUsername,
            role: this.currentRole,
            sessionId: this.currentSessionId
        });
    }

    /**
     * Subscribe to topic
     */
    private subscribe(destination: string, callback: (message: IMessage) => void): void {
        if (!this.client) {
            console.error('❌ Cannot subscribe: client is null');
            return;
        }

        if (!this.client.connected) {
            console.error('❌ Cannot subscribe: client is not connected');
            return;
        }

        try {
            const subscription = this.client.subscribe(destination, callback);
            this.subscriptions.set(destination, subscription);
            // Subscription log'u sadece ilk kurulumda göster
            if (this.subscriptions.size === 1) {
                console.log(`✅ Subscriptions started for ${this.currentRole}`);
            }
        } catch (error) {
            console.error(`❌ Failed to subscribe to ${destination}:`, error);
        }
    }

    /**
     * Handle incoming messages
     */
    private handleMessage(message: IMessage): void {
        try {
            const parsedMessage: WebSocketMessage = JSON.parse(message.body);
            const destination = message.headers.destination || '';
            
            // Sadece önemli mesajları logla (ALERT ve presence-sync)
            const isPresenceSync = destination.includes('presence-sync');
            const isAlert = parsedMessage.type === 'INFO' && 
                          parsedMessage.payload && 
                          typeof parsedMessage.payload === 'object' &&
                          'infoType' in parsedMessage.payload &&
                          parsedMessage.payload.infoType === 'ALERT';

            if (isAlert && parsedMessage.type === 'INFO') {
                const infoPayload = parsedMessage.payload as InfoPayload;
                console.log('🚨 ALERT received:', {
                    from: parsedMessage.senderId,
                    role: parsedMessage.senderRole
                });
            }

            if (isPresenceSync) {
                console.log('📋 Presence sync received');
            }

            // Notify all callbacks
            this.messageCallbacks.forEach(callback => callback(parsedMessage));
        } catch (error) {
            console.error('❌ Failed to parse message:', error);
        }
    }

    /**
     * Send CHAT message
     */
    sendChat(message: string, targetId: string, senderName: string): void {
        if (!this.isConnected() || !this.currentSessionId) {
        //    console.warn('Cannot send chat: not connected');
            return;
        }

        const payload: ChatPayload = {
            message,
            targetId,
            senderName,
        };

        this.publish(`/app/chat/${this.currentSessionId}`, payload);
    }

    /**
     * Send COMMAND (ADMIN only)
     */
    sendCommand(payload: CommandPayload): void {
        if (!this.isConnected() || !this.currentSessionId) {
        //    console.warn('Cannot send command: not connected');
            return;
        }

        if (this.currentRole !== 'ADMIN') {
        //    console.warn('Only ADMIN can send commands');
            return;
        }

        this.publish(`/app/command/${this.currentSessionId}`, payload);
    }

    /**
     * Send INFO
     */
    sendInfo(payload: InfoPayload): void {
        if (!this.isConnected() || !this.currentSessionId) {
       //     console.warn('Cannot send info: not connected');
            return;
        }

        this.publish(`/app/info/${this.currentSessionId}`, payload);
    }

    /**
     * Publish message
     */
    private publish(destination: string, body: unknown): void {
        if (!this.client || !this.client.connected) {
            console.error('Client not connected, cannot publish to:', destination);
            return;
        }

        this.client.publish({
            destination,
            body: JSON.stringify(body),
        });
        // Publish log'u kaldırıldı - çok fazla log üretiyordu
    }

    /**
     * Register message callback
     */
    onMessage(callback: MessageCallback): () => void {
        this.messageCallbacks.add(callback);

        // Return unsubscribe function
        return () => {
            this.messageCallbacks.delete(callback);
        };
    }

    /**
     * Register status callback
     */
    onStatusChange(callback: StatusCallback): void {
        this.statusCallback = callback;
    }

    /**
     * Register error callback
     */
    onError(callback: ErrorCallback): void {
        this.errorCallback = callback;
    }

    /**
     * Update status
     */
    private updateStatus(status: ConnectionStatus): void {
        if (this.statusCallback) {
            this.statusCallback(status);
        }
    }

    /**
     * Update error
     */
    private updateError(error: string): void {
        if (this.errorCallback) {
            this.errorCallback(error);
        }
    }

    /**
     * Check if connected
     */
    isConnected(): boolean {
        return this.client?.connected ?? false;
    }

    /**
     * Clear all subscriptions
     */
    private clearSubscriptions(): void {
        this.subscriptions.forEach((subscription, destination) => {
            subscription.unsubscribe();
            console.log(`❌ Unsubscribed from: ${destination}`);
        });
        this.subscriptions.clear();
    }

    /**
     * Disconnect
     */
    disconnect(): void {
        if (this.client?.active) {
            this.clearSubscriptions();
            this.client.deactivate();
            this.client = null;
            this.currentUsername = null;
            this.currentRole = null;
            this.currentSessionId = null;
         //   console.log('🔌 WebSocket disconnected');
        }
    }

    /**
     * Get current session ID
     */
    getSessionId(): string | null {
        return this.currentSessionId;
    }

    /**
     * Get current username
     */
    getUsername(): string | null {
        return this.currentUsername;
    }

    /**
     * Get current role
     */
    getRole(): 'ADMIN' | 'LEARNER' | null {
        return this.currentRole;
    }
}