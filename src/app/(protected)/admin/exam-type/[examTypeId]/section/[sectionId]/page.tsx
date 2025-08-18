'use client';

import {useParams} from "next/navigation";
import React, {useEffect} from "react";
import {useExamSection} from "@/hooks/exam/use-exam-section";
import ExamSectionDetail from "@/components/detail/ExamSectionDetail";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";

export default function ExamTypeDetailPage() {
    const params = useParams();
    const examSectionId = params.sectionId as string;

    const {
        selectedExamSection,
        getExamSectionById,
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


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <ExamSectionDetail selectedExamSection={selectedExamSection}/>

            </div>
        </div>
    );
}