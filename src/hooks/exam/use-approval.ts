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
                showNotification.success('Onay başarıyla eklendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Onay eklenirken bir hata oluştu!');
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
                showNotification.success('Onay başarıyla reddedildi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Onay reddedilirken bir hata oluştu!');
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
                showNotification.success('Hakem onayı başarıyla eklendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Hakem onayı eklenirken bir hata oluştu!');
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
                showNotification.success('Onay gereksinimleri başarıyla başlatıldı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Onay gereksinimleri başlatılırken bir hata oluştu!');
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
            showNotification.error('Onay durumu kontrol edilirken bir hata oluştu!');
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
            showNotification.error('Onay geçmişi alınırken bir hata oluştu!');
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
                showNotification.success('Tüm onay gereksinimleri güncelleme işlemi başlatıldı!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Onay gereksinimleri güncellenirken bir hata oluştu!');
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
            showNotification.error('Bekleyen onaylar alınırken bir hata oluştu!');
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
            showNotification.error('Onay istatistikleri alınırken bir hata oluştu!');
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