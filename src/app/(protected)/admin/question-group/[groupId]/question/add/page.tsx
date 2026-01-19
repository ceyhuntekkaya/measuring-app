'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import QuestionForm from "@/components/form/QuestionForm";
import {useCreateQuestion} from "@/api/generated/question-management/question-management";
import type {CreateQuestionRequest} from "@/api/generated/model";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { showNotification, getErrorMessage } from "@/lib/notification";

export default function AdminPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const params = useParams();
    const groupId = params.groupId as string;

    const { mutate: createQuestion, isPending: loading } = useCreateQuestion({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/questions'] });
                queryClient.invalidateQueries({ queryKey: [`/question-groups/${groupId}/questions`] });
                showNotification.success('Soru başarıyla eklendi!');
                router.push(`/admin/question-group/${groupId}/question`);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Soru eklenirken bir hata oluştu!');
            }
        }
    });
    
    const handleSubmit = async (data: CreateQuestionRequest) => {
        createQuestion({ data });
    };

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
               <QuestionForm onSubmit={handleSubmit} loading={loading}/>
            </div>
        </div>
    );
}