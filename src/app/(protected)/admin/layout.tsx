'use client';
import {useAuth} from '@/hooks/use-auth';
import ProtectedLayout from '@/components/layout/protected-layout';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import Footer from '@/components/layout/footer';

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const {user} = useAuth();

    if (!user || !user.roleSet.includes('ADMIN')) {
        return null;

    }

    return (
        <ProtectedLayout requiredRole={['ADMIN', 'USER']}>
            <div className='min-h-screen bg-gray-100'>
                <div className='flex min-h-screen '>
                    <Sidebar isOpen={false} onCloseAction={function (): void {
                        throw new Error('Function not implemented.');
                    }}/>
                    <div className='flex-1'>
                        <Header/>
                        <main className='p-3'>
                            <div className='p-1 min-h-[calc(100vh-7rem)] bg-white rounded-lg shadow-md'>
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