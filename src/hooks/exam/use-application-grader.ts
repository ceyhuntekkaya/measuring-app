import { useState, useCallback } from 'react';

import {
    ApplicationGraderDto,
    CreateApplicationGraderRequest,
    UpdateApplicationGraderRequest,
    GraderStatistics,
    ApplicationGradingSummary,
    GraderWorkload,
    GraderSearchParams
} from '@/types/management/brand';
import { showNotification } from '@/lib/notification';
import {applicationGraderService} from "@/services/api/management/application-grader-service";

interface UseApplicationGraderReturn {
    applicationGraders: ApplicationGraderDto[] | null;
    gradersByApplication: ApplicationGraderDto[] | null;
    applicationsByGrader: ApplicationGraderDto[] | null;
    refereeGraders: ApplicationGraderDto[] | null;
    graderStatistics: GraderStatistics | null;
    applicationGradingSummary: ApplicationGradingSummary | null;
    graderWorkload: GraderWorkload | null;
    loading: boolean;
    error: Error | null;
    assignGraderToApplication: (createRequest: CreateApplicationGraderRequest) => Promise<void>;
    updateGraderAssignment: (id: string, updateRequest: UpdateApplicationGraderRequest) => Promise<void>;
    completeGrading: (id: string) => Promise<void>;
    getGradersByApplication: (applicationId: string) => Promise<void>;
    getApplicationsByGrader: (userId: string) => Promise<void>;
    getRefereeGradersByApplication: (applicationId: string) => Promise<void>;
    removeGraderFromApplication: (id: string) => Promise<void>;
    bulkAssignGraders: (applicationId: string, assignmentRequests: CreateApplicationGraderRequest[]) => Promise<void>;
    getGraderStatistics: (applicationId: string) => Promise<void>;
    getApplicationGradingSummary: (applicationId: string) => Promise<void>;
    getGraderWorkload: (userId: string) => Promise<void>;
    searchGraderAssignments: (searchParams?: GraderSearchParams) => Promise<void>;
    assignSingleGrader: (userId: string, applicationId: string, orderNumber: number, isReferee?: boolean, endEndDate?: string) => Promise<void>;
    assignMultipleGraders: (applicationId: string, graderAssignments: Array<{userId: string; orderNumber: number; isReferee?: boolean; endEndDate?: string;}>) => Promise<void>;
    assignRefereeGrader: (userId: string, applicationId: string, orderNumber: number, endEndDate?: string) => Promise<void>;
    getCompletedGradersForApplication: (applicationId: string) => Promise<void>;
    getPendingGradersForApplication: (applicationId: string) => Promise<void>;
    getCompletedAssignmentsForGrader: (userId: string) => Promise<void>;
    getPendingAssignmentsForGrader: (userId: string) => Promise<void>;
    getRefereeAssignmentsForGrader: (userId: string) => Promise<void>;
    completeMultipleGradings: (graderIds: string[]) => Promise<void>;
    removeMultipleGraders: (graderIds: string[]) => Promise<void>;
    getApplicationGradingProgress: (applicationId: string) => Promise<void>;
    getGraderPerformanceData: (userId: string) => Promise<void>;
    clearApplicationGraderData: () => void;
}

