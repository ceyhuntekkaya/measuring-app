import { useState, useCallback } from 'react';

import {
    ExamPreview,
    ExamSessionInfo,
    ExamSessionStatus,
    ExamSessionResult,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import {ExamReadyDto, ExamSectionReadyDto, QuestionGroupReadyDto, QuestionReadyDto} from "@/types/exam/examReady";
import {ExamNavigationDto, ExamReadinessValidation} from "@/types/exam/examEntities";
import {examReadyService} from "@/services/api/exam/exam-ready-service";

interface UseExamReadyReturn {
    examReady: ExamReadyDto | null;
    examSectionsReady: ExamSectionReadyDto[];
    questionGroupReady: QuestionGroupReadyDto | null;
    questionReady: QuestionReadyDto | null;
    examNavigation: ExamNavigationDto | null;
    examReadinessValidation: ExamReadinessValidation | null;
    examPreview: ExamPreview | null;
    availableExams: ExamPreview[];
    examSessionInfo: ExamSessionInfo | null;
    sessionStatus: ExamSessionStatus | null;
    sessionResult: ExamSessionResult | null;
    loading: boolean;
    error: Error | null;
    getExamReady: (examTypeId: string) => Promise<void>;
    getExamSectionsReady: (examTypeId: string) => Promise<void>;
    getQuestionGroupReady: (questionGroupId: string) => Promise<void>;
    getQuestionReady: (questionId: string) => Promise<void>;
    validateExamReadiness: (examTypeId: string) => Promise<void>;
    getExamNavigation: (examTypeId: string) => Promise<void>;
    getExamPreview: (examTypeId: string) => Promise<void>;
    getAvailableExams: (examLevel?: string, examType?: string) => Promise<void>;
    startExamSession: (examTypeId: string) => Promise<void>;
    getSessionStatus: (sessionId: string) => Promise<void>;
    endExamSession: (sessionId: string) => Promise<void>;
    clearExamData: () => void;
}

export const useExamReady = (): UseExamReadyReturn => {
    const [examReady, setExamReady] = useState<ExamReadyDto | null>(null);
    const [examSectionsReady, setExamSectionsReady] = useState<ExamSectionReadyDto[]>([]);
    const [questionGroupReady, setQuestionGroupReady] = useState<QuestionGroupReadyDto | null>(null);
    const [questionReady, setQuestionReady] = useState<QuestionReadyDto | null>(null);
    const [examNavigation, setExamNavigation] = useState<ExamNavigationDto | null>(null);
    const [examReadinessValidation, setExamReadinessValidation] = useState<ExamReadinessValidation | null>(null);
    const [examPreview, setExamPreview] = useState<ExamPreview | null>(null);
    const [availableExams, setAvailableExams] = useState<ExamPreview[]>([]);
    const [examSessionInfo, setExamSessionInfo] = useState<ExamSessionInfo | null>(null);
    const [sessionStatus, setSessionStatus] = useState<ExamSessionStatus | null>(null);
    const [sessionResult, setSessionResult] = useState<ExamSessionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const getExamReady = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getExamReady(examTypeId);
            if (response.data && response.success) {
                setExamReady(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav hazırlanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSectionsReady = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getExamSectionsReady(examTypeId);
            if (response.data && response.success) {
                setExamSectionsReady(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav bölümleri hazırlanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupReady = useCallback(async (questionGroupId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getQuestionGroupReady(questionGroupId);
            if (response.data && response.success) {
                setQuestionGroupReady(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu hazırlanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionReady = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getQuestionReady(questionId);
            if (response.data && response.success) {
                setQuestionReady(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru hazırlanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateExamReadiness = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.validateExamReadiness(examTypeId);
            if (response.data && response.success) {
                setExamReadinessValidation(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav hazırlık kontrolü yapılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamNavigation = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getExamNavigation(examTypeId);
            if (response.data && response.success) {
                setExamNavigation(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav navigasyonu alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamPreview = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getExamPreview(examTypeId);
            if (response.data && response.success) {
                setExamPreview(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav önizlemesi alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAvailableExams = useCallback(async (examLevel?: string, examType?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getAvailableExams(examLevel, examType);
            if (response.data && response.success) {
                setAvailableExams(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Mevcut sınavlar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const startExamSession = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.startExamSession(examTypeId);
            if (response.data && response.success) {
                setExamSessionInfo(response.data);
                showNotification.success('Sınav oturumu başarıyla başlatıldı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav oturumu başlatılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getSessionStatus = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getSessionStatus(sessionId);
            if (response.data && response.success) {
                setSessionStatus(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Oturum durumu alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const endExamSession = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.endExamSession(sessionId);
            if (response.data && response.success) {
                setSessionResult(response.data);
                showNotification.success('Sınav oturumu başarıyla sonlandırıldı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav oturumu sonlandırılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearExamData = useCallback(() => {
        setExamReady(null);
        setExamSectionsReady([]);
        setQuestionGroupReady(null);
        setQuestionReady(null);
        setExamNavigation(null);
        setExamReadinessValidation(null);
        setExamPreview(null);
        setAvailableExams([]);
        setExamSessionInfo(null);
        setSessionStatus(null);
        setSessionResult(null);
        setError(null);
    }, []);

    return {
        examReady,
        examSectionsReady,
        questionGroupReady,
        questionReady,
        examNavigation,
        examReadinessValidation,
        examPreview,
        availableExams,
        examSessionInfo,
        sessionStatus,
        sessionResult,
        loading,
        error,
        getExamReady,
        getExamSectionsReady,
        getQuestionGroupReady,
        getQuestionReady,
        validateExamReadiness,
        getExamNavigation,
        getExamPreview,
        getAvailableExams,
        startExamSession,
        getSessionStatus,
        endExamSession,
        clearExamData
    };
};