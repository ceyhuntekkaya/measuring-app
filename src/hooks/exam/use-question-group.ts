import { useState, useCallback } from 'react';

import {
    UpdateQuestionGroupTypeRequest,
    QuestionGroupTypeSearchRequest,
    QuestionGroupTypeStatistics,
    QuestionGroupTypeTemplate,
    LevelInfo,
    GroupTypeInfo,
    questionGroupTypeService, CreateQuestionGroupTypeRequest
} from '@/services/api/exam/question-group-type-service';
import { showNotification } from '@/lib/notification';
import {QuestionGroupTypeDto} from "@/types/exam/examTemplates";
import {EQuestionGroupTemplateLevel, EQuestionGroupType} from "@/types/exam/enum";


interface UseQuestionGroupTypeReturn {
    questionGroupTypes: QuestionGroupTypeDto[];
    selectedType: QuestionGroupTypeDto | null;
    typesByExamSection: QuestionGroupTypeDto[];
    typesByLevel: QuestionGroupTypeDto[];
    typesByGroupType: QuestionGroupTypeDto[];
    searchResults: QuestionGroupTypeDto[];
    typeStatistics: QuestionGroupTypeStatistics | null;
    availableTemplates: QuestionGroupTypeTemplate[];
    availableLevels: LevelInfo[];
    availableGroupTypes: GroupTypeInfo[];
    loading: boolean;
    error: Error | null;
    createQuestionGroupType: (createRequest: CreateQuestionGroupTypeRequest) => Promise<void>;
    updateQuestionGroupType: (id: string, updateRequest: UpdateQuestionGroupTypeRequest) => Promise<void>;
    getQuestionGroupTypeById: (id: string) => Promise<void>;
    getQuestionGroupTypesByExamSection: (examSectionId: string) => Promise<void>;
    getQuestionGroupTypesByLevel: (level: EQuestionGroupTemplateLevel) => Promise<void>;
    getQuestionGroupTypesByGroupType: (groupType: EQuestionGroupType) => Promise<void>;
    deleteQuestionGroupType: (id: string) => Promise<void>;
    reorderQuestionGroupTypes: (examSectionId: string, typeIds: string[]) => Promise<void>;
    copyQuestionGroupType: (typeId: string, targetExamSectionId: string) => Promise<void>;
    bulkCreateQuestionGroupTypes: (examSectionId: string, createRequests: CreateQuestionGroupTypeRequest[]) => Promise<void>;
    getQuestionGroupTypeStatistics: (id: string) => Promise<void>;
    searchQuestionGroupTypes: (searchRequest: QuestionGroupTypeSearchRequest) => Promise<void>;
    getAvailableTemplates: (level?: EQuestionGroupTemplateLevel, groupType?: EQuestionGroupType) => Promise<void>;
    getAvailableLevels: () => Promise<void>;
    getAvailableGroupTypes: () => Promise<void>;
    clearTypeData: () => void;
}

