'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useUser} from "@/hooks/use-user";

export default function CandidatePage() {
    const router = useRouter();
    const {
        getAllUsers,
        users,
        loading
    } = useUser();

    useEffect(() => {
        getAllUsers();
    }, []);

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
                    <DynamicTable columns={columns} data={users}/>
                }

            </div>
        </div>
    );
}



