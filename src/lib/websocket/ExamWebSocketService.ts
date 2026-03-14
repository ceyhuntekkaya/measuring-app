import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import siteConfig from '@/config/config.json';

export interface ConnectionEvent {
  userId: string;
  userName: string;
  userRole: 'ADMIN' | 'OBSERVER' | 'LEARNER';
  sessionId: string;
  eventType: 'CONNECTED' | 'DISCONNECTED';
  timestamp: string;
}

type MessageHandler<T> = (message: T) => void;

export class ExamWebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private baseUrl: string;

  constructor() {
    // Backend URL'ini config'den al
    // invokeUrl zaten /api ile bitiyor, /ws ekliyoruz
    // Örnek: http://localhost:8080/api -> http://localhost:8080/api/ws
    // Context-path /api olduğu için endpoint /ws olarak tanımlanmış,
    // gerçek URL /api/ws olacak
    const backendUrl = siteConfig.api.invokeUrl || 'http://localhost:8080/api';
    this.baseUrl = backendUrl + '/ws';
    console.log('[WebSocket] Base URL:', this.baseUrl);
  }

  /**
   * WebSocket bağlantısını başlat
   */
  connect(
    sessionId: string,
    userRole: 'ADMIN' | 'OBSERVER' | 'LEARNER',
    token: string,
    userName: string,
    onConnected?: () => void,
    onError?: (error: Error | Event | unknown) => void
  ): void {
    if (this.client?.connected) {
      console.log('[WebSocket] Already connected');
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(this.baseUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
        sessionId: sessionId,
        userRole: userRole,
        userName: userName,
      },
      debug: (str) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[WebSocket Debug]:', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('[WebSocket] Connected successfully');
        this.reconnectAttempts = 0;
        onConnected?.();
      },
      onStompError: (frame) => {
        console.error('[WebSocket] STOMP error:', frame);
        onError?.(frame);
      },
      onWebSocketError: (event) => {
        console.error('[WebSocket] WebSocket error:', event);
        this.handleReconnect();
        onError?.(event);
      },
    });

    this.client.activate();
  }

  /**
   * Bağlantıyı kes
   */
  disconnect(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    if (this.client?.connected) {
      this.client.deactivate();
    }
    this.client = null;
    console.log('[WebSocket] Disconnected');
  }

  /**
   * CONNECTION: Bağlantı olaylarını dinle (herkes için)
   */
  subscribeToConnectionEvents(
    sessionId: string,
    handler: MessageHandler<ConnectionEvent>
  ): void {
    const destination = `/topic/session/${sessionId}/connection`;
    this.subscribe(destination, handler);
  }

  /**
   * Genel subscribe fonksiyonu
   */
  private subscribe<T>(destination: string, handler: MessageHandler<T>): void {
    if (!this.client) {
      console.error('[WebSocket] Cannot subscribe, client is null');
      return;
    }
    
    if (!this.client.connected) {
      console.error('[WebSocket] Cannot subscribe, not connected');
      return;
    }

    // Eğer zaten subscribe olmuşsak, önce unsubscribe yap
    if (this.subscriptions.has(destination)) {
      this.subscriptions.get(destination)?.unsubscribe();
    }

    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const parsedMessage = JSON.parse(message.body) as T;
        handler(parsedMessage);
      } catch (error) {
        console.error('[WebSocket] Failed to parse message:', error);
      }
    });

    this.subscriptions.set(destination, subscription);
    console.log(`[WebSocket] Subscribed to ${destination}`);
  }

  /**
   * Yeniden bağlanma mekanizması
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `[WebSocket] Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
      );
    } else {
      console.error('[WebSocket] Max reconnection attempts reached');
    }
  }

  /**
   * Bağlantı durumu kontrolü
   */
  isConnected(): boolean {
    return this.client?.connected || false;
  }
}
