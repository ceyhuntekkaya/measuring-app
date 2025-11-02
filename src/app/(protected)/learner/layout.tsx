'use client';
import {useAuth} from '@/hooks/use-auth';
import {ExamApplicationProvider} from "@/contexts/ExamApplicationContext";


export default function AdminLayout({
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
            <div className='min-h-screen bg-gray-100'>
                {children}
            </div>
        </ExamApplicationProvider>

    );
}