export const useQuestionGroupType = (): UseQuestionGroupTypeReturn => {
    const [questionGroupTypes, setQuestionGroupTypes] = useState<QuestionGroupTypeDto[]>([]);
    const [selectedType, setSelectedType] = useState<QuestionGroupTypeDto | null>(null);
    const [typesByExamSection, setTypesByExamSection] = useState<QuestionGroupTypeDto[]>([]);
    const [typesByLevel, setTypesByLevel] = useState<QuestionGroupTypeDto[]>([]);
    const [typesByGroupType, setTypesByGroupType] = useState<QuestionGroupTypeDto[]>([]);
    const [searchResults, setSearchResults] = useState<QuestionGroupTypeDto[]>([]);
    const [typeStatistics, setTypeStatistics] = useState<QuestionGroupTypeStatistics | null>(null);
    const [availableTemplates, setAvailableTemplates] = useState<QuestionGroupTypeTemplate[]>([]);
    const [availableLevels, setAvailableLevels] = useState<LevelInfo[]>([]);
    const [availableGroupTypes, setAvailableGroupTypes] = useState<GroupTypeInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createQuestionGroupType = useCallback(async (createRequest: CreateQuestionGroupTypeRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.createQuestionGroupType(createRequest);
            if (response.data && response.success) {
                setSelectedType(response.data);
                showNotification.success('Soru grubu tipi başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipi oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateQuestionGroupType = useCallback(async (id: string, updateRequest: UpdateQuestionGroupTypeRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.updateQuestionGroupType(id, updateRequest);
            if (response.data && response.success) {
                setSelectedType(response.data);
                showNotification.success('Soru grubu tipi başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipi güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupTypeById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getQuestionGroupTypeById(id);
            if (response.data && response.success) {
                setSelectedType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipi alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupTypesByExamSection = useCallback(async (examSectionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getQuestionGroupTypesByExamSection(examSectionId);
            if (response.data && response.success) {
                setTypesByExamSection(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav bölümü tipleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupTypesByLevel = useCallback(async (level: EQuestionGroupTemplateLevel) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getQuestionGroupTypesByLevel(level);
            if (response.data && response.success) {
                setTypesByLevel(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Seviye tipleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupTypesByGroupType = useCallback(async (groupType: EQuestionGroupType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getQuestionGroupTypesByGroupType(groupType);
            if (response.data && response.success) {
                setTypesByGroupType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Grup tipi tipleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteQuestionGroupType = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.deleteQuestionGroupType(id);
            if (response.data && response.success) {
                showNotification.success('Soru grubu tipi başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipi silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const reorderQuestionGroupTypes = useCallback(async (examSectionId: string, typeIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.reorderQuestionGroupTypes(examSectionId, typeIds);
            if (response.data && response.success) {
                setTypesByExamSection(response.data);
                showNotification.success('Soru grubu tipleri başarıyla yeniden sıralandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipleri sıralanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyQuestionGroupType = useCallback(async (typeId: string, targetExamSectionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.copyQuestionGroupType(typeId, targetExamSectionId);
            if (response.data && response.success) {
                setSelectedType(response.data);
                showNotification.success('Soru grubu tipi başarıyla kopyalandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipi kopyalanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateQuestionGroupTypes = useCallback(async (examSectionId: string, createRequests: CreateQuestionGroupTypeRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.bulkCreateQuestionGroupTypes(examSectionId, createRequests);
            if (response.data && response.success) {
                setQuestionGroupTypes(response.data);
                showNotification.success('Soru grubu tipleri başarıyla toplu oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipleri toplu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupTypeStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getQuestionGroupTypeStatistics(id);
            if (response.data && response.success) {
                setTypeStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Tip istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchQuestionGroupTypes = useCallback(async (searchRequest: QuestionGroupTypeSearchRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.searchQuestionGroupTypes(searchRequest);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipleri aranırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAvailableTemplates = useCallback(async (level?: EQuestionGroupTemplateLevel, groupType?: EQuestionGroupType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getAvailableTemplates(level, groupType);
            if (response.data && response.success) {
                setAvailableTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Mevcut şablonlar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAvailableLevels = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getAvailableLevels();
            if (response.data && response.success) {
                setAvailableLevels(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Mevcut seviyeler alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAvailableGroupTypes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getAvailableGroupTypes();
            if (response.data && response.success) {
                setAvailableGroupTypes(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Mevcut grup tipleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearTypeData = useCallback(() => {
        setQuestionGroupTypes([]);
        setSelectedType(null);
        setTypesByExamSection([]);
        setTypesByLevel([]);
        setTypesByGroupType([]);
        setSearchResults([]);
        setTypeStatistics(null);
        setAvailableTemplates([]);
        setAvailableLevels([]);
        setAvailableGroupTypes([]);
        setError(null);
    }, []);

    return {
        questionGroupTypes,
        selectedType,
        typesByExamSection,
        typesByLevel,
        typesByGroupType,
        searchResults,
        typeStatistics,
        availableTemplates,
        availableLevels,
        availableGroupTypes,
        loading,
        error,
        createQuestionGroupType,
        updateQuestionGroupType,
        getQuestionGroupTypeById,
        getQuestionGroupTypesByExamSection,
        getQuestionGroupTypesByLevel,
        getQuestionGroupTypesByGroupType,
        deleteQuestionGroupType,
        reorderQuestionGroupTypes,
        copyQuestionGroupType,
        bulkCreateQuestionGroupTypes,
        getQuestionGroupTypeStatistics,
        searchQuestionGroupTypes,
        getAvailableTemplates,
        getAvailableLevels,
        getAvailableGroupTypes,
        clearTypeData
    };
};