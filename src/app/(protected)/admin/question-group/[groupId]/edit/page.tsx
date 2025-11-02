'use client';


import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import QuestionGroupForm from "@/components/form/QuestionGroupForm";
import {useExamType} from "@/hooks/exam/use-exam-type";
import {useQuestionGroupType} from "@/hooks/exam/use-question-group-type";
import {useExamSection} from "@/hooks/exam/use-exam-section";
import {useQuestionGroup} from "@/hooks/exam/use-question-group";
import {useParams} from "next/navigation";

export default function QuestionGroupUpdate() {

    const params = useParams();
    const groupId = params.groupId as string;


    const {
        examTypes,
        getAllExamTypes,
    } = useExamType();


    const {
        updateQuestionGroup,
        getQuestionGroupById,
        selectedQuestionGroup
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
        getQuestionGroupById(groupId);
        getAllExamTypes();
    }, []);


    const onExamTypeChange = (examTypeId: string) => {
        getExamSectionsByExamType(examTypeId);
    }

    const onExamSectionChange = (examSectionId: string) => {
        getQuestionGroupTypesByExamSection(examSectionId);
    }


    useEffect(() => {
        if (selectedQuestionGroup) {
            onExamTypeChange(selectedQuestionGroup.examType?.id || '')
            getQuestionGroupTypesByExamSection(selectedQuestionGroup.examSection?.id || '')


        }
    }, [selectedQuestionGroup]);




    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    selectedQuestionGroup && sectionsByExamType.length>0 && typesByExamSection.length>0 &&
                    <QuestionGroupForm questionGroup={selectedQuestionGroup} onExamSectionChange={onExamSectionChange}
                                       onExamTypeChange={onExamTypeChange}
                                       onSubmit={updateQuestionGroup}
                                       examTypes={examTypes?.examTypes || []}
                                       examSections={sectionsByExamType}
                                       questionGroupTypes={typesByExamSection}/>
                }


            </div>
        </div>


    )
}