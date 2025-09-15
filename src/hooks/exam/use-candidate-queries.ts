/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCandidateRequest, UpdateCandidateRequest, ChangePasswordRequest, CandidateSearchParams } from '@/types/management/brand';
import {candidateService} from "@/services/api/management/candidate-service";

export const CANDIDATE_QUERY_KEYS = {
    all: ['candidates'] as const,
    lists: () => [...CANDIDATE_QUERY_KEYS.all, 'list'] as const,
    list: (filters: string) => [...CANDIDATE_QUERY_KEYS.lists(), { filters }] as const,
    details: () => [...CANDIDATE_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...CANDIDATE_QUERY_KEYS.details(), id] as const,
    byUsername: (username: string) => [...CANDIDATE_QUERY_KEYS.all, 'byUsername', username] as const,
    byIdentity: (identityNumber: string) => [...CANDIDATE_QUERY_KEYS.all, 'byIdentity', identityNumber] as const,
    byCity: (city: string) => [...CANDIDATE_QUERY_KEYS.all, 'byCity', city] as const,
    byCountry: (country: string) => [...CANDIDATE_QUERY_KEYS.all, 'byCountry', country] as const,
    search: (params: CandidateSearchParams) => [...CANDIDATE_QUERY_KEYS.all, 'search', params] as const,
    statistics: () => [...CANDIDATE_QUERY_KEYS.all, 'statistics'] as const,
};

export const useCandidates = () => {
    return useQuery({
        queryKey: CANDIDATE_QUERY_KEYS.lists(),
        queryFn: async () => {
            const response = await candidateService.getAllCandidates();
            if (!response.success) throw new Error(response.message);
            return response.data;
        },
    });
};

export const useCandidate = (id: string) => {
    return useQuery({
        queryKey: CANDIDATE_QUERY_KEYS.detail(id),
        queryFn: async () => {
            const response = await candidateService.getCandidateById(id);
            if (!response.success) throw new Error(response.message);
            return response.data;
        },
        enabled: !!id,
    });
};

export const useCandidateByUsername = (username: string) => {
    return useQuery({
        queryKey: CANDIDATE_QUERY_KEYS.byUsername(username),
        queryFn: async () => {
            const response = await candidateService.getCandidateByUsername(username);
            if (!response.success) throw new Error(response.message);
            return response.data;
        },
        enabled: !!username,
    });
};

export const useCandidateByIdentity = (identityNumber: string) => {
    return useQuery({
        queryKey: CANDIDATE_QUERY_KEYS.byIdentity(identityNumber),
        queryFn: async () => {
            const response = await candidateService.getCandidateByIdentityNumber(identityNumber);
            if (!response.success) throw new Error(response.message);
            return response.data;
        },
        enabled: !!identityNumber,
    });
};

export const useCandidatesSearch = (searchParams: CandidateSearchParams) => {
    return useQuery({
        queryKey: CANDIDATE_QUERY_KEYS.search(searchParams),
        queryFn: async () => {
            const response = await candidateService.searchCandidates(searchParams);
            if (!response.success) throw new Error(response.message);
            return response.data;
        },
        enabled: Object.keys(searchParams).length > 0,
    });
};

export const useCandidatesByCity = (city: string) => {
    return useQuery({
        queryKey: CANDIDATE_QUERY_KEYS.byCity(city),
        queryFn: async () => {
            const response = await candidateService.getCandidatesByCity(city);
            if (!response.success) throw new Error(response.message);
            return response.data;
        },
        enabled: !!city,
    });
};

export const useCandidatesByCountry = (country: string) => {
    return useQuery({
        queryKey: CANDIDATE_QUERY_KEYS.byCountry(country),
        queryFn: async () => {
            const response = await candidateService.getCandidatesByCountry(country);
            if (!response.success) throw new Error(response.message);
            return response.data;
        },
        enabled: !!country,
    });
};

export const useCandidateStatistics = () => {
    return useQuery({
        queryKey: CANDIDATE_QUERY_KEYS.statistics(),
        queryFn: async () => {
            const response = await candidateService.getCandidateStatistics();
            if (!response.success) throw new Error(response.message);
            return response.data;
        },
    });
};

export const useCreateCandidate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCandidateRequest) => candidateService.createCandidate(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.statistics() });
        },
    });
};

export const useUpdateCandidate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCandidateRequest }) =>
            candidateService.updateCandidate(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.lists() });
        },
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ChangePasswordRequest }) =>
            candidateService.changePassword(id, data),
    });
};

export const useDeleteCandidate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => candidateService.deleteCandidate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.statistics() });
        },
    });
};

export const useBulkCreateCandidates = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCandidateRequest[]) => candidateService.bulkCreateCandidates(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.statistics() });
        },
    });
};

 */