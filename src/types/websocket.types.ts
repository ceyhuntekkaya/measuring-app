// Message Types
export enum MessageType {
    CHAT = 'CHAT',
    COMMAND = 'COMMAND',
    INFO = 'INFO'
}

// Command Actions
export enum CommandAction {
    PAUSE_EXAM = 'PAUSE_EXAM',
    RESUME_EXAM = 'RESUME_EXAM',
    TERMINATE_EXAM = 'TERMINATE_EXAM',
    WARNING = 'WARNING'
}

// Info Types
export enum InfoType {
    PROGRESS = 'PROGRESS',
    STATUS_CHANGE = 'STATUS_CHANGE',
    ALERT = 'ALERT',
    SYSTEM = 'SYSTEM',
    PRESENCE = 'PRESENCE', // 🆕 Yeni!
}

// Presence payload
export interface PresencePayload {
    username: string;
    status: 'ONLINE' | 'OFFLINE';
    timestamp: string;
}

// Role Types
export type UserRole = 'ADMIN' | 'LEARNER';

// Payloads
export interface ChatPayload {
    message: string;
    targetId: string;
    senderName: string;
}

export interface CommandPayload {
    action: CommandAction;
    targetId?: string;
    reason?: string;
}

export interface InfoPayload {
    infoType: InfoType;
    currentQuestion?: number;
    totalQuestions?: number;
    answeredCount?: number;
    metadata?: Record<string, unknown>;
}

// Main WebSocket Message
export interface WebSocketMessage<T = ChatPayload | CommandPayload | InfoPayload> {
    type: MessageType;
    senderId: string;
    senderRole: UserRole;
    sessionId: string;
    payload: T;
    timestamp: string;
}

// Typed Message Variants
export type ChatMessage = WebSocketMessage<ChatPayload>;
export type CommandMessage = WebSocketMessage<CommandPayload>;
export type InfoMessage = WebSocketMessage<InfoPayload>;

// Connection Status
export enum ConnectionStatus {
    DISCONNECTED = 'DISCONNECTED',
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
    RECONNECTING = 'RECONNECTING',
    ERROR = 'ERROR'
}

// WebSocket Context Value
export interface WebSocketContextValue {
    // Connection
    status: ConnectionStatus;
    error: string | null;

    // Messages
    chatMessages: ChatMessage[];
    infoMessages: InfoMessage[];
    lastCommand: CommandMessage | null;

    // Actions
    sendChat: (message: string, targetId: string, senderName: string) => void;
    sendCommand: (payload: CommandPayload) => void;
    sendInfo: (payload: InfoPayload) => void;
    clearMessages: () => void;

    // Session
    sessionId: string | null;
}

// WebSocket Service Config
export interface WebSocketConfig {
    brokerURL: string;
    reconnectDelay?: number;
    heartbeatIncoming?: number;
    heartbeatOutgoing?: number;
    debug?: boolean;
}