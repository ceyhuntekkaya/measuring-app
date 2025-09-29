'use client';

import {useParams, useRouter} from "next/navigation";
import React, {useEffect} from "react";
import {useQuestionGroupType} from "@/hooks/exam/use-question-group-type";
import QuestionGroupTypeDetail from "@/components/detail/QuestionGroupTypeDetail";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";

export default function QuestionGroupTypeDetailPage() {
    const params = useParams();
    const groupId = params.groupId as string;

    const router = useRouter();

    const {
        selectedType,
        getQuestionGroupTypeById,
        loading,
        deleteQuestionGroupType,
    } = useQuestionGroupType();

    useEffect(() => {
        getQuestionGroupTypeById(groupId);
    }, []);

    if (loading) {
        return (
            <LoadingComp/>
        );
    }


    const handleEdit = () => {
        if(selectedType && selectedType.examSection && selectedType.examSection.examType){
            router.push(`/admin/exam-type/${selectedType.examSection.examType.id}/section/${selectedType.examSection.id}/group/${groupId}/edit`);
        }

    };
    const handleDelete = () => {
        if (selectedType)
            deleteQuestionGroupType(selectedType.id);
    };

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <QuestionGroupTypeDetail selectedType={selectedType} onEdit={handleEdit} onDelete={handleDelete} />

            </div>
        </div>
    );

}