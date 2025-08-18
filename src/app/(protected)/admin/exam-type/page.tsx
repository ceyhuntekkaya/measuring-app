'use client';
import {Column, RecordType} from "@/types/ui/table";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import {useExamType} from "@/hooks/exam/use-exam-type";
import Link from "next/link";

export default function ExamTypePage() {
    const router = useRouter();
    const {
        examTypes,
        getAllExamTypes,
        loading
    } = useExamType();

    useEffect(() => {
        getAllExamTypes();
    }, []);

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
                    {value as string}
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
                    {value as string}
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
                    <Link href={`/admin/exam-type/${value}/section`}>Bölümler</Link>
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push('/admin/exam-type/add');
    };


    if (loading) {
        return (
            <LoadingComp/>
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
                    <DynamicTable columns={columns} data={examTypes.examTypes}/>
                }

            </div>
        </div>
    );
}