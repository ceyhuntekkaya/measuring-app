'use client';

import {useParams} from "next/navigation";
import React from "react";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";
import BranchDetail from "@/components/detail/BranchDetail";
import {useGetBranchById} from "@/api/generated/branch-management/branch-management";
import type { BranchDto } from "@/api/generated/model";
import type { ApiResponseBranchDto } from "@/api/generated/model";

export default function BranchDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const { data, isLoading, error } = useGetBranchById(id);
    
    // Extract branch from API response
    const selectedBranch = (data as unknown as ApiResponseBranchDto)?.data as BranchDto | undefined;

    if (isLoading) {
        return <LoadingComp/>;
    }

    if (error || !selectedBranch) {
        return (
            <div className="space-y-4">
                <PageHeader/>
                <div className="px-4">
                    <p className="text-red-600">Şube bulunamadı veya yüklenirken bir hata oluştu.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <PageHeader/>
            <div className="px-4">
                <BranchDetail branch={selectedBranch}/>
            </div>
        </div>
    );



}