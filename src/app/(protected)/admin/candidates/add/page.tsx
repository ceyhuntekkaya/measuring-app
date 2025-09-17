'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import CandidateForm from "@/components/form/canditade-form";
import {useCandidate} from "@/hooks/exam/use-candidate";
import {useExamType} from "@/hooks/exam/use-exam-type";
import {useExamSession} from "@/hooks/exam/use-exam-session";


export default function CandidateAdd() {



    const {
        createCandidate,
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
        getAllExamTypes();
        getUpcomingExamSessions();
    }, []);


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    examTypes &&  <CandidateForm onSubmit={createCandidate} loading={loading} examSessions={upcomingExamSessions} examTypes={examTypes.examTypes} />
                }


            </div>
        </div>
    )
}