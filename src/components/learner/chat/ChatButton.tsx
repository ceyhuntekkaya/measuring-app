'use client';

import { MessageCircle } from 'lucide-react';

interface ChatButtonProps {
    onClick: () => void;
    unreadCount: number;
}

export default function ChatButton({ onClick, unreadCount }: ChatButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-[94px] right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40"
            aria-label="Chat"
        >
            <MessageCircle size={24} />

            {/* Badge */}
            {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </div>
            )}
        </button>
    );
}