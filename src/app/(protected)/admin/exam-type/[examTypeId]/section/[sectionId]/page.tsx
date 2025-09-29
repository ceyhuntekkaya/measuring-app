'use client';

import {useParams, useRouter} from "next/navigation";
import React, {useEffect} from "react";
import {useExamSection} from "@/hooks/exam/use-exam-section";
import ExamSectionDetail from "@/components/detail/ExamSectionDetail";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";

export default function ExamTypeDetailPage() {
    const params = useParams();
    const examSectionId = params.sectionId as string;
    const router = useRouter();

    const {
        selectedExamSection,
        getExamSectionById,
        deleteExamSection,
        loading
    } = useExamSection();

    useEffect(() => {
        getExamSectionById(examSectionId);
    }, []);

    if (loading) {
        return (
            <LoadingComp/>
        );
    }


    const handleEdit = () => {
        router.push(`/admin/exam-type/${selectedExamSection?.examType?.id}/section/${selectedExamSection?.id}/edit`);
    };
    const handleDelete = () => {
        if (selectedExamSection)
            deleteExamSection(selectedExamSection.id);
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