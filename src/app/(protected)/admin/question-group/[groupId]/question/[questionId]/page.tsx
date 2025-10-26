'use client';


import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import {useQuestion} from "@/hooks/exam/use-question";
import QuestionForm from "@/components/form/QuestionForm";
import {useParams} from "next/navigation";

export default function AdminPage() {

    const params = useParams();
    const questionId = params.questionId as string;

    const {
        updateQuestion,
         getQuestionById,
        selectedQuestion
    } = useQuestion();


    useEffect(() => {
        getQuestionById(questionId);

    }, []);

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <QuestionForm question={selectedQuestion} onSubmit={updateQuestion}/>
            </div>
        </div>
    );
}