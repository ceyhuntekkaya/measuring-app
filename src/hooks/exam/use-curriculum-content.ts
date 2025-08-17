import { useState, useCallback } from 'react';
import {
    CreateCurriculumContentRequest,
    UpdateCurriculumContentRequest,
    CurriculumContentSearchRequest,
    CurriculumContentStatistics,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import { CurriculumContentDto } from "@/types/exam/examEntities";
import {ECurriculumLevel} from "@/types/exam/enum";
import { curriculumContentService } from "@/services/api/exam/curriculum-content-service";

interface UseCurriculumContentReturn {
    curriculumContents: CurriculumContentDto[];
    selectedContent: CurriculumContentDto | null;
    contentTree: CurriculumContentDto[];
    contentsByLevel: CurriculumContentDto[];
    childrenContents: CurriculumContentDto[];
    statistics: CurriculumContentStatistics | null;
    searchResults: CurriculumContentDto[];
    loading: boolean;
    error: Error | null;
    createCurriculumContent: (createRequest: CreateCurriculumContentRequest) => Promise<void>;
    updateCurriculumContent: (id: string, updateRequest: UpdateCurriculumContentRequest) => Promise<void>;
    getCurriculumContentById: (id: string) => Promise<void>;
    getCurriculumContentTree: (curriculumId: string) => Promise<void>;
    getCurriculumContentByLevel: (curriculumId: string, level: ECurriculumLevel) => Promise<void>;
    getCurriculumContentByParent: (parentId: string) => Promise<void>;
    deleteCurriculumContent: (id: string) => Promise<void>;
    moveCurriculumContent: (contentId: string, newParentId?: string) => Promise<void>;
    reorderCurriculumContent: (curriculumId: string, parentId: string | null, contentIds: string[]) => Promise<void>;
    copyCurriculumContentTree: (contentId: string, targetCurriculumId: string, targetParentId?: string) => Promise<void>;
    searchCurriculumContent: (searchRequest: CurriculumContentSearchRequest) => Promise<void>;
    getCurriculumContentStatistics: (curriculumId: string) => Promise<void>;
    clearContentData: () => void;
}

export const useCurriculumContent = (): UseCurriculumContentReturn => {
    const [curriculumContents, setCurriculumContents] = useState<CurriculumContentDto[]>([]);
    const [selectedContent, setSelectedContent] = useState<CurriculumContentDto | null>(null);
    const [contentTree, setContentTree] = useState<CurriculumContentDto[]>([]);
    const [contentsByLevel, setContentsByLevel] = useState<CurriculumContentDto[]>([]);
    const [childrenContents, setChildrenContents] = useState<CurriculumContentDto[]>([]);
    const [statistics, setStatistics] = useState<CurriculumContentStatistics | null>(null);
    const [searchResults, setSearchResults] = useState<CurriculumContentDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createCurriculumContent = useCallback(async (createRequest: CreateCurriculumContentRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.createCurriculumContent(createRequest);
            if (response.data && response.success) {
                setSelectedContent(response.data);
                showNotification.success('Müfredat içeriği başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat içeriği oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCurriculumContent = useCallback(async (id: string, updateRequest: UpdateCurriculumContentRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.updateCurriculumContent(id, updateRequest);
            if (response.data && response.success) {
                setSelectedContent(response.data);
                showNotification.success('Müfredat içeriği başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat içeriği güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumContentById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.getCurriculumContentById(id);
            if (response.data && response.success) {
                setSelectedContent(response.data);
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

    const getCurriculumContentTree = useCallback(async (curriculumId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.getCurriculumContentTree(curriculumId);
            if (response.data && response.success) {
                setContentTree(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat içerik ağacı alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumContentByLevel = useCallback(async (curriculumId: string, level: ECurriculumLevel) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.getCurriculumContentByLevel(curriculumId, level);
            if (response.data && response.success) {
                setContentsByLevel(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Seviye bazlı içerikler alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumContentByParent = useCallback(async (parentId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.getCurriculumContentByParent(parentId);
            if (response.data && response.success) {
                setChildrenContents(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Alt içerikler alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCurriculumContent = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.deleteCurriculumContent(id);
            if (response.success) {
                showNotification.success('Müfredat içeriği başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat içeriği silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const moveCurriculumContent = useCallback(async (contentId: string, newParentId?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.moveCurriculumContent(contentId, newParentId);
            if (response.data && response.success) {
                setSelectedContent(response.data);
                showNotification.success('Müfredat içeriği başarıyla taşındı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat içeriği taşınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const reorderCurriculumContent = useCallback(async (curriculumId: string, parentId: string | null, contentIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.reorderCurriculumContent(curriculumId, parentId, contentIds);
            if (response.data && response.success) {
                setCurriculumContents(response.data);
                showNotification.success('Müfredat içerikleri başarıyla yeniden sıralandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat içerikleri sıralanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyCurriculumContentTree = useCallback(async (contentId: string, targetCurriculumId: string, targetParentId?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.copyCurriculumContentTree(contentId, targetCurriculumId, targetParentId);
            if (response.data && response.success) {
                setSelectedContent(response.data);
                showNotification.success('Müfredat içerik ağacı başarıyla kopyalandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat içerik ağacı kopyalanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchCurriculumContent = useCallback(async (searchRequest: CurriculumContentSearchRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.searchCurriculumContent(searchRequest);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat içeriği aranırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumContentStatistics = useCallback(async (curriculumId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.getCurriculumContentStatistics(curriculumId);
            if (response.data && response.success) {
                setStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Müfredat içerik istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearContentData = useCallback(() => {
        setCurriculumContents([]);
        setSelectedContent(null);
        setContentTree([]);
        setContentsByLevel([]);
        setChildrenContents([]);
        setStatistics(null);
        setSearchResults([]);
        setError(null);
    }, []);

    return {
        curriculumContents,
        selectedContent,
        contentTree,
        contentsByLevel,
        childrenContents,
        statistics,
        searchResults,
        loading,
        error,
        createCurriculumContent,
        updateCurriculumContent,
        getCurriculumContentById,
        getCurriculumContentTree,
        getCurriculumContentByLevel,
        getCurriculumContentByParent,
        deleteCurriculumContent,
        moveCurriculumContent,
        reorderCurriculumContent,
        copyCurriculumContentTree,
        searchCurriculumContent,
        getCurriculumContentStatistics,
        clearContentData
    };
};