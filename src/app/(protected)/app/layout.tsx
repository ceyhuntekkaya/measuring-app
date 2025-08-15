'use client';

import {useAuth} from '@/hooks/use-auth';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
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

    useEffect(() => {
        if (!loading && (!user || !user.roleSet.includes('USER') )) {
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
                    <Sidebar isOpen={false} onCloseAction={function(): void {
                        throw new Error('Function not implemented.');
                    }} />
                    <div className="flex-1">
                        <Header/>
                        <main className="p-3">
                            <div className="p-1 min-h-[calc(100vh-7rem)]">
                                {children}
                            </div>
                        </main>
                        <Footer/>
                    </div>
                </div>
            </div>
        </ProtectedLayout>
    );
}