// types/index.ts

export type ChatMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

export type ChatResponse = {
    message?: {
        role?: string;
        content?: string;
    };
    model?: string;
    created_at?: string;
    done?: boolean;
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    eval_count?: number;
    eval_duration?: number;
    response?: string; // Bazı Ollama API yanıtları bu formatta olabilir
};

export type ChatError = {
    error: string;
};