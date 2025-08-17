
import api from "@/services/api/base-api";
import {CreateQuestionTemplateRequest, UpdateQuestionTemplateRequest} from "@/types/exam/examRequests";
import {
    QuestionTemplateListResponse,
    QuestionTemplateResponse,
    QuestionTemplateSearchRequest, TemplateUsageInfo
} from "@/types/exam/examResponses";
import {ApiResponse, TemplateUsageStatistics, TemplateValidationResult} from "@/types/exam/examValidationAndAnalytics";
import {EQuestionType} from "@/types/exam/enum";

// Response DTOs


class BaseQuestionTemplateService {
    private readonly baseUrl = '/question-templates';

    async createTemplate(createRequest: CreateQuestionTemplateRequest): Promise<ApiResponse<QuestionTemplateResponse>> {
        const response = await api.post<ApiResponse<QuestionTemplateResponse>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateTemplate(updateRequest: UpdateQuestionTemplateRequest): Promise<ApiResponse<QuestionTemplateResponse>> {
        // Note: Original controller method returns "not implemented" error
        const response = await api.put<ApiResponse<QuestionTemplateResponse>>(`${this.baseUrl}/update`, updateRequest);
        return response.data;
    }

    async getTemplateById(id: string): Promise<ApiResponse<QuestionTemplateResponse>> {
        const response = await api.get<ApiResponse<QuestionTemplateResponse>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getTemplatesByType(questionType: EQuestionType): Promise<ApiResponse<QuestionTemplateResponse[]>> {
        const response = await api.get<ApiResponse<QuestionTemplateResponse[]>>(`${this.baseUrl}/by-type/${questionType}`);
        return response.data;
    }

    async getActiveTemplates(): Promise<ApiResponse<QuestionTemplateResponse[]>> {
        // Note: Original controller method returns "not implemented" error
        const response = await api.get<ApiResponse<QuestionTemplateResponse[]>>(`${this.baseUrl}/active`);
        return response.data;
    }

    async searchTemplates(searchRequest: QuestionTemplateSearchRequest): Promise<ApiResponse<QuestionTemplateListResponse>> {
        const params = new URLSearchParams();

        if (searchRequest.title) params.append('title', searchRequest.title);
        if (searchRequest.questionType) params.append('questionType', searchRequest.questionType);
        if (searchRequest.subject) params.append('subject', searchRequest.subject);
        if (searchRequest.difficulty) params.append('difficulty', searchRequest.difficulty);
        if (searchRequest.isActive !== undefined) params.append('isActive', searchRequest.isActive.toString());
        if (searchRequest.page !== undefined) params.append('page', searchRequest.page.toString());
        if (searchRequest.size !== undefined) params.append('size', searchRequest.size.toString());
        if (searchRequest.sortBy) params.append('sortBy', searchRequest.sortBy);
        if (searchRequest.sortDirection) params.append('sortDirection', searchRequest.sortDirection);

        // Note: Original controller method returns "not implemented" error
        const response = await api.get<ApiResponse<QuestionTemplateListResponse>>(`${this.baseUrl}?${params}`);
        return response.data;
    }

    async deleteTemplate(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async validateTemplate(validateRequest: CreateQuestionTemplateRequest): Promise<ApiResponse<TemplateValidationResult>> {
        // Note: Original controller method returns "not implemented" error
        const response = await api.post<ApiResponse<TemplateValidationResult>>(`${this.baseUrl}/validate`, validateRequest);
        return response.data;
    }

    async toggleTemplateStatus(id: string, isActive: boolean): Promise<ApiResponse<QuestionTemplateResponse>> {
        // Note: Original controller method returns "not implemented" error
        const response = await api.put<ApiResponse<QuestionTemplateResponse>>(`${this.baseUrl}/${id}/toggle-status`, { isActive });
        return response.data;
    }

    async getTemplateStatistics(): Promise<ApiResponse<TemplateUsageStatistics[]>> {
        // Note: Original controller method returns "not implemented" error
        const response = await api.get<ApiResponse<TemplateUsageStatistics[]>>(`${this.baseUrl}/statistics`);
        return response.data;
    }

    async getTemplateUsage(id: string): Promise<ApiResponse<TemplateUsageInfo>> {
        const response = await api.get<ApiResponse<TemplateUsageInfo>>(`${this.baseUrl}/${id}/usage`);
        return response.data;
    }

    async duplicateTemplate(id: string, newTitle: string): Promise<ApiResponse<QuestionTemplateResponse>> {
        // Note: Original controller method returns "not implemented" error
        const response = await api.post<ApiResponse<QuestionTemplateResponse>>(`${this.baseUrl}/${id}/duplicate`, { newTitle });
        return response.data;
    }
}

export const baseQuestionTemplateService = new BaseQuestionTemplateService();