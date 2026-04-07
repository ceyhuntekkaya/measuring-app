'use client';
import ExamSectionForm from "@/components/form/ExamSectionForm";
import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useGetAllExamTypes} from "@/api/generated/exam-type-management/exam-type-management";
import type { ApiResponseExamTypeListResponse, CreateExamSectionRequest, UpdateExamSectionRequest } from "@/api/generated/model";
import {useCreateExamSection} from "@/api/generated/exam-section-management/exam-section-management";
import {useParams, useRouter} from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";

export default function ExamSectionAdd() {
    const params = useParams();
    const examTypeId = params.examTypeId as string;
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate: createExamSection, isPending: loading } = useCreateExamSection({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/exam-sections'] });
                queryClient.invalidateQueries({ queryKey: [`/exam-types/${examTypeId}/sections`] });
                showNotification.success('Sınav bölümü başarıyla oluşturuldu!');
                router.push(`/admin/exam-type/${examTypeId}/section`);
            },
            onError: (error) => {
               
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Sınav bölümü oluşturulurken bir hata oluştu!');
            }
        }
    });


    const { data: examTypesData } = useGetAllExamTypes<ApiResponseExamTypeListResponse>(undefined);
    const examTypes = examTypesData?.data || null;

    const handleSubmit = (formData: CreateExamSectionRequest | UpdateExamSectionRequest) => {
        createExamSection({ data: formData as CreateExamSectionRequest });
    };

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    examTypes && examTypes.examTypes &&
                    <ExamSectionForm 
                        onSubmit={handleSubmit} 
                        examTypes={examTypes.examTypes}
                        defaultExamTypeId={examTypeId}
                        loading={loading}
                    />
                }
            </div>
        </div>
    )
}