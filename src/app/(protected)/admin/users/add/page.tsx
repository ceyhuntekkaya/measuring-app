'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useCreateUser} from "@/api/generated/user-management/user-management";
import UserForm from "@/components/form/user-form";
import {useGetAllBrands} from "@/api/generated/brand-management/brand-management";
import type { ApiResponseListBrandDto, CreateUserRequest, UpdateUserRequest } from "@/api/generated/model";


export default function CandidateAdd() {
    const createUserMutation = useCreateUser();
    const createUser = async (data: CreateUserRequest | UpdateUserRequest): Promise<void> => {
        await createUserMutation.mutateAsync({ data: data as CreateUserRequest });
    };


    const { data: brandsData } = useGetAllBrands();
    const brands = (brandsData as unknown as ApiResponseListBrandDto)?.data || null;


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">{
                brands && <UserForm onSubmit={createUser} brands={brands}/>
            }


            </div>
        </div>
    )
}