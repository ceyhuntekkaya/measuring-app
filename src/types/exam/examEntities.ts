// examEntities.ts

import {ExamSectionDto, ExamTypeDto, QuestionGroupTypeDto} from "@/types/exam/examTemplates";
import {EApprovalStatus, ECurriculumLevel, EExamCategory, EMediaType, EQuestionType} from "@/types/exam/enum";

export type DatabaseObjectDto = {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export type QuestionDto = DatabaseObjectDto & {
    name?: string;
    questionGroup?: QuestionGroupDto;
    questionType?: EQuestionType; // Example enum values
    orderNumber?: number;
    isAutomaticallyEvaluated?: boolean;
    maximumScore?: number;
    durationInSeconds?: number;
    questionTemplateId?: string;
    approvalStatus?: EApprovalStatus; // Example enum values
    currentApprovalCount?: number;
    requiredApprovalCount?: number;
    approvalCompletedDate?: string;
}

export type QuestionGroupDto = DatabaseObjectDto & {
    name?: string;
    examType?: ExamTypeDto;
    examSection?: ExamSectionDto;
    questionGroupType?: QuestionGroupTypeDto;
    maximumScore?: number;
    durationInSeconds?: number;
    approvalStatus?: EApprovalStatus; // Example enum values
    currentApprovalCount?: number;
    requiredApprovalCount?: number;
    approvalCompletedDate?: string;
}

export type QuestionGroupHeaderDto = DatabaseObjectDto & {
    questionGroup?: QuestionGroupDto;
    orderNumber?: number;
    mediaType?: EMediaType; // Example enum values
    content?: string;
    approvalStatus?: EApprovalStatus; // Example enum values
    currentApprovalCount?: number;
    requiredApprovalCount?: number;
    approvalCompletedDate?: string;
}

export type QuestionOptionDto = DatabaseObjectDto & {
    question?: QuestionDto;
    orderNumber?: number;
    mediaType?: EMediaType; // Example enum values
    content?: string;
    baseContent?: string;
    isTrueOption?: boolean;
}

export type QuestionPartDto = DatabaseObjectDto & {
    orderNumber?: number;
    mediaType?: EMediaType; // Example enum values
    content?: string;
    question?: QuestionDto;
    label?: string;
    maximumScore?: number;
    durationInSeconds?: number;
    repetitionCount?: number;
    approvalStatus?: EApprovalStatus; // Example enum values
    currentApprovalCount?: number;
    requiredApprovalCount?: number;
    approvalCompletedDate?: string;
}

export type CurriculumDto = DatabaseObjectDto & {
    name?: string;
    description?: string;
    category?: EExamCategory; // Example enum values
    updatedAt?: string;
    version?: number;
    approvalStatus?: EApprovalStatus; // Example enum values
    currentApprovalCount?: number;
    requiredApprovalCount?: number;
    approvalCompletedDate?: string;
}

export type CurriculumContentDto = DatabaseObjectDto & {
    code?: string;
    curriculum?: CurriculumDto;
    level?: ECurriculumLevel; // Example enum values
    content?: string;
    orderNumber?: number;
    parent?: CurriculumContentDto;
    parentId?: string;
    children?: CurriculumContentDto[];
    updatedAt?: string;
    version?: number;
    approvalStatus?: EApprovalStatus; // Example enum values
    currentApprovalCount?: number;
    requiredApprovalCount?: number;
    approvalCompletedDate?: string;
}

export type QuestionSearchRequest = {
    name?: string;
    questionType?: EQuestionType; // Example enum values
    questionGroupId?: string;
    isAutomaticallyEvaluated?: boolean;
    questionTemplateId?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
}

