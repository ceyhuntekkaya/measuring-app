'use client';
import {Column, RecordType} from "@/types/ui/table";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useParams, useRouter} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import Link from "next/link";
import {useExamSection} from "@/hooks/exam/use-exam-section";

export default function ExamSectionPage() {
    const router = useRouter();
    const params = useParams();
    const examTypeId = params.examTypeId as string;
    const {
        sectionsByExamType,
        getExamSectionsByExamType,
        loading
    } = useExamSection();

    useEffect(() => {
        getExamSectionsByExamType(examTypeId);
    }, []);

    const columns: Column<RecordType>[] = [

        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/exam-type/${examTypeId}/section/${record.id}`)}
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
                    onClick={() => router.push(`/admin/exam-type/${examTypeId}/section/${record.id}`)}
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
                    <Link href={`/admin/exam-type/${examTypeId}/section/${value}/group`}>GRUPLAR</Link>
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push('/admin/exam-type/${examTypeId}/section/add');
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
                    addButtonText="Yeni Bölüm Tanımla"
                />
            }/>
            <div className="p-6 pt-1">
                {
                    sectionsByExamType &&
                    <DynamicTable columns={columns} data={sectionsByExamType}/>
                }

            </div>
        </div>
    );
}