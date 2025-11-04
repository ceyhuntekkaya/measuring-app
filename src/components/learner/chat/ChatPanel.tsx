'use client';

import { useState, useRef, useEffect } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useAuthContext } from '@/contexts/auth-context';
import { ConnectionStatus } from '@/types/websocket.types';
import ChatMessage from './ChatMessage';
import { X, Send } from 'lucide-react';

interface ChatPanelProps {
    onClose: () => void;
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
    const { chatMessages, sendChat, status, sessionId } = useWebSocket();
    const { candidate } = useAuthContext();
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isConnected = status === ConnectionStatus.CONNECTED;
    const currentUsername = candidate?.username || '';
    const senderName = `${candidate?.firstName || ''} ${candidate?.lastName || ''}`.trim() || 'Öğrenci';

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSendMessage = () => {
        if (message.trim() && isConnected && sessionId) {
            // LEARNER artık targetId olarak sessionId kullanıyor (backend handle ediyor)
            sendChat(message.trim(), sessionId, senderName);
            setMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-24 right-6 w-80 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
            {/* Header */}
            <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                    <h3 className="font-semibold">Gözetmen</h3>
                </div>
                <button
                    onClick={onClose}
                    className="hover:bg-blue-700 rounded p-1 transition-colors"
                    aria-label="Kapat"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Connection Status Warning */}
            {!isConnected && (
                <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-xs text-yellow-800">
                    Bağlantı kuruluyor...
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {chatMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Henüz mesaj yok
                    </div>
                ) : (
                    chatMessages.map((msg, index) => (
                        <ChatMessage
                            key={index}
                            message={msg}
                            isOwn={msg.senderId === currentUsername}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Mesajınızı yazın..."
                        disabled={!isConnected}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || !isConnected}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        aria-label="Gönder"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}