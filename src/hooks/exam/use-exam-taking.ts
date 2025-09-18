// hooks/use-exam-taking.ts

import { useState, useCallback } from 'react';
import {
    examTakingService,
    LoginCredentials,
    TakingExamSession,
    SectionProgress,
    ExamAnswer
} from '@/services/api/exam/exam-taking-service';
import { ExamDto } from '@/types/exam/examEntities';
import { showNotification } from '@/lib/notification';
import {ApplicationDto} from "@/types/management/brand";

interface UseExamTakingReturn {
    application: ApplicationDto | null;
    exam: ExamDto | null;
    examSession: TakingExamSession | null;
    sectionProgress: SectionProgress | null;
    availableSections: string[] | null;
    loading: boolean;
    error: Error | null;
    loginWithCredentials: (credentials: LoginCredentials) => Promise<void>;
    getApplicationByCredentials: (username: string, password: string) => Promise<void>;
    getExamByApplication: (applicationId: string) => Promise<void>;
    startExam: (applicationId: string) => Promise<void>;
    getExamSession: (applicationId: string) => Promise<void>;
    startExamSection: (applicationId: string, sectionId: string) => Promise<void>;
    completeExamSection: (applicationId: string, sectionId: string) => Promise<void>;
    completeExam: (applicationId: string) => Promise<void>;
    saveAnswer: (applicationId: string, answer: ExamAnswer) => Promise<void>;
    saveProgress: (applicationId: string, progress: SectionProgress) => Promise<void>;
    getAvailableExamSections: (applicationId: string) => Promise<void>;
    validateExamAccess: (applicationId: string) => Promise<boolean>;
    clearExamData: () => void;
}

export const useExamTaking = (): UseExamTakingReturn => {
    const [application, setApplication] = useState<ApplicationDto | null>(null);
    const [exam, setExam] = useState<ExamDto | null>(null);
    const [examSession, setExamSession] = useState<TakingExamSession | null>(null);
    const [sectionProgress, setSectionProgress] = useState<SectionProgress | null>(null);
    const [availableSections, setAvailableSections] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loginWithCredentials = useCallback(async (credentials: LoginCredentials) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTakingService.loginWithCredentials(credentials);
            if (response.data && response.success) {
                setApplication(response.data);
                localStorage.setItem('exam', JSON.stringify(response.data));
                showNotification.success('Giriş başarılı!');
            } else {
                throw new Error(response.message || 'Giriş başarısız');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Giriş sırasında bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationByCredentials = useCallback(async (username: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTakingService.getApplicationByCredentials(username, password);
            if (response.data && response.success) {
                setApplication(response.data);
            } else {
                throw new Error(response.message || 'Başvuru bulunamadı');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Başvuru alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamByApplication = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTakingService.getExamByApplication(applicationId);
            if (response.data && response.success) {
                setExam(response.data);
            } else {
                throw new Error(response.message || 'Sınav bulunamadı');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav bilgileri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const startExam = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTakingService.startExam(applicationId);
            if (response.data && response.success) {
                setExamSession(response.data);
                showNotification.success('Sınav başlatıldı!');
            } else {
                throw new Error(response.message || 'Sınav başlatılamadı');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav başlatılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSession = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTakingService.getExamSession(applicationId);
            if (response.data && response.success) {
                setExamSession(response.data);
            } else {
                throw new Error(response.message || 'Sınav oturumu bulunamadı');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav oturumu alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const startExamSection = useCallback(async (applicationId: string, sectionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTakingService.startExamSection(applicationId, sectionId);
            if (response.data && response.success) {
                setSectionProgress(response.data);
                showNotification.success('Bölüm başlatıldı!');
            } else {
                throw new Error(response.message || 'Bölüm başlatılamadı');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Bölüm başlatılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const completeExamSection = useCallback(async (applicationId: string, sectionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTakingService.completeExamSection(applicationId, sectionId);
            if (response.data && response.success) {
                setExamSession(response.data);
                showNotification.success('Bölüm tamamlandı!');
            } else {
                throw new Error(response.message || 'Bölüm tamamlanamadı');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Bölüm tamamlanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const completeExam = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTakingService.completeExam(applicationId);
            if (response.data && response.success) {
                setExamSession(response.data);
                showNotification.success('Sınav tamamlandı!');
            } else {
                throw new Error(response.message || 'Sınav tamamlanamadı');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav tamamlanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const saveAnswer = useCallback(async (applicationId: string, answer: ExamAnswer) => {
        try {
            setError(null);
            const response = await examTakingService.saveAnswer(applicationId, answer);
            if (!response.success) {
                throw new Error(response.message || 'Cevap kaydedilemedi');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            console.error('Cevap kaydedilirken hata:', err);
        }
    }, []);

    const saveProgress = useCallback(async (applicationId: string, progress: SectionProgress) => {
        try {
            setError(null);
            const response = await examTakingService.saveProgress(applicationId, progress);
            if (!response.success) {
                throw new Error(response.message || 'İlerleme kaydedilemedi');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            console.error('İlerleme kaydedilirken hata:', err);
        }
    }, []);

    const getAvailableExamSections = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTakingService.getAvailableExamSections(applicationId);
            if (response.data && response.success) {
                setAvailableSections(response.data);
            } else {
                throw new Error(response.message || 'Bölümler alınamadı');
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Kullanılabilir bölümler alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateExamAccess = useCallback(async (applicationId: string): Promise<boolean> => {
        try {
            setError(null);
            const response = await examTakingService.validateExamAccess(applicationId);
            return response.data || false;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            console.error('Sınav erişimi kontrol edilirken hata:', err);
            return false;
        }
    }, []);

    const clearExamData = useCallback(() => {
        setApplication(null);
        setExam(null);
        setExamSession(null);
        setSectionProgress(null);
        setAvailableSections(null);
        setError(null);
    }, []);

    return {
        application,
        exam,
        examSession,
        sectionProgress,
        availableSections,
        loading,
        error,
        loginWithCredentials,
        getApplicationByCredentials,
        getExamByApplication,
        startExam,
        getExamSession,
        startExamSection,
        completeExamSection,
        completeExam,
        saveAnswer,
        saveProgress,
        getAvailableExamSections,
        validateExamAccess,
        clearExamData
    };
};