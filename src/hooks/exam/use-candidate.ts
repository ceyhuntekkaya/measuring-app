import { useState, useCallback } from 'react';

import {
    CandidateDto,
    CandidateFormData,
    ChangePasswordRequest,
    CandidateStatistics,
    CandidateSearchParams
} from '@/types/management/brand';
import { showNotification } from '@/lib/notification';
import {candidateService} from "@/services/api/management/candidate-service";

interface UseCandidateReturn {
    candidates: CandidateDto[] | null;
    selectedCandidate: CandidateDto | null;
    candidatesByCity: CandidateDto[] | null;
    candidatesByCountry: CandidateDto[] | null;
    candidateStatistics: CandidateStatistics | null;
    candidatesForSelection: Array<{id: string; name: string; value: string; identityNumber: string; email?: string;}> | null;
    loading: boolean;
    error: Error | null;
    createCandidate: (createRequest: CandidateFormData) => Promise<void>;
    updateCandidate: (updateRequest: CandidateFormData) => Promise<void>;
    getCandidateById: (id: string) => Promise<void>;
    getCandidateByUsername: (username: string) => Promise<void>;
    getCandidateByIdentityNumber: (identityNumber: string) => Promise<void>;
    getAllCandidates: () => Promise<void>;
    searchCandidates: (searchParams?: CandidateSearchParams) => Promise<void>;
    searchCandidatesByName: (name: string) => Promise<void>;
    getCandidatesByCity: (city: string) => Promise<void>;
    getCandidatesByCountry: (country: string) => Promise<void>;
    changePassword: (id: string, passwordRequest: ChangePasswordRequest) => Promise<void>;
    deleteCandidate: (id: string) => Promise<void>;
    bulkCreateCandidates: (createRequests: CandidateFormData[]) => Promise<void>;
    getCandidateStatistics: () => Promise<void>;
    validateUsername: (username: string) => Promise<boolean>;
    validateIdentityNumber: (identityNumber: string) => Promise<boolean>;
    quickCreateCandidate: (name: string, lastName: string, identityNumber: string, username: string, password: string, mobilePhone: string, email: string) => Promise<void>;
    advancedSearch: (filters: {name?: string; city?: string; country?: string; email?: string; identityNumber?: string; mobilePhone?: string;}) => Promise<void>;
    getCandidatesForSelection: () => Promise<void>;
    createCandidatesFromList: (candidateData: Array<CandidateFormData>) => Promise<void>;
    clearCandidateData: () => void;
}

