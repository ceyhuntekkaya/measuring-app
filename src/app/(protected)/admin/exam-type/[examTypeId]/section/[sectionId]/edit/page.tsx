'use client';
import ExamSectionForm from "@/components/form/ExamSectionForm";
import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useGetAllExamTypes} from "@/api/generated/exam-type-management/exam-type-management";
import type { ApiResponseExamTypeListResponse, UpdateExamSectionRequest, ApiResponseExamSectionDto } from "@/api/generated/model";
import {useGetExamSectionById, useUpdateExamSection} from "@/api/generated/exam-section-management/exam-section-management";
import {useParams} from "next/navigation";

export default function ExamSectionAdd() {
    const params = useParams();
    const sectionId = params.sectionId as string;
    
    const {data: sectionData} = useGetExamSectionById(sectionId, {
        query: { enabled: !!sectionId }
    });
    const selectedExamSection = (sectionData as unknown as ApiResponseExamSectionDto)?.data;
    
    const updateExamSectionMutation = useUpdateExamSection();
    const createExamSection = async (data: UpdateExamSectionRequest) => {
        await updateExamSectionMutation.mutateAsync({ id: sectionId, data });
    };

    const { data: examTypesData } = useGetAllExamTypes({});
    const examTypes = (examTypesData as unknown as ApiResponseExamTypeListResponse)?.data || null;


    return (


        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    examTypes && examTypes.examTypes && selectedExamSection &&
                    <ExamSectionForm onSubmit={createExamSection} examTypes={examTypes.examTypes} examSection={selectedExamSection}/>
                }


            </div>
        </div>

    )
}