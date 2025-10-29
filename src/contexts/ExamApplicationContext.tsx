'use client';

import {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {EvaluationDto, ExamDto, ExamSessionDto} from "@/types/exam/examEntities";
import {ApplicationDto, CandidateDto} from "@/types/management/brand";
import {useAuth} from "@/hooks/use-auth";
import {EApplicationUpdateState} from "@/types/exam/enum";
import {useApplication} from "@/hooks/exam/use-application";

interface ExamApplicationContextType {
    exam: ExamDto | null;
    examSession: ExamSessionDto | null;
    application: ApplicationDto | null;
    evaluations: EvaluationDto[] | null;
    candidate: CandidateDto | null;
    addStudentAnswer: (questionId: string, answer: string) => void;
    updateApplicationStateStatus: (state: EApplicationUpdateState) => void;
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



    const [examSession, setExamSession] = useState<ExamSessionDto | null>(null);
    const [application, setApplication] = useState<ApplicationDto | null>(null);
    const [exam, setExam] = useState<ExamDto | null>(null);
    const [candidate, setCandidate] = useState<CandidateDto | null>(null);
    const [evaluations, setEvaluations] = useState<EvaluationDto[] | null>(null);

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
        updateApplicationStateStatus
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