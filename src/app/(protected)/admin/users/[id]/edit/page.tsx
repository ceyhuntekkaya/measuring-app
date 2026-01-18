'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useParams} from "next/navigation";
import UserForm from "@/components/form/user-form";
import {useGetUserById, useUpdateUser} from "@/api/generated/user-management/user-management";
import {useGetAllBrands} from "@/api/generated/brand-management/brand-management";
import type { ApiResponseListBrandDto, UpdateUserRequest, ApiResponseUserDto } from "@/api/generated/model";


export default function CandidateEdit() {

    const params = useParams();
    const id = params.id as string;

    const {data: userData} = useGetUserById(id, {
        query: { enabled: !!id }
    });
    const selectedUser = (userData as unknown as ApiResponseUserDto)?.data;
    
    const updateUserMutation = useUpdateUser();
    const updateUser = async (data: UpdateUserRequest) => {
        await updateUserMutation.mutateAsync({ id, data });
    };

    const { data: brandsData } = useGetAllBrands();
    const brands = (brandsData as unknown as ApiResponseListBrandDto)?.data || null;

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {brands &&
                    selectedUser && <UserForm onSubmit={updateUser} user={selectedUser} brands={brands}/>
                }


            </div>
        </div>
    )
}