'use client';
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import {useParams} from "next/navigation";
import {useQuestionGroupType} from "@/hooks/exam/use-question-group-type";
import {useExamSection} from "@/hooks/exam/use-exam-section";
import QuestionGroupTypeForm from "@/components/form/QuestionGroupTypeForm";

export default function QuestionGroupTypePage() {

    const params = useParams();
    const groupId = params.groupId as string;
    const examTypeId = params.examTypeId as string;

    const {
        createQuestionGroupType,
        getQuestionGroupTypeById,
        selectedType
    } = useQuestionGroupType();

    const {
        examSections,
        getExamSectionsByExamType
    } = useExamSection();

    useEffect(() => {
        getExamSectionsByExamType(examTypeId);
        getQuestionGroupTypeById(groupId);
    }, []);



    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <QuestionGroupTypeForm onSubmit={createQuestionGroupType} examSections={examSections} questionGroupType={selectedType}/>
            </div>
        </div>
    )
}