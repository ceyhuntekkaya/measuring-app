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

export default function SessionAdd() {

    const createExamSessionMutation = useCreateExamSession();
    const createExamSession = async (data: CreateExamSessionRequest) => {
        await createExamSessionMutation.mutateAsync({ data });
    };
    const loading = createExamSessionMutation.isPending;

    const { data: brandsData } = useGetAllBrands();
    const brands = (brandsData as unknown as ApiResponseListBrandDto)?.data || null;

    const [selectedBrandId, setSelectedBrandId] = React.useState<string | null>(null);
    const { data: branchesData } = useGetBranchesByBrand(selectedBrandId || '', {
        query: { enabled: !!selectedBrandId }
    });
    const brandBranches = (branchesData as unknown as ApiResponseListBranchDto)?.data || null;

    const { data: usersData } = useGetUsersByDepartment('SUPERVISOR', {});
    const users = (usersData as unknown as ApiResponseListUserDto)?.data || null;

    const { data: examTypesData } = useGetAllExamTypes({});
    const examTypes = (examTypesData as unknown as ApiResponseExamTypeListResponse)?.data || null;


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
                    <ExamSessionForm onSubmit={createExamSession} loading={loading} supervisors={users} brands={brands}
                                     branches={brandBranches} onBrandChange={onBrandChange} examTypes={examTypes.examTypes || []}/>
                }

            </div>
        </div>
    )
}