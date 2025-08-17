
import api from "@/services/api/base-api";
import {EQuestionGroupTemplateLevel, EQuestionGroupType} from "@/types/exam/enum";
import { ApiResponse } from "@/types/exam/examValidationAndAnalytics";
import {QuestionGroupTypeDto} from "@/types/exam/examTemplates";

// Request DTOs
export interface UpdateQuestionGroupTypeRequest {
    name?: string;
    level?: EQuestionGroupTemplateLevel;
    groupType?: EQuestionGroupType;
    orderNumber?: number;
    description?: string;
}

export interface QuestionGroupTypeSearchRequest {
    name?: string;
    level?: EQuestionGroupTemplateLevel;
    groupType?: EQuestionGroupType;
    examSectionId?: string;
}

// Response DTOs
export interface QuestionGroupTypeStatistics {
    typeId: string;
    totalQuestionGroups: number;
    totalQuestions: number;
    averageQuestionsPerGroup: number;
    usageCount: number;
}

export interface QuestionGroupTypeTemplate {
    templateId: string;
    name: string;
    level: EQuestionGroupTemplateLevel;
    groupType: EQuestionGroupType;
}

export interface LevelInfo {
    level: EQuestionGroupTemplateLevel;
    displayName: string;
    description: string;
}

export interface GroupTypeInfo {
    groupType: EQuestionGroupType;
    displayName: string;
    description: string;
}

export interface CreateQuestionGroupTypeRequest {

    name: string;
    examSectionId: string;
    orderNumber: number;
    level: EQuestionGroupTemplateLevel;
    groupType: EQuestionGroupType;
}

class QuestionGroupTypeService {
    private readonly baseUrl = '/question-group-types';

    async createQuestionGroupType(createRequest: UpdateQuestionGroupTypeRequest): Promise<ApiResponse<QuestionGroupTypeDto>> {
        const response = await api.post<ApiResponse<QuestionGroupTypeDto>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateQuestionGroupType(id: string, updateRequest: UpdateQuestionGroupTypeRequest): Promise<ApiResponse<QuestionGroupTypeDto>> {
        const response = await api.put<ApiResponse<QuestionGroupTypeDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async getQuestionGroupTypeById(id: string): Promise<ApiResponse<QuestionGroupTypeDto>> {
        const response = await api.get<ApiResponse<QuestionGroupTypeDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getQuestionGroupTypesByExamSection(examSectionId: string): Promise<ApiResponse<QuestionGroupTypeDto[]>> {
        const response = await api.get<ApiResponse<QuestionGroupTypeDto[]>>(`${this.baseUrl}/exam-section/${examSectionId}`);
        return response.data;
    }

    async getQuestionGroupTypesByLevel(level: EQuestionGroupTemplateLevel): Promise<ApiResponse<QuestionGroupTypeDto[]>> {
        const response = await api.get<ApiResponse<QuestionGroupTypeDto[]>>(`${this.baseUrl}/by-level/${level}`);
        return response.data;
    }

    async getQuestionGroupTypesByGroupType(groupType: EQuestionGroupType): Promise<ApiResponse<QuestionGroupTypeDto[]>> {
        const response = await api.get<ApiResponse<QuestionGroupTypeDto[]>>(`${this.baseUrl}/by-group-type/${groupType}`);
        return response.data;
    }

    async deleteQuestionGroupType(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async reorderQuestionGroupTypes(examSectionId: string, typeIds: string[]): Promise<ApiResponse<QuestionGroupTypeDto[]>> {
        const response = await api.put<ApiResponse<QuestionGroupTypeDto[]>>(`${this.baseUrl}/exam-section/${examSectionId}/reorder`, {
            typeIds
        });
        return response.data;
    }

    async copyQuestionGroupType(typeId: string, targetExamSectionId: string): Promise<ApiResponse<QuestionGroupTypeDto>> {
        const response = await api.post<ApiResponse<QuestionGroupTypeDto>>(`${this.baseUrl}/${typeId}/copy`, {
            targetExamSectionId
        });
        return response.data;
    }

    async bulkCreateQuestionGroupTypes(examSectionId: string, createRequests: CreateQuestionGroupTypeRequest[]): Promise<ApiResponse<QuestionGroupTypeDto[]>> {
        const response = await api.post<ApiResponse<QuestionGroupTypeDto[]>>(`${this.baseUrl}/exam-section/${examSectionId}/bulk`, createRequests);
        return response.data;
    }

    async getQuestionGroupTypeStatistics(id: string): Promise<ApiResponse<QuestionGroupTypeStatistics>> {
        const response = await api.get<ApiResponse<QuestionGroupTypeStatistics>>(`${this.baseUrl}/${id}/statistics`);
        return response.data;
    }

    async searchQuestionGroupTypes(searchRequest: QuestionGroupTypeSearchRequest): Promise<ApiResponse<QuestionGroupTypeDto[]>> {
        const params = new URLSearchParams();

        if (searchRequest.name) params.append('name', searchRequest.name);
        if (searchRequest.level) params.append('level', searchRequest.level);
        if (searchRequest.groupType) params.append('groupType', searchRequest.groupType);
        if (searchRequest.examSectionId) params.append('examSectionId', searchRequest.examSectionId);

        const response = await api.get<ApiResponse<QuestionGroupTypeDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }

    async getAvailableTemplates(level?: EQuestionGroupTemplateLevel, groupType?: EQuestionGroupType): Promise<ApiResponse<QuestionGroupTypeTemplate[]>> {
        const params = new URLSearchParams();
        if (level) params.append('level', level);
        if (groupType) params.append('groupType', groupType);

        const response = await api.get<ApiResponse<QuestionGroupTypeTemplate[]>>(`${this.baseUrl}/templates?${params}`);
        return response.data;
    }

    async getAvailableLevels(): Promise<ApiResponse<LevelInfo[]>> {
        const response = await api.get<ApiResponse<LevelInfo[]>>(`${this.baseUrl}/levels`);
        return response.data;
    }

    async getAvailableGroupTypes(): Promise<ApiResponse<GroupTypeInfo[]>> {
        const response = await api.get<ApiResponse<GroupTypeInfo[]>>(`${this.baseUrl}/group-types`);
        return response.data;
    }
}

export const questionGroupTypeService = new QuestionGroupTypeService();
