// examRequests.ts

import {EMediaType, EQuestionGroupType, EQuestionType} from "@/types/exam/enum";
import {QuestionTemplateType} from "@/types/exam/examEntities";

export type CreateQuestionGroupRequest = {
    name: string;
    examTypeId: string;
    examSectionId: string;
    questionGroupTypeId: string;
    maximumScore?: number;
    durationInSeconds?: number;
    headers?: CreateQuestionGroupHeaderRequest[];
}

export type CreateQuestionRequest = {
    id?: string;
    name: string;
    questionGroupId: string;
    questionType: EQuestionType; // Example enum values
    orderNumber?: number;
    isAutomaticallyEvaluated?: boolean;
    maximumScore?: number;
    durationInSeconds?: number;
    questionTemplate?: QuestionTemplateType | null;
    parts?: CreateQuestionPartRequest[];
    options?: CreateQuestionOptionRequest[];
}

export type CreateQuestionGroupHeaderRequest = {
    orderNumber: number;
    mediaType?: EMediaType; // Example enum values
    content: string;
}

export type CreateQuestionOptionRequest = {
    orderNumber: number;
    mediaType?: EMediaType; // Example enum values
    content: string;
    baseContent?: string;
    isTrueOption: boolean;
}

export type CreateQuestionPartRequest = {
    orderNumber: number;
    mediaType?: EMediaType; // Example enum values
    content?: string;
    label?: string;
    maximumScore?: number;
    durationInSeconds?: number;
    repetitionCount?: number;
}

export type CreateQuestionTemplateRequest = {
    title: string;
    description?: string;
    subject: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    points: number;
    timeLimit: number;
    instructions?: string;
    tags?: string[];
    questionType: EQuestionGroupType; // Example enum values
    templateData: string; // Using `any` because the type is generic `Object`
}

export type UpdateQuestionTemplateRequest = {
    id: string;
    title?: string;
    description?: string;
    subject?: string;
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
    points?: number;
    timeLimit?: number;
    instructions?: string;
    tags?: string[];
    isActive?: boolean;
    templateData?: string; // Using `any` because the type is generic `Object`
}