import api from "@/services/api/base-api";
import { ApiResponse } from "@/types/exam/examValidationAndAnalytics";
import {
    ApplicationDto,
    ApplicationFormData,
    StartApplicationRequest,
    CompleteApplicationRequest,
    BulkCreateApplicationRequest,
    ApplicationStatistics,
    ExamSessionApplicationsSummary,
    ApplicationSearchParams, UpdateSessionStateRequest, CancelApplicationRequest
} from "@/types/management/brand";
import {EStatus} from "@/types/exam/enum";
import {EvaluationDto, UpdateApplicationState} from "@/types/exam/examEntities";

class ApplicationService {
    private readonly baseUrl = '/applications';

    async createApplication(createRequest: ApplicationFormData): Promise<ApiResponse<ApplicationDto>> {
        const response = await api.post<ApiResponse<ApplicationDto>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateApplication(id: string, updateRequest: ApplicationFormData): Promise<ApiResponse<ApplicationDto>> {
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







    async setApplicationStartedAt(applicationId: string): Promise<ApiResponse<ApplicationDto>> {
        const response = await api.post<ApiResponse<ApplicationDto>>(`${this.baseUrl}/${applicationId}/started-at`);
        return response.data;
    }
    async setApplicationEndedAt(applicationId: string): Promise<ApiResponse<ApplicationDto>> {
        const response = await api.post<ApiResponse<ApplicationDto>>(`${this.baseUrl}/${applicationId}/ended-at`);
        return response.data;
    }
    async updateApplicationSessionState(applicationId: string , updateRequest: UpdateSessionStateRequest): Promise<ApiResponse<ApplicationDto>> {
        const response = await api.post<ApiResponse<ApplicationDto>>(`${this.baseUrl}/${applicationId}/session-state`, updateRequest);
        return response.data;
    }
    async cancelApplication(applicationId: string, cancelRequest:CancelApplicationRequest): Promise<ApiResponse<ApplicationDto>> {
        const response = await api.post<ApiResponse<ApplicationDto>>(`${this.baseUrl}/exam-session/${applicationId}/cancel`, cancelRequest);
        return response.data;
    }
    async resetApplication(applicationId: string): Promise<ApiResponse<ApplicationDto>> {
        const response = await api.post<ApiResponse<ApplicationDto>>(`${this.baseUrl}/${applicationId}/reset`);
        return response.data;
    }
    async setApplicationEvaluated(applicationId: string): Promise<ApiResponse<ApplicationDto>> {
        const response = await api.post<ApiResponse<ApplicationDto>>(`${this.baseUrl}/${applicationId}/evaluated`);
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
            id: '',
            createdAt: new Date(),
            deletedAt: null,
            status: EStatus.ACTIVE,
            createdById: '',
            deletedById: '',
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

    async updateApplicationState(applicationId: string, updateApplicationState: UpdateApplicationState) {
        const response = await api.put<ApiResponse<ApplicationDto>>(`${this.baseUrl}/state/${applicationId}`, updateApplicationState);
        return response.data;

    }

    async getApplicationEvaluationsBySession(sessionId: string): Promise<ApiResponse<EvaluationDto[]>> {
        const response = await api.get<ApiResponse<EvaluationDto[]>>(`${this.baseUrl}/session/evaluation/${sessionId}`);
        return response.data;
    }



}

export const applicationService = new ApplicationService();