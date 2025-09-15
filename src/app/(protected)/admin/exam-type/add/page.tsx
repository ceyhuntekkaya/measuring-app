'use client';


import ExamTypeForm from "@/components/form/ExamTypeForm";
import PageHeader from "@/components/layout/page-header";
import React from "react";

export default function ExamTypeAdd() {
    return (


        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <ExamTypeForm onSubmit={() => {
                }}/>

            </div>
        </div>


    )
}