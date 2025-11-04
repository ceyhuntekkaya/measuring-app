import { useState, useCallback } from 'react';

import {EvaluationDto, QuestionAnswerRequest} from '@/types/exam/examEntities';
import { showNotification } from '@/lib/notification';
import {examService} from "@/services/api/exam/exam-service";

interface useExamResultReturn {

    result: string | null;
    saveAnswer: (answer: QuestionAnswerRequest) => Promise<void>;
    error: Error | null;
    resetResult: () => Promise<void>;
    saveEvaluation: (id: string, answer: EvaluationDto) => Promise<void>;

}

export const useExamResult = (): useExamResultReturn => {
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const saveAnswer = useCallback(async (answer: QuestionAnswerRequest) => {
        try {
            const response = await examService.saveAnswer(answer);
            if (response.data && response.success) {
                setResult(response.data);
                showNotification.success('Sınav başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav oluşturulurken bir hata oluştu!');
        }
    }, []);

    const resetResult = useCallback(async () => {
        setResult(null);
    }, []);


    const saveEvaluation = useCallback(async (id: string, answer: EvaluationDto) => {
        try {
            const response = await examService.saveEvaluation(id, answer);
            if (response.data && response.success) {
                setResult(response.data);
                showNotification.success('Sınav başarıyla oluşturuldu!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Bir hata oluştu'));
            showNotification.error('Sınav oluşturulurken bir hata oluştu!');
        }
    }, []);


    return {
        resetResult,
        result,
        saveAnswer,
        error,
        saveEvaluation

    };
};