import {useCallback, useState} from "react";
import {ApiResponse} from "@/types/exam/examValidationAndAnalytics";
import {CreateApplicationGraderRequest} from "@/types/management/brand";
import {applicationGraderService} from "@/services/api/management/application-grader-service";


export const useApplicationGrader = () => {
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

    const assignGrader = useCallback(async (data: CreateApplicationGraderRequest) => {
        return handleRequest(() => applicationGraderService.assignGraderToApplication(data));
    }, [handleRequest]);

    const completeGrading = useCallback(async (id: string) => {
        return handleRequest(() => applicationGraderService.completeGrading(id));
    }, [handleRequest]);

    const getGradersByApplication = useCallback(async (applicationId: string) => {
        return handleRequest(() => applicationGraderService.getGradersByApplication(applicationId));
    }, [handleRequest]);

    const getApplicationsByGrader = useCallback(async (userId: string) => {
        return handleRequest(() => applicationGraderService.getApplicationsByGrader(userId));
    }, [handleRequest]);

    const getRefereeGraders = useCallback(async (applicationId: string) => {
        return handleRequest(() => applicationGraderService.getRefereeGradersByApplication(applicationId));
    }, [handleRequest]);

    const removeGrader = useCallback(async (id: string) => {
        return handleRequest(() => applicationGraderService.removeGraderFromApplication(id));
    }, [handleRequest]);

    const getGraderWorkload = useCallback(async (userId: string) => {
        return handleRequest(() => applicationGraderService.getGraderWorkload(userId));
    }, [handleRequest]);

    const getApplicationGradingSummary = useCallback(async (applicationId: string) => {
        return handleRequest(() => applicationGraderService.getApplicationGradingSummary(applicationId));
    }, [handleRequest]);

    return {
        loading,
        error,
        assignGrader,
        completeGrading,
        getGradersByApplication,
        getApplicationsByGrader,
        getRefereeGraders,
        removeGrader,
        getGraderWorkload,
        getApplicationGradingSummary
    };
};