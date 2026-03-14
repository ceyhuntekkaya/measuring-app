import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  ExamWebSocketService, 
  ConnectionEvent
} from '@/lib/websocket/ExamWebSocketService';

interface UseExamWebSocketProps {
  sessionId: string;
  userRole: 'ADMIN' | 'OBSERVER' | 'LEARNER';
  token: string;
  userName: string;
  autoConnect?: boolean;
  onConnectionEvent?: (event: ConnectionEvent) => void;
}

export const useExamWebSocket = ({
  sessionId,
  userRole,
  token,
  userName,
  autoConnect = true,
  onConnectionEvent,
}: UseExamWebSocketProps) => {
  const wsService = useRef<ExamWebSocketService | null>(null);
  const isMountedRef = useRef(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [connectionEvents, setConnectionEvents] = useState<ConnectionEvent[]>([]);

  // Initialize WebSocket service & track mount
  useEffect(() => {
    isMountedRef.current = true;
    wsService.current = new ExamWebSocketService();

    return () => {
      isMountedRef.current = false;
      wsService.current?.disconnect();
    };
  }, []);

  // Setup subscriptions
  const setupSubscriptions = useCallback(() => {
    if (!wsService.current || !sessionId) return;

    // Connection events (herkes dinler) - state sadece mount iken güncellenir
    wsService.current.subscribeToConnectionEvents(sessionId, (event) => {
      if (isMountedRef.current) {
        setConnectionEvents((prev) => [...prev, event]);
      }
      onConnectionEvent?.(event);
    });
  }, [sessionId, onConnectionEvent]);

  // Connect
  const connect = useCallback(() => {
    if (!wsService.current || !sessionId || !token) {
      console.warn('[WebSocket] Cannot connect: missing sessionId or token');
      return;
    }

    wsService.current.connect(
      sessionId,
      userRole,
      token,
      userName,
      () => {
        if (isMountedRef.current) {
          setIsConnected(true);
          setError(null);
        }
      },
      (err) => {
        if (isMountedRef.current) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          setIsConnected(false);
        }
        console.error('[WebSocket] Connection error:', err);
      }
    );
  }, [sessionId, userRole, token, userName]);

  // isConnected true olduğunda subscriptions'ı kur
  useEffect(() => {
    if (isConnected && wsService.current && sessionId) {
      // Kısa bir gecikme ile subscribe yap (STOMP client'ın tam hazır olması için)
      const timer = setTimeout(() => {
        setupSubscriptions();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, sessionId, setupSubscriptions]);

  // Auto connect
  useEffect(() => {
    if (autoConnect && sessionId && token) {
      connect();
    }

    return () => {
      if (wsService.current) {
        wsService.current.disconnect();
        setIsConnected(false);
      }
    };
  }, [autoConnect, connect, sessionId, token]);

  const disconnect = useCallback(() => {
    wsService.current?.disconnect();
    setIsConnected(false);
    setConnectionEvents([]);
  }, []);

  return {
    isConnected,
    error,
    connectionEvents,
    connect,
    disconnect,
  };
};
