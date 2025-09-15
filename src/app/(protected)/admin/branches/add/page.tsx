'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import BranchForm from "@/components/form/branch-form";
import {useBrand} from "@/hooks/exam/use-brand";
import {useBranch} from "@/hooks/exam/use-branch";


export default function BranchAdd() {


    const {
        createBranch,
        loading,
    } = useBranch();

    const {
        getAllBrands,
        brands,
    } = useBrand();

    useEffect(() => {
        getAllBrands();
    }, []);


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    brands &&  <BranchForm onSubmit={createBranch} loading={loading} brands={brands} />
                }

            </div>
        </div>
    )
}