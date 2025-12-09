'use client';

import React, {useState, useRef, useEffect} from "react";
import {ApplicationDto} from "@/types/management/brand";
import {useAdminWebSocket} from "@/components/websocket/AdminWebSocketProvider";
import {useAuthContext} from "@/contexts/auth-context";
import {ConnectionStatus, ChatMessage as ChatMessageType} from "@/types/websocket.types";
import {Send, X} from "lucide-react";

export const ChatWindow = ({ participant, onClose }: {
    participant: ApplicationDto;
    onClose: () => void;
}) => {
    const { chatMessages, sendChat, status } = useAdminWebSocket();
    const { user } = useAuthContext();
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const isConnected = status === ConnectionStatus.CONNECTED;
    const currentUsername = user?.username || '';
    const targetUsername = participant.username || '';

    // Filter messages for this specific participant
    const filteredMessages = chatMessages.filter((msg) => {
        // Learner'ın gönderdiği mesajlar: senderId participant.username olmalı
        // Admin'in gönderdiği mesajlar: payload.targetId participant.username olmalı
        const isFromLearner = msg.senderId === targetUsername && msg.senderRole === 'LEARNER';
        const isToLearner = msg.senderRole === 'ADMIN' && msg.payload.targetId === targetUsername;
        return isFromLearner || isToLearner;
    });

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [filteredMessages]);

    const handleSend = () => {
        if (message.trim() && isConnected && targetUsername) {
            const senderName = user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : 'Gözetmen';
            
            // Admin mesaj gönderirken targetId olarak learner'ın username'ini gönder
            sendChat(message.trim(), targetUsername, senderName);
            setMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white border-2 border-gray-300 rounded-lg shadow-xl flex flex-col z-50">
            {/* Header */}
            <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white">
                        {participant.candidatePhotoUrl ? (
                            <img 
                                src={participant.candidatePhotoUrl} 
                                alt={participant.candidateName} 
                                className="w-full h-full object-cover" 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-blue-500 text-sm font-semibold">
                                {participant.candidateName ? participant.candidateName.charAt(0) : 'X'}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold">
                            {participant.candidateName} {participant.candidateLastName}
                        </span>
                        <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-300'}`} />
                            <span className="text-xs opacity-90">
                                {isConnected ? 'Bağlı' : 'Bağlantı yok'}
                            </span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={onClose} 
                    className="text-white hover:text-gray-200 text-xl transition-colors"
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
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {filteredMessages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8 text-sm">
                        Henüz mesaj yok
                    </div>
                ) : (
                    filteredMessages.map((msg, idx) => {
                        const isOwn = msg.senderRole === 'ADMIN';
                        return (
                            <div key={idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
                                <div className={`max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
                                    {!isOwn && (
                                        <div className="text-xs text-gray-600 mb-1 font-medium">
                                            {msg.payload.senderName || participant.candidateName}
                                        </div>
                                    )}
                                    <div
                                        className={`rounded-lg px-4 py-2 ${
                                            isOwn
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white border border-gray-200 text-gray-900'
                                        }`}
                                    >
                                        <p className="text-sm break-words">{msg.payload.message}</p>
                                    </div>
                                    <div className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                                        {formatTime(msg.timestamp)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white rounded-b-lg">
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
                        onClick={handleSend}
                        disabled={!message.trim() || !isConnected}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                        aria-label="Gönder"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};