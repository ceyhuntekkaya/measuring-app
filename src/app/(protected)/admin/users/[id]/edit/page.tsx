'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useParams, useRouter} from "next/navigation";
import UserForm from "@/components/form/user-form";
import {useGetUserById, useUpdateUser} from "@/api/generated/user-management/user-management";
import {useGetAllBrands} from "@/api/generated/brand-management/brand-management";
import type { ApiResponseListBrandDto, UpdateUserRequest, ApiResponseUserDto } from "@/api/generated/model";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";


export default function CandidateEdit() {

    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const queryClient = useQueryClient();

    const {data: userData} = useGetUserById(id, {
        query: { enabled: !!id }
    });
    const selectedUser = (userData as unknown as ApiResponseUserDto)?.data;
    
    const { mutate: updateUser, isPending: loading } = useUpdateUser({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/users'] });
                queryClient.invalidateQueries({ queryKey: [`/users/${id}`] });
                showNotification.success('Kullanıcı başarıyla güncellendi!');
                router.push(`/admin/users/${id}`);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Kullanıcı güncellenirken bir hata oluştu!');
            }
        }
    });
    
    const handleSubmit = async (data: UpdateUserRequest) => {
        updateUser({ id, data });
    };

    const { data: brandsData } = useGetAllBrands();
    const brands = (brandsData as unknown as ApiResponseListBrandDto)?.data || null;

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {brands &&
                    selectedUser && <UserForm onSubmit={handleSubmit} user={selectedUser} brands={brands} loading={loading}/>
                }


            </div>
        </div>
    )
}