'use client';
import {Column, RecordType} from "@/types/ui/table";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import {useExam} from "@/hooks/exam/use-exam";

export default function ExamPage() {
    const router = useRouter();
    const {
        exams,
        getAllExams,
        loading
    } = useExam();

    useEffect(() => {
        getAllExams();
    }, []);

    const columns: Column<RecordType>[] = [

        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/exams/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
        ,
        {
            key: 'code',
            header: 'Seviye',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/exams/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'id',
            header: 'Seviye',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/exam/${record.id}`)}
                >
                    ÖN İZLEME
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push('/admin/exams/add');
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
                    addButtonText="Yeni Sınav Tanımla"
                />
            }/>
            <div className="p-6 pt-1">
                {
                    exams &&
                    <DynamicTable columns={columns} data={exams}/>
                }

            </div>
        </div>
    );
}