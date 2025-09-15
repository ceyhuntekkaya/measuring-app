'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useCandidate} from "@/hooks/exam/use-candidate";

export default function CandidatePage() {
    const router = useRouter();
    const {
        getAllCandidates,
        candidates,
        loading
    } = useCandidate();

    useEffect(() => {
        getAllCandidates();
    }, []);

    const columns: Column<RecordType>[] = [

        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/candidates/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
        ,
        {
            key: 'lastName',
            header: 'Soyadı',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/candidates/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'identityNumber',
            header: 'Kimlik No',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/candidates/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push('/admin/candidates/add');
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
                    addButtonText="Yeni Marka Tanımla"
                />
            }/>
            <div className="p-6 pt-1">
                {
                    candidates &&
                    <DynamicTable columns={columns} data={candidates}/>
                }

            </div>
        </div>
    );
}