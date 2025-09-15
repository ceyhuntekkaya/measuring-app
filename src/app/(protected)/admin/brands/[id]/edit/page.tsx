'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import BrandForm from "@/components/form/brand-form";
import {useBrand} from "@/hooks/exam/use-brand";
import {useParams} from "next/navigation";


export default function BrandEdit() {

    const params = useParams();
    const id = params.id as string;


    const {
        updateBrand,
        selectedBrand,
        getBrandById,
        loading
    } = useBrand();

    useEffect(() => {
        getBrandById(id);
    }, []);


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <BrandForm onSubmit={updateBrand} loading={loading} brand={selectedBrand} />

            </div>
        </div>
    )
}