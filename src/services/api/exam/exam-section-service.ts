
import api from "@/services/api/base-api";
import {CreateExamSectionRequest} from "@/types/exam/examEntities";
import { ApiResponse } from "@/types/exam/examValidationAndAnalytics";
import {ExamSectionDto} from "@/types/exam/examTemplates";
import {ExamSectionsSummary, ExamSectionStatistics, UpdateExamSectionRequest} from "@/types/exam/examResponses";


class ExamSectionService {
    private readonly baseUrl = '/exam-sections';

    async createExamSection(createRequest: CreateExamSectionRequest): Promise<ApiResponse<ExamSectionDto>> {
        const response = await api.post<ApiResponse<ExamSectionDto>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateExamSection(id: string, updateRequest: UpdateExamSectionRequest): Promise<ApiResponse<ExamSectionDto>> {
        const response = await api.put<ApiResponse<ExamSectionDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async getExamSectionById(id: string): Promise<ApiResponse<ExamSectionDto>> {
        const response = await api.get<ApiResponse<ExamSectionDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getExamSectionsByExamType(examTypeId: string): Promise<ApiResponse<ExamSectionDto[]>> {
        const response = await api.get<ApiResponse<ExamSectionDto[]>>(`${this.baseUrl}/exam-type/${examTypeId}`);
        return response.data;
    }

    async deleteExamSection(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async reorderExamSections(examTypeId: string, sectionIds: string[]): Promise<ApiResponse<ExamSectionDto[]>> {
        const response = await api.put<ApiResponse<ExamSectionDto[]>>(`${this.baseUrl}/exam-type/${examTypeId}/reorder`, {
            sectionIds
        });
        return response.data;
    }

    async copyExamSection(sectionId: string, targetExamTypeId: string): Promise<ApiResponse<ExamSectionDto>> {
        const response = await api.post<ApiResponse<ExamSectionDto>>(`${this.baseUrl}/${sectionId}/copy`, {
            targetExamTypeId
        });
        return response.data;
    }

    async moveExamSection(sectionId: string, targetExamTypeId: string): Promise<ApiResponse<ExamSectionDto>> {
        const response = await api.put<ApiResponse<ExamSectionDto>>(`${this.baseUrl}/${sectionId}/move`, {
            targetExamTypeId
        });
        return response.data;
    }

    async bulkCreateExamSections(examTypeId: string, createRequests: CreateExamSectionRequest[]): Promise<ApiResponse<ExamSectionDto[]>> {
        const response = await api.post<ApiResponse<ExamSectionDto[]>>(`${this.baseUrl}/exam-type/${examTypeId}/bulk`, createRequests);
        return response.data;
    }

    async getExamSectionStatistics(id: string): Promise<ApiResponse<ExamSectionStatistics>> {
        const response = await api.get<ApiResponse<ExamSectionStatistics>>(`${this.baseUrl}/${id}/statistics`);
        return response.data;
    }

    async getExamSectionsSummary(examTypeId: string): Promise<ApiResponse<ExamSectionsSummary>> {
        const response = await api.get<ApiResponse<ExamSectionsSummary>>(`${this.baseUrl}/exam-type/${examTypeId}/summary`);
        return response.data;
    }

    async searchExamSections(
        name?: string,
        examTypeId?: string,
        hasQuestionGroups?: boolean
    ): Promise<ApiResponse<ExamSectionDto[]>> {
        const params = new URLSearchParams();

        if (name) params.append('name', name);
        if (examTypeId) params.append('examTypeId', examTypeId);
        if (hasQuestionGroups !== undefined) params.append('hasQuestionGroups', hasQuestionGroups.toString());

        const response = await api.get<ApiResponse<ExamSectionDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }
}

export const examSectionService = new ExamSectionService();