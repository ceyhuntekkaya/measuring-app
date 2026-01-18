'use client';
import React from "react";
import PageHeader from "@/components/layout/page-header";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useParams} from "next/navigation";
import {useGetExamById} from "@/api/generated/exam-management/exam-management";
import type { ExamDto } from "@/api/generated/model";
import type { ApiResponseExamDto } from "@/api/generated/model";
import LoadingComp from "@/components/ui/loading-comp";
import ExamPreviewList from "@/components/take/ExamPreviewList";

export default function ExamPreviewPage() {
    const params = useParams();
    const examId = params.id as string;

    const { data, isLoading, error } = useGetExamById(examId, {
        query: { enabled: !!examId }
    });
    
    // Extract exam from API response
    const selectedExam = (data as unknown as ApiResponseExamDto)?.data as ExamDto | undefined;

    if (isLoading) {
        return <LoadingComp/>;
    }

    if (error || !selectedExam) {
        return (
            <div className="space-y-6">
                <PageHeader/>
                <div className="p-6 pt-1">
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">Sınav bulunamadı.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader 
                title={`Sınav Önizleme: ${selectedExam.name || 'İsimsiz Sınav'}`}
                actions={
                    <ActionButtons
                        addButtonText="Yeni Sınav Tipi Tanımla"
                    />
                }
            />
            <div className="p-6 pt-1">
                <ExamPreviewList exam={selectedExam} />
            </div>
        </div>
    );
}
