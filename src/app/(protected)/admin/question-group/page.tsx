'use client';
import {Column, RecordType} from "@/types/ui/table";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import Link from "next/link";
import {useQuestionGroup} from "@/hooks/exam/use-question-group";
import {QuestionGroupDto} from "@/types/exam/examEntities";
import {statusConverter} from "@/utils/enum-converter";
import {EStatus} from "@/types/exam/enum";

export default function QuestionGroupPage() {
    const router = useRouter();
    const {
        questionGroups,
        getAllQuestionGroup,
        loading
    } = useQuestionGroup();

    useEffect(() => {
        getAllQuestionGroup();
    }, []);

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
            key: 'status',
            header: 'Durum',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {statusConverter(value as EStatus)}
                </div>
            )
        }


        ,
        {
            key: 'Sınav Tipi',
            header: 'Sınav Tipi',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {(record as QuestionGroupDto).examType?.name}
                </div>
            )
        }
        ,
        {
            key: 'Bölüm',
            header: 'Bölüm',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {(record as QuestionGroupDto).examSection?.name}
                </div>
            )
        },
        {
            key: 'Grup',
            header: 'Grup',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {(record as QuestionGroupDto).questionGroupType?.name}
                </div>
            )
        },



        {
            key: 'approvalCompletedDate',
            header: 'ONAY DURUMU',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {(record as QuestionGroupDto).status}
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
                    <Link className={"btn btn-success"} href={`/admin/question-group/${value}/question`}>Sorular</Link>
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push('/admin/question-group/add');
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
                    addButtonText="Yeni Soru Grubu"
                />
            }/>
            <div className="p-6 pt-1">
                {
                    questionGroups &&
                    <DynamicTable columns={columns} data={questionGroups}/>
                }

            </div>
        </div>
    );
}