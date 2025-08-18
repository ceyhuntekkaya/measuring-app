'use client';
import QuestionGroupTypeForm from "@/components/form/QuestionGroupTypeForm";
import PageHeader from "@/components/layout/page-header";
import React from "react";

export default function QuestionGroupTypeAdd() {
    return (


    <div className="space-y-6">
        <PageHeader/>
        <div className="p-1">
            <QuestionGroupTypeForm onSubmit={() => {
            }} examSections={[]}/>

        </div>
    </div>
    )
}