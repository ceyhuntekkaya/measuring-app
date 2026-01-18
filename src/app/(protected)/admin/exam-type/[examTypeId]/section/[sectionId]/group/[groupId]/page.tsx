'use client';

import {useParams, useRouter} from "next/navigation";
import React from "react";
import {useGetQuestionGroupTypeById, useDeleteQuestionGroupType} from "@/api/generated/question-group-type-management/question-group-type-management";
import QuestionGroupTypeDetail from "@/components/detail/QuestionGroupTypeDetail";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";
import type {ApiResponseQuestionGroupTypeDto, ExamTypeDto} from "@/api/generated/model";

export default function QuestionGroupTypeDetailPage() {
    const params = useParams();
    const groupId = params.groupId as string;

    const router = useRouter();

    const {data, isLoading: loading} = useGetQuestionGroupTypeById(groupId, {
        query: { enabled: !!groupId }
    });
    const selectedType = (data as unknown as ApiResponseQuestionGroupTypeDto)?.data || null;
    
    const deleteQuestionGroupTypeMutation = useDeleteQuestionGroupType();

    if (loading) {
        return (
            <LoadingComp/>
        );
    }


    const handleEdit = () => {
        if(selectedType?.examSection?.id && selectedType.examSection.examType){
            const examType = selectedType.examSection.examType as ExamTypeDto;
            if (examType.id) {
                router.push(`/admin/exam-type/${examType.id}/section/${selectedType.examSection.id}/group/${groupId}/edit`);
            }
        }
    };
    const handleDelete = () => {
        if (selectedType?.id) {
            deleteQuestionGroupTypeMutation.mutate({ id: selectedType.id });
        }
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