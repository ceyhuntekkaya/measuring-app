'use client';
import {useAuth} from '@/hooks/use-auth';
import {ExamApplicationProvider} from "@/contexts/ExamApplicationContext";
import { WebSocketProvider } from '@/contexts/WebSocketContext';

export default function LearnerLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const {user, candidate} = useAuth();

    if (!candidate && !user) {
        return null;
    }

    return (
        <ExamApplicationProvider>
            <WebSocketProvider>
            <div className='min-h-screen bg-gray-100'>
                {children}
            </div>
            </WebSocketProvider>
        </ExamApplicationProvider>

    );
}
