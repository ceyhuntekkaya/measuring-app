import { useState, useCallback } from 'react';

import {
    ApplicationDto,
    ApplicationFormData,
    StartApplicationRequest,
    CompleteApplicationRequest,
    BulkCreateApplicationRequest,
    ApplicationStatistics,
    ExamSessionApplicationsSummary,
    ApplicationSearchParams
} from '@/types/management/brand';
import { showNotification } from '@/lib/notification';
import {applicationService} from "@/services/api/management/appication-service";
import {EvaluationDto, UpdateApplicationState} from "@/types/exam/examEntities";

interface UseApplicationReturn {
    applications: ApplicationDto[] | null;
    selectedApplication: ApplicationDto | null;
    examSessionApplications: ApplicationDto[] | null;
    candidateApplications: ApplicationDto[] | null;
    awaitingEvaluationApplications: ApplicationDto[] | null;
    applicationStatistics: ApplicationStatistics | null;
    examSessionApplicationsSummary: ExamSessionApplicationsSummary | null;
    loading: boolean;
    error: Error | null;
    createApplication: (createRequest: ApplicationFormData) => Promise<void>;
    updateApplication: (updateRequest: ApplicationFormData) => Promise<void>;
    startApplication: (startRequest: StartApplicationRequest) => Promise<void>;
    completeApplication: (completeRequest: CompleteApplicationRequest) => Promise<void>;
    getApplicationById: (id: string) => Promise<void>;
    getApplicationsByExamSession: (examSessionId: string) => Promise<void>;
    getApplicationsByCandidate: (candidateId: string) => Promise<void>;
    getApplicationsAwaitingEvaluation: () => Promise<void>;
    bulkCreateApplications: (bulkRequest: BulkCreateApplicationRequest) => Promise<void>;
    deleteApplication: (id: string) => Promise<void>;
    getApplicationStatistics: (examSessionId: string) => Promise<void>;
    getExamSessionApplicationsSummary: (examSessionId: string) => Promise<void>;
    searchApplications: (searchParams?: ApplicationSearchParams) => Promise<void>;
    startApplicationById: (applicationId: string) => Promise<void>;
    completeApplicationById: (applicationId: string) => Promise<void>;
    quickCreateApplication: (name: string, code: string, examId: string, examSessionId: string, candidateId: string, username?: string) => Promise<void>;
    createApplicationsForCandidates: (examSessionId: string, examId: string, candidateIds: string[], namePrefix?: string, codePrefix?: string) => Promise<void>;
    clearApplicationData: () => void;
    updateApplicationState: (applicationId: string, updateApplicationState: UpdateApplicationState) => Promise<void>;
    getApplicationEvaluationsBySession: (sessionId: string) => Promise<void>;
    sessionEvaluations: EvaluationDto[] | null;
}

