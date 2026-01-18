'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useGetAllBranches} from "@/api/generated/branch-management/branch-management";
import type { ApiResponseListBranchDto } from "@/api/generated/model";

export default function BranchPage() {
    const router = useRouter();
    const { data, isLoading, error } = useGetAllBranches();
    
    // Extract branches from API response
    const branches = (data as unknown as ApiResponseListBranchDto)?.data || null;

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