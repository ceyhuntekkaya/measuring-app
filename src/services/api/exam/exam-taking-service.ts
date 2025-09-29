// services/api/exam/exam-taking-service.ts

import api from "@/services/api/base-api";
import { ApiResponse } from '@/types/exam/examValidationAndAnalytics';
import { ExamDto } from '@/types/exam/examEntities';
import {ApplicationDto} from "@/types/management/brand";
import {ExamAnswer, LoginCredentials, SectionProgress, TakingExamSession} from "@/types/exam/exam-taking";

class ExamTakingService {
    private baseUrl = '/exam-taking';

    async loginWithCredentials(credentials: LoginCredentials): Promise<ApiResponse<ApplicationDto>> {
        const response = await api.post(`${this.baseUrl}/login`, credentials);
        return response.data;
    }

    async getApplicationByCredentials(username: string, password: string): Promise<ApiResponse<ApplicationDto>> {
        const response = await api.post(`${this.baseUrl}/application/credentials`, {
            username,
            password
        });
        return response.data;
    }

    async getExamByApplication(applicationId: string): Promise<ApiResponse<ExamDto>> {
        const response = await api.get(`${this.baseUrl}/application/${applicationId}/exam`);
        return response.data;
    }

    async startExam(applicationId: string): Promise<ApiResponse<TakingExamSession>> {
        const response = await api.post(`${this.baseUrl}/application/${applicationId}/start`);
        return response.data;
    }

    async getExamSession(applicationId: string): Promise<ApiResponse<TakingExamSession>> {
        const response = await api.get(`${this.baseUrl}/application/${applicationId}/session`);
        return response.data;
    }

    async startExamSection(applicationId: string, sectionId: string): Promise<ApiResponse<SectionProgress>> {
        const response = await api.post(`${this.baseUrl}/application/${applicationId}/section/${sectionId}/start`);
        return response.data;
    }

    async completeExamSection(applicationId: string, sectionId: string): Promise<ApiResponse<TakingExamSession>> {
        const response = await api.post(`${this.baseUrl}/application/${applicationId}/section/${sectionId}/complete`);
        return response.data;
    }

    async completeExam(applicationId: string): Promise<ApiResponse<TakingExamSession>> {
        const response = await api.post(`${this.baseUrl}/application/${applicationId}/complete`);
        return response.data;
    }

    async saveAnswer(applicationId: string, answer: ExamAnswer): Promise<ApiResponse<void>> {
        const response = await api.post(`${this.baseUrl}/application/${applicationId}/answer`, answer);
        return response.data;
    }

    async saveProgress(applicationId: string, progress: SectionProgress): Promise<ApiResponse<void>> {
        const response = await api.put(`${this.baseUrl}/application/${applicationId}/progress`, progress);
        return response.data;
    }

    async getAvailableExamSections(applicationId: string): Promise<ApiResponse<string[]>> {
        const response = await api.get(`${this.baseUrl}/application/${applicationId}/available-sections`);
        return response.data;
    }

    async validateExamAccess(applicationId: string): Promise<ApiResponse<boolean>> {
        const response = await api.get(`${this.baseUrl}/application/${applicationId}/validate-access`);
        return response.data;
    }
}

export const examTakingService = new ExamTakingService();