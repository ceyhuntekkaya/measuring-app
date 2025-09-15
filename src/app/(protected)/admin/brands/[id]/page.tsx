'use client';

import {useParams} from "next/navigation";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";
import {useBrand} from "@/hooks/exam/use-brand";
import BrandDetail from "@/components/detail/BrandDetail";

export default function BrandDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const {
        selectedBrand,
        getBrandById,
        loading
    } = useBrand();

    useEffect(() => {
        getBrandById(id);
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
                    selectedBrand &&  <BrandDetail brand={selectedBrand}/>
                }


            </div>
        </div>
    );



}