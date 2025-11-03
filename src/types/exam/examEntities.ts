// examEntities.ts

import {ExamSectionDto, ExamTypeDto, QuestionGroupTypeDto} from "@/types/exam/examTemplates";
import {
    EApplicationUpdateState,
    EApprovalStatus,
    ECurriculumLevel, EDifficulty,
    EExamCategory,
    EExamType,
    EMediaType,
    EQuestionType, ESessionState
} from "@/types/exam/enum";
import {ApplicationDto, BranchDto, BrandDto} from "@/types/management/brand";
import {EEvaluationStatus, UserDto} from "@/types/auth";
import {DatabaseObjectDto} from "@/types/exam/miscDtos";
import {
    AudioResponseTemplateDto,
    BaseQuestionTemplateDto, DragAndDropTemplateDto, EssayTemplateDto,
    FillInTheBlanksTemplateDto, HotSpotTemplateDto, ImageResponseTemplateDto, MatchingTemplateDto,
    MultipleChoiceTemplateDto, MultipleResponseTemplateDto, OrderingTemplateDto, ShortAnswerTemplateDto,
    TrueFalseTemplateDto, VideoResponseTemplateDto
} from "@/types/exam/questionTemplates";
import {RecordType} from "@/types/ui/table";


export interface BaseQuestionTemplateFormData {
    title: string;
    description?: string;
    subject: string;
    difficulty: EDifficulty;
    points: number;
    timeLimit: number;
    instructions?: string;
    tags: string[];
    isActive: boolean;
    questionType: EQuestionType | '';
    // Template specific data
    templateData?: MultipleChoiceTemplateDto | TrueFalseTemplateDto |
        FillInTheBlanksTemplateDto | ShortAnswerTemplateDto |
        MatchingTemplateDto | EssayTemplateDto | OrderingTemplateDto | MultipleResponseTemplateDto |
        HotSpotTemplateDto | DragAndDropTemplateDto | AudioResponseTemplateDto | VideoResponseTemplateDto | ImageResponseTemplateDto | null;
}


export type QuestionTemplateType =
    | MultipleChoiceTemplateDto
    | TrueFalseTemplateDto
    | FillInTheBlanksTemplateDto
    | ShortAnswerTemplateDto
    | MatchingTemplateDto
    | EssayTemplateDto
    | OrderingTemplateDto
    | MultipleResponseTemplateDto
    | HotSpotTemplateDto
    | DragAndDropTemplateDto
    | AudioResponseTemplateDto
    | VideoResponseTemplateDto
    | ImageResponseTemplateDto;





export interface EvaluationGroupData extends RecordType{
    question: QuestionDto;
    evaluation: EvaluationDto;
}
export interface EvaluationGroup extends RecordType{
    data: EvaluationGroupData[];
    application: ApplicationDto;
}






export type QuestionDto = DatabaseObjectDto & {
    name?: string;
    questionGroup?: QuestionGroupDto;
    questionType?: EQuestionType; // Example enum values
    orderNumber?: number;
    isAutomaticallyEvaluated?: boolean;
    maximumScore?: number;
    durationInSeconds?: number;
    questionTemplate?: BaseQuestionTemplateDto;
    approvalStatus?: EApprovalStatus; // Example enum values
    currentApprovalCount?: number;
    requiredApprovalCount?: number;
    approvalCompletedDate?: string;
}

