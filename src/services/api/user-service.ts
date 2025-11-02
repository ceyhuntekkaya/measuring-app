import api from "@/services/api/base-api";
import {ApiResponse} from "@/types/exam/examValidationAndAnalytics";
import {
    ChangePasswordRequest,
    Department, PaginatedResponse,
    Permission,
    ResetPasswordRequest,
    Role,
    UserDto,
    UserFormData,
    UserSearchRequest,
    UserStatistics,
    UserSummary
} from "@/types/auth";

class UserService {
    private readonly baseUrl = '/users';

    // CRUD Operations
    async createUser(createRequest: UserFormData): Promise<ApiResponse<UserDto>> {
        const response = await api.post<ApiResponse<UserDto>>(`${this.baseUrl}`, createRequest);
        return response.data;
    }

    async updateUser(id: string, updateRequest: UserFormData): Promise<ApiResponse<UserDto>> {
        const response = await api.put<ApiResponse<UserDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async getUserById(id: string): Promise<ApiResponse<UserDto>> {
        const response = await api.get<ApiResponse<UserDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async deleteUser(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    // Search by different criteria
    async getUserByUsername(username: string): Promise<ApiResponse<UserDto>> {
        const response = await api.get<ApiResponse<UserDto>>(`${this.baseUrl}/username/${username}`);
        return response.data;
    }

    async getUserByEmail(email: string): Promise<ApiResponse<UserDto>> {
        const response = await api.get<ApiResponse<UserDto>>(`${this.baseUrl}/email/${email}`);
        return response.data;
    }

    async getUserByIdentityNumber(identityNumber: string): Promise<ApiResponse<UserDto>> {
        const response = await api.get<ApiResponse<UserDto>>(`${this.baseUrl}/identity/${identityNumber}`);
        return response.data;
    }

    async getUserByMobilePhone(mobilePhone: string): Promise<ApiResponse<UserDto>> {
        const response = await api.get<ApiResponse<UserDto>>(`${this.baseUrl}/phone/${mobilePhone}`);
        return response.data;
    }

    // Listing operations
    async getAllUsers(): Promise<ApiResponse<UserDto[]>> {
        const response = await api.get<ApiResponse<UserDto[]>>(`${this.baseUrl}`);
        return response.data;
    }

    async getUsersWithPagination(params: {
        page?: number;
        size?: number;
        sortBy?: string;
        sortDirection?: 'ASC' | 'DESC';
    } = {}): Promise<ApiResponse<PaginatedResponse<UserDto>>> {
        const {
            page = 0,
            size = 20,
            sortBy = 'name',
            sortDirection = 'ASC'
        } = params;

        const searchParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sortBy,
            sortDirection
        });

        const response = await api.get<ApiResponse<PaginatedResponse<UserDto>>>(`${this.baseUrl}/paginated?${searchParams}`);
        return response.data;
    }

    // Search operations
    async searchUsersByName(name: string): Promise<ApiResponse<UserDto[]>> {
        const params = new URLSearchParams({ name });
        const response = await api.get<ApiResponse<UserDto[]>>(`${this.baseUrl}/search/name?${params}`);
        return response.data;
    }

    async getUsersByDepartment(department: Department): Promise<ApiResponse<UserDto[]>> {
        const response = await api.get<ApiResponse<UserDto[]>>(`${this.baseUrl}/department/${department}`);
        return response.data;
    }

    async getUsersByRole(role: Role): Promise<ApiResponse<UserDto[]>> {
        const response = await api.get<ApiResponse<UserDto[]>>(`${this.baseUrl}/role/${role}`);
        return response.data;
    }

    async getUsersByPermission(permission: Permission): Promise<ApiResponse<UserDto[]>> {
        const response = await api.get<ApiResponse<UserDto[]>>(`${this.baseUrl}/permission/${permission}`);
        return response.data;
    }

    async getUsersByBrandId(brandId: string): Promise<ApiResponse<UserDto[]>> {
        const response = await api.get<ApiResponse<UserDto[]>>(`${this.baseUrl}/brand/${brandId}`);
        return response.data;
    }

    // Advanced search
    async searchUsers(searchRequest: UserSearchRequest): Promise<ApiResponse<UserDto[]>> {
        const response = await api.post<ApiResponse<UserDto[]>>(`${this.baseUrl}/search`, searchRequest);
        return response.data;
    }

    // Activity-based searches
    async getRecentlyActiveUsers(hoursBack: number = 24): Promise<ApiResponse<UserDto[]>> {
        const params = new URLSearchParams({ hoursBack: hoursBack.toString() });
        const response = await api.get<ApiResponse<UserDto[]>>(`${this.baseUrl}/active?${params}`);
        return response.data;
    }

    async getInactiveUsers(daysBack: number = 30): Promise<ApiResponse<UserDto[]>> {
        const params = new URLSearchParams({ daysBack: daysBack.toString() });
        const response = await api.get<ApiResponse<UserDto[]>>(`${this.baseUrl}/inactive?${params}`);
        return response.data;
    }

    // User management operations
    async updateLastLoginTime(userId: string): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>(`${this.baseUrl}/${userId}/login`);
        return response.data;
    }

