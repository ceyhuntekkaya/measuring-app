'use client';

import { ChatMessage as ChatMessageType } from '@/types/websocket.types';

interface ChatMessageProps {
    message: ChatMessageType;
    isOwn: boolean;
}

export default function ChatMessage({ message, isOwn }: ChatMessageProps) {
    const { payload, timestamp } = message;

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
                {!isOwn && (
                    <div className="text-xs text-gray-600 mb-1 font-medium">
                        Gözetmen
                    </div>
                )}
                <div
                    className={`rounded-lg px-4 py-2 ${
                        isOwn
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                    }`}
                >
                    <p className="text-sm break-words">{payload.message}</p>
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                    {formatTime(timestamp)}
                </div>
            </div>
        </div>
    );
}