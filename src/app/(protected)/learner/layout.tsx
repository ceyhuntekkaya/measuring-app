'use client';
import {useAuth} from '@/hooks/use-auth';


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

            <div className='min-h-screen bg-gray-100'>
                {children}
            </div>

    );
}