// questionTemplates.ts


import {EDifficulty, EMediaType, EQuestionType, EStatus} from "@/types/exam/enum";

export interface OrderingTemplateDto extends BaseQuestionTemplateDto  {
    instructions?: string;
    options?: OrderingOptions;
    shuffleItems?: boolean;
    explanation?: string;
}

export interface VideoResponseTemplateDto extends BaseQuestionTemplateDto  {
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

export interface ImageResponseTemplateDto extends BaseQuestionTemplateDto  {
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

export interface ShortAnswerTemplateDto extends BaseQuestionTemplateDto  {
    question?: string;
    options?: ShortAnswerOptions;
    maxCharacters?: number;
    minCharacters?: number;
    rubric?: string;
    requiresManualGrading?: boolean;
}

export interface FillInTheBlanksTemplateDto extends BaseQuestionTemplateDto  {
    textWithBlanks?: string;
    options?: FillInTheBlanksOptions;
    caseSensitive?: boolean;
    exactMatch?: boolean;
    explanation?: string;
}

export interface MatchingTemplateDto extends BaseQuestionTemplateDto  {
    instructions?: string;
    options?: MatchingOptions;
    shuffleItems?: boolean;
    explanation?: string;
}

export interface MultipleChoiceTemplateDto extends BaseQuestionTemplateDto  {
    question?: string;
    options?: MultipleChoiceOptions;
    correctOptionIndex?: number;
    explanation?: string;
    shuffleOptions?: boolean;
}

export interface TrueFalseTemplateDto extends BaseQuestionTemplateDto  {
    statement?: string;
    options?: TrueFalseOptions;
    correctAnswer?: boolean;
    explanation?: string;
}

export interface HotSpotTemplateDto extends BaseQuestionTemplateDto  {
    instructions?: string;
    imageUrl?: string;
    options?: HotSpotOptions; // This could be a more specific type
    maxSelections?: number;
    allowMultipleSpots?: boolean;
    explanation?: string;
}

export interface MultipleResponseTemplateDto extends BaseQuestionTemplateDto  {
    question?: string;
    options?: MultipleResponseOptions;
    correctOptionIndices?: number[];
    minSelections?: number;
    maxSelections?: number;
    shuffleOptions?: boolean;
    explanation?: string;
}

// templateDtos.ts

export interface BaseQuestionTemplateDto {
    id?: string;
    title?: string;
    description?: string;
    subject?: string;
    difficulty?: EDifficulty;
    points?: number;
    timeLimit?: number;
    instructions?: string;
    tags?: string[];
    isActive?: boolean;
    questionType?: EQuestionType;
    createdAt?: string;
    deletedAt?: string;
    status?: EStatus;
    createdById?: string;
    deletedById?: string;
}

export interface DragAndDropTemplateDto extends BaseQuestionTemplateDto  {
    instructions?: string;
    options?: string;
    allowMultipleItemsPerZone?: boolean;
    shuffleDraggableItems?: boolean;
    explanation?: string;
}

export interface EssayTemplateDto extends BaseQuestionTemplateDto  {
    prompt?: string;
    gradingCriteria?: string[];
    minWords?: number;
    maxWords?: number;
    requiredTopics?: string[];
    rubric?: string;
    requiresManualGrading?: boolean;
}

export interface AudioResponseTemplateDto extends BaseQuestionTemplateDto  {
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
    mediaType?: EMediaType;
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

