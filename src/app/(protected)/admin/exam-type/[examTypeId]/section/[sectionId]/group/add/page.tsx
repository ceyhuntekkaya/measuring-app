'use client';
import QuestionGroupTypeForm from "@/components/form/QuestionGroupTypeForm";
import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useQuestionGroupType} from "@/hooks/exam/use-question-group-type";
import {useExamSection} from "@/hooks/exam/use-exam-section";

export default function QuestionGroupTypeAdd() {

    const {
        createQuestionGroupType,
    } = useQuestionGroupType();

    const {
        examSections,
    } = useExamSection();

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <QuestionGroupTypeForm onSubmit={createQuestionGroupType} examSections={examSections}/>
            </div>
        </div>
    )
}