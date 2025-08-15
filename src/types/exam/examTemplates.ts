// examTemplates.ts

import {EApprovalStatus, EExamType, EQuestionGroupTemplateLevel, EQuestionGroupType} from "@/types/exam/enum";

export type DatabaseObjectDto = {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export type ExamTypeDto = DatabaseObjectDto & {
    name?: string;
    examLevel?: string;
    examType?: EExamType; // Example enum values
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
    level?: EQuestionGroupTemplateLevel; // Example enum values
    examSection?: ExamSectionDto;
    groupType?: EQuestionGroupType; // Example enum values
    approvalStatus?: EApprovalStatus; // Example enum values
    currentApprovalCount?: number;
    requiredApprovalCount?: number;
    approvalCompletedDate?: string;
}

export type ExamSectionDto = DatabaseObjectDto & {
    name?: string;
    examType?: ExamTypeDto;
    orderNumber?: number;
}