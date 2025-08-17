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