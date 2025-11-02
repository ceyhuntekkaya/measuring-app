'use client';
import React, {useEffect, useState} from "react";
import ExamSectionsList from "@/components/take/SectionList";
import {ExamSectionDto} from "@/types/exam/examTemplates";
import {useExamApplicationContext} from "@/contexts/ExamApplicationContext";
import ExamApplicationScreen from "@/components/take/ExamApplicationScreen";
import {QuestionGroupDto} from "@/types/exam/examEntities";

export interface SectionQuestionCounts {
    sectionId: string;
    questionCount: number;
    completedQuestionCount: number;
    unDoneQuestionCount: number;
}

export default function Page() {
    const {exam: examState, examSections, getExamData} = useExamApplicationContext();
    const [sectionQuestionStatics, setSectionQuestionStatics] = useState<SectionQuestionCounts[]>([]);
    const [questionGroups, setQuestionGroups] = useState<QuestionGroupDto[]>([]);
    const [activeScreen, setActiveScreen] = useState<'SECTION' | 'QUESTION_GROUPS'>('SECTION');
    const [selectedSection, setSelectedSection] = useState<ExamSectionDto | null>(null);

    console.log(setSectionQuestionStatics)

    useEffect(() => {
        const loadInitialData = async () => {
            if (examState) {
                getExamData(examState.id)
            }
        };
        if (examState && examSections.length == 0)
            loadInitialData();
    }, [examState]);


    function getUQuestionGroupsFromSelectedSection() {
        if (!selectedSection || !examState || !examState.questionGroups) {
            setQuestionGroups([]);
            return;
        }
        const filteredQuestionGroups = examState.questionGroups.filter(
            qg => qg.examSection?.id === selectedSection.id
        );
        setQuestionGroups(filteredQuestionGroups);
    }

    useEffect(() => {
        if (selectedSection) {
            getUQuestionGroupsFromSelectedSection()
        }

    }, [selectedSection]);

    const selectSection = (section: ExamSectionDto) => {
        setSelectedSection(section);
        setActiveScreen("QUESTION_GROUPS");
    }

    return (
        <div className="space-y-6">
            {
                activeScreen === 'SECTION' &&
                <ExamSectionsList sectionQuestionStatics={sectionQuestionStatics} sections={examSections}
                                  onSectionSelect={selectSection}/>
            }


            {
                questionGroups && questionGroups.length > 0 && activeScreen === 'QUESTION_GROUPS' &&

                <ExamApplicationScreen questionGroups={questionGroups}
                                       onExitExam={() => setActiveScreen('SECTION')}/>
            }
        </div>
    );
}