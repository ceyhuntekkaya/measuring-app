// examResponses.ts

import {BaseQuestionTemplateDto} from "@/types/exam/questionTemplates";
import {EExamType, EMediaType, EQuestionType} from "@/types/exam/enum";

export type QuestionTemplateResponse = {
    id: string;
    title: string;
    subject: string;
    difficulty: string;
    questionType: EQuestionType; // Example enum values
    isActive: boolean;
    templateData: BaseQuestionTemplateDto;
}

export type QuestionTemplateListResponse = {
    templates: QuestionTemplateResponse[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export type QuestionTemplateSearchRequest = {
    title?: string;
    subject?: string;
    difficulty?: string;
    questionType?: EQuestionType; // Example enum values
    tags?: string[];
    isActive?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
}

export type ExamTemplateSearchRequest = {
    name?: string;
    examLevel?: string;
    examType?: EExamType; // Example enum values
    isFinalized?: boolean;
    isActive?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
}

export type FileTypeCount = {
    documentType: EMediaType; // Example enum values
    count: number;
}
