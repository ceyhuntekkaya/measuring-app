import api from "@/services/api/base-api";
import { ApiResponse } from "@/types/exam/examValidationAndAnalytics";
import {
    BrandDto,
    CreateBrandRequest,
    UpdateBrandRequest,
    BrandStatistics,
    BrandSummary
} from "@/types/management/brand";

class BrandService {
    private readonly baseUrl = '/brands';

    async createBrand(createRequest: CreateBrandRequest): Promise<ApiResponse<BrandDto>> {
        const response = await api.post<ApiResponse<BrandDto>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateBrand(id: string, updateRequest: UpdateBrandRequest): Promise<ApiResponse<BrandDto>> {
        const response = await api.put<ApiResponse<BrandDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async getBrandById(id: string): Promise<ApiResponse<BrandDto>> {
        const response = await api.get<ApiResponse<BrandDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getBrandByCode(code: string): Promise<ApiResponse<BrandDto>> {
        const response = await api.get<ApiResponse<BrandDto>>(`${this.baseUrl}/code/${code}`);
        return response.data;
    }

    async getAllBrands(): Promise<ApiResponse<BrandDto[]>> {
        const response = await api.get<ApiResponse<BrandDto[]>>(`${this.baseUrl}`);
        return response.data;
    }

    async searchBrandsByName(name: string): Promise<ApiResponse<BrandDto[]>> {
        const params = new URLSearchParams({ name });
        const response = await api.get<ApiResponse<BrandDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }

    async deleteBrand(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async bulkCreateBrands(createRequests: CreateBrandRequest[]): Promise<ApiResponse<BrandDto[]>> {
        const response = await api.post<ApiResponse<BrandDto[]>>(`${this.baseUrl}/bulk`, createRequests);
        return response.data;
    }

    async getBrandStatistics(id: string): Promise<ApiResponse<BrandStatistics>> {
        const response = await api.get<ApiResponse<BrandStatistics>>(`${this.baseUrl}/${id}/statistics`);
        return response.data;
    }

    async getBrandSummary(id: string): Promise<ApiResponse<BrandSummary>> {
        const response = await api.get<ApiResponse<BrandSummary>>(`${this.baseUrl}/${id}/summary`);
        return response.data;
    }
}

export const brandService = new BrandService();