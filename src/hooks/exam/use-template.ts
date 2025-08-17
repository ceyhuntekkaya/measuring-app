import { useState, useCallback } from 'react';
import {
    BaseQuestionTemplateDto,
    MultipleChoiceTemplateDto,
    TrueFalseTemplateDto,
    FillInTheBlanksTemplateDto,
    ShortAnswerTemplateDto,
    MatchingTemplateDto,
    EssayTemplateDto,
    OrderingTemplateDto,
    MultipleResponseTemplateDto,
    HotSpotTemplateDto,
    DragAndDropTemplateDto,
    AudioResponseTemplateDto,
    VideoResponseTemplateDto,
    ImageResponseTemplateDto,
    TemplateFilterDto,
    TemplateTypeStatistics,
    TemplateUsageStatsDto,
    TemplateValidationResult
} from '@/types/exam/questionTemplates';
import {EQuestionType} from "@/types/exam/enum";
import {
    templateService
} from '@/services/api/exam/template-service';
import { showNotification } from '@/lib/notification';

interface UseExamTemplateReturn {
    templates: BaseQuestionTemplateDto[];
    selectedTemplate: BaseQuestionTemplateDto | null;
    templateMap: Record<string, BaseQuestionTemplateDto>;
    templateTypeStatistics: TemplateTypeStatistics | null;
    templateUsageStats: TemplateUsageStatsDto | null;
    validationResult: TemplateValidationResult | null;
    validationErrors: string[];
    examsUsingTemplate: string[];
    loading: boolean;
    error: Error | null;
    createTemplate: (template: BaseQuestionTemplateDto) => Promise<void>;
    updateTemplate: (templateId: string, template: BaseQuestionTemplateDto) => Promise<void>;
    getTemplateById: (templateId: string) => Promise<void>;
    getTemplateByIdAndType: (templateId: string, type: EQuestionType) => Promise<void>;
    getAllTemplates: () => Promise<void>;
    getTemplatesByType: (type: EQuestionType) => Promise<void>;
    deleteTemplate: (templateId: string) => Promise<void>;
    activateTemplate: (templateId: string) => Promise<void>;
    deactivateTemplate: (templateId: string) => Promise<void>;
    duplicateTemplate: (templateId: string, newTitle: string) => Promise<void>;
    getTemplateMap: (templateIds: string[]) => Promise<void>;
    validateTemplate: (templateId: string) => Promise<boolean>;
    getTemplateValidationErrors: (templateId: string) => Promise<void>;
    validateTemplateData: (template: BaseQuestionTemplateDto) => Promise<void>;
    isTemplateInUse: (templateId: string) => Promise<boolean>;
    getExamsUsingTemplate: (templateId: string) => Promise<void>;
    searchTemplates: (keyword: string) => Promise<void>;
    filterTemplates: (filter: TemplateFilterDto) => Promise<void>;
    getTemplatesBySubject: (subject: string) => Promise<void>;
    getTemplatesByDifficulty: (difficulty: string) => Promise<void>;
    getTemplatesByCreator: (userId: string) => Promise<void>;
    getTemplateTypeStatistics: () => Promise<void>;
    getMostUsedTemplates: (limit?: number) => Promise<void>;
    getRecentTemplates: (limit?: number) => Promise<void>;
    getTemplateUsageStats: (templateId: string) => Promise<void>;
    clearTemplateData: () => void;
    // Specific template type operations
    createMultipleChoiceTemplate: (dto: MultipleChoiceTemplateDto) => Promise<void>;
    updateMultipleChoiceTemplate: (templateId: string, dto: MultipleChoiceTemplateDto) => Promise<void>;
    createTrueFalseTemplate: (dto: TrueFalseTemplateDto) => Promise<void>;
    updateTrueFalseTemplate: (templateId: string, dto: TrueFalseTemplateDto) => Promise<void>;
    createFillInTheBlanksTemplate: (dto: FillInTheBlanksTemplateDto) => Promise<void>;
    updateFillInTheBlanksTemplate: (templateId: string, dto: FillInTheBlanksTemplateDto) => Promise<void>;
    createShortAnswerTemplate: (dto: ShortAnswerTemplateDto) => Promise<void>;
    updateShortAnswerTemplate: (templateId: string, dto: ShortAnswerTemplateDto) => Promise<void>;
    createMatchingTemplate: (dto: MatchingTemplateDto) => Promise<void>;
    updateMatchingTemplate: (templateId: string, dto: MatchingTemplateDto) => Promise<void>;
    createEssayTemplate: (dto: EssayTemplateDto) => Promise<void>;
    updateEssayTemplate: (templateId: string, dto: EssayTemplateDto) => Promise<void>;
    createOrderingTemplate: (dto: OrderingTemplateDto) => Promise<void>;
    updateOrderingTemplate: (templateId: string, dto: OrderingTemplateDto) => Promise<void>;
    createMultipleResponseTemplate: (dto: MultipleResponseTemplateDto) => Promise<void>;
    updateMultipleResponseTemplate: (templateId: string, dto: MultipleResponseTemplateDto) => Promise<void>;
    createHotSpotTemplate: (dto: HotSpotTemplateDto) => Promise<void>;
    updateHotSpotTemplate: (templateId: string, dto: HotSpotTemplateDto) => Promise<void>;
    createDragAndDropTemplate: (dto: DragAndDropTemplateDto) => Promise<void>;
    updateDragAndDropTemplate: (templateId: string, dto: DragAndDropTemplateDto) => Promise<void>;
    createAudioResponseTemplate: (dto: AudioResponseTemplateDto) => Promise<void>;
    updateAudioResponseTemplate: (templateId: string, dto: AudioResponseTemplateDto) => Promise<void>;
    createVideoResponseTemplate: (dto: VideoResponseTemplateDto) => Promise<void>;
    updateVideoResponseTemplate: (templateId: string, dto: VideoResponseTemplateDto) => Promise<void>;
    createImageResponseTemplate: (dto: ImageResponseTemplateDto) => Promise<void>;
    updateImageResponseTemplate: (templateId: string, dto: ImageResponseTemplateDto) => Promise<void>;
}

