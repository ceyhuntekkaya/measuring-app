'use client';
import ExamSectionForm from "@/components/form/ExamSectionForm";
import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import {useExamType} from "@/hooks/exam/use-exam-type";
import {useExamSection} from "@/hooks/exam/use-exam-section";
import {useParams} from "next/navigation";

export default function ExamSectionAdd() {
    const params = useParams();
    const sectionId = params.sectionId as string;
    const {
        createExamSection,
        getExamSectionById,
        selectedExamSection
    } = useExamSection();


    const {
        getAllExamTypes,
        examTypes,
    } = useExamType();

    useEffect(() => {
        getAllExamTypes();
        getExamSectionById(sectionId);
    }, []);


    return (


        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    examTypes && selectedExamSection &&
                    <ExamSectionForm onSubmit={createExamSection} examTypes={examTypes.examTypes} examSection={selectedExamSection}/>
                }


            </div>
        </div>

    )
}