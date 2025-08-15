// components/hoc/withAuth.tsx
import { useAuthContext } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Role } from '@/types/auth';

interface WithAuthProps {
    requiredRoles?: Role[];
}

export default function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    { requiredRoles = [] }: WithAuthProps = {}
) {
    const WithAuthWrapper: React.FC<P> = (props) => {
        const { user, loading, isAuthenticated } = useAuthContext();
        const router = useRouter();

        useEffect(() => {
            // Eğer yüklenme tamamlanmışsa ve kullanıcı yoksa
            if (!loading && !isAuthenticated) {
                console.log('WithAuth - Not authenticated, redirecting to login');
                router.replace(`/login?redirectTo=${window.location.pathname}`);
                return;
            }

            // Eğer belirli roller gerekiyorsa ve kullanıcının o rolleri yoksa
            if (
                !loading &&
                isAuthenticated &&
                requiredRoles.length > 0 &&
                !requiredRoles.some(role => user?.roleSet.includes(role))
            ) {
                console.log('WithAuth - User lacks required roles, redirecting to proper page');
                router.replace(user ? `/app` : '/login');
            }
        }, [loading, isAuthenticated, user, router]);

        // Yükleme durumunda loading göster
        if (loading) {
            return (
                <div className="flex h-screen w-screen items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            );
        }

        // Kimlik doğrulaması yoksa veya yükleme devam ediyorsa hiçbir şey gösterme
        if (!isAuthenticated) {
            return null;
        }

        // Rol kontrolü varsa ve gereken roller yoksa
        if (
            requiredRoles.length > 0 &&
            !requiredRoles.some(role => user?.roleSet.includes(role))
        ) {
            return null;
        }

        // Her şey yolundaysa komponenti göster
        return <WrappedComponent {...props} />;
    };

    // displayName'i ayarla
    WithAuthWrapper.displayName = `withAuth(${
        WrappedComponent.displayName || WrappedComponent.name || 'Component'
    })`;

    return WithAuthWrapper;
}