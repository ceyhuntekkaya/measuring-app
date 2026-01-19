'use client';
import {Column, RecordType} from "@/types/ui/table";
import React, {useMemo, useCallback} from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import Link from "next/link";
import {useGetAllQuestionGroups} from "@/api/generated/question-group-management/question-group-management";
import {extractApiListData} from "@/utils/api-helpers/extract-api-data";
import type {QuestionGroupDto} from "@/api/generated/model";
import {statusConverter} from "@/utils/enum-converter";
import {EStatus} from "@/types/exam/enum";

export default function QuestionGroupPage() {
    const router = useRouter();
    const {data, isLoading, error} = useGetAllQuestionGroups();
    
    const questionGroups = useMemo(() => extractApiListData<QuestionGroupDto>(data), [data]);

    const columns: Column<RecordType>[] = useMemo(() => [
        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {String(value || '')}
                </div>
            )
        },
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
        },
        {
            key: 'Sınav Tipi',
            header: 'Sınav Tipi',
            render: (value, record) => {
                const group = record as QuestionGroupDto;
                return (
                    <div
                        className="font-medium cursor-pointer hover:text-blue-600"
                        onClick={() => router.push(`/admin/question-group/${record.id}`)}
                    >
                        {group.examType?.name}<br/>
                        {group.examSection?.name}<br/>
                        {group.questionGroupType?.name}
                    </div>
                );
            }
        },
        {
            key: 'id',
            header: ' ',
            render: (value) => (
                <div className="font-medium cursor-pointer hover:text-blue-600">
                    <Link className="btn btn-success" href={`/admin/question-group/${value}/question`}>
                        Sorular
                    </Link>
                </div>
            )
        }
    ], [router]);

    const handleAdd = useCallback(() => {
        router.push('/admin/question-group/add');
    }, [router]);


    if (isLoading) {
        return <LoadingComp/>;
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-600">Soru grupları yüklenirken bir hata oluştu.</p>
            </div>
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
                {questionGroups && questionGroups.length > 0 && (
                    <DynamicTable columns={columns} data={questionGroups as RecordType[]}/>
                )}
            </div>
        </div>
    );
}