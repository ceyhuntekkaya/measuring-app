'use client';


import PageHeader from "@/components/layout/page-header";
import React from "react";

export default function AdminPage() {
    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-6 pt-1">
                Henüz sertifikaya hak kazanan başvuru bulunmamaktadır.

            </div>
        </div>
    );

}