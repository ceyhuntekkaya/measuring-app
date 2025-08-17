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
} from "@/types/exam/questionTemplates";
import { ApiResponse } from "@/types/exam/examValidationAndAnalytics";
import {EQuestionType} from "@/types/exam/enum";


import api from "@/services/api/base-api";


class TemplateService {
    private readonly baseUrl = '/exam-templates';

    async createTemplate(templateDto: BaseQuestionTemplateDto): Promise<ApiResponse<BaseQuestionTemplateDto>> {
        const response = await api.post<ApiResponse<BaseQuestionTemplateDto>>(`${this.baseUrl}`, templateDto);
        return response.data;
    }

    async updateTemplate(templateId: string, templateDto: BaseQuestionTemplateDto): Promise<ApiResponse<BaseQuestionTemplateDto>> {
        const response = await api.put<ApiResponse<BaseQuestionTemplateDto>>(`${this.baseUrl}/${templateId}`, templateDto);
        return response.data;
    }

    async getTemplateById(templateId: string): Promise<ApiResponse<BaseQuestionTemplateDto>> {
        const response = await api.get<ApiResponse<BaseQuestionTemplateDto>>(`${this.baseUrl}/${templateId}`);
        return response.data;
    }

    async getTemplateByIdAndType(templateId: string, type: EQuestionType): Promise<ApiResponse<BaseQuestionTemplateDto>> {
        const response = await api.get<ApiResponse<BaseQuestionTemplateDto>>(`${this.baseUrl}/${templateId}/type/${type}`);
        return response.data;
    }

    async getAllTemplates(): Promise<ApiResponse<BaseQuestionTemplateDto[]>> {
        const response = await api.get<ApiResponse<BaseQuestionTemplateDto[]>>(`${this.baseUrl}`);
        return response.data;
    }

    async getTemplatesByType(type: EQuestionType): Promise<ApiResponse<BaseQuestionTemplateDto[]>> {
        const response = await api.get<ApiResponse<BaseQuestionTemplateDto[]>>(`${this.baseUrl}/type/${type}`);
        return response.data;
    }

