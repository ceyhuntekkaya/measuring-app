import { useState, useCallback } from 'react';

import {
    UserDto,
    UserFormData,
    UserStatistics,
    UserSummary,
    UserSearchRequest,
    ChangePasswordRequest,
    ResetPasswordRequest,
    PaginatedResponse,
    Department, Permission, Role
} from '@/types/auth';
import { showNotification } from '@/lib/notification';
import {userService} from "@/services/api/user-service";

interface UseUserReturn {
    users: UserDto[] | null;
    selectedUser: UserDto | null;
    paginatedUsers: PaginatedResponse<UserDto> | null;
    userStatistics: UserStatistics | null;
    userSummary: UserSummary | null;
    loading: boolean;
    error: Error | null;

    // CRUD Operations
    createUser: (createRequest: UserFormData) => Promise<void>;
    updateUser: (updateRequest: UserFormData) => Promise<void>;
    getUserById: (id: string) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;

    // Search Operations
    getUserByUsername: (username: string) => Promise<void>;
    getUserByEmail: (email: string) => Promise<void>;
    getUserByIdentityNumber: (identityNumber: string) => Promise<void>;
    getUserByMobilePhone: (mobilePhone: string) => Promise<void>;

    // Listing Operations
    getAllUsers: () => Promise<void>;
    getUsersWithPagination: (params?: {
        page?: number;
        size?: number;
        sortBy?: string;
        sortDirection?: 'ASC' | 'DESC';
    }) => Promise<void>;

    // Advanced Search
    searchUsersByName: (name: string) => Promise<void>;
    getUsersByDepartment: (department: Department) => Promise<void>;
    getUsersByRole: (role: Role) => Promise<void>;
    getUsersByPermission: (permission: Permission) => Promise<void>;
    getUsersByBrandId: (brandId: string) => Promise<void>;
    searchUsers: (searchRequest: UserSearchRequest) => Promise<void>;

    // Activity Operations
    getRecentlyActiveUsers: (hoursBack?: number) => Promise<void>;
    getInactiveUsers: (daysBack?: number) => Promise<void>;

    // User Management Operations
    updateLastLoginTime: (userId: string) => Promise<void>;
    activateUser: (activationCode: string) => Promise<void>;
    changePassword: (userId: string, changePasswordRequest: ChangePasswordRequest) => Promise<void>;
    resetPassword: (resetPasswordRequest: ResetPasswordRequest) => Promise<void>;

    // Bulk Operations
    bulkCreateUsers: (createRequests: UserFormData[]) => Promise<void>;

    // Statistics and Reporting
    getUserStatistics: () => Promise<void>;
    getUserSummary: (id: string) => Promise<void>;

    // Utility Functions
    checkUsernameAvailability: (username: string) => Promise<boolean>;
    checkEmailAvailability: (email: string) => Promise<boolean>;

    // Clear Data
    clearUserData: () => void;
}

