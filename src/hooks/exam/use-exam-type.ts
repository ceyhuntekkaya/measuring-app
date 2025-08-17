import { useState, useCallback } from 'react';

import {
    UpdateExamTypeRequest,
    ExamTypeListResponse,
    ExamTypeValidationResult,
    ExamTypeStatistics,
    ExamTypeSummary,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import {ExamTypeDto} from "@/types/exam/examTemplates";
import {CreateExamTypeRequest, ExamTypeSearchRequest} from "@/types/exam/examEntities";
import { examTypeService } from "@/services/api/exam/exam-type-service";

interface UseExamTypeReturn {
    examTypes: ExamTypeListResponse | null;
    selectedExamType: ExamTypeDto | null;
    finalizedExamTypes: ExamTypeListResponse | null;
    draftExamTypes: ExamTypeListResponse | null;
    examTypeValidation: ExamTypeValidationResult | null;
    examTypeStatistics: ExamTypeStatistics | null;
    examTypesSummary: ExamTypeSummary | null;
    loading: boolean;
    error: Error | null;
    createExamType: (createRequest: CreateExamTypeRequest) => Promise<void>;
    updateExamType: (id: string, updateRequest: UpdateExamTypeRequest) => Promise<void>;
    getExamTypeById: (id: string) => Promise<void>;
    getAllExamTypes: (searchRequest?: ExamTypeSearchRequest) => Promise<void>;
    deleteExamType: (id: string) => Promise<void>;
    finalizeExamType: (id: string) => Promise<void>;
    unfinalizeExamType: (id: string) => Promise<void>;
    copyExamType: (id: string, newName: string) => Promise<void>;
    validateExamTypeForFinalization: (id: string) => Promise<void>;
    getExamTypeStatistics: (id: string) => Promise<void>;
    getFinalizedExamTypes: (page?: number, size?: number, sortBy?: string, sortDirection?: string) => Promise<void>;
    getDraftExamTypes: (page?: number, size?: number, sortBy?: string, sortDirection?: string) => Promise<void>;
    getExamTypesSummary: () => Promise<void>;
    clearExamTypeData: () => void;
}

export const useExamType = (): UseExamTypeReturn => {
    const [examTypes, setExamTypes] = useState<ExamTypeListResponse | null>(null);
    const [selectedExamType, setSelectedExamType] = useState<ExamTypeDto | null>(null);
    const [finalizedExamTypes, setFinalizedExamTypes] = useState<ExamTypeListResponse | null>(null);
    const [draftExamTypes, setDraftExamTypes] = useState<ExamTypeListResponse | null>(null);
    const [examTypeValidation, setExamTypeValidation] = useState<ExamTypeValidationResult | null>(null);
    const [examTypeStatistics, setExamTypeStatistics] = useState<ExamTypeStatistics | null>(null);
    const [examTypesSummary, setExamTypesSummary] = useState<ExamTypeSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createExamType = useCallback(async (createRequest: CreateExamTypeRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.createExamType(createRequest);
            if (response.data && response.success) {
                setSelectedExamType(response.data);
                showNotification.success('Sınav tipi başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav tipi oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExamType = useCallback(async (id: string, updateRequest: UpdateExamTypeRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.updateExamType(id, updateRequest);
            if (response.data && response.success) {
                setSelectedExamType(response.data);
                showNotification.success('Sınav tipi başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav tipi güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamTypeById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.getExamTypeById(id);
            if (response.data && response.success) {
                setSelectedExamType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav tipi alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllExamTypes = useCallback(async (searchRequest: ExamTypeSearchRequest = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.getAllExamTypes(searchRequest);
            if (response.data && response.success) {
                setExamTypes(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav tipleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteExamType = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.deleteExamType(id);
            if (response.data && response.success) {
                showNotification.success('Sınav tipi başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav tipi silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const finalizeExamType = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.finalizeExamType(id);
            if (response.data && response.success) {
                setSelectedExamType(response.data);
                showNotification.success('Sınav tipi başarıyla sonlandırıldı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav tipi sonlandırılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const unfinalizeExamType = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.unfinalizeExamType(id);
            if (response.data && response.success) {
                setSelectedExamType(response.data);
                showNotification.success('Sınav tipi sonlandırılması geri alındı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav tipi sonlandırılması geri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyExamType = useCallback(async (id: string, newName: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.copyExamType(id, newName);
            if (response.data && response.success) {
                setSelectedExamType(response.data);
                showNotification.success('Sınav tipi başarıyla kopyalandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav tipi kopyalanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateExamTypeForFinalization = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.validateExamTypeForFinalization(id);
            if (response.data && response.success) {
                setExamTypeValidation(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav tipi doğrulanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamTypeStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.getExamTypeStatistics(id);
            if (response.data && response.success) {
                setExamTypeStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav tipi istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getFinalizedExamTypes = useCallback(async (page: number = 0, size: number = 20, sortBy: string = 'name', sortDirection: string = 'ASC') => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.getFinalizedExamTypes(page, size, sortBy, sortDirection);
            if (response.data && response.success) {
                setFinalizedExamTypes(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sonlandırılmış sınav tipleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getDraftExamTypes = useCallback(async (page: number = 0, size: number = 20, sortBy: string = 'name', sortDirection: string = 'ASC') => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.getDraftExamTypes(page, size, sortBy, sortDirection);
            if (response.data && response.success) {
                setDraftExamTypes(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Taslak sınav tipleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamTypesSummary = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.getExamTypesSummary();
            if (response.data && response.success) {
                setExamTypesSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sınav tipleri özeti alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearExamTypeData = useCallback(() => {
        setExamTypes(null);
        setSelectedExamType(null);
        setFinalizedExamTypes(null);
        setDraftExamTypes(null);
        setExamTypeValidation(null);
        setExamTypeStatistics(null);
        setExamTypesSummary(null);
        setError(null);
    }, []);

    return {
        examTypes,
        selectedExamType,
        finalizedExamTypes,
        draftExamTypes,
        examTypeValidation,
        examTypeStatistics,
        examTypesSummary,
        loading,
        error,
        createExamType,
        updateExamType,
        getExamTypeById,
        getAllExamTypes,
        deleteExamType,
        finalizeExamType,
        unfinalizeExamType,
        copyExamType,
        validateExamTypeForFinalization,
        getExamTypeStatistics,
        getFinalizedExamTypes,
        getDraftExamTypes,
        getExamTypesSummary,
        clearExamTypeData
    };
};