'use client';


import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import ExamSessionForm from "@/components/form/ExamSessionForm";
import {useExamSession} from "@/hooks/exam/use-exam-session";
import {useBrand} from "@/hooks/exam/use-brand";
import {useBranch} from "@/hooks/exam/use-branch";
import {useUser} from "@/hooks/use-user";

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
        brandBranches,
    } = useBranch();



    const {
        getUsersByDepartment,
        users,
    } = useUser();



    useEffect(() => {
        getUsersByDepartment('SUPERVISOR');
        getAllBrands();
    }, []);


    useEffect(() => {
        if(brands){
            getBranchesByBrand(brands[0].id);
        }
    }, [brands]);


    const onBrandChange = (id: string) => {
        getBranchesByBrand(id);
    }




    //  supervisors?: UserDto[];

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    brands && brandBranches && users &&
                    <ExamSessionForm onSubmit={createExamSession} loading={loading} supervisors={users} brands={brands}
                                     branches={brandBranches} onBrandChange={onBrandChange}/>
                }

            </div>
        </div>
    )
}