import {useCallback, useState} from "react";
import {ApiResponse} from "@/types/exam/examValidationAndAnalytics";
import {branchService} from "@/services/api/management/branch-service";
import {CreateBranchRequest, UpdateBranchRequest} from "@/types/management/brand";

export const useBranch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRequest = useCallback(async <T>(
        request: () => Promise<ApiResponse<T>>
    ): Promise<T | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await request();
            if (response.success) {
                return response.data ?? null;
            } else {
                setError(response.message ?? 'An unknown error occurred');
                return null;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const createBranch = useCallback(async (data: CreateBranchRequest) => {
        return handleRequest(() => branchService.createBranch(data));
    }, [handleRequest]);

    const updateBranch = useCallback(async (id: string, data: UpdateBranchRequest) => {
        return handleRequest(() => branchService.updateBranch(id, data));
    }, [handleRequest]);

    const getBranch = useCallback(async (id: string) => {
        return handleRequest(() => branchService.getBranchById(id));
    }, [handleRequest]);

    const getBranchesByBrand = useCallback(async (brandId: string) => {
        return handleRequest(() => branchService.getBranchesByBrand(brandId));
    }, [handleRequest]);

    const getAllBranches = useCallback(async () => {
        return handleRequest(() => branchService.getAllBranches());
    }, [handleRequest]);

    const deleteBranch = useCallback(async (id: string) => {
        return handleRequest(() => branchService.deleteBranch(id));
    }, [handleRequest]);

    const copyBranch = useCallback(async (branchId: string, targetBrandId: string) => {
        return handleRequest(() => branchService.copyBranch(branchId, { targetBrandId }));
    }, [handleRequest]);

    const moveBranch = useCallback(async (branchId: string, targetBrandId: string) => {
        return handleRequest(() => branchService.moveBranch(branchId, { targetBrandId }));
    }, [handleRequest]);

    return {
        loading,
        error,
        createBranch,
        updateBranch,
        getBranch,
        getBranchesByBrand,
        getAllBranches,
        deleteBranch,
        copyBranch,
        moveBranch
    };
};