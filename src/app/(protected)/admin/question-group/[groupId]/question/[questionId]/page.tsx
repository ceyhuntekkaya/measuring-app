'use client';


import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useGetQuestionById, useUpdateQuestion} from "@/api/generated/question-management/question-management";
import QuestionForm from "@/components/form/QuestionForm";
import {useParams, useRouter} from "next/navigation";
import type {ApiResponseQuestionDto, CreateQuestionRequest} from "@/api/generated/model";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";

export default function AdminPage() {

    const params = useParams();
    const questionId = params.questionId as string;
    const groupId = params.groupId as string;
    const router = useRouter();
    const queryClient = useQueryClient();

    const {data} = useGetQuestionById(questionId, {
        query: { enabled: !!questionId }
    });
    const selectedQuestion = (data as ApiResponseQuestionDto)?.data;
    
    const { mutate: updateQuestion, isPending: loading } = useUpdateQuestion({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/questions'] });
                queryClient.invalidateQueries({ queryKey: [`/questions/${questionId}`] });
                queryClient.invalidateQueries({ queryKey: [`/question-groups/${groupId}/questions`] });
                showNotification.success('Soru başarıyla güncellendi!');
                router.push(`/admin/question-group/${groupId}/question`);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Soru güncellenirken bir hata oluştu!');
            }
        }
    });
    
    const handleSubmit = async (data: CreateQuestionRequest) => {
        updateQuestion({ id: questionId, data });
    };

    return (
        <div className="space-y-6">
            <PageHeader/>

            
            <div className="p-1">
                <QuestionForm question={selectedQuestion} onSubmit={handleSubmit} loading={loading}/>
            </div>
        </div>
    );
}