'use client';

import {useParams, useRouter} from "next/navigation";
import React from "react";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";
import ExamSessionDetail from "@/components/detail/ExamSessionDetail";
import {useGetExamSessionById, useGetExamSessionStatistics, useDeleteExamSession, useSetBeginAt, useSetEndAt, useSetIsFinish, useUpdateSessionState} from "@/api/generated/exam-session-management/exam-session-management";
import { AdminWebSocketProvider } from '@/components/websocket/AdminWebSocketProvider';
import {useQueryClient} from "@tanstack/react-query";
import type {ApiResponseExamSessionDto, ApiResponseExamSessionStatistics, UpdateExamSessionStateRequest, UpdateExamSessionStateRequestSessionState} from "@/api/generated/model";
import { showNotification, getErrorMessage } from "@/lib/notification";

export default function CandidateDetailPage() {
    const params = useParams();
    const sessionId = params.id as string;
    const router = useRouter();
    const queryClient = useQueryClient();

    const {data: sessionData, isLoading: loading} = useGetExamSessionById(sessionId, {
        query: { enabled: !!sessionId }
    });
    const selectedExamSession = (sessionData as ApiResponseExamSessionDto)?.data;
    
    const {data: statisticsData} = useGetExamSessionStatistics(sessionId, {
        query: { enabled: !!sessionId }
    });
    const sessionStatistics = (statisticsData as ApiResponseExamSessionStatistics)?.data;
    
    const deleteExamSessionMutation = useDeleteExamSession();
    const setBeginAtMutation = useSetBeginAt();
    const setEndAtMutation = useSetEndAt();
    const setIsFinishMutation = useSetIsFinish();
    const updateSessionStateMutation = useUpdateSessionState();

    const loadExamSessionData = () => {
        queryClient.invalidateQueries({ queryKey: [`/exam-sessions/${sessionId}`] });
        queryClient.invalidateQueries({ queryKey: [`/exam-sessions/${sessionId}/statistics`] });
    };

    // Event handlers
    const handleEdit = () => {
        router.push(`/admin/sessions/${sessionId}/edit`);
    };

    const handleDelete = async () => {
        if (!sessionId) return;

        try {
            await deleteExamSessionMutation.mutateAsync({ id: sessionId });
            queryClient.invalidateQueries({ queryKey: ['/exam-sessions'] });
            showNotification.success('Sınav oturumu başarıyla silindi!');
            router.push('/admin/sessions');
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            showNotification.error(errorMessage || 'Sınav oturumu silinirken bir hata oluştu!');
        }
    };

    const handleStart = async () => {
        if (!sessionId) return;

        try {
            await setBeginAtMutation.mutateAsync({ id: sessionId });
            await updateSessionStateMutation.mutateAsync({ 
                id: sessionId, 
                data: { 
                    examSessionId: sessionId,
                    sessionState: 'IN_PROGRESS' as UpdateExamSessionStateRequestSessionState
                } as UpdateExamSessionStateRequest
            });
            loadExamSessionData();
        } catch (err) {
            console.error('Error starting exam session:', err);
        }
    };

    const handlePause = async () => {
        if (!sessionId) return;

        try {
            await setEndAtMutation.mutateAsync({ id: sessionId });
            loadExamSessionData();
        } catch (err) {
            console.error('Error pausing exam session:', err);
        }
    };

    const handleStop = async () => {
        if (!sessionId) return;

        try {
            await setEndAtMutation.mutateAsync({ id: sessionId });
            loadExamSessionData();
        } catch (err) {
            console.error('Error stopping exam session:', err);
        }
    };

    const handleFinish = async () => {
        if (!sessionId) return;

        if (window.confirm('Oturumu sonlandırmak istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
            try {
                await setIsFinishMutation.mutateAsync({ id: sessionId });
                loadExamSessionData();
            } catch (err) {
                console.error('Error finishing exam session:', err);
            }
        }
    };


    const handleViewParticipants = () => {
        router.push(`/admin/sessions/${sessionId}/participants`);
    };

    const handleViewResults = () => {
        router.push(`/admin/sessions/${sessionId}/results`);
    };

    const handleManageSupervisors = () => {
        router.push(`/admin/sessions/${sessionId}/supervisors`);
    };

    const handleViewStatistics = () => {
        router.push(`/admin/sessions/${sessionId}/statistics`);
    };

    // Convert statistics data to the format expected by the component
    const formattedStatistics = sessionStatistics ? {
        totalParticipants: sessionStatistics.totalApplications || 0,
        completedParticipants: sessionStatistics.approvedApplications || 0,
        activeParticipants: sessionStatistics.pendingApplications || 0,
        completionRate: sessionStatistics.totalApplications && sessionStatistics.quota 
            ? (sessionStatistics.totalApplications / sessionStatistics.quota) * 100 
            : 0,
    } : undefined;

    if (loading && !selectedExamSession) {
        return <LoadingComp />;
    }

    return (
        <AdminWebSocketProvider sessionId={sessionId} examSession={selectedExamSession}>
        <div className="space-y-4">
            <PageHeader/>
            <div className="px-4">
                {
                    selectedExamSession &&  <ExamSessionDetail
                        examSession={selectedExamSession}
                        statistics={formattedStatistics}
                        isLoading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onStart={handleStart}
                        onPause={handlePause}
                        onStop={handleStop}
                        onFinish={handleFinish}
                        onViewParticipants={handleViewParticipants}
                        onViewResults={handleViewResults}
                        onManageSupervisors={handleManageSupervisors}
                        onViewStatistics={handleViewStatistics}
                    />

                }
            </div>
        </div>
        </AdminWebSocketProvider>
    );



}