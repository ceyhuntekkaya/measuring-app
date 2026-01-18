'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import CandidateForm from "@/components/form/canditade-form";
import {useGetCandidateById, useUpdateCandidate} from "@/api/generated/candidate-management/candidate-management";
import {useParams} from "next/navigation";
import {useGetAllExamTypes} from "@/api/generated/exam-type-management/exam-type-management";
import type { ApiResponseExamTypeListResponse, UpdateCandidateRequest, ApiResponseCandidateDto, CreateCandidateRequest, ApiResponseExamSessionListResponse, ExamSessionDto } from "@/api/generated/model";
import {useGetUpcomingExamSessions} from "@/api/generated/exam-session-management/exam-session-management";


export default function CandidateEdit() {

    const params = useParams();
    const id = params.id as string;

    const {data: candidateData, isLoading: loading} = useGetCandidateById(id, {
        query: { enabled: !!id }
    });
    const selectedCandidate = (candidateData as unknown as ApiResponseCandidateDto)?.data;
    
    const updateCandidateMutation = useUpdateCandidate();
    const updateCandidate = (data: CreateCandidateRequest | UpdateCandidateRequest): void => {
        updateCandidateMutation.mutateAsync({ id, data: data as UpdateCandidateRequest });
    };

    const { data: examTypesData } = useGetAllExamTypes({});
    const examTypes = (examTypesData as unknown as ApiResponseExamTypeListResponse)?.data || null;

    const { data: sessionsData } = useGetUpcomingExamSessions({});
    const upcomingExamSessions = ((sessionsData as unknown as ApiResponseExamSessionListResponse)?.data?.examSessions || []) as ExamSessionDto[];



    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    examTypes && examTypes.examTypes && <CandidateForm onSubmit={updateCandidate} loading={loading} candidate={selectedCandidate}
                                                examSessions={upcomingExamSessions} examTypes={examTypes.examTypes} mode="update" />
                }


            </div>
        </div>
    )
}