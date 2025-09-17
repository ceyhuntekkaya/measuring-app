import { useState, useCallback } from 'react';

import {
    ExamDto,
    ExamFormData,
    ExamStatistics,
    ExamSummary,
    ExamSearchRequest,
    ExamDashboardData,
    ExamValidationResult,
    CopyExamRequest,
    MoveExamRequest
} from '@/types/exam/examEntities';
import { showNotification } from '@/lib/notification';
import {examService} from "@/services/api/exam/exam-service";

interface UseExamReturn {
    exams: ExamDto[] | null;
    selectedExam: ExamDto | null;
    examStatistics: ExamStatistics | null;
    examSummary: ExamSummary | null;
    examDashboard: ExamDashboardData | null;
    validationResult: ExamValidationResult | null;
    loading: boolean;
    error: Error | null;
    createExam: (createRequest: ExamFormData) => Promise<void>;
    updateExam: (updateRequest: ExamFormData) => Promise<void>;
    getExamById: (id: string) => Promise<void>;
    getExamByCode: (code: string) => Promise<void>;
    getAllExams: () => Promise<void>;
    searchExams: (searchRequest: ExamSearchRequest) => Promise<void>;
    searchExamsByName: (name: string) => Promise<void>;
    getExamsByBrand: (brandId: string) => Promise<void>;
    getExamsByBranch: (branchId: string) => Promise<void>;
    getExamsByExamType: (examTypeId: string) => Promise<void>;
    deleteExam: (id: string) => Promise<void>;
    bulkCreateExams: (createRequests: ExamFormData[]) => Promise<void>;
    copyExam: (examId: string, copyRequest: CopyExamRequest) => Promise<void>;
    moveExam: (examId: string, moveRequest: MoveExamRequest) => Promise<void>;
    duplicateExam: (examId: string, newName: string, newCode: string) => Promise<void>;
    getExamStatistics: (id: string) => Promise<void>;
    getExamSummary: (id: string) => Promise<void>;
    getExamDashboard: () => Promise<void>;
    validateExam: (examData: ExamFormData) => Promise<void>;
    checkCodeAvailability: (code: string, excludeId?: string) => Promise<boolean>;
    checkNameAvailability: (name: string, excludeId?: string) => Promise<boolean>;
    activateExam: (id: string) => Promise<void>;
    deactivateExam: (id: string) => Promise<void>;
    archiveExam: (id: string) => Promise<void>;
    restoreExam: (id: string) => Promise<void>;
    clearExamData: () => void;
}

