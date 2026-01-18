'use client';
import ExamSectionForm from "@/components/form/ExamSectionForm";
import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useGetAllExamTypes} from "@/api/generated/exam-type-management/exam-type-management";
import type { ApiResponseExamTypeListResponse, CreateExamSectionRequest } from "@/api/generated/model";
import {useCreateExamSection} from "@/api/generated/exam-section-management/exam-section-management";

export default function ExamSectionAdd() {

    const createExamSectionMutation = useCreateExamSection();
    const createExamSection = async (data: CreateExamSectionRequest) => {
        await createExamSectionMutation.mutateAsync({ data });
    };


    const { data: examTypesData } = useGetAllExamTypes({});
    const examTypes = (examTypesData as unknown as ApiResponseExamTypeListResponse)?.data || null;


    return (


        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    examTypes && examTypes.examTypes &&
                    <ExamSectionForm onSubmit={createExamSection} examTypes={examTypes.examTypes}/>
                }


            </div>
        </div>

    )
}