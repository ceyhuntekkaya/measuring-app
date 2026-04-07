'use client';
import {Column, RecordType} from "@/types/ui/table";
import React from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import {useGetAllExamTypes} from "@/api/generated/exam-type-management/exam-type-management";
import type { ApiResponseExamTypeListResponse } from "@/api/generated/model";
import Link from "next/link";
import {examTypeConverter, statusConverter} from "@/utils/enum-converter";
import {EExamType, EStatus} from "@/types/exam/enum";

export default function ExamTypePage() {
    const router = useRouter();
    const { data, isLoading, error } = useGetAllExamTypes<ApiResponseExamTypeListResponse>(undefined, {
        query: {
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            staleTime: 0,
        }
    });
    
    // Extract examTypes from API response
    const examTypes = data?.data || null;

    const columns: Column<RecordType>[] = [

        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/exam-type/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
        ,
        {
            key: 'examLevel',
            header: 'Seviye',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/exam-type/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'examType',
            header: 'Sınav Tipi',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/exam-type/${record.id}`)}
                >
                    {examTypeConverter(value as EExamType)}
                </div>
            )
        }
        ,
        {
            key: 'status',
            header: 'durum',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/exam-type/${record.id}`)}
                >
                    {statusConverter(value as EStatus)}
                </div>
            )
        }
        ,
        {
            key: 'id',
            header: ' ',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    <Link className={"btn btn-success"} href={`/admin/exam-type/${value}/section`}>Sınav Bölümleri</Link>
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push('/admin/exam-type/add');
    };


    if (isLoading) {
        return <LoadingComp/>;
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-600">Sınav tipleri yüklenirken bir hata oluştu.</p>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                    addButtonText="Yeni Sınav Tipi Tanımla"
                />
            }/>
            <div className="p-6 pt-1">
                {
                    examTypes &&
                    <DynamicTable columns={columns} data={examTypes.examTypes as RecordType[]}/>
                }

            </div>
        </div>
    );
}