export const useCandidate = (): UseCandidateReturn => {
    const [candidates, setCandidates] = useState<CandidateDto[] | null>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<CandidateDto | null>(null);
    const [candidatesByCity, setCandidatesByCity] = useState<CandidateDto[] | null>(null);
    const [candidatesByCountry, setCandidatesByCountry] = useState<CandidateDto[] | null>(null);
    const [candidateStatistics, setCandidateStatistics] = useState<CandidateStatistics | null>(null);
    const [candidatesForSelection, setCandidatesForSelection] = useState<Array<{id: string; name: string; value: string; identityNumber: string; email?: string;}> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createCandidate = useCallback(async (createRequest: CandidateFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.createCandidate(createRequest);
            if (response.data && response.success) {
                setSelectedCandidate(response.data);
                showNotification.success('Aday başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCandidate = useCallback(async (updateRequest: CandidateFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.updateCandidate(updateRequest.id, updateRequest);
            if (response.data && response.success) {
                setSelectedCandidate(response.data);
                showNotification.success('Aday başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCandidateById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.getCandidateById(id);
            if (response.data && response.success) {
                setSelectedCandidate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCandidateByUsername = useCallback(async (username: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.getCandidateByUsername(username);
            if (response.data && response.success) {
                setSelectedCandidate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday kullanıcı adı ile alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCandidateByIdentityNumber = useCallback(async (identityNumber: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.getCandidateByIdentityNumber(identityNumber);
            if (response.data && response.success) {
                setSelectedCandidate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday kimlik numarası ile alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllCandidates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.getAllCandidates();
            if (response.data && response.success) {
                setCandidates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Adaylar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchCandidates = useCallback(async (searchParams: CandidateSearchParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.searchCandidates(searchParams);
            if (response.data && response.success) {
                setCandidates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday arama yapılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchCandidatesByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.searchCandidatesByName(name);
            if (response.data && response.success) {
                setCandidates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday isim ile arama yapılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCandidatesByCity = useCallback(async (city: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.getCandidatesByCity(city);
            if (response.data && response.success) {
                setCandidatesByCity(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şehir adayları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCandidatesByCountry = useCallback(async (country: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.getCandidatesByCountry(country);
            if (response.data && response.success) {
                setCandidatesByCountry(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Ülke adayları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const changePassword = useCallback(async (id: string, passwordRequest: ChangePasswordRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.changePassword(id, passwordRequest);
            if (response.success) {
                showNotification.success('Şifre başarıyla değiştirildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şifre değiştirilirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCandidate = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.deleteCandidate(id);
            if (response.success) {
                showNotification.success('Aday başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateCandidates = useCallback(async (createRequests: CandidateFormData[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.bulkCreateCandidates(createRequests);
            if (response.data && response.success) {
                setCandidates(response.data);
                showNotification.success('Adaylar başarıyla toplu oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Adaylar toplu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCandidateStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.getCandidateStatistics();
            if (response.data && response.success) {
                setCandidateStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateUsername = useCallback(async (username: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await candidateService.validateUsername(username);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kullanıcı adı doğrulanırken bir hata oluştu!');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const validateIdentityNumber = useCallback(async (identityNumber: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await candidateService.validateIdentityNumber(identityNumber);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kimlik numarası doğrulanırken bir hata oluştu!');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const quickCreateCandidate = useCallback(async (
        name: string,
        lastName: string,
        identityNumber: string,
        username: string,
        password: string,
        mobilePhone: string,
        email: string
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.quickCreateCandidate(
                name, lastName, identityNumber, username, password, mobilePhone, email
            );
            if (response.data && response.success) {
                setSelectedCandidate(response.data);
                showNotification.success('Hızlı aday başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Hızlı aday oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const advancedSearch = useCallback(async (filters: {
        name?: string;
        city?: string;
        country?: string;
        email?: string;
        identityNumber?: string;
        mobilePhone?: string;
    }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.advancedSearch(filters);
            if (response.data && response.success) {
                setCandidates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Gelişmiş arama yapılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCandidatesForSelection = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await candidateService.getCandidatesForSelection();
            setCandidatesForSelection(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Seçim için adaylar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createCandidatesFromList = useCallback(async (candidateData: CandidateFormData[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.createCandidatesFromList(candidateData);
            if (response.data && response.success) {
                setCandidates(response.data);
                showNotification.success('Adaylar listeden başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Adaylar listeden oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearCandidateData = useCallback(() => {
        setCandidates(null);
        setSelectedCandidate(null);
        setCandidatesByCity(null);
        setCandidatesByCountry(null);
        setCandidateStatistics(null);
        setCandidatesForSelection(null);
        setError(null);
    }, []);

    return {
        candidates,
        selectedCandidate,
        candidatesByCity,
        candidatesByCountry,
        candidateStatistics,
        candidatesForSelection,
        loading,
        error,
        createCandidate,
        updateCandidate,
        getCandidateById,
        getCandidateByUsername,
        getCandidateByIdentityNumber,
        getAllCandidates,
        searchCandidates,
        searchCandidatesByName,
        getCandidatesByCity,
        getCandidatesByCountry,
        changePassword,
        deleteCandidate,
        bulkCreateCandidates,
        getCandidateStatistics,
        validateUsername,
        validateIdentityNumber,
        quickCreateCandidate,
        advancedSearch,
        getCandidatesForSelection,
        createCandidatesFromList,
        clearCandidateData
    };
};