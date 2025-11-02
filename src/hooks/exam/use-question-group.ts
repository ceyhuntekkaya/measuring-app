import { useState, useCallback } from 'react';

import {
    QuestionGroupsSummary,
    QuestionGroupStatistics,
    QuestionGroupValidation,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import {QuestionGroupDto} from "@/types/exam/examEntities";
import {CreateQuestionGroupRequest, CreateQuestionGroupHeaderRequest} from "@/types/exam/examRequests";
import { questionGroupService } from "@/services/api/exam/question-grup-service";

interface UseQuestionGroupReturn {
    questionGroups: QuestionGroupDto[];
    selectedQuestionGroup: QuestionGroupDto | null;
    groupsByExamSection: QuestionGroupDto[];
    groupsByExamType: QuestionGroupDto[];
    searchResults: QuestionGroupDto[];
    groupStatistics: QuestionGroupStatistics | null;
    groupsSummary: QuestionGroupsSummary | null;
    groupValidation: QuestionGroupValidation | null;
    loading: boolean;
    error: Error | null;
    createQuestionGroup: (createRequest: CreateQuestionGroupRequest) => Promise<void>;
    updateQuestionGroup: (updateRequest: CreateQuestionGroupRequest) => Promise<void>;
    getQuestionGroupById: (id: string) => Promise<void>;
    getQuestionGroupsByExamSection: (examSectionId: string) => Promise<void>;
    getQuestionGroupsByExamType: (examTypeId: string) => Promise<void>;
    deleteQuestionGroup: (id: string) => Promise<void>;
    addHeaderToQuestionGroup: (questionGroupId: string, headerRequest: CreateQuestionGroupHeaderRequest) => Promise<void>;
    removeHeaderFromQuestionGroup: (headerId: string) => Promise<void>;
    copyQuestionGroup: (questionGroupId: string, targetExamSectionId: string) => Promise<void>;
    getQuestionGroupStatistics: (id: string) => Promise<void>;
    searchQuestionGroups: (name?: string, examTypeId?: string, examSectionId?: string, questionGroupTypeId?: string, hasQuestions?: boolean) => Promise<void>;
    getQuestionGroupsSummary: (examSectionId: string) => Promise<void>;
    validateQuestionGroup: (id: string) => Promise<void>;
    bulkCreateQuestionGroups: (createRequests: CreateQuestionGroupRequest[]) => Promise<void>;
    clearQuestionGroupData: () => void;
    getAllQuestionGroup: () => Promise<void>;
}

export const useQuestionGroup = (): UseQuestionGroupReturn => {
    const [questionGroups, setQuestionGroups] = useState<QuestionGroupDto[]>([]);
    const [selectedQuestionGroup, setSelectedQuestionGroup] = useState<QuestionGroupDto | null>(null);
    const [groupsByExamSection, setGroupsByExamSection] = useState<QuestionGroupDto[]>([]);
    const [groupsByExamType, setGroupsByExamType] = useState<QuestionGroupDto[]>([]);
    const [searchResults, setSearchResults] = useState<QuestionGroupDto[]>([]);
    const [groupStatistics, setGroupStatistics] = useState<QuestionGroupStatistics | null>(null);
    const [groupsSummary, setGroupsSummary] = useState<QuestionGroupsSummary | null>(null);
    const [groupValidation, setGroupValidation] = useState<QuestionGroupValidation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createQuestionGroup = useCallback(async (createRequest: CreateQuestionGroupRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.createQuestionGroup(createRequest);
            if (response.data && response.success) {
                setSelectedQuestionGroup(response.data);
                showNotification.success('Soru grubu başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateQuestionGroup = useCallback(async (updateRequest: CreateQuestionGroupRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.updateQuestionGroup(updateRequest.id || '', updateRequest);
            if (response.data && response.success) {
                setSelectedQuestionGroup(response.data);
                showNotification.success('Soru grubu başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);


    const getAllQuestionGroup = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.getAllQuestionGroup();
            if (response.data && response.success) {
                setQuestionGroups(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);




    const getQuestionGroupById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.getQuestionGroupById(id);
            if (response.data && response.success) {
                setSelectedQuestionGroup(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupsByExamSection = useCallback(async (examSectionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.getQuestionGroupsByExamSection(examSectionId);
            if (response.data && response.success) {
                setGroupsByExamSection(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav bölümü soru grupları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupsByExamType = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.getQuestionGroupsByExamType(examTypeId);
            if (response.data && response.success) {
                setGroupsByExamType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav tipi soru grupları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteQuestionGroup = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.deleteQuestionGroup(id);
            if (response.success) {
                showNotification.success('Soru grubu başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const addHeaderToQuestionGroup = useCallback(async (questionGroupId: string, headerRequest: CreateQuestionGroupHeaderRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.addHeaderToQuestionGroup(questionGroupId, headerRequest);
            if (response.data && response.success) {
                showNotification.success('Başlık başarıyla eklendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başlık eklenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const removeHeaderFromQuestionGroup = useCallback(async (headerId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.removeHeaderFromQuestionGroup(headerId);
            if (response.success) {
                showNotification.success('Başlık başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başlık silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyQuestionGroup = useCallback(async (questionGroupId: string, targetExamSectionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.copyQuestionGroup(questionGroupId, targetExamSectionId);
            if (response.data && response.success) {
                setSelectedQuestionGroup(response.data);
                showNotification.success('Soru grubu başarıyla kopyalandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu kopyalanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.getQuestionGroupStatistics(id);
            if (response.data && response.success) {
                setGroupStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchQuestionGroups = useCallback(async (
        name?: string,
        examTypeId?: string,
        examSectionId?: string,
        questionGroupTypeId?: string,
        hasQuestions?: boolean
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.searchQuestionGroups(name, examTypeId, examSectionId, questionGroupTypeId, hasQuestions);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grupları aranırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupsSummary = useCallback(async (examSectionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.getQuestionGroupsSummary(examSectionId);
            if (response.data && response.success) {
                setGroupsSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grupları özeti alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateQuestionGroup = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.validateQuestionGroup(id);
            if (response.data && response.success) {
                setGroupValidation(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu doğrulanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateQuestionGroups = useCallback(async (createRequests: CreateQuestionGroupRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.bulkCreateQuestionGroups(createRequests);
            if (response.data && response.success) {
                setQuestionGroups(response.data);
                showNotification.success('Soru grupları başarıyla toplu oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grupları toplu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearQuestionGroupData = useCallback(() => {
        setQuestionGroups([]);
        setSelectedQuestionGroup(null);
        setGroupsByExamSection([]);
        setGroupsByExamType([]);
        setSearchResults([]);
        setGroupStatistics(null);
        setGroupsSummary(null);
        setGroupValidation(null);
        setError(null);
    }, []);

    return {
        questionGroups,
        selectedQuestionGroup,
        groupsByExamSection,
        groupsByExamType,
        searchResults,
        groupStatistics,
        groupsSummary,
        groupValidation,
        loading,
        error,
        createQuestionGroup,
        updateQuestionGroup,
        getQuestionGroupById,
        getQuestionGroupsByExamSection,
        getQuestionGroupsByExamType,
        deleteQuestionGroup,
        addHeaderToQuestionGroup,
        removeHeaderFromQuestionGroup,
        copyQuestionGroup,
        getQuestionGroupStatistics,
        searchQuestionGroups,
        getQuestionGroupsSummary,
        validateQuestionGroup,
        bulkCreateQuestionGroups,
        clearQuestionGroupData,
        getAllQuestionGroup
    };
};