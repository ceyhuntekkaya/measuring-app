'use client';


import PageHeader from "@/components/layout/page-header";
import React from "react";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";


export default function AdminPage() {
    const router = useRouter();





    const handleAdd = () => {
        router.push('/admin/sessions/add');
    };



    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                    addButtonText="Yeni Oturum Tanımla"
                />
            }/>
            <div className="p-6 pt-1">
                {
                  //  examTypes &&  <DynamicTable columns={columns} data={examTypes.examTypes}/>
                }

            </div>
        </div>
    );

}