'use client';

import {useParams} from "next/navigation";
import React from "react";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";
import {useGetBrandById} from "@/api/generated/brand-management/brand-management";
import BrandDetail from "@/components/detail/BrandDetail";
import type { BrandDto } from "@/api/generated/model";
import type { ApiResponseBrandDto } from "@/api/generated/model";

export default function BrandDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const { data, isLoading, error } = useGetBrandById(id);
    
    // Extract brand from API response
    const selectedBrand = (data as unknown as ApiResponseBrandDto)?.data as BrandDto | undefined;

    if (isLoading) {
        return <LoadingComp/>;
    }

    if (error || !selectedBrand) {
        return (
            <div className="space-y-6">
                <PageHeader/>
                <div className="p-1">
                    <p className="text-red-600">Marka bulunamadı veya yüklenirken bir hata oluştu.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <BrandDetail brand={selectedBrand}/>
            </div>
        </div>
    );
}