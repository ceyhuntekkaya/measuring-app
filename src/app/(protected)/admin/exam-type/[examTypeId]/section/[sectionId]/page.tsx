'use client';

import {useParams, useRouter} from "next/navigation";
import React from "react";
import {useGetExamSectionById, useDeleteExamSection} from "@/api/generated/exam-section-management/exam-section-management";
import ExamSectionDetail from "@/components/detail/ExamSectionDetail";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";
import type {ApiResponseExamSectionDto, ExamTypeDto} from "@/api/generated/model";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";

export default function ExamTypeDetailPage() {
    const params = useParams();
    const examSectionId = params.sectionId as string;
    const examTypeId = params.examTypeId as string;
    const router = useRouter();
    const queryClient = useQueryClient();

    const {data, isLoading: loading} = useGetExamSectionById(examSectionId, {
        query: { enabled: !!examSectionId }
    });
    const selectedExamSection = (data as unknown as ApiResponseExamSectionDto)?.data || null;
    
    const { mutate: deleteExamSection } = useDeleteExamSection({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/exam-sections'] });
                showNotification.success('Sınav bölümü başarıyla silindi!');
                router.push(`/admin/exam-type/${examTypeId}`);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Sınav bölümü silinirken bir hata oluştu!');
            }
        }
    });

    if (loading) {
        return (
            <LoadingComp/>
        );
    }


    const handleEdit = () => {
        if (selectedExamSection?.examType && selectedExamSection.id) {
            const examType = selectedExamSection.examType as ExamTypeDto;
            if (examType.id) {
                router.push(`/admin/exam-type/${examType.id}/section/${selectedExamSection.id}/edit`);
            }
        }
    };
    const handleDelete = () => {
        if (selectedExamSection?.id) {
            deleteExamSection({ id: selectedExamSection.id });
        }
    };


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <ExamSectionDetail selectedExamSection={selectedExamSection} onEdit={handleEdit} onDelete={handleDelete}/>

            </div>
        </div>
    );
}