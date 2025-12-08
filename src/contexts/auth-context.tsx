'use client';

import {createContext, useState, useEffect, useContext} from 'react';
import {useRouter} from 'next/navigation';
import {User, AuthContextType, Permission, Department} from '@/types/auth';
import {authService} from '@/services/api/auth-service';
import {ApplicationDto, Brand, CandidateDto} from "@/types/management/brand";
import {EvaluationDto, ExamDto, ExamSessionDto} from "@/types/exam/examEntities";


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [error,] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [activeBrand, setActiveBrand] = useState<Brand | null>(null);
    const [loading, setLoading] = useState(true);




    const [candidate, setCandidate] = useState<CandidateDto | null>(null);
    const [application, setApplication] = useState<ApplicationDto | null>(null);
    const [examSession, setExamSession] = useState<ExamSessionDto | null>(null);
    const [exam, setExam] = useState<ExamDto | null>(null);
    const [evaluations, setEvaluations] = useState<EvaluationDto[] | null>(null);


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

                    if(userData && userData.user && userData.user.role && userData.user.role === "LEARNER"){
                        setCandidate(userData.user as CandidateDto);
                        setExamSession(userData.examSession ? userData.examSession : null);
                        setExam(userData.exam ? userData.exam : null);
                        setEvaluations(userData.evaluations ? userData.evaluations : null);
                        setApplication(userData.application ? userData.application : null);

                    }else{
                        setUser(userData.user as User);
                    }




                } else {
                    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                    const currentPath = window.location.pathname;
                    if (
                        currentPath !== '/login' &&
                        currentPath !== '/register' &&

                        currentPath !== '/about' &&
                        currentPath !== '/exam' &&
                        !currentPath.startsWith('/exam') &&

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
                    currentPath !== '/about' &&
                    currentPath !== '/exam' &&
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
            router.push('/');
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








    const examLogin = async (examCode: string): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await authService.examLogin(examCode);
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            document.cookie = `accessToken=${response.accessToken}; path=/; secure; samesite=strict`;

            setCandidate(response.user);
            setExamSession(response.examSession);
            setExam(response.exam);
            setEvaluations(response.evaluations);
            setApplication(response.application)
            router.replace('/learner');
            return true;
        } catch (err) {
            console.error('Login failed:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };


    const getPathByRole = (): string => {
        if (user?.role && user?.role === "LEARNER") return '/learner';
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
        examLogin,
        logout,
        updateUser,
        refreshToken,
        hasPermission,
        hasAnyDepartment,
        getPathByRole,
        isAuthenticated: !!user,
        activeBrand,
        changeActiveBrand,
        candidate,
        examSession,
        exam,
        application,
        evaluations
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