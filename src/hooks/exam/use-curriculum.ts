import { useState, useCallback } from 'react';

import {
    CreateCurriculumRequest,
    UpdateCurriculumRequest,
    CurriculumSearchRequest,
    CurriculumWithContentDto,
    CurriculumListResponse,
    CurriculumStatistics,
    CurriculumContentSummary,
    curriculumService
} from '@/services/api/exam/curriculum-service';
import { showNotification } from '@/lib/notification';
import {CurriculumDto} from "@/types/exam/examEntities";
import {EExamCategory} from "@/types/exam/enum";

interface UseCurriculumReturn {
    curricula: CurriculumListResponse | null;
    selectedCurriculum: CurriculumDto | null;
    curriculumWithContent: CurriculumWithContentDto | null;
    curriculaByCategory: CurriculumDto[];
    curriculumStatistics: CurriculumStatistics | null;
    curriculumContentSummary: CurriculumContentSummary | null;
    searchResults: CurriculumDto[];
    loading: boolean;
    error: Error | null;
    createCurriculum: (createRequest: CreateCurriculumRequest) => Promise<void>;
    updateCurriculum: (id: string, updateRequest: UpdateCurriculumRequest) => Promise<void>;
    getCurriculumById: (id: string) => Promise<void>;
    getCurriculumWithContent: (id: string) => Promise<void>;
    getAllCurricula: (searchRequest?: CurriculumSearchRequest) => Promise<void>;
    getCurriculaByCategory: (category: EExamCategory) => Promise<void>;
    deleteCurriculum: (id: string) => Promise<void>;
    copyCurriculum: (id: string, newName: string) => Promise<void>;
    getCurriculumStatistics: (id: string) => Promise<void>;
    bulkCreateCurricula: (createRequests: CreateCurriculumRequest[]) => Promise<void>;
    searchCurriculaByName: (namePattern: string) => Promise<void>;
    getCurriculumContentSummary: (id: string) => Promise<void>;
    clearCurriculumData: () => void;
}

export const useCurriculum = (): UseCurriculumReturn => {
    const [curricula, setCurricula] = useState<CurriculumListResponse | null>(null);
    const [selectedCurriculum, setSelectedCurriculum] = useState<CurriculumDto | null>(null);
    const [curriculumWithContent, setCurriculumWithContent] = useState<CurriculumWithContentDto | null>(null);
    const [curriculaByCategory, setCurriculaByCategory] = useState<CurriculumDto[]>([]);
    const [curriculumStatistics, setCurriculumStatistics] = useState<CurriculumStatistics | null>(null);
    const [curriculumContentSummary, setCurriculumContentSummary] = useState<CurriculumContentSummary | null>(null);
    const [searchResults, setSearchResults] = useState<CurriculumDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createCurriculum = useCallback(async (createRequest: CreateCurriculumRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.createCurriculum(createRequest);
            if (response.data && response.success) {
                setSelectedCurriculum(response.data);
                showNotification.success('Müfredat başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCurriculum = useCallback(async (id: string, updateRequest: UpdateCurriculumRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.updateCurriculum(id, updateRequest);
            if (response.data && response.success) {
                setSelectedCurriculum(response.data);
                showNotification.success('Müfredat başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.getCurriculumById(id);
            if (response.data && response.success) {
                setSelectedCurriculum(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumWithContent = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.getCurriculumWithContent(id);
            if (response.data && response.success) {
                setCurriculumWithContent(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat içeriği alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllCurricula = useCallback(async (searchRequest: CurriculumSearchRequest = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.getAllCurricula(searchRequest);
            if (response.data && response.success) {
                setCurricula(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredatlar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculaByCategory = useCallback(async (category: EExamCategory) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.getCurriculaByCategory(category);
            if (response.data && response.success) {
                setCurriculaByCategory(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kategori müfredatları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCurriculum = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.deleteCurriculum(id);
            if (response.data && response.success) {
                showNotification.success('Müfredat başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyCurriculum = useCallback(async (id: string, newName: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.copyCurriculum(id, newName);
            if (response.data && response.success) {
                setSelectedCurriculum(response.data);
                showNotification.success('Müfredat başarıyla kopyalandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat kopyalanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.getCurriculumStatistics(id);
            if (response.data && response.success) {
                setCurriculumStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateCurricula = useCallback(async (createRequests: CreateCurriculumRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.bulkCreateCurricula(createRequests);
            if (response.data && response.success) {
                showNotification.success('Müfredatlar başarıyla toplu oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredatlar toplu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchCurriculaByName = useCallback(async (namePattern: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.searchCurriculaByName(namePattern);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat aranırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumContentSummary = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.getCurriculumContentSummary(id);
            if (response.data && response.success) {
                setCurriculumContentSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat içerik özeti alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearCurriculumData = useCallback(() => {
        setCurricula(null);
        setSelectedCurriculum(null);
        setCurriculumWithContent(null);
        setCurriculaByCategory([]);
        setCurriculumStatistics(null);
        setCurriculumContentSummary(null);
        setSearchResults([]);
        setError(null);
    }, []);

    return {
        curricula,
        selectedCurriculum,
        curriculumWithContent,
        curriculaByCategory,
        curriculumStatistics,
        curriculumContentSummary,
        searchResults,
        loading,
        error,
        createCurriculum,
        updateCurriculum,
        getCurriculumById,
        getCurriculumWithContent,
        getAllCurricula,
        getCurriculaByCategory,
        deleteCurriculum,
        copyCurriculum,
        getCurriculumStatistics,
        bulkCreateCurricula,
        searchCurriculaByName,
        getCurriculumContentSummary,
        clearCurriculumData
    };
};