    async deleteTemplate(templateId: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${templateId}`);
        return response.data;
    }

    async activateTemplate(templateId: string): Promise<ApiResponse<BaseQuestionTemplateDto>> {
        const response = await api.put<ApiResponse<BaseQuestionTemplateDto>>(`${this.baseUrl}/${templateId}/activate`);
        return response.data;
    }

    async deactivateTemplate(templateId: string): Promise<ApiResponse<BaseQuestionTemplateDto>> {
        const response = await api.put<ApiResponse<BaseQuestionTemplateDto>>(`${this.baseUrl}/${templateId}/deactivate`);
        return response.data;
    }

    async duplicateTemplate(templateId: string, newTitle: string): Promise<ApiResponse<BaseQuestionTemplateDto>> {
        const response = await api.post<ApiResponse<BaseQuestionTemplateDto>>(`${this.baseUrl}/${templateId}/duplicate`, { newTitle });
        return response.data;
    }

    async getTemplateMap(templateIds: string[]): Promise<ApiResponse<Record<string, BaseQuestionTemplateDto>>> {
        const response = await api.post<ApiResponse<Record<string, BaseQuestionTemplateDto>>>(`${this.baseUrl}/map`, { templateIds });
        return response.data;
    }

    async validateTemplate(templateId: string): Promise<ApiResponse<boolean>> {
        const response = await api.get<ApiResponse<boolean>>(`${this.baseUrl}/${templateId}/validate`);
        return response.data;
    }

    async getTemplateValidationErrors(templateId: string): Promise<ApiResponse<string[]>> {
        const response = await api.get<ApiResponse<string[]>>(`${this.baseUrl}/${templateId}/validation-errors`);
        return response.data;
    }

    async validateTemplateData(template: BaseQuestionTemplateDto): Promise<ApiResponse<TemplateValidationResult>> {
        const response = await api.post<ApiResponse<TemplateValidationResult>>(`${this.baseUrl}/validate-data`, template);
        return response.data;
    }

    async isTemplateInUse(templateId: string): Promise<ApiResponse<boolean>> {
        const response = await api.get<ApiResponse<boolean>>(`${this.baseUrl}/${templateId}/in-use`);
        return response.data;
    }

    async getExamsUsingTemplate(templateId: string): Promise<ApiResponse<string[]>> {
        const response = await api.get<ApiResponse<string[]>>(`${this.baseUrl}/${templateId}/exams`);
        return response.data;
    }

    async searchTemplates(keyword: string): Promise<ApiResponse<BaseQuestionTemplateDto[]>> {
        const params = new URLSearchParams({ keyword });
        const response = await api.get<ApiResponse<BaseQuestionTemplateDto[]>>(`${this.baseUrl}/search?${params}`);
        return response.data;
    }

    async filterTemplates(filter: TemplateFilterDto): Promise<ApiResponse<BaseQuestionTemplateDto[]>> {
        const response = await api.post<ApiResponse<BaseQuestionTemplateDto[]>>(`${this.baseUrl}/filter`, filter);
        return response.data;
    }

    async getTemplatesBySubject(subject: string): Promise<ApiResponse<BaseQuestionTemplateDto[]>> {
        const response = await api.get<ApiResponse<BaseQuestionTemplateDto[]>>(`${this.baseUrl}/subject/${subject}`);
        return response.data;
    }

    async getTemplatesByDifficulty(difficulty: string): Promise<ApiResponse<BaseQuestionTemplateDto[]>> {
        const response = await api.get<ApiResponse<BaseQuestionTemplateDto[]>>(`${this.baseUrl}/difficulty/${difficulty}`);
        return response.data;
    }

    async getTemplatesByCreator(userId: string): Promise<ApiResponse<BaseQuestionTemplateDto[]>> {
        const response = await api.get<ApiResponse<BaseQuestionTemplateDto[]>>(`${this.baseUrl}/creator/${userId}`);
        return response.data;
    }

    // Specific Template Type Operations
    async createMultipleChoiceTemplate(dto: MultipleChoiceTemplateDto): Promise<ApiResponse<MultipleChoiceTemplateDto>> {
        const response = await api.post<ApiResponse<MultipleChoiceTemplateDto>>(`${this.baseUrl}/multiple-choice`, dto);
        return response.data;
    }

    async updateMultipleChoiceTemplate(templateId: string, dto: MultipleChoiceTemplateDto): Promise<ApiResponse<MultipleChoiceTemplateDto>> {
        const response = await api.put<ApiResponse<MultipleChoiceTemplateDto>>(`${this.baseUrl}/multiple-choice/${templateId}`, dto);
        return response.data;
    }

    async createTrueFalseTemplate(dto: TrueFalseTemplateDto): Promise<ApiResponse<TrueFalseTemplateDto>> {
        const response = await api.post<ApiResponse<TrueFalseTemplateDto>>(`${this.baseUrl}/true-false`, dto);
        return response.data;
    }

    async updateTrueFalseTemplate(templateId: string, dto: TrueFalseTemplateDto): Promise<ApiResponse<TrueFalseTemplateDto>> {
        const response = await api.put<ApiResponse<TrueFalseTemplateDto>>(`${this.baseUrl}/true-false/${templateId}`, dto);
        return response.data;
    }

    async createFillInTheBlanksTemplate(dto: FillInTheBlanksTemplateDto): Promise<ApiResponse<FillInTheBlanksTemplateDto>> {
        const response = await api.post<ApiResponse<FillInTheBlanksTemplateDto>>(`${this.baseUrl}/fill-in-blanks`, dto);
        return response.data;
    }

    async updateFillInTheBlanksTemplate(templateId: string, dto: FillInTheBlanksTemplateDto): Promise<ApiResponse<FillInTheBlanksTemplateDto>> {
        const response = await api.put<ApiResponse<FillInTheBlanksTemplateDto>>(`${this.baseUrl}/fill-in-blanks/${templateId}`, dto);
        return response.data;
    }

    async createShortAnswerTemplate(dto: ShortAnswerTemplateDto): Promise<ApiResponse<ShortAnswerTemplateDto>> {
        const response = await api.post<ApiResponse<ShortAnswerTemplateDto>>(`${this.baseUrl}/short-answer`, dto);
        return response.data;
    }

    async updateShortAnswerTemplate(templateId: string, dto: ShortAnswerTemplateDto): Promise<ApiResponse<ShortAnswerTemplateDto>> {
        const response = await api.put<ApiResponse<ShortAnswerTemplateDto>>(`${this.baseUrl}/short-answer/${templateId}`, dto);
        return response.data;
    }

    async createMatchingTemplate(dto: MatchingTemplateDto): Promise<ApiResponse<MatchingTemplateDto>> {
        const response = await api.post<ApiResponse<MatchingTemplateDto>>(`${this.baseUrl}/matching`, dto);
        return response.data;
    }

    async updateMatchingTemplate(templateId: string, dto: MatchingTemplateDto): Promise<ApiResponse<MatchingTemplateDto>> {
        const response = await api.put<ApiResponse<MatchingTemplateDto>>(`${this.baseUrl}/matching/${templateId}`, dto);
        return response.data;
    }

    async createEssayTemplate(dto: EssayTemplateDto): Promise<ApiResponse<EssayTemplateDto>> {
        const response = await api.post<ApiResponse<EssayTemplateDto>>(`${this.baseUrl}/essay`, dto);
        return response.data;
    }

    async updateEssayTemplate(templateId: string, dto: EssayTemplateDto): Promise<ApiResponse<EssayTemplateDto>> {
        const response = await api.put<ApiResponse<EssayTemplateDto>>(`${this.baseUrl}/essay/${templateId}`, dto);
        return response.data;
    }

    async createOrderingTemplate(dto: OrderingTemplateDto): Promise<ApiResponse<OrderingTemplateDto>> {
        const response = await api.post<ApiResponse<OrderingTemplateDto>>(`${this.baseUrl}/ordering`, dto);
        return response.data;
    }

    async updateOrderingTemplate(templateId: string, dto: OrderingTemplateDto): Promise<ApiResponse<OrderingTemplateDto>> {
        const response = await api.put<ApiResponse<OrderingTemplateDto>>(`${this.baseUrl}/ordering/${templateId}`, dto);
        return response.data;
    }

    async createMultipleResponseTemplate(dto: MultipleResponseTemplateDto): Promise<ApiResponse<MultipleResponseTemplateDto>> {
        const response = await api.post<ApiResponse<MultipleResponseTemplateDto>>(`${this.baseUrl}/multiple-response`, dto);
        return response.data;
    }

    async updateMultipleResponseTemplate(templateId: string, dto: MultipleResponseTemplateDto): Promise<ApiResponse<MultipleResponseTemplateDto>> {
        const response = await api.put<ApiResponse<MultipleResponseTemplateDto>>(`${this.baseUrl}/multiple-response/${templateId}`, dto);
        return response.data;
    }

    async createHotSpotTemplate(dto: HotSpotTemplateDto): Promise<ApiResponse<HotSpotTemplateDto>> {
        const response = await api.post<ApiResponse<HotSpotTemplateDto>>(`${this.baseUrl}/hot-spot`, dto);
        return response.data;
    }

    async updateHotSpotTemplate(templateId: string, dto: HotSpotTemplateDto): Promise<ApiResponse<HotSpotTemplateDto>> {
        const response = await api.put<ApiResponse<HotSpotTemplateDto>>(`${this.baseUrl}/hot-spot/${templateId}`, dto);
        return response.data;
    }

    async createDragAndDropTemplate(dto: DragAndDropTemplateDto): Promise<ApiResponse<DragAndDropTemplateDto>> {
        const response = await api.post<ApiResponse<DragAndDropTemplateDto>>(`${this.baseUrl}/drag-drop`, dto);
        return response.data;
    }

    async updateDragAndDropTemplate(templateId: string, dto: DragAndDropTemplateDto): Promise<ApiResponse<DragAndDropTemplateDto>> {
        const response = await api.put<ApiResponse<DragAndDropTemplateDto>>(`${this.baseUrl}/drag-drop/${templateId}`, dto);
        return response.data;
    }

    async createAudioResponseTemplate(dto: AudioResponseTemplateDto): Promise<ApiResponse<AudioResponseTemplateDto>> {
        const response = await api.post<ApiResponse<AudioResponseTemplateDto>>(`${this.baseUrl}/audio-response`, dto);
        return response.data;
    }

    async updateAudioResponseTemplate(templateId: string, dto: AudioResponseTemplateDto): Promise<ApiResponse<AudioResponseTemplateDto>> {
        const response = await api.put<ApiResponse<AudioResponseTemplateDto>>(`${this.baseUrl}/audio-response/${templateId}`, dto);
        return response.data;
    }

    async createVideoResponseTemplate(dto: VideoResponseTemplateDto): Promise<ApiResponse<VideoResponseTemplateDto>> {
        const response = await api.post<ApiResponse<VideoResponseTemplateDto>>(`${this.baseUrl}/video-response`, dto);
        return response.data;
    }

    async updateVideoResponseTemplate(templateId: string, dto: VideoResponseTemplateDto): Promise<ApiResponse<VideoResponseTemplateDto>> {
        const response = await api.put<ApiResponse<VideoResponseTemplateDto>>(`${this.baseUrl}/video-response/${templateId}`, dto);
        return response.data;
    }

    async createImageResponseTemplate(dto: ImageResponseTemplateDto): Promise<ApiResponse<ImageResponseTemplateDto>> {
        const response = await api.post<ApiResponse<ImageResponseTemplateDto>>(`${this.baseUrl}/image-response`, dto);
        return response.data;
    }

    async updateImageResponseTemplate(templateId: string, dto: ImageResponseTemplateDto): Promise<ApiResponse<ImageResponseTemplateDto>> {
        const response = await api.put<ApiResponse<ImageResponseTemplateDto>>(`${this.baseUrl}/image-response/${templateId}`, dto);
        return response.data;
    }

    // Template Analytics
    async getTemplateTypeStatistics(): Promise<ApiResponse<TemplateTypeStatistics>> {
        const response = await api.get<ApiResponse<TemplateTypeStatistics>>(`${this.baseUrl}/statistics/types`);
        return response.data;
    }

    async getMostUsedTemplates(limit: number = 10): Promise<ApiResponse<BaseQuestionTemplateDto[]>> {
        const params = new URLSearchParams({ limit: limit.toString() });
        const response = await api.get<ApiResponse<BaseQuestionTemplateDto[]>>(`${this.baseUrl}/statistics/most-used?${params}`);
        return response.data;
    }

    async getRecentTemplates(limit: number = 10): Promise<ApiResponse<BaseQuestionTemplateDto[]>> {
        const params = new URLSearchParams({ limit: limit.toString() });
        const response = await api.get<ApiResponse<BaseQuestionTemplateDto[]>>(`${this.baseUrl}/statistics/recent?${params}`);
        return response.data;
    }

    async getTemplateUsageStats(templateId: string): Promise<ApiResponse<TemplateUsageStatsDto>> {
        const response = await api.get<ApiResponse<TemplateUsageStatsDto>>(`${this.baseUrl}/${templateId}/usage-stats`);
        return response.data;
    }
}

export const templateService = new TemplateService();