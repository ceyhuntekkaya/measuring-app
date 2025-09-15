'use client';

import {useParams} from "next/navigation";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";


export default function ApplicationGraderDetailPage() {
    const params = useParams();
    const id = params.id as string;


    useEffect(() => {
        console.log(id);
    }, []);



    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
               BOŞ

            </div>
        </div>
    );



}