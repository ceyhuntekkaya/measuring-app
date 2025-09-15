'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import CandidateForm from "@/components/form/canditade-form";
import {useCandidate} from "@/hooks/exam/use-candidate";


export default function CandidateAdd() {
    const {
        createCandidate,
        loading,
    } = useCandidate();


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <CandidateForm onSubmit={createCandidate} loading={loading} />

            </div>
        </div>
    )
}