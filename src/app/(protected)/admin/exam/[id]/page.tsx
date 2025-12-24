'use client';
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useParams} from "next/navigation";
import {useExam} from "@/hooks/exam/use-exam";
import LoadingComp from "@/components/ui/loading-comp";
import ExamPreviewList from "@/components/take/ExamPreviewList";

export default function ExamPreviewPage() {
    const params = useParams();
    const examId = params.id as string;

    const {
        selectedExam,
        loading,
        getExamById
    } = useExam();

    useEffect(() => {
        if (examId) {
            getExamById(examId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [examId]);

    if (loading) {
        return <LoadingComp/>;
    }

    if (!selectedExam) {
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
