// examResponses.ts

import {BaseQuestionTemplateDto} from "@/types/exam/questionTemplates";
import {
    EApprovalStatus,
    EApprovalType,
    ECurriculumLevel, EExamCategory,
    EExamType,
    EMediaType, EQuestionGroupTemplateLevel, EQuestionGroupType,
    EQuestionType,
    ObjectType
} from "@/types/exam/enum";

import {CurriculumContentDto, CurriculumDto, ExamSessionDto} from "@/types/exam/examEntities";

import {ExamTypeDto} from "@/types/exam/examTemplates";
import {UploadedFileDto} from "@/types/exam/miscDtos";

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


// Request DTOs
export interface ApprovalRequest {
    objectType: ObjectType;
    objectId: string;
    comment?: string;
}

export interface RejectionRequest {
    objectType: ObjectType;
    objectId: string;
    comment?: string;
    rejectionType: EApprovalStatus;
}

export interface RefereeApprovalRequest {
    objectType: ObjectType;
    objectId: string;
    comment?: string;
    finalDecision: EApprovalStatus;
}

export interface InitializeApprovalRequest {
    objectType: ObjectType;
    objectId: string;
}

// Response DTOs
export interface ApprovalResult {
    objectType: ObjectType;
    objectId: string;
    approvalAdded: boolean;
    objectFullyApproved: boolean;
    approverId: string;
    isRefereeDecision?: boolean;
    finalStatus?: EApprovalStatus;
}

export interface ApprovalInitializationResult {
    objectType: ObjectType;
    objectId: string;
    initialized: boolean;
}

export interface ApprovalStatusResult {
    objectType: ObjectType;
    objectId: string;
    isApproved: boolean;
}

export interface ApprovalHistoryItem {
    approvalId: string;
    approvalStatus: EApprovalStatus;
    approvalType: EApprovalType;
    approverName: string;
    comment?: string;
    createdAt: string;
}

export interface UpdateRequirementsResult {
    updateStarted: boolean;
    message: string;
}

export interface PendingApprovalItem {
    objectType: ObjectType;
    objectId: string;
    objectName: string;
    requiredApprovals: number;
    currentApprovals: number;
    createdAt: string;
}

export interface ApprovalStatistics {
    totalObjects: number;
    approvedObjects: number;
    pendingObjects: number;
    rejectedObjects: number;
    cancelledObjects: number;
}

export interface TemplateUsageInfo {
    templateId: string;
    usageCount: number;
    usedInQuestions: string[];
    canBeDeleted: boolean;
}

export interface CreateCurriculumContentRequest {
    curriculumId: string;
    parentId?: string;
    code: string;
    content: string;
    level: ECurriculumLevel;
    orderNumber?: number;
}

export interface UpdateCurriculumContentRequest {
    code?: string;
    content?: string;
    level?: ECurriculumLevel;
    orderNumber?: number;
}

export interface CurriculumContentSearchRequest {
    curriculumId?: string;
    code?: string;
    content?: string;
    level?: ECurriculumLevel;
}

export interface CurriculumContentStatistics {
    curriculumId: string;
    totalContents: number;
    contentsByLevel: Record<string, number>;
    maxDepth: number;
    rootContents: number;
}


// Request DTOs
export interface CreateCurriculumRequest {
    name: string;
    description?: string;
    category: EExamCategory;
}

export interface UpdateCurriculumRequest {
    name?: string;
    description?: string;
    category?: EExamCategory;
}

export interface CurriculumSearchRequest {
    name?: string;
    description?: string;
    category?: EExamCategory;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
}

// Response DTOs
export interface CurriculumWithContentDto {
    curriculum: CurriculumDto;
    rootContents: CurriculumContentDto[];
    totalContents: number;
}

