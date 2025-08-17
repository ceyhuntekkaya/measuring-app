import { useState, useCallback } from 'react';

import {
    UpdateQuestionOptionRequest,
    QuestionOptionStatistics,
    QuestionOptionAnalysis,
    QuestionOptionValidation,

} from '@/types/exam/examResponses';;
import { showNotification } from '@/lib/notification';
import {QuestionOptionDto} from "@/types/exam/examEntities";
import {CreateQuestionOptionRequest} from "@/types/exam/examRequests";
import {EMediaType} from "@/types/exam/enum";
import {questionOptionService} from "@/services/api/exam/question-option-service";

interface UseQuestionOptionReturn {
    questionOptions: QuestionOptionDto[];
    selectedOption: QuestionOptionDto | null;
    optionsByQuestion: QuestionOptionDto[];
    secureOptionsByQuestion: QuestionOptionDto[];
    searchResults: QuestionOptionDto[];
    optionStatistics: QuestionOptionStatistics | null;
    optionAnalysis: QuestionOptionAnalysis | null;
    optionValidation: QuestionOptionValidation | null;
    loading: boolean;
    error: Error | null;
    createQuestionOption: (questionId: string, createRequest: CreateQuestionOptionRequest) => Promise<void>;
    updateQuestionOption: (id: string, updateRequest: UpdateQuestionOptionRequest) => Promise<void>;
    getQuestionOptionById: (id: string) => Promise<void>;
    getQuestionOptionsByQuestion: (questionId: string) => Promise<void>;
    getSecureQuestionOptionsByQuestion: (questionId: string) => Promise<void>;
    deleteQuestionOption: (id: string) => Promise<void>;
    reorderQuestionOptions: (questionId: string, optionIds: string[]) => Promise<void>;
    setCorrectAnswers: (questionId: string, correctOptionIds: string[]) => Promise<void>;
    copyQuestionOption: (optionId: string, targetQuestionId: string) => Promise<void>;
    bulkCreateQuestionOptions: (questionId: string, createRequests: CreateQuestionOptionRequest[]) => Promise<void>;
    getQuestionOptionStatistics: (questionId: string) => Promise<void>;
    searchQuestionOptions: (questionId?: string, mediaType?: EMediaType, content?: string, isTrueOption?: boolean) => Promise<void>;
    analyzeQuestionOptions: (questionId: string) => Promise<void>;
    validateQuestionOptions: (questionId: string) => Promise<void>;
    shuffleQuestionOptions: (questionId: string) => Promise<void>;
    clearOptionData: () => void;
}

