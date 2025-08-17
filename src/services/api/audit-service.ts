import api from "@/services/api/base-api";
import {AuditLog, PageResponse} from "@/types/exam/examEntities";

// Request interfaces
export interface AuditLogSearchParams {
    userId?: string;
    httpMethod?: string;
    resourceType?: string;
    responseStatus?: number;
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

export interface ActivityStatsParams {
    startDate?: string; // ISO date string (YYYY-MM-DD)
    endDate?: string; // ISO date string (YYYY-MM-DD)
}

// Response interfaces
export interface ActivityStatItem {
    resourceType: string;
    httpMethod: string;
    count: number;
}

class AuditService {
    private readonly baseUrl = '/audit';

    async getAuditLogs(params: AuditLogSearchParams = {}): Promise<PageResponse<AuditLog>> {
        const searchParams = new URLSearchParams();

        if (params.userId) searchParams.append('userId', params.userId);
        if (params.httpMethod) searchParams.append('httpMethod', params.httpMethod);
        if (params.resourceType) searchParams.append('resourceType', params.resourceType);
        if (params.responseStatus) searchParams.append('responseStatus', params.responseStatus.toString());
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);
        if (params.page !== undefined) searchParams.append('page', params.page.toString());
        if (params.size !== undefined) searchParams.append('size', params.size.toString());
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortDir) searchParams.append('sortDir', params.sortDir);

        const response = await api.get<PageResponse<AuditLog>>(`${this.baseUrl}?${searchParams}`);
        return response.data;
    }

    async getUserActivities(userId: string, days: number = 7): Promise<AuditLog[]> {
        const response = await api.get<AuditLog[]>(`${this.baseUrl}/user/${userId}?days=${days}`);
        return response.data;
    }

    async getResourceHistory(resourceType: string, resourceId: string): Promise<AuditLog[]> {
        const response = await api.get<AuditLog[]>(`${this.baseUrl}/resource/${resourceType}/${resourceId}`);
        return response.data;
    }

    async getFailedRequests(hours: number = 24): Promise<AuditLog[]> {
        const response = await api.get<AuditLog[]>(`${this.baseUrl}/failed?hours=${hours}`);
        return response.data;
    }

    async getActivityStats(params: ActivityStatsParams = {}): Promise<ActivityStatItem[]> {
        const searchParams = new URLSearchParams();

        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);

        const response = await api.get<ActivityStatItem[]>(`${this.baseUrl}/stats?${searchParams}`);
        return response.data;
    }

    // Convenience methods for common queries
    async getRecentUserActivity(userId: string): Promise<AuditLog[]> {
        return this.getUserActivities(userId, 1); // Last 24 hours
    }

    async getRecentFailures(): Promise<AuditLog[]> {
        return this.getFailedRequests(1); // Last hour
    }

    async getTodayStats(): Promise<ActivityStatItem[]> {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        return this.getActivityStats({
            startDate: today,
            endDate: today
        });
    }

    async getWeeklyStats(): Promise<ActivityStatItem[]> {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        return this.getActivityStats({
            startDate: weekAgo.toISOString().split('T')[0],
            endDate: today.toISOString().split('T')[0]
        });
    }

    async searchAuditLogs(
        searchTerm: string,
        searchType: 'user' | 'resource' | 'method' = 'user',
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<AuditLog>> {
        const params: AuditLogSearchParams = { page, size };

        switch (searchType) {
            case 'user':
                params.userId = searchTerm;
                break;
            case 'resource':
                params.resourceType = searchTerm;
                break;
            case 'method':
                params.httpMethod = searchTerm;
                break;
        }

        return this.getAuditLogs(params);
    }

    async getAuditLogsByDateRange(
        startDate: Date,
        endDate: Date,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<AuditLog>> {
        return this.getAuditLogs({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            page,
            size,
            sortBy: 'timestamp',
            sortDir: 'desc'
        });
    }

    async getAuditLogsByStatus(
        status: number,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<AuditLog>> {
        return this.getAuditLogs({
            responseStatus: status,
            page,
            size,
            sortBy: 'timestamp',
            sortDir: 'desc'
        });
    }
}

export const auditService = new AuditService();