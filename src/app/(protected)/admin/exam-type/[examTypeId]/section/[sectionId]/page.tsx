'use client';

import {useParams, useRouter} from "next/navigation";
import React from "react";
import {useGetExamSectionById, useDeleteExamSection} from "@/api/generated/exam-section-management/exam-section-management";
import ExamSectionDetail from "@/components/detail/ExamSectionDetail";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";
import type {ApiResponseExamSectionDto, ExamTypeDto} from "@/api/generated/model";

export default function ExamTypeDetailPage() {
    const params = useParams();
    const examSectionId = params.sectionId as string;
    const router = useRouter();

    const {data, isLoading: loading} = useGetExamSectionById(examSectionId, {
        query: { enabled: !!examSectionId }
    });
    const selectedExamSection = (data as unknown as ApiResponseExamSectionDto)?.data || null;
    
    const deleteExamSectionMutation = useDeleteExamSection();

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
            deleteExamSectionMutation.mutate({ id: selectedExamSection.id });
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