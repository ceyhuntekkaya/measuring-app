import api from "@/services/api/base-api";
import { ApiResponse } from "@/types/exam/examValidationAndAnalytics";
import {
    BranchDto,
    BranchFormData,
    BranchStatistics,
    BrandBranchesSummary,
    CopyBranchRequest,
    MoveBranchRequest
} from "@/types/management/brand";

class BranchService {
    private readonly baseUrl = '/branches';

    async createBranch(createRequest: BranchFormData): Promise<ApiResponse<BranchDto>> {
        const response = await api.post<ApiResponse<BranchDto>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateBranch(id: string, updateRequest: BranchFormData): Promise<ApiResponse<BranchDto>> {
        const response = await api.put<ApiResponse<BranchDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async getBranchById(id: string): Promise<ApiResponse<BranchDto>> {
        const response = await api.get<ApiResponse<BranchDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getBranchByCode(code: string): Promise<ApiResponse<BranchDto>> {
        const response = await api.get<ApiResponse<BranchDto>>(`${this.baseUrl}/code/${code}`);
        return response.data;
    }

    async getBranchesByBrand(brandId: string): Promise<ApiResponse<BranchDto[]>> {
        const response = await api.get<ApiResponse<BranchDto[]>>(`${this.baseUrl}/brand/${brandId}`);
        return response.data;
    }

    async getAllBranches(): Promise<ApiResponse<BranchDto[]>> {
        const response = await api.get<ApiResponse<BranchDto[]>>(`${this.baseUrl}`);
        return response.data;
    }

    async searchBranchesByName(name: string): Promise<ApiResponse<BranchDto[]>> {
        const params = new URLSearchParams({ name });
        const response = await api.get<ApiResponse<BranchDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }

    async deleteBranch(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async copyBranch(branchId: string, copyRequest: CopyBranchRequest): Promise<ApiResponse<BranchDto>> {
        const response = await api.post<ApiResponse<BranchDto>>(`${this.baseUrl}/${branchId}/copy`, copyRequest);
        return response.data;
    }

    async moveBranch(branchId: string, moveRequest: MoveBranchRequest): Promise<ApiResponse<BranchDto>> {
        const response = await api.put<ApiResponse<BranchDto>>(`${this.baseUrl}/${branchId}/move`, moveRequest);
        return response.data;
    }

    async bulkCreateBranches(createRequests: BranchFormData[]): Promise<ApiResponse<BranchDto[]>> {
        const response = await api.post<ApiResponse<BranchDto[]>>(`${this.baseUrl}/bulk`, createRequests);
        return response.data;
    }

    async getBranchStatistics(id: string): Promise<ApiResponse<BranchStatistics>> {
        const response = await api.get<ApiResponse<BranchStatistics>>(`${this.baseUrl}/${id}/statistics`);
        return response.data;
    }

    async getBrandBranchesSummary(brandId: string): Promise<ApiResponse<BrandBranchesSummary>> {
        const response = await api.get<ApiResponse<BrandBranchesSummary>>(`${this.baseUrl}/brand/${brandId}/summary`);
        return response.data;
    }
}

export const branchService = new BranchService();