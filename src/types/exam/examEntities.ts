// examEntities.ts

import {ExamSectionDto, ExamTypeDto, QuestionGroupTypeDto} from "@/types/exam/examTemplates";
import {
    EApprovalStatus,
    ECurriculumLevel,
    EExamCategory,
    EExamType,
    EMediaType,
    EQuestionType
} from "@/types/exam/enum";
import {BranchDto, BrandDto} from "@/types/brand";
import {UserDto} from "@/types/auth";
import {DatabaseObjectDto} from "@/types/exam/miscDtos";



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

export interface ExamSessionDto extends DatabaseObjectDto {
    name: string;
    description: string;
    quota: number;
    startDate: Date; // veya string (ISO date string olarak kullanmak isterseniz)
    examTemplate: EExamType;
    branch: BranchDto;
    brand: BrandDto;
    supervisors: UserDto[];
}

export interface CreateExamSectionRequest {
    name: string;
    examTypeId: string;
    orderNumber: number;
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

