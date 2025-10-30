'use client';

import {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {EvaluationDto, ExamDto, ExamSessionDto} from "@/types/exam/examEntities";
import {ApplicationDto, CandidateDto} from "@/types/management/brand";
import {useAuth} from "@/hooks/use-auth";
import {EApplicationUpdateState} from "@/types/exam/enum";
import {useApplication} from "@/hooks/exam/use-application";
import {ExamSectionDto} from "@/types/exam/examTemplates";
import {useExam} from "@/hooks/exam/use-exam";

interface ExamApplicationContextType {
    exam: ExamDto | null;
    examSession: ExamSessionDto | null;
    application: ApplicationDto | null;
    evaluations: EvaluationDto[] | null;
    examSections: ExamSectionDto[];
    candidate: CandidateDto | null;
    addStudentAnswer: (questionId: string, answer: string) => void;
    updateApplicationStateStatus: (state: EApplicationUpdateState) => void;
    getExamData: (examId: string) => void;
}

const ExamApplicationContext = createContext<ExamApplicationContextType | undefined>(undefined);

export function ExamApplicationProvider({children}: { children: ReactNode }) {

    const {
        candidate: authCandidate,
        examSession: authExamSession,
        application: authApplication,
        exam: authExam,
        evaluations: authEvaluations
    } = useAuth();


    const {
        updateApplicationState
    } = useApplication();

    const {selectedExam, getExamById,} = useExam();

    const [examSession, setExamSession] = useState<ExamSessionDto | null>(null);
    const [application, setApplication] = useState<ApplicationDto | null>(null);
    const [exam, setExam] = useState<ExamDto | null>(null);
    const [candidate, setCandidate] = useState<CandidateDto | null>(null);
    const [evaluations, setEvaluations] = useState<EvaluationDto[] | null>(null);
    const [examSections, setExamSections] = useState<ExamSectionDto[]>([]);

    useEffect(() => {
        if (authExam) setExam(authExam)
        if (authExamSession) setExamSession(authExamSession)
        if (authApplication) setApplication(authApplication)
        if (authCandidate) setCandidate(authCandidate)
        if (authEvaluations) setEvaluations(authEvaluations)
    }, []);


    const addStudentAnswer = (questionId: string, answer: string) => {
        console.log(questionId);
        console.log(answer);
    };


    const getExamData = (examId: string, ) => {
        getExamById(examId)
    };


    function getUniqueSortedExamSections(): ExamSectionDto[] {
        if (!selectedExam || !selectedExam.questionGroups || selectedExam.questionGroups.length === 0) {
            return [];
        }

        const allSections = selectedExam.questionGroups
            .map(qg => qg.examSection)
            .filter((section): section is ExamSectionDto => section != null);

        const uniqueSectionsMap = new Map<string, ExamSectionDto>();

        allSections.forEach(section => {
            if (section.id && !uniqueSectionsMap.has(section.id)) {
                uniqueSectionsMap.set(section.id, section);
            }
        });

        const uniqueSections = Array.from(uniqueSectionsMap.values());

        return uniqueSections.sort((a, b) => {
            const orderA = a.orderNumber ?? Number.MAX_SAFE_INTEGER;
            const orderB = b.orderNumber ?? Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
        });
    }



    useEffect(() => {
        if (selectedExam) {
            setExam(selectedExam);
            setExamSections(getUniqueSortedExamSections)
        }
    }, [selectedExam]);



    const updateApplicationStateStatus = (state: EApplicationUpdateState) => {

        updateApplicationState(application?.id || '',
            {
                state: state,
                description: '',
                userId: ''
            });



        if (application) {
            switch (state) {
                case "READ_TERM":
                    setApplication(prev =>
                        prev ? {...prev, notificationRead: true} : prev
                    );
                    break;
                case "LEARNER_LOGIN":
                    setApplication(prev =>
                        prev ? {...prev} : prev
                    );
                    break;
                case "EXAM_START":
                    setApplication(prev =>
                        prev ? {...prev, startedAt: new Date()} : prev
                    );
                    break;
                case "EXAM_END":
                    setApplication(prev =>
                        prev ? {...prev, endedAt: new Date()} : prev
                    );
                    break;
                case "CAMERA":
                    setApplication(prev =>
                        prev ? {...prev, cameraControl: true} : prev
                    );
                    break;
                case "VOICE":
                    setApplication(prev =>
                        prev ? {...prev, voiceControl: true} : prev
                    );
                    break;
                case "SPEECH":
                    setApplication(prev =>
                        prev ? {...prev, speechControl: true} : prev
                    );
                    break;
                case "ID_CART":
                    setApplication(prev =>
                        prev ? {...prev, idCartControl: true} : prev
                    );
                    break;
            }
        }
    };


    const contextValue: ExamApplicationContextType = {
        exam,
        examSession,
        application,
        evaluations,
        candidate,
        addStudentAnswer,
        updateApplicationStateStatus,
        examSections,
        getExamData
    };

    return (
        <ExamApplicationContext.Provider value={contextValue}>
            {children}
        </ExamApplicationContext.Provider>
    );
}

export function useExamApplicationContext() {
    const context = useContext(ExamApplicationContext);
    if (context === undefined) {
        throw new Error('useExamApplicationContext must be used within AuthProvider');
    }
    return context;
}