'use client';

import {useParams} from "next/navigation";
import React, {useEffect} from "react";
import {useExamType} from "@/hooks/exam/use-exam-type";
import ExamTypeDetail from "@/components/detail/ExamTypeDetail";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";

export default function ExamTypeDetailPage() {
    const params = useParams();
    const examTypeId = params.examTypeId as string;

    const {
        selectedExamType,
        getExamTypeById,
        loading
    } = useExamType();

    useEffect(() => {
        getExamTypeById(examTypeId);
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
                <ExamTypeDetail selectedExamType={selectedExamType}/>

            </div>
        </div>
    );



}