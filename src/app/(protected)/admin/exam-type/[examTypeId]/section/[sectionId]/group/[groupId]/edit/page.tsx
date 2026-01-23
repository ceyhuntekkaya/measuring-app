'use client';
import React from "react";
import PageHeader from "@/components/layout/page-header";
import {useParams, useRouter} from "next/navigation";
import {useGetQuestionGroupTypeById, useUpdateQuestionGroupType} from "@/api/generated/question-group-type-management/question-group-type-management";
import {useGetExamSectionsByExamType} from "@/api/generated/exam-section-management/exam-section-management";
import QuestionGroupTypeForm from "@/components/form/QuestionGroupTypeForm";
import type {ApiResponseListExamSectionDto, UpdateQuestionGroupTypeRequest, ApiResponseQuestionGroupTypeDto} from "@/api/generated/model";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";
import LoadingComp from "@/components/ui/loading-comp";


export default function QuestionGroupTypeEdit() {
    const params = useParams();
    const groupId = params.groupId as string;
    const examTypeId = params.examTypeId as string;
    const sectionId = params.sectionId as string;
    const router = useRouter();
    const queryClient = useQueryClient();

    const {data: typeData, isLoading: loading} = useGetQuestionGroupTypeById(groupId, {
        query: { enabled: !!groupId }
    });
    const selectedType = (typeData as unknown as ApiResponseQuestionGroupTypeDto)?.data;
    
    const { mutate: updateQuestionGroupType, isPending: updating } = useUpdateQuestionGroupType({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/question-group-types'] });
                queryClient.invalidateQueries({ queryKey: [`/question-group-types/${groupId}`] });
                queryClient.invalidateQueries({ queryKey: [`/exam-sections/${sectionId}/question-group-types`] });
                showNotification.success('Soru grubu tipi başarıyla güncellendi!');
                router.push(`/admin/exam-type/${examTypeId}/section/${sectionId}/group/${groupId}`);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Soru grubu tipi güncellenirken bir hata oluştu!');
            }
        }
    });
    
    const handleSubmit = async (data: UpdateQuestionGroupTypeRequest) => {
        updateQuestionGroupType({ id: groupId, data });
    };

    const {data: sectionsData} = useGetExamSectionsByExamType(examTypeId, {
        query: { enabled: !!examTypeId }
    });
    const examSections = (sectionsData as unknown as ApiResponseListExamSectionDto)?.data || [];

    if (loading) {
        return <LoadingComp/>;
    }

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <QuestionGroupTypeForm 
                    onSubmit={handleSubmit} 
                    examSections={examSections} 
                    questionGroupType={selectedType}
                    examSectionId={sectionId}
                    loading={updating}
                />
            </div>
        </div>
    )
}