export type QuestionGroupDto = DatabaseObjectDto & {
    name?: string;
    examType?: ExamTypeDto | null;
    examSection?: ExamSectionDto | null;
    questionGroupType?: QuestionGroupTypeDto | null;
    maximumScore?: number;
    durationInSeconds?: number;
    approvalStatus?: EApprovalStatus; // Example enum values
    currentApprovalCount?: number;
    requiredApprovalCount?: number;
    approvalCompletedDate?: string;
    questions?: QuestionDto[];
    headers?: QuestionGroupHeaderDto[];
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

export interface CreateExamTypeRequest {
    name: string;
    examLevel: string;
    examType: EExamType;
    infoScreen: string;
    description: string;
    isOrder: boolean;
    isShowEvaluation: boolean;
    isGraded: boolean;
    screenRecordTime: number;
    maximumScore: number;
    durationInSeconds: number;
}

export interface ExamTypeSearchRequest {
    name?: string;
    examLevel?: string;
    examType?: EExamType;
    isFinalized?: boolean;
    isActive?: boolean;

    // Pagination
    page?: number; // default: 0
    size?: number; // default: 20

    // Sorting
    sortBy?: string; // default: "name"
    sortDirection?: "ASC" | "DESC"; // default: "ASC"
}


export interface ExamDto extends DatabaseObjectDto {
    name: string;
    code: string;
    examType: ExamTypeDto;
    questionGroups: QuestionGroupDto[];
    branch: BranchDto;
    brand: BrandDto;
}


export interface ExamSessionDto extends DatabaseObjectDto {
    name: string;
    description: string;
    quota: number;
    startDate: Date; // veya string (ISO date string olarak kullanmak isterseniz)
    examTemplate: EExamType;
    branch: BranchDto;
    brand: BrandDto;
    examType: ExamTypeDto;
    supervisors: UserDto[];
    beginAt: string
    endAt: string
    sessionState: ESessionState;
}

export interface CreateExamSectionRequest {
    name: string;
    examTypeId: string;
    orderNumber: number;
}


export interface UpdateApplicationState {
    state: EApplicationUpdateState;
    description?: string;
    userId?: string;
}


// ExamReadinessValidation ve nested types
export interface ReadinessIssue {
    severity: string;
    component: string;
    componentId: string;
    message: string;
}

export interface ExamReadinessValidation {
    isReady: boolean;
    issues: ReadinessIssue[];
}

export interface GroupNavigation {
    groupId: string;
    groupName: string;
    questionCount: number;
}

export interface SectionNavigation {
    sectionId: string;
    sectionName: string;
    orderNumber: number;
    questionGroups: GroupNavigation[];
}

export interface ExamNavigationDto {
    examId: string;
    examName: string;
    sections: SectionNavigation[];
}

export interface AuditLog {
    id: number;
    userId: string;
    userName: string;
    httpMethod: string; // GET, POST, PUT, DELETE
    requestUri: string; // /api/users/123
    endpointDescription: string; // "Create User", "Update Product"
    resourceType: string; // User, Product, Order (URI'den çıkarılır)
    resourceId: string; // Path variable'dan çıkarılır
    ipAddress: string;
    userAgent: string;
    requestParams: string; // Query parameters
    responseStatus: number; // 200, 404, 500, etc.
    executionTimeMs: number;
    timestamp: Date; // veya string (ISO date string olarak kullanmak isterseniz)
    status: string; // SUCCESS, FAILED
    errorMessage: string;
    sessionId: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}


export interface CreateExamRequest {
    name: string;
    code: string;
    examTypeId: string;
    questionGroupIds: string[];
    branchId: string;
    brandId: string;
}

export interface UpdateExamRequest {
    name: string;
    code: string;
    examTypeId: string;
    questionGroupIds: string[];
    branchId: string;
    brandId: string;
}

export interface ExamFormData extends DatabaseObjectDto {
    name: string;
    code: string;
    examTypeId: string;
    questionGroupIds: string[];
    branchId: string;
    brandId: string;
}

export interface ExamSearchRequest {
    name?: string;
    code?: string;
    examTypeId?: string;
    questionGroupIds?: string[];
    branchId?: string;
    brandId?: string;
}

export interface ExamStatistics {
    examId: string;
    totalQuestionGroups: number;
    totalQuestions: number;
    hasQuestionGroups: boolean;
}

export interface ExamSummary {
    exam: ExamDto;
    statistics: ExamStatistics;
}

// Filter and sorting interfaces
export interface ExamFilter {
    name?: string;
    code?: string;
    examTypeName?: string;
    branchName?: string;
    brandName?: string;
    status?: string;
}

export interface ExamSort {
    field: 'name' | 'code' | 'createdAt' | 'examType' | 'branch' | 'brand';
    direction: 'asc' | 'desc';
}

// Pagination interface
export interface ExamPageRequest {
    page: number;
    size: number;
    sort?: ExamSort;
    filter?: ExamFilter;
}

// Bulk operations
export interface BulkExamCreateRequest {
    exams: CreateExamRequest[];
}

export interface BulkExamResponse {
    successful: ExamDto[];
    failed: BulkExamError[];
    totalProcessed: number;
    successCount: number;
    failureCount: number;
}

export interface BulkExamError {
    exam: CreateExamRequest;
    error: string;
    index: number;
}

// Copy and move operations
export interface CopyExamRequest {
    newName: string;
    newCode: string;
    targetBranchId?: string;
    targetBrandId?: string;
    copyQuestionGroups: boolean;
}

export interface MoveExamRequest {
    targetBranchId: string;
    targetBrandId: string;
}

// Dashboard and reporting
export interface ExamDashboardData {
    totalExams: number;
    examsByBrand: ExamCountByBrand[];
    examsByBranch: ExamCountByBranch[];
    examsByType: ExamCountByType[];
    recentExams: ExamDto[];
}

export interface ExamCountByBrand {
    brandId: string;
    brandName: string;
    examCount: number;
    percentage: number;
}

export interface ExamCountByBranch {
    branchId: string;
    branchName: string;
    examCount: number;
    percentage: number;
}

export interface ExamCountByType {
    examTypeId: string;
    examTypeName: string;
    examCount: number;
    percentage: number;
}

// Validation interfaces
export interface ExamValidationResult {
    isValid: boolean;
    errors: ExamValidationError[];
    warnings: ExamValidationWarning[];
}

export interface ExamValidationError {
    field: string;
    message: string;
    code: string;
}

export interface ExamValidationWarning {
    field: string;
    message: string;
    code: string;
}

// Export interfaces
export interface ExamExportRequest {
    format: 'json' | 'csv' | 'excel';
    filters?: ExamFilter;
    includeQuestionGroups: boolean;
    includeStatistics: boolean;
}

export interface ExamImportRequest {
    file: File;
    format: 'json' | 'csv' | 'excel';
    validateOnly: boolean;
    overwriteExisting: boolean;
}

export interface ExamImportResult {
    totalRecords: number;
    successCount: number;
    failureCount: number;
    warnings: string[];
    errors: ExamImportError[];
    importedExams: ExamDto[];
}

export interface ExamImportError {
    row: number;
    field: string;
    value: string;
    error: string;
}


//ceyhun
export interface QuestionAnswerRequest {
    applicationId: string;
    questionId: string;
    answer: string;
    mediaType: EMediaType;
    questionType: EQuestionType;
    evaluationId: string;
    isEmptyAnswer: boolean;
}





export type EvaluationDto = DatabaseObjectDto & {

    id: string;
    createdAt: string;
    deletedAt?: string;
    status: string;
    createdById?: string;
    deletedById?: string;


    questionId: string;
    applicationId: string;
    graderId?: string;
    answer?: string;
    isEmptyAnswer?: string;
    correctAnswer?: string;
    answerDescription?: string;
    score?: number;
    description?: string;
    evaluationStatus?: EEvaluationStatus;
    mediaType?: EMediaType;
    evaluationAt: string;
    repeatNumber?: number;
    isOpen?: boolean;
    isEvaluatedAutomatically?: boolean;


}
