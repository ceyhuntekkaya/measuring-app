'use client';


import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useGetQuestionById, useUpdateQuestion} from "@/api/generated/question-management/question-management";
import QuestionForm from "@/components/form/QuestionForm";
import {useParams} from "next/navigation";
import type {ApiResponseQuestionDto, CreateQuestionRequest} from "@/api/generated/model";

export default function AdminPage() {

    const params = useParams();
    const questionId = params.questionId as string;

    const {data} = useGetQuestionById(questionId, {
        query: { enabled: !!questionId }
    });
    const selectedQuestion = (data as ApiResponseQuestionDto)?.data;
    
    const updateQuestionMutation = useUpdateQuestion();
    const updateQuestion = async (data: CreateQuestionRequest) => {
        await updateQuestionMutation.mutateAsync({ id: questionId, data });
    };

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <QuestionForm question={selectedQuestion} onSubmit={updateQuestion}/>
            </div>
        </div>
    );
}