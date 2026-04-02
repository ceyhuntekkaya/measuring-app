'use client';

import FloatingChatWidget from '@/components/learner/chat/FloatingChatWidget';

export default function ExamLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div>
            {children}
            <FloatingChatWidget />
        </div>
    );
}