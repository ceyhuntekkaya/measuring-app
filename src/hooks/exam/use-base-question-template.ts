import { useState, useCallback } from 'react';

import {
    TemplateUsageInfo,
    baseQuestionTemplateService
} from '@/services/api/exam/base-question-template-service';
import { showNotification } from '@/lib/notification';
import {
    QuestionTemplateListResponse,
    QuestionTemplateResponse, QuestionTemplateSearchRequest
} from "@/types/exam/examResponses";
import {TemplateUsageStatistics, TemplateValidationResult} from "@/types/exam/examValidationAndAnalytics";
import {CreateQuestionTemplateRequest, UpdateQuestionTemplateRequest} from "@/types/exam/examRequests";
import {EQuestionType} from "@/types/exam/enum";

interface UseBaseQuestionTemplateReturn {
    templates: QuestionTemplateListResponse | null;
    selectedTemplate: QuestionTemplateResponse | null;
    templatesByType: QuestionTemplateResponse[];
    activeTemplates: QuestionTemplateResponse[];
    templateValidation: TemplateValidationResult | null;
    templateStatistics: TemplateUsageStatistics[];
    templateUsage: TemplateUsageInfo | null;
    loading: boolean;
    error: Error | null;
    createTemplate: (createRequest: CreateQuestionTemplateRequest) => Promise<void>;
    updateTemplate: (updateRequest: UpdateQuestionTemplateRequest) => Promise<void>;
    getTemplateById: (id: string) => Promise<void>;
    getTemplatesByType: (questionType: EQuestionType) => Promise<void>;
    getActiveTemplates: () => Promise<void>;
    searchTemplates: (searchRequest: QuestionTemplateSearchRequest) => Promise<void>;
    deleteTemplate: (id: string) => Promise<void>;
    validateTemplate: (validateRequest: CreateQuestionTemplateRequest) => Promise<void>;
    toggleTemplateStatus: (id: string, isActive: boolean) => Promise<void>;
    getTemplateStatistics: () => Promise<void>;
    getTemplateUsage: (id: string) => Promise<void>;
    duplicateTemplate: (id: string, newTitle: string) => Promise<void>;
    clearTemplateData: () => void;
}

export const useBaseQuestionTemplate = (): UseBaseQuestionTemplateReturn => {
    const [templates, setTemplates] = useState<QuestionTemplateListResponse | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<QuestionTemplateResponse | null>(null);
    const [templatesByType, setTemplatesByType] = useState<QuestionTemplateResponse[]>([]);
    const [activeTemplates, setActiveTemplates] = useState<QuestionTemplateResponse[]>([]);
    const [templateValidation, setTemplateValidation] = useState<TemplateValidationResult | null>(null);
    const [templateStatistics, setTemplateStatistics] = useState<TemplateUsageStatistics[]>([]);
    const [templateUsage, setTemplateUsage] = useState<TemplateUsageInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createTemplate = useCallback(async (createRequest: CreateQuestionTemplateRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.createTemplate(createRequest);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                showNotification.success('Soru şablonu başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru şablonu oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTemplate = useCallback(async (updateRequest: UpdateQuestionTemplateRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.updateTemplate(updateRequest);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                showNotification.success('Soru şablonu başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru şablonu güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.getTemplateById(id);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru şablonu alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplatesByType = useCallback(async (questionType: EQuestionType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.getTemplatesByType(questionType);
            if (response.data && response.success) {
                setTemplatesByType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Tip şablonları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getActiveTemplates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.getActiveTemplates();
            if (response.data && response.success) {
                setActiveTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aktif şablonlar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchTemplates = useCallback(async (searchRequest: QuestionTemplateSearchRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.searchTemplates(searchRequest);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon aranırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteTemplate = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.deleteTemplate(id);
            if (response.data && response.success) {
                showNotification.success('Soru şablonu başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru şablonu silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateTemplate = useCallback(async (validateRequest: CreateQuestionTemplateRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.validateTemplate(validateRequest);
            if (response.data && response.success) {
                setTemplateValidation(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon doğrulanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleTemplateStatus = useCallback(async (id: string, isActive: boolean) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.toggleTemplateStatus(id, isActive);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                showNotification.success(`Şablon durumu başarıyla ${isActive ? 'aktif' : 'pasif'} yapıldı!`);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon durumu değiştirilirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.getTemplateStatistics();
            if (response.data && response.success) {
                setTemplateStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateUsage = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.getTemplateUsage(id);
            if (response.data && response.success) {
                setTemplateUsage(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon kullanımı alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const duplicateTemplate = useCallback(async (id: string, newTitle: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.duplicateTemplate(id, newTitle);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                showNotification.success('Şablon başarıyla çoğaltıldı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon çoğaltılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearTemplateData = useCallback(() => {
        setTemplates(null);
        setSelectedTemplate(null);
        setTemplatesByType([]);
        setActiveTemplates([]);
        setTemplateValidation(null);
        setTemplateStatistics([]);
        setTemplateUsage(null);
        setError(null);
    }, []);

    return {
        templates,
        selectedTemplate,
        templatesByType,
        activeTemplates,
        templateValidation,
        templateStatistics,
        templateUsage,
        loading,
        error,
        createTemplate,
        updateTemplate,
        getTemplateById,
        getTemplatesByType,
        getActiveTemplates,
        searchTemplates,
        deleteTemplate,
        validateTemplate,
        toggleTemplateStatus,
        getTemplateStatistics,
        getTemplateUsage,
        duplicateTemplate,
        clearTemplateData
    };
};