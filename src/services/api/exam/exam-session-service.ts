
import api from "@/services/api/base-api";
import { EExamType } from "@/types/exam/enum";
import { ExamSessionDto } from "@/types/exam/examEntities";
import {ApiResponse} from "@/types/exam/examValidationAndAnalytics";

// Request DTOs
export interface CreateExamSessionRequest {
    name: string;
    branchId: string;
    brandId: string;
    examTemplate: EExamType;
    startDate: string;
    endDate?: string;
    capacity?: number;
    description?: string;
}

export interface UpdateExamSessionRequest {
    name?: string;
    startDate?: string;
    endDate?: string;
    capacity?: number;
    description?: string;
}

export interface ExamSessionSearchRequest {
    name?: string;
    branchId?: string;
    brandId?: string;
    examTemplate?: EExamType;
    startDateFrom?: string;
    startDateTo?: string;
    status?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
}

export interface CopySessionRequest {
    newName: string;
    newStartDate: string;
}

export interface UpdateStatusRequest {
    newStatus: string;
    reason?: string;
}

// Response DTOs
export interface ExamSessionListResponse {
    examSessions: ExamSessionDto[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
}

export interface ExamSessionStatistics {
    sessionId: string;
    totalApplications: number;
    approvedApplications: number;
    pendingApplications: number;
    rejectedApplications: number;
    capacityUtilization: number;
    averageScore?: number;
}

export interface SessionDashboard {
    totalSessions: number;
    upcomingSessions: number;
    activeSessions: number;
    completedSessions: number;
    totalApplications: number;
    approvedApplications: number;
    pendingApplications: number;
    averageCapacity: number;
}

export interface SessionApplicationDto {
    applicationId: string;
    applicantName: string;
    applicantEmail: string;
    status: string;
    appliedAt: string;
    notes?: string;
}

class ExamSessionService {
    private readonly baseUrl = '/exam-sessions';

    async createExamSession(createRequest: CreateExamSessionRequest): Promise<ApiResponse<ExamSessionDto>> {
        const response = await api.post<ApiResponse<ExamSessionDto>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateExamSession(id: string, updateRequest: UpdateExamSessionRequest): Promise<ApiResponse<ExamSessionDto>> {
        const response = await api.put<ApiResponse<ExamSessionDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async getExamSessionById(id: string): Promise<ApiResponse<ExamSessionDto>> {
        const response = await api.get<ApiResponse<ExamSessionDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getExamSessions(searchRequest: ExamSessionSearchRequest = {}): Promise<ApiResponse<ExamSessionListResponse>> {
        const params = new URLSearchParams();

        if (searchRequest.name) params.append('name', searchRequest.name);
        if (searchRequest.branchId) params.append('branchId', searchRequest.branchId);
        if (searchRequest.brandId) params.append('brandId', searchRequest.brandId);
        if (searchRequest.examTemplate) params.append('examTemplate', searchRequest.examTemplate);
        if (searchRequest.startDateFrom) params.append('startDateFrom', searchRequest.startDateFrom);
        if (searchRequest.startDateTo) params.append('startDateTo', searchRequest.startDateTo);
        if (searchRequest.status) params.append('status', searchRequest.status);
        if (searchRequest.page !== undefined) params.append('page', searchRequest.page.toString());
        if (searchRequest.size !== undefined) params.append('size', searchRequest.size.toString());
        if (searchRequest.sortBy) params.append('sortBy', searchRequest.sortBy);
        if (searchRequest.sortDirection) params.append('sortDirection', searchRequest.sortDirection);

        const response = await api.get<ApiResponse<ExamSessionListResponse>>(`${this.baseUrl}?${params}`);
        return response.data;
    }

    async deleteExamSession(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async addSupervisor(sessionId: string, supervisorId: string): Promise<ApiResponse<ExamSessionDto>> {
        const response = await api.post<ApiResponse<ExamSessionDto>>(`${this.baseUrl}/${sessionId}/supervisors/${supervisorId}`);
        return response.data;
    }

    async removeSupervisor(sessionId: string, supervisorId: string): Promise<ApiResponse<ExamSessionDto>> {
        const response = await api.delete<ApiResponse<ExamSessionDto>>(`${this.baseUrl}/${sessionId}/supervisors/${supervisorId}`);
        return response.data;
    }

    async getExamSessionsByBranch(branchId: string): Promise<ApiResponse<ExamSessionDto[]>> {
        const response = await api.get<ApiResponse<ExamSessionDto[]>>(`${this.baseUrl}/branch/${branchId}`);
        return response.data;
    }

    async getUpcomingExamSessions(): Promise<ApiResponse<ExamSessionDto[]>> {
        const response = await api.get<ApiResponse<ExamSessionDto[]>>(`${this.baseUrl}/upcoming`);
        return response.data;
    }

    async getExamSessionStatistics(id: string): Promise<ApiResponse<ExamSessionStatistics>> {
        const response = await api.get<ApiResponse<ExamSessionStatistics>>(`${this.baseUrl}/${id}/statistics`);
        return response.data;
    }

    async copyExamSession(id: string, newName: string, newStartDate: string): Promise<ApiResponse<ExamSessionDto>> {
        const copyRequest: CopySessionRequest = { newName, newStartDate };
        const response = await api.post<ApiResponse<ExamSessionDto>>(`${this.baseUrl}/${id}/copy`, copyRequest);
        return response.data;
    }

    async getActiveExamSessions(): Promise<ApiResponse<ExamSessionDto[]>> {
        const response = await api.get<ApiResponse<ExamSessionDto[]>>(`${this.baseUrl}/active`);
        return response.data;
    }

    async getCompletedExamSessions(page: number = 0, size: number = 20): Promise<ApiResponse<ExamSessionDto[]>> {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        const response = await api.get<ApiResponse<ExamSessionDto[]>>(`${this.baseUrl}/completed?${params}`);
        return response.data;
    }

    async getSessionDashboard(): Promise<ApiResponse<SessionDashboard>> {
        const response = await api.get<ApiResponse<SessionDashboard>>(`${this.baseUrl}/dashboard`);
        return response.data;
    }

    async getSessionApplications(
        id: string,
        status?: string,
        page: number = 0,
        size: number = 20
    ): Promise<ApiResponse<SessionApplicationDto[]>> {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        if (status) params.append('status', status);

        const response = await api.get<ApiResponse<SessionApplicationDto[]>>(`${this.baseUrl}/${id}/applications?${params}`);
        return response.data;
    }

    async updateSessionStatus(id: string, statusRequest: UpdateStatusRequest): Promise<ApiResponse<ExamSessionDto>> {
        const response = await api.put<ApiResponse<ExamSessionDto>>(`${this.baseUrl}/${id}/status`, statusRequest);
        return response.data;
    }
}

export const examSessionService = new ExamSessionService();