import api from "@/services/api/base-api";
import { ApiResponse } from "@/types/exam/examValidationAndAnalytics";
import {
    ApplicationDto,
    CreateApplicationRequest,
    UpdateApplicationRequest,
    StartApplicationRequest,
    CompleteApplicationRequest,
    BulkCreateApplicationRequest,
    ApplicationStatistics,
    ExamSessionApplicationsSummary,
    ApplicationSearchParams
} from "@/types/management/brand";

class ApplicationService {
    private readonly baseUrl = '/applications';

    async createApplication(createRequest: CreateApplicationRequest): Promise<ApiResponse<ApplicationDto>> {
        const response = await api.post<ApiResponse<ApplicationDto>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateApplication(id: string, updateRequest: UpdateApplicationRequest): Promise<ApiResponse<ApplicationDto>> {
        const response = await api.put<ApiResponse<ApplicationDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async startApplication(startRequest: StartApplicationRequest): Promise<ApiResponse<ApplicationDto>> {
        const response = await api.post<ApiResponse<ApplicationDto>>(`${this.baseUrl}/start`, startRequest);
        return response.data;
    }

    async completeApplication(completeRequest: CompleteApplicationRequest): Promise<ApiResponse<ApplicationDto>> {
        const response = await api.post<ApiResponse<ApplicationDto>>(`${this.baseUrl}/complete`, completeRequest);
        return response.data;
    }

    async getApplicationById(id: string): Promise<ApiResponse<ApplicationDto>> {
        const response = await api.get<ApiResponse<ApplicationDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getApplicationsByExamSession(examSessionId: string): Promise<ApiResponse<ApplicationDto[]>> {
        const response = await api.get<ApiResponse<ApplicationDto[]>>(`${this.baseUrl}/exam-session/${examSessionId}`);
        return response.data;
    }

    async getApplicationsByCandidate(candidateId: string): Promise<ApiResponse<ApplicationDto[]>> {
        const response = await api.get<ApiResponse<ApplicationDto[]>>(`${this.baseUrl}/candidate/${candidateId}`);
        return response.data;
    }

    async getApplicationsAwaitingEvaluation(): Promise<ApiResponse<ApplicationDto[]>> {
        const response = await api.get<ApiResponse<ApplicationDto[]>>(`${this.baseUrl}/awaiting-evaluation`);
        return response.data;
    }

    async bulkCreateApplications(bulkRequest: BulkCreateApplicationRequest): Promise<ApiResponse<ApplicationDto[]>> {
        const response = await api.post<ApiResponse<ApplicationDto[]>>(`${this.baseUrl}/bulk`, bulkRequest);
        return response.data;
    }

    async deleteApplication(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getApplicationStatistics(examSessionId: string): Promise<ApiResponse<ApplicationStatistics>> {
        const response = await api.get<ApiResponse<ApplicationStatistics>>(`${this.baseUrl}/exam-session/${examSessionId}/statistics`);
        return response.data;
    }

    async getExamSessionApplicationsSummary(examSessionId: string): Promise<ApiResponse<ExamSessionApplicationsSummary>> {
        const response = await api.get<ApiResponse<ExamSessionApplicationsSummary>>(`${this.baseUrl}/exam-session/${examSessionId}/summary`);
        return response.data;
    }

    async searchApplications(searchParams: ApplicationSearchParams = {}): Promise<ApiResponse<ApplicationDto[]>> {
        const params = new URLSearchParams();

        if (searchParams.name) params.append('name', searchParams.name);
        if (searchParams.examSessionId) params.append('examSessionId', searchParams.examSessionId);
        if (searchParams.candidateId) params.append('candidateId', searchParams.candidateId);
        if (searchParams.isCompleted !== undefined) params.append('isCompleted', searchParams.isCompleted.toString());
        if (searchParams.isEvaluated !== undefined) params.append('isEvaluated', searchParams.isEvaluated.toString());

        const response = await api.get<ApiResponse<ApplicationDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }

    // Convenience methods for common application workflows
    async startApplicationById(applicationId: string): Promise<ApiResponse<ApplicationDto>> {
        return this.startApplication({
            applicationId,
            startedAt: new Date().toISOString()
        });
    }

    async completeApplicationById(applicationId: string): Promise<ApiResponse<ApplicationDto>> {
        return this.completeApplication({
            applicationId,
            endedAt: new Date().toISOString()
        });
    }

    // Method for quick application creation with minimal data
    async quickCreateApplication(
        name: string,
        code: string,
        examId: string,
        examSessionId: string,
        candidateId: string,
        username?: string
    ): Promise<ApiResponse<ApplicationDto>> {
        return this.createApplication({
            name,
            code,
            examId,
            examSessionId,
            candidateId,
            username
        });
    }

    // Batch operations helper
    async createApplicationsForCandidates(
        examSessionId: string,
        examId: string,
        candidateIds: string[],
        namePrefix: string = "Application",
        codePrefix: string = "APP"
    ): Promise<ApiResponse<ApplicationDto[]>> {
        return this.bulkCreateApplications({
            examSessionId,
            examId,
            candidateIds,
            namePrefix,
            codePrefix
        });
    }
}

export const applicationService = new ApplicationService();