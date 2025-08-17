import api from "@/services/api/base-api";
import {EApprovalStatus, EApprovalType, ObjectType} from "@/types/exam/enum";
import {ApiResponse} from "@/types/exam/examValidationAndAnalytics";

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

class ApprovalService {
    private readonly baseUrl = '/approvals';

    async addApproval(approvalRequest: ApprovalRequest): Promise<ApiResponse<ApprovalResult>> {
        const response = await api.post<ApiResponse<ApprovalResult>>(`${this.baseUrl}/approve`, approvalRequest);
        return response.data;
    }

    async rejectApproval(rejectionRequest: RejectionRequest): Promise<ApiResponse<ApprovalResult>> {
        const response = await api.post<ApiResponse<ApprovalResult>>(`${this.baseUrl}/reject`, rejectionRequest);
        return response.data;
    }

    async addRefereeApproval(refereeRequest: RefereeApprovalRequest): Promise<ApiResponse<ApprovalResult>> {
        const response = await api.post<ApiResponse<ApprovalResult>>(`${this.baseUrl}/referee-approval`, refereeRequest);
        return response.data;
    }

    async initializeApprovalRequirements(initRequest: InitializeApprovalRequest): Promise<ApiResponse<ApprovalInitializationResult>> {
        const response = await api.post<ApiResponse<ApprovalInitializationResult>>(`${this.baseUrl}/initialize`, initRequest);
        return response.data;
    }

    async checkApprovalStatus(objectType: ObjectType, objectId: string): Promise<ApiResponse<ApprovalStatusResult>> {
        const response = await api.get<ApiResponse<ApprovalStatusResult>>(`${this.baseUrl}/status/${objectType}/${objectId}`);
        return response.data;
    }

    async getApprovalHistory(objectType: ObjectType, objectId: string): Promise<ApiResponse<ApprovalHistoryItem[]>> {
        const response = await api.get<ApiResponse<ApprovalHistoryItem[]>>(`${this.baseUrl}/history/${objectType}/${objectId}`);
        return response.data;
    }

    async updateAllApprovalRequirements(): Promise<ApiResponse<UpdateRequirementsResult>> {
        const response = await api.post<ApiResponse<UpdateRequirementsResult>>(`${this.baseUrl}/update-all-requirements`);
        return response.data;
    }

    async getPendingApprovals(
        objectType: ObjectType,
        page: number = 0,
        size: number = 20
    ): Promise<ApiResponse<PendingApprovalItem[]>> {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        const response = await api.get<ApiResponse<PendingApprovalItem[]>>(`${this.baseUrl}/pending/${objectType}?${params}`);
        return response.data;
    }

    async getApprovalStatistics(): Promise<ApiResponse<ApprovalStatistics>> {
        const response = await api.get<ApiResponse<ApprovalStatistics>>(`${this.baseUrl}/statistics`);
        return response.data;
    }
}

export const approvalService = new ApprovalService();