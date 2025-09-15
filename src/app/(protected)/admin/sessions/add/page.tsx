'use client';


import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import ExamSessionForm from "@/components/form/ExamSessionForm";
import {useExamSession} from "@/hooks/exam/use-exam-session";
import {useBrand} from "@/hooks/exam/use-brand";
import {useBranch} from "@/hooks/exam/use-branch";

export default function SessionAdd() {

    const {
        createExamSession,
        loading,
    } = useExamSession();

    const {
        getAllBrands,
        brands,
    } = useBrand();

    const {
        getBranchesByBrand,
        branches,
    } = useBranch();



    useEffect(() => {
        getAllBrands();
    }, []);

    const onBrandChange = (id: string) => {
        getBranchesByBrand(id);
    }


    //  supervisors?: UserDto[];

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    brands && branches &&
                    <ExamSessionForm onSubmit={createExamSession} loading={loading} supervisors={[]} brands={brands}
                                     branches={branches} onBrandChange={onBrandChange}/>
                }

            </div>
        </div>
    )
}