export const useApplicationGrader = (): UseApplicationGraderReturn => {
    const [applicationGraders, setApplicationGraders] = useState<ApplicationGraderDto[] | null>(null);
    const [gradersByApplication, setGradersByApplication] = useState<ApplicationGraderDto[] | null>(null);
    const [applicationsByGrader, setApplicationsByGrader] = useState<ApplicationGraderDto[] | null>(null);
    const [refereeGraders, setRefereeGraders] = useState<ApplicationGraderDto[] | null>(null);
    const [graderStatistics, setGraderStatistics] = useState<GraderStatistics | null>(null);
    const [applicationGradingSummary, setApplicationGradingSummary] = useState<ApplicationGradingSummary | null>(null);
    const [graderWorkload, setGraderWorkload] = useState<GraderWorkload | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const assignGraderToApplication = useCallback(async (createRequest: CreateApplicationGraderRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.assignGraderToApplication(createRequest);
            if (response.data && response.success) {
                showNotification.success('Değerlendirici başarıyla atandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Değerlendirici atanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateGraderAssignment = useCallback(async (id: string, updateRequest: UpdateApplicationGraderRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.updateGraderAssignment(id, updateRequest);
            if (response.data && response.success) {
                showNotification.success('Değerlendirici ataması başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Değerlendirici ataması güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const completeGrading = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.completeGrading(id);
            if (response.data && response.success) {
                showNotification.success('Değerlendirme başarıyla tamamlandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Değerlendirme tamamlanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getGradersByApplication = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getGradersByApplication(applicationId);
            if (response.data && response.success) {
                setGradersByApplication(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başvuru değerlendiricileri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationsByGrader = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getApplicationsByGrader(userId);
            if (response.data && response.success) {
                setApplicationsByGrader(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Değerlendirici başvuruları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getRefereeGradersByApplication = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getRefereeGradersByApplication(applicationId);
            if (response.data && response.success) {
                setRefereeGraders(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Hakem değerlendiriciler alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const removeGraderFromApplication = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.removeGraderFromApplication(id);
            if (response.success) {
                showNotification.success('Değerlendirici başarıyla kaldırıldı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Değerlendirici kaldırılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkAssignGraders = useCallback(async (applicationId: string, assignmentRequests: CreateApplicationGraderRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.bulkAssignGraders(applicationId, assignmentRequests);
            if (response.data && response.success) {
                setApplicationGraders(response.data);
                showNotification.success('Değerlendiriciler başarıyla toplu atandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Değerlendiriciler toplu atanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getGraderStatistics = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getGraderStatistics(applicationId);
            if (response.data && response.success) {
                setGraderStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Değerlendirici istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationGradingSummary = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getApplicationGradingSummary(applicationId);
            if (response.data && response.success) {
                setApplicationGradingSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başvuru değerlendirme özeti alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getGraderWorkload = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getGraderWorkload(userId);
            if (response.data && response.success) {
                setGraderWorkload(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Değerlendirici iş yükü alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchGraderAssignments = useCallback(async (searchParams: GraderSearchParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.searchGraderAssignments(searchParams);
            if (response.data && response.success) {
                setApplicationGraders(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Değerlendirici atamaları aranırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const assignSingleGrader = useCallback(async (
        userId: string,
        applicationId: string,
        orderNumber: number,
        isReferee: boolean = false,
        endEndDate?: string
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.assignSingleGrader(
                userId, applicationId, orderNumber, isReferee, endEndDate
            );
            if (response.data && response.success) {
                showNotification.success('Değerlendirici başarıyla atandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Değerlendirici atanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const assignMultipleGraders = useCallback(async (
        applicationId: string,
        graderAssignments: Array<{
            userId: string;
            orderNumber: number;
            isReferee?: boolean;
            endEndDate?: string;
        }>
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.assignMultipleGraders(applicationId, graderAssignments);
            if (response.data && response.success) {
                setApplicationGraders(response.data);
                showNotification.success('Çoklu değerlendiriciler başarıyla atandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Çoklu değerlendiriciler atanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const assignRefereeGrader = useCallback(async (
        userId: string,
        applicationId: string,
        orderNumber: number,
        endEndDate?: string
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.assignRefereeGrader(
                userId, applicationId, orderNumber, endEndDate
            );
            if (response.data && response.success) {
                showNotification.success('Hakem değerlendirici başarıyla atandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Hakem değerlendirici atanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCompletedGradersForApplication = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getCompletedGradersForApplication(applicationId);
            if (response.data && response.success) {
                setApplicationGraders(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Tamamlanan değerlendiriciler alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getPendingGradersForApplication = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getPendingGradersForApplication(applicationId);
            if (response.data && response.success) {
                setApplicationGraders(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bekleyen değerlendiriciler alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCompletedAssignmentsForGrader = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getCompletedAssignmentsForGrader(userId);
            if (response.data && response.success) {
                setApplicationsByGrader(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Tamamlanan atamalar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getPendingAssignmentsForGrader = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getPendingAssignmentsForGrader(userId);
            if (response.data && response.success) {
                setApplicationsByGrader(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bekleyen atamalar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getRefereeAssignmentsForGrader = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getRefereeAssignmentsForGrader(userId);
            if (response.data && response.success) {
                setRefereeGraders(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Hakem atamaları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const completeMultipleGradings = useCallback(async (graderIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            await applicationGraderService.completeMultipleGradings(graderIds);
            showNotification.success('Çoklu değerlendirmeler başarıyla tamamlandı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Çoklu değerlendirmeler tamamlanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const removeMultipleGraders = useCallback(async (graderIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            await applicationGraderService.removeMultipleGraders(graderIds);
            showNotification.success('Çoklu değerlendiriciler başarıyla kaldırıldı!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Çoklu değerlendiriciler kaldırılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationGradingProgress = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const result = await applicationGraderService.getApplicationGradingProgress(applicationId);

            if (result.statistics.data && result.statistics.success) {
                setGraderStatistics(result.statistics.data);
            }
            if (result.summary.data && result.summary.success) {
                setApplicationGradingSummary(result.summary.data);
            }
            if (result.allGraders.data && result.allGraders.success) {
                setGradersByApplication(result.allGraders.data);
            }
            if (result.referees.data && result.referees.success) {
                setRefereeGraders(result.referees.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başvuru değerlendirme ilerlemesi alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getGraderPerformanceData = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const result = await applicationGraderService.getGraderPerformanceData(userId);

            if (result.workload.data && result.workload.success) {
                setGraderWorkload(result.workload.data);
            }
            if (result.allAssignments.data && result.allAssignments.success) {
                setApplicationsByGrader(result.allAssignments.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Değerlendirici performans verileri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearApplicationGraderData = useCallback(() => {
        setApplicationGraders(null);
        setGradersByApplication(null);
        setApplicationsByGrader(null);
        setRefereeGraders(null);
        setGraderStatistics(null);
        setApplicationGradingSummary(null);
        setGraderWorkload(null);
        setError(null);
    }, []);

    return {
        applicationGraders,
        gradersByApplication,
        applicationsByGrader,
        refereeGraders,
        graderStatistics,
        applicationGradingSummary,
        graderWorkload,
        loading,
        error,
        assignGraderToApplication,
        updateGraderAssignment,
        completeGrading,
        getGradersByApplication,
        getApplicationsByGrader,
        getRefereeGradersByApplication,
        removeGraderFromApplication,
        bulkAssignGraders,
        getGraderStatistics,
        getApplicationGradingSummary,
        getGraderWorkload,
        searchGraderAssignments,
        assignSingleGrader,
        assignMultipleGraders,
        assignRefereeGrader,
        getCompletedGradersForApplication,
        getPendingGradersForApplication,
        getCompletedAssignmentsForGrader,
        getPendingAssignmentsForGrader,
        getRefereeAssignmentsForGrader,
        completeMultipleGradings,
        removeMultipleGraders,
        getApplicationGradingProgress,
        getGraderPerformanceData,
        clearApplicationGraderData
    };
};