
import api from "@/services/api/base-api";
import {CreateQuestionRequest} from "@/types/exam/examRequests";
import { ApiResponse } from "@/types/exam/examValidationAndAnalytics";
import {QuestionDto, QuestionSearchRequest} from "@/types/exam/examEntities";
import {EQuestionType} from "@/types/exam/enum";
import {QuestionGroupQuestionStatistics, QuestionValidation} from "@/types/exam/examResponses";
import {QuestionId} from "@/types/management/brand";


class QuestionService {
    private readonly baseUrl = '/questions';

    async createQuestion(createRequest: CreateQuestionRequest): Promise<ApiResponse<QuestionDto>> {
        console.log(JSON.stringify(createRequest));
        const response = await api.post<ApiResponse<QuestionDto>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateQuestion(id: string, updateRequest: CreateQuestionRequest): Promise<ApiResponse<QuestionDto>> {

        console.log(JSON.stringify(updateRequest));
        const response = await api.put<ApiResponse<QuestionDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async getQuestionById(id: string): Promise<ApiResponse<QuestionDto>> {
        const response = await api.get<ApiResponse<QuestionDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getQuestionsByGroup(questionGroupId: string): Promise<ApiResponse<QuestionDto[]>> {
        const response = await api.get<ApiResponse<QuestionDto[]>>(`${this.baseUrl}/group/${questionGroupId}`);
        return response.data;
    }

    async deleteQuestion(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async reorderQuestions(questionGroupId: string, questionIds: string[]): Promise<ApiResponse<QuestionDto[]>> {
        const response = await api.put<ApiResponse<QuestionDto[]>>(`${this.baseUrl}/group/${questionGroupId}/reorder`, {
            questionIds
        });
        return response.data;
    }

    async copyQuestion(questionId: string, targetGroupId: string): Promise<ApiResponse<QuestionDto>> {
        const response = await api.post<ApiResponse<QuestionDto>>(`${this.baseUrl}/${questionId}/copy`, {
            targetGroupId
        });
        return response.data;
    }

    async searchQuestions(searchRequest: QuestionSearchRequest): Promise<ApiResponse<QuestionDto[]>> {
        const params = new URLSearchParams();

        if (searchRequest.name) params.append('name', searchRequest.name);
        if (searchRequest.questionType) params.append('questionType', searchRequest.questionType);
        if (searchRequest.questionGroupId) params.append('questionGroupId', searchRequest.questionGroupId);
        if (searchRequest.isAutomaticallyEvaluated !== undefined) {
            params.append('isAutomaticallyEvaluated', searchRequest.isAutomaticallyEvaluated.toString());
        }
        if (searchRequest.questionTemplateId) params.append('questionTemplateId', searchRequest.questionTemplateId);

        const response = await api.get<ApiResponse<QuestionDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }

    async getQuestionsByTemplate(templateId: string): Promise<ApiResponse<QuestionDto[]>> {
        const response = await api.get<ApiResponse<QuestionDto[]>>(`${this.baseUrl}/by-template/${templateId}`);
        return response.data;
    }

    async getQuestionsByType(questionType: EQuestionType): Promise<ApiResponse<QuestionDto[]>> {
        const response = await api.get<ApiResponse<QuestionDto[]>>(`${this.baseUrl}/by-type/${questionType}`);
        return response.data;
    }

    async bulkCreateQuestions(createRequests: CreateQuestionRequest[]): Promise<ApiResponse<QuestionDto[]>> {
        const response = await api.post<ApiResponse<QuestionDto[]>>(`${this.baseUrl}/bulk`, createRequests);
        return response.data;
    }

    async getGroupQuestionStatistics(questionGroupId: string): Promise<ApiResponse<QuestionGroupQuestionStatistics>> {
        const response = await api.get<ApiResponse<QuestionGroupQuestionStatistics>>(`${this.baseUrl}/group/${questionGroupId}/statistics`);
        return response.data;
    }

    async validateQuestion(id: string): Promise<ApiResponse<QuestionValidation>> {
        const response = await api.get<ApiResponse<QuestionValidation>>(`${this.baseUrl}/${id}/validation`);
        return response.data;
    }

    async duplicateQuestion(questionId: string, newName?: string): Promise<ApiResponse<QuestionDto>> {
        const response = await api.post<ApiResponse<QuestionDto>>(`${this.baseUrl}/${questionId}/duplicate`, {
            newName
        });
        return response.data;
    }



    async getAllQuestionByIdList(idList: QuestionId[]): Promise<ApiResponse<QuestionDto[]>> {
        const response = await api.post<ApiResponse<QuestionDto[]>>(`${this.baseUrl}/id/list/`, idList);
        return response.data;
    }
}

export const questionService = new QuestionService();