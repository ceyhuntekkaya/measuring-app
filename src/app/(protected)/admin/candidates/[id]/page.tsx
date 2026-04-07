'use client';

import {useParams, useRouter} from "next/navigation";
import React from "react";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";
import CandidateDetail from "@/components/detail/CandidateDetail";
import {useGetCandidateById} from "@/api/generated/candidate-management/candidate-management";
import type {ApiResponseCandidateDto} from "@/api/generated/model";

export default function CandidateDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const {data, isLoading: loading} = useGetCandidateById<ApiResponseCandidateDto>(id, {
        query: { enabled: !!id }
    });
    const selectedCandidate = data?.data;

    if (loading) {
        return (
            <LoadingComp/>
        );
    }

    const handleEdit = () => {
        router.push(`/admin/candidates/${id}/edit`);
    };


    /*
    onEdit?: () => void;
    onDelete?: () => void;
    onResetPassword?: () => void;
    onViewApplications?: () => void;
    onActivate?: () => void;

     */

    return (
        <div className="space-y-4">
            <PageHeader/>
            <div className="px-4">
                {
                    selectedCandidate &&  <CandidateDetail onEdit={handleEdit} candidate={selectedCandidate}/>
                }


            </div>
        </div>
    );



}