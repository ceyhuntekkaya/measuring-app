
import api from "@/services/api/base-api";
import { EMediaType } from "@/types/exam/enum";
import { QuestionOptionDto } from "@/types/exam/examEntities";
import {CreateQuestionOptionRequest} from "@/types/exam/examRequests";
import { ApiResponse } from "@/types/exam/examValidationAndAnalytics";
import {
    QuestionOptionAnalysis,
    QuestionOptionStatistics,
    QuestionOptionValidation,
    UpdateQuestionOptionRequest
} from "@/types/exam/examResponses";


class QuestionOptionService {
    private readonly baseUrl = '/question-options';

    async createQuestionOption(questionId: string, createRequest: CreateQuestionOptionRequest): Promise<ApiResponse<QuestionOptionDto>> {
        const response = await api.post<ApiResponse<QuestionOptionDto>>(`${this.baseUrl}/question/${questionId}`, createRequest);
        return response.data;
    }

    async updateQuestionOption(id: string, updateRequest: UpdateQuestionOptionRequest): Promise<ApiResponse<QuestionOptionDto>> {
        const response = await api.put<ApiResponse<QuestionOptionDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async getQuestionOptionById(id: string): Promise<ApiResponse<QuestionOptionDto>> {
        const response = await api.get<ApiResponse<QuestionOptionDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getQuestionOptionsByQuestion(questionId: string): Promise<ApiResponse<QuestionOptionDto[]>> {
        const response = await api.get<ApiResponse<QuestionOptionDto[]>>(`${this.baseUrl}/question/${questionId}`);
        return response.data;
    }

    async getSecureQuestionOptionsByQuestion(questionId: string): Promise<ApiResponse<QuestionOptionDto[]>> {
        const response = await api.get<ApiResponse<QuestionOptionDto[]>>(`${this.baseUrl}/question/${questionId}/secure`);
        return response.data;
    }

    async deleteQuestionOption(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async reorderQuestionOptions(questionId: string, optionIds: string[]): Promise<ApiResponse<QuestionOptionDto[]>> {
        const response = await api.put<ApiResponse<QuestionOptionDto[]>>(`${this.baseUrl}/question/${questionId}/reorder`, {
            optionIds
        });
        return response.data;
    }

    async setCorrectAnswers(questionId: string, correctOptionIds: string[]): Promise<ApiResponse<QuestionOptionDto[]>> {
        const response = await api.put<ApiResponse<QuestionOptionDto[]>>(`${this.baseUrl}/question/${questionId}/correct-answers`, {
            correctOptionIds
        });
        return response.data;
    }

    async copyQuestionOption(optionId: string, targetQuestionId: string): Promise<ApiResponse<QuestionOptionDto>> {
        const response = await api.post<ApiResponse<QuestionOptionDto>>(`${this.baseUrl}/${optionId}/copy`, {
            targetQuestionId
        });
        return response.data;
    }

    async bulkCreateQuestionOptions(questionId: string, createRequests: CreateQuestionOptionRequest[]): Promise<ApiResponse<QuestionOptionDto[]>> {
        const response = await api.post<ApiResponse<QuestionOptionDto[]>>(`${this.baseUrl}/question/${questionId}/bulk`, createRequests);
        return response.data;
    }

    async getQuestionOptionStatistics(questionId: string): Promise<ApiResponse<QuestionOptionStatistics>> {
        const response = await api.get<ApiResponse<QuestionOptionStatistics>>(`${this.baseUrl}/question/${questionId}/statistics`);
        return response.data;
    }

    async searchQuestionOptions(
        questionId?: string,
        mediaType?: EMediaType,
        content?: string,
        isTrueOption?: boolean
    ): Promise<ApiResponse<QuestionOptionDto[]>> {
        const params = new URLSearchParams();

        if (questionId) params.append('questionId', questionId);
        if (mediaType) params.append('mediaType', mediaType);
        if (content) params.append('content', content);
        if (isTrueOption !== undefined) params.append('isTrueOption', isTrueOption.toString());

        const response = await api.get<ApiResponse<QuestionOptionDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }

    async analyzeQuestionOptions(questionId: string): Promise<ApiResponse<QuestionOptionAnalysis>> {
        const response = await api.get<ApiResponse<QuestionOptionAnalysis>>(`${this.baseUrl}/question/${questionId}/analysis`);
        return response.data;
    }

    async validateQuestionOptions(questionId: string): Promise<ApiResponse<QuestionOptionValidation>> {
        const response = await api.get<ApiResponse<QuestionOptionValidation>>(`${this.baseUrl}/question/${questionId}/validation`);
        return response.data;
    }

    async shuffleQuestionOptions(questionId: string): Promise<ApiResponse<QuestionOptionDto[]>> {
        const response = await api.post<ApiResponse<QuestionOptionDto[]>>(`${this.baseUrl}/question/${questionId}/shuffle`);
        return response.data;
    }
}

export const questionOptionService = new QuestionOptionService();