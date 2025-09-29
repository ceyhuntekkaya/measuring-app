'use client';

import {useParams, useRouter} from "next/navigation";
import React, {useEffect} from "react";
import {useExamType} from "@/hooks/exam/use-exam-type";
import ExamTypeDetail from "@/components/detail/ExamTypeDetail";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";

export default function ExamTypeDetailPage() {
    const params = useParams();
    const examTypeId = params.examTypeId as string;
    const router = useRouter();
    const {
        selectedExamType,
        getExamTypeById,
        loading,
        deleteExamType
    } = useExamType();

    useEffect(() => {
        getExamTypeById(examTypeId);
    }, []);


    const handleEdit = () => {
        router.push(`/admin/exam-type/${selectedExamType?.id}/edit`);
    };
    const handleDelete = () => {
        if (selectedExamType)
            deleteExamType(selectedExamType.id);
    };

    if (loading) {
        return (
            <LoadingComp/>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <ExamTypeDetail selectedExamType={selectedExamType} onEdit={handleEdit} onDelete={handleDelete}/>

            </div>
        </div>
    );


}