// services/api/exam-service.ts

import api from "@/services/api/base-api";
import { ApiResponse } from "@/types/exam/examValidationAndAnalytics";
import {
    ExamDto,
    CreateExamRequest,
    UpdateExamRequest,
    ExamFormData,
    ExamSearchRequest,
    ExamStatistics,
    ExamSummary,
    ExamPageRequest,
    CopyExamRequest,
    MoveExamRequest,
    ExamDashboardData,
    ExamValidationResult,
    ExamExportRequest,
    ExamImportRequest,
    ExamImportResult, QuestionAnswerRequest, EvaluationDto
} from "@/types/exam/examEntities";

class ExamService {
    private readonly baseUrl = '/exams';

    // Basic CRUD operations
    async createExam(createRequest: ExamFormData): Promise<ApiResponse<ExamDto>> {
        const request: CreateExamRequest = {
            name: createRequest.name,
            code: createRequest.code,
            examTypeId: createRequest.examTypeId,
            questionGroupIds: createRequest.questionGroupIds,
            branchId: createRequest.branchId,
            brandId: createRequest.brandId
        };

        const response = await api.post<ApiResponse<ExamDto>>(`${this.baseUrl}`, request);
        return response.data;
    }

    async updateExam(id: string, updateRequest: ExamFormData): Promise<ApiResponse<ExamDto>> {
        const request: UpdateExamRequest = {
            name: updateRequest.name,
            code: updateRequest.code,
            examTypeId: updateRequest.examTypeId,
            questionGroupIds: updateRequest.questionGroupIds,
            branchId: updateRequest.branchId,
            brandId: updateRequest.brandId
        };

        const response = await api.put<ApiResponse<ExamDto>>(`${this.baseUrl}/${id}`, request);
        return response.data;
    }

    async getExamById(id: string): Promise<ApiResponse<ExamDto>> {
        const response = await api.get<ApiResponse<ExamDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getExamByCode(code: string): Promise<ApiResponse<ExamDto>> {
        const response = await api.get<ApiResponse<ExamDto>>(`${this.baseUrl}/code/${code}`);
        return response.data;
    }

    async getAllExams(): Promise<ApiResponse<ExamDto[]>> {
        const response = await api.get<ApiResponse<ExamDto[]>>(`${this.baseUrl}`);
        return response.data;
    }

    async deleteExam(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    // Search and filtering
    async searchExams(searchRequest: ExamSearchRequest): Promise<ApiResponse<ExamDto[]>> {
        const response = await api.post<ApiResponse<ExamDto[]>>(`${this.baseUrl}/search`, searchRequest);
        return response.data;
    }

    async searchExamsByName(name: string): Promise<ApiResponse<ExamDto[]>> {
        const params = new URLSearchParams({ name });
        const response = await api.get<ApiResponse<ExamDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }

    // Get by related entities
    async getExamsByBrand(brandId: string): Promise<ApiResponse<ExamDto[]>> {
        const response = await api.get<ApiResponse<ExamDto[]>>(`${this.baseUrl}/brand/${brandId}`);
        return response.data;
    }

    async getExamsByBranch(branchId: string): Promise<ApiResponse<ExamDto[]>> {
        const response = await api.get<ApiResponse<ExamDto[]>>(`${this.baseUrl}/branch/${branchId}`);
        return response.data;
    }

    async getExamsByExamType(examTypeId: string): Promise<ApiResponse<ExamDto[]>> {
        const response = await api.get<ApiResponse<ExamDto[]>>(`${this.baseUrl}/exam-type/${examTypeId}`);
        return response.data;
    }

    // Bulk operations
    async bulkCreateExams(createRequests: ExamFormData[]): Promise<ApiResponse<ExamDto[]>> {
        const requests: CreateExamRequest[] = createRequests.map(req => ({
            name: req.name,
            code: req.code,
            examTypeId: req.examTypeId,
            questionGroupIds: req.questionGroupIds,
            branchId: req.branchId,
            brandId: req.brandId
        }));

        const response = await api.post<ApiResponse<ExamDto[]>>(`${this.baseUrl}/bulk`, requests);
        return response.data;
    }

    // Statistics and reporting
    async getExamStatistics(id: string): Promise<ApiResponse<ExamStatistics>> {
        const response = await api.get<ApiResponse<ExamStatistics>>(`${this.baseUrl}/${id}/statistics`);
        return response.data;
    }

    async getExamSummary(id: string): Promise<ApiResponse<ExamSummary>> {
        const response = await api.get<ApiResponse<ExamSummary>>(`${this.baseUrl}/${id}/summary`);
        return response.data;
    }

    async getExamDashboard(): Promise<ApiResponse<ExamDashboardData>> {
        const response = await api.get<ApiResponse<ExamDashboardData>>(`${this.baseUrl}/dashboard`);
        return response.data;
    }

    // Advanced operations
    async copyExam(examId: string, copyRequest: CopyExamRequest): Promise<ApiResponse<ExamDto>> {
        const response = await api.post<ApiResponse<ExamDto>>(`${this.baseUrl}/${examId}/copy`, copyRequest);
        return response.data;
    }

    async moveExam(examId: string, moveRequest: MoveExamRequest): Promise<ApiResponse<ExamDto>> {
        const response = await api.put<ApiResponse<ExamDto>>(`${this.baseUrl}/${examId}/move`, moveRequest);
        return response.data;
    }

    async duplicateExam(examId: string, newName: string, newCode: string): Promise<ApiResponse<ExamDto>> {
        const copyRequest: CopyExamRequest = {
            newName,
            newCode,
            copyQuestionGroups: true
        };
        return this.copyExam(examId, copyRequest);
    }

    // Validation
    async validateExam(examData: ExamFormData): Promise<ApiResponse<ExamValidationResult>> {
        const response = await api.post<ApiResponse<ExamValidationResult>>(`${this.baseUrl}/validate`, examData);
        return response.data;
    }

    async checkExamCodeAvailability(code: string, excludeId?: string): Promise<ApiResponse<boolean>> {
        const params = new URLSearchParams({ code });
        if (excludeId) {
            params.append('excludeId', excludeId);
        }
        const response = await api.get<ApiResponse<boolean>>(`${this.baseUrl}/check-code?${params}`);
        return response.data;
    }

    async checkExamNameAvailability(name: string, excludeId?: string): Promise<ApiResponse<boolean>> {
        const params = new URLSearchParams({ name });
        if (excludeId) {
            params.append('excludeId', excludeId);
        }
        const response = await api.get<ApiResponse<boolean>>(`${this.baseUrl}/check-name?${params}`);
        return response.data;
    }

    // Import/Export
    async exportExams(exportRequest: ExamExportRequest): Promise<Blob> {
        const response = await api.post(`${this.baseUrl}/export`, exportRequest, {
            responseType: 'blob',
        });
        return response.data;
    }

    async importExams(importRequest: ExamImportRequest): Promise<ApiResponse<ExamImportResult>> {
        const formData = new FormData();
        formData.append('file', importRequest.file);
        formData.append('format', importRequest.format);
        formData.append('validateOnly', importRequest.validateOnly.toString());
        formData.append('overwriteExisting', importRequest.overwriteExisting.toString());

        const response = await api.post<ApiResponse<ExamImportResult>>(
            `${this.baseUrl}/import`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    }

    // Pagination support
    async getExamsPaginated(pageRequest: ExamPageRequest): Promise<ApiResponse<{
        content: ExamDto[];
        totalElements: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
        hasNext: boolean;
        hasPrevious: boolean;
    }>> {
        const params = new URLSearchParams({
            page: pageRequest.page.toString(),
            size: pageRequest.size.toString(),
        });

        if (pageRequest.sort) {
            params.append('sort', `${pageRequest.sort.field},${pageRequest.sort.direction}`);
        }

        if (pageRequest.filter) {
            Object.entries(pageRequest.filter).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                }
            });
        }

        const response = await api.get(`${this.baseUrl}/paginated?${params}`);
        return response.data;
    }

