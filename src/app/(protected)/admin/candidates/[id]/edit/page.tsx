'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import CandidateForm from "@/components/form/canditade-form";
import {useGetCandidateById, useUpdateCandidate} from "@/api/generated/candidate-management/candidate-management";
import {useParams, useRouter} from "next/navigation";
import {useGetAllExamTypes} from "@/api/generated/exam-type-management/exam-type-management";
import type { ApiResponseExamTypeListResponse, UpdateCandidateRequest, ApiResponseCandidateDto, CreateCandidateRequest, ApiResponseExamSessionListResponse, ExamSessionDto } from "@/api/generated/model";
import {useGetUpcomingExamSessions} from "@/api/generated/exam-session-management/exam-session-management";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";


export default function CandidateEdit() {

    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const queryClient = useQueryClient();

    const {data: candidateData, isLoading: loading} = useGetCandidateById(id, {
        query: { enabled: !!id }
    });
    const selectedCandidate = (candidateData as unknown as ApiResponseCandidateDto)?.data;
    
    const { mutate: updateCandidate, isPending: updating } = useUpdateCandidate({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/candidates'] });
                queryClient.invalidateQueries({ queryKey: [`/candidates/${id}`] });
                showNotification.success('Aday başarıyla güncellendi!');
                router.push(`/admin/candidates/${id}`);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Aday güncellenirken bir hata oluştu!');
            }
        }
    });
    
    const handleSubmit = (data: CreateCandidateRequest | UpdateCandidateRequest): void => {
        updateCandidate({ id, data: data as UpdateCandidateRequest });
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
                    examTypes && examTypes.examTypes && <CandidateForm onSubmit={handleSubmit} loading={loading || updating} candidate={selectedCandidate}
                                                examSessions={upcomingExamSessions} examTypes={examTypes.examTypes} mode="update" />
                }


            </div>
        </div>
    )
}