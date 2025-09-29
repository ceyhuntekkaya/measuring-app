
import api from "@/services/api/base-api";
import {ExamTypeSearchRequest} from "@/types/exam/examEntities";
import { ApiResponse } from "@/types/exam/examValidationAndAnalytics";
import {ExamTypeDto} from "@/types/exam/examTemplates";
import {
    ExamTypeListResponse,
    ExamTypeStatistics, ExamTypeSummary,
    ExamTypeValidationResult,
} from "@/types/exam/examResponses";


class ExamTypeService {
    private readonly baseUrl = '/exam-types';

    async createExamType(createRequest: ExamTypeDto): Promise<ApiResponse<ExamTypeDto>> {
        const response = await api.post<ApiResponse<ExamTypeDto>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateExamType(id: string, updateRequest: ExamTypeDto): Promise<ApiResponse<ExamTypeDto>> {
        const response = await api.put<ApiResponse<ExamTypeDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async getExamTypeById(id: string): Promise<ApiResponse<ExamTypeDto>> {
        const response = await api.get<ApiResponse<ExamTypeDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getAllExamTypes(searchRequest: ExamTypeSearchRequest = {}): Promise<ApiResponse<ExamTypeListResponse>> {
        const params = new URLSearchParams();

        if (searchRequest.name) params.append('name', searchRequest.name);
        if (searchRequest.examLevel) params.append('examLevel', searchRequest.examLevel);
        if (searchRequest.examType) params.append('examType', searchRequest.examType);
        if (searchRequest.isFinalized !== undefined) params.append('isFinalized', searchRequest.isFinalized.toString());
        if (searchRequest.isActive !== undefined) params.append('isActive', searchRequest.isActive.toString());
        if (searchRequest.page !== undefined) params.append('page', searchRequest.page.toString());
        if (searchRequest.size !== undefined) params.append('size', searchRequest.size.toString());
        if (searchRequest.sortBy) params.append('sortBy', searchRequest.sortBy);
        if (searchRequest.sortDirection) params.append('sortDirection', searchRequest.sortDirection);

        const response = await api.get<ApiResponse<ExamTypeListResponse>>(`${this.baseUrl}?${params}`);
        return response.data;
    }

    async deleteExamType(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async finalizeExamType(id: string): Promise<ApiResponse<ExamTypeDto>> {
        const response = await api.post<ApiResponse<ExamTypeDto>>(`${this.baseUrl}/${id}/finalize`);
        return response.data;
    }

    async unfinalizeExamType(id: string): Promise<ApiResponse<ExamTypeDto>> {
        const response = await api.post<ApiResponse<ExamTypeDto>>(`${this.baseUrl}/${id}/unfinalize`);
        return response.data;
    }

    async copyExamType(id: string, newName: string): Promise<ApiResponse<ExamTypeDto>> {
        const response = await api.post<ApiResponse<ExamTypeDto>>(`${this.baseUrl}/${id}/copy`, { newName });
        return response.data;
    }

    async validateExamTypeForFinalization(id: string): Promise<ApiResponse<ExamTypeValidationResult>> {
        const response = await api.get<ApiResponse<ExamTypeValidationResult>>(`${this.baseUrl}/${id}/validate`);
        return response.data;
    }

    async getExamTypeStatistics(id: string): Promise<ApiResponse<ExamTypeStatistics>> {
        const response = await api.get<ApiResponse<ExamTypeStatistics>>(`${this.baseUrl}/${id}/statistics`);
        return response.data;
    }

    async getFinalizedExamTypes(page: number = 0, size: number = 20, sortBy: string = 'name', sortDirection: string = 'ASC'): Promise<ApiResponse<ExamTypeListResponse>> {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sortBy,
            sortDirection
        });
        const response = await api.get<ApiResponse<ExamTypeListResponse>>(`${this.baseUrl}/finalized?${params}`);
        return response.data;
    }

    async getDraftExamTypes(page: number = 0, size: number = 20, sortBy: string = 'name', sortDirection: string = 'ASC'): Promise<ApiResponse<ExamTypeListResponse>> {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sortBy,
            sortDirection
        });
        const response = await api.get<ApiResponse<ExamTypeListResponse>>(`${this.baseUrl}/draft?${params}`);
        return response.data;
    }

    async getExamTypesSummary(): Promise<ApiResponse<ExamTypeSummary>> {
        const response = await api.get<ApiResponse<ExamTypeSummary>>(`${this.baseUrl}/summary`);
        return response.data;
    }
}

export const examTypeService = new ExamTypeService();