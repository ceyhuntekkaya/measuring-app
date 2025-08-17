
import api from "@/services/api/base-api";
import { EMediaType } from "@/types/exam/enum";
import { CreateQuestionPartRequest } from "@/types/exam/examRequests";
import {ApiResponse} from "@/types/exam/examValidationAndAnalytics";
import {QuestionPartDto} from "@/types/exam/examEntities";
import {
    QuestionPartPreview,
    QuestionPartStatistics,
    QuestionPartTemplate,
    UpdateQuestionPartRequest
} from "@/types/exam/examResponses";


class QuestionPartService {
    private readonly baseUrl = '/question-parts';

    async createQuestionPart(questionId: string, createRequest: CreateQuestionPartRequest): Promise<ApiResponse<QuestionPartDto>> {
        const response = await api.post<ApiResponse<QuestionPartDto>>(`${this.baseUrl}/question/${questionId}`, createRequest);
        return response.data;
    }

    async updateQuestionPart(id: string, updateRequest: UpdateQuestionPartRequest): Promise<ApiResponse<QuestionPartDto>> {
        const response = await api.put<ApiResponse<QuestionPartDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async getQuestionPartById(id: string): Promise<ApiResponse<QuestionPartDto>> {
        const response = await api.get<ApiResponse<QuestionPartDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getQuestionPartsByQuestion(questionId: string): Promise<ApiResponse<QuestionPartDto[]>> {
        const response = await api.get<ApiResponse<QuestionPartDto[]>>(`${this.baseUrl}/question/${questionId}`);
        return response.data;
    }

    async deleteQuestionPart(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async reorderQuestionParts(questionId: string, partIds: string[]): Promise<ApiResponse<QuestionPartDto[]>> {
        const response = await api.put<ApiResponse<QuestionPartDto[]>>(`${this.baseUrl}/question/${questionId}/reorder`, {
            partIds
        });
        return response.data;
    }

    async copyQuestionPart(partId: string, targetQuestionId: string): Promise<ApiResponse<QuestionPartDto>> {
        const response = await api.post<ApiResponse<QuestionPartDto>>(`${this.baseUrl}/${partId}/copy`, {
            targetQuestionId
        });
        return response.data;
    }

    async bulkCreateQuestionParts(questionId: string, createRequests: CreateQuestionPartRequest[]): Promise<ApiResponse<QuestionPartDto[]>> {
        const response = await api.post<ApiResponse<QuestionPartDto[]>>(`${this.baseUrl}/question/${questionId}/bulk`, createRequests);
        return response.data;
    }

    async getQuestionPartStatistics(questionId: string): Promise<ApiResponse<QuestionPartStatistics>> {
        const response = await api.get<ApiResponse<QuestionPartStatistics>>(`${this.baseUrl}/question/${questionId}/statistics`);
        return response.data;
    }

    async searchQuestionParts(
        questionId?: string,
        mediaType?: EMediaType,
        content?: string,
        label?: string,
        hasScore?: boolean,
        hasDuration?: boolean
    ): Promise<ApiResponse<QuestionPartDto[]>> {
        const params = new URLSearchParams();

        if (questionId) params.append('questionId', questionId);
        if (mediaType) params.append('mediaType', mediaType);
        if (content) params.append('content', content);
        if (label) params.append('label', label);
        if (hasScore !== undefined) params.append('hasScore', hasScore.toString());
        if (hasDuration !== undefined) params.append('hasDuration', hasDuration.toString());

        const response = await api.get<ApiResponse<QuestionPartDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }

    async getQuestionPartsByMediaType(mediaType: EMediaType): Promise<ApiResponse<QuestionPartDto[]>> {
        const response = await api.get<ApiResponse<QuestionPartDto[]>>(`${this.baseUrl}/by-media-type/${mediaType}`);
        return response.data;
    }

    async getPartTemplates(mediaType?: EMediaType): Promise<ApiResponse<QuestionPartTemplate[]>> {
        const params = new URLSearchParams();
        if (mediaType) params.append('mediaType', mediaType);

        const response = await api.get<ApiResponse<QuestionPartTemplate[]>>(`${this.baseUrl}/templates?${params}`);
        return response.data;
    }

    async previewQuestionPart(id: string): Promise<ApiResponse<QuestionPartPreview>> {
        const response = await api.get<ApiResponse<QuestionPartPreview>>(`${this.baseUrl}/${id}/preview`);
        return response.data;
    }

    async duplicateQuestionPart(partId: string, newLabel?: string): Promise<ApiResponse<QuestionPartDto>> {
        const response = await api.post<ApiResponse<QuestionPartDto>>(`${this.baseUrl}/${partId}/duplicate`, {
            newLabel
        });
        return response.data;
    }
}

export const questionPartService = new QuestionPartService();