export interface CurriculumListResponse {
    curricula: CurriculumDto[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
}

export interface CurriculumStatistics {
    curriculumId: string;
    totalContents: number;
    contentsByLevel: Record<string, number>;
    lastModified: string;
    isActive: boolean;
}

export interface CurriculumContentSummary {
    curriculumId: string;
    totalContents: number;
    maxDepth: number;
    rootContents: number;
    contentsByLevel: Record<string, number>;
}



// Response DTOs
export interface ExamPreview {
    examId: string;
    examName: string;
    examLevel: string;
    examType: string;
    description?: string;
    maximumScore: number;
    durationInSeconds: number;
    totalSections: number;
    totalQuestions: number;
    isFinalized: boolean;
    estimatedTime: string;
}

export interface ExamSessionInfo {
    examId: string;
    userId: string;
    sessionId: string;
    startTime: string;
    isActive: boolean;
}

export interface ExamSessionStatus {
    sessionId: string;
    isActive: boolean;
    timeRemaining: number;
    questionsAnswered: number;
    totalQuestions: number;
    currentSectionId?: string;
    currentQuestionId?: string;
}

export interface ExamSessionResult {
    sessionId: string;
    userId: string;
    endTime: string;
    isCompleted: boolean;
    finalScore?: number;
    questionsAnswered: number;
    totalQuestions: number;
}


// Request DTOs
export interface UpdateExamSectionRequest {
    name?: string;
    description?: string;
    orderNumber?: number;
    durationInSeconds?: number;
    maximumScore?: number;
}

// Response DTOs
export interface ExamSectionStatistics {
    sectionId: string;
    totalQuestionGroups: number;
    totalQuestions: number;
    totalScore: number;
    totalDuration: number;
    averageQuestionsPerGroup: number;
    lastModified: string;
}

export interface ExamSectionsSummary {
    examTypeId: string;
    totalSections: number;
    sectionsWithQuestionGroups: number;
    emptySections: number;
    totalQuestionGroups: number;
}


// Request DTOs
export interface CreateExamSessionRequest {
    name: string;
    branchId: string;
    brandId: string;
    examTemplate: EExamType;
    startDate: string;
    endDate?: string;
    capacity?: number;
    description?: string;
}

export interface UpdateExamSessionRequest {
    name?: string;
    startDate?: string;
    endDate?: string;
    capacity?: number;
    description?: string;
}

export interface ExamSessionSearchRequest {
    name?: string;
    branchId?: string;
    brandId?: string;
    examTemplate?: EExamType;
    startDateFrom?: string;
    startDateTo?: string;
    status?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
}

export interface CopySessionRequest {
    newName: string;
    newStartDate: string;
}

export interface UpdateStatusRequest {
    newStatus: string;
    reason?: string;
}

// Response DTOs
export interface ExamSessionListResponse {
    examSessions: ExamSessionDto[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
}

export interface ExamSessionStatistics {
    sessionId: string;
    totalApplications: number;
    approvedApplications: number;
    pendingApplications: number;
    rejectedApplications: number;
    capacityUtilization: number;
    averageScore?: number;
}

export interface SessionDashboard {
    totalSessions: number;
    upcomingSessions: number;
    activeSessions: number;
    completedSessions: number;
    totalApplications: number;
    approvedApplications: number;
    pendingApplications: number;
    averageCapacity: number;
}

export interface SessionApplicationDto {
    applicationId: string;
    applicantName: string;
    applicantEmail: string;
    status: string;
    appliedAt: string;
    notes?: string;
}


// Request DTOs
export interface UpdateExamTypeRequest {
    name?: string;
    examLevel?: string;
    examType?: EExamType;
    description?: string;
    durationInSeconds?: number;
    maximumScore?: number;
    passingScore?: number;
    isActive?: boolean;
}

// Response DTOs
export interface ExamTypeListResponse {
    examTypes: ExamTypeDto[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
}

export interface ExamTypeValidationResult {
    examTypeId: string;
    isValid: boolean;
    canBeFinalized: boolean;
    issues: string[];
    warnings: string[];
    sectionsCount: number;
    questionsCount: number;
    totalScore: number;
}

export interface ExamTypeStatistics {
    examTypeId: string;
    totalSections: number;
    totalQuestionGroups: number;
    totalQuestions: number;
    totalScore: number;
    averageQuestionsPerSection: number;
    isFinalized: boolean;
    lastModified: string;
}

export interface ExamTypeSummary {
    totalExamTypes: number;
    finalizedExamTypes: number;
    draftExamTypes: number;
    activeExamTypes: number;
}


// Request DTOs
export interface UpdateQuestionGroupTypeRequest {
    name?: string;
    level?: EQuestionGroupTemplateLevel;
    groupType?: EQuestionGroupType;
    orderNumber?: number;
    description?: string;
}

export interface QuestionGroupTypeSearchRequest {
    name?: string;
    level?: EQuestionGroupTemplateLevel;
    groupType?: EQuestionGroupType;
    examSectionId?: string;
}

// Response DTOs
export interface QuestionGroupTypeStatistics {
    typeId: string;
    totalQuestionGroups: number;
    totalQuestions: number;
    averageQuestionsPerGroup: number;
    usageCount: number;
}

export interface QuestionGroupTypeTemplate {
    templateId: string;
    name: string;
    level: EQuestionGroupTemplateLevel;
    groupType: EQuestionGroupType;
}

export interface LevelInfo {
    level: EQuestionGroupTemplateLevel;
    displayName: string;
    description: string;
}

export interface GroupTypeInfo {
    groupType: EQuestionGroupType;
    displayName: string;
    description: string;
}

export interface CreateQuestionGroupTypeRequest {

