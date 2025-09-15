import { useState, useCallback } from 'react';
import {
    CreateCandidateRequest,
    UpdateCandidateRequest,
    ChangePasswordRequest,
    CandidateSearchParams
} from '@/types/management/brand';
import { ApiResponse } from '@/types/exam/examValidationAndAnalytics';
import {candidateService} from "@/services/api/management/candidate-service";

export const useCandidate = () => {
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

        const createCandidate = useCallback(async (data: CreateCandidateRequest) => {
            return handleRequest(() => candidateService.createCandidate(data));
        }, [handleRequest]);

        const updateCandidate = useCallback(async (id: string, data: UpdateCandidateRequest) => {
            return handleRequest(() => candidateService.updateCandidate(id, data));
        }, [handleRequest]);

        const getCandidate = useCallback(async (id: string) => {
            return handleRequest(() => candidateService.getCandidateById(id));
        }, [handleRequest]);

        const getCandidateByUsername = useCallback(async (username: string) => {
            return handleRequest(() => candidateService.getCandidateByUsername(username));
        }, [handleRequest]);

        const getCandidateByIdentity = useCallback(async (identityNumber: string) => {
            return handleRequest(() => candidateService.getCandidateByIdentityNumber(identityNumber));
        }, [handleRequest]);

        const getAllCandidates = useCallback(async () => {
            return handleRequest(() => candidateService.getAllCandidates());
        }, [handleRequest]);

        const searchCandidates = useCallback(async (params: CandidateSearchParams) => {
            return handleRequest(() => candidateService.searchCandidates(params));
        }, [handleRequest]);

        const changePassword = useCallback(async (id: string, passwordData: ChangePasswordRequest) => {
            return handleRequest(() => candidateService.changePassword(id, passwordData));
        }, [handleRequest]);

        const deleteCandidate = useCallback(async (id: string) => {
            return handleRequest(() => candidateService.deleteCandidate(id));
        }, [handleRequest]);

        return {
            loading,
            error,
            createCandidate,
            updateCandidate,
            getCandidate,
            getCandidateByUsername,
            getCandidateByIdentity,
            getAllCandidates,
            searchCandidates,
            changePassword,
            deleteCandidate
        };
    };