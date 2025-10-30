'use client';
import React, {useEffect, useState} from "react";
import ExamSectionsList from "@/components/take/SectionList";
import {ExamSectionDto} from "@/types/exam/examTemplates";
import {useExamApplicationContext} from "@/contexts/ExamApplicationContext";
import {useExam} from "@/hooks/exam/use-exam";
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
    console.log(examState)

    const {selectedExam} = useExam();


    useEffect(() => {
        const loadInitialData = async () => {
            if (examState) {
                console.log(examState)
                getExamData(examState.id)
            }

        };
        if (examState && examSections.length == 0)
            loadInitialData();
    }, [examState]);


    function getUQuestionGroupsFromSelectedSection() {
        if (!selectedSection || !selectedExam || !selectedExam.questionGroups) {
            setQuestionGroups([]);
            return;
        }

        const filteredQuestionGroups = selectedExam.questionGroups.filter(
            qg => qg.examSection?.id === selectedSection.id
        );

        setQuestionGroups(filteredQuestionGroups);
    }


    useEffect(() => {
        if (selectedSection) {
            console.log("OKA")
            getUQuestionGroupsFromSelectedSection()
        }

    }, [selectedSection]);


    /*


        useEffect(() => {
            if (!selectedExam || !selectedExam.questionGroups || selectedExam.questionGroups.length === 0) {
                setSectionQuestionStatics([]);
                return;
            }

            const uniqueSections = getUniqueSortedExamSections();

            const statistics: SectionQuestionCounts[] = uniqueSections.map(section => {
                const sectionQuestionIds = selectedExam.questionGroups
                    .filter(qg => qg.examSection?.id === section.id)
                    .flatMap(qg => qg.questions?.map(q => q.id) || []);

                const totalQuestions = sectionQuestionIds.length;

                const completedCount = sectionQuestionIds.filter(questionId => {
                    const evaluation = evaluations && evaluations.find(ev => ev.questionId === questionId);
                    return evaluation && (
                        (evaluation.answer && evaluation.answer.trim() !== '') ||
                        evaluation.isEmptyAnswer === 'true'
                    );
                }).length;

                return {
                    id: section.id!,
                    sectionId: section.id!,
                    questionCount: totalQuestions,
                    completedQuestionCount: completedCount,
                    unDoneQuestionCount: totalQuestions - completedCount,
                    createdAt: new Date().toISOString(),
                    status: 'ACTIVE'
                };
            });

            //setSectionQuestionStatics(statistics);
        }, [selectedExam, evaluations]);



     */


    return (
        <div className="space-y-6">
            {
                activeScreen === 'SECTION' ?
                    <ExamSectionsList sectionQuestionStatics={sectionQuestionStatics} sections={examSections}
                                      onSectionSelect={setSelectedSection}/> :
                    <ExamApplicationScreen questionGroups={questionGroups}
                                           onExitExam={() => setActiveScreen('SECTION')}/>
            }


        </div>
    );
}