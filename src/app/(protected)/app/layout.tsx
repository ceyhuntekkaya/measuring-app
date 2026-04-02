'use client';

import {useAuth} from '@/hooks/use-auth';
import {useRouter} from 'next/navigation';
import {useEffect, useState, useCallback} from 'react';
import ProtectedLayout from "@/components/layout/protected-layout";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";


export default function AppLayout({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    const {user, loading} = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarClose = useCallback(() => {
        setIsSidebarOpen(false);
    }, []);

    useEffect(() => {
        if (!loading && (!user || !user.roleSet?.includes('USER') )) {
        router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ProtectedLayout requiredRole={['ADMIN', 'USER']}>
            <div className="min-h-screen bg-gray-100">
                <div className="flex min-h-screen">
                    <Sidebar isOpen={isSidebarOpen} onCloseAction={handleSidebarClose} />
                    <div className="flex-1">
                        <Header/>
                        <main className="relative z-10 p-3">
                            <div className="p-1 min-h-[calc(100vh-7rem)]">
                                {children}
                            </div>
                        </main>
                        <div className="relative z-0">
                            <Footer/>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
}