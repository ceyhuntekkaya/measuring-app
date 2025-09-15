'use client';


import PageHeader from "@/components/layout/page-header";
import React from "react";
import ExamSessionForm from "@/components/form/ExamSessionForm";

export default function SessionAdd() {


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <ExamSessionForm onSubmit={() => {
                }}/>

            </div>
        </div>
    )
}