
import api from "@/services/api/base-api";
import { EExamCategory } from "@/types/exam/enum";
import {CurriculumDto} from "@/types/exam/examEntities";
import {ApiResponse} from "@/types/exam/examValidationAndAnalytics";
import {
    CreateCurriculumRequest, CurriculumContentSummary, CurriculumListResponse,
    CurriculumSearchRequest, CurriculumStatistics,
    CurriculumWithContentDto,
    UpdateCurriculumRequest
} from "@/types/exam/examResponses";


class CurriculumService {
    private readonly baseUrl = '/curricula';

    async createCurriculum(createRequest: CreateCurriculumRequest): Promise<ApiResponse<CurriculumDto>> {
        const response = await api.post<ApiResponse<CurriculumDto>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateCurriculum(id: string, updateRequest: UpdateCurriculumRequest): Promise<ApiResponse<CurriculumDto>> {
        const response = await api.put<ApiResponse<CurriculumDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async getCurriculumById(id: string): Promise<ApiResponse<CurriculumDto>> {
        const response = await api.get<ApiResponse<CurriculumDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getCurriculumWithContent(id: string): Promise<ApiResponse<CurriculumWithContentDto>> {
        const response = await api.get<ApiResponse<CurriculumWithContentDto>>(`${this.baseUrl}/${id}/with-content`);
        return response.data;
    }

    async getAllCurricula(searchRequest: CurriculumSearchRequest = {}): Promise<ApiResponse<CurriculumListResponse>> {
        const params = new URLSearchParams();

        if (searchRequest.name) params.append('name', searchRequest.name);
        if (searchRequest.description) params.append('description', searchRequest.description);
        if (searchRequest.category) params.append('category', searchRequest.category);
        if (searchRequest.page !== undefined) params.append('page', searchRequest.page.toString());
        if (searchRequest.size !== undefined) params.append('size', searchRequest.size.toString());
        if (searchRequest.sortBy) params.append('sortBy', searchRequest.sortBy);
        if (searchRequest.sortDirection) params.append('sortDirection', searchRequest.sortDirection);

        const response = await api.get<ApiResponse<CurriculumListResponse>>(`${this.baseUrl}?${params}`);
        return response.data;
    }

    async getCurriculaByCategory(category: EExamCategory): Promise<ApiResponse<CurriculumDto[]>> {
        const response = await api.get<ApiResponse<CurriculumDto[]>>(`${this.baseUrl}/by-category/${category}`);
        return response.data;
    }

    async deleteCurriculum(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async copyCurriculum(id: string, newName: string): Promise<ApiResponse<CurriculumDto>> {
        const response = await api.post<ApiResponse<CurriculumDto>>(`${this.baseUrl}/${id}/copy`, { newName });
        return response.data;
    }

    async getCurriculumStatistics(id: string): Promise<ApiResponse<CurriculumStatistics>> {
        const response = await api.get<ApiResponse<CurriculumStatistics>>(`${this.baseUrl}/${id}/statistics`);
        return response.data;
    }

    async bulkCreateCurricula(createRequests: CreateCurriculumRequest[]): Promise<ApiResponse<CurriculumDto[]>> {
        const response = await api.post<ApiResponse<CurriculumDto[]>>(`${this.baseUrl}/bulk`, createRequests);
        return response.data;
    }

    async searchCurriculaByName(namePattern: string): Promise<ApiResponse<CurriculumDto[]>> {
        const params = new URLSearchParams({ namePattern });
        const response = await api.get<ApiResponse<CurriculumDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }

    async getCurriculumContentSummary(id: string): Promise<ApiResponse<CurriculumContentSummary>> {
        const response = await api.get<ApiResponse<CurriculumContentSummary>>(`${this.baseUrl}/${id}/content-summary`);
        return response.data;
    }
}

export const curriculumService = new CurriculumService();