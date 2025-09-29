
import {ExamSectionDto, ExamTypeDto, QuestionGroupTypeDto} from "@/types/exam/examTemplates";
import {
EApprovalStatus,
ECurriculumLevel,
EExamCategory,
EExamType,
EMediaType,
EQuestionType
} from "@/types/exam/enum";
import {BranchDto, BrandDto} from "@/types/management/brand";
import {UserDto} from "@/types/auth";
import {DatabaseObjectDto} from "@/types/exam/miscDtos";
import {
AudioResponseTemplateDto,
BaseQuestionTemplateDto, DragAndDropTemplateDto, EssayTemplateDto,
FillInTheBlanksTemplateDto, HotSpotTemplateDto, ImageResponseTemplateDto, MatchingTemplateDto,
MultipleChoiceTemplateDto, MultipleResponseTemplateDto, OrderingTemplateDto, ShortAnswerTemplateDto,
TrueFalseTemplateDto, VideoResponseTemplateDto
} from "@/types/exam/questionTemplates";



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



export type QuestionDto = DatabaseObjectDto & {
name?: string;
questionGroup?: QuestionGroupDto;
questionType?: EQuestionType;
orderNumber?: number;
isAutomaticallyEvaluated?: boolean;
maximumScore?: number;
durationInSeconds?: number;
questionTemplate?: BaseQuestionTemplateDto;
approvalStatus?: EApprovalStatus; 
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
approvalStatus?: EApprovalStatus; 
currentApprovalCount?: number;
requiredApprovalCount?: number;
approvalCompletedDate?: string;
questions?: QuestionDto[];
headers?: QuestionGroupHeaderDto[];
}

export type QuestionGroupHeaderDto = DatabaseObjectDto & {
questionGroup?: QuestionGroupDto;
orderNumber?: number;
mediaType?: EMediaType; 
content?: string;
approvalStatus?: EApprovalStatus; 
currentApprovalCount?: number;
requiredApprovalCount?: number;
approvalCompletedDate?: string;
}

export type QuestionOptionDto = DatabaseObjectDto & {
question?: QuestionDto;
orderNumber?: number;
mediaType?: EMediaType; 
content?: string;
baseContent?: string;
isTrueOption?: boolean;
}

export type QuestionPartDto = DatabaseObjectDto & {
orderNumber?: number;
mediaType?: EMediaType; 
content?: string;
question?: QuestionDto;
label?: string;
maximumScore?: number;
durationInSeconds?: number;
repetitionCount?: number;
approvalStatus?: EApprovalStatus; 
currentApprovalCount?: number;
requiredApprovalCount?: number;
approvalCompletedDate?: string;
}

export type CurriculumDto = DatabaseObjectDto & {
name?: string;
description?: string;
category?: EExamCategory; 
updatedAt?: string;
version?: number;
approvalStatus?: EApprovalStatus; 
currentApprovalCount?: number;
requiredApprovalCount?: number;
approvalCompletedDate?: string;
}

export type CurriculumContentDto = DatabaseObjectDto & {
code?: string;
curriculum?: CurriculumDto;
level?: ECurriculumLevel; 
content?: string;
orderNumber?: number;
parent?: CurriculumContentDto;
parentId?: string;
children?: CurriculumContentDto[];
updatedAt?: string;
version?: number;
approvalStatus?: EApprovalStatus; 
currentApprovalCount?: number;
requiredApprovalCount?: number;
approvalCompletedDate?: string;
}

