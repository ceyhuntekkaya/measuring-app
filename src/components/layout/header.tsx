'use client';
import React, {useState} from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Menu } from 'lucide-react';
import { Globe, User, LogOut, Settings, HelpCircle } from 'lucide-react';
import {useAuthContext} from "@/contexts/auth-context";


export default function Header() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const { activeBrand } = useAuthContext();

    const languages = [
        { code: 'tr', name: 'Türkçe' },
        { code: 'en', name: 'English' },
    ];


    return (
        <header className="bg-white shadow-md">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="relative">
                            <button
                                className="flex items-center space-x-2 px-2 py-2 rounded-md hover:bg-gray-100"
                            >
                                <span><b>{activeBrand?.name} NISH</b></span>
                            </button>


                        </div>

                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">

                        {/* Brand Selector */}




                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
                            >
                                <Globe className="h-5 w-5" />
                                <span>TR</span>
                            </button>

                            {/* Language Dropdown */}
                            {isLangOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                    <div className="py-1">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => setIsLangOpen(!isLangOpen)}
                                                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                {lang.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>





                        {/* Profile Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
                            >
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">
                                    {user?.username}
                                </span>
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                    <div className="py-1">
                                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Ayarlar
                                        </button>
                                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            <HelpCircle className="mr-2 h-4 w-4" />
                                            Yardım
                                        </button>
                                        <button
                                            onClick={logout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Çıkış Yap
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="sm:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            {/* Language Options */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="px-4 mb-2 text-sm font-medium text-gray-500">
                                    Dil Seçimi
                                </div>
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className="block w-full px-4 py-2 text-left text-base text-gray-700 hover:bg-gray-100"
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>

                            {/* Profile Options */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="px-4 mb-2 flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        {user?.username}
                                    </span>
                                </div>
                                <button className="flex items-center w-full px-4 py-2 text-base text-gray-700 hover:bg-gray-100">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Ayarlar
                                </button>
                                <button className="flex items-center w-full px-4 py-2 text-base text-gray-700 hover:bg-gray-100">
                                    <HelpCircle className="mr-2 h-4 w-4" />
                                    Yardım
                                </button>
                                <button
                                    onClick={logout}
                                    className="flex items-center w-full px-4 py-2 text-base text-red-600 hover:bg-gray-100"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Çıkış Yap
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}