    async activateUser(activationCode: string): Promise<ApiResponse<UserDto>> {
        const response = await api.post<ApiResponse<UserDto>>(`${this.baseUrl}/activate/${activationCode}`);
        return response.data;
    }

    async changePassword(userId: string, changePasswordRequest: ChangePasswordRequest): Promise<ApiResponse<void>> {
        const response = await api.put<ApiResponse<void>>(`${this.baseUrl}/${userId}/password`, changePasswordRequest);
        return response.data;
    }

    async resetPassword(resetPasswordRequest: ResetPasswordRequest): Promise<ApiResponse<void>> {
        const response = await api.post<ApiResponse<void>>(`${this.baseUrl}/reset-password`, resetPasswordRequest);
        return response.data;
    }

    // Bulk operations
    async bulkCreateUsers(createRequests: UserFormData[]): Promise<ApiResponse<UserDto[]>> {
        const response = await api.post<ApiResponse<UserDto[]>>(`${this.baseUrl}/bulk`, createRequests);
        return response.data;
    }

    // Statistics and reporting
    async getUserStatistics(): Promise<ApiResponse<UserStatistics>> {
        const response = await api.get<ApiResponse<UserStatistics>>(`${this.baseUrl}/statistics`);
        return response.data;
    }

    async getUserSummary(id: string): Promise<ApiResponse<UserSummary>> {
        const response = await api.get<ApiResponse<UserSummary>>(`${this.baseUrl}/${id}/summary`);
        return response.data;
    }

    // Utility methods for frontend
    async checkUsernameAvailability(username: string): Promise<boolean> {
        try {
            await this.getUserByUsername(username);
            return false; // Username exists
        } catch (error) {
            console.error(error);
            return true; // Username doesn't exist, so it's available
        }
    }

    async checkEmailAvailability(email: string): Promise<boolean> {
        try {
            await this.getUserByEmail(email);
            return false; // Email exists
        } catch (error) {
            console.error(error);
            return true; // Email doesn't exist, so it's available
        }
    }

    // Helper method to format user display name
    formatUserDisplayName(user: UserDto): string {
        return `${user.name} ${user.lastName}`;
    }

    // Helper method to get user's full info string
    getUserInfoString(user: UserDto): string {
        return `${this.formatUserDisplayName(user)} (${user.username} - ${user.email})`;
    }

    // Helper method to check if user is active
    isUserActive(user: UserDto, daysThreshold: number = 30): boolean {
        if (!user.lastLoginTime) return false;

        const lastLogin = new Date(user.lastLoginTime);
        const threshold = new Date();
        threshold.setDate(threshold.getDate() - daysThreshold);

        return lastLogin > threshold;
    }

    // Helper method to get user's role names
    getUserRoleNames(user: UserDto): string[] {
        return user.roleSet ? Array.from(user.roleSet) : [];
    }

    // Helper method to get user's department names
    getUserDepartmentNames(user: UserDto): string[] {
        return user.departmentSet ? Array.from(user.departmentSet) : [];
    }

    // Helper method to get user's permission names
    getUserPermissionNames(user: UserDto): string[] {
        return user.authoritySet ? Array.from(user.authoritySet) : [];
    }

    // Helper method to check if user has specific role
    hasRole(user: UserDto, role: Role): boolean {
        return user.roleSet ? user.roleSet.includes(role) : false;
    }

    // Helper method to check if user has specific department
    hasDepartment(user: UserDto, department: Department): boolean {
        return user.departmentSet ? user.departmentSet.includes(department) : false;
    }

    // Helper method to check if user has specific permission
    hasPermission(user: UserDto, permission: Permission): boolean {
        return user.authoritySet ? user.authoritySet.includes(permission) : false;
    }

    // Helper method to get days since last login
    getDaysSinceLastLogin(user: UserDto): number | null {
        if (!user.lastLoginTime) return null;

        const lastLogin = new Date(user.lastLoginTime);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

export const userService = new UserService();