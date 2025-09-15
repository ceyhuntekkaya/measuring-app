'use client';

import {useParams} from "next/navigation";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";
import BranchDetail from "@/components/detail/BranchDetail";
import {useBranch} from "@/hooks/exam/use-branch";

export default function BranchDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const {
        selectedBranch,
        getBranchById,
        loading
    } = useBranch();

    useEffect(() => {
        getBranchById(id);
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
                {
                    selectedBranch &&  <BranchDetail branch={selectedBranch}/>
                }


            </div>
        </div>
    );



}