import api from "@/services/api/base-api";
import { ApiResponse } from "@/types/exam/examValidationAndAnalytics";
import {
    ApplicationGraderDto,
    CreateApplicationGraderRequest,
    UpdateApplicationGraderRequest,
    GraderStatistics,
    ApplicationGradingSummary,
    GraderWorkload,
    GraderSearchParams
} from "@/types/management/brand";

class ApplicationGraderService {
    private readonly baseUrl = '/application-graders';

    async assignGraderToApplication(createRequest: CreateApplicationGraderRequest): Promise<ApiResponse<ApplicationGraderDto>> {
        const response = await api.post<ApiResponse<ApplicationGraderDto>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateGraderAssignment(id: string, updateRequest: UpdateApplicationGraderRequest): Promise<ApiResponse<ApplicationGraderDto>> {
        const response = await api.put<ApiResponse<ApplicationGraderDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async completeGrading(id: string): Promise<ApiResponse<ApplicationGraderDto>> {
        const response = await api.post<ApiResponse<ApplicationGraderDto>>(`${this.baseUrl}/${id}/complete`);
        return response.data;
    }

    async getGradersByApplication(applicationId: string): Promise<ApiResponse<ApplicationGraderDto[]>> {
        const response = await api.get<ApiResponse<ApplicationGraderDto[]>>(`${this.baseUrl}/application/${applicationId}`);
        return response.data;
    }

    async getApplicationsByGrader(userId: string): Promise<ApiResponse<ApplicationGraderDto[]>> {
        const response = await api.get<ApiResponse<ApplicationGraderDto[]>>(`${this.baseUrl}/grader/${userId}`);
        return response.data;
    }

    async getRefereeGradersByApplication(applicationId: string): Promise<ApiResponse<ApplicationGraderDto[]>> {
        const response = await api.get<ApiResponse<ApplicationGraderDto[]>>(`${this.baseUrl}/application/${applicationId}/referees`);
        return response.data;
    }

    async removeGraderFromApplication(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async bulkAssignGraders(applicationId: string, assignmentRequests: CreateApplicationGraderRequest[]): Promise<ApiResponse<ApplicationGraderDto[]>> {
        const response = await api.post<ApiResponse<ApplicationGraderDto[]>>(`${this.baseUrl}/application/${applicationId}/bulk`, assignmentRequests);
        return response.data;
    }

    async getGraderStatistics(applicationId: string): Promise<ApiResponse<GraderStatistics>> {
        const response = await api.get<ApiResponse<GraderStatistics>>(`${this.baseUrl}/application/${applicationId}/statistics`);
        return response.data;
    }

    async getApplicationGradingSummary(applicationId: string): Promise<ApiResponse<ApplicationGradingSummary>> {
        const response = await api.get<ApiResponse<ApplicationGradingSummary>>(`${this.baseUrl}/application/${applicationId}/summary`);
        return response.data;
    }

    async getGraderWorkload(userId: string): Promise<ApiResponse<GraderWorkload>> {
        const response = await api.get<ApiResponse<GraderWorkload>>(`${this.baseUrl}/grader/${userId}/workload`);
        return response.data;
    }

    async searchGraderAssignments(searchParams: GraderSearchParams = {}): Promise<ApiResponse<ApplicationGraderDto[]>> {
        const params = new URLSearchParams();

        if (searchParams.applicationId) params.append('applicationId', searchParams.applicationId);
        if (searchParams.userId) params.append('userId', searchParams.userId);
        if (searchParams.isCompleted !== undefined) params.append('isCompleted', searchParams.isCompleted.toString());
        if (searchParams.isReferee !== undefined) params.append('isReferee', searchParams.isReferee.toString());

        const response = await api.get<ApiResponse<ApplicationGraderDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }

    // Convenience methods for common grading workflows
    async assignSingleGrader(
        userId: string,
        applicationId: string,
        orderNumber: number,
        isReferee: boolean = false,
        endEndDate?: string
    ): Promise<ApiResponse<ApplicationGraderDto>> {
        return this.assignGraderToApplication({
            userId,
            applicationId,
            orderNumber,
            isReferee,
            endEndDate
        });
    }

    async assignMultipleGraders(
        applicationId: string,
        graderAssignments: Array<{
            userId: string;
            orderNumber: number;
            isReferee?: boolean;
            endEndDate?: string;
        }>
    ): Promise<ApiResponse<ApplicationGraderDto[]>> {
        const requests = graderAssignments.map(assignment => ({
            userId: assignment.userId,
            applicationId,
            orderNumber: assignment.orderNumber,
            isReferee: assignment.isReferee || false,
            endEndDate: assignment.endEndDate
        }));

        return this.bulkAssignGraders(applicationId, requests);
    }

    async assignRefereeGrader(
        userId: string,
        applicationId: string,
        orderNumber: number,
        endEndDate?: string
    ): Promise<ApiResponse<ApplicationGraderDto>> {
        return this.assignSingleGrader(userId, applicationId, orderNumber, true, endEndDate);
    }

    // Helper methods for grading progress tracking
    async getCompletedGradersForApplication(applicationId: string): Promise<ApiResponse<ApplicationGraderDto[]>> {
        return this.searchGraderAssignments({
            applicationId,
            isCompleted: true
        });
    }

    async getPendingGradersForApplication(applicationId: string): Promise<ApiResponse<ApplicationGraderDto[]>> {
        return this.searchGraderAssignments({
            applicationId,
            isCompleted: false
        });
    }

    async getCompletedAssignmentsForGrader(userId: string): Promise<ApiResponse<ApplicationGraderDto[]>> {
        return this.searchGraderAssignments({
            userId,
            isCompleted: true
        });
    }

    async getPendingAssignmentsForGrader(userId: string): Promise<ApiResponse<ApplicationGraderDto[]>> {
        return this.searchGraderAssignments({
            userId,
            isCompleted: false
        });
    }

    async getRefereeAssignmentsForGrader(userId: string): Promise<ApiResponse<ApplicationGraderDto[]>> {
        return this.searchGraderAssignments({
            userId,
            isReferee: true
        });
    }

    // Batch operations
    async completeMultipleGradings(graderIds: string[]): Promise<ApiResponse<ApplicationGraderDto>[]> {
        const promises = graderIds.map(id => this.completeGrading(id));
        return Promise.all(promises);
    }

    async removeMultipleGraders(graderIds: string[]): Promise<ApiResponse<void>[]> {
        const promises = graderIds.map(id => this.removeGraderFromApplication(id));
        return Promise.all(promises);
    }

    // Analytics and reporting helpers
    async getApplicationGradingProgress(applicationId: string): Promise<{
        statistics: ApiResponse<GraderStatistics>;
        summary: ApiResponse<ApplicationGradingSummary>;
        allGraders: ApiResponse<ApplicationGraderDto[]>;
        referees: ApiResponse<ApplicationGraderDto[]>;
    }> {
        const [statistics, summary, allGraders, referees] = await Promise.all([
            this.getGraderStatistics(applicationId),
            this.getApplicationGradingSummary(applicationId),
            this.getGradersByApplication(applicationId),
            this.getRefereeGradersByApplication(applicationId)
        ]);

        return { statistics, summary, allGraders, referees };
    }

    async getGraderPerformanceData(userId: string): Promise<{
        workload: ApiResponse<GraderWorkload>;
        allAssignments: ApiResponse<ApplicationGraderDto[]>;
        completedAssignments: ApiResponse<ApplicationGraderDto[]>;
        pendingAssignments: ApiResponse<ApplicationGraderDto[]>;
        refereeAssignments: ApiResponse<ApplicationGraderDto[]>;
    }> {
        const [workload, allAssignments, completedAssignments, pendingAssignments, refereeAssignments] = await Promise.all([
            this.getGraderWorkload(userId),
            this.getApplicationsByGrader(userId),
            this.getCompletedAssignmentsForGrader(userId),
            this.getPendingAssignmentsForGrader(userId),
            this.getRefereeAssignmentsForGrader(userId)
        ]);

        return { workload, allAssignments, completedAssignments, pendingAssignments, refereeAssignments };
    }
}

export const applicationGraderService = new ApplicationGraderService();