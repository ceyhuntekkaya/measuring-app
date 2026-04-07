'use client';


import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import ExamSessionForm from "@/components/form/ExamSessionForm";
import {useGetExamSessionById, useUpdateExamSession} from "@/api/generated/exam-session-management/exam-session-management";
import {useGetAllBrands} from "@/api/generated/brand-management/brand-management";
import type { ApiResponseListBrandDto, UpdateExamSessionRequest } from "@/api/generated/model";
import {useGetBranchesByBrand} from "@/api/generated/branch-management/branch-management";
import type { ApiResponseListBranchDto } from "@/api/generated/model";
import {useGetUsersByDepartment} from "@/api/generated/user-management/user-management";
import {useGetAllExamTypes} from "@/api/generated/exam-type-management/exam-type-management";
import type { ApiResponseExamTypeListResponse, ApiResponseExamSessionDto, ApiResponseListUserDto } from "@/api/generated/model";
import {useParams, useRouter} from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";

export default function SessionAdd() {


    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const queryClient = useQueryClient();

    const {data: examSessionData, isLoading: loading} = useGetExamSessionById<ApiResponseExamSessionDto>(id, {
        query: { enabled: !!id }
    });
    const selectedExamSession = examSessionData?.data;
    
    const { mutate: updateExamSession, isPending: updating } = useUpdateExamSession({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/exam-sessions'] });
                queryClient.invalidateQueries({ queryKey: [`/exam-sessions/${id}`] });
                showNotification.success('Sınav oturumu başarıyla güncellendi!');
                router.push(`/admin/sessions/${id}`);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Sınav oturumu güncellenirken bir hata oluştu!');
            }
        }
    });
    
    const handleSubmit = async (data: UpdateExamSessionRequest) => {
        updateExamSession({ id, data });
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
        if(brands && brands.length > 0){
            const firstBrandId = brands[0].id;
            if (firstBrandId) {
                setSelectedBrandId(firstBrandId);
            }
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
                    brands && brandBranches && users && examTypes && selectedExamSession &&
                    <ExamSessionForm examSession={selectedExamSession} onSubmit={handleSubmit} loading={loading || updating} supervisors={users} brands={brands}
                                     branches={brandBranches} onBrandChange={onBrandChange} examTypes={examTypes.examTypes || []}/>
                }

            </div>
        </div>
    )
}