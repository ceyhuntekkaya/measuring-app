import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/auth-context';
import { Role } from '@/types/auth';


export function useRequireAuth(requiredRoles: Role[] = []) {
    const { user, loading, isAuthenticated } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!isAuthenticated) {
            router.replace(`/login?redirectTo=${window.location.pathname}`);
            return;
        }
        if (
            requiredRoles.length > 0 &&
            !requiredRoles.some(role => user?.roleSet.includes(role))
        ) {
            router.replace(user ? `/app` : '/login');
        }
    }, [loading, isAuthenticated, user, router, requiredRoles]);

    return { user, loading, isAuthenticated };
}