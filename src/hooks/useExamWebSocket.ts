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
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [connectionEvents, setConnectionEvents] = useState<ConnectionEvent[]>([]);

  // Initialize WebSocket service
  useEffect(() => {
    wsService.current = new ExamWebSocketService();

    return () => {
      wsService.current?.disconnect();
    };
  }, []);

  // Setup subscriptions
  const setupSubscriptions = useCallback(() => {
    if (!wsService.current || !sessionId) return;

    // Connection events (herkes dinler)
    wsService.current.subscribeToConnectionEvents(sessionId, (event) => {
      setConnectionEvents((prev) => [...prev, event]);
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
        setIsConnected(true);
        setError(null);
        setupSubscriptions();
      },
      (err) => {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setIsConnected(false);
        console.error('[WebSocket] Connection error:', err);
      }
    );
  }, [sessionId, userRole, token, userName, setupSubscriptions]);

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
