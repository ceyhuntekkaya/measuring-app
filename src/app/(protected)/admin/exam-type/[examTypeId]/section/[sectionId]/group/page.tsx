'use client';
import {Column, RecordType} from "@/types/ui/table";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useParams, useRouter} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import {useQuestionGroupType} from "@/hooks/exam/use-question-group-type";

export default function QuestionGroupTypePage() {
    const router = useRouter();
    const params = useParams();
    const examTypeId = params.examTypeId as string;
    const examSectionId = params.sectionId as string;
    const {
        typesByExamSection,
        getQuestionGroupTypesByExamSection,
        loading
    } = useQuestionGroupType();

    useEffect(() => {
        getQuestionGroupTypesByExamSection(examSectionId);
    }, []);

    const columns: Column<RecordType>[] = [

        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/exam-type/${examTypeId}/section/${examSectionId}/group/${record.id}`)}
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
                    onClick={() => router.push(`/admin/exam-type/${examTypeId}/section/${examSectionId}/group/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }

    ];

    const handleAdd = () => {
        router.push('/admin/exam-type/${examTypeId}/section/${examSectionId}/group/add');
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
                    addButtonText="Yeni Grup Tanımla"
                />
            }/>
            <div className="p-6 pt-1">
                {
                    typesByExamSection &&
                    <DynamicTable columns={columns} data={typesByExamSection}/>
                }

            </div>
        </div>
    );
}