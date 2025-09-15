'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import BranchForm from "@/components/form/branch-form";
import {useBrand} from "@/hooks/exam/use-brand";
import {useBranch} from "@/hooks/exam/use-branch";
import {useParams} from "next/navigation";


export default function BranchAdd() {
    const params = useParams();
    const id = params.id as string;

    const {
        updateBranch,
        selectedBranch,
        getBranchById,
        loading
    } = useBranch();

    useEffect(() => {
        getBranchById(id);
    }, []);



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
                    brands &&  <BranchForm branch={selectedBranch} onSubmit={updateBranch} loading={loading} brands={brands} />
                }

            </div>
        </div>
    )
}