'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useApplication} from "@/hooks/exam/use-application";
import {useExamSession} from "@/hooks/exam/use-exam-session";
import {ExamSessionDto} from "@/types/exam/examEntities";

export default function ApplicationPage() {
    const router = useRouter();

    const[selectedExamSession, setSelectedExamSession] = React.useState<ExamSessionDto | null>(null);

    const {
        getActiveExamSessions,
        examSessions,
        loading
    } = useExamSession();


    const {
        getApplicationsByExamSession,
        applications,
    } = useApplication();



    useEffect(() => {
        getActiveExamSessions();
    }, []);

    useEffect(() => {
        if(selectedExamSession){
            getApplicationsByExamSession(selectedExamSession.id);
        }
    }, [selectedExamSession]);

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
                    <DynamicTable columns={columnSessions} data={examSessions.examSessions}/>
                }

            </div>

            <div className="p-6 pt-1">
                {
                    applications &&
                    <DynamicTable columns={columns} data={applications}/>
                }

            </div>
        </div>
    );
}