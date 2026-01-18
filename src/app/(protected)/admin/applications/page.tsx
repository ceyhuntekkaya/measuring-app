'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useGetApplicationsByExamSession} from "@/api/generated/application-management/application-management";
import {useGetActiveExamSessions} from "@/api/generated/exam-session-management/exam-session-management";
import type {ExamSessionDto, ExamSessionListResponse, ApplicationDto} from "@/api/generated/model";

export default function ApplicationPage() {
    const router = useRouter();

    const[selectedExamSession, setSelectedExamSession] = React.useState<ExamSessionDto | null>(null);

    const {data: sessionsData, isLoading: loading} = useGetActiveExamSessions({});
    const examSessions = (sessionsData as unknown as ExamSessionListResponse) || null;

    const {data: applicationsData} = useGetApplicationsByExamSession(selectedExamSession?.id || '', {
        query: { enabled: !!selectedExamSession?.id }
    });
    const applications = (applicationsData as unknown as { data?: ApplicationDto[] })?.data || null;

    const columnSessions: Column<RecordType>[] = [

        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => setSelectedExamSession(record as ExamSessionDto)}
                >
                    {value as string}
                </div>
            )
        }
        ,
        {
            key: 'code',
            header: 'Kod',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => setSelectedExamSession(record as ExamSessionDto)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'description',
            header: 'Açıklama',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => setSelectedExamSession(record as ExamSessionDto)}
                >
                    {value as string}
                </div>
            )
        }
    ];



    const columns: Column<RecordType>[] = [

        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => setSelectedExamSession(record as ExamSessionDto)}
                >
                    {value as string}
                </div>
            )
        }
        ,
        {
            key: 'code',
            header: 'Kod',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => setSelectedExamSession(record as ExamSessionDto)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'description',
            header: 'Açıklama',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => setSelectedExamSession(record as ExamSessionDto)}
                >
                    {value as string}
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push('/admin/applications/add');
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
                    addButtonText="Yeni Uygulama Tanımla"
                />
            }/>
            <div className="p-6 pt-1">
                {
                    examSessions &&
                    <DynamicTable columns={columnSessions} data={examSessions.examSessions as RecordType[]}/>
                }

            </div>

            <div className="p-6 pt-1">
                {
                    applications &&
                    <DynamicTable columns={columns} data={applications as RecordType[]}/>
                }

            </div>
        </div>
    );
}