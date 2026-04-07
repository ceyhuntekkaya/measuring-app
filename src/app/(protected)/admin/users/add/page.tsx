'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useCreateUser} from "@/api/generated/user-management/user-management";
import UserForm from "@/components/form/user-form";
import {useGetAllBrands} from "@/api/generated/brand-management/brand-management";
import type { ApiResponseListBrandDto, CreateUserRequest, UpdateUserRequest } from "@/api/generated/model";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { showNotification, getErrorMessage } from "@/lib/notification";


export default function CandidateAdd() {
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const { mutate: createUser, isPending: loading } = useCreateUser({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/users'] });
                showNotification.success('Kullanıcı başarıyla eklendi!');
                router.push('/admin/users');
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Kullanıcı eklenirken bir hata oluştu!');
            }
        }
    });
    
    const handleSubmit = async (data: CreateUserRequest | UpdateUserRequest): Promise<void> => {
        createUser({ data: data as CreateUserRequest });
    };


    const { data: brandsData } = useGetAllBrands<ApiResponseListBrandDto>();
    const brands = brandsData?.data || null;


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">{
                brands && <UserForm onSubmit={handleSubmit} brands={brands} loading={loading}/>
            }


            </div>
        </div>
    )
}