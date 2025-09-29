'use client';


import ExamTypeForm from "@/components/form/ExamTypeForm";
import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import {useExamType} from "@/hooks/exam/use-exam-type";
import {useParams} from "next/navigation";

export default function ExamTypeAdd() {
    const params = useParams();
    const examTypeId = params.examTypeId as string;

    const {
        updateExamType,
        getExamTypeById,
        selectedExamType
    } = useExamType();


    useEffect(() => {
        getExamTypeById(examTypeId);
    }, []);

    return (


        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <ExamTypeForm onSubmit={updateExamType} examType={selectedExamType}/>

            </div>
        </div>


    )
}