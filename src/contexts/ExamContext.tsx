// contexts/ExamContext.tsx

'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {ExamDto } from '@/types/exam/examEntities';
import {ApplicationDto} from "@/types/management/brand";
import {ExamAnswer, SectionProgress, TakingExamSession} from "@/types/exam/exam-taking";

interface ExamState {
    // Authentication
    isAuthenticated: boolean;
    application: ApplicationDto | null;

    // Exam Data
    exam: ExamDto | null;
    examSession: TakingExamSession | null;

    // Current Progress
    currentStep: 'login' | 'welcome' | 'preparation' | 'exam-info' | 'section-selection' | 'exam-taking' | 'completed';
    currentSectionId: string | null;
    currentQuestionGroupIndex: number;
    completedSections: string[];

    // Section Progress
    sectionProgress: SectionProgress | null;

    // Answers & Progress
    answers: Record<string, ExamAnswer>; // questionId -> answer
    timeSpent: Record<string, number>; // questionId -> time in seconds

    // UI State
    isFullScreen: boolean;
    isBlurred: boolean;
    lastSyncTime: number;

    // Error & Loading
    error: string | null;
    loading: boolean;
}

type ExamAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'LOGIN_SUCCESS'; payload: ApplicationDto }
    | { type: 'SET_EXAM'; payload: ExamDto }
    | { type: 'SET_EXAM_SESSION'; payload: TakingExamSession }
    | { type: 'SET_STEP'; payload: ExamState['currentStep'] }
    | { type: 'START_SECTION'; payload: { sectionId: string; progress: SectionProgress } }
    | { type: 'COMPLETE_SECTION'; payload: string }
    | { type: 'SET_QUESTION_GROUP_INDEX'; payload: number }
    | { type: 'SAVE_ANSWER'; payload: ExamAnswer }
    | { type: 'UPDATE_TIME_SPENT'; payload: { questionId: string; timeSpent: number } }
    | { type: 'SET_FULLSCREEN'; payload: boolean }
    | { type: 'SET_BLUR'; payload: boolean }
    | { type: 'SYNC_SUCCESS' }
    | { type: 'RESTORE_STATE'; payload: Partial<ExamState> }
    | { type: 'CLEAR_EXAM_DATA' };

const initialState: ExamState = {
    isAuthenticated: false,
    application: null,
    exam: null,
    examSession: null,
    currentStep: 'login',
    currentSectionId: null,
    currentQuestionGroupIndex: 0,
    completedSections: [],
    sectionProgress: null,
    answers: {},
    timeSpent: {},
    isFullScreen: false,
    isBlurred: false,
    lastSyncTime: 0,
    error: null,
    loading: false,
};

function examReducer(state: ExamState, action: ExamAction): ExamState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload };

        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                application: action.payload,
                currentStep: 'welcome',
                error: null,
            };

        case 'SET_EXAM':
            return { ...state, exam: action.payload };

        case 'SET_EXAM_SESSION':
            return {
                ...state,
                examSession: action.payload,
                completedSections: action.payload.completedSections || [],
            };

        case 'SET_STEP':
            return { ...state, currentStep: action.payload };

        case 'START_SECTION':
            return {
                ...state,
                currentSectionId: action.payload.sectionId,
                sectionProgress: action.payload.progress,
                currentQuestionGroupIndex: action.payload.progress.currentQuestionIndex || 0,
                currentStep: 'exam-taking',
            };

        case 'COMPLETE_SECTION':
            return {
                ...state,
                completedSections: [...state.completedSections, action.payload],
                currentSectionId: null,
                sectionProgress: null,
                currentQuestionGroupIndex: 0,
                currentStep: state.completedSections.length + 1 >= (state.exam?.questionGroups?.length || 0) ? 'completed' : 'section-selection',
            };

        case 'SET_QUESTION_GROUP_INDEX':
            return { ...state, currentQuestionGroupIndex: action.payload };

        case 'SAVE_ANSWER':
            return {
                ...state,
                answers: {
                    ...state.answers,
                    [action.payload.questionId]: action.payload,
                },
            };

        case 'UPDATE_TIME_SPENT':
            return {
                ...state,
                timeSpent: {
                    ...state.timeSpent,
                    [action.payload.questionId]: action.payload.timeSpent,
                },
            };

        case 'SET_FULLSCREEN':
            return { ...state, isFullScreen: action.payload };

        case 'SET_BLUR':
            return { ...state, isBlurred: action.payload };

        case 'SYNC_SUCCESS':
            return { ...state, lastSyncTime: Date.now() };

        case 'RESTORE_STATE':
            return { ...state, ...action.payload };

        case 'CLEAR_EXAM_DATA':
            return initialState;

        default:
            return state;
    }
}

