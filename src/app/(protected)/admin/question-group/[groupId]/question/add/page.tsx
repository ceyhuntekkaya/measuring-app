'use client';


import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import QuestionForm from "@/components/form/QuestionForm";
import {useQuestionGroup} from "@/hooks/exam/use-question-group";
import LoadingComp from "@/components/ui/loading-comp";

export default function AdminPage() {

    const {
        questionGroups,
        getAllQuestionGroup,
        loading
    } = useQuestionGroup();

    useEffect(() => {
        getAllQuestionGroup();
    }, []);

    if (loading) {
        return (
            <LoadingComp/>
        );
    }


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
               <QuestionForm onSubmit={()=>{}} questionGroups={questionGroups}/>

            </div>
        </div>
    );
}