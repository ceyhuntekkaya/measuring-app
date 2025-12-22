
import api from "@/services/api/base-api";
import {ApiResponse} from "@/types/exam/examValidationAndAnalytics";
import {CreateQuestionGroupHeaderRequest, CreateQuestionGroupRequest} from "@/types/exam/examRequests";
import {QuestionGroupApprovalResponse, QuestionGroupDto, QuestionGroupHeaderDto} from "@/types/exam/examEntities";
import {QuestionGroupsSummary, QuestionGroupStatistics, QuestionGroupValidation} from "@/types/exam/examResponses";


class QuestionGroupService {
    private readonly baseUrl = '/question-groups';

    async createQuestionGroup(createRequest: CreateQuestionGroupRequest): Promise<ApiResponse<QuestionGroupDto>> {
        const response = await api.post<ApiResponse<QuestionGroupDto>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateQuestionGroup(id: string, updateRequest: CreateQuestionGroupRequest): Promise<ApiResponse<QuestionGroupDto>> {
        const response = await api.put<ApiResponse<QuestionGroupDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async getQuestionGroupById(id: string): Promise<ApiResponse<QuestionGroupDto>> {
        const response = await api.get<ApiResponse<QuestionGroupDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getQuestionGroupsByExamSection(examSectionId: string): Promise<ApiResponse<QuestionGroupDto[]>> {
        const response = await api.get<ApiResponse<QuestionGroupDto[]>>(`${this.baseUrl}/exam-section/${examSectionId}`);
        return response.data;
    }

    async getQuestionGroupsByExamType(examTypeId: string): Promise<ApiResponse<QuestionGroupDto[]>> {
        const response = await api.get<ApiResponse<QuestionGroupDto[]>>(`${this.baseUrl}/exam-type/${examTypeId}`);
        return response.data;
    }

    async getQuestionGroupApprovals(questionGroupId: string): Promise<ApiResponse<QuestionGroupApprovalResponse[]>> {
        const response = await api.get<ApiResponse<QuestionGroupApprovalResponse[]>>(`${this.baseUrl}/${questionGroupId}/approvals`);
        return response.data;  
    }

    async deleteQuestionGroup(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async addHeaderToQuestionGroup(questionGroupId: string, headerRequest: CreateQuestionGroupHeaderRequest): Promise<ApiResponse<QuestionGroupHeaderDto>> {
        const response = await api.post<ApiResponse<QuestionGroupHeaderDto>>(`${this.baseUrl}/${questionGroupId}/headers`, headerRequest);
        return response.data;
    }

    async removeHeaderFromQuestionGroup(headerId: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/headers/${headerId}`);
        return response.data;
    }

    async copyQuestionGroup(questionGroupId: string, targetExamSectionId: string): Promise<ApiResponse<QuestionGroupDto>> {
        const response = await api.post<ApiResponse<QuestionGroupDto>>(`${this.baseUrl}/${questionGroupId}/copy`, {
            targetExamSectionId
        });
        return response.data;
    }

    async getQuestionGroupStatistics(id: string): Promise<ApiResponse<QuestionGroupStatistics>> {
        const response = await api.get<ApiResponse<QuestionGroupStatistics>>(`${this.baseUrl}/${id}/statistics`);
        return response.data;
    }

    async searchQuestionGroups(
        name?: string,
        examTypeId?: string,
        examSectionId?: string,
        questionGroupTypeId?: string,
        hasQuestions?: boolean
    ): Promise<ApiResponse<QuestionGroupDto[]>> {
        const params = new URLSearchParams();

        if (name) params.append('name', name);
        if (examTypeId) params.append('examTypeId', examTypeId);
        if (examSectionId) params.append('examSectionId', examSectionId);
        if (questionGroupTypeId) params.append('questionGroupTypeId', questionGroupTypeId);
        if (hasQuestions !== undefined) params.append('hasQuestions', hasQuestions.toString());

        const response = await api.get<ApiResponse<QuestionGroupDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }

    async getQuestionGroupsSummary(examSectionId: string): Promise<ApiResponse<QuestionGroupsSummary>> {
        const response = await api.get<ApiResponse<QuestionGroupsSummary>>(`${this.baseUrl}/exam-section/${examSectionId}/summary`);
        return response.data;
    }

    async validateQuestionGroup(id: string): Promise<ApiResponse<QuestionGroupValidation>> {
        const response = await api.get<ApiResponse<QuestionGroupValidation>>(`${this.baseUrl}/${id}/validation`);
        return response.data;
    }

    async bulkCreateQuestionGroups(createRequests: CreateQuestionGroupRequest[]): Promise<ApiResponse<QuestionGroupDto[]>> {
        const response = await api.post<ApiResponse<QuestionGroupDto[]>>(`${this.baseUrl}/bulk`, createRequests);
        return response.data;
    }


    async getAllQuestionGroup(): Promise<ApiResponse<QuestionGroupDto[]>> {
        const response = await api.get<ApiResponse<QuestionGroupDto[]>>(`${this.baseUrl}/`);
        return response.data;
    }
}

export const questionGroupService = new QuestionGroupService();
