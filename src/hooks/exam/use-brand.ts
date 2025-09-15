import { useState, useCallback } from 'react';

import {
    BrandDto,
    BrandFormData,
    BrandStatistics,
    BrandSummary
} from '@/types/management/brand';
import { showNotification } from '@/lib/notification';
import {brandService} from "@/services/api/management/brand-service";

interface UseBrandReturn {
    brands: BrandDto[] | null;
    selectedBrand: BrandDto | null;
    brandStatistics: BrandStatistics | null;
    brandSummary: BrandSummary | null;
    loading: boolean;
    error: Error | null;
    createBrand: (createRequest: BrandFormData) => Promise<void>;
    updateBrand: (updateRequest: BrandFormData) => Promise<void>;
    getBrandById: (id: string) => Promise<void>;
    getBrandByCode: (code: string) => Promise<void>;
    getAllBrands: () => Promise<void>;
    searchBrandsByName: (name: string) => Promise<void>;
    deleteBrand: (id: string) => Promise<void>;
    bulkCreateBrands: (createRequests: BrandFormData[]) => Promise<void>;
    getBrandStatistics: (id: string) => Promise<void>;
    getBrandSummary: (id: string) => Promise<void>;
    clearBrandData: () => void;
}

export const useBrand = (): UseBrandReturn => {
    const [brands, setBrands] = useState<BrandDto[] | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<BrandDto | null>(null);
    const [brandStatistics, setBrandStatistics] = useState<BrandStatistics | null>(null);
    const [brandSummary, setBrandSummary] = useState<BrandSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createBrand = useCallback(async (createRequest: BrandFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.createBrand(createRequest);
            if (response.data && response.success) {
                setSelectedBrand(response.data);
                showNotification.success('Marka başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateBrand = useCallback(async (updateRequest: BrandFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.updateBrand(updateRequest.id, updateRequest);
            if (response.data && response.success) {
                setSelectedBrand(response.data);
                showNotification.success('Marka başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBrandById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.getBrandById(id);
            if (response.data && response.success) {
                setSelectedBrand(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBrandByCode = useCallback(async (code: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.getBrandByCode(code);
            if (response.data && response.success) {
                setSelectedBrand(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka kod ile alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllBrands = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.getAllBrands();
            if (response.data && response.success) {
                setBrands(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Markalar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchBrandsByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.searchBrandsByName(name);
            if (response.data && response.success) {
                setBrands(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka arama yapılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteBrand = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.deleteBrand(id);
            if (response.success) {
                showNotification.success('Marka başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateBrands = useCallback(async (createRequests: BrandFormData[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.bulkCreateBrands(createRequests);
            if (response.data && response.success) {
                setBrands(response.data);
                showNotification.success('Markalar başarıyla toplu oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Markalar toplu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBrandStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.getBrandStatistics(id);
            if (response.data && response.success) {
                setBrandStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBrandSummary = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.getBrandSummary(id);
            if (response.data && response.success) {
                setBrandSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka özeti alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearBrandData = useCallback(() => {
        setBrands(null);
        setSelectedBrand(null);
        setBrandStatistics(null);
        setBrandSummary(null);
        setError(null);
    }, []);

    return {
        brands,
        selectedBrand,
        brandStatistics,
        brandSummary,
        loading,
        error,
        createBrand,
        updateBrand,
        getBrandById,
        getBrandByCode,
        getAllBrands,
        searchBrandsByName,
        deleteBrand,
        bulkCreateBrands,
        getBrandStatistics,
        getBrandSummary,
        clearBrandData
    };
};