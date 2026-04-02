'use client';
import {useAuth} from '@/hooks/use-auth';
import ProtectedLayout from '@/components/layout/protected-layout';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import Footer from '@/components/layout/footer';
import {ExamApplicationProvider} from "@/contexts/ExamApplicationContext";
import {useState, useCallback} from 'react';

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const {user} = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarClose = useCallback(() => {
        setIsSidebarOpen(false);
    }, []);

    if (!user || !user.roleSet?.includes('ADMIN')) {
        return null;
    }

    return (
        <ProtectedLayout requiredRole={['ADMIN', 'USER']}>
            <ExamApplicationProvider>
                <div className='min-h-screen bg-gray-100'>
                    <div className='flex min-h-screen '>
                        <Sidebar isOpen={isSidebarOpen} onCloseAction={handleSidebarClose}/>
                        <div className='flex-1'>
                            <Header/>
                            <main className='relative z-10 p-3'>
                                <div className='p-1 min-h-[calc(100vh-7rem)] bg-white rounded-lg shadow-md'>
                                    {children}
                                </div>
                            </main>
                            <div className="relative z-0">
                                <Footer/>
                            </div>
                        </div>
                    </div>
                </div>
            </ExamApplicationProvider>
        </ProtectedLayout>
    );
}