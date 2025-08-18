'use client';
import ExamSectionForm from "@/components/form/ExamSectionForm";
import PageHeader from "@/components/layout/page-header";
import React from "react";

export default function ExamSectionAdd() {
    return (


        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <ExamSectionForm onSubmit={() => {
                }} examTypes={[]}/>

            </div>
        </div>

    )
}