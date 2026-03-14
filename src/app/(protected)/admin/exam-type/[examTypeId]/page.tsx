'use client';

import {useParams, useRouter} from "next/navigation";
import React from "react";
import {useGetExamTypeById, useDeleteExamType} from "@/api/generated/exam-type-management/exam-type-management";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";
import type { ExamTypeDto } from "@/api/generated/model";
import type { ApiResponseExamTypeDto } from "@/api/generated/model";
import ExamTypeDetail from "@/components/detail/ExamTypeDetail";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";

export default function ExamTypeDetailPage() {
    const params = useParams();
    const examTypeId = params.examTypeId as string;
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useGetExamTypeById(examTypeId);
    const selectedExamType = (data as unknown as ApiResponseExamTypeDto)?.data as ExamTypeDto | undefined;

    const { mutate: deleteExamType } = useDeleteExamType({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/exam-types'] });
                showNotification.success('Sınav tipi başarıyla silindi!');
                router.push('/admin/exam-type');
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Sınav tipi silinirken bir hata oluştu!');
            }
        }
    });

    const handleEdit = () => {
        router.push(`/admin/exam-type/${selectedExamType?.id}/edit`);
    };
    const handleDelete = () => {
        if (selectedExamType?.id) {
            deleteExamType({ id: selectedExamType.id });
        }
    };

    if (isLoading) {
        return <LoadingComp/>;
    }

    if (error || !selectedExamType) {
        return (
            <div className="space-y-4">
                <PageHeader/>
                <div className="px-4">
                    <p className="text-red-600">Sınav tipi bulunamadı veya yüklenirken bir hata oluştu.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <PageHeader/>
            <div className="px-4">
                <ExamTypeDetail selectedExamType={selectedExamType} onEdit={handleEdit} onDelete={handleDelete}/>

            </div>
        </div>
    );


}