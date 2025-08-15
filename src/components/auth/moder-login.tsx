import React, {FormEvent, useEffect, useState} from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import {useAuthContext} from "@/contexts/auth-context";
import {useRouter, useSearchParams} from "next/navigation";
import logo from '@/assets/logo.png';
import Image from "next/image";

export default function CorporateLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const { login, isAuthenticated, getPathByRole } = useAuthContext();
    const router = useRouter();
    const searchParams = useSearchParams();

    console.log(error)

    const redirectTo = searchParams?.get('redirectTo') || '';

    useEffect(() => {
        if (isAuthenticated) {
            if (redirectTo) {
                router.replace(redirectTo);
            } else {
                router.replace(getPathByRole());
            }
        }
    }, [isAuthenticated, router, getPathByRole, redirectTo]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Lütfen kullanıcı adı ve şifre giriniz.');
            return;
        }

        setError('');
        setIsLoggingIn(true);

        try {
            const success = await login(username, password);
            if (!success) {
                setError('Login failed. Please check your username and password.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login. Please try again later.');
        } finally {
            setIsLoggingIn(false);
        }
    };

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
                                    className="h-14 w-auto"
                                />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome to Study Score AI</h1>
                        <p className="text-white/70 text-sm">Please enter your login credentials.
                        </p>
                    </div>

                    {/* Login Form */}
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-white/20 hover:bg-white/12 transition-all duration-300">
                        <div className="space-y-6">

                            {/* Email Input */}
                            <div className="relative">
                                <label className="block text-white text-sm font-medium mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        required
                                        className="relative block w-full rounded-t-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Kullanıcı Adı"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={isLoggingIn}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <label className="block text-white text-sm font-medium mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="relative block w-full rounded-b-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Şifre"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoggingIn}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-400 focus:ring-blue-400 focus:ring-2"
                                    />
                                    <span className="ml-2 text-white/70 text-sm">Remember me...</span>
                                </label>

                            </div>


                            {error && (
                                <div className="rounded-md bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            {/* Hata ikonu */}
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                        </div>
                                    </div>
                                </div>

                                    )}

                            {/* Login Button */}
                            <button
                                type="button"
                                onClick={handleSubmit}

                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <div className="flex items-center justify-center">
                                    Login
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                                </div>
                            </button>

                            {/* Help Text */}
                            <div className="text-center">
                                <p className="text-white/60 text-xs">
                                    If you are experiencing issues while logging in, please contact our IT support team at helpdesk@studyscore.ai.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8 text-white/50 text-xs">
                        <p>© 2025 Genixo. All rights reserved..</p>
                        <p className="mt-1">Protected by a secure connection.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}