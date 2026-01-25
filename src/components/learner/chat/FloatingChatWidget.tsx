'use client';

import { useState } from 'react';
import ChatButton from './ChatButton';
import ChatPanel from './ChatPanel';

export default function FloatingChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <ChatButton onClick={handleOpen} unreadCount={0} />
            )}

            {/* Chat Panel */}
            {isOpen && (
                <ChatPanel onClose={handleClose} />
            )}
        </>
    );
}