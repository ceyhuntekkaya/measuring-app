'use client';

import {useParams, useRouter} from "next/navigation";
import React from "react";
import {useGetQuestionGroupById, useDeleteQuestionGroup} from "@/api/generated/question-group-management/question-group-management";
import QuestionGroupDetail from "@/components/detail/QuestionGroupDetail";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";
import type {ApiResponseQuestionGroupDto} from "@/api/generated/model";

export default function QuestionGroupDetailPage() {
    const params = useParams();
    const groupId = params.groupId as string;
    const router = useRouter();
    
    const {data, isLoading: loading} = useGetQuestionGroupById(groupId, {
        query: { enabled: !!groupId }
    });
    const selectedQuestionGroup = (data as unknown as ApiResponseQuestionGroupDto)?.data || null;
    
    const deleteQuestionGroupMutation = useDeleteQuestionGroup();

    const handleEdit = () => {
        if (selectedQuestionGroup?.id) {
            router.push(`/admin/question-group/${selectedQuestionGroup.id}/edit`);
        }
    };
    const handleDelete = () => {
        if (selectedQuestionGroup?.id) {
            deleteQuestionGroupMutation.mutate({ id: selectedQuestionGroup.id });
        }
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
                <QuestionGroupDetail selectedQuestionGroup={selectedQuestionGroup} onEdit={handleEdit} onDelete={handleDelete}/>

            </div>
        </div>
    );



}