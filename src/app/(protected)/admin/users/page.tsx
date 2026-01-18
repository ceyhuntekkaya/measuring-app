'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useGetAllUsers} from "@/api/generated/user-management/user-management";
import type {ApiResponseListUserDto} from "@/api/generated/model";

export default function CandidatePage() {
    const router = useRouter();
    const {data, isLoading: loading} = useGetAllUsers();
    
    const users = (data as unknown as ApiResponseListUserDto)?.data;

    const columns: Column<RecordType>[] = [

        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/users/${record.id}`)}
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
                    onClick={() => router.push(`/admin/users/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push('/admin/users/add');
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
                    addButtonText="Yeni Kullanıcı Tanımla"
                />
            }/>
            <div className="p-6 pt-1">
                {
                    users &&
                    <DynamicTable columns={columns} data={users as RecordType[]}/>
                }

            </div>
        </div>
    );
}



