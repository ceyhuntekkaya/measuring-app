import { useState, useCallback } from 'react';
import {
    ExamSessionFormData,
    ExamSessionSearchRequest,
    ExamSessionListResponse,
    ExamSessionStatistics,
    SessionDashboard,
    SessionApplicationDto,
    UpdateStatusRequest,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import {ExamSessionDto, UpdateExamSessionStateRequest} from "@/types/exam/examEntities";
import {examSessionService} from "@/services/api/exam/exam-session-service";
import {ESessionState} from "@/types/exam/enum";

interface UseExamSessionReturn {
    examSessions: ExamSessionListResponse | null;
    selectedExamSession: ExamSessionDto | null;
    examSessionsByBranch: ExamSessionDto[];
    upcomingExamSessions: ExamSessionDto[];
    activeExamSessions: ExamSessionDto[];
    completedExamSessions: ExamSessionDto[];
    sessionStatistics: ExamSessionStatistics | null;
    sessionDashboard: SessionDashboard | null;
    sessionApplications: SessionApplicationDto[];
    loading: boolean;
    error: Error | null;
    createExamSession: (createRequest: ExamSessionFormData) => Promise<void>;
    updateExamSession: (updateRequest: ExamSessionFormData) => Promise<void>;
    getExamSessionById: (id: string) => Promise<void>;
    getExamSessions: (searchRequest?: ExamSessionSearchRequest) => Promise<void>;
    deleteExamSession: (id: string) => Promise<void>;
    addSupervisor: (sessionId: string, supervisorId: string) => Promise<void>;
    removeSupervisor: (sessionId: string, supervisorId: string) => Promise<void>;
    getExamSessionsByBranch: (branchId: string) => Promise<void>;
    getUpcomingExamSessions: () => Promise<void>;
    getExamSessionStatistics: (id: string) => Promise<void>;
    copyExamSession: (id: string, newName: string, newStartDate: string) => Promise<void>;
    getActiveExamSessions: () => Promise<void>;
    getCompletedExamSessions: (page?: number, size?: number) => Promise<void>;
    getSessionDashboard: () => Promise<void>;
    getSessionApplications: (id: string, status?: string, page?: number, size?: number) => Promise<void>;
    updateSessionStatus: (id: string, statusRequest: UpdateStatusRequest) => Promise<void>;
    clearSessionData: () => void;
    setExamSessionBeginAt: (sessionId: string) => Promise<void>;
    setExamSessionEndAt: (sessionId: string) => Promise<void>;
    setExamSessionIsFinish: (sessionId: string) => Promise<void>;
    updateExamSessionSessionState: (sessionId: string, sessionState: ESessionState) => Promise<void>;
}

export const useExamSession = (): UseExamSessionReturn => {
    const [examSessions, setExamSessions] = useState<ExamSessionListResponse | null>(null);
    const [selectedExamSession, setSelectedExamSession] = useState<ExamSessionDto | null>(null);
    const [examSessionsByBranch, setExamSessionsByBranch] = useState<ExamSessionDto[]>([]);
    const [upcomingExamSessions, setUpcomingExamSessions] = useState<ExamSessionDto[]>([]);
    const [activeExamSessions, setActiveExamSessions] = useState<ExamSessionDto[]>([]);
    const [completedExamSessions, setCompletedExamSessions] = useState<ExamSessionDto[]>([]);
    const [sessionStatistics, setSessionStatistics] = useState<ExamSessionStatistics | null>(null);
    const [sessionDashboard, setSessionDashboard] = useState<SessionDashboard | null>(null);
    const [sessionApplications, setSessionApplications] = useState<SessionApplicationDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createExamSession = useCallback(async (createRequest: ExamSessionFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.createExamSession(createRequest);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                showNotification.success('Sınav oturumu başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav oturumu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExamSession = useCallback(async (updateRequest: ExamSessionFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.updateExamSession(updateRequest.id, updateRequest);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                showNotification.success('Sınav oturumu başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav oturumu güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSessionById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getExamSessionById(id);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav oturumu alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSessions = useCallback(async (searchRequest: ExamSessionSearchRequest = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getExamSessions(searchRequest);
            if (response.data && response.success) {
                setExamSessions(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav oturumları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteExamSession = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.deleteExamSession(id);
            if (response.success) {
                showNotification.success('Sınav oturumu başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav oturumu silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const addSupervisor = useCallback(async (sessionId: string, supervisorId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.addSupervisor(sessionId, supervisorId);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                showNotification.success('Gözetmen başarıyla eklendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Gözetmen eklenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const removeSupervisor = useCallback(async (sessionId: string, supervisorId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.removeSupervisor(sessionId, supervisorId);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                showNotification.success('Gözetmen başarıyla kaldırıldı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Gözetmen kaldırılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSessionsByBranch = useCallback(async (branchId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getExamSessionsByBranch(branchId);
            if (response.data && response.success) {
                setExamSessionsByBranch(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şube sınav oturumları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUpcomingExamSessions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getUpcomingExamSessions();
            if (response.data && response.success) {
                setUpcomingExamSessions(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Yaklaşan sınav oturumları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSessionStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getExamSessionStatistics(id);
            if (response.data && response.success) {
                setSessionStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav oturumu istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyExamSession = useCallback(async (id: string, newName: string, newStartDate: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.copyExamSession(id, newName, newStartDate);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                showNotification.success('Sınav oturumu başarıyla kopyalandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav oturumu kopyalanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getActiveExamSessions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getActiveExamSessions();
            if (response.data && response.success) {
                setActiveExamSessions(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aktif sınav oturumları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCompletedExamSessions = useCallback(async (page: number = 0, size: number = 20) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getCompletedExamSessions(page, size);
            if (response.data && response.success) {
                setCompletedExamSessions(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Tamamlanan sınav oturumları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getSessionDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getSessionDashboard();
            if (response.data && response.success) {
                setSessionDashboard(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Oturum panosu alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getSessionApplications = useCallback(async (id: string, status?: string, page: number = 0, size: number = 20) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getSessionApplications(id, status, page, size);
            if (response.data && response.success) {
                setSessionApplications(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Oturum başvuruları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSessionStatus = useCallback(async (id: string, statusRequest: UpdateStatusRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.updateSessionStatus(id, statusRequest);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                showNotification.success('Oturum durumu başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Oturum durumu güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const setExamSessionBeginAt = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.setExamSessionBeginAt(sessionId);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                showNotification.success('Oturum başlangıç zamanı kaydedildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başlangıç zamanı kaydedilirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const setExamSessionEndAt = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.setExamSessionEndAt(sessionId);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                showNotification.success('Oturum bitiş zamanı kaydedildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bitiş zamanı kaydedilirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const setExamSessionIsFinish = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.setExamSessionIsFinish(sessionId);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                showNotification.success('Oturum sonlandırıldı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Oturum sonlandırılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExamSessionSessionState = useCallback(async (sessionId: string, sessionState: ESessionState) => {
        try {
            setLoading(true);
            setError(null);
            const updateRequest: UpdateExamSessionStateRequest = {
                examSessionId: sessionId,
                sessionState
            };
            const response = await examSessionService.updateExamSessionSessionState(sessionId, updateRequest);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                const stateMessage = sessionState === ESessionState.IN_PROGRESS 
                    ? 'Oturum durumu "Devam Ediyor" olarak güncellendi!' 
                    : sessionState === ESessionState.FINISHED 
                        ? 'Oturum durumu "Tamamlandı" olarak güncellendi!'
                        : 'Oturum durumu güncellendi!';
                showNotification.success(stateMessage);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Oturum durumu güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearSessionData = useCallback(() => {
        setExamSessions(null);
        setSelectedExamSession(null);
        setExamSessionsByBranch([]);
        setUpcomingExamSessions([]);
        setActiveExamSessions([]);
        setCompletedExamSessions([]);
        setSessionStatistics(null);
        setSessionDashboard(null);
        setSessionApplications([]);
        setError(null);
    }, []);

    return {
        examSessions,
        selectedExamSession,
        examSessionsByBranch,
        upcomingExamSessions,
        activeExamSessions,
        completedExamSessions,
        sessionStatistics,
        sessionDashboard,
        sessionApplications,
        loading,
        error,
        createExamSession,
        updateExamSession,
        getExamSessionById,
        getExamSessions,
        deleteExamSession,
        addSupervisor,
        removeSupervisor,
        getExamSessionsByBranch,
        getUpcomingExamSessions,
        getExamSessionStatistics,
        copyExamSession,
        getActiveExamSessions,
        getCompletedExamSessions,
        getSessionDashboard,
        getSessionApplications,
        updateSessionStatus,
        clearSessionData,
        setExamSessionBeginAt,
        setExamSessionEndAt,
        setExamSessionIsFinish,
        updateExamSessionSessionState
    };
};