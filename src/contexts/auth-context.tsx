'use client';

import {createContext, useState, useEffect, useContext} from 'react';
import {useRouter} from 'next/navigation';
import {User, AuthContextType, Permission, Department} from '@/types/auth';
import type {ApplicationDto} from "@/api/generated/model/applicationDto";
import type {CandidateDto} from "@/api/generated/model/candidateDto";
import type {ExamDto} from "@/api/generated/model/examDto";
import type {ExamSessionDto} from "@/api/generated/model/examSessionDto";
import type {BrandDto} from "@/api/generated/model";
import type {AuthenticationResponse, AuthenticationLearnerResponse} from "@/api/generated/model";
import type {EvaluationDto} from "@/api/generated/model";
import {
    login,
    logout,
    getCurrentUser,
    refreshToken as refreshTokenApi,
    examCandidateAndSessionCode,
} from '@/api/generated/authentication/authentication';

import type { RefreshTokenResponse } from '@/types/auth';



export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [error,] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [activeBrand, setActiveBrand] = useState<BrandDto | null>(null);
    const [loading, setLoading] = useState(true);




    const [candidate, setCandidate] = useState<CandidateDto | null>(null);
    const [application, setApplication] = useState<ApplicationDto | null>(null);
    const [examSession, setExamSession] = useState<ExamSessionDto | null>(null);
    const [exam, setExam] = useState<ExamDto | null>(null);
    const [evaluations, setEvaluations] = useState<EvaluationDto[] | null>(null);


    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const AUTH_CHECK_TIMEOUT_MS = 20000; // 20 seconds - learner /auth/me can be slow (exam session, evaluations)
            let timeoutId: ReturnType<typeof setTimeout> | undefined;

            const timeoutPromise = new Promise<never>((_, reject) => {
                timeoutId = setTimeout(() => {
                    reject(new Error('Authentication check timeout'));
                }, AUTH_CHECK_TIMEOUT_MS);
            });

            try {
                const token = localStorage.getItem('accessToken');
                if (token) {

                    const cookieToken = document.cookie.split(';').find(c => c.trim().startsWith('accessToken='));
                    if (!cookieToken) {
                        document.cookie = `accessToken=${token}; path=/; secure; samesite=strict`;
                    }
                    
                    const response = (await Promise.race([
                        getCurrentUser(),
                        timeoutPromise
                    ])) as unknown as RefreshTokenResponse | { data: RefreshTokenResponse; success: boolean; message?: string };
                    if (timeoutId !== undefined) clearTimeout(timeoutId);
                    
                    // customInstance zaten data'yı unwrap ediyor (.then(({ data }) => data))
                    // Backend ApiResponse<RefreshTokenResponse> döndürüyorsa, customInstance direkt RefreshTokenResponse'u döndürür
                    // Ama backend direkt RefreshTokenResponse döndürüyorsa, o zaman response zaten RefreshTokenResponse
                    // Her iki durumu da handle ediyoruz
                    let userData: RefreshTokenResponse;
                    
                    // Eğer response ApiResponse formatındaysa (success, data, message property'leri varsa)
                    if (response && typeof response === 'object' && 'data' in response && 'success' in response) {
                        const apiResponse = response as { data: RefreshTokenResponse; success: boolean; message?: string };
                        userData = apiResponse.data as RefreshTokenResponse;
                    } else {
                        // Direkt RefreshTokenResponse döndürülüyorsa
                        userData = response as unknown as RefreshTokenResponse;
                    }

                    if (!userData || !userData.user) {
                        throw new Error('Kullanıcı bilgisi alınamadı');
                    }

                    if(userData.user && 'role' in userData.user && (userData.user as { role?: string }).role === "LEARNER"){
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
                        router.replace('/login');
                    }
                }
            } catch (err) {
                if (timeoutId !== undefined) clearTimeout(timeoutId);
                const isTimeout = err instanceof Error && err.message === 'Authentication check timeout';
                console.error('AuthContext - Auth check failed:', err);
                if (isTimeout) {
                    console.warn('Auth check timed out - backend /auth/me may be slow or unreachable. Redirecting to login.');
                }
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
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
                    router.replace('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);


    const loginHandler = async (username: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await login({ username, password });
            const apiResponse = response as unknown as { data?: AuthenticationResponse } & AuthenticationResponse;
            const authData = apiResponse?.data || apiResponse;
            
            if (authData.accessToken) {
                localStorage.setItem('accessToken', authData.accessToken);
                if (authData.refreshToken) {
                    localStorage.setItem('refreshToken', authData.refreshToken);
                }
                document.cookie = `accessToken=${authData.accessToken}; path=/; secure; samesite=strict`;
                if (authData.user) {
                    setUser(authData.user as unknown as User);
                    const path = authData.user.roleSet?.includes('ADMIN') ? '/admin' :
                        authData.user.roleSet?.includes('LEARNER') ? '/learner' :
                            '/app';
                    router.replace(path);
                }
            }

            return true;
        } catch (err) {
            console.error('Login failed:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };


    const changeActiveBrand = (id: string) => {

        const brand = user?.brandSet?.find((brand: BrandDto) => brand.id === id);
        if (brand && brand.id) {
            setActiveBrand(brand);
            localStorage.setItem('activeBrandId', brand.id);
            return true;
        }
        return false;
    };

    const logoutHandler = async () => {
        try {
            await logout();
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
            const refreshTokenValue = localStorage.getItem('refreshToken');
            if (!refreshTokenValue) return false;
            
            const response = await refreshTokenApi(undefined, undefined);
            const apiResponse = response as unknown as { data?: AuthenticationResponse } & AuthenticationResponse;
            const tokenData = apiResponse?.data || apiResponse;
            
            if (tokenData.accessToken) {
                localStorage.setItem('accessToken', tokenData.accessToken);
                document.cookie = `accessToken=${tokenData.accessToken}; path=/`;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    };

    const hasPermission = (permission: Permission) => {
        return user?.authoritySet?.includes(permission) ?? false;
    };

    const hasAnyDepartment = (departments: Department[]) => {
        return departments.some(dept => user?.departmentSet?.includes(dept));
    };








    const examLogin = async (examCode: string): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await examCandidateAndSessionCode({ examCandidateAndSessionCode: examCode });
            const apiResponse = response as unknown as { data?: AuthenticationLearnerResponse } & AuthenticationLearnerResponse;
            const authData = apiResponse?.data || apiResponse;
            
            if (authData.accessToken) {
                localStorage.setItem('accessToken', authData.accessToken);
                if (authData.refreshToken) {
                    localStorage.setItem('refreshToken', authData.refreshToken);
                }
                document.cookie = `accessToken=${authData.accessToken}; path=/; secure; samesite=strict`;

                if (authData.user) {
                    setCandidate(authData.user as CandidateDto);
                }
                if (authData.examSession) {
                    setExamSession(authData.examSession);
                }
                if (authData.exam) {
                    setExam(authData.exam);
                }
                if (authData.evaluations) {
                    setEvaluations(authData.evaluations);
                }
                if (authData.application) {
                    setApplication(authData.application);
                }
                router.replace('/learner');
            }
            return true;
        } catch (err) {
            console.error('Login failed:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };


    const getPathByRole = (): string => {
        if (user?.roleSet?.includes('LEARNER')) return '/learner';
        if (user?.roleSet?.includes('ADMIN')) return '/admin';
        if (user?.roleSet?.includes('USER')) return '/app';
        if (user?.roleSet?.includes('MANAGER')) return '/app';
        if (user?.roleSet?.includes('WRITER')) return '/app';
        if (user?.roleSet?.includes('REFEREE')) return '/app';
        if (user?.roleSet?.includes('OBSERVER')) return '/app';
        return '/app';
    };

    const value: AuthContextType = {
        user,
        loading,
        error,
        login: loginHandler,
        examLogin,
        logout: logoutHandler,
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