export type QuestionSearchRequest = {
name?: string;
questionType?: EQuestionType; 
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
startDate: Date; 
examTemplate: EExamType;
branch: BranchDto;
brand: BrandDto;
examType: ExamTypeDto;
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
resourceType: string; // User, Product, Order (URI'den Ã§Ä±karÄ±lÄ±r)
resourceId: string; // Path variable'dan Ã§Ä±karÄ±lÄ±r
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

export interface ExamFormData extends DatabaseObjectDto{
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


import {EApprovalStatus, EExamType, EQuestionGroupTemplateLevel, EQuestionGroupType} from "@/types/exam/enum";
import {DatabaseObjectDto} from "@/types/exam/miscDtos";



export type ExamTypeDto = DatabaseObjectDto & {
name?: string;
examLevel?: string;
examType?: EExamType; 
infoScreen?: string;
description?: string;
isOrder?: boolean;
isShowEvaluation?: boolean;
isFinalized?: boolean;
isGraded?: boolean;
screenRecordTime?: number;
maximumScore?: number;
durationInSeconds?: number;
questionGroupTypes?: QuestionGroupTypeDto[];
}

export type QuestionGroupTypeDto = DatabaseObjectDto & {
name?: string;
orderNumber?: number;
level?: EQuestionGroupTemplateLevel; 
examSection?: ExamSectionDto;
groupType?: EQuestionGroupType; 
approvalStatus?: EApprovalStatus; 
currentApprovalCount?: number;
requiredApprovalCount?: number;
approvalCompletedDate?: string;
}

export interface ExamSectionDto extends DatabaseObjectDto {
name?: string;
examType?: ExamTypeDto;
orderNumber?: number;
}


import { useState, useCallback } from 'react';

import {
ExamDto,
ExamFormData,
ExamStatistics,
ExamSummary,
ExamSearchRequest,
ExamDashboardData,
ExamValidationResult,
CopyExamRequest,
MoveExamRequest
} from '@/types/exam/examEntities';
import { showNotification } from '@/lib/notification';
import {examService} from "@/services/api/exam/exam-service";

interface UseExamReturn {
exams: ExamDto[] | null;
selectedExam: ExamDto | null;
examStatistics: ExamStatistics | null;
examSummary: ExamSummary | null;
examDashboard: ExamDashboardData | null;
validationResult: ExamValidationResult | null;
loading: boolean;
error: Error | null;
createExam: (createRequest: ExamFormData) => Promise<void>;
updateExam: (updateRequest: ExamFormData) => Promise<void>;
getExamById: (id: string) => Promise<void>;
getExamByCode: (code: string) => Promise<void>;
getAllExams: () => Promise<void>;
searchExams: (searchRequest: ExamSearchRequest) => Promise<void>;
searchExamsByName: (name: string) => Promise<void>;
getExamsByBrand: (brandId: string) => Promise<void>;
getExamsByBranch: (branchId: string) => Promise<void>;
getExamsByExamType: (examTypeId: string) => Promise<void>;
deleteExam: (id: string) => Promise<void>;
bulkCreateExams: (createRequests: ExamFormData[]) => Promise<void>;
copyExam: (examId: string, copyRequest: CopyExamRequest) => Promise<void>;
moveExam: (examId: string, moveRequest: MoveExamRequest) => Promise<void>;
duplicateExam: (examId: string, newName: string, newCode: string) => Promise<void>;
getExamStatistics: (id: string) => Promise<void>;
getExamSummary: (id: string) => Promise<void>;
getExamDashboard: () => Promise<void>;
validateExam: (examData: ExamFormData) => Promise<void>;
checkCodeAvailability: (code: string, excludeId?: string) => Promise<boolean>;
checkNameAvailability: (name: string, excludeId?: string) => Promise<boolean>;
activateExam: (id: string) => Promise<void>;
deactivateExam: (id: string) => Promise<void>;
archiveExam: (id: string) => Promise<void>;
restoreExam: (id: string) => Promise<void>;
clearExamData: () => void;
}

export const useExam = (): UseExamReturn => {
const [exams, setExams] = useState<ExamDto[] | null>(null);
const [selectedExam, setSelectedExam] = useState<ExamDto | null>(null);
const [examStatistics, setExamStatistics] = useState<ExamStatistics | null>(null);
const [examSummary, setExamSummary] = useState<ExamSummary | null>(null);
const [examDashboard, setExamDashboard] = useState<ExamDashboardData | null>(null);
const [validationResult, setValidationResult] = useState<ExamValidationResult | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createExam = useCallback(async (createRequest: ExamFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.createExam(createRequest);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('SÄ±nav baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExam = useCallback(async (updateRequest: ExamFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.updateExam(updateRequest.id!, updateRequest);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('SÄ±nav baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamById(id);
            if (response.data && response.success) {
                setSelectedExam(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamByCode = useCallback(async (code: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamByCode(code);
            if (response.data && response.success) {
                setSelectedExam(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav kod ile alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllExams = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getAllExams();
            if (response.data && response.success) {
                setExams(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±navlar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchExams = useCallback(async (searchRequest: ExamSearchRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.searchExams(searchRequest);
            if (response.data && response.success) {
                setExams(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav arama yapÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchExamsByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.searchExamsByName(name);
            if (response.data && response.success) {
                setExams(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav isim arama yapÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamsByBrand = useCallback(async (brandId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamsByBrand(brandId);
            if (response.data && response.success) {
                setExams(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('Marka sÄ±navlarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamsByBranch = useCallback(async (branchId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamsByBranch(branchId);
            if (response.data && response.success) {
                setExams(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('Åžube sÄ±navlarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamsByExamType = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamsByExamType(examTypeId);
            if (response.data && response.success) {
                setExams(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav tipi sÄ±navlarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteExam = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.deleteExam(id);
            if (response.success) {
                showNotification.success('SÄ±nav baÅŸarÄ±yla silindi!');
                // Remove from local state if exists
                if (exams) {
                    setExams(exams.filter(exam => exam.id !== id));
                }
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, [exams]);

    const bulkCreateExams = useCallback(async (createRequests: ExamFormData[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.bulkCreateExams(createRequests);
            if (response.data && response.success) {
                setExams(response.data);
                showNotification.success('SÄ±navlar baÅŸarÄ±yla toplu oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±navlar toplu oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyExam = useCallback(async (examId: string, copyRequest: CopyExamRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.copyExam(examId, copyRequest);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('SÄ±nav baÅŸarÄ±yla kopyalandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav kopyalanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const moveExam = useCallback(async (examId: string, moveRequest: MoveExamRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.moveExam(examId, moveRequest);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('SÄ±nav baÅŸarÄ±yla taÅŸÄ±ndÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav taÅŸÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const duplicateExam = useCallback(async (examId: string, newName: string, newCode: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.duplicateExam(examId, newName, newCode);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('SÄ±nav baÅŸarÄ±yla Ã§oÄŸaltÄ±ldÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav Ã§oÄŸaltÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamStatistics(id);
            if (response.data && response.success) {
                setExamStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSummary = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamSummary(id);
            if (response.data && response.success) {
                setExamSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav Ã¶zeti alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.getExamDashboard();
            if (response.data && response.success) {
                setExamDashboard(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav dashboard alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateExam = useCallback(async (examData: ExamFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.validateExam(examData);
            if (response.data && response.success) {
                setValidationResult(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav doÄŸrulanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const checkCodeAvailability = useCallback(async (code: string, excludeId?: string): Promise<boolean> => {
        try {
            const response = await examService.checkExamCodeAvailability(code, excludeId);
            return response.data || false;
        } catch (err) {
            console.log(err);
            showNotification.error('Kod kontrolÃ¼ yapÄ±lÄ±rken bir hata oluÅŸtu!');
            return false;
        }
    }, []);

    const checkNameAvailability = useCallback(async (name: string, excludeId?: string): Promise<boolean> => {
        try {
            const response = await examService.checkExamNameAvailability(name, excludeId);
            return response.data || false;
        } catch (err) {
            console.log(err);
            showNotification.error('Ä°sim kontrolÃ¼ yapÄ±lÄ±rken bir hata oluÅŸtu!');
            return false;
        }
    }, []);

    const activateExam = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.activateExam(id);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('SÄ±nav baÅŸarÄ±yla aktif edildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav aktif edilirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deactivateExam = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.deactivateExam(id);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('SÄ±nav baÅŸarÄ±yla pasif edildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav pasif edilirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const archiveExam = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.archiveExam(id);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('SÄ±nav baÅŸarÄ±yla arÅŸivlendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav arÅŸivlenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const restoreExam = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examService.restoreExam(id);
            if (response.data && response.success) {
                setSelectedExam(response.data);
                showNotification.success('SÄ±nav baÅŸarÄ±yla geri yÃ¼klendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluÅŸtu'));
            showNotification.error('SÄ±nav geri yÃ¼klenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearExamData = useCallback(() => {
        setExams(null);
        setSelectedExam(null);
        setExamStatistics(null);
        setExamSummary(null);
        setExamDashboard(null);
        setValidationResult(null);
        setError(null);
    }, []);

    return {
        exams,
        selectedExam,
        examStatistics,
        examSummary,
        examDashboard,
        validationResult,
        loading,
        error,
        createExam,
        updateExam,
        getExamById,
        getExamByCode,
        getAllExams,
        searchExams,
        searchExamsByName,
        getExamsByBrand,
        getExamsByBranch,
        getExamsByExamType,
        deleteExam,
        bulkCreateExams,
        copyExam,
        moveExam,
        duplicateExam,
        getExamStatistics,
        getExamSummary,
        getExamDashboard,
        validateExam,
        checkCodeAvailability,
        checkNameAvailability,
        activateExam,
        deactivateExam,
        archiveExam,
        restoreExam,
        clearExamData
    };
};


import { useState, useCallback } from 'react';
import {
UpdateFileMetadataRequest,
UploadedFileSearchRequest,
BulkUploadResult,
FileContentDto,
UploadedFileListResponse,
FileStatistics,
CleanupResult,
} from '@/types/exam/examResponses';;
import { showNotification } from '@/lib/notification';
import {UploadedFileDto} from "@/types/exam/miscDtos";
import {EMediaType} from "@/types/exam/enum";
import { uploadedFileService } from "@/services/api/exam/upload-file-service";

interface UseUploadedFileReturn {
uploadedFiles: UploadedFileListResponse | null;
selectedFile: UploadedFileDto | null;
bulkUploadResult: BulkUploadResult | null;
fileContent: FileContentDto | null;
fileStatistics: FileStatistics | null;
cleanupResult: CleanupResult | null;
loading: boolean;
error: Error | null;
uploadFile: (file: File, documentType?: EMediaType) => Promise<void>;
uploadMultipleFiles: (files: File[], documentType?: EMediaType) => Promise<void>;
getUploadedFileById: (id: string) => Promise<void>;
downloadFile: (id: string) => Promise<Blob | null>;
getFileContent: (id: string) => Promise<void>;
getUploadedFiles: (searchRequest?: UploadedFileSearchRequest) => Promise<void>;
updateFileMetadata: (id: string, updateRequest: UpdateFileMetadataRequest) => Promise<void>;
deleteUploadedFile: (id: string) => Promise<void>;
getFileStatistics: () => Promise<void>;
cleanupOrphanedFiles: () => Promise<void>;
clearFileData: () => void;
}

export const useUploadedFile = (): UseUploadedFileReturn => {
const [uploadedFiles, setUploadedFiles] = useState<UploadedFileListResponse | null>(null);
const [selectedFile, setSelectedFile] = useState<UploadedFileDto | null>(null);
const [bulkUploadResult, setBulkUploadResult] = useState<BulkUploadResult | null>(null);
const [fileContent, setFileContent] = useState<FileContentDto | null>(null);
const [fileStatistics, setFileStatistics] = useState<FileStatistics | null>(null);
const [cleanupResult, setCleanupResult] = useState<CleanupResult | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const uploadFile = useCallback(async (file: File, documentType?: EMediaType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.uploadFile(file, documentType);
            if (response.data && response.success) {
                setSelectedFile(response.data);
                showNotification.success('Dosya baÅŸarÄ±yla yÃ¼klendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya yÃ¼klenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const uploadMultipleFiles = useCallback(async (files: File[], documentType?: EMediaType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.uploadMultipleFiles(files, documentType);
            if (response.data && response.success) {
                setBulkUploadResult(response.data);
                showNotification.success(`${response.data.successCount} dosya baÅŸarÄ±yla yÃ¼klendi!`);
                if (response.data.failureCount > 0) {
                    showNotification.warning(`${response.data.failureCount} dosya yÃ¼klenemedi!`);
                }
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosyalar yÃ¼klenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUploadedFileById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.getUploadedFileById(id);
            if (response.data && response.success) {
                setSelectedFile(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya bilgileri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const downloadFile = useCallback(async (id: string): Promise<Blob | null> => {
        try {
            setLoading(true);
            setError(null);
            const blob = await uploadedFileService.downloadFile(id);
            showNotification.success('Dosya indiriliyor...');
            return blob;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya indirilirken bir hata oluÅŸtu!');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getFileContent = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.getFileContent(id);
            if (response.data && response.success) {
                setFileContent(response.data as unknown as FileContentDto);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya iÃ§eriÄŸi alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUploadedFiles = useCallback(async (searchRequest: UploadedFileSearchRequest = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.getUploadedFiles(searchRequest);
            if (response.data && response.success) {
                setUploadedFiles(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosyalar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateFileMetadata = useCallback(async (id: string, updateRequest: UpdateFileMetadataRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.updateFileMetadata(id, updateRequest);
            if (response.data && response.success) {
                setSelectedFile(response.data);
                showNotification.success('Dosya bilgileri baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya bilgileri gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteUploadedFile = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.deleteUploadedFile(id);
            if (response.data && response.success) {
                showNotification.success('Dosya baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getFileStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.getFileStatistics();
            if (response.data && response.success) {
                setFileStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const cleanupOrphanedFiles = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.cleanupOrphanedFiles();
            if (response.data && response.success) {
                setCleanupResult(response.data);
                showNotification.success(`${response.data.orphanedFilesDeleted} dosya temizlendi!`);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya temizliÄŸi yapÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearFileData = useCallback(() => {
        setUploadedFiles(null);
        setSelectedFile(null);
        setBulkUploadResult(null);
        setFileContent(null);
        setFileStatistics(null);
        setCleanupResult(null);
        setError(null);
    }, []);

    return {
        uploadedFiles,
        selectedFile,
        bulkUploadResult,
        fileContent,
        fileStatistics,
        cleanupResult,
        loading,
        error,
        uploadFile,
        uploadMultipleFiles,
        getUploadedFileById,
        downloadFile,
        getFileContent,
        getUploadedFiles,
        updateFileMetadata,
        deleteUploadedFile,
        getFileStatistics,
        cleanupOrphanedFiles,
        clearFileData
    };
};



// examRequests.ts

import {EMediaType, EQuestionGroupType, EQuestionType} from "@/types/exam/enum";
import {QuestionTemplateType} from "@/types/exam/examEntities";

export type CreateQuestionGroupRequest = {
name: string;
examTypeId: string;
examSectionId: string;
questionGroupTypeId: string;
maximumScore?: number;
durationInSeconds?: number;
headers?: CreateQuestionGroupHeaderRequest[];
}

export type CreateQuestionRequest = {
name: string;
questionGroupId: string;
questionType: EQuestionType; 
orderNumber?: number;
isAutomaticallyEvaluated?: boolean;
maximumScore?: number;
durationInSeconds?: number;
questionTemplate?: QuestionTemplateType | null;
parts?: CreateQuestionPartRequest[];
options?: CreateQuestionOptionRequest[];
}

export type CreateQuestionGroupHeaderRequest = {
orderNumber: number;
mediaType?: EMediaType; 
content: string;
}

export type CreateQuestionOptionRequest = {
orderNumber: number;
mediaType?: EMediaType; 
content: string;
baseContent?: string;
isTrueOption: boolean;
}

export type CreateQuestionPartRequest = {
orderNumber: number;
mediaType?: EMediaType; 
content?: string;
label?: string;
maximumScore?: number;
durationInSeconds?: number;
repetitionCount?: number;
}

export type CreateQuestionTemplateRequest = {
title: string;
description?: string;
subject: string;
difficulty: 'EASY' | 'MEDIUM' | 'HARD';
points: number;
timeLimit: number;
instructions?: string;
tags?: string[];
questionType: EQuestionGroupType; 
templateData: string; // Using `any` because the type is generic `Object`
}

export type UpdateQuestionTemplateRequest = {
id: string;
title?: string;
description?: string;
subject?: string;
difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
points?: number;
timeLimit?: number;
instructions?: string;
tags?: string[];
isActive?: boolean;
templateData?: string; // Using `any` because the type is generic `Object`
}



// types/management/brandTypes.ts


import {DatabaseObjectDto} from "@/types/exam/miscDtos";
import {ExamSessionDto} from "@/types/exam/examEntities";


export type BrandDto = DatabaseObjectDto & {
id: string;
createdAt: string;
deletedAt?: string;
status: string;
createdById?: string;
deletedById?: string;
name: string;
code: string;
description?: string;
logo?: string;
website?: string;
email?: string;
phone?: string;
address?: string;
taxNumber?: string;
taxOffice?: string;
}



export interface Brand {
id: string;
createdAt: string;
deletedAt?: string;
status: string;
createdById?: string;
deletedById?: string;
name: string;
code: string;
description?: string;
logo?: string;
website?: string;
email?: string;
phone?: string;
address?: string;
taxNumber?: string;
taxOffice?: string;
}

export interface BrandFormData extends DatabaseObjectDto {
name: string;
code: string;
description?: string;
logo?: string;
website?: string;
email?: string;
phone?: string;
address?: string;
taxNumber?: string;
taxOffice?: string;
}


export interface BrandStatistics {
brandId: string;
totalBranches: number;
hasBranches: boolean;
}

export interface BrandSummary {
brand: BrandDto;
statistics: BrandStatistics;
}

// types/management/branchTypes.ts
export type BranchDto = DatabaseObjectDto & {
id: string;
createdAt: string;
deletedAt?: string;
status: string;
createdById?: string;
deletedById?: string;
branchName: string;
code: string;
brandId: string;
}
export interface BranchFormData extends DatabaseObjectDto {
branchName: string;
code: string;
brandId: string;
}



export interface BranchStatistics {
branchId: string;
brandId: string;
brandName: string;
}

export interface BrandBranchesSummary {
brandId: string;
totalBranches: number;
branches: BranchDto[];
}

export interface CopyBranchRequest {
targetBrandId: string;
}

export interface MoveBranchRequest {
targetBrandId: string;
}

// types/application/applicationTypes.ts
export type ApplicationDto = DatabaseObjectDto & {

    id: string;
    createdAt: string;
    deletedAt?: string;
    status: string;
    createdById?: string;
    deletedById?: string;
    name: string;
    code: string;
    examId: string;
    examName?: string;
    examSessionId: string;
    examSessionName?: string;
    candidateId: string;
    candidateName?: string;
    candidateLastName?: string;
    candidateIdentityNumber?: string;
    username: string;
    startedAt?: string;
    endedAt?: string;
    isCompleted: boolean;
    isEvaluated: boolean;
    password?: string;
}

export interface ApplicationFormData extends DatabaseObjectDto {
name: string;
code: string;
examId: string;
examSessionId: string;
candidateId: string;
username?: string;
}



export interface StartApplicationRequest {
applicationId: string;
startedAt?: string;
}

export interface CompleteApplicationRequest {
applicationId: string;
endedAt?: string;
}

export interface BulkCreateApplicationRequest {
examSessionId: string;
examId: string;
candidateIds: string[];
namePrefix?: string;
codePrefix?: string;
}

export interface ApplicationStatistics {
examSessionId: string;
totalApplications: number;
completedApplications: number;
pendingApplications: number;
completionRate: number;
}

export interface ExamSessionApplicationsSummary {
examSessionId: string;
applications: ApplicationDto[];
statistics: ApplicationStatistics;
}

export interface ApplicationSearchParams {
name?: string;
examSessionId?: string;
candidateId?: string;
isCompleted?: boolean;
isEvaluated?: boolean;
}

// types/application/applicationGraderTypes.ts
export type ApplicationGraderDto = DatabaseObjectDto & {
id: string;
createdAt: string;
deletedAt?: string;
status: string;
createdById?: string;
deletedById?: string;
userId: string;
userName?: string;
userLastName?: string;
applicationId: string;
applicationName?: string;
endEndDate?: string;
isCompleted: boolean;
orderNumber: number;
isReferee: boolean;
}

export interface CreateApplicationGraderRequest {
userId: string;
applicationId: string;
endEndDate?: string;
orderNumber: number;
isReferee?: boolean;
}

export interface UpdateApplicationGraderRequest {
endEndDate?: string;
isCompleted?: boolean;
orderNumber?: number;
isReferee?: boolean;
}

export interface GraderStatistics {
applicationId: string;
totalGraders: number;
completedGraders: number;
pendingGraders: number;
refereeCount: number;
gradingProgress: number;
}

export interface ApplicationGradingSummary {
applicationId: string;
graders: ApplicationGraderDto[];
referees: ApplicationGraderDto[];
statistics: GraderStatistics;
}

export interface GraderWorkload {
userId: string;
totalAssignments: number;
completedAssignments: number;
pendingAssignments: number;
refereeAssignments: number;
assignments: ApplicationGraderDto[];
}

export interface GraderSearchParams {
applicationId?: string;
userId?: string;
isCompleted?: boolean;
isReferee?: boolean;
}

// types/application/candidateTypes.ts
export type CandidateDto = DatabaseObjectDto & {
username: string;
lastLoginTime: string;
mobilePhone: string;
gsmPhone?: string;
email?: string;
address?: string;
country?: string;
city?: string;
mainTongue?: string;
fatherName?: string;
birthPlace?: string;
birthDate?: string;
activationCode?: string;
photoUrl?: string;
name: string;
lastName: string;
identityNumber: string;
role: string;
examSessionId?: string;
examSession?: ExamSessionDto;
application? : ApplicationDto;
}

export interface CandidateFormData extends DatabaseObjectDto {
username: string;
password: string;
mobilePhone?: string;
gsmPhone?: string;
email?: string;
address?: string;
country?: string;
city?: string;
mainTongue?: string;
fatherName?: string;
birthPlace?: string;
birthDate?: string;
photoUrl?: string;
name: string;
lastName: string;
identityNumber: string;
role?: string;
examTypeId?: string;
examSessionId?: string;
applicationId?: string;
}


export interface ChangePasswordRequest {
currentPassword: string;
newPassword: string;
confirmPassword: string;
}

export interface CandidateStatistics {
totalCandidates: number;
activeCandidates: number;
inactiveCandidates: number;
}

export interface CandidateSearchParams {
name?: string;
city?: string;
country?: string;
email?: string;
}


import { useState, useCallback } from 'react';

import {
UpdateQuestionGroupTypeRequest,
QuestionGroupTypeSearchRequest,
QuestionGroupTypeStatistics,
QuestionGroupTypeTemplate,
LevelInfo,
GroupTypeInfo,
CreateQuestionGroupTypeRequest
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import {QuestionGroupTypeDto} from "@/types/exam/examTemplates";
import {EQuestionGroupTemplateLevel, EQuestionGroupType} from "@/types/exam/enum";
import {questionGroupTypeService} from "@/services/api/exam/question-group-type-service";


interface UseQuestionGroupTypeReturn {
questionGroupTypes: QuestionGroupTypeDto[];
selectedType: QuestionGroupTypeDto | null;
typesByExamSection: QuestionGroupTypeDto[];
typesByLevel: QuestionGroupTypeDto[];
typesByGroupType: QuestionGroupTypeDto[];
searchResults: QuestionGroupTypeDto[];
typeStatistics: QuestionGroupTypeStatistics | null;
availableTemplates: QuestionGroupTypeTemplate[];
availableLevels: LevelInfo[];
availableGroupTypes: GroupTypeInfo[];
loading: boolean;
error: Error | null;
createQuestionGroupType: (createRequest: CreateQuestionGroupTypeRequest) => Promise<void>;
updateQuestionGroupType: (id: string, updateRequest: UpdateQuestionGroupTypeRequest) => Promise<void>;
getQuestionGroupTypeById: (id: string) => Promise<void>;
getQuestionGroupTypesByExamSection: (examSectionId: string) => Promise<void>;
getQuestionGroupTypesByLevel: (level: EQuestionGroupTemplateLevel) => Promise<void>;
getQuestionGroupTypesByGroupType: (groupType: EQuestionGroupType) => Promise<void>;
deleteQuestionGroupType: (id: string) => Promise<void>;
reorderQuestionGroupTypes: (examSectionId: string, typeIds: string[]) => Promise<void>;
copyQuestionGroupType: (typeId: string, targetExamSectionId: string) => Promise<void>;
bulkCreateQuestionGroupTypes: (examSectionId: string, createRequests: CreateQuestionGroupTypeRequest[]) => Promise<void>;
getQuestionGroupTypeStatistics: (id: string) => Promise<void>;
searchQuestionGroupTypes: (searchRequest: QuestionGroupTypeSearchRequest) => Promise<void>;
getAvailableTemplates: (level?: EQuestionGroupTemplateLevel, groupType?: EQuestionGroupType) => Promise<void>;
getAvailableLevels: () => Promise<void>;
getAvailableGroupTypes: () => Promise<void>;
clearTypeData: () => void;
}

export const useQuestionGroupType = (): UseQuestionGroupTypeReturn => {
const [questionGroupTypes, setQuestionGroupTypes] = useState<QuestionGroupTypeDto[]>([]);
const [selectedType, setSelectedType] = useState<QuestionGroupTypeDto | null>(null);
const [typesByExamSection, setTypesByExamSection] = useState<QuestionGroupTypeDto[]>([]);
const [typesByLevel, setTypesByLevel] = useState<QuestionGroupTypeDto[]>([]);
const [typesByGroupType, setTypesByGroupType] = useState<QuestionGroupTypeDto[]>([]);
const [searchResults, setSearchResults] = useState<QuestionGroupTypeDto[]>([]);
const [typeStatistics, setTypeStatistics] = useState<QuestionGroupTypeStatistics | null>(null);
const [availableTemplates, setAvailableTemplates] = useState<QuestionGroupTypeTemplate[]>([]);
const [availableLevels, setAvailableLevels] = useState<LevelInfo[]>([]);
const [availableGroupTypes, setAvailableGroupTypes] = useState<GroupTypeInfo[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createQuestionGroupType = useCallback(async (createRequest: CreateQuestionGroupTypeRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.createQuestionGroupType(createRequest);
            if (response.data && response.success) {
                setSelectedType(response.data);
                showNotification.success('Soru grubu tipi baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipi oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateQuestionGroupType = useCallback(async (id: string, updateRequest: UpdateQuestionGroupTypeRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.updateQuestionGroupType(id, updateRequest);
            if (response.data && response.success) {
                setSelectedType(response.data);
                showNotification.success('Soru grubu tipi baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipi gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupTypeById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getQuestionGroupTypeById(id);
            if (response.data && response.success) {
                setSelectedType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipi alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupTypesByExamSection = useCallback(async (examSectionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getQuestionGroupTypesByExamSection(examSectionId);
            if (response.data && response.success) {
                setTypesByExamSection(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav bÃ¶lÃ¼mÃ¼ tipleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupTypesByLevel = useCallback(async (level: EQuestionGroupTemplateLevel) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getQuestionGroupTypesByLevel(level);
            if (response.data && response.success) {
                setTypesByLevel(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Seviye tipleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupTypesByGroupType = useCallback(async (groupType: EQuestionGroupType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getQuestionGroupTypesByGroupType(groupType);
            if (response.data && response.success) {
                setTypesByGroupType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Grup tipi tipleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteQuestionGroupType = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.deleteQuestionGroupType(id);
            if (response.success) {
                showNotification.success('Soru grubu tipi baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipi silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const reorderQuestionGroupTypes = useCallback(async (examSectionId: string, typeIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.reorderQuestionGroupTypes(examSectionId, typeIds);
            if (response.data && response.success) {
                setTypesByExamSection(response.data);
                showNotification.success('Soru grubu tipleri baÅŸarÄ±yla yeniden sÄ±ralandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipleri sÄ±ralanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyQuestionGroupType = useCallback(async (typeId: string, targetExamSectionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.copyQuestionGroupType(typeId, targetExamSectionId);
            if (response.data && response.success) {
                setSelectedType(response.data);
                showNotification.success('Soru grubu tipi baÅŸarÄ±yla kopyalandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipi kopyalanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateQuestionGroupTypes = useCallback(async (examSectionId: string, createRequests: CreateQuestionGroupTypeRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.bulkCreateQuestionGroupTypes(examSectionId, createRequests);
            if (response.data && response.success) {
                setQuestionGroupTypes(response.data);
                showNotification.success('Soru grubu tipleri baÅŸarÄ±yla toplu oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipleri toplu oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupTypeStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getQuestionGroupTypeStatistics(id);
            if (response.data && response.success) {
                setTypeStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Tip istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchQuestionGroupTypes = useCallback(async (searchRequest: QuestionGroupTypeSearchRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.searchQuestionGroupTypes(searchRequest);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu tipleri aranÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAvailableTemplates = useCallback(async (level?: EQuestionGroupTemplateLevel, groupType?: EQuestionGroupType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getAvailableTemplates(level, groupType);
            if (response.data && response.success) {
                setAvailableTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Mevcut ÅŸablonlar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAvailableLevels = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getAvailableLevels();
            if (response.data && response.success) {
                setAvailableLevels(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Mevcut seviyeler alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAvailableGroupTypes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupTypeService.getAvailableGroupTypes();
            if (response.data && response.success) {
                setAvailableGroupTypes(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Mevcut grup tipleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearTypeData = useCallback(() => {
        setQuestionGroupTypes([]);
        setSelectedType(null);
        setTypesByExamSection([]);
        setTypesByLevel([]);
        setTypesByGroupType([]);
        setSearchResults([]);
        setTypeStatistics(null);
        setAvailableTemplates([]);
        setAvailableLevels([]);
        setAvailableGroupTypes([]);
        setError(null);
    }, []);

    return {
        questionGroupTypes,
        selectedType,
        typesByExamSection,
        typesByLevel,
        typesByGroupType,
        searchResults,
        typeStatistics,
        availableTemplates,
        availableLevels,
        availableGroupTypes,
        loading,
        error,
        createQuestionGroupType,
        updateQuestionGroupType,
        getQuestionGroupTypeById,
        getQuestionGroupTypesByExamSection,
        getQuestionGroupTypesByLevel,
        getQuestionGroupTypesByGroupType,
        deleteQuestionGroupType,
        reorderQuestionGroupTypes,
        copyQuestionGroupType,
        bulkCreateQuestionGroupTypes,
        getQuestionGroupTypeStatistics,
        searchQuestionGroupTypes,
        getAvailableTemplates,
        getAvailableLevels,
        getAvailableGroupTypes,
        clearTypeData
    };
};



import { useState, useCallback } from 'react';
import {
CreateCurriculumContentRequest,
UpdateCurriculumContentRequest,
CurriculumContentSearchRequest,
CurriculumContentStatistics,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import { CurriculumContentDto } from "@/types/exam/examEntities";
import {ECurriculumLevel} from "@/types/exam/enum";
import { curriculumContentService } from "@/services/api/exam/curriculum-content-service";

interface UseCurriculumContentReturn {
curriculumContents: CurriculumContentDto[];
selectedContent: CurriculumContentDto | null;
contentTree: CurriculumContentDto[];
contentsByLevel: CurriculumContentDto[];
childrenContents: CurriculumContentDto[];
statistics: CurriculumContentStatistics | null;
searchResults: CurriculumContentDto[];
loading: boolean;
error: Error | null;
createCurriculumContent: (createRequest: CreateCurriculumContentRequest) => Promise<void>;
updateCurriculumContent: (id: string, updateRequest: UpdateCurriculumContentRequest) => Promise<void>;
getCurriculumContentById: (id: string) => Promise<void>;
getCurriculumContentTree: (curriculumId: string) => Promise<void>;
getCurriculumContentByLevel: (curriculumId: string, level: ECurriculumLevel) => Promise<void>;
getCurriculumContentByParent: (parentId: string) => Promise<void>;
deleteCurriculumContent: (id: string) => Promise<void>;
moveCurriculumContent: (contentId: string, newParentId?: string) => Promise<void>;
reorderCurriculumContent: (curriculumId: string, parentId: string | null, contentIds: string[]) => Promise<void>;
copyCurriculumContentTree: (contentId: string, targetCurriculumId: string, targetParentId?: string) => Promise<void>;
searchCurriculumContent: (searchRequest: CurriculumContentSearchRequest) => Promise<void>;
getCurriculumContentStatistics: (curriculumId: string) => Promise<void>;
clearContentData: () => void;
}

export const useCurriculumContent = (): UseCurriculumContentReturn => {
const [curriculumContents, setCurriculumContents] = useState<CurriculumContentDto[]>([]);
const [selectedContent, setSelectedContent] = useState<CurriculumContentDto | null>(null);
const [contentTree, setContentTree] = useState<CurriculumContentDto[]>([]);
const [contentsByLevel, setContentsByLevel] = useState<CurriculumContentDto[]>([]);
const [childrenContents, setChildrenContents] = useState<CurriculumContentDto[]>([]);
const [statistics, setStatistics] = useState<CurriculumContentStatistics | null>(null);
const [searchResults, setSearchResults] = useState<CurriculumContentDto[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createCurriculumContent = useCallback(async (createRequest: CreateCurriculumContentRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.createCurriculumContent(createRequest);
            if (response.data && response.success) {
                setSelectedContent(response.data);
                showNotification.success('MÃ¼fredat iÃ§eriÄŸi baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat iÃ§eriÄŸi oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCurriculumContent = useCallback(async (id: string, updateRequest: UpdateCurriculumContentRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.updateCurriculumContent(id, updateRequest);
            if (response.data && response.success) {
                setSelectedContent(response.data);
                showNotification.success('MÃ¼fredat iÃ§eriÄŸi baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat iÃ§eriÄŸi gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumContentById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.getCurriculumContentById(id);
            if (response.data && response.success) {
                setSelectedContent(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat iÃ§eriÄŸi alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumContentTree = useCallback(async (curriculumId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.getCurriculumContentTree(curriculumId);
            if (response.data && response.success) {
                setContentTree(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat iÃ§erik aÄŸacÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumContentByLevel = useCallback(async (curriculumId: string, level: ECurriculumLevel) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.getCurriculumContentByLevel(curriculumId, level);
            if (response.data && response.success) {
                setContentsByLevel(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Seviye bazlÄ± iÃ§erikler alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumContentByParent = useCallback(async (parentId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.getCurriculumContentByParent(parentId);
            if (response.data && response.success) {
                setChildrenContents(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Alt iÃ§erikler alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCurriculumContent = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.deleteCurriculumContent(id);
            if (response.success) {
                showNotification.success('MÃ¼fredat iÃ§eriÄŸi baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat iÃ§eriÄŸi silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const moveCurriculumContent = useCallback(async (contentId: string, newParentId?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.moveCurriculumContent(contentId, newParentId);
            if (response.data && response.success) {
                setSelectedContent(response.data);
                showNotification.success('MÃ¼fredat iÃ§eriÄŸi baÅŸarÄ±yla taÅŸÄ±ndÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat iÃ§eriÄŸi taÅŸÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const reorderCurriculumContent = useCallback(async (curriculumId: string, parentId: string | null, contentIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.reorderCurriculumContent(curriculumId, parentId, contentIds);
            if (response.data && response.success) {
                setCurriculumContents(response.data);
                showNotification.success('MÃ¼fredat iÃ§erikleri baÅŸarÄ±yla yeniden sÄ±ralandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat iÃ§erikleri sÄ±ralanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyCurriculumContentTree = useCallback(async (contentId: string, targetCurriculumId: string, targetParentId?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.copyCurriculumContentTree(contentId, targetCurriculumId, targetParentId);
            if (response.data && response.success) {
                setSelectedContent(response.data);
                showNotification.success('MÃ¼fredat iÃ§erik aÄŸacÄ± baÅŸarÄ±yla kopyalandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat iÃ§erik aÄŸacÄ± kopyalanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchCurriculumContent = useCallback(async (searchRequest: CurriculumContentSearchRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.searchCurriculumContent(searchRequest);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat iÃ§eriÄŸi aranÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumContentStatistics = useCallback(async (curriculumId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumContentService.getCurriculumContentStatistics(curriculumId);
            if (response.data && response.success) {
                setStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat iÃ§erik istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearContentData = useCallback(() => {
        setCurriculumContents([]);
        setSelectedContent(null);
        setContentTree([]);
        setContentsByLevel([]);
        setChildrenContents([]);
        setStatistics(null);
        setSearchResults([]);
        setError(null);
    }, []);

    return {
        curriculumContents,
        selectedContent,
        contentTree,
        contentsByLevel,
        childrenContents,
        statistics,
        searchResults,
        loading,
        error,
        createCurriculumContent,
        updateCurriculumContent,
        getCurriculumContentById,
        getCurriculumContentTree,
        getCurriculumContentByLevel,
        getCurriculumContentByParent,
        deleteCurriculumContent,
        moveCurriculumContent,
        reorderCurriculumContent,
        copyCurriculumContentTree,
        searchCurriculumContent,
        getCurriculumContentStatistics,
        clearContentData
    };
};



import { useState, useCallback } from 'react';

import {
BrandDto,
BrandFormData,
BrandStatistics,
BrandSummary
} from '@/types/management/brand';
import { showNotification } from '@/lib/notification';
import {brandService} from "@/services/api/management/brand-service";

interface UseBrandReturn {
brands: BrandDto[] | null;
selectedBrand: BrandDto | null;
brandStatistics: BrandStatistics | null;
brandSummary: BrandSummary | null;
loading: boolean;
error: Error | null;
createBrand: (createRequest: BrandFormData) => Promise<void>;
updateBrand: (updateRequest: BrandFormData) => Promise<void>;
getBrandById: (id: string) => Promise<void>;
getBrandByCode: (code: string) => Promise<void>;
getAllBrands: () => Promise<void>;
searchBrandsByName: (name: string) => Promise<void>;
deleteBrand: (id: string) => Promise<void>;
bulkCreateBrands: (createRequests: BrandFormData[]) => Promise<void>;
getBrandStatistics: (id: string) => Promise<void>;
getBrandSummary: (id: string) => Promise<void>;
clearBrandData: () => void;
}

export const useBrand = (): UseBrandReturn => {
const [brands, setBrands] = useState<BrandDto[] | null>(null);
const [selectedBrand, setSelectedBrand] = useState<BrandDto | null>(null);
const [brandStatistics, setBrandStatistics] = useState<BrandStatistics | null>(null);
const [brandSummary, setBrandSummary] = useState<BrandSummary | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createBrand = useCallback(async (createRequest: BrandFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.createBrand(createRequest);
            if (response.data && response.success) {
                setSelectedBrand(response.data);
                showNotification.success('Marka baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateBrand = useCallback(async (updateRequest: BrandFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.updateBrand(updateRequest.id, updateRequest);
            if (response.data && response.success) {
                setSelectedBrand(response.data);
                showNotification.success('Marka baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBrandById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.getBrandById(id);
            if (response.data && response.success) {
                setSelectedBrand(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBrandByCode = useCallback(async (code: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.getBrandByCode(code);
            if (response.data && response.success) {
                setSelectedBrand(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka kod ile alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllBrands = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.getAllBrands();
            if (response.data && response.success) {
                setBrands(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Markalar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchBrandsByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.searchBrandsByName(name);
            if (response.data && response.success) {
                setBrands(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka arama yapÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteBrand = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.deleteBrand(id);
            if (response.success) {
                showNotification.success('Marka baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateBrands = useCallback(async (createRequests: BrandFormData[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.bulkCreateBrands(createRequests);
            if (response.data && response.success) {
                setBrands(response.data);
                showNotification.success('Markalar baÅŸarÄ±yla toplu oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Markalar toplu oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBrandStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.getBrandStatistics(id);
            if (response.data && response.success) {
                setBrandStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBrandSummary = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await brandService.getBrandSummary(id);
            if (response.data && response.success) {
                setBrandSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka Ã¶zeti alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearBrandData = useCallback(() => {
        setBrands(null);
        setSelectedBrand(null);
        setBrandStatistics(null);
        setBrandSummary(null);
        setError(null);
    }, []);

    return {
        brands,
        selectedBrand,
        brandStatistics,
        brandSummary,
        loading,
        error,
        createBrand,
        updateBrand,
        getBrandById,
        getBrandByCode,
        getAllBrands,
        searchBrandsByName,
        deleteBrand,
        bulkCreateBrands,
        getBrandStatistics,
        getBrandSummary,
        clearBrandData
    };
};


export type ELogOperation =
| 'ADD'
| 'REMOVE'
| 'CREATE'
| 'DELETE'
| 'UPDATE'
| 'START'
| 'SUCCESS'
| 'ERROR'
| 'COMPLETE'
| 'END'
| 'NEW'
| 'APPROVE'
| 'REJECT'
| 'CHANGE';

export type ECurriculumLevel =
| 'UNIT'
| 'TOPIC'
| 'SUB_TOPIC'
| 'GAIN';

export type ActionType =
| 'CREATE'
| 'LIST'
| 'UPDATE'
| 'DELETE'
| 'LOGIN'
| 'LOGOUT'
| 'OTHER';

export type Department =
| 'AUTHOR'
| 'GRADER'
| 'SUPERVISOR'
| 'MANAGEMENT'
| 'IT'
| 'AUTHOR_REVIEWER'
| 'ADMIN'
| 'REVIEWER';

export type EExamCategory =
| 'TURKISH';

export type EApprovalType =
| 'NORMAL'
| 'REFEREE';

export type EInfoStatus =
| 'PENDING'
| 'APPROVED'
| 'REJECTED';

export type EApprovalStatus =
| 'PENDING'
| 'APPROVED'
| 'REJECTED'
| 'CANCELLED'
| 'EXPIRED';

export type EExamType =
| 'CERTIFICATE'
| 'COURSE_EXAM'
| 'LEVEL_DETERMINATION'
| 'PRACTICE'
| 'DEGREE';

export type ELogType =
| 'INFO'
| 'ERROR';

// moreEnums.ts

export type EMediaType2 =
| 'IMAGE'
| 'VIDEO'
| 'AUDIO'
| 'DOCUMENT'
| 'PDF'
| 'TEXT'
| 'OTHER';


export enum EMediaType {
IMAGE = "IMAGE",
VIDEO = "VIDEO",
AUDIO = "AUDIO",
DOCUMENT = "DOCUMENT",
PDF = "PDF",
TEXT = "TEXT",
OTHER = "OTHER"
}

export type EQuestionGroupType =
| 'LISTENING'
| 'READING'
| 'SPEAKING'
| 'WRITING'
| 'GRAMMAR'
| 'VOCABULARY'
| 'GENERAL';
/*
export type EStatus =
| 'ACTIVE'
| 'PASSIVE'
| 'DELETED'
| 'REJECTED'
| 'CANCELLED'
| 'PENDING'
| 'SUSPENDED';

*/


export enum EStatus {
ACTIVE = "ACTIVE",
PASSIVE = "PASSIVE",
DELETED = "DELETED",
WAITING = "WAITING",
CONFIRMED = "CONFIRMED",
REJECTED = "REJECTED",
CANCELLED = "CANCELLED",
PENDING = "PENDING",
SUSPENDED = "SUSPENDED"
}

export type EQuestionGroupTemplateLevel =
| 'GROUP'
| 'QUESTION';

export type Permission =
| 'APPROVAL'
| 'USER_CREATE'
| 'GENERAL'
| 'FINANCE_OPERATION'
| 'ACCOUNTING_OPERATION'
| 'DELIVERY_OPERATION'
| 'CUSTOMER_OPERATION'
| 'OFFER_OPERATION'
| 'ORDER_OPERATION'
| 'SUPPLIER_OPERATION'
| 'TRANSPORTATION_OPERATION'
| 'DELIVERY_DOCUMENT'
| 'SETTING';

export type Role =
| 'USER'
| 'ADMIN'
| 'CANDIDATE'
| 'COMPANY';

export type TokenType =
| 'BEARER';

export type ObjectType =
| 'QUESTION'
| 'QUESTION_GROUP'
| 'QUESTION_GROUP_TYPE'
| 'QUESTION_GROUP_HEADER'
| 'QUESTION_PART'
| 'UPLOADED_FILE';

export type EQuestionType2 =
| 'MULTIPLE_CHOICE'
| 'TRUE_FALSE'
| 'FILL_IN_THE_BLANKS'
| 'SHORT_ANSWER'
| 'MATCHING'
| 'ESSAY'
| 'ORDERING'
| 'MULTIPLE_RESPONSE'
| 'HOT_SPOT'
| 'DRAG_AND_DROP'
| 'AUDIO_RESPONSE'
| 'VIDEO_RESPONSE'
| 'IMAGE_RESPONSE';


export enum EQuestionType {
MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
TRUE_FALSE = "TRUE_FALSE",
FILL_IN_THE_BLANKS = "FILL_IN_THE_BLANKS",
SHORT_ANSWER = "SHORT_ANSWER",
MATCHING = "MATCHING",
ESSAY = "ESSAY",
ORDERING = "ORDERING",
MULTIPLE_RESPONSE = "MULTIPLE_RESPONSE",
HOT_SPOT = "HOT_SPOT",
DRAG_AND_DROP = "DRAG_AND_DROP",
AUDIO_RESPONSE = "AUDIO_RESPONSE",
VIDEO_RESPONSE = "VIDEO_RESPONSE",
IMAGE_RESPONSE = "IMAGE_RESPONSE"
}



import { useState, useCallback } from 'react';

import {
CreateCurriculumRequest,
UpdateCurriculumRequest,
CurriculumSearchRequest,
CurriculumWithContentDto,
CurriculumListResponse,
CurriculumStatistics,
CurriculumContentSummary,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import {CurriculumDto} from "@/types/exam/examEntities";
import {EExamCategory} from "@/types/exam/enum";
import {curriculumService} from "@/services/api/exam/curriculum-service";

interface UseCurriculumReturn {
curricula: CurriculumListResponse | null;
selectedCurriculum: CurriculumDto | null;
curriculumWithContent: CurriculumWithContentDto | null;
curriculaByCategory: CurriculumDto[];
curriculumStatistics: CurriculumStatistics | null;
curriculumContentSummary: CurriculumContentSummary | null;
searchResults: CurriculumDto[];
loading: boolean;
error: Error | null;
createCurriculum: (createRequest: CreateCurriculumRequest) => Promise<void>;
updateCurriculum: (id: string, updateRequest: UpdateCurriculumRequest) => Promise<void>;
getCurriculumById: (id: string) => Promise<void>;
getCurriculumWithContent: (id: string) => Promise<void>;
getAllCurricula: (searchRequest?: CurriculumSearchRequest) => Promise<void>;
getCurriculaByCategory: (category: EExamCategory) => Promise<void>;
deleteCurriculum: (id: string) => Promise<void>;
copyCurriculum: (id: string, newName: string) => Promise<void>;
getCurriculumStatistics: (id: string) => Promise<void>;
bulkCreateCurricula: (createRequests: CreateCurriculumRequest[]) => Promise<void>;
searchCurriculaByName: (namePattern: string) => Promise<void>;
getCurriculumContentSummary: (id: string) => Promise<void>;
clearCurriculumData: () => void;
}

export const useCurriculum = (): UseCurriculumReturn => {
const [curricula, setCurricula] = useState<CurriculumListResponse | null>(null);
const [selectedCurriculum, setSelectedCurriculum] = useState<CurriculumDto | null>(null);
const [curriculumWithContent, setCurriculumWithContent] = useState<CurriculumWithContentDto | null>(null);
const [curriculaByCategory, setCurriculaByCategory] = useState<CurriculumDto[]>([]);
const [curriculumStatistics, setCurriculumStatistics] = useState<CurriculumStatistics | null>(null);
const [curriculumContentSummary, setCurriculumContentSummary] = useState<CurriculumContentSummary | null>(null);
const [searchResults, setSearchResults] = useState<CurriculumDto[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createCurriculum = useCallback(async (createRequest: CreateCurriculumRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.createCurriculum(createRequest);
            if (response.data && response.success) {
                setSelectedCurriculum(response.data);
                showNotification.success('MÃ¼fredat baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCurriculum = useCallback(async (id: string, updateRequest: UpdateCurriculumRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.updateCurriculum(id, updateRequest);
            if (response.data && response.success) {
                setSelectedCurriculum(response.data);
                showNotification.success('MÃ¼fredat baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.getCurriculumById(id);
            if (response.data && response.success) {
                setSelectedCurriculum(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumWithContent = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.getCurriculumWithContent(id);
            if (response.data && response.success) {
                setCurriculumWithContent(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat iÃ§eriÄŸi alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllCurricula = useCallback(async (searchRequest: CurriculumSearchRequest = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.getAllCurricula(searchRequest);
            if (response.data && response.success) {
                setCurricula(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredatlar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculaByCategory = useCallback(async (category: EExamCategory) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.getCurriculaByCategory(category);
            if (response.data && response.success) {
                setCurriculaByCategory(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kategori mÃ¼fredatlarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCurriculum = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.deleteCurriculum(id);
            if (response.success) {
                showNotification.success('MÃ¼fredat baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyCurriculum = useCallback(async (id: string, newName: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.copyCurriculum(id, newName);
            if (response.data && response.success) {
                setSelectedCurriculum(response.data);
                showNotification.success('MÃ¼fredat baÅŸarÄ±yla kopyalandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat kopyalanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.getCurriculumStatistics(id);
            if (response.data && response.success) {
                setCurriculumStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateCurricula = useCallback(async (createRequests: CreateCurriculumRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.bulkCreateCurricula(createRequests);
            if (response.data && response.success) {
                showNotification.success('MÃ¼fredatlar baÅŸarÄ±yla toplu oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredatlar toplu oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchCurriculaByName = useCallback(async (namePattern: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.searchCurriculaByName(namePattern);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat aranÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumContentSummary = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await curriculumService.getCurriculumContentSummary(id);
            if (response.data && response.success) {
                setCurriculumContentSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('MÃ¼fredat iÃ§erik Ã¶zeti alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearCurriculumData = useCallback(() => {
        setCurricula(null);
        setSelectedCurriculum(null);
        setCurriculumWithContent(null);
        setCurriculaByCategory([]);
        setCurriculumStatistics(null);
        setCurriculumContentSummary(null);
        setSearchResults([]);
        setError(null);
    }, []);

    return {
        curricula,
        selectedCurriculum,
        curriculumWithContent,
        curriculaByCategory,
        curriculumStatistics,
        curriculumContentSummary,
        searchResults,
        loading,
        error,
        createCurriculum,
        updateCurriculum,
        getCurriculumById,
        getCurriculumWithContent,
        getAllCurricula,
        getCurriculaByCategory,
        deleteCurriculum,
        copyCurriculum,
        getCurriculumStatistics,
        bulkCreateCurricula,
        searchCurriculaByName,
        getCurriculumContentSummary,
        clearCurriculumData
    };
};



import { useState, useCallback } from 'react';

import {
CandidateDto,
CandidateFormData,
ChangePasswordRequest,
CandidateStatistics,
CandidateSearchParams
} from '@/types/management/brand';
import { showNotification } from '@/lib/notification';
import {candidateService} from "@/services/api/management/candidate-service";

interface UseCandidateReturn {
candidates: CandidateDto[] | null;
selectedCandidate: CandidateDto | null;
candidatesByCity: CandidateDto[] | null;
candidatesByCountry: CandidateDto[] | null;
candidateStatistics: CandidateStatistics | null;
candidatesForSelection: Array<{id: string; name: string; value: string; identityNumber: string; email?: string;}> | null;
loading: boolean;
error: Error | null;
createCandidate: (createRequest: CandidateFormData) => Promise<void>;
updateCandidate: (updateRequest: CandidateFormData) => Promise<void>;
getCandidateById: (id: string) => Promise<void>;
getCandidateByUsername: (username: string) => Promise<void>;
getCandidateByIdentityNumber: (identityNumber: string) => Promise<void>;
getAllCandidates: () => Promise<void>;
searchCandidates: (searchParams?: CandidateSearchParams) => Promise<void>;
searchCandidatesByName: (name: string) => Promise<void>;
getCandidatesByCity: (city: string) => Promise<void>;
getCandidatesByCountry: (country: string) => Promise<void>;
changePassword: (id: string, passwordRequest: ChangePasswordRequest) => Promise<void>;
deleteCandidate: (id: string) => Promise<void>;
bulkCreateCandidates: (createRequests: CandidateFormData[]) => Promise<void>;
getCandidateStatistics: () => Promise<void>;
validateUsername: (username: string) => Promise<boolean>;
validateIdentityNumber: (identityNumber: string) => Promise<boolean>;
quickCreateCandidate: (name: string, lastName: string, identityNumber: string, username: string, password: string, mobilePhone: string, email: string) => Promise<void>;
advancedSearch: (filters: {name?: string; city?: string; country?: string; email?: string; identityNumber?: string; mobilePhone?: string;}) => Promise<void>;
getCandidatesForSelection: () => Promise<void>;
createCandidatesFromList: (candidateData: Array<CandidateFormData>) => Promise<void>;
clearCandidateData: () => void;
}

export const useCandidate = (): UseCandidateReturn => {
const [candidates, setCandidates] = useState<CandidateDto[] | null>(null);
const [selectedCandidate, setSelectedCandidate] = useState<CandidateDto | null>(null);
const [candidatesByCity, setCandidatesByCity] = useState<CandidateDto[] | null>(null);
const [candidatesByCountry, setCandidatesByCountry] = useState<CandidateDto[] | null>(null);
const [candidateStatistics, setCandidateStatistics] = useState<CandidateStatistics | null>(null);
const [candidatesForSelection, setCandidatesForSelection] = useState<Array<{id: string; name: string; value: string; identityNumber: string; email?: string;}> | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createCandidate = useCallback(async (createRequest: CandidateFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.createCandidate(createRequest);
            if (response.data && response.success) {
                setSelectedCandidate(response.data);
                showNotification.success('Aday baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCandidate = useCallback(async (updateRequest: CandidateFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.updateCandidate(updateRequest.id, updateRequest);
            if (response.data && response.success) {
                setSelectedCandidate(response.data);
                showNotification.success('Aday baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCandidateById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.getCandidateById(id);
            if (response.data && response.success) {
                setSelectedCandidate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCandidateByUsername = useCallback(async (username: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.getCandidateByUsername(username);
            if (response.data && response.success) {
                setSelectedCandidate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday kullanÄ±cÄ± adÄ± ile alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCandidateByIdentityNumber = useCallback(async (identityNumber: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.getCandidateByIdentityNumber(identityNumber);
            if (response.data && response.success) {
                setSelectedCandidate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday kimlik numarasÄ± ile alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllCandidates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.getAllCandidates();
            if (response.data && response.success) {
                setCandidates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Adaylar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchCandidates = useCallback(async (searchParams: CandidateSearchParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.searchCandidates(searchParams);
            if (response.data && response.success) {
                setCandidates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday arama yapÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchCandidatesByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.searchCandidatesByName(name);
            if (response.data && response.success) {
                setCandidates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday isim ile arama yapÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCandidatesByCity = useCallback(async (city: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.getCandidatesByCity(city);
            if (response.data && response.success) {
                setCandidatesByCity(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžehir adaylarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCandidatesByCountry = useCallback(async (country: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.getCandidatesByCountry(country);
            if (response.data && response.success) {
                setCandidatesByCountry(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Ãœlke adaylarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const changePassword = useCallback(async (id: string, passwordRequest: ChangePasswordRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.changePassword(id, passwordRequest);
            if (response.success) {
                showNotification.success('Åžifre baÅŸarÄ±yla deÄŸiÅŸtirildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžifre deÄŸiÅŸtirilirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCandidate = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.deleteCandidate(id);
            if (response.success) {
                showNotification.success('Aday baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateCandidates = useCallback(async (createRequests: CandidateFormData[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.bulkCreateCandidates(createRequests);
            if (response.data && response.success) {
                setCandidates(response.data);
                showNotification.success('Adaylar baÅŸarÄ±yla toplu oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Adaylar toplu oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCandidateStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.getCandidateStatistics();
            if (response.data && response.success) {
                setCandidateStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateUsername = useCallback(async (username: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await candidateService.validateUsername(username);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('KullanÄ±cÄ± adÄ± doÄŸrulanÄ±rken bir hata oluÅŸtu!');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const validateIdentityNumber = useCallback(async (identityNumber: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await candidateService.validateIdentityNumber(identityNumber);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kimlik numarasÄ± doÄŸrulanÄ±rken bir hata oluÅŸtu!');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const quickCreateCandidate = useCallback(async (
        name: string,
        lastName: string,
        identityNumber: string,
        username: string,
        password: string,
        mobilePhone: string,
        email: string
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.quickCreateCandidate(
                name, lastName, identityNumber, username, password, mobilePhone, email
            );
            if (response.data && response.success) {
                setSelectedCandidate(response.data);
                showNotification.success('HÄ±zlÄ± aday baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('HÄ±zlÄ± aday oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const advancedSearch = useCallback(async (filters: {
        name?: string;
        city?: string;
        country?: string;
        email?: string;
        identityNumber?: string;
        mobilePhone?: string;
    }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.advancedSearch(filters);
            if (response.data && response.success) {
                setCandidates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('GeliÅŸmiÅŸ arama yapÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCandidatesForSelection = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await candidateService.getCandidatesForSelection();
            setCandidatesForSelection(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SeÃ§im iÃ§in adaylar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createCandidatesFromList = useCallback(async (candidateData: CandidateFormData[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await candidateService.createCandidatesFromList(candidateData);
            if (response.data && response.success) {
                setCandidates(response.data);
                showNotification.success('Adaylar listeden baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Adaylar listeden oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearCandidateData = useCallback(() => {
        setCandidates(null);
        setSelectedCandidate(null);
        setCandidatesByCity(null);
        setCandidatesByCountry(null);
        setCandidateStatistics(null);
        setCandidatesForSelection(null);
        setError(null);
    }, []);

    return {
        candidates,
        selectedCandidate,
        candidatesByCity,
        candidatesByCountry,
        candidateStatistics,
        candidatesForSelection,
        loading,
        error,
        createCandidate,
        updateCandidate,
        getCandidateById,
        getCandidateByUsername,
        getCandidateByIdentityNumber,
        getAllCandidates,
        searchCandidates,
        searchCandidatesByName,
        getCandidatesByCity,
        getCandidatesByCountry,
        changePassword,
        deleteCandidate,
        bulkCreateCandidates,
        getCandidateStatistics,
        validateUsername,
        validateIdentityNumber,
        quickCreateCandidate,
        advancedSearch,
        getCandidatesForSelection,
        createCandidatesFromList,
        clearCandidateData
    };
};



import { useState, useCallback } from 'react';

import {
baseQuestionTemplateService
} from '@/services/api/exam/base-question-template-service';
import { showNotification } from '@/lib/notification';
import {
QuestionTemplateListResponse,
QuestionTemplateResponse, QuestionTemplateSearchRequest, TemplateUsageInfo
} from "@/types/exam/examResponses";
import {TemplateUsageStatistics, TemplateValidationResult} from "@/types/exam/examValidationAndAnalytics";
import {CreateQuestionTemplateRequest, UpdateQuestionTemplateRequest} from "@/types/exam/examRequests";
import {EQuestionType} from "@/types/exam/enum";

interface UseBaseQuestionTemplateReturn {
templates: QuestionTemplateListResponse | null;
selectedTemplate: QuestionTemplateResponse | null;
templatesByType: QuestionTemplateResponse[];
activeTemplates: QuestionTemplateResponse[];
templateValidation: TemplateValidationResult | null;
templateStatistics: TemplateUsageStatistics[];
templateUsage: TemplateUsageInfo | null;
loading: boolean;
error: Error | null;
createTemplate: (createRequest: CreateQuestionTemplateRequest) => Promise<void>;
updateTemplate: (updateRequest: UpdateQuestionTemplateRequest) => Promise<void>;
getTemplateById: (id: string) => Promise<void>;
getTemplatesByType: (questionType: EQuestionType) => Promise<void>;
getActiveTemplates: () => Promise<void>;
searchTemplates: (searchRequest: QuestionTemplateSearchRequest) => Promise<void>;
deleteTemplate: (id: string) => Promise<void>;
validateTemplate: (validateRequest: CreateQuestionTemplateRequest) => Promise<void>;
toggleTemplateStatus: (id: string, isActive: boolean) => Promise<void>;
getTemplateStatistics: () => Promise<void>;
getTemplateUsage: (id: string) => Promise<void>;
duplicateTemplate: (id: string, newTitle: string) => Promise<void>;
clearTemplateData: () => void;
}

export const useBaseQuestionTemplate = (): UseBaseQuestionTemplateReturn => {
const [templates, setTemplates] = useState<QuestionTemplateListResponse | null>(null);
const [selectedTemplate, setSelectedTemplate] = useState<QuestionTemplateResponse | null>(null);
const [templatesByType, setTemplatesByType] = useState<QuestionTemplateResponse[]>([]);
const [activeTemplates, setActiveTemplates] = useState<QuestionTemplateResponse[]>([]);
const [templateValidation, setTemplateValidation] = useState<TemplateValidationResult | null>(null);
const [templateStatistics, setTemplateStatistics] = useState<TemplateUsageStatistics[]>([]);
const [templateUsage, setTemplateUsage] = useState<TemplateUsageInfo | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createTemplate = useCallback(async (createRequest: CreateQuestionTemplateRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.createTemplate(createRequest);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                showNotification.success('Soru ÅŸablonu baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru ÅŸablonu oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTemplate = useCallback(async (updateRequest: UpdateQuestionTemplateRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.updateTemplate(updateRequest);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                showNotification.success('Soru ÅŸablonu baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru ÅŸablonu gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.getTemplateById(id);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru ÅŸablonu alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplatesByType = useCallback(async (questionType: EQuestionType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.getTemplatesByType(questionType);
            if (response.data && response.success) {
                setTemplatesByType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Tip ÅŸablonlarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getActiveTemplates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.getActiveTemplates();
            if (response.data && response.success) {
                setActiveTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aktif ÅŸablonlar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchTemplates = useCallback(async (searchRequest: QuestionTemplateSearchRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.searchTemplates(searchRequest);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon aranÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteTemplate = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.deleteTemplate(id);
            if (response.data && response.success) {
                showNotification.success('Soru ÅŸablonu baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru ÅŸablonu silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateTemplate = useCallback(async (validateRequest: CreateQuestionTemplateRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.validateTemplate(validateRequest);
            if (response.data && response.success) {
                setTemplateValidation(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon doÄŸrulanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleTemplateStatus = useCallback(async (id: string, isActive: boolean) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.toggleTemplateStatus(id, isActive);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                showNotification.success(`Åžablon durumu baÅŸarÄ±yla ${isActive ? 'aktif' : 'pasif'} yapÄ±ldÄ±!`);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon durumu deÄŸiÅŸtirilirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.getTemplateStatistics();
            if (response.data && response.success) {
                setTemplateStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateUsage = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.getTemplateUsage(id);
            if (response.data && response.success) {
                setTemplateUsage(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon kullanÄ±mÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const duplicateTemplate = useCallback(async (id: string, newTitle: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await baseQuestionTemplateService.duplicateTemplate(id, newTitle);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                showNotification.success('Åžablon baÅŸarÄ±yla Ã§oÄŸaltÄ±ldÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon Ã§oÄŸaltÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearTemplateData = useCallback(() => {
        setTemplates(null);
        setSelectedTemplate(null);
        setTemplatesByType([]);
        setActiveTemplates([]);
        setTemplateValidation(null);
        setTemplateStatistics([]);
        setTemplateUsage(null);
        setError(null);
    }, []);

    return {
        templates,
        selectedTemplate,
        templatesByType,
        activeTemplates,
        templateValidation,
        templateStatistics,
        templateUsage,
        loading,
        error,
        createTemplate,
        updateTemplate,
        getTemplateById,
        getTemplatesByType,
        getActiveTemplates,
        searchTemplates,
        deleteTemplate,
        validateTemplate,
        toggleTemplateStatus,
        getTemplateStatistics,
        getTemplateUsage,
        duplicateTemplate,
        clearTemplateData
    };
};



import { useState, useCallback } from 'react';
import {
ApprovalRequest,
RejectionRequest,
RefereeApprovalRequest,
InitializeApprovalRequest,
ApprovalResult,
ApprovalStatusResult,
ApprovalHistoryItem,
UpdateRequirementsResult,
PendingApprovalItem,
ApprovalStatistics
} from '@/types/exam/examResponses';
import { approvalService } from '@/services/api/exam/approval-service';
import { showNotification } from '@/lib/notification';
import {ObjectType} from "@/types/exam/enum";

interface UseApprovalReturn {
approvalResult: ApprovalResult | null;
approvalStatus: ApprovalStatusResult | null;
approvalHistory: ApprovalHistoryItem[];
pendingApprovals: PendingApprovalItem[];
approvalStatistics: ApprovalStatistics | null;
updateRequirementsResult: UpdateRequirementsResult | null;
loading: boolean;
error: Error | null;
addApproval: (approvalRequest: ApprovalRequest) => Promise<void>;
rejectApproval: (rejectionRequest: RejectionRequest) => Promise<void>;
addRefereeApproval: (refereeRequest: RefereeApprovalRequest) => Promise<void>;
initializeApprovalRequirements: (initRequest: InitializeApprovalRequest) => Promise<void>;
checkApprovalStatus: (objectType: ObjectType, objectId: string) => Promise<void>;
getApprovalHistory: (objectType: ObjectType, objectId: string) => Promise<void>;
updateAllApprovalRequirements: () => Promise<void>;
getPendingApprovals: (objectType: ObjectType, page?: number, size?: number) => Promise<void>;
getApprovalStatistics: () => Promise<void>;
clearApprovalData: () => void;
}

export const useApproval = (): UseApprovalReturn => {
const [approvalResult, setApprovalResult] = useState<ApprovalResult | null>(null);
const [approvalStatus, setApprovalStatus] = useState<ApprovalStatusResult | null>(null);
const [approvalHistory, setApprovalHistory] = useState<ApprovalHistoryItem[]>([]);
const [pendingApprovals, setPendingApprovals] = useState<PendingApprovalItem[]>([]);
const [approvalStatistics, setApprovalStatistics] = useState<ApprovalStatistics | null>(null);
const [updateRequirementsResult, setUpdateRequirementsResult] = useState<UpdateRequirementsResult | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const addApproval = useCallback(async (approvalRequest: ApprovalRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await approvalService.addApproval(approvalRequest);
            if (response.data && response.success) {
                setApprovalResult(response.data);
                showNotification.success('Onay baÅŸarÄ±yla eklendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Onay eklenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const rejectApproval = useCallback(async (rejectionRequest: RejectionRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await approvalService.rejectApproval(rejectionRequest);
            if (response.data && response.success) {
                setApprovalResult(response.data);
                showNotification.success('Onay baÅŸarÄ±yla reddedildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Onay reddedilirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const addRefereeApproval = useCallback(async (refereeRequest: RefereeApprovalRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await approvalService.addRefereeApproval(refereeRequest);
            if (response.data && response.success) {
                setApprovalResult(response.data);
                showNotification.success('Hakem onayÄ± baÅŸarÄ±yla eklendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Hakem onayÄ± eklenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const initializeApprovalRequirements = useCallback(async (initRequest: InitializeApprovalRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await approvalService.initializeApprovalRequirements(initRequest);
            if (response.data && response.success) {
                showNotification.success('Onay gereksinimleri baÅŸarÄ±yla baÅŸlatÄ±ldÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Onay gereksinimleri baÅŸlatÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const checkApprovalStatus = useCallback(async (objectType: ObjectType, objectId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await approvalService.checkApprovalStatus(objectType, objectId);
            if (response.data && response.success) {
                setApprovalStatus(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Onay durumu kontrol edilirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApprovalHistory = useCallback(async (objectType: ObjectType, objectId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await approvalService.getApprovalHistory(objectType, objectId);
            if (response.data && response.success) {
                setApprovalHistory(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Onay geÃ§miÅŸi alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateAllApprovalRequirements = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await approvalService.updateAllApprovalRequirements();
            if (response.data && response.success) {
                setUpdateRequirementsResult(response.data);
                showNotification.success('TÃ¼m onay gereksinimleri gÃ¼ncelleme iÅŸlemi baÅŸlatÄ±ldÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Onay gereksinimleri gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getPendingApprovals = useCallback(async (objectType: ObjectType, page: number = 0, size: number = 20) => {
        try {
            setLoading(true);
            setError(null);
            const response = await approvalService.getPendingApprovals(objectType, page, size);
            if (response.data && response.success) {
                setPendingApprovals(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bekleyen onaylar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApprovalStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await approvalService.getApprovalStatistics();
            if (response.data && response.success) {
                setApprovalStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Onay istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearApprovalData = useCallback(() => {
        setApprovalResult(null);
        setApprovalStatus(null);
        setApprovalHistory([]);
        setPendingApprovals([]);
        setApprovalStatistics(null);
        setUpdateRequirementsResult(null);
        setError(null);
    }, []);

    return {
        approvalResult,
        approvalStatus,
        approvalHistory,
        pendingApprovals,
        approvalStatistics,
        updateRequirementsResult,
        loading,
        error,
        addApproval,
        rejectApproval,
        addRefereeApproval,
        initializeApprovalRequirements,
        checkApprovalStatus,
        getApprovalHistory,
        updateAllApprovalRequirements,
        getPendingApprovals,
        getApprovalStatistics,
        clearApprovalData
    };
};



import { useState, useCallback } from 'react';
import {
BaseQuestionTemplateDto,
MultipleChoiceTemplateDto,
TrueFalseTemplateDto,
FillInTheBlanksTemplateDto,
ShortAnswerTemplateDto,
MatchingTemplateDto,
EssayTemplateDto,
OrderingTemplateDto,
MultipleResponseTemplateDto,
HotSpotTemplateDto,
DragAndDropTemplateDto,
AudioResponseTemplateDto,
VideoResponseTemplateDto,
ImageResponseTemplateDto,
TemplateFilterDto,
TemplateTypeStatistics,
TemplateUsageStatsDto,
TemplateValidationResult
} from '@/types/exam/questionTemplates';
import {EQuestionType} from "@/types/exam/enum";
import {
templateService
} from '@/services/api/exam/template-service';
import { showNotification } from '@/lib/notification';

interface UseExamTemplateReturn {
templates: BaseQuestionTemplateDto[];
selectedTemplate: BaseQuestionTemplateDto | null;
templateMap: Record<string, BaseQuestionTemplateDto>;
templateTypeStatistics: TemplateTypeStatistics | null;
templateUsageStats: TemplateUsageStatsDto | null;
validationResult: TemplateValidationResult | null;
validationErrors: string[];
examsUsingTemplate: string[];
loading: boolean;
error: Error | null;
createTemplate: (template: BaseQuestionTemplateDto) => Promise<void>;
updateTemplate: (templateId: string, template: BaseQuestionTemplateDto) => Promise<void>;
getTemplateById: (templateId: string) => Promise<void>;
getTemplateByIdAndType: (templateId: string, type: EQuestionType) => Promise<void>;
getAllTemplates: () => Promise<void>;
getTemplatesByType: (type: EQuestionType) => Promise<void>;
deleteTemplate: (templateId: string) => Promise<void>;
activateTemplate: (templateId: string) => Promise<void>;
deactivateTemplate: (templateId: string) => Promise<void>;
duplicateTemplate: (templateId: string, newTitle: string) => Promise<void>;
getTemplateMap: (templateIds: string[]) => Promise<void>;
validateTemplate: (templateId: string) => Promise<boolean>;
getTemplateValidationErrors: (templateId: string) => Promise<void>;
validateTemplateData: (template: BaseQuestionTemplateDto) => Promise<void>;
isTemplateInUse: (templateId: string) => Promise<boolean>;
getExamsUsingTemplate: (templateId: string) => Promise<void>;
searchTemplates: (keyword: string) => Promise<void>;
filterTemplates: (filter: TemplateFilterDto) => Promise<void>;
getTemplatesBySubject: (subject: string) => Promise<void>;
getTemplatesByDifficulty: (difficulty: string) => Promise<void>;
getTemplatesByCreator: (userId: string) => Promise<void>;
getTemplateTypeStatistics: () => Promise<void>;
getMostUsedTemplates: (limit?: number) => Promise<void>;
getRecentTemplates: (limit?: number) => Promise<void>;
getTemplateUsageStats: (templateId: string) => Promise<void>;
clearTemplateData: () => void;
// Specific template type operations
createMultipleChoiceTemplate: (dto: MultipleChoiceTemplateDto) => Promise<void>;
updateMultipleChoiceTemplate: (templateId: string, dto: MultipleChoiceTemplateDto) => Promise<void>;
createTrueFalseTemplate: (dto: TrueFalseTemplateDto) => Promise<void>;
updateTrueFalseTemplate: (templateId: string, dto: TrueFalseTemplateDto) => Promise<void>;
createFillInTheBlanksTemplate: (dto: FillInTheBlanksTemplateDto) => Promise<void>;
updateFillInTheBlanksTemplate: (templateId: string, dto: FillInTheBlanksTemplateDto) => Promise<void>;
createShortAnswerTemplate: (dto: ShortAnswerTemplateDto) => Promise<void>;
updateShortAnswerTemplate: (templateId: string, dto: ShortAnswerTemplateDto) => Promise<void>;
createMatchingTemplate: (dto: MatchingTemplateDto) => Promise<void>;
updateMatchingTemplate: (templateId: string, dto: MatchingTemplateDto) => Promise<void>;
createEssayTemplate: (dto: EssayTemplateDto) => Promise<void>;
updateEssayTemplate: (templateId: string, dto: EssayTemplateDto) => Promise<void>;
createOrderingTemplate: (dto: OrderingTemplateDto) => Promise<void>;
updateOrderingTemplate: (templateId: string, dto: OrderingTemplateDto) => Promise<void>;
createMultipleResponseTemplate: (dto: MultipleResponseTemplateDto) => Promise<void>;
updateMultipleResponseTemplate: (templateId: string, dto: MultipleResponseTemplateDto) => Promise<void>;
createHotSpotTemplate: (dto: HotSpotTemplateDto) => Promise<void>;
updateHotSpotTemplate: (templateId: string, dto: HotSpotTemplateDto) => Promise<void>;
createDragAndDropTemplate: (dto: DragAndDropTemplateDto) => Promise<void>;
updateDragAndDropTemplate: (templateId: string, dto: DragAndDropTemplateDto) => Promise<void>;
createAudioResponseTemplate: (dto: AudioResponseTemplateDto) => Promise<void>;
updateAudioResponseTemplate: (templateId: string, dto: AudioResponseTemplateDto) => Promise<void>;
createVideoResponseTemplate: (dto: VideoResponseTemplateDto) => Promise<void>;
updateVideoResponseTemplate: (templateId: string, dto: VideoResponseTemplateDto) => Promise<void>;
createImageResponseTemplate: (dto: ImageResponseTemplateDto) => Promise<void>;
updateImageResponseTemplate: (templateId: string, dto: ImageResponseTemplateDto) => Promise<void>;
}

export const useExamTemplate = (): UseExamTemplateReturn => {
const [templates, setTemplates] = useState<BaseQuestionTemplateDto[]>([]);
const [selectedTemplate, setSelectedTemplate] = useState<BaseQuestionTemplateDto | null>(null);
const [templateMap, setTemplateMap] = useState<Record<string, BaseQuestionTemplateDto>>({});
const [templateTypeStatistics, setTemplateTypeStatistics] = useState<TemplateTypeStatistics | null>(null);
const [templateUsageStats, setTemplateUsageStats] = useState<TemplateUsageStatsDto | null>(null);
const [validationResult, setValidationResult] = useState<TemplateValidationResult | null>(null);
const [validationErrors, setValidationErrors] = useState<string[]>([]);
const [examsUsingTemplate, setExamsUsingTemplate] = useState<string[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createTemplate = useCallback(async (template: BaseQuestionTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createTemplate(template);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Åžablon baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTemplate = useCallback(async (templateId: string, template: BaseQuestionTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateTemplate(templateId, template);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Åžablon baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateById = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplateById(templateId);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateByIdAndType = useCallback(async (templateId: string, type: EQuestionType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplateByIdAndType(templateId, type);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllTemplates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getAllTemplates();
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablonlar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplatesByType = useCallback(async (type: EQuestionType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplatesByType(type);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablonlar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.deleteTemplate(templateId);
            if (response.data && response.success) {
                await getAllTemplates();
                showNotification.success('Åžablon baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const activateTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.activateTemplate(templateId);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Åžablon baÅŸarÄ±yla aktifleÅŸtirildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon aktifleÅŸtirilirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deactivateTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.deactivateTemplate(templateId);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Åžablon baÅŸarÄ±yla pasifleÅŸtirildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon pasifleÅŸtirilirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const duplicateTemplate = useCallback(async (templateId: string, newTitle: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.duplicateTemplate(templateId, newTitle);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Åžablon baÅŸarÄ±yla kopyalandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon kopyalanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateMap = useCallback(async (templateIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplateMap(templateIds);
            if (response.data && response.success) {
                setTemplateMap(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon haritasÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateTemplate = useCallback(async (templateId: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.validateTemplate(templateId);
            if (response.data && response.success) {
                return response.data;
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon doÄŸrulanÄ±rken bir hata oluÅŸtu!');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateValidationErrors = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplateValidationErrors(templateId);
            if (response.data && response.success) {
                setValidationErrors(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DoÄŸrulama hatalarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateTemplateData = useCallback(async (template: BaseQuestionTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.validateTemplateData(template);
            if (response.data && response.success) {
                setValidationResult(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon verileri doÄŸrulanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const isTemplateInUse = useCallback(async (templateId: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.isTemplateInUse(templateId);
            if (response.data && response.success) {
                return response.data;
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon kullanÄ±m durumu kontrol edilirken bir hata oluÅŸtu!');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamsUsingTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getExamsUsingTemplate(templateId);
            if (response.data && response.success) {
                setExamsUsingTemplate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon kullanan sÄ±navlar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchTemplates = useCallback(async (keyword: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.searchTemplates(keyword);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon arama iÅŸleminde bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const filterTemplates = useCallback(async (filter: TemplateFilterDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.filterTemplates(filter);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon filtreleme iÅŸleminde bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplatesBySubject = useCallback(async (subject: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplatesBySubject(subject);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Konu bazÄ±nda ÅŸablonlar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplatesByDifficulty = useCallback(async (difficulty: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplatesByDifficulty(difficulty);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Zorluk bazÄ±nda ÅŸablonlar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplatesByCreator = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplatesByCreator(userId);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('OluÅŸturucu bazÄ±nda ÅŸablonlar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateTypeStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplateTypeStatistics();
            if (response.data && response.success) {
                setTemplateTypeStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon tipi istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getMostUsedTemplates = useCallback(async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getMostUsedTemplates(limit);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('En Ã§ok kullanÄ±lan ÅŸablonlar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getRecentTemplates = useCallback(async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getRecentTemplates(limit);
            if (response.data && response.success) {
                setTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Son ÅŸablonlar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateUsageStats = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.getTemplateUsageStats(templateId);
            if (response.data && response.success) {
                setTemplateUsageStats(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon kullanÄ±m istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    // Specific template type operations
    const createMultipleChoiceTemplate = useCallback(async (dto: MultipleChoiceTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createMultipleChoiceTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Ã‡oktan seÃ§meli ÅŸablon baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Ã‡oktan seÃ§meli ÅŸablon oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateMultipleChoiceTemplate = useCallback(async (templateId: string, dto: MultipleChoiceTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateMultipleChoiceTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Ã‡oktan seÃ§meli ÅŸablon baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Ã‡oktan seÃ§meli ÅŸablon gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createTrueFalseTemplate = useCallback(async (dto: TrueFalseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createTrueFalseTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('DoÄŸru/YanlÄ±ÅŸ ÅŸablon baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DoÄŸru/YanlÄ±ÅŸ ÅŸablon oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTrueFalseTemplate = useCallback(async (templateId: string, dto: TrueFalseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateTrueFalseTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('DoÄŸru/YanlÄ±ÅŸ ÅŸablon baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DoÄŸru/YanlÄ±ÅŸ ÅŸablon gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createFillInTheBlanksTemplate = useCallback(async (dto: FillInTheBlanksTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createFillInTheBlanksTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('BoÅŸluk doldurma ÅŸablon baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BoÅŸluk doldurma ÅŸablon oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateFillInTheBlanksTemplate = useCallback(async (templateId: string, dto: FillInTheBlanksTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateFillInTheBlanksTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('BoÅŸluk doldurma ÅŸablon baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BoÅŸluk doldurma ÅŸablon gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createShortAnswerTemplate = useCallback(async (dto: ShortAnswerTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createShortAnswerTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('KÄ±sa cevap ÅŸablon baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('KÄ±sa cevap ÅŸablon oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateShortAnswerTemplate = useCallback(async (templateId: string, dto: ShortAnswerTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateShortAnswerTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('KÄ±sa cevap ÅŸablon baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('KÄ±sa cevap ÅŸablon gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createMatchingTemplate = useCallback(async (dto: MatchingTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createMatchingTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('EÅŸleÅŸtirme ÅŸablon baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('EÅŸleÅŸtirme ÅŸablon oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateMatchingTemplate = useCallback(async (templateId: string, dto: MatchingTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateMatchingTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('EÅŸleÅŸtirme ÅŸablon baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('EÅŸleÅŸtirme ÅŸablon gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createEssayTemplate = useCallback(async (dto: EssayTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createEssayTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Kompozisyon ÅŸablon baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kompozisyon ÅŸablon oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateEssayTemplate = useCallback(async (templateId: string, dto: EssayTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateEssayTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Kompozisyon ÅŸablon baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kompozisyon ÅŸablon gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createOrderingTemplate = useCallback(async (dto: OrderingTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createOrderingTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('SÄ±ralama ÅŸablon baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±ralama ÅŸablon oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateOrderingTemplate = useCallback(async (templateId: string, dto: OrderingTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateOrderingTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('SÄ±ralama ÅŸablon baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±ralama ÅŸablon gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createMultipleResponseTemplate = useCallback(async (dto: MultipleResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createMultipleResponseTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Ã‡oklu yanÄ±t ÅŸablon baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Ã‡oklu yanÄ±t ÅŸablon oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateMultipleResponseTemplate = useCallback(async (templateId: string, dto: MultipleResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateMultipleResponseTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Ã‡oklu yanÄ±t ÅŸablon baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Ã‡oklu yanÄ±t ÅŸablon gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createHotSpotTemplate = useCallback(async (dto: HotSpotTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createHotSpotTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Hot Spot ÅŸablon baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Hot Spot ÅŸablon oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateHotSpotTemplate = useCallback(async (templateId: string, dto: HotSpotTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateHotSpotTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Hot Spot ÅŸablon baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Hot Spot ÅŸablon gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createDragAndDropTemplate = useCallback(async (dto: DragAndDropTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createDragAndDropTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('SÃ¼rÃ¼kle ve BÄ±rak ÅŸablon baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÃ¼rÃ¼kle ve BÄ±rak ÅŸablon oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateDragAndDropTemplate = useCallback(async (templateId: string, dto: DragAndDropTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateDragAndDropTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('SÃ¼rÃ¼kle ve BÄ±rak ÅŸablon baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÃ¼rÃ¼kle ve BÄ±rak ÅŸablon gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createAudioResponseTemplate = useCallback(async (dto: AudioResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createAudioResponseTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Ses yanÄ±t ÅŸablon baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Ses yanÄ±t ÅŸablon oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateAudioResponseTemplate = useCallback(async (templateId: string, dto: AudioResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateAudioResponseTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Ses yanÄ±t ÅŸablon baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Ses yanÄ±t ÅŸablon gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createVideoResponseTemplate = useCallback(async (dto: VideoResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createVideoResponseTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Video yanÄ±t ÅŸablon baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Video yanÄ±t ÅŸablon oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateVideoResponseTemplate = useCallback(async (templateId: string, dto: VideoResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateVideoResponseTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('Video yanÄ±t ÅŸablon baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Video yanÄ±t ÅŸablon gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createImageResponseTemplate = useCallback(async (dto: ImageResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.createImageResponseTemplate(dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('GÃ¶rsel yanÄ±t ÅŸablon baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('GÃ¶rsel yanÄ±t ÅŸablon oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateImageResponseTemplate = useCallback(async (templateId: string, dto: ImageResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const response = await templateService.updateImageResponseTemplate(templateId, dto);
            if (response.data && response.success) {
                setSelectedTemplate(response.data);
                await getAllTemplates();
                showNotification.success('GÃ¶rsel yanÄ±t ÅŸablon baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('GÃ¶rsel yanÄ±t ÅŸablon gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearTemplateData = useCallback(() => {
        setTemplates([]);
        setSelectedTemplate(null);
        setTemplateMap({});
        setTemplateTypeStatistics(null);
        setTemplateUsageStats(null);
        setValidationResult(null);
        setValidationErrors([]);
        setExamsUsingTemplate([]);
        setError(null);
    }, []);

    return {
        templates,
        selectedTemplate,
        templateMap,
        templateTypeStatistics,
        templateUsageStats,
        validationResult,
        validationErrors,
        examsUsingTemplate,
        loading,
        error,
        createTemplate,
        updateTemplate,
        getTemplateById,
        getTemplateByIdAndType,
        getAllTemplates,
        getTemplatesByType,
        deleteTemplate,
        activateTemplate,
        deactivateTemplate,
        duplicateTemplate,
        getTemplateMap,
        validateTemplate,
        getTemplateValidationErrors,
        validateTemplateData,
        isTemplateInUse,
        getExamsUsingTemplate,
        searchTemplates,
        filterTemplates,
        getTemplatesBySubject,
        getTemplatesByDifficulty,
        getTemplatesByCreator,
        getTemplateTypeStatistics,
        getMostUsedTemplates,
        getRecentTemplates,
        getTemplateUsageStats,
        clearTemplateData,
        // Specific template type operations
        createMultipleChoiceTemplate,
        updateMultipleChoiceTemplate,
        createTrueFalseTemplate,
        updateTrueFalseTemplate,
        createFillInTheBlanksTemplate,
        updateFillInTheBlanksTemplate,
        createShortAnswerTemplate,
        updateShortAnswerTemplate,
        createMatchingTemplate,
        updateMatchingTemplate,
        createEssayTemplate,
        updateEssayTemplate,
        createOrderingTemplate,
        updateOrderingTemplate,
        createMultipleResponseTemplate,
        updateMultipleResponseTemplate,
        createHotSpotTemplate,
        updateHotSpotTemplate,
        createDragAndDropTemplate,
        updateDragAndDropTemplate,
        createAudioResponseTemplate,
        updateAudioResponseTemplate,
        createVideoResponseTemplate,
        updateVideoResponseTemplate,
        createImageResponseTemplate,
        updateImageResponseTemplate
    };
};


import { useState, useCallback } from 'react';

import {
ApplicationDto,
ApplicationFormData,
StartApplicationRequest,
CompleteApplicationRequest,
BulkCreateApplicationRequest,
ApplicationStatistics,
ExamSessionApplicationsSummary,
ApplicationSearchParams
} from '@/types/management/brand';
import { showNotification } from '@/lib/notification';
import {applicationService} from "@/services/api/management/appication-service";

interface UseApplicationReturn {
applications: ApplicationDto[] | null;
selectedApplication: ApplicationDto | null;
examSessionApplications: ApplicationDto[] | null;
candidateApplications: ApplicationDto[] | null;
awaitingEvaluationApplications: ApplicationDto[] | null;
applicationStatistics: ApplicationStatistics | null;
examSessionApplicationsSummary: ExamSessionApplicationsSummary | null;
loading: boolean;
error: Error | null;
createApplication: (createRequest: ApplicationFormData) => Promise<void>;
updateApplication: (updateRequest: ApplicationFormData) => Promise<void>;
startApplication: (startRequest: StartApplicationRequest) => Promise<void>;
completeApplication: (completeRequest: CompleteApplicationRequest) => Promise<void>;
getApplicationById: (id: string) => Promise<void>;
getApplicationsByExamSession: (examSessionId: string) => Promise<void>;
getApplicationsByCandidate: (candidateId: string) => Promise<void>;
getApplicationsAwaitingEvaluation: () => Promise<void>;
bulkCreateApplications: (bulkRequest: BulkCreateApplicationRequest) => Promise<void>;
deleteApplication: (id: string) => Promise<void>;
getApplicationStatistics: (examSessionId: string) => Promise<void>;
getExamSessionApplicationsSummary: (examSessionId: string) => Promise<void>;
searchApplications: (searchParams?: ApplicationSearchParams) => Promise<void>;
startApplicationById: (applicationId: string) => Promise<void>;
completeApplicationById: (applicationId: string) => Promise<void>;
quickCreateApplication: (name: string, code: string, examId: string, examSessionId: string, candidateId: string, username?: string) => Promise<void>;
createApplicationsForCandidates: (examSessionId: string, examId: string, candidateIds: string[], namePrefix?: string, codePrefix?: string) => Promise<void>;
clearApplicationData: () => void;
}

export const useApplication = (): UseApplicationReturn => {
const [applications, setApplications] = useState<ApplicationDto[] | null>(null);
const [selectedApplication, setSelectedApplication] = useState<ApplicationDto | null>(null);
const [examSessionApplications, setExamSessionApplications] = useState<ApplicationDto[] | null>(null);
const [candidateApplications, setCandidateApplications] = useState<ApplicationDto[] | null>(null);
const [awaitingEvaluationApplications, setAwaitingEvaluationApplications] = useState<ApplicationDto[] | null>(null);
const [applicationStatistics, setApplicationStatistics] = useState<ApplicationStatistics | null>(null);
const [examSessionApplicationsSummary, setExamSessionApplicationsSummary] = useState<ExamSessionApplicationsSummary | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createApplication = useCallback(async (createRequest: ApplicationFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.createApplication(createRequest);
            if (response.data && response.success) {
                setSelectedApplication(response.data);
                showNotification.success('BaÅŸvuru baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸvuru oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateApplication = useCallback(async (updateRequest: ApplicationFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.updateApplication(updateRequest.id, updateRequest);
            if (response.data && response.success) {
                setSelectedApplication(response.data);
                showNotification.success('BaÅŸvuru baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸvuru gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const startApplication = useCallback(async (startRequest: StartApplicationRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.startApplication(startRequest);
            if (response.data && response.success) {
                setSelectedApplication(response.data);
                showNotification.success('BaÅŸvuru baÅŸarÄ±yla baÅŸlatÄ±ldÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸvuru baÅŸlatÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const completeApplication = useCallback(async (completeRequest: CompleteApplicationRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.completeApplication(completeRequest);
            if (response.data && response.success) {
                setSelectedApplication(response.data);
                showNotification.success('BaÅŸvuru baÅŸarÄ±yla tamamlandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸvuru tamamlanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.getApplicationById(id);
            if (response.data && response.success) {
                setSelectedApplication(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸvuru alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationsByExamSession = useCallback(async (examSessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.getApplicationsByExamSession(examSessionId);
            if (response.data && response.success) {
                setExamSessionApplications(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav oturumu baÅŸvurularÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationsByCandidate = useCallback(async (candidateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.getApplicationsByCandidate(candidateId);
            if (response.data && response.success) {
                setCandidateApplications(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aday baÅŸvurularÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationsAwaitingEvaluation = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.getApplicationsAwaitingEvaluation();
            if (response.data && response.success) {
                setAwaitingEvaluationApplications(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DeÄŸerlendirme bekleyen baÅŸvurular alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateApplications = useCallback(async (bulkRequest: BulkCreateApplicationRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.bulkCreateApplications(bulkRequest);
            if (response.data && response.success) {
                setApplications(response.data);
                showNotification.success('BaÅŸvurular baÅŸarÄ±yla toplu oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸvurular toplu oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteApplication = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.deleteApplication(id);
            if (response.success) {
                showNotification.success('BaÅŸvuru baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸvuru silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationStatistics = useCallback(async (examSessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.getApplicationStatistics(examSessionId);
            if (response.data && response.success) {
                setApplicationStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸvuru istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSessionApplicationsSummary = useCallback(async (examSessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.getExamSessionApplicationsSummary(examSessionId);
            if (response.data && response.success) {
                setExamSessionApplicationsSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav oturumu baÅŸvuru Ã¶zeti alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchApplications = useCallback(async (searchParams: ApplicationSearchParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.searchApplications(searchParams);
            if (response.data && response.success) {
                setApplications(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸvuru arama yapÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const startApplicationById = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.startApplicationById(applicationId);
            if (response.data && response.success) {
                setSelectedApplication(response.data);
                showNotification.success('BaÅŸvuru baÅŸarÄ±yla baÅŸlatÄ±ldÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸvuru baÅŸlatÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const completeApplicationById = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.completeApplicationById(applicationId);
            if (response.data && response.success) {
                setSelectedApplication(response.data);
                showNotification.success('BaÅŸvuru baÅŸarÄ±yla tamamlandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸvuru tamamlanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const quickCreateApplication = useCallback(async (
        name: string,
        code: string,
        examId: string,
        examSessionId: string,
        candidateId: string,
        username?: string
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.quickCreateApplication(
                name, code, examId, examSessionId, candidateId, username
            );
            if (response.data && response.success) {
                setSelectedApplication(response.data);
                showNotification.success('HÄ±zlÄ± baÅŸvuru baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('HÄ±zlÄ± baÅŸvuru oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const createApplicationsForCandidates = useCallback(async (
        examSessionId: string,
        examId: string,
        candidateIds: string[],
        namePrefix: string = "Application",
        codePrefix: string = "APP"
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationService.createApplicationsForCandidates(
                examSessionId, examId, candidateIds, namePrefix, codePrefix
            );
            if (response.data && response.success) {
                setApplications(response.data);
                showNotification.success('Adaylar iÃ§in baÅŸvurular baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Adaylar iÃ§in baÅŸvurular oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearApplicationData = useCallback(() => {
        setApplications(null);
        setSelectedApplication(null);
        setExamSessionApplications(null);
        setCandidateApplications(null);
        setAwaitingEvaluationApplications(null);
        setApplicationStatistics(null);
        setExamSessionApplicationsSummary(null);
        setError(null);
    }, []);

    return {
        applications,
        selectedApplication,
        examSessionApplications,
        candidateApplications,
        awaitingEvaluationApplications,
        applicationStatistics,
        examSessionApplicationsSummary,
        loading,
        error,
        createApplication,
        updateApplication,
        startApplication,
        completeApplication,
        getApplicationById,
        getApplicationsByExamSession,
        getApplicationsByCandidate,
        getApplicationsAwaitingEvaluation,
        bulkCreateApplications,
        deleteApplication,
        getApplicationStatistics,
        getExamSessionApplicationsSummary,
        searchApplications,
        startApplicationById,
        completeApplicationById,
        quickCreateApplication,
        createApplicationsForCandidates,
        clearApplicationData
    };
};



import { useState, useCallback } from 'react';

import {
BranchDto,
BranchStatistics,
BrandBranchesSummary,
CopyBranchRequest,
MoveBranchRequest, BranchFormData
} from '@/types/management/brand';
import { showNotification } from '@/lib/notification';
import {branchService} from "@/services/api/management/branch-service";

interface UseBranchReturn {
branches: BranchDto[] | null;
selectedBranch: BranchDto | null;
brandBranches: BranchDto[] | null;
branchStatistics: BranchStatistics | null;
brandBranchesSummary: BrandBranchesSummary | null;
loading: boolean;
error: Error | null;
createBranch: (createRequest: BranchFormData) => Promise<void>;
updateBranch: (updateRequest: BranchFormData) => Promise<void>;
getBranchById: (id: string) => Promise<void>;
getBranchByCode: (code: string) => Promise<void>;
getBranchesByBrand: (brandId: string) => Promise<void>;
getAllBranches: () => Promise<void>;
searchBranchesByName: (name: string) => Promise<void>;
deleteBranch: (id: string) => Promise<void>;
copyBranch: (branchId: string, copyRequest: CopyBranchRequest) => Promise<void>;
moveBranch: (branchId: string, moveRequest: MoveBranchRequest) => Promise<void>;
bulkCreateBranches: (createRequests: BranchFormData[]) => Promise<void>;
getBranchStatistics: (id: string) => Promise<void>;
getBrandBranchesSummary: (brandId: string) => Promise<void>;
clearBranchData: () => void;
}

export const useBranch = (): UseBranchReturn => {
const [branches, setBranches] = useState<BranchDto[] | null>(null);
const [selectedBranch, setSelectedBranch] = useState<BranchDto | null>(null);
const [brandBranches, setBrandBranches] = useState<BranchDto[] | null>(null);
const [branchStatistics, setBranchStatistics] = useState<BranchStatistics | null>(null);
const [brandBranchesSummary, setBrandBranchesSummary] = useState<BrandBranchesSummary | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createBranch = useCallback(async (createRequest: BranchFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.createBranch(createRequest);
            if (response.data && response.success) {
                setSelectedBranch(response.data);
                showNotification.success('Åžube baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžube oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateBranch = useCallback(async (updateRequest: BranchFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.updateBranch(updateRequest.id, updateRequest);
            if (response.data && response.success) {
                setSelectedBranch(response.data);
                showNotification.success('Åžube baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžube gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBranchById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.getBranchById(id);
            if (response.data && response.success) {
                setSelectedBranch(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžube alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBranchByCode = useCallback(async (code: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.getBranchByCode(code);
            if (response.data && response.success) {
                setSelectedBranch(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžube kod ile alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBranchesByBrand = useCallback(async (brandId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.getBranchesByBrand(brandId);
            if (response.data && response.success) {
                setBrandBranches(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka ÅŸubeleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllBranches = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.getAllBranches();
            if (response.data && response.success) {
                setBranches(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžubeler alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchBranchesByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.searchBranchesByName(name);
            if (response.data && response.success) {
                setBranches(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžube arama yapÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteBranch = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.deleteBranch(id);
            if (response.success) {
                showNotification.success('Åžube baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžube silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyBranch = useCallback(async (branchId: string, copyRequest: CopyBranchRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.copyBranch(branchId, copyRequest);
            if (response.data && response.success) {
                setSelectedBranch(response.data);
                showNotification.success('Åžube baÅŸarÄ±yla kopyalandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžube kopyalanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const moveBranch = useCallback(async (branchId: string, moveRequest: MoveBranchRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.moveBranch(branchId, moveRequest);
            if (response.data && response.success) {
                setSelectedBranch(response.data);
                showNotification.success('Åžube baÅŸarÄ±yla taÅŸÄ±ndÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžube taÅŸÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateBranches = useCallback(async (createRequests: BranchFormData[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.bulkCreateBranches(createRequests);
            if (response.data && response.success) {
                setBranches(response.data);
                showNotification.success('Åžubeler baÅŸarÄ±yla toplu oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžubeler toplu oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBranchStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.getBranchStatistics(id);
            if (response.data && response.success) {
                setBranchStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžube istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getBrandBranchesSummary = useCallback(async (brandId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await branchService.getBrandBranchesSummary(brandId);
            if (response.data && response.success) {
                setBrandBranchesSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Marka ÅŸubeleri Ã¶zeti alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearBranchData = useCallback(() => {
        setBranches(null);
        setSelectedBranch(null);
        setBrandBranches(null);
        setBranchStatistics(null);
        setBrandBranchesSummary(null);
        setError(null);
    }, []);

    return {
        branches,
        selectedBranch,
        brandBranches,
        branchStatistics,
        brandBranchesSummary,
        loading,
        error,
        createBranch,
        updateBranch,
        getBranchById,
        getBranchByCode,
        getBranchesByBrand,
        getAllBranches,
        searchBranchesByName,
        deleteBranch,
        copyBranch,
        moveBranch,
        bulkCreateBranches,
        getBranchStatistics,
        getBrandBranchesSummary,
        clearBranchData
    };
};



import { useState, useCallback } from 'react';

import {
UpdateQuestionOptionRequest,
QuestionOptionStatistics,
QuestionOptionAnalysis,
QuestionOptionValidation,

} from '@/types/exam/examResponses';;
import { showNotification } from '@/lib/notification';
import {QuestionOptionDto} from "@/types/exam/examEntities";
import {CreateQuestionOptionRequest} from "@/types/exam/examRequests";
import {EMediaType} from "@/types/exam/enum";
import {questionOptionService} from "@/services/api/exam/question-option-service";

interface UseQuestionOptionReturn {
questionOptions: QuestionOptionDto[];
selectedOption: QuestionOptionDto | null;
optionsByQuestion: QuestionOptionDto[];
secureOptionsByQuestion: QuestionOptionDto[];
searchResults: QuestionOptionDto[];
optionStatistics: QuestionOptionStatistics | null;
optionAnalysis: QuestionOptionAnalysis | null;
optionValidation: QuestionOptionValidation | null;
loading: boolean;
error: Error | null;
createQuestionOption: (questionId: string, createRequest: CreateQuestionOptionRequest) => Promise<void>;
updateQuestionOption: (id: string, updateRequest: UpdateQuestionOptionRequest) => Promise<void>;
getQuestionOptionById: (id: string) => Promise<void>;
getQuestionOptionsByQuestion: (questionId: string) => Promise<void>;
getSecureQuestionOptionsByQuestion: (questionId: string) => Promise<void>;
deleteQuestionOption: (id: string) => Promise<void>;
reorderQuestionOptions: (questionId: string, optionIds: string[]) => Promise<void>;
setCorrectAnswers: (questionId: string, correctOptionIds: string[]) => Promise<void>;
copyQuestionOption: (optionId: string, targetQuestionId: string) => Promise<void>;
bulkCreateQuestionOptions: (questionId: string, createRequests: CreateQuestionOptionRequest[]) => Promise<void>;
getQuestionOptionStatistics: (questionId: string) => Promise<void>;
searchQuestionOptions: (questionId?: string, mediaType?: EMediaType, content?: string, isTrueOption?: boolean) => Promise<void>;
analyzeQuestionOptions: (questionId: string) => Promise<void>;
validateQuestionOptions: (questionId: string) => Promise<void>;
shuffleQuestionOptions: (questionId: string) => Promise<void>;
clearOptionData: () => void;
}

export const useQuestionOption = (): UseQuestionOptionReturn => {
const [questionOptions, setQuestionOptions] = useState<QuestionOptionDto[]>([]);
const [selectedOption, setSelectedOption] = useState<QuestionOptionDto | null>(null);
const [optionsByQuestion, setOptionsByQuestion] = useState<QuestionOptionDto[]>([]);
const [secureOptionsByQuestion, setSecureOptionsByQuestion] = useState<QuestionOptionDto[]>([]);
const [searchResults, setSearchResults] = useState<QuestionOptionDto[]>([]);
const [optionStatistics, setOptionStatistics] = useState<QuestionOptionStatistics | null>(null);
const [optionAnalysis, setOptionAnalysis] = useState<QuestionOptionAnalysis | null>(null);
const [optionValidation, setOptionValidation] = useState<QuestionOptionValidation | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createQuestionOption = useCallback(async (questionId: string, createRequest: CreateQuestionOptionRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.createQuestionOption(questionId, createRequest);
            if (response.data && response.success) {
                setSelectedOption(response.data);
                showNotification.success('Soru seÃ§eneÄŸi baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seÃ§eneÄŸi oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateQuestionOption = useCallback(async (id: string, updateRequest: UpdateQuestionOptionRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.updateQuestionOption(id, updateRequest);
            if (response.data && response.success) {
                setSelectedOption(response.data);
                showNotification.success('Soru seÃ§eneÄŸi baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seÃ§eneÄŸi gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionOptionById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.getQuestionOptionById(id);
            if (response.data && response.success) {
                setSelectedOption(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seÃ§eneÄŸi alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionOptionsByQuestion = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.getQuestionOptionsByQuestion(questionId);
            if (response.data && response.success) {
                setOptionsByQuestion(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seÃ§enekleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getSecureQuestionOptionsByQuestion = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.getSecureQuestionOptionsByQuestion(questionId);
            if (response.data && response.success) {
                setSecureOptionsByQuestion(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('GÃ¼venli soru seÃ§enekleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteQuestionOption = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.deleteQuestionOption(id);
            if (response.success) {
                showNotification.success('Soru seÃ§eneÄŸi baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seÃ§eneÄŸi silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const reorderQuestionOptions = useCallback(async (questionId: string, optionIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.reorderQuestionOptions(questionId, optionIds);
            if (response.data && response.success) {
                setOptionsByQuestion(response.data);
                showNotification.success('Soru seÃ§enekleri baÅŸarÄ±yla yeniden sÄ±ralandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seÃ§enekleri sÄ±ralanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const setCorrectAnswers = useCallback(async (questionId: string, correctOptionIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.setCorrectAnswers(questionId, correctOptionIds);
            if (response.data && response.success) {
                setOptionsByQuestion(response.data);
                showNotification.success('DoÄŸru cevaplar baÅŸarÄ±yla belirlendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DoÄŸru cevaplar belirlenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyQuestionOption = useCallback(async (optionId: string, targetQuestionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.copyQuestionOption(optionId, targetQuestionId);
            if (response.data && response.success) {
                setSelectedOption(response.data);
                showNotification.success('Soru seÃ§eneÄŸi baÅŸarÄ±yla kopyalandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seÃ§eneÄŸi kopyalanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateQuestionOptions = useCallback(async (questionId: string, createRequests: CreateQuestionOptionRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.bulkCreateQuestionOptions(questionId, createRequests);
            if (response.data && response.success) {
                setQuestionOptions(response.data);
                showNotification.success('Soru seÃ§enekleri baÅŸarÄ±yla toplu oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seÃ§enekleri toplu oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionOptionStatistics = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.getQuestionOptionStatistics(questionId);
            if (response.data && response.success) {
                setOptionStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SeÃ§enek istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchQuestionOptions = useCallback(async (
        questionId?: string,
        mediaType?: EMediaType,
        content?: string,
        isTrueOption?: boolean
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.searchQuestionOptions(questionId, mediaType, content, isTrueOption);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seÃ§enekleri aranÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const analyzeQuestionOptions = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.analyzeQuestionOptions(questionId);
            if (response.data && response.success) {
                setOptionAnalysis(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seÃ§enekleri analiz edilirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateQuestionOptions = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.validateQuestionOptions(questionId);
            if (response.data && response.success) {
                setOptionValidation(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seÃ§enekleri doÄŸrulanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const shuffleQuestionOptions = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionOptionService.shuffleQuestionOptions(questionId);
            if (response.data && response.success) {
                setOptionsByQuestion(response.data);
                showNotification.success('Soru seÃ§enekleri baÅŸarÄ±yla karÄ±ÅŸtÄ±rÄ±ldÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru seÃ§enekleri karÄ±ÅŸtÄ±rÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearOptionData = useCallback(() => {
        setQuestionOptions([]);
        setSelectedOption(null);
        setOptionsByQuestion([]);
        setSecureOptionsByQuestion([]);
        setSearchResults([]);
        setOptionStatistics(null);
        setOptionAnalysis(null);
        setOptionValidation(null);
        setError(null);
    }, []);

    return {
        questionOptions,
        selectedOption,
        optionsByQuestion,
        secureOptionsByQuestion,
        searchResults,
        optionStatistics,
        optionAnalysis,
        optionValidation,
        loading,
        error,
        createQuestionOption,
        updateQuestionOption,
        getQuestionOptionById,
        getQuestionOptionsByQuestion,
        getSecureQuestionOptionsByQuestion,
        deleteQuestionOption,
        reorderQuestionOptions,
        setCorrectAnswers,
        copyQuestionOption,
        bulkCreateQuestionOptions,
        getQuestionOptionStatistics,
        searchQuestionOptions,
        analyzeQuestionOptions,
        validateQuestionOptions,
        shuffleQuestionOptions,
        clearOptionData
    };
};



// questionTemplates.ts


import {EMediaType, EQuestionType, EStatus} from "@/types/exam/enum";

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
difficulty?: string;
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
questionType?: EQuestionType; 
difficultyIndex?: number;
discriminationIndex?: number;
totalAttempts?: number;
correctAttempts?: number;
averageTimeSpent?: number;
commonMistakes?: string[];
recommendation?: string; // Example string literal type
}



import { useState, useCallback } from 'react';
import {
ExamSessionFormData,
ExamSessionSearchRequest,
ExamSessionListResponse,
ExamSessionStatistics,
SessionDashboard,
SessionApplicationDto,
UpdateStatusRequest,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import {ExamSessionDto} from "@/types/exam/examEntities";
import {examSessionService} from "@/services/api/exam/exam-session-service";

interface UseExamSessionReturn {
examSessions: ExamSessionListResponse | null;
selectedExamSession: ExamSessionDto | null;
examSessionsByBranch: ExamSessionDto[];
upcomingExamSessions: ExamSessionDto[];
activeExamSessions: ExamSessionDto[];
completedExamSessions: ExamSessionDto[];
sessionStatistics: ExamSessionStatistics | null;
sessionDashboard: SessionDashboard | null;
sessionApplications: SessionApplicationDto[];
loading: boolean;
error: Error | null;
createExamSession: (createRequest: ExamSessionFormData) => Promise<void>;
updateExamSession: (updateRequest: ExamSessionFormData) => Promise<void>;
getExamSessionById: (id: string) => Promise<void>;
getExamSessions: (searchRequest?: ExamSessionSearchRequest) => Promise<void>;
deleteExamSession: (id: string) => Promise<void>;
addSupervisor: (sessionId: string, supervisorId: string) => Promise<void>;
removeSupervisor: (sessionId: string, supervisorId: string) => Promise<void>;
getExamSessionsByBranch: (branchId: string) => Promise<void>;
getUpcomingExamSessions: () => Promise<void>;
getExamSessionStatistics: (id: string) => Promise<void>;
copyExamSession: (id: string, newName: string, newStartDate: string) => Promise<void>;
getActiveExamSessions: () => Promise<void>;
getCompletedExamSessions: (page?: number, size?: number) => Promise<void>;
getSessionDashboard: () => Promise<void>;
getSessionApplications: (id: string, status?: string, page?: number, size?: number) => Promise<void>;
updateSessionStatus: (id: string, statusRequest: UpdateStatusRequest) => Promise<void>;
clearSessionData: () => void;
}

export const useExamSession = (): UseExamSessionReturn => {
const [examSessions, setExamSessions] = useState<ExamSessionListResponse | null>(null);
const [selectedExamSession, setSelectedExamSession] = useState<ExamSessionDto | null>(null);
const [examSessionsByBranch, setExamSessionsByBranch] = useState<ExamSessionDto[]>([]);
const [upcomingExamSessions, setUpcomingExamSessions] = useState<ExamSessionDto[]>([]);
const [activeExamSessions, setActiveExamSessions] = useState<ExamSessionDto[]>([]);
const [completedExamSessions, setCompletedExamSessions] = useState<ExamSessionDto[]>([]);
const [sessionStatistics, setSessionStatistics] = useState<ExamSessionStatistics | null>(null);
const [sessionDashboard, setSessionDashboard] = useState<SessionDashboard | null>(null);
const [sessionApplications, setSessionApplications] = useState<SessionApplicationDto[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createExamSession = useCallback(async (createRequest: ExamSessionFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.createExamSession(createRequest);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                showNotification.success('SÄ±nav oturumu baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav oturumu oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExamSession = useCallback(async (updateRequest: ExamSessionFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.updateExamSession(updateRequest.id, updateRequest);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                showNotification.success('SÄ±nav oturumu baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav oturumu gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSessionById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getExamSessionById(id);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav oturumu alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSessions = useCallback(async (searchRequest: ExamSessionSearchRequest = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getExamSessions(searchRequest);
            if (response.data && response.success) {
                setExamSessions(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav oturumlarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteExamSession = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.deleteExamSession(id);
            if (response.success) {
                showNotification.success('SÄ±nav oturumu baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav oturumu silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const addSupervisor = useCallback(async (sessionId: string, supervisorId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.addSupervisor(sessionId, supervisorId);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                showNotification.success('GÃ¶zetmen baÅŸarÄ±yla eklendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('GÃ¶zetmen eklenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const removeSupervisor = useCallback(async (sessionId: string, supervisorId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.removeSupervisor(sessionId, supervisorId);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                showNotification.success('GÃ¶zetmen baÅŸarÄ±yla kaldÄ±rÄ±ldÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('GÃ¶zetmen kaldÄ±rÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSessionsByBranch = useCallback(async (branchId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getExamSessionsByBranch(branchId);
            if (response.data && response.success) {
                setExamSessionsByBranch(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžube sÄ±nav oturumlarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUpcomingExamSessions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getUpcomingExamSessions();
            if (response.data && response.success) {
                setUpcomingExamSessions(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('YaklaÅŸan sÄ±nav oturumlarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSessionStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getExamSessionStatistics(id);
            if (response.data && response.success) {
                setSessionStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav oturumu istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyExamSession = useCallback(async (id: string, newName: string, newStartDate: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.copyExamSession(id, newName, newStartDate);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                showNotification.success('SÄ±nav oturumu baÅŸarÄ±yla kopyalandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav oturumu kopyalanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getActiveExamSessions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getActiveExamSessions();
            if (response.data && response.success) {
                setActiveExamSessions(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aktif sÄ±nav oturumlarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCompletedExamSessions = useCallback(async (page: number = 0, size: number = 20) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getCompletedExamSessions(page, size);
            if (response.data && response.success) {
                setCompletedExamSessions(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Tamamlanan sÄ±nav oturumlarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getSessionDashboard = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getSessionDashboard();
            if (response.data && response.success) {
                setSessionDashboard(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Oturum panosu alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getSessionApplications = useCallback(async (id: string, status?: string, page: number = 0, size: number = 20) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.getSessionApplications(id, status, page, size);
            if (response.data && response.success) {
                setSessionApplications(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Oturum baÅŸvurularÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSessionStatus = useCallback(async (id: string, statusRequest: UpdateStatusRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSessionService.updateSessionStatus(id, statusRequest);
            if (response.data && response.success) {
                setSelectedExamSession(response.data);
                showNotification.success('Oturum durumu baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Oturum durumu gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearSessionData = useCallback(() => {
        setExamSessions(null);
        setSelectedExamSession(null);
        setExamSessionsByBranch([]);
        setUpcomingExamSessions([]);
        setActiveExamSessions([]);
        setCompletedExamSessions([]);
        setSessionStatistics(null);
        setSessionDashboard(null);
        setSessionApplications([]);
        setError(null);
    }, []);

    return {
        examSessions,
        selectedExamSession,
        examSessionsByBranch,
        upcomingExamSessions,
        activeExamSessions,
        completedExamSessions,
        sessionStatistics,
        sessionDashboard,
        sessionApplications,
        loading,
        error,
        createExamSession,
        updateExamSession,
        getExamSessionById,
        getExamSessions,
        deleteExamSession,
        addSupervisor,
        removeSupervisor,
        getExamSessionsByBranch,
        getUpcomingExamSessions,
        getExamSessionStatistics,
        copyExamSession,
        getActiveExamSessions,
        getCompletedExamSessions,
        getSessionDashboard,
        getSessionApplications,
        updateSessionStatus,
        clearSessionData
    };
};



import { useState, useCallback } from 'react';

import {
UpdateExamSectionRequest,
ExamSectionStatistics,
ExamSectionsSummary,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import {ExamSectionDto} from "@/types/exam/examTemplates";
import {CreateExamSectionRequest} from "@/types/exam/examEntities";
import {examSectionService} from "@/services/api/exam/exam-section-service";

interface UseExamSectionReturn {
examSections: ExamSectionDto[];
selectedExamSection: ExamSectionDto | null;
sectionsByExamType: ExamSectionDto[];
searchResults: ExamSectionDto[];
sectionStatistics: ExamSectionStatistics | null;
sectionsSummary: ExamSectionsSummary | null;
loading: boolean;
error: Error | null;
createExamSection: (createRequest: CreateExamSectionRequest) => Promise<void>;
updateExamSection: (id: string, updateRequest: UpdateExamSectionRequest) => Promise<void>;
getExamSectionById: (id: string) => Promise<void>;
getExamSectionsByExamType: (examTypeId: string) => Promise<void>;
deleteExamSection: (id: string) => Promise<void>;
reorderExamSections: (examTypeId: string, sectionIds: string[]) => Promise<void>;
copyExamSection: (sectionId: string, targetExamTypeId: string) => Promise<void>;
moveExamSection: (sectionId: string, targetExamTypeId: string) => Promise<void>;
bulkCreateExamSections: (examTypeId: string, createRequests: CreateExamSectionRequest[]) => Promise<void>;
getExamSectionStatistics: (id: string) => Promise<void>;
getExamSectionsSummary: (examTypeId: string) => Promise<void>;
searchExamSections: (name?: string, examTypeId?: string, hasQuestionGroups?: boolean) => Promise<void>;
clearExamSectionData: () => void;
}

export const useExamSection = (): UseExamSectionReturn => {
const [examSections, setExamSections] = useState<ExamSectionDto[]>([]);
const [selectedExamSection, setSelectedExamSection] = useState<ExamSectionDto | null>(null);
const [sectionsByExamType, setSectionsByExamType] = useState<ExamSectionDto[]>([]);
const [searchResults, setSearchResults] = useState<ExamSectionDto[]>([]);
const [sectionStatistics, setSectionStatistics] = useState<ExamSectionStatistics | null>(null);
const [sectionsSummary, setSectionsSummary] = useState<ExamSectionsSummary | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createExamSection = useCallback(async (createRequest: CreateExamSectionRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.createExamSection(createRequest);
            if (response.data && response.success) {
                setSelectedExamSection(response.data);
                showNotification.success('SÄ±nav bÃ¶lÃ¼mÃ¼ baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav bÃ¶lÃ¼mÃ¼ oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExamSection = useCallback(async (id: string, updateRequest: UpdateExamSectionRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.updateExamSection(id, updateRequest);
            if (response.data && response.success) {
                setSelectedExamSection(response.data);
                showNotification.success('SÄ±nav bÃ¶lÃ¼mÃ¼ baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav bÃ¶lÃ¼mÃ¼ gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSectionById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.getExamSectionById(id);
            if (response.data && response.success) {
                setSelectedExamSection(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav bÃ¶lÃ¼mÃ¼ alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSectionsByExamType = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.getExamSectionsByExamType(examTypeId);
            if (response.data && response.success) {
                setSectionsByExamType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav tipi bÃ¶lÃ¼mleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteExamSection = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.deleteExamSection(id);
            if (response.data && response.success) {
                showNotification.success('SÄ±nav bÃ¶lÃ¼mÃ¼ baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav bÃ¶lÃ¼mÃ¼ silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const reorderExamSections = useCallback(async (examTypeId: string, sectionIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.reorderExamSections(examTypeId, sectionIds);
            if (response.data && response.success) {
                setSectionsByExamType(response.data);
                showNotification.success('SÄ±nav bÃ¶lÃ¼mleri baÅŸarÄ±yla yeniden sÄ±ralandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav bÃ¶lÃ¼mleri sÄ±ralanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyExamSection = useCallback(async (sectionId: string, targetExamTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.copyExamSection(sectionId, targetExamTypeId);
            if (response.data && response.success) {
                setSelectedExamSection(response.data);
                showNotification.success('SÄ±nav bÃ¶lÃ¼mÃ¼ baÅŸarÄ±yla kopyalandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav bÃ¶lÃ¼mÃ¼ kopyalanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const moveExamSection = useCallback(async (sectionId: string, targetExamTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.moveExamSection(sectionId, targetExamTypeId);
            if (response.data && response.success) {
                setSelectedExamSection(response.data);
                showNotification.success('SÄ±nav bÃ¶lÃ¼mÃ¼ baÅŸarÄ±yla taÅŸÄ±ndÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav bÃ¶lÃ¼mÃ¼ taÅŸÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateExamSections = useCallback(async (examTypeId: string, createRequests: CreateExamSectionRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.bulkCreateExamSections(examTypeId, createRequests);
            if (response.data && response.success) {
                setExamSections(response.data);
                showNotification.success('SÄ±nav bÃ¶lÃ¼mleri baÅŸarÄ±yla toplu oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav bÃ¶lÃ¼mleri toplu oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSectionStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.getExamSectionStatistics(id);
            if (response.data && response.success) {
                setSectionStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BÃ¶lÃ¼m istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSectionsSummary = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.getExamSectionsSummary(examTypeId);
            if (response.data && response.success) {
                setSectionsSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BÃ¶lÃ¼m Ã¶zeti alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchExamSections = useCallback(async (
        name?: string,
        examTypeId?: string,
        hasQuestionGroups?: boolean
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examSectionService.searchExamSections(name, examTypeId, hasQuestionGroups);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav bÃ¶lÃ¼mleri aranÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearExamSectionData = useCallback(() => {
        setExamSections([]);
        setSelectedExamSection(null);
        setSectionsByExamType([]);
        setSearchResults([]);
        setSectionStatistics(null);
        setSectionsSummary(null);
        setError(null);
    }, []);

    return {
        examSections,
        selectedExamSection,
        sectionsByExamType,
        searchResults,
        sectionStatistics,
        sectionsSummary,
        loading,
        error,
        createExamSection,
        updateExamSection,
        getExamSectionById,
        getExamSectionsByExamType,
        deleteExamSection,
        reorderExamSections,
        copyExamSection,
        moveExamSection,
        bulkCreateExamSections,
        getExamSectionStatistics,
        getExamSectionsSummary,
        searchExamSections,
        clearExamSectionData
    };
};



import { useState, useCallback } from 'react';

import {
QuestionGroupQuestionStatistics,
QuestionValidation,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import {QuestionDto, QuestionSearchRequest} from "@/types/exam/examEntities";
import {CreateQuestionRequest} from "@/types/exam/examRequests";
import {EQuestionType} from "@/types/exam/enum";
import {questionService} from "@/services/api/exam/question-service";

interface UseQuestionReturn {
questions: QuestionDto[];
selectedQuestion: QuestionDto | null;
questionsByGroup: QuestionDto[];
questionsByTemplate: QuestionDto[];
questionsByType: QuestionDto[];
searchResults: QuestionDto[];
groupStatistics: QuestionGroupQuestionStatistics | null;
questionValidation: QuestionValidation | null;
loading: boolean;
error: Error | null;
createQuestion: (createRequest: CreateQuestionRequest) => Promise<void>;
updateQuestion: (id: string, updateRequest: CreateQuestionRequest) => Promise<void>;
getQuestionById: (id: string) => Promise<void>;
getQuestionsByGroup: (questionGroupId: string) => Promise<void>;
deleteQuestion: (id: string) => Promise<void>;
reorderQuestions: (questionGroupId: string, questionIds: string[]) => Promise<void>;
copyQuestion: (questionId: string, targetGroupId: string) => Promise<void>;
searchQuestions: (searchRequest: QuestionSearchRequest) => Promise<void>;
getQuestionsByTemplate: (templateId: string) => Promise<void>;
getQuestionsByType: (questionType: EQuestionType) => Promise<void>;
bulkCreateQuestions: (createRequests: CreateQuestionRequest[]) => Promise<void>;
getGroupQuestionStatistics: (questionGroupId: string) => Promise<void>;
validateQuestion: (id: string) => Promise<void>;
duplicateQuestion: (questionId: string, newName?: string) => Promise<void>;
clearQuestionData: () => void;
}

export const useQuestion = (): UseQuestionReturn => {
const [questions, setQuestions] = useState<QuestionDto[]>([]);
const [selectedQuestion, setSelectedQuestion] = useState<QuestionDto | null>(null);
const [questionsByGroup, setQuestionsByGroup] = useState<QuestionDto[]>([]);
const [questionsByTemplate, setQuestionsByTemplate] = useState<QuestionDto[]>([]);
const [questionsByType, setQuestionsByType] = useState<QuestionDto[]>([]);
const [searchResults, setSearchResults] = useState<QuestionDto[]>([]);
const [groupStatistics, setGroupStatistics] = useState<QuestionGroupQuestionStatistics | null>(null);
const [questionValidation, setQuestionValidation] = useState<QuestionValidation | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createQuestion = useCallback(async (createRequest: CreateQuestionRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.createQuestion(createRequest);
            if (response.data && response.success) {
                setSelectedQuestion(response.data);
                showNotification.success('Soru baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateQuestion = useCallback(async (id: string, updateRequest: CreateQuestionRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.updateQuestion(id, updateRequest);
            if (response.data && response.success) {
                setSelectedQuestion(response.data);
                showNotification.success('Soru baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.getQuestionById(id);
            if (response.data && response.success) {
                setSelectedQuestion(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionsByGroup = useCallback(async (questionGroupId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.getQuestionsByGroup(questionGroupId);
            if (response.data && response.success) {
                setQuestionsByGroup(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Grup sorularÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteQuestion = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.deleteQuestion(id);
            if (response.success) {
                showNotification.success('Soru baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const reorderQuestions = useCallback(async (questionGroupId: string, questionIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.reorderQuestions(questionGroupId, questionIds);
            if (response.data && response.success) {
                setQuestionsByGroup(response.data);
                showNotification.success('Sorular baÅŸarÄ±yla yeniden sÄ±ralandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sorular sÄ±ralanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyQuestion = useCallback(async (questionId: string, targetGroupId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.copyQuestion(questionId, targetGroupId);
            if (response.data && response.success) {
                setSelectedQuestion(response.data);
                showNotification.success('Soru baÅŸarÄ±yla kopyalandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru kopyalanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchQuestions = useCallback(async (searchRequest: QuestionSearchRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.searchQuestions(searchRequest);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru aranÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionsByTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.getQuestionsByTemplate(templateId);
            if (response.data && response.success) {
                setQuestionsByTemplate(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Åžablon sorularÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionsByType = useCallback(async (questionType: EQuestionType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.getQuestionsByType(questionType);
            if (response.data && response.success) {
                setQuestionsByType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Tip sorularÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateQuestions = useCallback(async (createRequests: CreateQuestionRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.bulkCreateQuestions(createRequests);
            if (response.data && response.success) {
                setQuestions(response.data);
                showNotification.success('Sorular baÅŸarÄ±yla toplu oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Sorular toplu oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getGroupQuestionStatistics = useCallback(async (questionGroupId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.getGroupQuestionStatistics(questionGroupId);
            if (response.data && response.success) {
                setGroupStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Grup istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateQuestion = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.validateQuestion(id);
            if (response.data && response.success) {
                setQuestionValidation(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru doÄŸrulanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const duplicateQuestion = useCallback(async (questionId: string, newName?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionService.duplicateQuestion(questionId, newName);
            if (response.data && response.success) {
                setSelectedQuestion(response.data);
                showNotification.success('Soru baÅŸarÄ±yla Ã§oÄŸaltÄ±ldÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru Ã§oÄŸaltÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearQuestionData = useCallback(() => {
        setQuestions([]);
        setSelectedQuestion(null);
        setQuestionsByGroup([]);
        setQuestionsByTemplate([]);
        setQuestionsByType([]);
        setSearchResults([]);
        setGroupStatistics(null);
        setQuestionValidation(null);
        setError(null);
    }, []);

    return {
        questions,
        selectedQuestion,
        questionsByGroup,
        questionsByTemplate,
        questionsByType,
        searchResults,
        groupStatistics,
        questionValidation,
        loading,
        error,
        createQuestion,
        updateQuestion,
        getQuestionById,
        getQuestionsByGroup,
        deleteQuestion,
        reorderQuestions,
        copyQuestion,
        searchQuestions,
        getQuestionsByTemplate,
        getQuestionsByType,
        bulkCreateQuestions,
        getGroupQuestionStatistics,
        validateQuestion,
        duplicateQuestion,
        clearQuestionData
    };
};



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
import {DatabaseObjectDto, UploadedFileDto} from "@/types/exam/miscDtos";


export type QuestionTemplateResponse = {
id: string;
title: string;
subject: string;
difficulty: string;
questionType: EQuestionType; 
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
questionType?: EQuestionType; 
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
examType?: EExamType; 
isFinalized?: boolean;
isActive?: boolean;
page?: number;
size?: number;
sortBy?: string;
sortDirection?: string;
}

export type FileTypeCount = {
documentType: EMediaType; 
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
export interface ExamSessionFormData extends DatabaseObjectDto{

    name: string;
    description: string;
    quota: number;
    startDate: Date | null;
    examTemplate: EExamType | null;
    branchId: string;
    brandId: string;
    examTypeId: string;
    supervisorIds: string[];
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
export interface ExamSessionListResponse{
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
export interface ExamTypeListResponse{
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

import {EExamType, EMediaType, EQuestionGroupTemplateLevel, EQuestionGroupType, EQuestionType} from "@/types/exam/enum";
import {BaseQuestionTemplateDto} from "@/types/exam/questionTemplates";

export type ExamReadyDto = {
examId: string;
examName: string;
examLevel: string;
examType: EExamType; 
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
groupType: EQuestionGroupType; 
level: EQuestionGroupTemplateLevel; 
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
questionType: EQuestionType; 
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
mediaType: EMediaType; 
content: string;
}

export type QuestionOptionReadyDto = {
optionId: string;
orderNumber: number;
mediaType: EMediaType; 
content: string;
baseContent: string;
}

export type QuestionPartReadyDto = {
partId: string;
orderNumber: number;
mediaType: EMediaType; 
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


import { useState, useCallback } from 'react';

import {
ApplicationGraderDto,
CreateApplicationGraderRequest,
UpdateApplicationGraderRequest,
GraderStatistics,
ApplicationGradingSummary,
GraderWorkload,
GraderSearchParams
} from '@/types/management/brand';
import { showNotification } from '@/lib/notification';
import {applicationGraderService} from "@/services/api/management/application-grader-service";

interface UseApplicationGraderReturn {
applicationGraders: ApplicationGraderDto[] | null;
gradersByApplication: ApplicationGraderDto[] | null;
applicationsByGrader: ApplicationGraderDto[] | null;
refereeGraders: ApplicationGraderDto[] | null;
graderStatistics: GraderStatistics | null;
applicationGradingSummary: ApplicationGradingSummary | null;
graderWorkload: GraderWorkload | null;
loading: boolean;
error: Error | null;
assignGraderToApplication: (createRequest: CreateApplicationGraderRequest) => Promise<void>;
updateGraderAssignment: (id: string, updateRequest: UpdateApplicationGraderRequest) => Promise<void>;
completeGrading: (id: string) => Promise<void>;
getGradersByApplication: (applicationId: string) => Promise<void>;
getApplicationsByGrader: (userId: string) => Promise<void>;
getRefereeGradersByApplication: (applicationId: string) => Promise<void>;
removeGraderFromApplication: (id: string) => Promise<void>;
bulkAssignGraders: (applicationId: string, assignmentRequests: CreateApplicationGraderRequest[]) => Promise<void>;
getGraderStatistics: (applicationId: string) => Promise<void>;
getApplicationGradingSummary: (applicationId: string) => Promise<void>;
getGraderWorkload: (userId: string) => Promise<void>;
searchGraderAssignments: (searchParams?: GraderSearchParams) => Promise<void>;
assignSingleGrader: (userId: string, applicationId: string, orderNumber: number, isReferee?: boolean, endEndDate?: string) => Promise<void>;
assignMultipleGraders: (applicationId: string, graderAssignments: Array<{userId: string; orderNumber: number; isReferee?: boolean; endEndDate?: string;}>) => Promise<void>;
assignRefereeGrader: (userId: string, applicationId: string, orderNumber: number, endEndDate?: string) => Promise<void>;
getCompletedGradersForApplication: (applicationId: string) => Promise<void>;
getPendingGradersForApplication: (applicationId: string) => Promise<void>;
getCompletedAssignmentsForGrader: (userId: string) => Promise<void>;
getPendingAssignmentsForGrader: (userId: string) => Promise<void>;
getRefereeAssignmentsForGrader: (userId: string) => Promise<void>;
completeMultipleGradings: (graderIds: string[]) => Promise<void>;
removeMultipleGraders: (graderIds: string[]) => Promise<void>;
getApplicationGradingProgress: (applicationId: string) => Promise<void>;
getGraderPerformanceData: (userId: string) => Promise<void>;
clearApplicationGraderData: () => void;
}

export const useApplicationGrader = (): UseApplicationGraderReturn => {
const [applicationGraders, setApplicationGraders] = useState<ApplicationGraderDto[] | null>(null);
const [gradersByApplication, setGradersByApplication] = useState<ApplicationGraderDto[] | null>(null);
const [applicationsByGrader, setApplicationsByGrader] = useState<ApplicationGraderDto[] | null>(null);
const [refereeGraders, setRefereeGraders] = useState<ApplicationGraderDto[] | null>(null);
const [graderStatistics, setGraderStatistics] = useState<GraderStatistics | null>(null);
const [applicationGradingSummary, setApplicationGradingSummary] = useState<ApplicationGradingSummary | null>(null);
const [graderWorkload, setGraderWorkload] = useState<GraderWorkload | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const assignGraderToApplication = useCallback(async (createRequest: CreateApplicationGraderRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.assignGraderToApplication(createRequest);
            if (response.data && response.success) {
                showNotification.success('DeÄŸerlendirici baÅŸarÄ±yla atandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DeÄŸerlendirici atanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateGraderAssignment = useCallback(async (id: string, updateRequest: UpdateApplicationGraderRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.updateGraderAssignment(id, updateRequest);
            if (response.data && response.success) {
                showNotification.success('DeÄŸerlendirici atamasÄ± baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DeÄŸerlendirici atamasÄ± gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const completeGrading = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.completeGrading(id);
            if (response.data && response.success) {
                showNotification.success('DeÄŸerlendirme baÅŸarÄ±yla tamamlandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DeÄŸerlendirme tamamlanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getGradersByApplication = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getGradersByApplication(applicationId);
            if (response.data && response.success) {
                setGradersByApplication(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸvuru deÄŸerlendiricileri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationsByGrader = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getApplicationsByGrader(userId);
            if (response.data && response.success) {
                setApplicationsByGrader(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DeÄŸerlendirici baÅŸvurularÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getRefereeGradersByApplication = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getRefereeGradersByApplication(applicationId);
            if (response.data && response.success) {
                setRefereeGraders(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Hakem deÄŸerlendiriciler alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const removeGraderFromApplication = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.removeGraderFromApplication(id);
            if (response.success) {
                showNotification.success('DeÄŸerlendirici baÅŸarÄ±yla kaldÄ±rÄ±ldÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DeÄŸerlendirici kaldÄ±rÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkAssignGraders = useCallback(async (applicationId: string, assignmentRequests: CreateApplicationGraderRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.bulkAssignGraders(applicationId, assignmentRequests);
            if (response.data && response.success) {
                setApplicationGraders(response.data);
                showNotification.success('DeÄŸerlendiriciler baÅŸarÄ±yla toplu atandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DeÄŸerlendiriciler toplu atanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getGraderStatistics = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getGraderStatistics(applicationId);
            if (response.data && response.success) {
                setGraderStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DeÄŸerlendirici istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationGradingSummary = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getApplicationGradingSummary(applicationId);
            if (response.data && response.success) {
                setApplicationGradingSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸvuru deÄŸerlendirme Ã¶zeti alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getGraderWorkload = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getGraderWorkload(userId);
            if (response.data && response.success) {
                setGraderWorkload(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DeÄŸerlendirici iÅŸ yÃ¼kÃ¼ alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchGraderAssignments = useCallback(async (searchParams: GraderSearchParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.searchGraderAssignments(searchParams);
            if (response.data && response.success) {
                setApplicationGraders(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DeÄŸerlendirici atamalarÄ± aranÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const assignSingleGrader = useCallback(async (
        userId: string,
        applicationId: string,
        orderNumber: number,
        isReferee: boolean = false,
        endEndDate?: string
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.assignSingleGrader(
                userId, applicationId, orderNumber, isReferee, endEndDate
            );
            if (response.data && response.success) {
                showNotification.success('DeÄŸerlendirici baÅŸarÄ±yla atandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DeÄŸerlendirici atanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const assignMultipleGraders = useCallback(async (
        applicationId: string,
        graderAssignments: Array<{
            userId: string;
            orderNumber: number;
            isReferee?: boolean;
            endEndDate?: string;
        }>
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.assignMultipleGraders(applicationId, graderAssignments);
            if (response.data && response.success) {
                setApplicationGraders(response.data);
                showNotification.success('Ã‡oklu deÄŸerlendiriciler baÅŸarÄ±yla atandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Ã‡oklu deÄŸerlendiriciler atanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const assignRefereeGrader = useCallback(async (
        userId: string,
        applicationId: string,
        orderNumber: number,
        endEndDate?: string
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.assignRefereeGrader(
                userId, applicationId, orderNumber, endEndDate
            );
            if (response.data && response.success) {
                showNotification.success('Hakem deÄŸerlendirici baÅŸarÄ±yla atandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Hakem deÄŸerlendirici atanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCompletedGradersForApplication = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getCompletedGradersForApplication(applicationId);
            if (response.data && response.success) {
                setApplicationGraders(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Tamamlanan deÄŸerlendiriciler alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getPendingGradersForApplication = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getPendingGradersForApplication(applicationId);
            if (response.data && response.success) {
                setApplicationGraders(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bekleyen deÄŸerlendiriciler alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getCompletedAssignmentsForGrader = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getCompletedAssignmentsForGrader(userId);
            if (response.data && response.success) {
                setApplicationsByGrader(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Tamamlanan atamalar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getPendingAssignmentsForGrader = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getPendingAssignmentsForGrader(userId);
            if (response.data && response.success) {
                setApplicationsByGrader(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Bekleyen atamalar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getRefereeAssignmentsForGrader = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await applicationGraderService.getRefereeAssignmentsForGrader(userId);
            if (response.data && response.success) {
                setRefereeGraders(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Hakem atamalarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const completeMultipleGradings = useCallback(async (graderIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            await applicationGraderService.completeMultipleGradings(graderIds);
            showNotification.success('Ã‡oklu deÄŸerlendirmeler baÅŸarÄ±yla tamamlandÄ±!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Ã‡oklu deÄŸerlendirmeler tamamlanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const removeMultipleGraders = useCallback(async (graderIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            await applicationGraderService.removeMultipleGraders(graderIds);
            showNotification.success('Ã‡oklu deÄŸerlendiriciler baÅŸarÄ±yla kaldÄ±rÄ±ldÄ±!');
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Ã‡oklu deÄŸerlendiriciler kaldÄ±rÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getApplicationGradingProgress = useCallback(async (applicationId: string) => {
        try {
            setLoading(true);
            setError(null);
            const result = await applicationGraderService.getApplicationGradingProgress(applicationId);

            if (result.statistics.data && result.statistics.success) {
                setGraderStatistics(result.statistics.data);
            }
            if (result.summary.data && result.summary.success) {
                setApplicationGradingSummary(result.summary.data);
            }
            if (result.allGraders.data && result.allGraders.success) {
                setGradersByApplication(result.allGraders.data);
            }
            if (result.referees.data && result.referees.success) {
                setRefereeGraders(result.referees.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸvuru deÄŸerlendirme ilerlemesi alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getGraderPerformanceData = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const result = await applicationGraderService.getGraderPerformanceData(userId);

            if (result.workload.data && result.workload.success) {
                setGraderWorkload(result.workload.data);
            }
            if (result.allAssignments.data && result.allAssignments.success) {
                setApplicationsByGrader(result.allAssignments.data);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('DeÄŸerlendirici performans verileri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearApplicationGraderData = useCallback(() => {
        setApplicationGraders(null);
        setGradersByApplication(null);
        setApplicationsByGrader(null);
        setRefereeGraders(null);
        setGraderStatistics(null);
        setApplicationGradingSummary(null);
        setGraderWorkload(null);
        setError(null);
    }, []);

    return {
        applicationGraders,
        gradersByApplication,
        applicationsByGrader,
        refereeGraders,
        graderStatistics,
        applicationGradingSummary,
        graderWorkload,
        loading,
        error,
        assignGraderToApplication,
        updateGraderAssignment,
        completeGrading,
        getGradersByApplication,
        getApplicationsByGrader,
        getRefereeGradersByApplication,
        removeGraderFromApplication,
        bulkAssignGraders,
        getGraderStatistics,
        getApplicationGradingSummary,
        getGraderWorkload,
        searchGraderAssignments,
        assignSingleGrader,
        assignMultipleGraders,
        assignRefereeGrader,
        getCompletedGradersForApplication,
        getPendingGradersForApplication,
        getCompletedAssignmentsForGrader,
        getPendingAssignmentsForGrader,
        getRefereeAssignmentsForGrader,
        completeMultipleGradings,
        removeMultipleGraders,
        getApplicationGradingProgress,
        getGraderPerformanceData,
        clearApplicationGraderData
    };
};



import { useState, useCallback } from 'react';

import {
UpdateExamTypeRequest,
ExamTypeListResponse,
ExamTypeValidationResult,
ExamTypeStatistics,
ExamTypeSummary,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import {ExamTypeDto} from "@/types/exam/examTemplates";
import {CreateExamTypeRequest, ExamTypeSearchRequest} from "@/types/exam/examEntities";
import { examTypeService } from "@/services/api/exam/exam-type-service";

interface UseExamTypeReturn {
examTypes: ExamTypeListResponse | null;
selectedExamType: ExamTypeDto | null;
finalizedExamTypes: ExamTypeListResponse | null;
draftExamTypes: ExamTypeListResponse | null;
examTypeValidation: ExamTypeValidationResult | null;
examTypeStatistics: ExamTypeStatistics | null;
examTypesSummary: ExamTypeSummary | null;
loading: boolean;
error: Error | null;
createExamType: (createRequest: CreateExamTypeRequest) => Promise<void>;
updateExamType: (id: string, updateRequest: UpdateExamTypeRequest) => Promise<void>;
getExamTypeById: (id: string) => Promise<void>;
getAllExamTypes: (searchRequest?: ExamTypeSearchRequest) => Promise<void>;
deleteExamType: (id: string) => Promise<void>;
finalizeExamType: (id: string) => Promise<void>;
unfinalizeExamType: (id: string) => Promise<void>;
copyExamType: (id: string, newName: string) => Promise<void>;
validateExamTypeForFinalization: (id: string) => Promise<void>;
getExamTypeStatistics: (id: string) => Promise<void>;
getFinalizedExamTypes: (page?: number, size?: number, sortBy?: string, sortDirection?: string) => Promise<void>;
getDraftExamTypes: (page?: number, size?: number, sortBy?: string, sortDirection?: string) => Promise<void>;
getExamTypesSummary: () => Promise<void>;
clearExamTypeData: () => void;
}

export const useExamType = (): UseExamTypeReturn => {
const [examTypes, setExamTypes] = useState<ExamTypeListResponse | null>(null);
const [selectedExamType, setSelectedExamType] = useState<ExamTypeDto | null>(null);
const [finalizedExamTypes, setFinalizedExamTypes] = useState<ExamTypeListResponse | null>(null);
const [draftExamTypes, setDraftExamTypes] = useState<ExamTypeListResponse | null>(null);
const [examTypeValidation, setExamTypeValidation] = useState<ExamTypeValidationResult | null>(null);
const [examTypeStatistics, setExamTypeStatistics] = useState<ExamTypeStatistics | null>(null);
const [examTypesSummary, setExamTypesSummary] = useState<ExamTypeSummary | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createExamType = useCallback(async (createRequest: CreateExamTypeRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.createExamType(createRequest);
            if (response.data && response.success) {
                setSelectedExamType(response.data);
                showNotification.success('SÄ±nav tipi baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav tipi oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExamType = useCallback(async (id: string, updateRequest: UpdateExamTypeRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.updateExamType(id, updateRequest);
            if (response.data && response.success) {
                setSelectedExamType(response.data);
                showNotification.success('SÄ±nav tipi baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav tipi gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamTypeById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.getExamTypeById(id);
            if (response.data && response.success) {
                setSelectedExamType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav tipi alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllExamTypes = useCallback(async (searchRequest: ExamTypeSearchRequest = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.getAllExamTypes(searchRequest);
            if (response.data && response.success) {
                setExamTypes(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav tipleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteExamType = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.deleteExamType(id);
            if (response.data && response.success) {
                showNotification.success('SÄ±nav tipi baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav tipi silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const finalizeExamType = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.finalizeExamType(id);
            if (response.data && response.success) {
                setSelectedExamType(response.data);
                showNotification.success('SÄ±nav tipi baÅŸarÄ±yla sonlandÄ±rÄ±ldÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav tipi sonlandÄ±rÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const unfinalizeExamType = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.unfinalizeExamType(id);
            if (response.data && response.success) {
                setSelectedExamType(response.data);
                showNotification.success('SÄ±nav tipi sonlandÄ±rÄ±lmasÄ± geri alÄ±ndÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav tipi sonlandÄ±rÄ±lmasÄ± geri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyExamType = useCallback(async (id: string, newName: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.copyExamType(id, newName);
            if (response.data && response.success) {
                setSelectedExamType(response.data);
                showNotification.success('SÄ±nav tipi baÅŸarÄ±yla kopyalandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav tipi kopyalanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateExamTypeForFinalization = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.validateExamTypeForFinalization(id);
            if (response.data && response.success) {
                setExamTypeValidation(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav tipi doÄŸrulanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamTypeStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.getExamTypeStatistics(id);
            if (response.data && response.success) {
                setExamTypeStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav tipi istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getFinalizedExamTypes = useCallback(async (page: number = 0, size: number = 20, sortBy: string = 'name', sortDirection: string = 'ASC') => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.getFinalizedExamTypes(page, size, sortBy, sortDirection);
            if (response.data && response.success) {
                setFinalizedExamTypes(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SonlandÄ±rÄ±lmÄ±ÅŸ sÄ±nav tipleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getDraftExamTypes = useCallback(async (page: number = 0, size: number = 20, sortBy: string = 'name', sortDirection: string = 'ASC') => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.getDraftExamTypes(page, size, sortBy, sortDirection);
            if (response.data && response.success) {
                setDraftExamTypes(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Taslak sÄ±nav tipleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamTypesSummary = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await examTypeService.getExamTypesSummary();
            if (response.data && response.success) {
                setExamTypesSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav tipleri Ã¶zeti alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearExamTypeData = useCallback(() => {
        setExamTypes(null);
        setSelectedExamType(null);
        setFinalizedExamTypes(null);
        setDraftExamTypes(null);
        setExamTypeValidation(null);
        setExamTypeStatistics(null);
        setExamTypesSummary(null);
        setError(null);
    }, []);

    return {
        examTypes,
        selectedExamType,
        finalizedExamTypes,
        draftExamTypes,
        examTypeValidation,
        examTypeStatistics,
        examTypesSummary,
        loading,
        error,
        createExamType,
        updateExamType,
        getExamTypeById,
        getAllExamTypes,
        deleteExamType,
        finalizeExamType,
        unfinalizeExamType,
        copyExamType,
        validateExamTypeForFinalization,
        getExamTypeStatistics,
        getFinalizedExamTypes,
        getDraftExamTypes,
        getExamTypesSummary,
        clearExamTypeData
    };
};



import { useState, useCallback } from 'react';

import {
ExamPreview,
ExamSessionInfo,
ExamSessionStatus,
ExamSessionResult,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import {ExamReadyDto, ExamSectionReadyDto, QuestionGroupReadyDto, QuestionReadyDto} from "@/types/exam/examReady";
import {ExamNavigationDto, ExamReadinessValidation} from "@/types/exam/examEntities";
import {examReadyService} from "@/services/api/exam/exam-ready-service";

interface UseExamReadyReturn {
examReady: ExamReadyDto | null;
examSectionsReady: ExamSectionReadyDto[];
questionGroupReady: QuestionGroupReadyDto | null;
questionReady: QuestionReadyDto | null;
examNavigation: ExamNavigationDto | null;
examReadinessValidation: ExamReadinessValidation | null;
examPreview: ExamPreview | null;
availableExams: ExamPreview[];
examSessionInfo: ExamSessionInfo | null;
sessionStatus: ExamSessionStatus | null;
sessionResult: ExamSessionResult | null;
loading: boolean;
error: Error | null;
getExamReady: (examTypeId: string) => Promise<void>;
getExamSectionsReady: (examTypeId: string) => Promise<void>;
getQuestionGroupReady: (questionGroupId: string) => Promise<void>;
getQuestionReady: (questionId: string) => Promise<void>;
validateExamReadiness: (examTypeId: string) => Promise<void>;
getExamNavigation: (examTypeId: string) => Promise<void>;
getExamPreview: (examTypeId: string) => Promise<void>;
getAvailableExams: (examLevel?: string, examType?: string) => Promise<void>;
startExamSession: (examTypeId: string) => Promise<void>;
getSessionStatus: (sessionId: string) => Promise<void>;
endExamSession: (sessionId: string) => Promise<void>;
clearExamData: () => void;
}

export const useExamReady = (): UseExamReadyReturn => {
const [examReady, setExamReady] = useState<ExamReadyDto | null>(null);
const [examSectionsReady, setExamSectionsReady] = useState<ExamSectionReadyDto[]>([]);
const [questionGroupReady, setQuestionGroupReady] = useState<QuestionGroupReadyDto | null>(null);
const [questionReady, setQuestionReady] = useState<QuestionReadyDto | null>(null);
const [examNavigation, setExamNavigation] = useState<ExamNavigationDto | null>(null);
const [examReadinessValidation, setExamReadinessValidation] = useState<ExamReadinessValidation | null>(null);
const [examPreview, setExamPreview] = useState<ExamPreview | null>(null);
const [availableExams, setAvailableExams] = useState<ExamPreview[]>([]);
const [examSessionInfo, setExamSessionInfo] = useState<ExamSessionInfo | null>(null);
const [sessionStatus, setSessionStatus] = useState<ExamSessionStatus | null>(null);
const [sessionResult, setSessionResult] = useState<ExamSessionResult | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const getExamReady = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getExamReady(examTypeId);
            if (response.data && response.success) {
                setExamReady(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav hazÄ±rlanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamSectionsReady = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getExamSectionsReady(examTypeId);
            if (response.data && response.success) {
                setExamSectionsReady(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav bÃ¶lÃ¼mleri hazÄ±rlanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupReady = useCallback(async (questionGroupId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getQuestionGroupReady(questionGroupId);
            if (response.data && response.success) {
                setQuestionGroupReady(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu hazÄ±rlanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionReady = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getQuestionReady(questionId);
            if (response.data && response.success) {
                setQuestionReady(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru hazÄ±rlanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateExamReadiness = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.validateExamReadiness(examTypeId);
            if (response.data && response.success) {
                setExamReadinessValidation(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav hazÄ±rlÄ±k kontrolÃ¼ yapÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamNavigation = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getExamNavigation(examTypeId);
            if (response.data && response.success) {
                setExamNavigation(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav navigasyonu alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamPreview = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getExamPreview(examTypeId);
            if (response.data && response.success) {
                setExamPreview(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav Ã¶nizlemesi alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAvailableExams = useCallback(async (examLevel?: string, examType?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getAvailableExams(examLevel, examType);
            if (response.data && response.success) {
                setAvailableExams(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Mevcut sÄ±navlar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const startExamSession = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.startExamSession(examTypeId);
            if (response.data && response.success) {
                setExamSessionInfo(response.data);
                showNotification.success('SÄ±nav oturumu baÅŸarÄ±yla baÅŸlatÄ±ldÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav oturumu baÅŸlatÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getSessionStatus = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.getSessionStatus(sessionId);
            if (response.data && response.success) {
                setSessionStatus(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Oturum durumu alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const endExamSession = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await examReadyService.endExamSession(sessionId);
            if (response.data && response.success) {
                setSessionResult(response.data);
                showNotification.success('SÄ±nav oturumu baÅŸarÄ±yla sonlandÄ±rÄ±ldÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav oturumu sonlandÄ±rÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearExamData = useCallback(() => {
        setExamReady(null);
        setExamSectionsReady([]);
        setQuestionGroupReady(null);
        setQuestionReady(null);
        setExamNavigation(null);
        setExamReadinessValidation(null);
        setExamPreview(null);
        setAvailableExams([]);
        setExamSessionInfo(null);
        setSessionStatus(null);
        setSessionResult(null);
        setError(null);
    }, []);

    return {
        examReady,
        examSectionsReady,
        questionGroupReady,
        questionReady,
        examNavigation,
        examReadinessValidation,
        examPreview,
        availableExams,
        examSessionInfo,
        sessionStatus,
        sessionResult,
        loading,
        error,
        getExamReady,
        getExamSectionsReady,
        getQuestionGroupReady,
        getQuestionReady,
        validateExamReadiness,
        getExamNavigation,
        getExamPreview,
        getAvailableExams,
        startExamSession,
        getSessionStatus,
        endExamSession,
        clearExamData
    };
};


import {EApprovalStatus, EMediaType, EStatus} from "@/types/exam/enum";
import {RecordType} from "@/types/ui/table";


export interface DatabaseObjectDto extends RecordType{
id: string;
createdAt: Date | null;
deletedAt: Date | null;
status: EStatus | null;
createdById: string | null;
deletedById: string | null;
}



export type UploadedFileDto = DatabaseObjectDto & {
path?: string;
fileOriginalName?: string;
fileName?: string;
documentType?: EMediaType; 
fileSize?: number;
updatedAt?: string;
version?: number;
approvalStatus?: EApprovalStatus; 
currentApprovalCount?: number;
requiredApprovalCount?: number;
approvalCompletedDate?: string;
}


export type ResetPasswordRequest = {
userId?: string;
password?: string;
}


/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCandidateRequest, UpdateCandidateRequest, ChangePasswordRequest, CandidateSearchParams } from '@/types/management/brand';
import {candidateService} from "@/services/api/management/candidate-service";

export const CANDIDATE_QUERY_KEYS = {
all: ['candidates'] as const,
lists: () => [...CANDIDATE_QUERY_KEYS.all, 'list'] as const,
list: (filters: string) => [...CANDIDATE_QUERY_KEYS.lists(), { filters }] as const,
details: () => [...CANDIDATE_QUERY_KEYS.all, 'detail'] as const,
detail: (id: string) => [...CANDIDATE_QUERY_KEYS.details(), id] as const,
byUsername: (username: string) => [...CANDIDATE_QUERY_KEYS.all, 'byUsername', username] as const,
byIdentity: (identityNumber: string) => [...CANDIDATE_QUERY_KEYS.all, 'byIdentity', identityNumber] as const,
byCity: (city: string) => [...CANDIDATE_QUERY_KEYS.all, 'byCity', city] as const,
byCountry: (country: string) => [...CANDIDATE_QUERY_KEYS.all, 'byCountry', country] as const,
search: (params: CandidateSearchParams) => [...CANDIDATE_QUERY_KEYS.all, 'search', params] as const,
statistics: () => [...CANDIDATE_QUERY_KEYS.all, 'statistics'] as const,
};

export const useCandidates = () => {
return useQuery({
queryKey: CANDIDATE_QUERY_KEYS.lists(),
queryFn: async () => {
const response = await candidateService.getAllCandidates();
if (!response.success) throw new Error(response.message);
return response.data;
},
});
};

export const useCandidate = (id: string) => {
return useQuery({
queryKey: CANDIDATE_QUERY_KEYS.detail(id),
queryFn: async () => {
const response = await candidateService.getCandidateById(id);
if (!response.success) throw new Error(response.message);
return response.data;
},
enabled: !!id,
});
};

export const useCandidateByUsername = (username: string) => {
return useQuery({
queryKey: CANDIDATE_QUERY_KEYS.byUsername(username),
queryFn: async () => {
const response = await candidateService.getCandidateByUsername(username);
if (!response.success) throw new Error(response.message);
return response.data;
},
enabled: !!username,
});
};

export const useCandidateByIdentity = (identityNumber: string) => {
return useQuery({
queryKey: CANDIDATE_QUERY_KEYS.byIdentity(identityNumber),
queryFn: async () => {
const response = await candidateService.getCandidateByIdentityNumber(identityNumber);
if (!response.success) throw new Error(response.message);
return response.data;
},
enabled: !!identityNumber,
});
};

export const useCandidatesSearch = (searchParams: CandidateSearchParams) => {
return useQuery({
queryKey: CANDIDATE_QUERY_KEYS.search(searchParams),
queryFn: async () => {
const response = await candidateService.searchCandidates(searchParams);
if (!response.success) throw new Error(response.message);
return response.data;
},
enabled: Object.keys(searchParams).length > 0,
});
};

export const useCandidatesByCity = (city: string) => {
return useQuery({
queryKey: CANDIDATE_QUERY_KEYS.byCity(city),
queryFn: async () => {
const response = await candidateService.getCandidatesByCity(city);
if (!response.success) throw new Error(response.message);
return response.data;
},
enabled: !!city,
});
};

export const useCandidatesByCountry = (country: string) => {
return useQuery({
queryKey: CANDIDATE_QUERY_KEYS.byCountry(country),
queryFn: async () => {
const response = await candidateService.getCandidatesByCountry(country);
if (!response.success) throw new Error(response.message);
return response.data;
},
enabled: !!country,
});
};

export const useCandidateStatistics = () => {
return useQuery({
queryKey: CANDIDATE_QUERY_KEYS.statistics(),
queryFn: async () => {
const response = await candidateService.getCandidateStatistics();
if (!response.success) throw new Error(response.message);
return response.data;
},
});
};

export const useCreateCandidate = () => {
const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCandidateRequest) => candidateService.createCandidate(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.statistics() });
        },
    });
};

export const useUpdateCandidate = () => {
const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCandidateRequest }) =>
            candidateService.updateCandidate(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.lists() });
        },
    });
};

export const useChangePassword = () => {
return useMutation({
mutationFn: ({ id, data }: { id: string; data: ChangePasswordRequest }) =>
candidateService.changePassword(id, data),
});
};

export const useDeleteCandidate = () => {
const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => candidateService.deleteCandidate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.statistics() });
        },
    });
};

export const useBulkCreateCandidates = () => {
const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCandidateRequest[]) => candidateService.bulkCreateCandidates(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: CANDIDATE_QUERY_KEYS.statistics() });
        },
    });
};



import { useState, useCallback } from 'react';

import {
QuestionGroupsSummary,
QuestionGroupStatistics,
QuestionGroupValidation,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import {QuestionGroupDto} from "@/types/exam/examEntities";
import {CreateQuestionGroupRequest, CreateQuestionGroupHeaderRequest} from "@/types/exam/examRequests";
import { questionGroupService } from "@/services/api/exam/question-grup-service";

interface UseQuestionGroupReturn {
questionGroups: QuestionGroupDto[];
selectedQuestionGroup: QuestionGroupDto | null;
groupsByExamSection: QuestionGroupDto[];
groupsByExamType: QuestionGroupDto[];
searchResults: QuestionGroupDto[];
groupStatistics: QuestionGroupStatistics | null;
groupsSummary: QuestionGroupsSummary | null;
groupValidation: QuestionGroupValidation | null;
loading: boolean;
error: Error | null;
createQuestionGroup: (createRequest: CreateQuestionGroupRequest) => Promise<void>;
updateQuestionGroup: (id: string, updateRequest: CreateQuestionGroupRequest) => Promise<void>;
getQuestionGroupById: (id: string) => Promise<void>;
getQuestionGroupsByExamSection: (examSectionId: string) => Promise<void>;
getQuestionGroupsByExamType: (examTypeId: string) => Promise<void>;
deleteQuestionGroup: (id: string) => Promise<void>;
addHeaderToQuestionGroup: (questionGroupId: string, headerRequest: CreateQuestionGroupHeaderRequest) => Promise<void>;
removeHeaderFromQuestionGroup: (headerId: string) => Promise<void>;
copyQuestionGroup: (questionGroupId: string, targetExamSectionId: string) => Promise<void>;
getQuestionGroupStatistics: (id: string) => Promise<void>;
searchQuestionGroups: (name?: string, examTypeId?: string, examSectionId?: string, questionGroupTypeId?: string, hasQuestions?: boolean) => Promise<void>;
getQuestionGroupsSummary: (examSectionId: string) => Promise<void>;
validateQuestionGroup: (id: string) => Promise<void>;
bulkCreateQuestionGroups: (createRequests: CreateQuestionGroupRequest[]) => Promise<void>;
clearQuestionGroupData: () => void;
getAllQuestionGroup: () => Promise<void>;
}

export const useQuestionGroup = (): UseQuestionGroupReturn => {
const [questionGroups, setQuestionGroups] = useState<QuestionGroupDto[]>([]);
const [selectedQuestionGroup, setSelectedQuestionGroup] = useState<QuestionGroupDto | null>(null);
const [groupsByExamSection, setGroupsByExamSection] = useState<QuestionGroupDto[]>([]);
const [groupsByExamType, setGroupsByExamType] = useState<QuestionGroupDto[]>([]);
const [searchResults, setSearchResults] = useState<QuestionGroupDto[]>([]);
const [groupStatistics, setGroupStatistics] = useState<QuestionGroupStatistics | null>(null);
const [groupsSummary, setGroupsSummary] = useState<QuestionGroupsSummary | null>(null);
const [groupValidation, setGroupValidation] = useState<QuestionGroupValidation | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createQuestionGroup = useCallback(async (createRequest: CreateQuestionGroupRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.createQuestionGroup(createRequest);
            if (response.data && response.success) {
                setSelectedQuestionGroup(response.data);
                showNotification.success('Soru grubu baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateQuestionGroup = useCallback(async (id: string, updateRequest: CreateQuestionGroupRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.updateQuestionGroup(id, updateRequest);
            if (response.data && response.success) {
                setSelectedQuestionGroup(response.data);
                showNotification.success('Soru grubu baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);


    const getAllQuestionGroup = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.getAllQuestionGroup();
            if (response.data && response.success) {
                setQuestionGroups(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);




    const getQuestionGroupById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.getQuestionGroupById(id);
            if (response.data && response.success) {
                setSelectedQuestionGroup(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupsByExamSection = useCallback(async (examSectionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.getQuestionGroupsByExamSection(examSectionId);
            if (response.data && response.success) {
                setGroupsByExamSection(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav bÃ¶lÃ¼mÃ¼ soru gruplarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupsByExamType = useCallback(async (examTypeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.getQuestionGroupsByExamType(examTypeId);
            if (response.data && response.success) {
                setGroupsByExamType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('SÄ±nav tipi soru gruplarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteQuestionGroup = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.deleteQuestionGroup(id);
            if (response.success) {
                showNotification.success('Soru grubu baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const addHeaderToQuestionGroup = useCallback(async (questionGroupId: string, headerRequest: CreateQuestionGroupHeaderRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.addHeaderToQuestionGroup(questionGroupId, headerRequest);
            if (response.data && response.success) {
                showNotification.success('BaÅŸlÄ±k baÅŸarÄ±yla eklendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸlÄ±k eklenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const removeHeaderFromQuestionGroup = useCallback(async (headerId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.removeHeaderFromQuestionGroup(headerId);
            if (response.success) {
                showNotification.success('BaÅŸlÄ±k baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸlÄ±k silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyQuestionGroup = useCallback(async (questionGroupId: string, targetExamSectionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.copyQuestionGroup(questionGroupId, targetExamSectionId);
            if (response.data && response.success) {
                setSelectedQuestionGroup(response.data);
                showNotification.success('Soru grubu baÅŸarÄ±yla kopyalandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu kopyalanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupStatistics = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.getQuestionGroupStatistics(id);
            if (response.data && response.success) {
                setGroupStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchQuestionGroups = useCallback(async (
        name?: string,
        examTypeId?: string,
        examSectionId?: string,
        questionGroupTypeId?: string,
        hasQuestions?: boolean
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.searchQuestionGroups(name, examTypeId, examSectionId, questionGroupTypeId, hasQuestions);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru gruplarÄ± aranÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionGroupsSummary = useCallback(async (examSectionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.getQuestionGroupsSummary(examSectionId);
            if (response.data && response.success) {
                setGroupsSummary(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru gruplarÄ± Ã¶zeti alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const validateQuestionGroup = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.validateQuestionGroup(id);
            if (response.data && response.success) {
                setGroupValidation(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru grubu doÄŸrulanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateQuestionGroups = useCallback(async (createRequests: CreateQuestionGroupRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionGroupService.bulkCreateQuestionGroups(createRequests);
            if (response.data && response.success) {
                setQuestionGroups(response.data);
                showNotification.success('Soru gruplarÄ± baÅŸarÄ±yla toplu oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru gruplarÄ± toplu oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearQuestionGroupData = useCallback(() => {
        setQuestionGroups([]);
        setSelectedQuestionGroup(null);
        setGroupsByExamSection([]);
        setGroupsByExamType([]);
        setSearchResults([]);
        setGroupStatistics(null);
        setGroupsSummary(null);
        setGroupValidation(null);
        setError(null);
    }, []);

    return {
        questionGroups,
        selectedQuestionGroup,
        groupsByExamSection,
        groupsByExamType,
        searchResults,
        groupStatistics,
        groupsSummary,
        groupValidation,
        loading,
        error,
        createQuestionGroup,
        updateQuestionGroup,
        getQuestionGroupById,
        getQuestionGroupsByExamSection,
        getQuestionGroupsByExamType,
        deleteQuestionGroup,
        addHeaderToQuestionGroup,
        removeHeaderFromQuestionGroup,
        copyQuestionGroup,
        getQuestionGroupStatistics,
        searchQuestionGroups,
        getQuestionGroupsSummary,
        validateQuestionGroup,
        bulkCreateQuestionGroups,
        clearQuestionGroupData,
        getAllQuestionGroup
    };
};


import { useState, useCallback } from 'react';
import {
AuditLogSearchParams,
ActivityStatsParams,
ActivityStatItem,
} from '@/types/exam/examResponses';
import { showNotification } from '@/lib/notification';
import {AuditLog, PageResponse} from "@/types/exam/examEntities";
import {auditService} from "@/services/api/audit-service";

interface UseAuditReturn {
auditLogs: PageResponse<AuditLog> | null;
userActivities: AuditLog[];
resourceHistory: AuditLog[];
failedRequests: AuditLog[];
activityStats: ActivityStatItem[];
loading: boolean;
error: Error | null;
getAuditLogs: (params?: AuditLogSearchParams) => Promise<void>;
getUserActivities: (userId: string, days?: number) => Promise<void>;
getResourceHistory: (resourceType: string, resourceId: string) => Promise<void>;
getFailedRequests: (hours?: number) => Promise<void>;
getActivityStats: (params?: ActivityStatsParams) => Promise<void>;
getRecentUserActivity: (userId: string) => Promise<void>;
getRecentFailures: () => Promise<void>;
getTodayStats: () => Promise<void>;
getWeeklyStats: () => Promise<void>;
searchAuditLogs: (searchTerm: string, searchType?: 'user' | 'resource' | 'method', page?: number, size?: number) => Promise<void>;
getAuditLogsByDateRange: (startDate: Date, endDate: Date, page?: number, size?: number) => Promise<void>;
getAuditLogsByStatus: (status: number, page?: number, size?: number) => Promise<void>;
clearAuditData: () => void;
}

export const useAudit = (): UseAuditReturn => {
const [auditLogs, setAuditLogs] = useState<PageResponse<AuditLog> | null>(null);
const [userActivities, setUserActivities] = useState<AuditLog[]>([]);
const [resourceHistory, setResourceHistory] = useState<AuditLog[]>([]);
const [failedRequests, setFailedRequests] = useState<AuditLog[]>([]);
const [activityStats, setActivityStats] = useState<ActivityStatItem[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const getAuditLogs = useCallback(async (params: AuditLogSearchParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getAuditLogs(params);
            setAuditLogs(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Denetim kayÄ±tlarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserActivities = useCallback(async (userId: string, days: number = 7) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getUserActivities(userId, days);
            setUserActivities(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('KullanÄ±cÄ± aktiviteleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getResourceHistory = useCallback(async (resourceType: string, resourceId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getResourceHistory(resourceType, resourceId);
            setResourceHistory(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Kaynak geÃ§miÅŸi alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getFailedRequests = useCallback(async (hours: number = 24) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getFailedRequests(hours);
            setFailedRequests(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('BaÅŸarÄ±sÄ±z istekler alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getActivityStats = useCallback(async (params: ActivityStatsParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getActivityStats(params);
            setActivityStats(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Aktivite istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getRecentUserActivity = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getRecentUserActivity(userId);
            setUserActivities(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Son kullanÄ±cÄ± aktiviteleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getRecentFailures = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getRecentFailures();
            setFailedRequests(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Son baÅŸarÄ±sÄ±zlÄ±klar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getTodayStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getTodayStats();
            setActivityStats(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('GÃ¼nlÃ¼k istatistikler alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getWeeklyStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getWeeklyStats();
            setActivityStats(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('HaftalÄ±k istatistikler alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchAuditLogs = useCallback(async (
        searchTerm: string,
        searchType: 'user' | 'resource' | 'method' = 'user',
        page: number = 0,
        size: number = 20
    ) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.searchAuditLogs(searchTerm, searchType, page, size);
            setAuditLogs(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Denetim kayÄ±tlarÄ± aranÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAuditLogsByDateRange = useCallback(async (
        startDate: Date,
        endDate: Date,
        page: number = 0,
        size: number = 20
    ) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getAuditLogsByDateRange(startDate, endDate, page, size);
            setAuditLogs(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Tarih aralÄ±ÄŸÄ± kayÄ±tlarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getAuditLogsByStatus = useCallback(async (
        status: number,
        page: number = 0,
        size: number = 20
    ) => {
        try {
            setLoading(true);
            setError(null);
            const data = await auditService.getAuditLogsByStatus(status, page, size);
            setAuditLogs(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Durum koduna gÃ¶re kayÄ±tlar alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearAuditData = useCallback(() => {
        setAuditLogs(null);
        setUserActivities([]);
        setResourceHistory([]);
        setFailedRequests([]);
        setActivityStats([]);
        setError(null);
    }, []);

    return {
        auditLogs,
        userActivities,
        resourceHistory,
        failedRequests,
        activityStats,
        loading,
        error,
        getAuditLogs,
        getUserActivities,
        getResourceHistory,
        getFailedRequests,
        getActivityStats,
        getRecentUserActivity,
        getRecentFailures,
        getTodayStats,
        getWeeklyStats,
        searchAuditLogs,
        getAuditLogsByDateRange,
        getAuditLogsByStatus,
        clearAuditData
    };
};



import { useState, useCallback } from 'react';

import {
UpdateQuestionPartRequest,
QuestionPartStatistics,
QuestionPartTemplate,
QuestionPartPreview,
} from '@/types/exam/examResponses';;
import { showNotification } from '@/lib/notification';
import { QuestionPartDto } from "@/types/exam/examEntities";
import {CreateQuestionPartRequest} from "@/types/exam/examRequests";
import {EMediaType} from "@/types/exam/enum";
import {questionPartService} from "@/services/api/exam/question-part-service";

interface UseQuestionPartReturn {
questionParts: QuestionPartDto[];
selectedQuestionPart: QuestionPartDto | null;
partsByQuestion: QuestionPartDto[];
partsByMediaType: QuestionPartDto[];
searchResults: QuestionPartDto[];
partStatistics: QuestionPartStatistics | null;
partTemplates: QuestionPartTemplate[];
partPreview: QuestionPartPreview | null;
loading: boolean;
error: Error | null;
createQuestionPart: (questionId: string, createRequest: CreateQuestionPartRequest) => Promise<void>;
updateQuestionPart: (id: string, updateRequest: UpdateQuestionPartRequest) => Promise<void>;
getQuestionPartById: (id: string) => Promise<void>;
getQuestionPartsByQuestion: (questionId: string) => Promise<void>;
deleteQuestionPart: (id: string) => Promise<void>;
reorderQuestionParts: (questionId: string, partIds: string[]) => Promise<void>;
copyQuestionPart: (partId: string, targetQuestionId: string) => Promise<void>;
bulkCreateQuestionParts: (questionId: string, createRequests: CreateQuestionPartRequest[]) => Promise<void>;
getQuestionPartStatistics: (questionId: string) => Promise<void>;
searchQuestionParts: (questionId?: string, mediaType?: EMediaType, content?: string, label?: string, hasScore?: boolean, hasDuration?: boolean) => Promise<void>;
getQuestionPartsByMediaType: (mediaType: EMediaType) => Promise<void>;
getPartTemplates: (mediaType?: EMediaType) => Promise<void>;
previewQuestionPart: (id: string) => Promise<void>;
duplicateQuestionPart: (partId: string, newLabel?: string) => Promise<void>;
clearQuestionPartData: () => void;
}

export const useQuestionPart = (): UseQuestionPartReturn => {
const [questionParts, setQuestionParts] = useState<QuestionPartDto[]>([]);
const [selectedQuestionPart, setSelectedQuestionPart] = useState<QuestionPartDto | null>(null);
const [partsByQuestion, setPartsByQuestion] = useState<QuestionPartDto[]>([]);
const [partsByMediaType, setPartsByMediaType] = useState<QuestionPartDto[]>([]);
const [searchResults, setSearchResults] = useState<QuestionPartDto[]>([]);
const [partStatistics, setPartStatistics] = useState<QuestionPartStatistics | null>(null);
const [partTemplates, setPartTemplates] = useState<QuestionPartTemplate[]>([]);
const [partPreview, setPartPreview] = useState<QuestionPartPreview | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

    const createQuestionPart = useCallback(async (questionId: string, createRequest: CreateQuestionPartRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.createQuestionPart(questionId, createRequest);
            if (response.data && response.success) {
                setSelectedQuestionPart(response.data);
                showNotification.success('Soru parÃ§asÄ± baÅŸarÄ±yla oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parÃ§asÄ± oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateQuestionPart = useCallback(async (id: string, updateRequest: UpdateQuestionPartRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.updateQuestionPart(id, updateRequest);
            if (response.data && response.success) {
                setSelectedQuestionPart(response.data);
                showNotification.success('Soru parÃ§asÄ± baÅŸarÄ±yla gÃ¼ncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parÃ§asÄ± gÃ¼ncellenirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionPartById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.getQuestionPartById(id);
            if (response.data && response.success) {
                setSelectedQuestionPart(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parÃ§asÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionPartsByQuestion = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.getQuestionPartsByQuestion(questionId);
            if (response.data && response.success) {
                setPartsByQuestion(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parÃ§alarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteQuestionPart = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.deleteQuestionPart(id);
            if (response.data && response.success) {
                showNotification.success('Soru parÃ§asÄ± baÅŸarÄ±yla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parÃ§asÄ± silinirken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const reorderQuestionParts = useCallback(async (questionId: string, partIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.reorderQuestionParts(questionId, partIds);
            if (response.data && response.success) {
                setPartsByQuestion(response.data);
                showNotification.success('Soru parÃ§alarÄ± baÅŸarÄ±yla yeniden sÄ±ralandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parÃ§alarÄ± sÄ±ralanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const copyQuestionPart = useCallback(async (partId: string, targetQuestionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.copyQuestionPart(partId, targetQuestionId);
            if (response.data && response.success) {
                setSelectedQuestionPart(response.data);
                showNotification.success('Soru parÃ§asÄ± baÅŸarÄ±yla kopyalandÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parÃ§asÄ± kopyalanÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const bulkCreateQuestionParts = useCallback(async (questionId: string, createRequests: CreateQuestionPartRequest[]) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.bulkCreateQuestionParts(questionId, createRequests);
            if (response.data && response.success) {
                setQuestionParts(response.data);
                showNotification.success('Soru parÃ§alarÄ± baÅŸarÄ±yla toplu oluÅŸturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parÃ§alarÄ± toplu oluÅŸturulurken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionPartStatistics = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.getQuestionPartStatistics(questionId);
            if (response.data && response.success) {
                setPartStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('ParÃ§a istatistikleri alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const searchQuestionParts = useCallback(async (
        questionId?: string,
        mediaType?: EMediaType,
        content?: string,
        label?: string,
        hasScore?: boolean,
        hasDuration?: boolean
    ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.searchQuestionParts(questionId, mediaType, content, label, hasScore, hasDuration);
            if (response.data && response.success) {
                setSearchResults(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parÃ§alarÄ± aranÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionPartsByMediaType = useCallback(async (mediaType: EMediaType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.getQuestionPartsByMediaType(mediaType);
            if (response.data && response.success) {
                setPartsByMediaType(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Medya tipi parÃ§alarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getPartTemplates = useCallback(async (mediaType?: EMediaType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.getPartTemplates(mediaType);
            if (response.data && response.success) {
                setPartTemplates(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('ParÃ§a ÅŸablonlarÄ± alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const previewQuestionPart = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.previewQuestionPart(id);
            if (response.data && response.success) {
                setPartPreview(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('ParÃ§a Ã¶nizlemesi alÄ±nÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const duplicateQuestionPart = useCallback(async (partId: string, newLabel?: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await questionPartService.duplicateQuestionPart(partId, newLabel);
            if (response.data && response.success) {
                setSelectedQuestionPart(response.data);
                showNotification.success('Soru parÃ§asÄ± baÅŸarÄ±yla Ã§oÄŸaltÄ±ldÄ±!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Soru parÃ§asÄ± Ã§oÄŸaltÄ±lÄ±rken bir hata oluÅŸtu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearQuestionPartData = useCallback(() => {
        setQuestionParts([]);
        setSelectedQuestionPart(null);
        setPartsByQuestion([]);
        setPartsByMediaType([]);
        setSearchResults([]);
        setPartStatistics(null);
        setPartTemplates([]);
        setPartPreview(null);
        setError(null);
    }, []);

    return {
        questionParts,
        selectedQuestionPart,
        partsByQuestion,
        partsByMediaType,
        searchResults,
        partStatistics,
        partTemplates,
        partPreview,
        loading,
        error,
        createQuestionPart,
        updateQuestionPart,
        getQuestionPartById,
        getQuestionPartsByQuestion,
        deleteQuestionPart,
        reorderQuestionParts,
        copyQuestionPart,
        bulkCreateQuestionParts,
        getQuestionPartStatistics,
        searchQuestionParts,
        getQuestionPartsByMediaType,
        getPartTemplates,
        previewQuestionPart,
        duplicateQuestionPart,
        clearQuestionPartData
    };
};