'use client';


import ExamTypeForm from "@/components/form/ExamTypeForm";
import PageHeader from "@/components/layout/page-header";
import React from "react";
import {useCreateExamType} from "@/api/generated/exam-type-management/exam-type-management";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification } from "@/lib/notification";
import { useRouter } from "next/navigation";
import type { ExamTypeDto } from "@/api/generated/model";

export default function ExamTypeAdd() {


    const router = useRouter();
    const queryClient = useQueryClient();
    
    const { mutate: createExamType } = useCreateExamType({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/exam-types'] });
                showNotification.success('Sınav tipi başarıyla oluşturuldu!');
                router.push('/admin/exam-type');
            },
            onError: (error) => {
                showNotification.error('Sınav tipi oluşturulurken bir hata oluştu!');
                console.error('Error creating exam type:', error);
            }
        }
    });

    const handleSubmit = async (examType: ExamTypeDto) => {
        createExamType({ data: examType });
    };



    return (


        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <ExamTypeForm onSubmit={handleSubmit}/>

            </div>
        </div>


    )
}