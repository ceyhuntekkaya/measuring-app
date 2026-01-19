'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useMemo, useCallback, useRef} from "react";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useGetApplicationsByExamSession} from "@/api/generated/application-management/application-management";
import {useGetActiveExamSessions} from "@/api/generated/exam-session-management/exam-session-management";
import type {ExamSessionDto, ExamSessionListResponse, ApplicationDto} from "@/api/generated/model";

export default function ApplicationPage() {
    const router = useRouter();
    const [selectedExamSession, setSelectedExamSession] = React.useState<ExamSessionDto | null>(null);

    const {data: sessionsData, isLoading: loading} = useGetActiveExamSessions({});
    
    // Stabilize examSessions data
    const examSessions = useMemo(() => {
        if (!sessionsData) return null;
        const response = sessionsData as unknown as ExamSessionListResponse;
        return response?.examSessions ? response : null;
    }, [sessionsData]);

    const {data: applicationsData} = useGetApplicationsByExamSession(selectedExamSession?.id || '', {
        query: { enabled: !!selectedExamSession?.id }
    });
    
    // Stabilize applications data
    const applications = useMemo(() => {
        if (!applicationsData) return null;
        const response = applicationsData as unknown as { data?: ApplicationDto[] };
        return response?.data || null;
    }, [applicationsData]);

    // Stabilize examSessions array
    const examSessionsArray = useMemo(() => {
        if (!examSessions?.examSessions) return [];
        return examSessions.examSessions as RecordType[];
    }, [examSessions]);

    // Stabilize applications array
    const applicationsArray = useMemo(() => {
        if (!applications) return [];
        return applications as RecordType[];
    }, [applications]);

    const handleSessionSelect = useCallback((record: RecordType) => {
        setSelectedExamSession(record as ExamSessionDto);
    }, []);

    const renderSessionCell = useCallback((value: unknown, record: RecordType) => {
        return (
            <div
                className="font-medium cursor-pointer hover:text-blue-600"
                onClick={() => handleSessionSelect(record)}
            >
                {String(value || '')}
            </div>
        );
    }, [handleSessionSelect]);

    const columnSessions: Column<RecordType>[] = useMemo(() => [
        {
            key: 'name',
            header: 'Ad',
            render: renderSessionCell
        },
        {
            key: 'code',
            header: 'Kod',
            render: renderSessionCell
        },
        {
            key: 'description',
            header: 'Açıklama',
            render: renderSessionCell
        }
    ], [renderSessionCell]);

    const columns: Column<RecordType>[] = useMemo(() => [
        {
            key: 'name',
            header: 'Ad',
            render: renderSessionCell
        },
        {
            key: 'code',
            header: 'Kod',
            render: renderSessionCell
        },
        {
            key: 'description',
            header: 'Açıklama',
            render: renderSessionCell
        }
    ], [renderSessionCell]);

    const handleAdd = useCallback(() => {
        router.push('/admin/applications/add');
    }, [router]);

    if (loading) {
        return <LoadingComp/>;
    }

    return (
        <div className="space-y-6">
            <PageHeader 
                actions={
                    <ActionButtons
                        onAdd={handleAdd}
                        addButtonText="Yeni Uygulama Tanımla"
                    />
                }
            />
            <div className="p-6 pt-1">
                {examSessionsArray.length > 0 && (
                    <DynamicTable 
                        columns={columnSessions} 
                        data={examSessionsArray}
                    />
                )}
            </div>

            <div className="p-6 pt-1">
                {applicationsArray.length > 0 && (
                    <DynamicTable 
                        columns={columns} 
                        data={applicationsArray}
                    />
                )}
            </div>
        </div>
    );
}
