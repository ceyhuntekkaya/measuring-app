'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import { useRouter } from "next/navigation";
import BrandForm from "@/components/form/brand-form";
import { useCreateBrand } from "@/api/generated/brand-management/brand-management";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification } from "@/lib/notification";
import type { CreateBrandRequest, UpdateBrandRequest } from "@/api/generated/model";

export default function BrandAdd() {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const { mutate: createBrand, isPending: loading } = useCreateBrand({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/brands'] });
                showNotification.success('Marka başarıyla oluşturuldu!');
                router.push('/admin/brands');
            },
            onError: (error) => {
                showNotification.error('Marka oluşturulurken bir hata oluştu!');
                console.error('Error creating brand:', error);
            }
        }
    });

    // No manual mapping needed - formData is already CreateBrandRequest!
    const handleSubmit = async (formData: CreateBrandRequest | UpdateBrandRequest) => {
        createBrand({ data: formData as CreateBrandRequest });
    };

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <BrandForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    )
}