'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import {useUser} from "@/hooks/use-user";
import UserForm from "@/components/form/user-form";
import {useBrand} from "@/hooks/exam/use-brand";


export default function CandidateAdd() {
    const {
        createUser,
    } = useUser();


    const {
        getAllBrands,
        brands
    } = useBrand();


    useEffect(() => {
        getAllBrands();
    }, []);


    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">{
                brands && <UserForm onSubmit={createUser} brands={brands}/>
            }


            </div>
        </div>
    )
}