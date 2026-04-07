'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import { useRouter } from "next/navigation";
import BranchForm from "@/components/form/branch-form";
import {useGetAllBrands} from "@/api/generated/brand-management/brand-management";
import {useCreateBranch} from "@/api/generated/branch-management/branch-management";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";
import type { CreateBranchRequest, UpdateBranchRequest, ApiResponseListBrandDto } from "@/api/generated/model";

export default function BranchAdd() {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const { data: brandsData } = useGetAllBrands<ApiResponseListBrandDto>();
    const brands = brandsData?.data || null;

    const { mutate: createBranch, isPending: loading } = useCreateBranch({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/branches'] });
                showNotification.success('Şube başarıyla oluşturuldu!');
                router.push('/admin/branches');
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Şube oluşturulurken bir hata oluştu!');
            }
        }
    });

    // No manual mapping needed - formData is already CreateBranchRequest!
    const handleSubmit = (formData: CreateBranchRequest | UpdateBranchRequest) => {
        createBranch({ data: formData as CreateBranchRequest });
    };

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {brands && <BranchForm onSubmit={handleSubmit} loading={loading} brands={brands} />}
            </div>
        </div>
    )
}
