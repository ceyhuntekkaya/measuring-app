'use client';

import {useParams} from "next/navigation";
import React from "react";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";
import {useGetApplicationById} from "@/api/generated/application-management/application-management";
import ApplicationDetail from "@/components/detail/ApplicationDetail";
import type {ApiResponseApplicationDto} from "@/api/generated/model";

export default function ApplicationDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const {data, isLoading: loading} = useGetApplicationById(id, {
        query: { enabled: !!id }
    });
    
    const selectedApplication = (data as unknown as ApiResponseApplicationDto)?.data;

    if (loading) {
        return (
            <LoadingComp/>
        );
    }

    return (
        <div className="space-y-4">
            <PageHeader/>
            <div className="px-4">
                {
                    selectedApplication &&  <ApplicationDetail application={selectedApplication}/>
                }


            </div>
        </div>
    );



}