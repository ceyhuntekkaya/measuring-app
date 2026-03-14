'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import { useRouter } from "next/navigation";
import BranchForm from "@/components/form/branch-form";
import {useGetAllBrands} from "@/api/generated/brand-management/brand-management";
import {useUpdateBranch, useGetBranchById} from "@/api/generated/branch-management/branch-management";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";
import {useParams} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import type { BranchDto, UpdateBranchRequest, CreateBranchRequest, ApiResponseListBrandDto, ApiResponseBranchDto } from "@/api/generated/model";

export default function BranchEdit() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: brandsData } = useGetAllBrands();
    const brands = (brandsData as unknown as ApiResponseListBrandDto)?.data || null;

    const { data, isLoading: isLoadingBranch } = useGetBranchById(id);
    const selectedBranch = (data as unknown as ApiResponseBranchDto)?.data as BranchDto | undefined;

    const { mutate: updateBranch, isPending: isUpdating } = useUpdateBranch({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/branches'] });
                queryClient.invalidateQueries({ queryKey: [`/branches/${id}`] });
                showNotification.success('Şube başarıyla güncellendi!');
                router.push(`/admin/branches/${id}`);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Şube güncellenirken bir hata oluştu!');
            }
        }
    });

    // No manual mapping needed - formData is already UpdateBranchRequest!
    const handleSubmit = (formData: CreateBranchRequest | UpdateBranchRequest) => {
        updateBranch({ id, data: formData as UpdateBranchRequest });
    };

    if (isLoadingBranch) {
        return <LoadingComp/>;
    }

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {brands && selectedBranch && (
                    <BranchForm branch={selectedBranch} onSubmit={handleSubmit} loading={isUpdating} brands={brands} />
                )}
            </div>
        </div>
    )
}
