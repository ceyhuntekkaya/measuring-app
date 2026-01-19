'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useMemo, useCallback} from "react";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import DynamicTable from "@/components/ui/dynamic-table";
import {useGetUpcomingExamSessions} from "@/api/generated/exam-session-management/exam-session-management";
import {formatDate} from "@/utils/date-formater";
import {extractApiListData} from "@/utils/api-helpers/extract-api-data";
import type {ExamSessionDto} from "@/api/generated/model";


export default function SessionsPage() {
    const router = useRouter();
    const {data, isLoading, error} = useGetUpcomingExamSessions({
        query: {
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            staleTime: 0,
        }
    });
    
    const upcomingExamSessions = useMemo(() => {
        if (data && typeof data === 'object' && 'data' in data) {
            const apiData = (data as any).data;
            if (apiData && typeof apiData === 'object' && 'examSessions' in apiData) {
                return Array.isArray(apiData.examSessions) ? apiData.examSessions : [];
            }
            if (Array.isArray(apiData)) {
                return apiData;
            }
        }
        return extractApiListData<ExamSessionDto>(data);
    }, [data]);

    const columns: Column<RecordType>[] = useMemo(() => [
        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/sessions/${record.id}`)}
                >
                    {String(value || '')}
                </div>
            )
        },
        {
            key: 'description',
            header: 'Açıklama',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/sessions/${record.id}`)}
                >
                    {String(value || '')}
                </div>
            )
        },
        {
            key: 'quota',
            header: 'KOTA',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/sessions/${record.id}`)}
                >
                    {String(value || '')}
                </div>
            )
        },
        {
            key: 'examTemplate',
            header: 'Sınav Tipi',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/sessions/${record.id}`)}
                >
                    {String(value || '')}
                </div>
            )
        },
        {
            key: 'startDate',
            header: 'Başlama',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/sessions/${record.id}`)}
                >
                    {formatDate(value as string, 'dateTime')}
                </div>
            )
        }
    ], [router]);

    const handleAdd = useCallback(() => {
        router.push('/admin/sessions/add');
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
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                    addButtonText="Yeni Oturum Planla"
                />
            }/>
            <div className="p-6 pt-1">
                <DynamicTable columns={columns} data={upcomingExamSessions as RecordType[]}/>
            </div>
        </div>
    );
}