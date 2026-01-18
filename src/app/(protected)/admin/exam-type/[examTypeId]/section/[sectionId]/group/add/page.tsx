'use client';
import QuestionGroupTypeForm from "@/components/form/QuestionGroupTypeForm";
import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useCreateQuestionGroupType} from "@/api/generated/question-group-type-management/question-group-type-management";
import {useGetExamSectionsByExamType} from "@/api/generated/exam-section-management/exam-section-management";
import {useParams} from "next/navigation";
import type {ApiResponseListExamSectionDto, CreateQuestionGroupTypeRequest} from "@/api/generated/model";

export default function QuestionGroupTypeAdd() {
    const params = useParams();
    const examTypeId = params.examTypeId as string;

    const createQuestionGroupTypeMutation = useCreateQuestionGroupType();
    const createQuestionGroupType = async (data: CreateQuestionGroupTypeRequest) => {
        await createQuestionGroupTypeMutation.mutateAsync({ data });
    };

    const {data: sectionsData} = useGetExamSectionsByExamType(examTypeId, {
        query: { enabled: !!examTypeId }
    });
    const examSections = (sectionsData as unknown as ApiResponseListExamSectionDto)?.data || [];

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <QuestionGroupTypeForm onSubmit={createQuestionGroupType} examSections={examSections}/>
            </div>
        </div>
    )
}