import { useState, useCallback } from 'react';

import {
    UpdateQuestionPartRequest,
    QuestionPartStatistics,
    QuestionPartTemplate,
    QuestionPartPreview,
} from '@/types/exam/examResponses';;
import { showNotification } from '@/lib/notification';
import { QuestionPartDto } from "@/types/exam/examEntities";
import {CreateQuestionPartRequest} from "@/types/exam/examRequests";
import {EMediaType} from "@/types/exam/enum";
import {questionPartService} from "@/services/api/exam/question-part-service";

interface UseQuestionPartReturn {
    questionParts: QuestionPartDto[];
    selectedQuestionPart: QuestionPartDto | null;
    partsByQuestion: QuestionPartDto[];
    partsByMediaType: QuestionPartDto[];
    searchResults: QuestionPartDto[];
    partStatistics: QuestionPartStatistics | null;
    partTemplates: QuestionPartTemplate[];
    partPreview: QuestionPartPreview | null;
    loading: boolean;
    error: Error | null;
    createQuestionPart: (questionId: string, createRequest: CreateQuestionPartRequest) => Promise<void>;
    updateQuestionPart: (id: string, updateRequest: UpdateQuestionPartRequest) => Promise<void>;
    getQuestionPartById: (id: string) => Promise<void>;
    getQuestionPartsByQuestion: (questionId: string) => Promise<void>;
    deleteQuestionPart: (id: string) => Promise<void>;
    reorderQuestionParts: (questionId: string, partIds: string[]) => Promise<void>;
    copyQuestionPart: (partId: string, targetQuestionId: string) => Promise<void>;
    bulkCreateQuestionParts: (questionId: string, createRequests: CreateQuestionPartRequest[]) => Promise<void>;
    getQuestionPartStatistics: (questionId: string) => Promise<void>;
    searchQuestionParts: (questionId?: string, mediaType?: EMediaType, content?: string, label?: string, hasScore?: boolean, hasDuration?: boolean) => Promise<void>;
    getQuestionPartsByMediaType: (mediaType: EMediaType) => Promise<void>;
    getPartTemplates: (mediaType?: EMediaType) => Promise<void>;
    previewQuestionPart: (id: string) => Promise<void>;
    duplicateQuestionPart: (partId: string, newLabel?: string) => Promise<void>;
    clearQuestionPartData: () => void;
}

export const useQuestionPart = (): UseQuestionPartReturn => {
    const [questionParts, setQuestionParts] = useState<QuestionPartDto[]>([]);
    const [selectedQuestionPart, setSelectedQuestionPart] = useState<QuestionPartDto | null>(null);
    const [partsByQuestion, setPartsByQuestion] = useState<QuestionPartDto[]>([]);
    const [partsByMediaType, setPartsByMediaType] = useState<QuestionPartDto[]>([]);
    const [searchResults, setSearchResults] = useState<QuestionPartDto[]>([]);
    const [partStatistics, setPartStatistics] = useState<QuestionPartStatistics | null>(null);
    const [partTemplates, setPartTemplates] = useState<QuestionPartTemplate[]>([]);
    const [partPreview, setPartPreview] = useState<QuestionPartPreview | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createQuestionPart = useCallback(async (questionId: string, createRequest: CreateQuestionPartRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.createQuestionPart(questionId, createRequest);
            if (response.data && response.success) {
                setSelectedQuestionPart(response.data);
                showNotification.success('Soru parçası başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parçası oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateQuestionPart = useCallback(async (id: string, updateRequest: UpdateQuestionPartRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.updateQuestionPart(id, updateRequest);
            if (response.data && response.success) {
                setSelectedQuestionPart(response.data);
                showNotification.success('Soru parçası başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parçası güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionPartById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.getQuestionPartById(id);
            if (response.data && response.success) {
                setSelectedQuestionPart(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parçası alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionPartsByQuestion = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.getQuestionPartsByQuestion(questionId);
            if (response.data && response.success) {
                setPartsByQuestion(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parçaları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteQuestionPart = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.deleteQuestionPart(id);
            if (response.data && response.success) {
                showNotification.success('Soru parçası başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parçası silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const reorderQuestionParts = useCallback(async (questionId: string, partIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.reorderQuestionParts(questionId, partIds);
            if (response.data && response.success) {
                setPartsByQuestion(response.data);
                showNotification.success('Soru parçaları başarıyla yeniden sıralandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parçaları sıralanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyQuestionPart = useCallback(async (partId: string, targetQuestionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.copyQuestionPart(partId, targetQuestionId);
            if (response.data && response.success) {
                setSelectedQuestionPart(response.data);
                showNotification.success('Soru parçası başarıyla kopyalandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parçası kopyalanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateQuestionParts = useCallback(async (questionId: string, createRequests: CreateQuestionPartRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.bulkCreateQuestionParts(questionId, createRequests);
            if (response.data && response.success) {
                setQuestionParts(response.data);
                showNotification.success('Soru parçaları başarıyla toplu oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parçaları toplu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionPartStatistics = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.getQuestionPartStatistics(questionId);
            if (response.data && response.success) {
                setPartStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Parça istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchQuestionParts = useCallback(async (
        questionId?: string,
        mediaType?: EMediaType,
        content?: string,
        label?: string,
        hasScore?: boolean,
        hasDuration?: boolean
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.searchQuestionParts(questionId, mediaType, content, label, hasScore, hasDuration);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parçaları aranırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionPartsByMediaType = useCallback(async (mediaType: EMediaType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.getQuestionPartsByMediaType(mediaType);
            if (response.data && response.success) {
                setPartsByMediaType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Medya tipi parçaları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getPartTemplates = useCallback(async (mediaType?: EMediaType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.getPartTemplates(mediaType);
            if (response.data && response.success) {
                setPartTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Parça şablonları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const previewQuestionPart = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.previewQuestionPart(id);
            if (response.data && response.success) {
                setPartPreview(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Parça önizlemesi alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const duplicateQuestionPart = useCallback(async (partId: string, newLabel?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.duplicateQuestionPart(partId, newLabel);
            if (response.data && response.success) {
                setSelectedQuestionPart(response.data);
                showNotification.success('Soru parçası başarıyla çoğaltıldı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parçası çoğaltılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearQuestionPartData = useCallback(() => {
        setQuestionParts([]);
        setSelectedQuestionPart(null);
        setPartsByQuestion([]);
        setPartsByMediaType([]);
        setSearchResults([]);
        setPartStatistics(null);
        setPartTemplates([]);
        setPartPreview(null);
        setError(null);
    }, []);

    return {
        questionParts,
        selectedQuestionPart,
        partsByQuestion,
        partsByMediaType,
        searchResults,
        partStatistics,
        partTemplates,
        partPreview,
        loading,
        error,
        createQuestionPart,
        updateQuestionPart,
        getQuestionPartById,
        getQuestionPartsByQuestion,
        deleteQuestionPart,
        reorderQuestionParts,
        copyQuestionPart,
        bulkCreateQuestionParts,
        getQuestionPartStatistics,
        searchQuestionParts,
        getQuestionPartsByMediaType,
        getPartTemplates,
        previewQuestionPart,
        duplicateQuestionPart,
        clearQuestionPartData
    };
};