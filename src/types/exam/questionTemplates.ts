// questionTemplates.ts


import {EMediaType, EQuestionType, EStatus} from "@/types/exam/enum";

export type OrderingTemplateDto = BaseQuestionTemplateDto & {
    instructions?: string;
    options?: OrderingOptions;
    shuffleItems?: boolean;
    explanation?: string;
}

export type VideoResponseTemplateDto = BaseQuestionTemplateDto & {
    prompt?: string;
    videoPromptUrl?: string;
    maxRecordingDuration?: number;
    minRecordingDuration?: number;
    gradingCriteria?: string[];
    rubric?: string;
    requiresManualGrading?: boolean;
    allowedFormats?: string;
    allowScreenRecording?: boolean;
}

export type ImageResponseTemplateDto = BaseQuestionTemplateDto & {
    prompt?: string;
    referenceImageUrl?: string;
    maxFileSize?: number;
    gradingCriteria?: string[];
    rubric?: string;
    requiresManualGrading?: boolean;
    allowedFormats?: string;
    requiresDrawing?: boolean;
    allowsUpload?: boolean;
}

export type ShortAnswerTemplateDto = BaseQuestionTemplateDto & {
    question?: string;
    options?: ShortAnswerOptions; // This could be a more specific type
    maxCharacters?: number;
    minCharacters?: number;
    rubric?: string;
    requiresManualGrading?: boolean;
}

export type FillInTheBlanksTemplateDto = BaseQuestionTemplateDto & {
    textWithBlanks?: string;
    options?: FillInTheBlanksOptions;
    caseSensitive?: boolean;
    exactMatch?: boolean;
    explanation?: string;
}

export type MatchingTemplateDto = BaseQuestionTemplateDto & {
    instructions?: string;
    options?: MatchingOptions; // This could be a more specific type
    shuffleItems?: boolean;
    explanation?: string;
}

export type MultipleChoiceTemplateDto = BaseQuestionTemplateDto & {
    question?: string;
    options?: MultipleChoiceOptions;
    correctOptionIndex?: number;
    explanation?: string;
    shuffleOptions?: boolean;
}

export type TrueFalseTemplateDto = BaseQuestionTemplateDto & {
    statement?: string;
    options?: TrueFalseOptions;
    correctAnswer?: boolean;
    explanation?: string;
}

export type HotSpotTemplateDto = BaseQuestionTemplateDto & {
    instructions?: string;
    imageUrl?: string;
    options?: HotSpotOptions; // This could be a more specific type
    maxSelections?: number;
    allowMultipleSpots?: boolean;
    explanation?: string;
}

export type MultipleResponseTemplateDto = BaseQuestionTemplateDto & {
    question?: string;
    options?: MultipleResponseOptions;
    correctOptionIndices?: number[];
    minSelections?: number;
    maxSelections?: number;
    shuffleOptions?: boolean;
    explanation?: string;
}

// templateDtos.ts

export type BaseQuestionTemplateDto = {
    id?: string;
    title?: string;
    description?: string;
    subject?: string;
    difficulty?: string;
    points?: number;
    timeLimit?: number;
    instructions?: string;
    tags?: string[];
    isActive?: boolean;
    questionType?: EQuestionType; // Example enum values from @JsonSubTypes
    createdAt?: string;
    deletedAt?: string;
    status?: EStatus; // Example enum values
    createdById?: string;
    deletedById?: string;
}

export type DragAndDropTemplateDto = BaseQuestionTemplateDto & {
    instructions?: string;
    options?: string;
    allowMultipleItemsPerZone?: boolean;
    shuffleDraggableItems?: boolean;
    explanation?: string;
}

export type EssayTemplateDto = BaseQuestionTemplateDto & {
    prompt?: string;
    gradingCriteria?: string[];
    minWords?: number;
    maxWords?: number;
    requiredTopics?: string[];
    rubric?: string;
    requiresManualGrading?: boolean;
}

export type AudioResponseTemplateDto = BaseQuestionTemplateDto & {
    prompt?: string;
    audioPromptUrl?: string;
    maxRecordingDuration?: number;
    minRecordingDuration?: number;
    gradingCriteria?: string[];
    rubric?: string;
    requiresManualGrading?: boolean;
    allowedFormats?: string;
}

// Request DTOs
export interface TemplateFilterDto {
    type?: EQuestionType;
    subject?: string;
    difficulty?: string;
    minPoints?: number;
    maxPoints?: number;
    minTimeLimit?: number;
    maxTimeLimit?: number;
    isActive?: boolean;
    tags?: string[];
}

// Response DTOs
export interface TemplateTypeStatistics {
    [key: string]: number;
}

export interface TemplateUsageStatsDto {
    templateId: string;
    usageCount: number;
    examCount: number;
    lastUsed?: string;
}

export interface TemplateValidationResult {
    templateId: string;
    isValid: boolean;
    errors: string[];
}



export type MultipleChoiceOptions = {
    choices?: ChoiceOption[];
}

export type ChoiceOption = {
    id?: string;
    text?: string;
    isCorrect?: boolean;
    feedback?: string;
    mediaUrl?: string;
    mediaType?: EMediaType; // Example string literal type
}

export type MultipleResponseOptions = {
    choices?: ResponseOption[];
    selectionInstruction?: string;
}

export type ResponseOption = {
    id?: string;
    text?: string;
    isCorrect?: boolean;
    feedback?: string;
    mediaUrl?: string;
    mediaType?: string;
}

export type TrueFalseOptions = {
    correctAnswer?: boolean;
    trueLabel?: string;
    falseLabel?: string;
    trueFeedback?: string;
    falseFeedback?: string;
}

export type ShortAnswerOptions = {
    acceptableAnswers?: AcceptableAnswer[];
    caseSensitive?: boolean;
    exactMatch?: boolean;
    placeholder?: string;
}

export type AcceptableAnswer = {
    answer?: string;
    score?: number;
    feedback?: string;
}

export type FillInTheBlanksOptions = {
    blanks?: BlankAnswer[];
}

export type BlankAnswer = {
    blankId?: string;
    acceptableAnswers?: string[];
    caseSensitive?: boolean;
    exactMatch?: boolean;
    score?: number;
    feedback?: string;
}

export type MatchingOptions = {
    pairs?: MatchingPair[];
    distractors?: string[];
}

export type MatchingPair = {
    leftId?: string;
    leftText?: string;
    leftMediaUrl?: string;
    rightId?: string;
    rightText?: string;
    rightMediaUrl?: string;
    feedback?: string;
}

export type OrderingOptions = {
    items?: OrderingItem[];
    orderingType?: string; // Example string literal type
}

export type OrderingItem = {
    id?: string;
    text?: string;
    correctPosition?: number;
    mediaUrl?: string;
    mediaType?: string;
    feedback?: string;
}

export type DragAndDropOptions = {
    draggableItems?: DraggableItem[];
    dropZones?: DropZone[];
}

export type DraggableItem = {
    id?: string;
    text?: string;
    mediaUrl?: string;
    mediaType?: string;
    correctZones?: string[];
}

export type DropZone = {
    id?: string;
    label?: string;
    maxItems?: number;
    feedback?: string;
    position?: string;
}

export type HotSpotOptions = {
    backgroundImageUrl?: string;
    hotSpots?: HotSpotArea[];
    selectionType?: string; // Example string literal type
}

export type HotSpotArea = {
    id?: string;
    shape?: string; // Example string literal type
    coordinates?: string;
    isCorrect?: boolean;
    feedback?: string;
    label?: string;
}

