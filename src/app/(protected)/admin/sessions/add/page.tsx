'use client';


import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import ExamSessionForm from "@/components/form/ExamSessionForm";
import {useCreateExamSession} from "@/api/generated/exam-session-management/exam-session-management";
import {useGetAllBrands} from "@/api/generated/brand-management/brand-management";
import type { ApiResponseListBrandDto, CreateExamSessionRequest } from "@/api/generated/model";
import {useGetBranchesByBrand} from "@/api/generated/branch-management/branch-management";
import type { ApiResponseListBranchDto, ApiResponseListUserDto } from "@/api/generated/model";
import {useGetUsersByDepartment} from "@/api/generated/user-management/user-management";
import {useGetAllExamTypes} from "@/api/generated/exam-type-management/exam-type-management";
import type { ApiResponseExamTypeListResponse } from "@/api/generated/model";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { showNotification, getErrorMessage } from "@/lib/notification";

export default function SessionAdd() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate: createExamSession, isPending: loading } = useCreateExamSession({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/exam-sessions'] });
                showNotification.success('Sınav oturumu başarıyla eklendi!');
                router.push('/admin/sessions');
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Sınav oturumu eklenirken bir hata oluştu!');
            }
        }
    });
    
    const handleSubmit = async (data: CreateExamSessionRequest) => {
        createExamSession({ data });
    };

    const { data: brandsData } = useGetAllBrands<ApiResponseListBrandDto>();
    const brands = brandsData?.data || null;

    const [selectedBrandId, setSelectedBrandId] = React.useState<string | null>(null);
    const { data: branchesData } = useGetBranchesByBrand<ApiResponseListBranchDto>(selectedBrandId || '', {
        query: { enabled: !!selectedBrandId }
    });
    const brandBranches = branchesData?.data || null;

    const { data: usersData } = useGetUsersByDepartment('ENGLISH', {});
    const users = (usersData as ApiResponseListUserDto | undefined)?.data || null;

    const { data: examTypesData } = useGetAllExamTypes(undefined);
    const examTypes = (examTypesData as ApiResponseExamTypeListResponse | undefined)?.data || null;


    useEffect(() => {
        if(brands && brands.length > 0 && brands[0].id){
            setSelectedBrandId(brands[0].id);
        }
    }, [brands]);

    const onBrandChange = (id: string) => {
        setSelectedBrandId(id);
    }




    //  supervisors?: UserDto[];

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    brands && brandBranches && users && examTypes &&
                    <ExamSessionForm onSubmit={handleSubmit} loading={loading} supervisors={users} brands={brands}
                                     branches={brandBranches} onBrandChange={onBrandChange} examTypes={examTypes.examTypes || []}/>
                }

            </div>
        </div>
    )
}