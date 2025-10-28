'use client';


import {useAuth} from "@/hooks/use-auth";
import {LogOut} from "lucide-react";
import React from "react";

export default function UserDashboard() {
    const { user, candidate , logout, examSession, application, exam, evaluations} = useAuth();

    console.log("candidate")
    console.log(user)
    console.log(candidate)
    console.log(examSession)
    console.log(application)
    console.log(exam)
    console.log(evaluations)

    console.log("candidate")

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
            {user?.name} -
            {candidate?.name} -


            <button
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-base text-red-600 hover:bg-gray-100"
            >
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
            </button>

        </div>
    );
}