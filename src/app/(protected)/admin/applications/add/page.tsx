'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useCreateApplication} from "@/api/generated/application-management/application-management";
import ApplicationForm from "@/components/form/application-form";
import type {CreateApplicationRequest, UpdateApplicationRequest} from "@/api/generated/model";


export default function ApplicationsAdd() {

    const createApplicationMutation = useCreateApplication();
    const createApplication = (data: CreateApplicationRequest | UpdateApplicationRequest): void => {
        createApplicationMutation.mutateAsync({ data: data as CreateApplicationRequest });
    };
    const loading = createApplicationMutation.isPending;

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