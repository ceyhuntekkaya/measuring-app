'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import CandidateForm from "@/components/form/canditade-form";
import {useCreateCandidate} from "@/api/generated/candidate-management/candidate-management";
import {useGetAllExamTypes} from "@/api/generated/exam-type-management/exam-type-management";
import type { ApiResponseExamTypeListResponse, CreateCandidateRequest, UpdateCandidateRequest, ApiResponseExamSessionListResponse, ExamSessionDto } from "@/api/generated/model";
import {useGetUpcomingExamSessions} from "@/api/generated/exam-session-management/exam-session-management";


export default function CandidateAdd() {

    const createCandidateMutation = useCreateCandidate();
    const createCandidate = (data: CreateCandidateRequest | UpdateCandidateRequest): void => {
        createCandidateMutation.mutateAsync({ data: data as CreateCandidateRequest });
    };
    const loading = createCandidateMutation.isPending;

    const { data: examTypesData } = useGetAllExamTypes({});
    const examTypes = (examTypesData as unknown as ApiResponseExamTypeListResponse)?.data || null;

    const { data: sessionsData } = useGetUpcomingExamSessions({});
    const upcomingExamSessions = ((sessionsData as unknown as ApiResponseExamSessionListResponse)?.data?.examSessions || []) as ExamSessionDto[];

    const examTypesList = examTypes?.examTypes || [];


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    examTypesList.length > 0 &&  <CandidateForm onSubmit={createCandidate} loading={loading} examSessions={upcomingExamSessions} examTypes={examTypesList} />
                }


            </div>
        </div>
    )
}