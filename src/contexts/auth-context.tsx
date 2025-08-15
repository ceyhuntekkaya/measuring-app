'use client';

import {createContext, useState, useEffect, useContext} from 'react';
import {useRouter} from 'next/navigation';
import {User, AuthContextType, Permission, Department} from '@/types/auth';
import {authService} from '@/services/api/auth-service';
import {Brand} from "@/types/brand";


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [error,] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                console.log('AuthContext - Token check:', !!token);
                if (token) {

                    const cookieToken = document.cookie.split(';').find(c => c.trim().startsWith('accessToken='));
                    if (!cookieToken) {
                        document.cookie = `accessToken=${token}; path=/; secure; samesite=strict`;
                    }
                    const userData = await authService.getCurrentUser();
                    setUser(userData);

                    /*

                    const localActiveBrandId = localStorage.getItem('activeBrandId');


                    if (localActiveBrandId) {
                        if (userData.brandSet) {
                            const brand = userData.brandSet.find((brand: Brand) => brand.id === localActiveBrandId);
                            if (brand) {
                                setActiveBrand(brand);
                            } else {
                                setActiveBrand(userData.brandSet[0]);
                            }
                        }


                    } else {
                        setActiveBrand(userData.brandSet[0]);
                    }

                     */

                } else {
                    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    const currentPath = window.location.pathname;
                    if (
                        currentPath !== '/login' &&
                        currentPath !== '/register' &&
                        currentPath !== '/' &&
                        !currentPath.startsWith('/_next') &&
                        !currentPath.startsWith('/api/')
                    ) {
                        console.log('AuthContext - No token, redirecting to login from client');
                        router.replace('/login');
                    }
                }
            } catch (error) {
                console.error('AuthContext - Auth check failed:', error);
                localStorage.removeItem('accessToken');
                document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

                const currentPath = window.location.pathname;
                if (
                    currentPath !== '/login' &&
                    currentPath !== '/register' &&
                    currentPath !== '/' &&
                    !currentPath.startsWith('/_next') &&
                    !currentPath.startsWith('/api/')
                ) {
                    console.log('AuthContext - Auth error, redirecting to login');
                    router.replace('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);


    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await authService.login(username, password);
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            document.cookie = `accessToken=${response.accessToken}; path=/; secure; samesite=strict`;
            setUser(response.user);

            /*

            const localActiveBrandId = localStorage.getItem('activeBrandId');
            if (localActiveBrandId) {
                const brand = response.user.brandSet.find((brand: Brand) => brand.id === localActiveBrandId);
                if (brand) {
                    setActiveBrand(brand);
                } else {
                    setActiveBrand(response.user.brandSet[0]);
                }
            } else {
                setActiveBrand(response.user.brandSet[0]);
            }

             */

            const path = response.user.roleSet.includes('ADMIN') ? '/admin' :
                response.user.roleSet.includes('USER') ? '/admin' :
                    response.user.roleSet.includes('LEARNER') ? '/learner' :
                        response.user.roleSet.includes('INSTRUCTOR') ? '/instructor' :
                            response.user.roleSet.includes('OBSERVER') ? '/observer' :
                                response.user.roleSet.includes('COMPANY') ? '/company' :
                                    '/app';
            router.replace(path);

            return true;
        } catch (err) {
            console.error('Login failed:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };


    const changeActiveBrand = (id: string) => {

        const brand = user?.brandSet.find((brand: Brand) => brand.id === id);
        if (brand) {
            setActiveBrand(brand);
            localStorage.setItem('activeBrandId', brand.id);
            return true;
        }
        return false;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            router.push('/login');
        }
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            setUser({...user, ...userData});
        }
    };

    const refreshToken = async (): Promise<boolean> => {
        try {
            const newAccessToken = await authService.refreshToken();
            if (newAccessToken) {
                localStorage.setItem('accessToken', newAccessToken);
                document.cookie = `accessToken=${newAccessToken}; path=/`;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    };

    const hasPermission = (permission: Permission) => {
        return user?.authoritySet.includes(permission) ?? false;
    };

    const hasAnyDepartment = (departments: Department[]) => {
        return departments.some(dept => user?.departmentSet.includes(dept));
    };


    const getPathByRole = (): string => {
        if (user?.roleSet.includes('ADMIN')) return '/admin';
        if (user?.roleSet.includes('USER')) return '/app';
        if (user?.roleSet.includes('LEARNER')) return '/learner';
        if (user?.roleSet.includes('OBSERVER')) return '/observer';
        if (user?.roleSet.includes('INSTRUCTOR')) return '/instructor';
        if (user?.roleSet.includes('COMPANY')) return '/company';
        return '/app';
    };

    const value: AuthContextType = {
        user,
        loading,
        error,
        login,
        logout,
        updateUser,
        refreshToken,
        hasPermission,
        hasAnyDepartment,
        getPathByRole,
        isAuthenticated: !!user,
        activeBrand,
        changeActiveBrand
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex h-screen w-screen items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}