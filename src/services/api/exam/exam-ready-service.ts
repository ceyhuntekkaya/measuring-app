
import api from "@/services/api/base-api";
import {ApiResponse} from "@/types/exam/examValidationAndAnalytics";
import {ExamReadyDto, ExamSectionReadyDto, QuestionGroupReadyDto, QuestionReadyDto} from "@/types/exam/examReady";
import {ExamNavigationDto, ExamReadinessValidation} from "@/types/exam/examEntities";
import {ExamPreview, ExamSessionInfo, ExamSessionResult, ExamSessionStatus} from "@/types/exam/examResponses";


class ExamReadyService {
    private readonly baseUrl = '/exam-ready';

    async getExamReady(examTypeId: string): Promise<ApiResponse<ExamReadyDto>> {
        const response = await api.get<ApiResponse<ExamReadyDto>>(`${this.baseUrl}/exam/${examTypeId}`);
        return response.data;
    }

    async getExamSectionsReady(examTypeId: string): Promise<ApiResponse<ExamSectionReadyDto[]>> {
        const response = await api.get<ApiResponse<ExamSectionReadyDto[]>>(`${this.baseUrl}/exam/${examTypeId}/sections`);
        return response.data;
    }

    async getQuestionGroupReady(questionGroupId: string): Promise<ApiResponse<QuestionGroupReadyDto>> {
        const response = await api.get<ApiResponse<QuestionGroupReadyDto>>(`${this.baseUrl}/question-group/${questionGroupId}`);
        return response.data;
    }

    async getQuestionReady(questionId: string): Promise<ApiResponse<QuestionReadyDto>> {
        const response = await api.get<ApiResponse<QuestionReadyDto>>(`${this.baseUrl}/question/${questionId}`);
        return response.data;
    }

    async validateExamReadiness(examTypeId: string): Promise<ApiResponse<ExamReadinessValidation>> {
        const response = await api.get<ApiResponse<ExamReadinessValidation>>(`${this.baseUrl}/exam/${examTypeId}/validate`);
        return response.data;
    }

    async getExamNavigation(examTypeId: string): Promise<ApiResponse<ExamNavigationDto>> {
        const response = await api.get<ApiResponse<ExamNavigationDto>>(`${this.baseUrl}/exam/${examTypeId}/navigation`);
        return response.data;
    }

    async getExamPreview(examTypeId: string): Promise<ApiResponse<ExamPreview>> {
        const response = await api.get<ApiResponse<ExamPreview>>(`${this.baseUrl}/exam/${examTypeId}/preview`);
        return response.data;
    }

    async getAvailableExams(examLevel?: string, examType?: string): Promise<ApiResponse<ExamPreview[]>> {
        const params = new URLSearchParams();
        if (examLevel) params.append('examLevel', examLevel);
        if (examType) params.append('examType', examType);

        const response = await api.get<ApiResponse<ExamPreview[]>>(`${this.baseUrl}/exams/available?${params}`);
        return response.data;
    }

    async startExamSession(examTypeId: string): Promise<ApiResponse<ExamSessionInfo>> {
        const response = await api.post<ApiResponse<ExamSessionInfo>>(`${this.baseUrl}/exam/${examTypeId}/start`);
        return response.data;
    }

    async getSessionStatus(sessionId: string): Promise<ApiResponse<ExamSessionStatus>> {
        const response = await api.get<ApiResponse<ExamSessionStatus>>(`${this.baseUrl}/session/${sessionId}/status`);
        return response.data;
    }

    async endExamSession(sessionId: string): Promise<ApiResponse<ExamSessionResult>> {
        const response = await api.post<ApiResponse<ExamSessionResult>>(`${this.baseUrl}/session/${sessionId}/end`);
        return response.data;
    }
}

export const examReadyService = new ExamReadyService();