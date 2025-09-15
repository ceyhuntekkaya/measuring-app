import { useState, useCallback } from 'react';
import { ApiResponse } from '@/types/exam/examValidationAndAnalytics';
import {brandService} from "@/services/api/management/brand-service";
import {CreateBrandRequest, UpdateBrandRequest} from "@/types/management/brand";

export const useBrand = () => {
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

    const createBrand = useCallback(async (data: CreateBrandRequest) => {
        return handleRequest(() => brandService.createBrand(data));
    }, [handleRequest]);

    const updateBrand = useCallback(async (id: string, data: UpdateBrandRequest) => {
        return handleRequest(() => brandService.updateBrand(id, data));
    }, [handleRequest]);

    const getBrand = useCallback(async (id: string) => {
        return handleRequest(() => brandService.getBrandById(id));
    }, [handleRequest]);

    const getAllBrands = useCallback(async () => {
        return handleRequest(() => brandService.getAllBrands());
    }, [handleRequest]);

    const deleteBrand = useCallback(async (id: string) => {
        return handleRequest(() => brandService.deleteBrand(id));
    }, [handleRequest]);

    const searchBrands = useCallback(async (name: string) => {
        return handleRequest(() => brandService.searchBrandsByName(name));
    }, [handleRequest]);

    return {
        loading,
        error,
        createBrand,
        updateBrand,
        getBrand,
        getAllBrands,
        deleteBrand,
        searchBrands
    };
};