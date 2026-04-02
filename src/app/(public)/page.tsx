import Image from "next/image";
import logo from "@/assets/logo.png";
import {ArrowRight} from "lucide-react";
import React from "react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen w-full relative overflow-hidden">
            {/* Arka plan resmi */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")'
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-blue-900/20 to-slate-800/30"></div>
            </div>

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            {/* Login Container */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">

                    {/* Logo Container */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center mb-6 group ">
                            <Image
                                src={logo}
                                alt="Logo"
                                className="h-36 w-auto"
                            />
                        </div>

                    </div>

                    {/* Login Form */}
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-white/20 hover:bg-white/12 transition-all duration-300">
                        <div className="space-y-6">

                            {/* Email Input */}
                            <div className="relative">


                            </div>

                            {/* Password Input */}
                            <div className="relative">


                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">


                            </div>




                            {/* Login Button */}
                            <Link
                                href={"/login"}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <div className="flex items-center justify-center">
                                    LOGIN
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8 text-white/50 text-xs">
                        <p>© 2026 Genixo. All rights reserved.</p>
                        <p className="mt-1">Protected by a secure connection.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
