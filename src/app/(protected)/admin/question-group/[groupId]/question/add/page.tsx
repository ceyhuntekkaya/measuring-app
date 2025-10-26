'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import QuestionForm from "@/components/form/QuestionForm";
import {useQuestion} from "@/hooks/exam/use-question";

export default function AdminPage() {

    const {
       createQuestion
    } = useQuestion();

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
               <QuestionForm onSubmit={createQuestion}/>
            </div>
        </div>
    );
}