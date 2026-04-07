// components/exam/ExamLoginPage.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useExamContext } from '@/contexts/ExamContext';
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react';
import {useGetApplicationByCredentials} from "@/api/generated/exam-taking/exam-taking";
import {showNotification, getErrorMessage} from "@/lib/notification";
import type {ApiResponseApplicationDto} from "@/api/generated/model";

export default function ExamLoginPage() {
    const { state, loginSuccess, setStep } = useExamContext();
    const getApplicationByCredentialsMutation = useGetApplicationByCredentials();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if already authenticated
    useEffect(() => {
        if (state.isAuthenticated && state.application) {
            setStep('welcome');
        }
    }, [state.isAuthenticated, state.application, setStep]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username.trim()) {
            setError('Kullanıcı adı gereklidir');
            return;
        }

        if (!formData.password.trim()) {
            setError('Şifre gereklidir');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await getApplicationByCredentialsMutation.mutateAsync({
                data: {
                    username: formData.username,
                    password: formData.password
                }
            });
            if (result && typeof result === 'object' && 'data' in (result as object)) {
                const applicationData = (result as ApiResponseApplicationDto).data;
                if (applicationData) {
                    loginSuccess(applicationData);
                }
            }
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            setError(errorMessage || 'Giriş başarısız. Kullanıcı adı ve şifreyi kontrol edin.');
            showNotification.error(errorMessage || 'Giriş yapılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <LogIn className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Online Sınav Sistemi
                    </h1>
                    <p className="text-gray-600">
                        Sınava başlamak için giriş bilgilerinizi girin
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Kullanıcı Adı
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                        error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
                                    }`}
                                    placeholder="Kullanıcı adınızı girin"
                                    disabled={loading}
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Şifre
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                        error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
                                    }`}
                                    placeholder="Şifrenizi girin"
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !formData.username.trim() || !formData.password.trim()}
                            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                                loading || !formData.username.trim() || !formData.password.trim()
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                    Giriş yapılıyor...
                                </div>
                            ) : (
                                'Sınava Başla'
                            )}
                        </button>
                    </form>

                    {/* Help Text */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Giriş bilgilerinizi hatırlamıyor musunuz?
                            <br />
                            <span className="text-blue-600 font-medium">Sınav koordinatörünüz ile iletişime geçin</span>
                        </p>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="text-sm font-medium text-yellow-800 mb-2">Önemli Bilgilendirme</h4>
                        <ul className="text-xs text-yellow-700 space-y-1">
                            <li>• Sınav sırasında tam ekran modunda kalınız</li>
                            <li>• Başka sekme veya uygulamalara geçmeyin</li>
                            <li>• Tarayıcınızı yenilemeyin</li>
                            <li>• İnternet bağlantınızın stabil olduğundan emin olun</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}