import { useState, useCallback } from 'react';

import {
    BranchDto,
    BranchStatistics,
    BrandBranchesSummary,
    CopyBranchRequest,
    MoveBranchRequest, BranchFormData
} from '@/types/management/brand';
import { showNotification } from '@/lib/notification';
import {branchService} from "@/services/api/management/branch-service";

interface UseBranchReturn {
    branches: BranchDto[] | null;
    selectedBranch: BranchDto | null;
    brandBranches: BranchDto[] | null;
    branchStatistics: BranchStatistics | null;
    brandBranchesSummary: BrandBranchesSummary | null;
    loading: boolean;
    error: Error | null;
    createBranch: (createRequest: BranchFormData) => Promise<void>;
    updateBranch: (updateRequest: BranchFormData) => Promise<void>;
    getBranchById: (id: string) => Promise<void>;
    getBranchByCode: (code: string) => Promise<void>;
    getBranchesByBrand: (brandId: string) => Promise<void>;
    getAllBranches: () => Promise<void>;
    searchBranchesByName: (name: string) => Promise<void>;
    deleteBranch: (id: string) => Promise<void>;
    copyBranch: (branchId: string, copyRequest: CopyBranchRequest) => Promise<void>;
    moveBranch: (branchId: string, moveRequest: MoveBranchRequest) => Promise<void>;
    bulkCreateBranches: (createRequests: BranchFormData[]) => Promise<void>;
    getBranchStatistics: (id: string) => Promise<void>;
    getBrandBranchesSummary: (brandId: string) => Promise<void>;
    clearBranchData: () => void;
}

export const useBranch = (): UseBranchReturn => {
    const [branches, setBranches] = useState<BranchDto[] | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<BranchDto | null>(null);
    const [brandBranches, setBrandBranches] = useState<BranchDto[] | null>(null);
    const [branchStatistics, setBranchStatistics] = useState<BranchStatistics | null>(null);
    const [brandBranchesSummary, setBrandBranchesSummary] = useState<BrandBranchesSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createBranch = useCallback(async (createRequest: BranchFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.createBranch(createRequest);
            if (response.data && response.success) {
                setSelectedBranch(response.data);
                showNotification.success('Şube başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şube oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateBranch = useCallback(async (updateRequest: BranchFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.updateBranch(updateRequest.id, updateRequest);
            if (response.data && response.success) {
                setSelectedBranch(response.data);
                showNotification.success('Şube başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şube güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBranchById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.getBranchById(id);
            if (response.data && response.success) {
                setSelectedBranch(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şube alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBranchByCode = useCallback(async (code: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.getBranchByCode(code);
            if (response.data && response.success) {
                setSelectedBranch(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şube kod ile alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBranchesByBrand = useCallback(async (brandId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.getBranchesByBrand(brandId);
            if (response.data && response.success) {
                setBrandBranches(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka şubeleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllBranches = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.getAllBranches();
            if (response.data && response.success) {
                setBranches(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şubeler alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchBranchesByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.searchBranchesByName(name);
            if (response.data && response.success) {
                setBranches(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şube arama yapılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteBranch = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.deleteBranch(id);
            if (response.success) {
                showNotification.success('Şube başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şube silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyBranch = useCallback(async (branchId: string, copyRequest: CopyBranchRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.copyBranch(branchId, copyRequest);
            if (response.data && response.success) {
                setSelectedBranch(response.data);
                showNotification.success('Şube başarıyla kopyalandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şube kopyalanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const moveBranch = useCallback(async (branchId: string, moveRequest: MoveBranchRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.moveBranch(branchId, moveRequest);
            if (response.data && response.success) {
                setSelectedBranch(response.data);
                showNotification.success('Şube başarıyla taşındı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şube taşınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateBranches = useCallback(async (createRequests: BranchFormData[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.bulkCreateBranches(createRequests);
            if (response.data && response.success) {
                setBranches(response.data);
                showNotification.success('Şubeler başarıyla toplu oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şubeler toplu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBranchStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.getBranchStatistics(id);
            if (response.data && response.success) {
                setBranchStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şube istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBrandBranchesSummary = useCallback(async (brandId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.getBrandBranchesSummary(brandId);
            if (response.data && response.success) {
                setBrandBranchesSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka şubeleri özeti alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearBranchData = useCallback(() => {
        setBranches(null);
        setSelectedBranch(null);
        setBrandBranches(null);
        setBranchStatistics(null);
        setBrandBranchesSummary(null);
        setError(null);
    }, []);

    return {
        branches,
        selectedBranch,
        brandBranches,
        branchStatistics,
        brandBranchesSummary,
        loading,
        error,
        createBranch,
        updateBranch,
        getBranchById,
        getBranchByCode,
        getBranchesByBrand,
        getAllBranches,
        searchBranchesByName,
        deleteBranch,
        copyBranch,
        moveBranch,
        bulkCreateBranches,
        getBranchStatistics,
        getBrandBranchesSummary,
        clearBranchData
    };
};