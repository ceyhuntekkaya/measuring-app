'use client';


import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import QuestionGroupForm from "@/components/form/QuestionGroupForm";
import {useExamType} from "@/hooks/exam/use-exam-type";
import {useQuestionGroupType} from "@/hooks/exam/use-question-group-type";
import {useExamSection} from "@/hooks/exam/use-exam-section";
import {useQuestionGroup} from "@/hooks/exam/use-question-group";

export default function QuestionGroupAdd() {


    const {
        examTypes,
        getAllExamTypes,
    } = useExamType();


    const {
        createQuestionGroup
    } = useQuestionGroup();


    const {
        sectionsByExamType,
        getExamSectionsByExamType,
    } = useExamSection();

    const {
        typesByExamSection,
        getQuestionGroupTypesByExamSection,
    } = useQuestionGroupType();

    useEffect(() => {
        getAllExamTypes();
    }, []);


    const onExamTypeChange = (examTypeId: string) => {
        getExamSectionsByExamType(examTypeId);
    }

    const onExamSectionChange = (examSectionId: string) => {
        getQuestionGroupTypesByExamSection(examSectionId);
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