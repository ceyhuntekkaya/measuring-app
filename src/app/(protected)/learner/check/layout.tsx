'use client';

import FloatingChatWidget from '@/components/learner/chat/FloatingChatWidget';
import {useExamApplicationContext} from "@/contexts/ExamApplicationContext";
import {useAuth} from "@/hooks/use-auth";
import {useExamWebSocket} from "@/hooks/useExamWebSocket";
import {showNotification} from "@/lib/notification";

export default function ExamLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const {examSession} = useExamApplicationContext();
    const {candidate} = useAuth();
    
    // WebSocket bağlantısı - Katılımcı için
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const userName = candidate ? `${candidate.name || ''} ${candidate.lastName || ''}`.trim() : '';
    
    useExamWebSocket({
        sessionId: examSession?.id || '',
        userRole: 'LEARNER',
        token: token || '',
        userName: userName,
        autoConnect: !!examSession?.id && !!token,
        onConnectionEvent: (event) => {
            if (event.eventType === 'CONNECTED') {
                showNotification.info(`${event.userName} odaya katıldı`);
            } else if (event.eventType === 'DISCONNECTED') {
                showNotification.info(`${event.userName} odadan ayrıldı`);
            }
        }
    });

    return (
        <div>
            {children}
            <FloatingChatWidget />
        </div>
    );
}