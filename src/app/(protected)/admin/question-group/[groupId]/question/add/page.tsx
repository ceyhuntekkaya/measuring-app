'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import QuestionForm from "@/components/form/QuestionForm";
import {useCreateQuestion} from "@/api/generated/question-management/question-management";
import type {CreateQuestionRequest} from "@/api/generated/model";

export default function AdminPage() {

    const createQuestionMutation = useCreateQuestion();
    const createQuestion = async (data: CreateQuestionRequest) => {
        await createQuestionMutation.mutateAsync({ data });
    };

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
               <QuestionForm onSubmit={createQuestion}/>
            </div>
        </div>
    );
}