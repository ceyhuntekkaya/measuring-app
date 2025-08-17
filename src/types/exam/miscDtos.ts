import {EApprovalStatus, EMediaType, EStatus} from "@/types/exam/enum";

export type DatabaseObjectDto = {
    id?: string;
    createdAt?: string;
    deletedAt?: string;
    status?: EStatus; // Example enum values
    createdById?: string;
    deletedById?: string;
}



export type UploadedFileDto = DatabaseObjectDto & {
    path?: string;
    fileOriginalName?: string;
    fileName?: string;
    documentType?: EMediaType; // Example enum values
    fileSize?: number;
    updatedAt?: string;
    version?: number;
    approvalStatus?: EApprovalStatus; // Example enum values
    currentApprovalCount?: number;
    requiredApprovalCount?: number;
    approvalCompletedDate?: string;
}


export type ResetPasswordRequest = {
    userId?: string;
    password?: string;
}