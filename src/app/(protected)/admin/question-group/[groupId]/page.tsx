'use client';

import {useParams, useRouter} from "next/navigation";
import React, {useEffect} from "react";
import {useQuestionGroup} from "@/hooks/exam/use-question-group";
import QuestionGroupDetail from "@/components/detail/QuestionGroupDetail";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";

export default function QuestionGroupDetailPage() {
    const params = useParams();
    const groupId = params.groupId as string;
    const router = useRouter();
    const {
        selectedQuestionGroup,
        getQuestionGroupById,
        deleteQuestionGroup,
        loading
    } = useQuestionGroup();

    useEffect(() => {
        getQuestionGroupById(groupId);
    }, []);


    const handleEdit = () => {
        router.push(`/admin/question-group/${selectedQuestionGroup?.id}/edit`);
    };
    const handleDelete = () => {
        if (selectedQuestionGroup)
            deleteQuestionGroup(selectedQuestionGroup.id);
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