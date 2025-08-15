// questionTemplates.ts



import {
    FillInTheBlanksOptions,
    MultipleChoiceOptions,
    MultipleResponseOptions,
    TrueFalseOptions
} from "@/types/exam/templateOptions";
import {EQuestionType, EStatus} from "@/types/exam/enum";

export type OrderingTemplateDto = BaseQuestionTemplateDto & {
    instructions?: string;
    options?: string; // This could be a more specific type like an array of objects
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
    options?: string; // This could be a more specific type
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
    options?: string; // This could be a more specific type
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
    options?: string; // This could be a more specific type
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
