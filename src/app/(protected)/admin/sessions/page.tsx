'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import DynamicTable from "@/components/ui/dynamic-table";
import {useExamSession} from "@/hooks/exam/use-exam-session";


export default function AdminPage() {
    const router = useRouter();
    const {
        getUpcomingExamSessions,
        upcomingExamSessions,
        loading
    } = useExamSession();

    useEffect(() => {
        getUpcomingExamSessions();
    }, []);

    const columns: Column<RecordType>[] = [

        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/sessions/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
        ,
        {
            key: 'description',
            header: 'description',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/sessions/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'quota',
            header: 'quota',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/sessions/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
        ,
        {
            key: 'examTemplate',
            header: 'examTemplate',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/sessions/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
        ,
        {
            key: 'startDate',
            header: 'startDate',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/sessions/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
        ,
        {
            key: 'startDate',
            header: 'Katılımcı Sayısı',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/sessions/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push('/admin/sessions/add');
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
                    addButtonText="Yeni Oturum Planla"
                />
            }/>
            <div className="p-6 pt-1">
                {
                    upcomingExamSessions &&
                    <DynamicTable columns={columns} data={upcomingExamSessions}/>
                }

            </div>
        </div>
    );
}