export const useUser = (): UseUserReturn => {
    const [users, setUsers] = useState<UserDto[] | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
    const [paginatedUsers, setPaginatedUsers] = useState<PaginatedResponse<UserDto> | null>(null);
    const [userStatistics, setUserStatistics] = useState<UserStatistics | null>(null);
    const [userSummary, setUserSummary] = useState<UserSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // CRUD Operations
    const createUser = useCallback(async (createRequest: UserFormData) => {
        try {
            setLoading(true);
            setError(null);
            console.log(createRequest);
            console.log(JSON.stringify(createRequest));
            const response = await userService.createUser(createRequest);
            if (response.data && response.success) {
                setSelectedUser(response.data);
                showNotification.success('Kullanıcı başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcı oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUser = useCallback(async (updateRequest: UserFormData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await userService.updateUser(updateRequest.id || '', updateRequest);
            if (response.data && response.success) {
                setSelectedUser(response.data);
                showNotification.success('Kullanıcı başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcı güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getUserById(id);
            if (response.data && response.success) {
                setSelectedUser(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcı alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteUser = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.deleteUser(id);
            if (response.success) {
                showNotification.success('Kullanıcı başarıyla silindi!');
                // Clear selected user if it was the deleted one
                if (selectedUser?.id === id) {
                    setSelectedUser(null);
                }
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcı silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [selectedUser?.id]);

    // Search Operations
    const getUserByUsername = useCallback(async (username: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getUserByUsername(username);
            if (response.data && response.success) {
                setSelectedUser(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcı kullanıcı adı ile alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserByEmail = useCallback(async (email: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getUserByEmail(email);
            if (response.data && response.success) {
                setSelectedUser(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcı e-posta ile alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserByIdentityNumber = useCallback(async (identityNumber: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getUserByIdentityNumber(identityNumber);
            if (response.data && response.success) {
                setSelectedUser(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcı kimlik numarası ile alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserByMobilePhone = useCallback(async (mobilePhone: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getUserByMobilePhone(mobilePhone);
            if (response.data && response.success) {
                setSelectedUser(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcı telefon numarası ile alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    // Listing Operations
    const getAllUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getAllUsers();
            if (response.data && response.success) {
                setUsers(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcılar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUsersWithPagination = useCallback(async (params?: {
        page?: number;
        size?: number;
        sortBy?: string;
        sortDirection?: 'ASC' | 'DESC';
    }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getUsersWithPagination(params);
            if (response.data && response.success) {
                setPaginatedUsers(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sayfalı kullanıcılar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    // Advanced Search
    const searchUsersByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.searchUsersByName(name);
            if (response.data && response.success) {
                setUsers(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcı arama yapılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUsersByDepartment = useCallback(async (department: Department) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getUsersByDepartment(department);
            if (response.data && response.success) {
                setUsers(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Departman kullanıcıları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUsersByRole = useCallback(async (role: Role) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getUsersByRole(role);
            if (response.data && response.success) {
                setUsers(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Rol kullanıcıları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUsersByPermission = useCallback(async (permission: Permission) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getUsersByPermission(permission);
            if (response.data && response.success) {
                setUsers(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('İzin kullanıcıları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUsersByBrandId = useCallback(async (brandId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getUsersByBrandId(brandId);
            if (response.data && response.success) {
                setUsers(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka kullanıcıları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchUsers = useCallback(async (searchRequest: UserSearchRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.searchUsers(searchRequest);
            if (response.data && response.success) {
                setUsers(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Gelişmiş kullanıcı arama yapılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    // Activity Operations
    const getRecentlyActiveUsers = useCallback(async (hoursBack: number = 24) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getRecentlyActiveUsers(hoursBack);
            if (response.data && response.success) {
                setUsers(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aktif kullanıcılar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getInactiveUsers = useCallback(async (daysBack: number = 30) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getInactiveUsers(daysBack);
            if (response.data && response.success) {
                setUsers(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Pasif kullanıcılar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    // User Management Operations
    const updateLastLoginTime = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.updateLastLoginTime(userId);
            if (response.success) {
                showNotification.success('Son giriş zamanı güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Son giriş zamanı güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const activateUser = useCallback(async (activationCode: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.activateUser(activationCode);
            if (response.data && response.success) {
                setSelectedUser(response.data);
                showNotification.success('Kullanıcı hesabı başarıyla aktifleştirildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcı aktivasyonu yapılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const changePassword = useCallback(async (userId: string, changePasswordRequest: ChangePasswordRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.changePassword(userId, changePasswordRequest);
            if (response.success) {
                showNotification.success('Şifre başarıyla değiştirildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şifre değiştirilirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const resetPassword = useCallback(async (resetPasswordRequest: ResetPasswordRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.resetPassword(resetPasswordRequest);
            if (response.success) {
                showNotification.success('Şifre sıfırlama e-postası gönderildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şifre sıfırlanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    // Bulk Operations
    const bulkCreateUsers = useCallback(async (createRequests: UserFormData[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.bulkCreateUsers(createRequests);
            if (response.data && response.success) {
                setUsers(response.data);
                showNotification.success('Kullanıcılar başarıyla toplu oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcılar toplu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    // Statistics and Reporting
    const getUserStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getUserStatistics();
            if (response.data && response.success) {
                setUserStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcı istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserSummary = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getUserSummary(id);
            if (response.data && response.success) {
                setUserSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcı özeti alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    // Utility Functions
    const checkUsernameAvailability = useCallback(async (username: string): Promise<boolean> => {
        try {
            return await userService.checkUsernameAvailability(username);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            return false;
        }
    }, []);

    const checkEmailAvailability = useCallback(async (email: string): Promise<boolean> => {
        try {
            return await userService.checkEmailAvailability(email);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            return false;
        }
    }, []);

    // Clear Data
    const clearUserData = useCallback(() => {
        setUsers(null);
        setSelectedUser(null);
        setPaginatedUsers(null);
        setUserStatistics(null);
        setUserSummary(null);
        setError(null);
    }, []);

    return {
        users,
        selectedUser,
        paginatedUsers,
        userStatistics,
        userSummary,
        loading,
        error,

        // CRUD Operations
        createUser,
        updateUser,
        getUserById,
        deleteUser,

        // Search Operations
        getUserByUsername,
        getUserByEmail,
        getUserByIdentityNumber,
        getUserByMobilePhone,

        // Listing Operations
        getAllUsers,
        getUsersWithPagination,

        // Advanced Search
        searchUsersByName,
        getUsersByDepartment,
        getUsersByRole,
        getUsersByPermission,
        getUsersByBrandId,
        searchUsers,

        // Activity Operations
        getRecentlyActiveUsers,
        getInactiveUsers,

        // User Management Operations
        updateLastLoginTime,
        activateUser,
        changePassword,
        resetPassword,

        // Bulk Operations
        bulkCreateUsers,

        // Statistics and Reporting
        getUserStatistics,
        getUserSummary,

        // Utility Functions
        checkUsernameAvailability,
        checkEmailAvailability,

        // Clear Data
        clearUserData
    };
};