export const useApplication = (): UseApplicationReturn => {
    const [applications, setApplications] = useState<ApplicationDto[] | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<ApplicationDto | null>(null);
    const [examSessionApplications, setExamSessionApplications] = useState<ApplicationDto[] | null>(null);
    const [candidateApplications, setCandidateApplications] = useState<ApplicationDto[] | null>(null);
    const [awaitingEvaluationApplications, setAwaitingEvaluationApplications] = useState<ApplicationDto[] | null>(null);
    const [applicationStatistics, setApplicationStatistics] = useState<ApplicationStatistics | null>(null);
    const [examSessionApplicationsSummary, setExamSessionApplicationsSummary] = useState<ExamSessionApplicationsSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const [sessionEvaluations, setSessionEvaluations] = useState<EvaluationDto[] | null>(null);



    const createApplication = useCallback(async (createRequest: ApplicationFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.createApplication(createRequest);
            if (response.data && response.success) {
                setSelectedApplication(response.data);
                showNotification.success('Başvuru başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başvuru oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateApplication = useCallback(async (updateRequest: ApplicationFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.updateApplication(updateRequest.id, updateRequest);
            if (response.data && response.success) {
                setSelectedApplication(response.data);
                showNotification.success('Başvuru başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başvuru güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const startApplication = useCallback(async (startRequest: StartApplicationRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.startApplication(startRequest);
            if (response.data && response.success) {
                setSelectedApplication(response.data);
                showNotification.success('Başvuru başarıyla başlatıldı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başvuru başlatılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const completeApplication = useCallback(async (completeRequest: CompleteApplicationRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.completeApplication(completeRequest);
            if (response.data && response.success) {
                setSelectedApplication(response.data);
                showNotification.success('Başvuru başarıyla tamamlandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başvuru tamamlanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.getApplicationById(id);
            if (response.data && response.success) {
                setSelectedApplication(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başvuru alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationsByExamSession = useCallback(async (examSessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.getApplicationsByExamSession(examSessionId);
            if (response.data && response.success) {
                setExamSessionApplications(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav oturumu başvuruları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationsByCandidate = useCallback(async (candidateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.getApplicationsByCandidate(candidateId);
            if (response.data && response.success) {
                setCandidateApplications(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday başvuruları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationsAwaitingEvaluation = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.getApplicationsAwaitingEvaluation();
            if (response.data && response.success) {
                setAwaitingEvaluationApplications(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Değerlendirme bekleyen başvurular alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateApplications = useCallback(async (bulkRequest: BulkCreateApplicationRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.bulkCreateApplications(bulkRequest);
            if (response.data && response.success) {
                setApplications(response.data);
                showNotification.success('Başvurular başarıyla toplu oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başvurular toplu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteApplication = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.deleteApplication(id);
            if (response.success) {
                showNotification.success('Başvuru başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başvuru silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationStatistics = useCallback(async (examSessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.getApplicationStatistics(examSessionId);
            if (response.data && response.success) {
                setApplicationStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başvuru istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSessionApplicationsSummary = useCallback(async (examSessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.getExamSessionApplicationsSummary(examSessionId);
            if (response.data && response.success) {
                setExamSessionApplicationsSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav oturumu başvuru özeti alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchApplications = useCallback(async (searchParams: ApplicationSearchParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.searchApplications(searchParams);
            if (response.data && response.success) {
                setApplications(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başvuru arama yapılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const startApplicationById = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.startApplicationById(applicationId);
            if (response.data && response.success) {
                setSelectedApplication(response.data);
                showNotification.success('Başvuru başarıyla başlatıldı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başvuru başlatılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const completeApplicationById = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.completeApplicationById(applicationId);
            if (response.data && response.success) {
                setSelectedApplication(response.data);
                showNotification.success('Başvuru başarıyla tamamlandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başvuru tamamlanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);




    const updateApplicationState = useCallback(async (applicationId: string, updateApplicationState: UpdateApplicationState) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.updateApplicationState(applicationId, updateApplicationState);
            if (!response.data || !response.success) {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bilgi güncellenirken!');
        } finally {
            setLoading(false);
        }
    }, []);

    const quickCreateApplication = useCallback(async (
        name: string,
        code: string,
        examId: string,
        examSessionId: string,
        candidateId: string,
        username?: string
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.quickCreateApplication(
                name, code, examId, examSessionId, candidateId, username
            );
            if (response.data && response.success) {
                setSelectedApplication(response.data);
                showNotification.success('Hızlı başvuru başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Hızlı başvuru oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createApplicationsForCandidates = useCallback(async (
        examSessionId: string,
        examId: string,
        candidateIds: string[],
        namePrefix: string = "Application",
        codePrefix: string = "APP"
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.createApplicationsForCandidates(
                examSessionId, examId, candidateIds, namePrefix, codePrefix
            );
            if (response.data && response.success) {
                setApplications(response.data);
                showNotification.success('Adaylar için başvurular başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Adaylar için başvurular oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);









    const getApplicationEvaluationsBySession = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.getApplicationEvaluationsBySession(sessionId);
            if (response.data && response.success) {
                setSessionEvaluations(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Başvuru alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearApplicationData = useCallback(() => {
        setApplications(null);
        setSelectedApplication(null);
        setExamSessionApplications(null);
        setCandidateApplications(null);
        setAwaitingEvaluationApplications(null);
        setApplicationStatistics(null);
        setExamSessionApplicationsSummary(null);
        setError(null);
    }, []);

    return {
        applications,
        selectedApplication,
        examSessionApplications,
        candidateApplications,
        awaitingEvaluationApplications,
        applicationStatistics,
        examSessionApplicationsSummary,
        loading,
        error,
        createApplication,
        updateApplication,
        startApplication,
        completeApplication,
        getApplicationById,
        getApplicationsByExamSession,
        getApplicationsByCandidate,
        getApplicationsAwaitingEvaluation,
        bulkCreateApplications,
        deleteApplication,
        getApplicationStatistics,
        getExamSessionApplicationsSummary,
        searchApplications,
        startApplicationById,
        completeApplicationById,
        quickCreateApplication,
        createApplicationsForCandidates,
        clearApplicationData,
        updateApplicationState,
        getApplicationEvaluationsBySession,
        sessionEvaluations
    };
};