'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useMemo, useCallback} from "react";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useGetApplicationsByExamSession} from "@/api/generated/application-management/application-management";
import {useGetActiveExamSessions} from "@/api/generated/exam-session-management/exam-session-management";
import {extractNestedApiListData} from "@/utils/api-helpers/extract-api-data";
import type {ExamSessionDto, ApplicationDto} from "@/api/generated/model";

export default function ApplicationPage() {
    const router = useRouter();
    const [selectedExamSession, setSelectedExamSession] = React.useState<ExamSessionDto | null>(null);

    const {data: sessionsData, isLoading, error} = useGetActiveExamSessions({
        query: {
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            staleTime: 0,
        }
    });
    
    const examSessionsArray = useMemo(() => {
        if (sessionsData && typeof sessionsData === 'object' && 'data' in sessionsData) {
            const apiData = (sessionsData as { data?: unknown }).data;
            if (apiData && typeof apiData === 'object' && apiData !== null && 'examSessions' in apiData) {
                const examSessions = (apiData as { examSessions?: unknown }).examSessions;
                return Array.isArray(examSessions) ? examSessions : [];
            }
            if (Array.isArray(apiData)) {
                return apiData;
            }
        }
        return extractNestedApiListData<ExamSessionDto>(sessionsData, 'examSessions');
    }, [sessionsData]);
    
    React.useEffect(() => {
        if (examSessionsArray.length > 0 && !selectedExamSession) {
            setSelectedExamSession(examSessionsArray[0]);
        }
    }, [examSessionsArray, selectedExamSession]);

    const {data: applicationsData} = useGetApplicationsByExamSession(selectedExamSession?.id || '', {
        query: { 
            enabled: !!selectedExamSession?.id,
            refetchOnMount: true,
            staleTime: 0,
        }
    });
    
    const applicationsArray = useMemo(() => {
        if (applicationsData && typeof applicationsData === 'object' && 'data' in applicationsData) {
            const apiData = (applicationsData as { data?: unknown }).data;
            if (Array.isArray(apiData)) {
                return apiData;
            }
        }
        return (applicationsData as unknown as { data?: ApplicationDto[] })?.data || [];
    }, [applicationsData]);

    const handleSessionSelect = useCallback((record: RecordType) => {
        setSelectedExamSession(record as ExamSessionDto);
    }, []);

    const renderSessionCell = useCallback((value: unknown, record: RecordType) => {
        return (
            <div
                className="font-medium cursor-pointer hover:text-blue-600"
                onClick={() => {
                    handleSessionSelect(record);
                    router.push(`/admin/sessions/${record.id}`);
                }}
            >
                {String(value || '')}
            </div>
        );
    }, [handleSessionSelect, router]);

    const renderApplicationCell = useCallback((value: unknown, record: RecordType) => {
        return (
            <div
                className="font-medium cursor-pointer hover:text-blue-600"
                onClick={() => router.push(`/admin/applications/${record.id}`)}
            >
                {String(value || '')}
            </div>
        );
    }, [router]);

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
            render: renderApplicationCell
        },
        {
            key: 'code',
            header: 'Kod',
            render: renderApplicationCell
        },
        {
            key: 'description',
            header: 'Açıklama',
            render: renderApplicationCell
        }
    ], [renderApplicationCell]);

    const handleAdd = useCallback(() => {
        router.push('/admin/applications/add');
    }, [router]);

    if (isLoading) {
        return <LoadingComp/>;
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-600">Oturumlar yüklenirken bir hata oluştu.</p>
            </div>
        );
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
                <DynamicTable 
                    columns={columnSessions} 
                    data={examSessionsArray}
                />
            </div>

            <div className="p-6 pt-1">
                <DynamicTable 
                    columns={columns} 
                    data={applicationsArray}
                />
            </div>
        </div>
    );
}
