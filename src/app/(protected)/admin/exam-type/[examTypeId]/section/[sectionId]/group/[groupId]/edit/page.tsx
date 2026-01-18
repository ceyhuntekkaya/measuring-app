'use client';
import React from "react";
import PageHeader from "@/components/layout/page-header";
import {useParams} from "next/navigation";
import {useGetQuestionGroupTypeById, useUpdateQuestionGroupType} from "@/api/generated/question-group-type-management/question-group-type-management";
import {useGetExamSectionsByExamType} from "@/api/generated/exam-section-management/exam-section-management";
import QuestionGroupTypeForm from "@/components/form/QuestionGroupTypeForm";
import type {ApiResponseListExamSectionDto, UpdateQuestionGroupTypeRequest, ApiResponseQuestionGroupTypeDto} from "@/api/generated/model";


export default function QuestionGroupTypePage() {

    const params = useParams();
    const groupId = params.groupId as string;
    const examTypeId = params.examTypeId as string;

    const {data: typeData} = useGetQuestionGroupTypeById(groupId, {
        query: { enabled: !!groupId }
    });
    const selectedType = (typeData as unknown as ApiResponseQuestionGroupTypeDto)?.data;
    
    const updateQuestionGroupTypeMutation = useUpdateQuestionGroupType();
    const createQuestionGroupType = async (data: UpdateQuestionGroupTypeRequest) => {
        await updateQuestionGroupTypeMutation.mutateAsync({ id: groupId, data });
    };

    const {data: sectionsData} = useGetExamSectionsByExamType(examTypeId, {
        query: { enabled: !!examTypeId }
    });
    const examSections = (sectionsData as unknown as ApiResponseListExamSectionDto)?.data || [];



    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <QuestionGroupTypeForm onSubmit={createQuestionGroupType} examSections={examSections} questionGroupType={selectedType}/>
            </div>
        </div>
    )
}