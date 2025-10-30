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
        console.log("ceyhun 3")
        console.log(candidate)
        console.log(user)
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