    // Utility methods
    async getExamOptions(): Promise<ApiResponse<{ id: string; name: string; code: string }[]>> {
        const response = await api.get<ApiResponse<{ id: string; name: string; code: string }[]>>(
            `${this.baseUrl}/options`
        );
        return response.data;
    }

    async getExamsByIds(examIds: string[]): Promise<ApiResponse<ExamDto[]>> {
        const response = await api.post<ApiResponse<ExamDto[]>>(`${this.baseUrl}/by-ids`, { examIds });
        return response.data;
    }

    // Count operations
    async countExams(): Promise<ApiResponse<number>> {
        const response = await api.get<ApiResponse<number>>(`${this.baseUrl}/count`);
        return response.data;
    }

    async countExamsByBrand(brandId: string): Promise<ApiResponse<number>> {
        const response = await api.get<ApiResponse<number>>(`${this.baseUrl}/count/brand/${brandId}`);
        return response.data;
    }

    async countExamsByBranch(branchId: string): Promise<ApiResponse<number>> {
        const response = await api.get<ApiResponse<number>>(`${this.baseUrl}/count/branch/${branchId}`);
        return response.data;
    }

    async countExamsByExamType(examTypeId: string): Promise<ApiResponse<number>> {
        const response = await api.get<ApiResponse<number>>(`${this.baseUrl}/count/exam-type/${examTypeId}`);
        return response.data;
    }

    // Status operations (if needed for workflow management)
    async activateExam(id: string): Promise<ApiResponse<ExamDto>> {
        const response = await api.put<ApiResponse<ExamDto>>(`${this.baseUrl}/${id}/activate`);
        return response.data;
    }

    async deactivateExam(id: string): Promise<ApiResponse<ExamDto>> {
        const response = await api.put<ApiResponse<ExamDto>>(`${this.baseUrl}/${id}/deactivate`);
        return response.data;
    }

    async archiveExam(id: string): Promise<ApiResponse<ExamDto>> {
        const response = await api.put<ApiResponse<ExamDto>>(`${this.baseUrl}/${id}/archive`);
        return response.data;
    }

    async restoreExam(id: string): Promise<ApiResponse<ExamDto>> {
        const response = await api.put<ApiResponse<ExamDto>>(`${this.baseUrl}/${id}/restore`);
        return response.data;
    }

    async saveAnswer(createRequest: QuestionAnswerRequest) {
        const response = await api.post<ApiResponse<string>>(`/question/result/record/`, createRequest);
        return response.data;

    }

    async saveEvaluation(id:string, evaluation: EvaluationDto) {
        const response = await api.post<ApiResponse<string>>(`/question/result/record/${id}`, evaluation);
        return response.data;

    }
}

export const examService = new ExamService()