'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useBrand} from "@/hooks/exam/use-brand";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";

export default function BrandsPage() {
    const router = useRouter();
    const {
        getAllBrands,
        brands,
        loading
    } = useBrand();

    useEffect(() => {
        getAllBrands();
    }, []);

    const columns: Column<RecordType>[] = [

        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/brands/${record.id}`)}
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
                    onClick={() => router.push(`/admin/brands/${record.id}`)}
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
                    onClick={() => router.push(`/admin/brands/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push('/admin/brands/add');
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
                    brands &&
                    <DynamicTable columns={columns} data={brands}/>
                }

            </div>
        </div>
    );
}