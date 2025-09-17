'use client';


import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import ExamSessionForm from "@/components/form/ExamSessionForm";
import {useExamSession} from "@/hooks/exam/use-exam-session";
import {useBrand} from "@/hooks/exam/use-brand";
import {useBranch} from "@/hooks/exam/use-branch";
import {useUser} from "@/hooks/use-user";
import {useExamType} from "@/hooks/exam/use-exam-type";
import {useParams} from "next/navigation";

export default function SessionAdd() {


    const params = useParams();
    const id = params.id as string;


    const {
        updateExamSession,
        getExamSessionById,
        selectedExamSession,
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

    const {
        getAllExamTypes,
        examTypes,
    } = useExamType();


    useEffect(() => {
        getExamSessionById(id);
        getUsersByDepartment('SUPERVISOR');
        getAllBrands();
        getAllExamTypes();
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
                    brands && brandBranches && users && examTypes && selectedExamSession &&
                    <ExamSessionForm examSession={selectedExamSession} onSubmit={updateExamSession} loading={loading} supervisors={users} brands={brands}
                                     branches={brandBranches} onBrandChange={onBrandChange} examTypes={examTypes.examTypes}/>
                }

            </div>
        </div>
    )
}