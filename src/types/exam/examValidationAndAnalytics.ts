// examValidationAndAnalytics.ts

import {EQuestionType} from "@/types/exam/enum";

export type TemplateExportRequest = {
    format?: string; // Example string literal type
    templateIds?: number[];
    filters?: Record<string, string>;
    includeInactive?: boolean;
    includeOptions?: boolean;
    exportOptions?: Record<string, string>;
}

export type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
    errors?: string[];
    timestamp?: string;
    path?: string;
}

export type ExamValidationResult = {
    isReady: boolean;
    issues?: ExamValidationIssue[];
    statistics?: ExamStatistics;
}

export type ExamValidationIssue = {
    severity: string; // Example string literal type
    component: string; // Example string literal type
    componentId?: number;
    message?: string;
    suggestion?: string;
}

export type ExamStatistics = {
    totalQuestions?: number;
    questionsWithoutTemplate?: number;
    manualGradingQuestions?: number;
    autoGradingQuestions?: number;
    totalPossibleScore?: number;
    totalEstimatedDuration?: number;
    questionTypeDistribution?: Record<string, number>;
    difficultyDistribution?: Record<string, number>;
}

export type ValidationErrorResponse = {
    message?: string;
    fieldErrors?: Record<string, string[]>;
    globalErrors?: string[];
    timestamp?: string;
    path?: string;
}

export type BulkOperationResult<T> = {
    totalItems?: number;
    successCount?: number;
    failureCount?: number;
    successfulItems?: T[];
    errors?: BulkOperationError<T>[];
}

export type BulkOperationError<T> = {
    itemIndex?: number;
    item?: T;
    error?: string;
    details?: string;
}

export type TemplateValidationResult = {
    isValid: boolean;
    errors?: ValidationError[];
    warnings?: ValidationWarning[];
}

export type ValidationError = {
    field?: string;
    message?: string;
    code?: string;
    rejectedValue?: string;
}

export type ValidationWarning = {
    field?: string;
    message?: string;
    suggestion?: string;
}

export type TemplateImportResult = {
    success: boolean;
    importedCount?: number;
    skippedCount?: number;
    errorCount?: number;
    importedIds?: string[];
    errors?: ImportError[];
    warnings?: ImportWarning[];
}

export type ImportError = {
    lineNumber?: number;
    field?: string;
    message?: string;
    data?: string;
}

export type ImportWarning = {
    lineNumber?: number;
    message?: string;
    suggestion?: string;
}

export type TemplateImportRequest = {
    format?: string; // Example string literal type
    data?: string;
    validateOnly?: boolean;
    overwriteExisting?: boolean;
    options?: Record<string, string>;
}

export type TemplateUsageStatistics = {
    templateId?: number;
    templateTitle?: string;
    usageCount?: number;
    averageScore?: number;
    totalAttempts?: number;
    lastUsed?: string;
    performanceMetrics?: Record<string, string>;
}

export type QuestionPerformanceAnalytics = {
    questionId?: number;
    questionName?: string;
    questionType?: EQuestionType; // Example enum values
    difficultyIndex?: number;
    discriminationIndex?: number;
    totalAttempts?: number;
    correctAttempts?: number;
    averageTimeSpent?: number;
    commonMistakes?: string[];
    recommendation?: string; // Example string literal type
}