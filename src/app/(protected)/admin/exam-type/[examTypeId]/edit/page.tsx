'use client';


import ExamTypeForm from "@/components/form/ExamTypeForm";
import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useUpdateExamType, useGetExamTypeById} from "@/api/generated/exam-type-management/exam-type-management";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";
import { useRouter } from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import type { ExamTypeDto } from "@/api/generated/model";
import type { ApiResponseExamTypeDto } from "@/api/generated/model";
import {useParams} from "next/navigation";

export default function ExamTypeAdd() {
    const params = useParams();
    const examTypeId = params.examTypeId as string;

    const router = useRouter();
    const queryClient = useQueryClient();
    
    const { data, isLoading } = useGetExamTypeById(examTypeId);
    const selectedExamType = (data as unknown as ApiResponseExamTypeDto)?.data as ExamTypeDto | undefined;

    const { mutate: updateExamType } = useUpdateExamType({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/exam-types'] });
                queryClient.invalidateQueries({ queryKey: [`/exam-types/${examTypeId}`] });
                showNotification.success('Sınav tipi başarıyla güncellendi!');
                router.push(`/admin/exam-type/${examTypeId}`);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Sınav tipi güncellenirken bir hata oluştu!');
            }
        }
    });

    const handleSubmit = async (examType: ExamTypeDto) => {
        updateExamType({ id: examTypeId, data: examType });
    };

    if (isLoading) {
        return <LoadingComp/>;
    }

    return (


        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <ExamTypeForm onSubmit={handleSubmit} examType={selectedExamType || undefined}/>

            </div>
        </div>


    )
}