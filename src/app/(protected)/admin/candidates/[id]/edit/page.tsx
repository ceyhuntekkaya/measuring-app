'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import CandidateForm from "@/components/form/canditade-form";
import {useCandidate} from "@/hooks/exam/use-candidate";
import {useParams} from "next/navigation";
import {useExamType} from "@/hooks/exam/use-exam-type";
import {useExamSession} from "@/hooks/exam/use-exam-session";


export default function CandidateEdit() {

    const params = useParams();
    const id = params.id as string;


    const {
        getCandidateById,
        selectedCandidate,
        updateCandidate,
        loading,
    } = useCandidate();


    const {
        getAllExamTypes,
        examTypes,
    } = useExamType();

    const {
        getUpcomingExamSessions,
        upcomingExamSessions,
    } = useExamSession();


    useEffect(() => {
        getCandidateById(id);
        getAllExamTypes();
        getUpcomingExamSessions();
    }, []);



    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    examTypes && <CandidateForm onSubmit={updateCandidate} loading={loading} candidate={selectedCandidate}
                                                examSessions={upcomingExamSessions} examTypes={examTypes.examTypes} mode="update" />
                }


            </div>
        </div>
    )
}