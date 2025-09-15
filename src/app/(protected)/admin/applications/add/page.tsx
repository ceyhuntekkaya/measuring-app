'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useApplication} from "@/hooks/exam/use-application";
import ApplicationForm from "@/components/form/application-form";


export default function ApplicationsAdd() {


    const {
        createApplication,
        loading,
    } = useApplication();

/*
    candidates: CandidateDto[];
    exams: ExamOption[];
    examSessions: ExamSessionOption[];
    */



    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <ApplicationForm candidates={[]} exams={[]} examSessions={[]} onSubmit={createApplication} loading={loading} />

            </div>
        </div>
    )
}