import api from "@/services/api/base-api";
import {ECurriculumLevel} from "@/types/exam/enum";
import {ApiResponse} from "@/types/exam/examValidationAndAnalytics";
import {CurriculumContentDto} from "@/types/exam/examEntities";

// Request DTOs
export interface CreateCurriculumContentRequest {
    curriculumId: string;
    parentId?: string;
    code: string;
    content: string;
    level: ECurriculumLevel;
    orderNumber?: number;
}

export interface UpdateCurriculumContentRequest {
    code?: string;
    content?: string;
    level?: ECurriculumLevel;
    orderNumber?: number;
}

export interface CurriculumContentSearchRequest {
    curriculumId?: string;
    code?: string;
    content?: string;
    level?: ECurriculumLevel;
}

export interface CurriculumContentStatistics {
    curriculumId: string;
    totalContents: number;
    contentsByLevel: Record<string, number>;
    maxDepth: number;
    rootContents: number;
}

class CurriculumContentService {
    private readonly baseUrl = '/curriculum-contents';

    async createCurriculumContent(createRequest: CreateCurriculumContentRequest): Promise<ApiResponse<CurriculumContentDto>> {
        const response = await api.post<ApiResponse<CurriculumContentDto>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateCurriculumContent(id: string, updateRequest: UpdateCurriculumContentRequest): Promise<ApiResponse<CurriculumContentDto>> {
        const response = await api.put<ApiResponse<CurriculumContentDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async getCurriculumContentById(id: string): Promise<ApiResponse<CurriculumContentDto>> {
        const response = await api.get<ApiResponse<CurriculumContentDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getCurriculumContentTree(curriculumId: string): Promise<ApiResponse<CurriculumContentDto[]>> {
        const response = await api.get<ApiResponse<CurriculumContentDto[]>>(`${this.baseUrl}/curriculum/${curriculumId}/tree`);
        return response.data;
    }

    async getCurriculumContentByLevel(curriculumId: string, level: ECurriculumLevel): Promise<ApiResponse<CurriculumContentDto[]>> {
        const response = await api.get<ApiResponse<CurriculumContentDto[]>>(`${this.baseUrl}/curriculum/${curriculumId}/level/${level}`);
        return response.data;
    }

    async getCurriculumContentByParent(parentId: string): Promise<ApiResponse<CurriculumContentDto[]>> {
        const response = await api.get<ApiResponse<CurriculumContentDto[]>>(`${this.baseUrl}/parent/${parentId}/children`);
        return response.data;
    }

    async deleteCurriculumContent(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async moveCurriculumContent(contentId: string, newParentId?: string): Promise<ApiResponse<CurriculumContentDto>> {
        const response = await api.put<ApiResponse<CurriculumContentDto>>(`${this.baseUrl}/${contentId}/move`, { newParentId });
        return response.data;
    }

    async reorderCurriculumContent(curriculumId: string, parentId: string | null, contentIds: string[]): Promise<ApiResponse<CurriculumContentDto[]>> {
        const response = await api.put<ApiResponse<CurriculumContentDto[]>>(`${this.baseUrl}/curriculum/${curriculumId}/reorder`, {
            parentId,
            contentIds
        });
        return response.data;
    }

    async copyCurriculumContentTree(contentId: string, targetCurriculumId: string, targetParentId?: string): Promise<ApiResponse<CurriculumContentDto>> {
        const response = await api.post<ApiResponse<CurriculumContentDto>>(`${this.baseUrl}/${contentId}/copy`, {
            targetCurriculumId,
            targetParentId
        });
        return response.data;
    }

    async searchCurriculumContent(searchRequest: CurriculumContentSearchRequest): Promise<ApiResponse<CurriculumContentDto[]>> {
        const params = new URLSearchParams();

        if (searchRequest.curriculumId) params.append('curriculumId', searchRequest.curriculumId);
        if (searchRequest.code) params.append('code', searchRequest.code);
        if (searchRequest.content) params.append('content', searchRequest.content);
        if (searchRequest.level) params.append('level', searchRequest.level);

        const response = await api.get<ApiResponse<CurriculumContentDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }

    async getCurriculumContentStatistics(curriculumId: string): Promise<ApiResponse<CurriculumContentStatistics>> {
        const response = await api.get<ApiResponse<CurriculumContentStatistics>>(`${this.baseUrl}/curriculum/${curriculumId}/statistics`);
        return response.data;
    }
}

export const curriculumContentService = new CurriculumContentService();