interface ExamContextType {
    state: ExamState;
    dispatch: React.Dispatch<ExamAction>;
    // Helper functions
    loginSuccess: (application: ApplicationDto) => void;
    setExam: (exam: ExamDto) => void;
    setExamSession: (session: TakingExamSession) => void;
    setStep: (step: ExamState['currentStep']) => void;
    startSection: (sectionId: string, progress: SectionProgress) => void;
    completeSection: (sectionId: string) => void;
    saveAnswer: (answer: ExamAnswer) => void;
    updateTimeSpent: (questionId: string, timeSpent: number) => void;
    setFullScreen: (isFullScreen: boolean) => void;
    setBlur: (isBlurred: boolean) => void;
    clearExamData: () => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

const STORAGE_KEY = 'exam-state';

export function ExamProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(examReducer, initialState);

    // localStorage'dan state restore et
    useEffect(() => {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                dispatch({ type: 'RESTORE_STATE', payload: parsedState });
            } catch (error) {
                console.error('Saved state restore failed:', error);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    // State değişikliklerini localStorage'a kaydet
    useEffect(() => {
        if (state.isAuthenticated) {
            const stateToSave = {
                isAuthenticated: state.isAuthenticated,
                application: state.application,
                exam: state.exam,
                examSession: state.examSession,
                currentStep: state.currentStep,
                currentSectionId: state.currentSectionId,
                currentQuestionGroupIndex: state.currentQuestionGroupIndex,
                completedSections: state.completedSections,
                sectionProgress: state.sectionProgress,
                answers: state.answers,
                timeSpent: state.timeSpent,
                lastSyncTime: state.lastSyncTime,
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        }
    }, [state]);

    // Helper functions
    const loginSuccess = (application: ApplicationDto) => {
        dispatch({ type: 'LOGIN_SUCCESS', payload: application });
    };

    const setExam = (exam: ExamDto) => {
        dispatch({ type: 'SET_EXAM', payload: exam });
    };

    const setExamSession = (session: TakingExamSession) => {
        dispatch({ type: 'SET_EXAM_SESSION', payload: session });
    };

    const setStep = (step: ExamState['currentStep']) => {
        dispatch({ type: 'SET_STEP', payload: step });
    };

    const startSection = (sectionId: string, progress: SectionProgress) => {
        dispatch({ type: 'START_SECTION', payload: { sectionId, progress } });
    };

    const completeSection = (sectionId: string) => {
        dispatch({ type: 'COMPLETE_SECTION', payload: sectionId });
    };

    const saveAnswer = (answer: ExamAnswer) => {
        dispatch({ type: 'SAVE_ANSWER', payload: answer });
    };

    const updateTimeSpent = (questionId: string, timeSpent: number) => {
        dispatch({ type: 'UPDATE_TIME_SPENT', payload: { questionId, timeSpent } });
    };

    const setFullScreen = (isFullScreen: boolean) => {
        dispatch({ type: 'SET_FULLSCREEN', payload: isFullScreen });
    };

    const setBlur = (isBlurred: boolean) => {
        dispatch({ type: 'SET_BLUR', payload: isBlurred });
    };

    const clearExamData = () => {
        localStorage.removeItem(STORAGE_KEY);
        dispatch({ type: 'CLEAR_EXAM_DATA' });
    };

    const contextValue: ExamContextType = {
        state,
        dispatch,
        loginSuccess,
        setExam,
        setExamSession,
        setStep,
        startSection,
        completeSection,
        saveAnswer,
        updateTimeSpent,
        setFullScreen,
        setBlur,
        clearExamData,
    };

    return (
        <ExamContext.Provider value={contextValue}>
            {children}
        </ExamContext.Provider>
    );
}

export function useExamContext() {
    const context = useContext(ExamContext);
    if (context === undefined) {
        throw new Error('useExamContext must be used within an ExamProvider');
    }
    return context;
}