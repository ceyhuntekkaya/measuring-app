'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useBranch} from "@/hooks/exam/use-branch";

export default function BranchPage() {
    const router = useRouter();
    const {
        getAllBranches,
        branches,
        loading
    } = useBranch();

    useEffect(() => {
        getAllBranches();
    }, []);

    const columns: Column<RecordType>[] = [

        {
            key: 'branchName',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/branches/${record.id}`)}
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
                    onClick={() => router.push(`/admin/branches/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'brandId',
            header: 'Marka Id',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/branches/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push('/admin/branches/add');
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
                    branches &&
                    <DynamicTable columns={columns} data={branches}/>
                }

            </div>
        </div>
    );
}