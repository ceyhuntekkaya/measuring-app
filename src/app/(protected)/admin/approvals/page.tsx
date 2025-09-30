'use client';


import PageHeader from "@/components/layout/page-header";
import React from "react";

export default function AdminPage() {
    return  <div className="space-y-6">
        <PageHeader/>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="border border-gray-300 rounded-2xl p-6 shadow-lg bg-white text-center">
                Herhangi bir onayınız bulunmamaktadır.
            </div>
        </div>
    </div>



        ;
}