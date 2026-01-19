'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useCreateApplication} from "@/api/generated/application-management/application-management";
import ApplicationForm from "@/components/form/application-form";
import type {CreateApplicationRequest, UpdateApplicationRequest} from "@/api/generated/model";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { showNotification, getErrorMessage } from "@/lib/notification";


export default function ApplicationsAdd() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate: createApplication, isPending: loading } = useCreateApplication({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/applications'] });
                showNotification.success('Başvuru başarıyla eklendi!');
                router.push('/admin/applications');
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Başvuru eklenirken bir hata oluştu!');
            }
        }
    });
    
    const handleSubmit = (data: CreateApplicationRequest | UpdateApplicationRequest): void => {
        createApplication({ data: data as CreateApplicationRequest });
    };

/*
    candidates: CandidateDto[];
    exams: ExamOption[];
    examSessions: ExamSessionOption[];
    */



    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <ApplicationForm candidates={[]} exams={[]} examSessions={[]} onSubmit={handleSubmit} loading={loading} />

            </div>
        </div>
    )
}