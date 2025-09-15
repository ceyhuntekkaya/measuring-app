'use client';

import PageHeader from "@/components/layout/page-header";
import React from "react";
import BrandForm from "@/components/form/brand-form";
import {useBrand} from "@/hooks/exam/use-brand";


export default function BrandAdd() {


    const {
        createBrand,
        loading,
    } = useBrand();

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                <BrandForm onSubmit={createBrand} loading={loading} />

            </div>
        </div>
    )
}