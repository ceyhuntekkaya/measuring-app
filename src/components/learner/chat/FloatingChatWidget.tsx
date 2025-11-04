'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useAuthContext } from '@/contexts/auth-context';
import ChatButton from './ChatButton';
import ChatPanel from './ChatPanel';

export default function FloatingChatWidget() {
    const { chatMessages } = useWebSocket();
    const { candidate } = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastReadIndex, setLastReadIndex] = useState(0);

    const currentUsername = candidate?.username || '';

    // Calculate unread messages
    useEffect(() => {
        if (!isOpen) {
            // Panel kapalıyken gelen yeni mesajları say
            const newMessages = chatMessages.slice(lastReadIndex);
            const incomingMessages = newMessages.filter(
                (msg) => msg.senderId !== currentUsername
            );
            setUnreadCount(incomingMessages.length);
        } else {
            // Panel açıkken unread count sıfırla
            setUnreadCount(0);
            setLastReadIndex(chatMessages.length);
        }
    }, [chatMessages, isOpen, currentUsername, lastReadIndex]);

    const handleOpen = () => {
        setIsOpen(true);
        setUnreadCount(0);
        setLastReadIndex(chatMessages.length);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <ChatButton onClick={handleOpen} unreadCount={unreadCount} />
            )}

            {/* Chat Panel */}
            {isOpen && (
                <ChatPanel onClose={handleClose} />
            )}
        </>
    );
}