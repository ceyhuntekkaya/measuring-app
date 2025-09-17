'use client';

import {useParams, useRouter} from "next/navigation";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";
import ExamSessionDetail from "@/components/detail/ExamSessionDetail";
import {useExamSession} from "@/hooks/exam/use-exam-session";
import {showNotification} from "@/lib/notification";

export default function CandidateDetailPage() {
    const params = useParams();
    const sessionId = params.id as string;
    const router = useRouter();

    const {
        selectedExamSession,
        sessionStatistics,
        loading,
        getExamSessionById,
        getExamSessionStatistics,
        deleteExamSession,
        updateSessionStatus,
        clearSessionData,
    } = useExamSession();

    // Load exam session data on component mount
    useEffect(() => {
        if (sessionId) {
            loadExamSessionData();
        }

        return () => {
            clearSessionData();
        };
    }, [sessionId]);

    const loadExamSessionData = async () => {
        if (!sessionId) return;

        try {
            await Promise.all([
                getExamSessionById(sessionId),
                getExamSessionStatistics(sessionId),
            ]);
        } catch (err) {
            console.error('Error loading exam session data:', err);
        }
    };

    // Event handlers
    const handleEdit = () => {
        router.push(`/admin/sessions/${sessionId}/edit`);
    };

    const handleDelete = async () => {
        if (!sessionId) return;

        try {
            await deleteExamSession(sessionId);
            router.push('/admin/sessions');
        } catch (err) {
            console.error('Error deleting exam session:', err);
        }
    };

    const handleStart = async () => {
        if (!sessionId) return;

        try {
            await updateSessionStatus(sessionId, { newStatus: 'ACTIVE' });
            await loadExamSessionData(); // Refresh data
            showNotification.success('Sınav oturumu başlatıldı!');
        } catch (err) {
            console.error('Error starting exam session:', err);
        }
    };

    const handlePause = async () => {
        if (!sessionId) return;

        try {
            await updateSessionStatus(sessionId, { newStatus: 'PAUSED' });
            await loadExamSessionData(); // Refresh data
            showNotification.success('Sınav oturumu duraklatıldı!');
        } catch (err) {
            console.error('Error pausing exam session:', err);
        }
    };

    const handleStop = async () => {
        if (!sessionId) return;

        try {
            await updateSessionStatus(sessionId, { newStatus: 'COMPLETED' });
            await loadExamSessionData(); // Refresh data
            showNotification.success('Sınav oturumu durduruldu!');
        } catch (err) {
            console.error('Error stopping exam session:', err);
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
    const statisticsData = sessionStatistics ? {
        totalParticipants: sessionStatistics.totalApplications || 0,
        completedParticipants: sessionStatistics.approvedApplications || 0,
        activeParticipants: sessionStatistics.pendingApplications || 0,
        completionRate: sessionStatistics.capacityUtilization || 0,
    } : undefined;

    if (loading && !selectedExamSession) {
        return <LoadingComp />;
    }

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    selectedExamSession &&  <ExamSessionDetail
                        examSession={selectedExamSession}
                        statistics={statisticsData}
                        isLoading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onStart={handleStart}
                        onPause={handlePause}
                        onStop={handleStop}
                        onViewParticipants={handleViewParticipants}
                        onViewResults={handleViewResults}
                        onManageSupervisors={handleManageSupervisors}
                        onViewStatistics={handleViewStatistics}
                    />

                }
            </div>
        </div>
    );



}