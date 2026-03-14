'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import { useRouter } from "next/navigation";
import BrandForm from "@/components/form/brand-form";
import { useUpdateBrand, useGetBrandById } from "@/api/generated/brand-management/brand-management";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";
import {useParams} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import type { UpdateBrandRequest, CreateBrandRequest, ApiResponseBrandDto, BrandDto } from "@/api/generated/model";

export default function BrandEdit() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading: isLoadingBrand } = useGetBrandById(id);
    const selectedBrand = (data as unknown as ApiResponseBrandDto)?.data as BrandDto | undefined;

    const { mutate: updateBrand, isPending: isUpdating } = useUpdateBrand({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/brands'] });
                queryClient.invalidateQueries({ queryKey: [`/brands/${id}`] });
                showNotification.success('Marka başarıyla güncellendi!');
                router.push(`/admin/brands/${id}`);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Marka güncellenirken bir hata oluştu!');
            }
        }
    });

    // No manual mapping needed - formData is already UpdateBrandRequest!
    const handleSubmit = async (formData: CreateBrandRequest | UpdateBrandRequest) => {
        updateBrand({ id, data: formData as UpdateBrandRequest });
    };

    if (isLoadingBrand) {
        return <LoadingComp/>;
    }

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <BrandForm onSubmit={handleSubmit} loading={isUpdating} brand={selectedBrand || null} />
            </div>
        </div>
    )
}