    name: string;
    examSectionId: string;
    orderNumber: number;
    level: EQuestionGroupTemplateLevel;
    groupType: EQuestionGroupType;
}

// Response DTOs
export interface QuestionGroupStatistics {
    questionGroupId: string;
    totalQuestions: number;
    totalHeaders: number;
    totalScore: number;
    averageQuestionScore: number;
    totalDuration: number;
    lastModified: string;
}

export interface QuestionGroupsSummary {
    examSectionId: string;
    totalGroups: number;
    groupsWithQuestions: number;
    emptyGroups: number;
    totalQuestions: number;
    totalMaximumScore: number;
    totalDuration: number;
}

export interface QuestionGroupValidation {
    questionGroupId: string;
    isValid: boolean;
    issues: string[];
    isReady: boolean;
    hasQuestions: boolean;
    hasHeaders: boolean;
}


// Request DTOs
export interface UpdateQuestionOptionRequest {
    orderNumber?: number;
    mediaType?: EMediaType;
    content?: string;
    isTrueOption?: boolean;
}

// Response DTOs
export interface QuestionOptionStatistics {
    questionId: string;
    totalOptions: number;
    correctOptions: number;
    optionsByMediaType: Record<string, number>;
    averageOptionLength: number;
}

export interface QuestionOptionAnalysis {
    questionId: string;
    totalOptions: number;
    correctOptions: number;
    hasCorrectAnswers: boolean;
    isBalanced: boolean;
    qualityScore: number;
    recommendations: string[];
}

export interface QuestionOptionValidation {
    questionId: string;
    isValid: boolean;
    issues: string[];
    hasMinimumOptions: boolean;
    hasCorrectAnswers: boolean;
    isReadyForExam: boolean;
}


// Request DTOs
export interface UpdateQuestionPartRequest {
    orderNumber?: number;
    mediaType?: EMediaType;
    content?: string;
    label?: string;
    maximumScore?: number;
    durationInSeconds?: number;
    repetitionCount?: number;
}

// Response DTOs
export interface QuestionPartStatistics {
    questionId: string;
    totalParts: number;
    partsByMediaType: Record<string, number>;
    totalScore: number;
    totalDuration: number;
    averagePartScore: number;
}

export interface QuestionPartTemplate {
    templateId: string;
    name: string;
    mediaType: EMediaType;
    description: string;
}

export interface QuestionPartPreview {
    partId: string;
    orderNumber: number;
    mediaType: EMediaType;
    content: string;
    label?: string;
    hasScore: boolean;
    hasDuration: boolean;
    isRepeatable: boolean;
}


// Response DTOs
export interface QuestionGroupQuestionStatistics {
    questionGroupId: string;
    totalQuestions: number;
    autoEvaluatedQuestions: number;
    manualEvaluatedQuestions: number;
    questionsWithParts: number;
    questionsWithOptions: number;
    totalMaximumScore: number;
    totalDuration: number;
}

export interface QuestionValidation {
    questionId: string;
    isValid: boolean;
    issues: string[];
    isComplete: boolean;
    hasParts: boolean;
    hasOptions: boolean;
    hasCorrectAnswers: boolean;
    isReadyForExam: boolean;
}


// Request DTOs
export interface UpdateFileMetadataRequest {
    fileName?: string;
    documentType?: EMediaType;
    description?: string;
}

export interface UploadedFileSearchRequest {
    fileName?: string;
    documentType?: EMediaType;
    minFileSize?: number;
    maxFileSize?: number;
    uploadedAfter?: string;
    uploadedBefore?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
}

// Response DTOs
export interface BulkUploadResult {
    successfulUploads: UploadedFileDto[];
    failedUploads: string[];
    totalFiles: number;
    successCount: number;
    failureCount: number;
}

export interface FileContentResponse {
    content: ArrayBuffer;
    fileName: string;
    contentType: string;
    fileSize: number;
}

export interface FileContentDto {
    base64Content: string;
    contentType: string;
    fileName: string;
    fileSize: number;
}

export interface UploadedFileListResponse {
    files: UploadedFileDto[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
}

export interface FileStatistics {
    totalFiles: number;
    totalSizeBytes: number;
    filesByType: Record<string, number>;
    averageFileSize: number;
    largestFile: number;
    smallestFile: number;
}

export interface CleanupResult {
    orphanedFilesFound: number;
    orphanedFilesDeleted: number;
    spaceSavedBytes: number;
    errors: string[];
}

// Request interfaces
export interface AuditLogSearchParams {
    userId?: string;
    httpMethod?: string;
    resourceType?: string;
    responseStatus?: number;
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

export interface ActivityStatsParams {
    startDate?: string; // ISO date string (YYYY-MM-DD)
    endDate?: string; // ISO date string (YYYY-MM-DD)
}

// Response interfaces
export interface ActivityStatItem {
    resourceType: string;
    httpMethod: string;
    count: number;
}


