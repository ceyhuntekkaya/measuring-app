'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useMemo, useCallback} from "react";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useGetAllBranches} from "@/api/generated/branch-management/branch-management";
import {extractApiListData} from "@/utils/api-helpers/extract-api-data";
import type {BranchDto} from "@/api/generated/model";

export default function BranchPage() {
    const router = useRouter();
    const { data, isLoading, error } = useGetAllBranches({
        query: {
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            staleTime: 0,
        }
    });
    
    const branches = useMemo(() => extractApiListData<BranchDto>(data), [data]);

    const columns: Column<RecordType>[] = useMemo(() => [
        {
            key: 'branchName',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/branches/${record.id}`)}
                >
                    {String(value || '')}
                </div>
            )
        },
        {
            key: 'code',
            header: 'Kod',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/branches/${record.id}`)}
                >
                    {String(value || '')}
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
                    {String(value || '')}
                </div>
            )
        }
    ], [router]);

    const handleAdd = useCallback(() => {
        router.push('/admin/branches/add');
    }, [router]);


    if (isLoading) {
        return <LoadingComp/>;
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-600">Şubeler yüklenirken bir hata oluştu.</p>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                    addButtonText="Yeni Şube Tanımla"
                />
            }/>
            <div className="p-6 pt-1">
                {
                    branches &&
                    <DynamicTable columns={columns} data={branches as RecordType[]}/>
                }

            </div>
        </div>
    );
}