'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useMemo, useCallback} from "react";
import {useRouter} from "next/navigation";
import {useGetAllBrands} from "@/api/generated/brand-management/brand-management";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {extractApiListData} from "@/utils/api-helpers/extract-api-data";
import type {BrandDto} from "@/api/generated/model";

export default function BrandsPage() {
    const router = useRouter();
    const { data, isLoading, error } = useGetAllBrands();
    
    const brands = useMemo(() => extractApiListData<BrandDto>(data), [data]);

    const columns: Column<RecordType>[] = useMemo(() => [
        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/brands/${record.id}`)}
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
                    onClick={() => router.push(`/admin/brands/${record.id}`)}
                >
                    {String(value || '')}
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
                    {String(value || '')}
                </div>
            )
        }
    ], [router]);

    const handleAdd = useCallback(() => {
        router.push('/admin/brands/add');
    }, [router]);


    if (isLoading) {
        return <LoadingComp/>;
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-600">Markalar yüklenirken bir hata oluştu.</p>
            </div>
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
                    <DynamicTable columns={columns} data={brands as RecordType[]}/>
                }

            </div>
        </div>
    );
}