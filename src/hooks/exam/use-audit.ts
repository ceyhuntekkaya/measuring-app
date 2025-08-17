import { useState, useCallback } from 'react';
import {
    AuditLogSearchParams,
    ActivityStatsParams,
    ActivityStatItem,
    auditService
} from '@/services/api/audit-service';
import { showNotification } from '@/lib/notification';
import {AuditLog, PageResponse} from "@/types/exam/examEntities";

interface UseAuditReturn {
    auditLogs: PageResponse<AuditLog> | null;
    userActivities: AuditLog[];
    resourceHistory: AuditLog[];
    failedRequests: AuditLog[];
    activityStats: ActivityStatItem[];
    loading: boolean;
    error: Error | null;
    getAuditLogs: (params?: AuditLogSearchParams) => Promise<void>;
    getUserActivities: (userId: string, days?: number) => Promise<void>;
    getResourceHistory: (resourceType: string, resourceId: string) => Promise<void>;
    getFailedRequests: (hours?: number) => Promise<void>;
    getActivityStats: (params?: ActivityStatsParams) => Promise<void>;
    getRecentUserActivity: (userId: string) => Promise<void>;
    getRecentFailures: () => Promise<void>;
    getTodayStats: () => Promise<void>;
    getWeeklyStats: () => Promise<void>;
    searchAuditLogs: (searchTerm: string, searchType?: 'user' | 'resource' | 'method', page?: number, size?: number) => Promise<void>;
    getAuditLogsByDateRange: (startDate: Date, endDate: Date, page?: number, size?: number) => Promise<void>;
    getAuditLogsByStatus: (status: number, page?: number, size?: number) => Promise<void>;
    clearAuditData: () => void;
}

export const useAudit = (): UseAuditReturn => {
    const [auditLogs, setAuditLogs] = useState<PageResponse<AuditLog> | null>(null);
    const [userActivities, setUserActivities] = useState<AuditLog[]>([]);
    const [resourceHistory, setResourceHistory] = useState<AuditLog[]>([]);
    const [failedRequests, setFailedRequests] = useState<AuditLog[]>([]);
    const [activityStats, setActivityStats] = useState<ActivityStatItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getAuditLogs = useCallback(async (params: AuditLogSearchParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getAuditLogs(params);
            setAuditLogs(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Denetim kayıtları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserActivities = useCallback(async (userId: string, days: number = 7) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getUserActivities(userId, days);
            setUserActivities(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcı aktiviteleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getResourceHistory = useCallback(async (resourceType: string, resourceId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getResourceHistory(resourceType, resourceId);
            setResourceHistory(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kaynak geçmişi alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getFailedRequests = useCallback(async (hours: number = 24) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getFailedRequests(hours);
            setFailedRequests(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başarısız istekler alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getActivityStats = useCallback(async (params: ActivityStatsParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getActivityStats(params);
            setActivityStats(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aktivite istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getRecentUserActivity = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getRecentUserActivity(userId);
            setUserActivities(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Son kullanıcı aktiviteleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getRecentFailures = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getRecentFailures();
            setFailedRequests(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Son başarısızlıklar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTodayStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getTodayStats();
            setActivityStats(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Günlük istatistikler alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getWeeklyStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getWeeklyStats();
            setActivityStats(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Haftalık istatistikler alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchAuditLogs = useCallback(async (
        searchTerm: string,
        searchType: 'user' | 'resource' | 'method' = 'user',
        page: number = 0,
        size: number = 20
    ) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.searchAuditLogs(searchTerm, searchType, page, size);
            setAuditLogs(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Denetim kayıtları aranırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAuditLogsByDateRange = useCallback(async (
        startDate: Date,
        endDate: Date,
        page: number = 0,
        size: number = 20
    ) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getAuditLogsByDateRange(startDate, endDate, page, size);
            setAuditLogs(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Tarih aralığı kayıtları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAuditLogsByStatus = useCallback(async (
        status: number,
        page: number = 0,
        size: number = 20
    ) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getAuditLogsByStatus(status, page, size);
            setAuditLogs(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Durum koduna göre kayıtlar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearAuditData = useCallback(() => {
        setAuditLogs(null);
        setUserActivities([]);
        setResourceHistory([]);
        setFailedRequests([]);
        setActivityStats([]);
        setError(null);
    }, []);

    return {
        auditLogs,
        userActivities,
        resourceHistory,
        failedRequests,
        activityStats,
        loading,
        error,
        getAuditLogs,
        getUserActivities,
        getResourceHistory,
        getFailedRequests,
        getActivityStats,
        getRecentUserActivity,
        getRecentFailures,
        getTodayStats,
        getWeeklyStats,
        searchAuditLogs,
        getAuditLogsByDateRange,
        getAuditLogsByStatus,
        clearAuditData
    };
};