'use client';

import {useParams} from "next/navigation";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";
import {useApplication} from "@/hooks/exam/use-application";
import ApplicationDetail from "@/components/detail/ApplicationDetail";

export default function ApplicationDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const {
        selectedApplication,
        getApplicationById,
        loading
    } = useApplication();

    useEffect(() => {
        getApplicationById(id);
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
                    selectedApplication &&  <ApplicationDetail application={selectedApplication}/>
                }


            </div>
        </div>
    );



}