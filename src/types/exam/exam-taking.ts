
export interface LoginCredentials {
    username: string;
    password: string;
}

export interface TakingExamSession {
    applicationId: string;
    currentSectionId?: string;
    completedSections: string[];
    startTime?: string;
    isCompleted: boolean;
}

export interface SectionProgress {
    sectionId: string;
    questionGroupId: string;
    currentQuestionIndex: number;
    isCompleted: boolean;
    startTime: string;
    endTime?: string;
}

export type AnswerValue =
    | string
    | string[]
    | boolean
    | number
    | Record<string, string>
    | Record<string, string[]>
    | Record<string, boolean>
    | Record<string, number>
    | Blob
    | File;

export interface ExamAnswer {
    questionId: string;
    questionGroupId: string;
    sectionId: string;
    answer: AnswerValue;
    timeSpent: number;
}
