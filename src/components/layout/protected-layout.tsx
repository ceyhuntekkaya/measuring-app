'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/auth-context';
import LoadingSpinner from '@/components/ui/loading-spinner';
import {Permission, Role} from '@/types/auth';

interface ProtectedLayoutProps {
    children: ReactNode;
    requiredRole?: Role[];
    requiredPermissions?: Permission[];
}

export default function ProtectedLayout({
                                            children,
                                            requiredRole = [],
                                            requiredPermissions = [],
                                        }: ProtectedLayoutProps) {
    const { user, loading } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push(`/login?from=${encodeURIComponent(pathname)}`);
            return;
        }

        if (user && requiredRole && !user.roleSet.some(role=> requiredRole.includes(role))) {
            router.push('/unauthorized');
            return;
        }

        if (
            user &&
            requiredPermissions.length > 0 &&
            !user.authoritySet.some(permission=> requiredPermissions.includes(permission)
            )
        ) {
            router.push('/unauthorized');
            return;
        }
    }, [user, loading, requiredRole, requiredPermissions, router, pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user || (requiredRole && !user.roleSet.some(role=> requiredRole.includes(role)))) {
        return null;
    }

    return <>{children}</>;
}