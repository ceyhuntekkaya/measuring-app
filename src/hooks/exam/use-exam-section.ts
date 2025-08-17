import { useState, useCallback } from 'react';

import {
    UpdateExamSectionRequest,
    ExamSectionStatistics,
    ExamSectionsSummary,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import {ExamSectionDto} from "@/types/exam/examTemplates";
import {CreateExamSectionRequest} from "@/types/exam/examEntities";
import {examSectionService} from "@/services/api/exam/exam-section-service";

interface UseExamSectionReturn {
    examSections: ExamSectionDto[];
    selectedExamSection: ExamSectionDto | null;
    sectionsByExamType: ExamSectionDto[];
    searchResults: ExamSectionDto[];
    sectionStatistics: ExamSectionStatistics | null;
    sectionsSummary: ExamSectionsSummary | null;
    loading: boolean;
    error: Error | null;
    createExamSection: (createRequest: CreateExamSectionRequest) => Promise<void>;
    updateExamSection: (id: string, updateRequest: UpdateExamSectionRequest) => Promise<void>;
    getExamSectionById: (id: string) => Promise<void>;
    getExamSectionsByExamType: (examTypeId: string) => Promise<void>;
    deleteExamSection: (id: string) => Promise<void>;
    reorderExamSections: (examTypeId: string, sectionIds: string[]) => Promise<void>;
    copyExamSection: (sectionId: string, targetExamTypeId: string) => Promise<void>;
    moveExamSection: (sectionId: string, targetExamTypeId: string) => Promise<void>;
    bulkCreateExamSections: (examTypeId: string, createRequests: CreateExamSectionRequest[]) => Promise<void>;
    getExamSectionStatistics: (id: string) => Promise<void>;
    getExamSectionsSummary: (examTypeId: string) => Promise<void>;
    searchExamSections: (name?: string, examTypeId?: string, hasQuestionGroups?: boolean) => Promise<void>;
    clearExamSectionData: () => void;
}

export const useExamSection = (): UseExamSectionReturn => {
    const [examSections, setExamSections] = useState<ExamSectionDto[]>([]);
    const [selectedExamSection, setSelectedExamSection] = useState<ExamSectionDto | null>(null);
    const [sectionsByExamType, setSectionsByExamType] = useState<ExamSectionDto[]>([]);
    const [searchResults, setSearchResults] = useState<ExamSectionDto[]>([]);
    const [sectionStatistics, setSectionStatistics] = useState<ExamSectionStatistics | null>(null);
    const [sectionsSummary, setSectionsSummary] = useState<ExamSectionsSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createExamSection = useCallback(async (createRequest: CreateExamSectionRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.createExamSection(createRequest);
            if (response.data && response.success) {
                setSelectedExamSection(response.data);
                showNotification.success('Sınav bölümü başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav bölümü oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExamSection = useCallback(async (id: string, updateRequest: UpdateExamSectionRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.updateExamSection(id, updateRequest);
            if (response.data && response.success) {
                setSelectedExamSection(response.data);
                showNotification.success('Sınav bölümü başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav bölümü güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSectionById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.getExamSectionById(id);
            if (response.data && response.success) {
                setSelectedExamSection(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav bölümü alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSectionsByExamType = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.getExamSectionsByExamType(examTypeId);
            if (response.data && response.success) {
                setSectionsByExamType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav tipi bölümleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteExamSection = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.deleteExamSection(id);
            if (response.data && response.success) {
                showNotification.success('Sınav bölümü başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav bölümü silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const reorderExamSections = useCallback(async (examTypeId: string, sectionIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.reorderExamSections(examTypeId, sectionIds);
            if (response.data && response.success) {
                setSectionsByExamType(response.data);
                showNotification.success('Sınav bölümleri başarıyla yeniden sıralandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav bölümleri sıralanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyExamSection = useCallback(async (sectionId: string, targetExamTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.copyExamSection(sectionId, targetExamTypeId);
            if (response.data && response.success) {
                setSelectedExamSection(response.data);
                showNotification.success('Sınav bölümü başarıyla kopyalandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav bölümü kopyalanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const moveExamSection = useCallback(async (sectionId: string, targetExamTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.moveExamSection(sectionId, targetExamTypeId);
            if (response.data && response.success) {
                setSelectedExamSection(response.data);
                showNotification.success('Sınav bölümü başarıyla taşındı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav bölümü taşınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateExamSections = useCallback(async (examTypeId: string, createRequests: CreateExamSectionRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.bulkCreateExamSections(examTypeId, createRequests);
            if (response.data && response.success) {
                setExamSections(response.data);
                showNotification.success('Sınav bölümleri başarıyla toplu oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav bölümleri toplu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSectionStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.getExamSectionStatistics(id);
            if (response.data && response.success) {
                setSectionStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bölüm istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSectionsSummary = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.getExamSectionsSummary(examTypeId);
            if (response.data && response.success) {
                setSectionsSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bölüm özeti alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchExamSections = useCallback(async (
        name?: string,
        examTypeId?: string,
        hasQuestionGroups?: boolean
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.searchExamSections(name, examTypeId, hasQuestionGroups);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav bölümleri aranırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearExamSectionData = useCallback(() => {
        setExamSections([]);
        setSelectedExamSection(null);
        setSectionsByExamType([]);
        setSearchResults([]);
        setSectionStatistics(null);
        setSectionsSummary(null);
        setError(null);
    }, []);

    return {
        examSections,
        selectedExamSection,
        sectionsByExamType,
        searchResults,
        sectionStatistics,
        sectionsSummary,
        loading,
        error,
        createExamSection,
        updateExamSection,
        getExamSectionById,
        getExamSectionsByExamType,
        deleteExamSection,
        reorderExamSections,
        copyExamSection,
        moveExamSection,
        bulkCreateExamSections,
        getExamSectionStatistics,
        getExamSectionsSummary,
        searchExamSections,
        clearExamSectionData
    };
};