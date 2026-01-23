'use client';
import ExamSectionForm from "@/components/form/ExamSectionForm";
import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useGetAllExamTypes} from "@/api/generated/exam-type-management/exam-type-management";
import type { ApiResponseExamTypeListResponse, UpdateExamSectionRequest, ApiResponseExamSectionDto } from "@/api/generated/model";
import {useGetExamSectionById, useUpdateExamSection} from "@/api/generated/exam-section-management/exam-section-management";
import {useParams, useRouter} from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";
import LoadingComp from "@/components/ui/loading-comp";

export default function ExamSectionEdit() {
    const params = useParams();
    const sectionId = params.sectionId as string;
    const examTypeId = params.examTypeId as string;
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const {data: sectionData, isLoading: loading} = useGetExamSectionById(sectionId, {
        query: { enabled: !!sectionId }
    });
    const selectedExamSection = (sectionData as unknown as ApiResponseExamSectionDto)?.data;
    
    const { mutate: updateExamSection, isPending: updating } = useUpdateExamSection({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/exam-sections'] });
                queryClient.invalidateQueries({ queryKey: [`/exam-sections/${sectionId}`] });
                queryClient.invalidateQueries({ queryKey: [`/exam-types/${examTypeId}/sections`] });
                showNotification.success('Sınav bölümü başarıyla güncellendi!');
                router.push(`/admin/exam-type/${examTypeId}/section/${sectionId}`);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Sınav bölümü güncellenirken bir hata oluştu!');
            }
        }
    });
    
    const handleSubmit = async (data: UpdateExamSectionRequest) => {
        updateExamSection({ id: sectionId, data });
    };

    const { data: examTypesData } = useGetAllExamTypes(undefined);
    const examTypes = (examTypesData as unknown as ApiResponseExamTypeListResponse)?.data || null;

    if (loading) {
        return <LoadingComp/>;
    }

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    examTypes && examTypes.examTypes && selectedExamSection &&
                    <ExamSectionForm 
                        onSubmit={handleSubmit} 
                        examTypes={examTypes.examTypes} 
                        examSection={selectedExamSection}
                        defaultExamTypeId={examTypeId}
                        loading={updating}
                    />
                }
            </div>
        </div>
    )
}