import {useCallback, useState} from "react";
import {ApiResponse} from "@/types/exam/examValidationAndAnalytics";
import {applicationService} from "@/services/api/management/appication-service";
import {CreateApplicationRequest, UpdateApplicationRequest} from "@/types/management/brand";


export const useApplication = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRequest = useCallback(async <T>(
        request: () => Promise<ApiResponse<T>>
    ): Promise<T | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await request();
            if (response.success) {
                return response.data ?? null;
            } else {
                setError(response.message ?? 'An unknown error occurred');
                return null;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const createApplication = useCallback(async (data: CreateApplicationRequest) => {
        return handleRequest(() => applicationService.createApplication(data));
    }, [handleRequest]);

    const updateApplication = useCallback(async (id: string, data: UpdateApplicationRequest) => {
        return handleRequest(() => applicationService.updateApplication(id, data));
    }, [handleRequest]);

    const getApplication = useCallback(async (id: string) => {
        return handleRequest(() => applicationService.getApplicationById(id));
    }, [handleRequest]);

    const startApplication = useCallback(async (applicationId: string) => {
        return handleRequest(() => applicationService.startApplicationById(applicationId));
    }, [handleRequest]);

    const completeApplication = useCallback(async (applicationId: string) => {
        return handleRequest(() => applicationService.completeApplicationById(applicationId));
    }, [handleRequest]);

    const getApplicationsByExamSession = useCallback(async (examSessionId: string) => {
        return handleRequest(() => applicationService.getApplicationsByExamSession(examSessionId));
    }, [handleRequest]);

    const getApplicationsByCandidate = useCallback(async (candidateId: string) => {
        return handleRequest(() => applicationService.getApplicationsByCandidate(candidateId));
    }, [handleRequest]);

    const deleteApplication = useCallback(async (id: string) => {
        return handleRequest(() => applicationService.deleteApplication(id));
    }, [handleRequest]);

    return {
        loading,
        error,
        createApplication,
        updateApplication,
        getApplication,
        startApplication,
        completeApplication,
        getApplicationsByExamSession,
        getApplicationsByCandidate,
        deleteApplication
    };
};