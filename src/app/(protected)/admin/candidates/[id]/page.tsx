'use client';

import {useParams, useRouter} from "next/navigation";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";
import CandidateDetail from "@/components/detail/CandidateDetail";
import {useCandidate} from "@/hooks/exam/use-candidate";

export default function CandidateDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const {
        selectedCandidate,
        getCandidateById,
        loading
    } = useCandidate();

    useEffect(() => {
        getCandidateById(id);
    }, []);

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
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    selectedCandidate &&  <CandidateDetail onEdit={handleEdit} candidate={selectedCandidate}/>
                }


            </div>
        </div>
    );



}