import { useState, useCallback } from 'react';

import {
    QuestionGroupQuestionStatistics,
    QuestionValidation,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import {QuestionDto, QuestionSearchRequest} from "@/types/exam/examEntities";
import {CreateQuestionRequest} from "@/types/exam/examRequests";
import {EQuestionType} from "@/types/exam/enum";
import {questionService} from "@/services/api/exam/question-service";

interface UseQuestionReturn {
    questions: QuestionDto[];
    selectedQuestion: QuestionDto | null;
    questionsByGroup: QuestionDto[];
    questionsByTemplate: QuestionDto[];
    questionsByType: QuestionDto[];
    searchResults: QuestionDto[];
    groupStatistics: QuestionGroupQuestionStatistics | null;
    questionValidation: QuestionValidation | null;
    loading: boolean;
    error: Error | null;
    createQuestion: (createRequest: CreateQuestionRequest) => Promise<void>;
    updateQuestion: (id: string, updateRequest: CreateQuestionRequest) => Promise<void>;
    getQuestionById: (id: string) => Promise<void>;
    getQuestionsByGroup: (questionGroupId: string) => Promise<void>;
    deleteQuestion: (id: string) => Promise<void>;
    reorderQuestions: (questionGroupId: string, questionIds: string[]) => Promise<void>;
    copyQuestion: (questionId: string, targetGroupId: string) => Promise<void>;
    searchQuestions: (searchRequest: QuestionSearchRequest) => Promise<void>;
    getQuestionsByTemplate: (templateId: string) => Promise<void>;
    getQuestionsByType: (questionType: EQuestionType) => Promise<void>;
    bulkCreateQuestions: (createRequests: CreateQuestionRequest[]) => Promise<void>;
    getGroupQuestionStatistics: (questionGroupId: string) => Promise<void>;
    validateQuestion: (id: string) => Promise<void>;
    duplicateQuestion: (questionId: string, newName?: string) => Promise<void>;
    clearQuestionData: () => void;
}

export const useQuestion = (): UseQuestionReturn => {
    const [questions, setQuestions] = useState<QuestionDto[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<QuestionDto | null>(null);
    const [questionsByGroup, setQuestionsByGroup] = useState<QuestionDto[]>([]);
    const [questionsByTemplate, setQuestionsByTemplate] = useState<QuestionDto[]>([]);
    const [questionsByType, setQuestionsByType] = useState<QuestionDto[]>([]);
    const [searchResults, setSearchResults] = useState<QuestionDto[]>([]);
    const [groupStatistics, setGroupStatistics] = useState<QuestionGroupQuestionStatistics | null>(null);
    const [questionValidation, setQuestionValidation] = useState<QuestionValidation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createQuestion = useCallback(async (createRequest: CreateQuestionRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.createQuestion(createRequest);
            if (response.data && response.success) {
                setSelectedQuestion(response.data);
                showNotification.success('Soru başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateQuestion = useCallback(async (id: string, updateRequest: CreateQuestionRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.updateQuestion(id, updateRequest);
            if (response.data && response.success) {
                setSelectedQuestion(response.data);
                showNotification.success('Soru başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.getQuestionById(id);
            if (response.data && response.success) {
                setSelectedQuestion(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionsByGroup = useCallback(async (questionGroupId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.getQuestionsByGroup(questionGroupId);
            if (response.data && response.success) {
                setQuestionsByGroup(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Grup soruları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteQuestion = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.deleteQuestion(id);
            if (response.success) {
                showNotification.success('Soru başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const reorderQuestions = useCallback(async (questionGroupId: string, questionIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.reorderQuestions(questionGroupId, questionIds);
            if (response.data && response.success) {
                setQuestionsByGroup(response.data);
                showNotification.success('Sorular başarıyla yeniden sıralandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sorular sıralanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyQuestion = useCallback(async (questionId: string, targetGroupId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.copyQuestion(questionId, targetGroupId);
            if (response.data && response.success) {
                setSelectedQuestion(response.data);
                showNotification.success('Soru başarıyla kopyalandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru kopyalanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchQuestions = useCallback(async (searchRequest: QuestionSearchRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.searchQuestions(searchRequest);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru aranırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionsByTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.getQuestionsByTemplate(templateId);
            if (response.data && response.success) {
                setQuestionsByTemplate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon soruları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionsByType = useCallback(async (questionType: EQuestionType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.getQuestionsByType(questionType);
            if (response.data && response.success) {
                setQuestionsByType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Tip soruları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateQuestions = useCallback(async (createRequests: CreateQuestionRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.bulkCreateQuestions(createRequests);
            if (response.data && response.success) {
                setQuestions(response.data);
                showNotification.success('Sorular başarıyla toplu oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sorular toplu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getGroupQuestionStatistics = useCallback(async (questionGroupId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.getGroupQuestionStatistics(questionGroupId);
            if (response.data && response.success) {
                setGroupStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Grup istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateQuestion = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.validateQuestion(id);
            if (response.data && response.success) {
                setQuestionValidation(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru doğrulanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const duplicateQuestion = useCallback(async (questionId: string, newName?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.duplicateQuestion(questionId, newName);
            if (response.data && response.success) {
                setSelectedQuestion(response.data);
                showNotification.success('Soru başarıyla çoğaltıldı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru çoğaltılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearQuestionData = useCallback(() => {
        setQuestions([]);
        setSelectedQuestion(null);
        setQuestionsByGroup([]);
        setQuestionsByTemplate([]);
        setQuestionsByType([]);
        setSearchResults([]);
        setGroupStatistics(null);
        setQuestionValidation(null);
        setError(null);
    }, []);

    return {
        questions,
        selectedQuestion,
        questionsByGroup,
        questionsByTemplate,
        questionsByType,
        searchResults,
        groupStatistics,
        questionValidation,
        loading,
        error,
        createQuestion,
        updateQuestion,
        getQuestionById,
        getQuestionsByGroup,
        deleteQuestion,
        reorderQuestions,
        copyQuestion,
        searchQuestions,
        getQuestionsByTemplate,
        getQuestionsByType,
        bulkCreateQuestions,
        getGroupQuestionStatistics,
        validateQuestion,
        duplicateQuestion,
        clearQuestionData
    };
};