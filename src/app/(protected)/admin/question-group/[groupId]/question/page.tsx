'use client';
import {Column, RecordType} from "@/types/ui/table";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useParams, useRouter} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import Link from "next/link";
import {useQuestionGroup} from "@/hooks/exam/use-question-group";
import {QuestionDto} from "@/types/exam/examEntities";
import {useQuestion} from "@/hooks/exam/use-question";

export default function QuestionPage() {
    const router = useRouter();
    const params = useParams();
    const groupId = params.groupId as string;
    const {
        selectedQuestionGroup,
        getQuestionGroupById,
    } = useQuestionGroup();


    const {
        questionsByGroup,
        getQuestionsByGroup,
        loading
    } = useQuestion();

    useEffect(() => {
        getQuestionGroupById(groupId);
        getQuestionsByGroup(groupId)
    }, []);


    console.log(selectedQuestionGroup)

    const columns: Column<RecordType>[] = [

        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
        ,

        {
            key: 'orderNumber',
            header: 'Sıra',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }


        ,
        {
            key: 'approvalStatus',
            header: 'Durum',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {(record as QuestionDto).currentApprovalCount} / {(record as QuestionDto).requiredApprovalCount} {value as string}
                </div>
            )
        }
        ,
        {
            key: 'approvalCompletedDate',
            header: 'Bölüm',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {(record as QuestionDto).questionGroup?.name}
                </div>
            )
        }
        ,
        {
            key: 'Grup',
            header: 'Grup',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {(record as QuestionDto).questionType}
                </div>
            )
        },
        {
            key: 'id',
            header: ' ',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    <Link href={`/admin/question-group/${value}/question`}>Sorular</Link>
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
                    addButtonText="Müşteri Bilgierini Çek"
                />
            }/>
            <div className="p-6">
                {
                    questionsByGroup &&
                    <DynamicTable columns={columns} data={questionsByGroup}/>
                }

                {
                    //<MultipleChoiceQuestion template={}/>
                }

            </div>
        </div>
    );
}