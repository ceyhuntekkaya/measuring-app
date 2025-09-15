import api from "@/services/api/base-api";
import { ApiResponse } from "@/types/exam/examValidationAndAnalytics";
import {
    CandidateDto,
    CreateCandidateRequest,
    UpdateCandidateRequest,
    ChangePasswordRequest,
    CandidateStatistics,
    CandidateSearchParams
} from "@/types/management/brand";

class CandidateService {
    private readonly baseUrl = '/candidates';

    async createCandidate(createRequest: CreateCandidateRequest): Promise<ApiResponse<CandidateDto>> {
        const response = await api.post<ApiResponse<CandidateDto>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateCandidate(id: string, updateRequest: UpdateCandidateRequest): Promise<ApiResponse<CandidateDto>> {
        const response = await api.put<ApiResponse<CandidateDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async getCandidateById(id: string): Promise<ApiResponse<CandidateDto>> {
        const response = await api.get<ApiResponse<CandidateDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getCandidateByUsername(username: string): Promise<ApiResponse<CandidateDto>> {
        const response = await api.get<ApiResponse<CandidateDto>>(`${this.baseUrl}/username/${username}`);
        return response.data;
    }

    async getCandidateByIdentityNumber(identityNumber: string): Promise<ApiResponse<CandidateDto>> {
        const response = await api.get<ApiResponse<CandidateDto>>(`${this.baseUrl}/identity/${identityNumber}`);
        return response.data;
    }

    async getAllCandidates(): Promise<ApiResponse<CandidateDto[]>> {
        const response = await api.get<ApiResponse<CandidateDto[]>>(`${this.baseUrl}`);
        return response.data;
    }

    async searchCandidates(searchParams: CandidateSearchParams = {}): Promise<ApiResponse<CandidateDto[]>> {
        const params = new URLSearchParams();

        if (searchParams.name) params.append('name', searchParams.name);
        if (searchParams.city) params.append('city', searchParams.city);
        if (searchParams.country) params.append('country', searchParams.country);
        if (searchParams.email) params.append('email', searchParams.email);

        const response = await api.get<ApiResponse<CandidateDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }

    async searchCandidatesByName(name: string): Promise<ApiResponse<CandidateDto[]>> {
        const params = new URLSearchParams({ name });
        const response = await api.get<ApiResponse<CandidateDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }

    async getCandidatesByCity(city: string): Promise<ApiResponse<CandidateDto[]>> {
        const response = await api.get<ApiResponse<CandidateDto[]>>(`${this.baseUrl}/city/${city}`);
        return response.data;
    }

    async getCandidatesByCountry(country: string): Promise<ApiResponse<CandidateDto[]>> {
        const response = await api.get<ApiResponse<CandidateDto[]>>(`${this.baseUrl}/country/${country}`);
        return response.data;
    }

    async changePassword(id: string, passwordRequest: ChangePasswordRequest): Promise<ApiResponse<void>> {
        const response = await api.put<ApiResponse<void>>(`${this.baseUrl}/${id}/change-password`, passwordRequest);
        return response.data;
    }

    async deleteCandidate(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async bulkCreateCandidates(createRequests: CreateCandidateRequest[]): Promise<ApiResponse<CandidateDto[]>> {
        const response = await api.post<ApiResponse<CandidateDto[]>>(`${this.baseUrl}/bulk`, createRequests);
        return response.data;
    }

    async getCandidateStatistics(): Promise<ApiResponse<CandidateStatistics>> {
        const response = await api.get<ApiResponse<CandidateStatistics>>(`${this.baseUrl}/statistics`);
        return response.data;
    }

    // Convenience methods for common operations
    async validateUsername(username: string): Promise<boolean> {
        try {
            const response = await this.getCandidateByUsername(username);
            return !response.success; // If we get a candidate, username exists (not available)
        } catch {
            return true; // If error, username is available
        }
    }

    async validateIdentityNumber(identityNumber: string): Promise<boolean> {
        try {
            const response = await this.getCandidateByIdentityNumber(identityNumber);
            return !response.success; // If we get a candidate, identity number exists (not available)
        } catch {
            return true; // If error, identity number is available
        }
    }

    async quickCreateCandidate(
        name: string,
        lastName: string,
        identityNumber: string,
        username: string,
        password: string,
        mobilePhone: string,
        email?: string
    ): Promise<ApiResponse<CandidateDto>> {
        return this.createCandidate({
            name,
            lastName,
            identityNumber,
            username,
            password,
            mobilePhone,
            email
        });
    }

    // Advanced search with filters
    async advancedSearch(filters: {
        name?: string;
        city?: string;
        country?: string;
        email?: string;
        identityNumber?: string;
        mobilePhone?: string;
    }): Promise<ApiResponse<CandidateDto[]>> {
        if (filters.identityNumber) {
            // If searching by identity number, use specific endpoint
            return this.getCandidateByIdentityNumber(filters.identityNumber)
                .then(response => ({
                    ...response,
                    data: response.success && response.data ? [response.data] : []
                }));
        }

        return this.searchCandidates({
            name: filters.name,
            city: filters.city,
            country: filters.country,
            email: filters.email
        });
    }

    // Get candidates for dropdown/select components
    async getCandidatesForSelection(): Promise<Array<{
        id: string;
        name: string;
        value: string;
        identityNumber: string;
        email?: string;
    }>> {
        const response = await this.getAllCandidates();

        if (!response.success || !response.data) {
            return [];
        }

        return response.data.map(candidate => ({
            id: candidate.id,
            name: `${candidate.name} ${candidate.lastName}`,
            value: candidate.id,
            identityNumber: candidate.identityNumber,
            email: candidate.email
        }));
    }

    // Batch operations helper
    async createCandidatesFromList(
        candidateData: Array<{
            name: string;
            lastName: string;
            identityNumber: string;
            mobilePhone: string;
            email?: string;
            city?: string;
            country?: string;
        }>
    ): Promise<ApiResponse<CandidateDto[]>> {
        const requests = candidateData.map((data, index) => ({
            ...data,
            username: `${data.name.toLowerCase()}.${data.lastName.toLowerCase()}${index}`.replace(/[^a-z.0-9]/g, ''),
            password: this.generateRandomPassword()
        }));

        return this.bulkCreateCandidates(requests);
    }

    // Utility methods
    private generateRandomPassword(length: number = 8): string {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }

    // Format candidate display name
    static formatCandidateName(candidate: CandidateDto): string {
        return `${candidate.name} ${candidate.lastName}`;
    }

    // Format candidate display with identity
    static formatCandidateWithIdentity(candidate: CandidateDto): string {
        return `${candidate.name} ${candidate.lastName} (${candidate.identityNumber})`;
    }

    // Check if candidate profile is complete
    static isProfileComplete(candidate: CandidateDto): boolean {
        return !!(
            candidate.name &&
            candidate.lastName &&
            candidate.identityNumber &&
            candidate.mobilePhone &&
            candidate.email &&
            candidate.city &&
            candidate.country
        );
    }
}

export const candidateService = new CandidateService();