export const useExamTemplate = (): UseExamTemplateReturn => {
    const [templates, setTemplates] = useState<BaseQuestionTemplateDto[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<BaseQuestionTemplateDto | null>(null);
    const [templateMap, setTemplateMap] = useState<Record<string, BaseQuestionTemplateDto>>({});
    const [templateTypeStatistics, setTemplateTypeStatistics] = useState<TemplateTypeStatistics | null>(null);
    const [templateUsageStats, setTemplateUsageStats] = useState<TemplateUsageStatsDto | null>(null);
    const [validationResult, setValidationResult] = useState<TemplateValidationResult | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [examsUsingTemplate, setExamsUsingTemplate] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createTemplate = useCallback(async (template: BaseQuestionTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createTemplate(template);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Şablon başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTemplate = useCallback(async (templateId: string, template: BaseQuestionTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateTemplate(templateId, template);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Şablon başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateById = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplateById(templateId);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateByIdAndType = useCallback(async (templateId: string, type: EQuestionType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplateByIdAndType(templateId, type);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllTemplates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getAllTemplates();
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablonlar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplatesByType = useCallback(async (type: EQuestionType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplatesByType(type);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablonlar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.deleteTemplate(templateId);
            if (response.data && response.success) {
                await getAllTemplates();
                showNotification.success('Şablon başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const activateTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.activateTemplate(templateId);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Şablon başarıyla aktifleştirildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon aktifleştirilirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deactivateTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.deactivateTemplate(templateId);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Şablon başarıyla pasifleştirildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon pasifleştirilirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const duplicateTemplate = useCallback(async (templateId: string, newTitle: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.duplicateTemplate(templateId, newTitle);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Şablon başarıyla kopyalandı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon kopyalanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateMap = useCallback(async (templateIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplateMap(templateIds);
            if (response.data && response.success) {
                setTemplateMap(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon haritası alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateTemplate = useCallback(async (templateId: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.validateTemplate(templateId);
            if (response.data && response.success) {
                return response.data;
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon doğrulanırken bir hata oluştu!');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateValidationErrors = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplateValidationErrors(templateId);
            if (response.data && response.success) {
                setValidationErrors(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Doğrulama hataları alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateTemplateData = useCallback(async (template: BaseQuestionTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.validateTemplateData(template);
            if (response.data && response.success) {
                setValidationResult(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon verileri doğrulanırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const isTemplateInUse = useCallback(async (templateId: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.isTemplateInUse(templateId);
            if (response.data && response.success) {
                return response.data;
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon kullanım durumu kontrol edilirken bir hata oluştu!');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamsUsingTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getExamsUsingTemplate(templateId);
            if (response.data && response.success) {
                setExamsUsingTemplate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon kullanan sınavlar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchTemplates = useCallback(async (keyword: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.searchTemplates(keyword);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon arama işleminde bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const filterTemplates = useCallback(async (filter: TemplateFilterDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.filterTemplates(filter);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon filtreleme işleminde bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplatesBySubject = useCallback(async (subject: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplatesBySubject(subject);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Konu bazında şablonlar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplatesByDifficulty = useCallback(async (difficulty: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplatesByDifficulty(difficulty);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Zorluk bazında şablonlar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplatesByCreator = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplatesByCreator(userId);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Oluşturucu bazında şablonlar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateTypeStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplateTypeStatistics();
            if (response.data && response.success) {
                setTemplateTypeStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon tipi istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getMostUsedTemplates = useCallback(async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getMostUsedTemplates(limit);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('En çok kullanılan şablonlar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getRecentTemplates = useCallback(async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getRecentTemplates(limit);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Son şablonlar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateUsageStats = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplateUsageStats(templateId);
            if (response.data && response.success) {
                setTemplateUsageStats(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Şablon kullanım istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    // Specific template type operations
    const createMultipleChoiceTemplate = useCallback(async (dto: MultipleChoiceTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createMultipleChoiceTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Çoktan seçmeli şablon başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Çoktan seçmeli şablon oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateMultipleChoiceTemplate = useCallback(async (templateId: string, dto: MultipleChoiceTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateMultipleChoiceTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Çoktan seçmeli şablon başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Çoktan seçmeli şablon güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createTrueFalseTemplate = useCallback(async (dto: TrueFalseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createTrueFalseTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Doğru/Yanlış şablon başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Doğru/Yanlış şablon oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTrueFalseTemplate = useCallback(async (templateId: string, dto: TrueFalseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateTrueFalseTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Doğru/Yanlış şablon başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Doğru/Yanlış şablon güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createFillInTheBlanksTemplate = useCallback(async (dto: FillInTheBlanksTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createFillInTheBlanksTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Boşluk doldurma şablon başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Boşluk doldurma şablon oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateFillInTheBlanksTemplate = useCallback(async (templateId: string, dto: FillInTheBlanksTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateFillInTheBlanksTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Boşluk doldurma şablon başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Boşluk doldurma şablon güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createShortAnswerTemplate = useCallback(async (dto: ShortAnswerTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createShortAnswerTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Kısa cevap şablon başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kısa cevap şablon oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateShortAnswerTemplate = useCallback(async (templateId: string, dto: ShortAnswerTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateShortAnswerTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Kısa cevap şablon başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kısa cevap şablon güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createMatchingTemplate = useCallback(async (dto: MatchingTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createMatchingTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Eşleştirme şablon başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Eşleştirme şablon oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateMatchingTemplate = useCallback(async (templateId: string, dto: MatchingTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateMatchingTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Eşleştirme şablon başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Eşleştirme şablon güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createEssayTemplate = useCallback(async (dto: EssayTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createEssayTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Kompozisyon şablon başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kompozisyon şablon oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateEssayTemplate = useCallback(async (templateId: string, dto: EssayTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateEssayTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Kompozisyon şablon başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kompozisyon şablon güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createOrderingTemplate = useCallback(async (dto: OrderingTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createOrderingTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Sıralama şablon başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sıralama şablon oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateOrderingTemplate = useCallback(async (templateId: string, dto: OrderingTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateOrderingTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Sıralama şablon başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sıralama şablon güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createMultipleResponseTemplate = useCallback(async (dto: MultipleResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createMultipleResponseTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Çoklu yanıt şablon başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Çoklu yanıt şablon oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateMultipleResponseTemplate = useCallback(async (templateId: string, dto: MultipleResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateMultipleResponseTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Çoklu yanıt şablon başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Çoklu yanıt şablon güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createHotSpotTemplate = useCallback(async (dto: HotSpotTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createHotSpotTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Hot Spot şablon başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Hot Spot şablon oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateHotSpotTemplate = useCallback(async (templateId: string, dto: HotSpotTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateHotSpotTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Hot Spot şablon başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Hot Spot şablon güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createDragAndDropTemplate = useCallback(async (dto: DragAndDropTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createDragAndDropTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Sürükle ve Bırak şablon başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sürükle ve Bırak şablon oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateDragAndDropTemplate = useCallback(async (templateId: string, dto: DragAndDropTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateDragAndDropTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Sürükle ve Bırak şablon başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sürükle ve Bırak şablon güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createAudioResponseTemplate = useCallback(async (dto: AudioResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createAudioResponseTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Ses yanıt şablon başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Ses yanıt şablon oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateAudioResponseTemplate = useCallback(async (templateId: string, dto: AudioResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateAudioResponseTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Ses yanıt şablon başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Ses yanıt şablon güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createVideoResponseTemplate = useCallback(async (dto: VideoResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createVideoResponseTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Video yanıt şablon başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Video yanıt şablon oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateVideoResponseTemplate = useCallback(async (templateId: string, dto: VideoResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateVideoResponseTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Video yanıt şablon başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Video yanıt şablon güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createImageResponseTemplate = useCallback(async (dto: ImageResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createImageResponseTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Görsel yanıt şablon başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Görsel yanıt şablon oluşturulurken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateImageResponseTemplate = useCallback(async (templateId: string, dto: ImageResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateImageResponseTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Görsel yanıt şablon başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Görsel yanıt şablon güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearTemplateData = useCallback(() => {
        setTemplates([]);
        setSelectedTemplate(null);
        setTemplateMap({});
        setTemplateTypeStatistics(null);
        setTemplateUsageStats(null);
        setValidationResult(null);
        setValidationErrors([]);
        setExamsUsingTemplate([]);
        setError(null);
    }, []);

    return {
        templates,
        selectedTemplate,
        templateMap,
        templateTypeStatistics,
        templateUsageStats,
        validationResult,
        validationErrors,
        examsUsingTemplate,
        loading,
        error,
        createTemplate,
        updateTemplate,
        getTemplateById,
        getTemplateByIdAndType,
        getAllTemplates,
        getTemplatesByType,
        deleteTemplate,
        activateTemplate,
        deactivateTemplate,
        duplicateTemplate,
        getTemplateMap,
        validateTemplate,
        getTemplateValidationErrors,
        validateTemplateData,
        isTemplateInUse,
        getExamsUsingTemplate,
        searchTemplates,
        filterTemplates,
        getTemplatesBySubject,
        getTemplatesByDifficulty,
        getTemplatesByCreator,
        getTemplateTypeStatistics,
        getMostUsedTemplates,
        getRecentTemplates,
        getTemplateUsageStats,
        clearTemplateData,
        // Specific template type operations
        createMultipleChoiceTemplate,
        updateMultipleChoiceTemplate,
        createTrueFalseTemplate,
        updateTrueFalseTemplate,
        createFillInTheBlanksTemplate,
        updateFillInTheBlanksTemplate,
        createShortAnswerTemplate,
        updateShortAnswerTemplate,
        createMatchingTemplate,
        updateMatchingTemplate,
        createEssayTemplate,
        updateEssayTemplate,
        createOrderingTemplate,
        updateOrderingTemplate,
        createMultipleResponseTemplate,
        updateMultipleResponseTemplate,
        createHotSpotTemplate,
        updateHotSpotTemplate,
        createDragAndDropTemplate,
        updateDragAndDropTemplate,
        createAudioResponseTemplate,
        updateAudioResponseTemplate,
        createVideoResponseTemplate,
        updateVideoResponseTemplate,
        createImageResponseTemplate,
        updateImageResponseTemplate
    };
};