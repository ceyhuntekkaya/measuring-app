'use client';

import {useParams} from "next/navigation";
import React, {useEffect} from "react";
import {useQuestionGroupType} from "@/hooks/exam/use-question-group-type";
import QuestionGroupTypeDetail from "@/components/detail/QuestionGroupTypeDetail";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";

export default function QuestionGroupTypeDetailPage() {
    const params = useParams();
    const groupId = params.groupId as string;

    const {
        selectedType,
        getQuestionGroupTypeById,
        loading
    } = useQuestionGroupType();

    useEffect(() => {
        getQuestionGroupTypeById(groupId);
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
                <QuestionGroupTypeDetail selectedType={selectedType}/>

            </div>
        </div>
    );

}