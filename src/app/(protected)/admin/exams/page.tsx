'use client';
import {Column, RecordType} from "@/types/ui/table";
import React, {useMemo, useCallback} from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import {useGetAllExams} from "@/api/generated/exam-management/exam-management";
import {extractApiListData} from "@/utils/api-helpers/extract-api-data";
import type {ExamDto} from "@/api/generated/model";

export default function ExamPage() {
    const router = useRouter();
    const { data, isLoading, error } = useGetAllExams();
    
    const exams = useMemo(() => extractApiListData<ExamDto>(data), [data]);

    const columns: Column<RecordType>[] = useMemo(() => [
        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/exams/${record.id}`)}
                >
                    {String(value || '')}
                </div>
            )
        },
        {
            key: 'code',
            header: 'Seviye',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/exams/${record.id}`)}
                >
                    {String(value || '')}
                </div>
            )
        },
        {
            key: 'id',
            header: '',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/exam/${record.id}`)}
                >
                    ÖN İZLEME
                </div>
            )
        }
    ], [router]);

    const handleAdd = useCallback(() => {
        router.push('/admin/exams/add');
    }, [router]);


    if (isLoading) {
        return <LoadingComp/>;
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-600">Sınavlar yüklenirken bir hata oluştu.</p>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                    addButtonText="Yeni Sınav Tanımla"
                />
            }/>
            <div className="p-6 pt-1">
                {exams && exams.length > 0 && (
                    <DynamicTable columns={columns} data={exams as RecordType[]}/>
                )}
            </div>
        </div>
    );
}