export const useExam = (): UseExamReturn => {
    const [exams, setExams] = useState<ExamDto[] | null>(null);
    const [selectedExam, setSelectedExam] = useState<ExamDto | null>(null);
    const [examStatistics, setExamStatistics] = useState<ExamStatistics | null>(null);
    const [examSummary, setExamSummary] = useState<ExamSummary | null>(null);
    const [examDashboard, setExamDashboard] = useState<ExamDashboardData | null>(null);
    const [validationResult, setValidationResult] = useState<ExamValidationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createExam = useCallback(async (createRequest: ExamFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.createExam(createRequest);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('Sınav başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExam = useCallback(async (updateRequest: ExamFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.updateExam(updateRequest.id!, updateRequest);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('Sınav başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamById(id);
            if (response.data && response.success) {
                setSelectedExam(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamByCode = useCallback(async (code: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamByCode(code);
            if (response.data && response.success) {
                setSelectedExam(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav kod ile alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllExams = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getAllExams();
            if (response.data && response.success) {
                setExams(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınavlar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchExams = useCallback(async (searchRequest: ExamSearchRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.searchExams(searchRequest);
            if (response.data && response.success) {
                setExams(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav arama yapılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchExamsByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.searchExamsByName(name);
            if (response.data && response.success) {
                setExams(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav isim arama yapılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamsByBrand = useCallback(async (brandId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamsByBrand(brandId);
            if (response.data && response.success) {
                setExams(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Marka sınavları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamsByBranch = useCallback(async (branchId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamsByBranch(branchId);
            if (response.data && response.success) {
                setExams(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Şube sınavları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamsByExamType = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamsByExamType(examTypeId);
            if (response.data && response.success) {
                setExams(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav tipi sınavları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteExam = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.deleteExam(id);
            if (response.success) {
                showNotification.success('Sınav başarıyla silindi!');
                // Remove from local state if exists
                if (exams) {
                    setExams(exams.filter(exam => exam.id !== id));
                }
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, [exams]);

    const bulkCreateExams = useCallback(async (createRequests: ExamFormData[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.bulkCreateExams(createRequests);
            if (response.data && response.success) {
                setExams(response.data);
                showNotification.success('Sınavlar başarıyla toplu oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınavlar toplu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyExam = useCallback(async (examId: string, copyRequest: CopyExamRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.copyExam(examId, copyRequest);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('Sınav başarıyla kopyalandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav kopyalanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const moveExam = useCallback(async (examId: string, moveRequest: MoveExamRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.moveExam(examId, moveRequest);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('Sınav başarıyla taşındı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav taşınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const duplicateExam = useCallback(async (examId: string, newName: string, newCode: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.duplicateExam(examId, newName, newCode);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('Sınav başarıyla çoğaltıldı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav çoğaltılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamStatistics(id);
            if (response.data && response.success) {
                setExamStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSummary = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamSummary(id);
            if (response.data && response.success) {
                setExamSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav özeti alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamDashboard();
            if (response.data && response.success) {
                setExamDashboard(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav dashboard alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateExam = useCallback(async (examData: ExamFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.validateExam(examData);
            if (response.data && response.success) {
                setValidationResult(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav doğrulanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const checkCodeAvailability = useCallback(async (code: string, excludeId?: string): Promise<boolean> => {
        try {
            const response = await examService.checkExamCodeAvailability(code, excludeId);
            return response.data || false;
        } catch (err) {
            console.log(err);
            showNotification.error('Kod kontrolü yapılırken bir hata oluştu!');
            return false;
        }
    }, []);

    const checkNameAvailability = useCallback(async (name: string, excludeId?: string): Promise<boolean> => {
        try {
            const response = await examService.checkExamNameAvailability(name, excludeId);
            return response.data || false;
        } catch (err) {
            console.log(err);
            showNotification.error('İsim kontrolü yapılırken bir hata oluştu!');
            return false;
        }
    }, []);

    const activateExam = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.activateExam(id);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('Sınav başarıyla aktif edildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav aktif edilirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deactivateExam = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.deactivateExam(id);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('Sınav başarıyla pasif edildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav pasif edilirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const archiveExam = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.archiveExam(id);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('Sınav başarıyla arşivlendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav arşivlenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const restoreExam = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.restoreExam(id);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('Sınav başarıyla geri yüklendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav geri yüklenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearExamData = useCallback(() => {
        setExams(null);
        setSelectedExam(null);
        setExamStatistics(null);
        setExamSummary(null);
        setExamDashboard(null);
        setValidationResult(null);
        setError(null);
    }, []);

    return {
        exams,
        selectedExam,
        examStatistics,
        examSummary,
        examDashboard,
        validationResult,
        loading,
        error,
        createExam,
        updateExam,
        getExamById,
        getExamByCode,
        getAllExams,
        searchExams,
        searchExamsByName,
        getExamsByBrand,
        getExamsByBranch,
        getExamsByExamType,
        deleteExam,
        bulkCreateExams,
        copyExam,
        moveExam,
        duplicateExam,
        getExamStatistics,
        getExamSummary,
        getExamDashboard,
        validateExam,
        checkCodeAvailability,
        checkNameAvailability,
        activateExam,
        deactivateExam,
        archiveExam,
        restoreExam,
        clearExamData
    };
};