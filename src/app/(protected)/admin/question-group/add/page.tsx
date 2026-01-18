'use client';


import PageHeader from "@/components/layout/page-header";
import React from "react";
import QuestionGroupForm from "@/components/form/QuestionGroupForm";
import {useGetAllExamTypes} from "@/api/generated/exam-type-management/exam-type-management";
import type { ApiResponseExamTypeListResponse } from "@/api/generated/model";
import {useGetQuestionGroupTypesByExamSection} from "@/api/generated/question-group-type-management/question-group-type-management";
import {useGetExamSectionsByExamType} from "@/api/generated/exam-section-management/exam-section-management";
import {useCreateQuestionGroup} from "@/api/generated/question-group-management/question-group-management";
import type {ApiResponseListExamSectionDto, ApiResponseListQuestionGroupTypeDto, CreateQuestionGroupRequest} from "@/api/generated/model";

export default function QuestionGroupAdd() {

    const { data: examTypesData } = useGetAllExamTypes({});
    const examTypes = (examTypesData as ApiResponseExamTypeListResponse)?.data || null;

    const createQuestionGroupMutation = useCreateQuestionGroup();
    const createQuestionGroup = async (data: CreateQuestionGroupRequest) => {
        await createQuestionGroupMutation.mutateAsync({ data });
    };

    const [selectedExamTypeId, setSelectedExamTypeId] = React.useState<string>('');
    const { data: sectionsData } = useGetExamSectionsByExamType(selectedExamTypeId, {
        query: { enabled: !!selectedExamTypeId }
    });
    const sectionsByExamType = (sectionsData as ApiResponseListExamSectionDto)?.data || [];

    const [selectedExamSectionId, setSelectedExamSectionId] = React.useState<string>('');
    const { data: typesData } = useGetQuestionGroupTypesByExamSection(selectedExamSectionId, {
        query: { enabled: !!selectedExamSectionId }
    });
    const typesByExamSection = (typesData as ApiResponseListQuestionGroupTypeDto)?.data || [];

    const onExamTypeChange = (examTypeId: string) => {
        setSelectedExamTypeId(examTypeId);
    }

    const onExamSectionChange = (examSectionId: string) => {
        setSelectedExamSectionId(examSectionId);
    }


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <QuestionGroupForm onExamSectionChange={onExamSectionChange}
                                   onExamTypeChange={onExamTypeChange}
                                   onSubmit={createQuestionGroup}
                                   examTypes={examTypes?.examTypes || []}
                                   examSections={sectionsByExamType}
                                   questionGroupTypes={typesByExamSection}/>

            </div>
        </div>


    )
}