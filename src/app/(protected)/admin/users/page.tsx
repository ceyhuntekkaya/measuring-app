'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useMemo, useCallback} from "react";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useGetAllUsers} from "@/api/generated/user-management/user-management";
import {extractApiListData} from "@/utils/api-helpers/extract-api-data";
import type {UserDto} from "@/api/generated/model";

export default function UsersPage() {
    const router = useRouter();
    const {data, isLoading, error} = useGetAllUsers();
    
    const users = useMemo(() => extractApiListData<UserDto>(data), [data]);

    const columns: Column<RecordType>[] = useMemo(() => [
        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/users/${record.id}`)}
                >
                    {String(value || '')}
                </div>
            )
        },
        {
            key: 'lastName',
            header: 'Soyadı',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/users/${record.id}`)}
                >
                    {String(value || '')}
                </div>
            )
        }
    ], [router]);

    const handleAdd = useCallback(() => {
        router.push('/admin/users/add');
    }, [router]);

    if (isLoading) {
        return <LoadingComp/>;
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-600">Kullanıcılar yüklenirken bir hata oluştu.</p>
            </div>
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
                {users && users.length > 0 && (
                    <DynamicTable columns={columns} data={users as RecordType[]}/>
                )}
            </div>
        </div>
    );
}



