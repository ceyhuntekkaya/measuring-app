'use client';


import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import QuestionGroupForm from "@/components/form/QuestionGroupForm";
import {useExamType} from "@/hooks/exam/use-exam-type";
import {useQuestionGroupType} from "@/hooks/exam/use-question-group-type";

export default function QuestionGroupAdd() {


    const {
        examTypes,
        getAllExamTypes,
    } = useExamType();



    const {
        getAvailableGroupTypes,
    } = useQuestionGroupType();


    useEffect(() => {
        getAllExamTypes();
        getAvailableGroupTypes();
    }, []);




    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <QuestionGroupForm onSubmit={() => {
                }} examTypes={examTypes?.examTypes || []} examSections={[]} questionGroupTypes={[]}/>

            </div>
        </div>



    )
}