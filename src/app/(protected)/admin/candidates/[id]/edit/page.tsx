'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import CandidateForm from "@/components/form/canditade-form";
import {useCandidate} from "@/hooks/exam/use-candidate";
import {useParams} from "next/navigation";


export default function CandidateEdit() {

    const params = useParams();
    const id = params.id as string;


    const {
        getCandidateById,
        selectedCandidate,
        updateCandidate,
        loading,
    } = useCandidate();


    useEffect(() => {
        getCandidateById(id);
    }, []);

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <CandidateForm onSubmit={updateCandidate} loading={loading} candidate={selectedCandidate} />

            </div>
        </div>
    )
}