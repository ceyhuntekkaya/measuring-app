// templateOptions.ts

import {EMediaType} from "@/types/exam/enum";

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