export const useQuestionOption = (): UseQuestionOptionReturn => {
    const [questionOptions, setQuestionOptions] = useState<QuestionOptionDto[]>([]);
    const [selectedOption, setSelectedOption] = useState<QuestionOptionDto | null>(null);
    const [optionsByQuestion, setOptionsByQuestion] = useState<QuestionOptionDto[]>([]);
    const [secureOptionsByQuestion, setSecureOptionsByQuestion] = useState<QuestionOptionDto[]>([]);
    const [searchResults, setSearchResults] = useState<QuestionOptionDto[]>([]);
    const [optionStatistics, setOptionStatistics] = useState<QuestionOptionStatistics | null>(null);
    const [optionAnalysis, setOptionAnalysis] = useState<QuestionOptionAnalysis | null>(null);
    const [optionValidation, setOptionValidation] = useState<QuestionOptionValidation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createQuestionOption = useCallback(async (questionId: string, createRequest: CreateQuestionOptionRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.createQuestionOption(questionId, createRequest);
            if (response.data && response.success) {
                setSelectedOption(response.data);
                showNotification.success('Soru seçeneği başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seçeneği oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateQuestionOption = useCallback(async (id: string, updateRequest: UpdateQuestionOptionRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.updateQuestionOption(id, updateRequest);
            if (response.data && response.success) {
                setSelectedOption(response.data);
                showNotification.success('Soru seçeneği başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seçeneği güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionOptionById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.getQuestionOptionById(id);
            if (response.data && response.success) {
                setSelectedOption(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seçeneği alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionOptionsByQuestion = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.getQuestionOptionsByQuestion(questionId);
            if (response.data && response.success) {
                setOptionsByQuestion(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seçenekleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getSecureQuestionOptionsByQuestion = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.getSecureQuestionOptionsByQuestion(questionId);
            if (response.data && response.success) {
                setSecureOptionsByQuestion(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Güvenli soru seçenekleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteQuestionOption = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.deleteQuestionOption(id);
            if (response.success) {
                showNotification.success('Soru seçeneği başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seçeneği silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const reorderQuestionOptions = useCallback(async (questionId: string, optionIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.reorderQuestionOptions(questionId, optionIds);
            if (response.data && response.success) {
                setOptionsByQuestion(response.data);
                showNotification.success('Soru seçenekleri başarıyla yeniden sıralandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seçenekleri sıralanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const setCorrectAnswers = useCallback(async (questionId: string, correctOptionIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.setCorrectAnswers(questionId, correctOptionIds);
            if (response.data && response.success) {
                setOptionsByQuestion(response.data);
                showNotification.success('Doğru cevaplar başarıyla belirlendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Doğru cevaplar belirlenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyQuestionOption = useCallback(async (optionId: string, targetQuestionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.copyQuestionOption(optionId, targetQuestionId);
            if (response.data && response.success) {
                setSelectedOption(response.data);
                showNotification.success('Soru seçeneği başarıyla kopyalandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seçeneği kopyalanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateQuestionOptions = useCallback(async (questionId: string, createRequests: CreateQuestionOptionRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.bulkCreateQuestionOptions(questionId, createRequests);
            if (response.data && response.success) {
                setQuestionOptions(response.data);
                showNotification.success('Soru seçenekleri başarıyla toplu oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seçenekleri toplu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionOptionStatistics = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.getQuestionOptionStatistics(questionId);
            if (response.data && response.success) {
                setOptionStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Seçenek istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchQuestionOptions = useCallback(async (
        questionId?: string,
        mediaType?: EMediaType,
        content?: string,
        isTrueOption?: boolean
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.searchQuestionOptions(questionId, mediaType, content, isTrueOption);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seçenekleri aranırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const analyzeQuestionOptions = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.analyzeQuestionOptions(questionId);
            if (response.data && response.success) {
                setOptionAnalysis(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seçenekleri analiz edilirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateQuestionOptions = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.validateQuestionOptions(questionId);
            if (response.data && response.success) {
                setOptionValidation(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seçenekleri doğrulanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const shuffleQuestionOptions = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.shuffleQuestionOptions(questionId);
            if (response.data && response.success) {
                setOptionsByQuestion(response.data);
                showNotification.success('Soru seçenekleri başarıyla karıştırıldı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seçenekleri karıştırılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearOptionData = useCallback(() => {
        setQuestionOptions([]);
        setSelectedOption(null);
        setOptionsByQuestion([]);
        setSecureOptionsByQuestion([]);
        setSearchResults([]);
        setOptionStatistics(null);
        setOptionAnalysis(null);
        setOptionValidation(null);
        setError(null);
    }, []);

    return {
        questionOptions,
        selectedOption,
        optionsByQuestion,
        secureOptionsByQuestion,
        searchResults,
        optionStatistics,
        optionAnalysis,
        optionValidation,
        loading,
        error,
        createQuestionOption,
        updateQuestionOption,
        getQuestionOptionById,
        getQuestionOptionsByQuestion,
        getSecureQuestionOptionsByQuestion,
        deleteQuestionOption,
        reorderQuestionOptions,
        setCorrectAnswers,
        copyQuestionOption,
        bulkCreateQuestionOptions,
        getQuestionOptionStatistics,
        searchQuestionOptions,
        analyzeQuestionOptions,
        validateQuestionOptions,
        shuffleQuestionOptions,
        clearOptionData
    };
};