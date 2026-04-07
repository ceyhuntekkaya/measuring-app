'use client';
import QuestionGroupTypeForm from "@/components/form/QuestionGroupTypeForm";
import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useCreateQuestionGroupType} from "@/api/generated/question-group-type-management/question-group-type-management";
import {useGetExamSectionsByExamType} from "@/api/generated/exam-section-management/exam-section-management";
import {useParams, useRouter} from "next/navigation";
import type {ApiResponseListExamSectionDto, CreateQuestionGroupTypeRequest} from "@/api/generated/model";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";

export default function QuestionGroupTypeAdd() {
    const params = useParams();
    const examTypeId = params.examTypeId as string;
    const sectionId = params.sectionId as string;
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate: createQuestionGroupType, isPending: loading } = useCreateQuestionGroupType({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/question-group-types'] });
                queryClient.invalidateQueries({ queryKey: [`/exam-sections/${sectionId}/question-group-types`] });
                showNotification.success('Soru grubu tipi başarıyla oluşturuldu!');
                router.push(`/admin/exam-type/${examTypeId}/section/${sectionId}/group`);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Soru grubu tipi oluşturulurken bir hata oluştu!');
            }
        }
    });
    
    const handleSubmit = async (data: CreateQuestionGroupTypeRequest) => {
        createQuestionGroupType({ data });
    };

    const {data: sectionsData} = useGetExamSectionsByExamType<ApiResponseListExamSectionDto>(examTypeId, {
        query: { enabled: !!examTypeId }
    });
    const examSections = sectionsData?.data || [];

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <QuestionGroupTypeForm onSubmit={handleSubmit} examSections={examSections} examSectionId={sectionId} loading={loading}/>
            </div>
        </div>
    )
}