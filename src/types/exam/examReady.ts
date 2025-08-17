// examReady.ts


import {EExamType, EMediaType, EQuestionGroupTemplateLevel, EQuestionGroupType, EQuestionType} from "@/types/exam/enum";
import {BaseQuestionTemplateDto} from "@/types/exam/questionTemplates";

export type ExamReadyDto = {
    examId: string;
    examName: string;
    examLevel: string;
    examType: EExamType; // Example enum values
    infoScreen: string;
    description: string;
    maximumScore: number;
    durationInSeconds: number;
    isOrder: boolean;
    isShowEvaluation: boolean;
    isFinalized: boolean;
    isGraded: boolean;
    screenRecordTime: number;
    sections: ExamSectionReadyDto[];
    metadata: ExamMetadataDto;
}

export type ExamSectionReadyDto = {
    sectionId: string;
    name: string;
    orderNumber: number;
    questionGroups: QuestionGroupReadyDto[];
    totalQuestions: number;
    totalScore: number;
    estimatedDuration: number;
}

export type QuestionGroupReadyDto = {
    groupId: string;
    name: string;
    groupTypeName: string;
    groupType: EQuestionGroupType; // Example enum values
    level: EQuestionGroupTemplateLevel; // Example enum values
    maximumScore: number;
    durationInSeconds: number;
    headers: QuestionGroupHeaderReadyDto[];
    questions: QuestionReadyDto[];
    questionCount: number;
    hasManualGrading: boolean;
}

export type QuestionReadyDto = {
    questionId: string;
    name: string;
    questionType: EQuestionType; // Example enum values
    orderNumber: number;
    isAutomaticallyEvaluated: boolean;
    maximumScore: number;
    durationInSeconds: number;
    template: BaseQuestionTemplateDto; // This type is not provided, so a generic type is used.
    parts: QuestionPartReadyDto[];
    options: QuestionOptionReadyDto[];
    metadata: QuestionMetadataDto;
}

export type QuestionGroupHeaderReadyDto = {
    headerId: string;
    orderNumber: number;
    mediaType: EMediaType; // Example enum values
    content: string;
}

export type QuestionOptionReadyDto = {
    optionId: string;
    orderNumber: number;
    mediaType: EMediaType; // Example enum values
    content: string;
    baseContent: string;
}

export type QuestionPartReadyDto = {
    partId: string;
    orderNumber: number;
    mediaType: EMediaType; // Example enum values
    content: string;
    label: string;
    maximumScore: number;
    durationInSeconds: number;
    repetitionCount: number;
}

export type ExamMetadataDto = {
    totalQuestions: number;
    totalSections: number;
    totalQuestionGroups: number;
    totalScore: number;
    estimatedDuration: number;
    hasManualGradingQuestions: boolean;
    hasMediaContent: boolean;
    hasTimeLimits: boolean;
    questionTypes: string[];
    subjects: string[];
    difficultyLevel: 'MIXED' | 'EASY' | 'MEDIUM' | 'HARD';
}

export type QuestionMetadataDto = {
    difficulty: string;
    subject: string;
    tags: string[];
    requiresManualGrading: boolean;
    hasMediaContent: boolean;
    hasMultipleParts: boolean;
    estimatedTime: string;
}
