'use client';

import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ChevronDown, ChevronRight, X} from 'lucide-react';
import {adminRoutes, companyRoutes, appRoutes, learnerRoutes, instructorRoutes, observerRoutes, MenuItem, publicRoutes} from '@/config/routes';
import {useAuth} from "@/hooks/use-auth";
import {Department} from "@/types/auth";
import logo from '@/assets/logo.png';
import Image from "next/image";
import {useAuthContext} from "@/contexts/auth-context";


interface SidebarProps {
    isOpen: boolean;
    onCloseAction: () => void;
}

interface MenuItemProps {
    item: MenuItem;
    level?: number;
}

export default function Sidebar({isOpen = true, onCloseAction}: SidebarProps) {
    const {getPathByRole} = useAuthContext();
    //const pathname = usePathname();
    const [routes, setRoutes] = useState<MenuItem[]>([]);

    const {user} = useAuth();

    useEffect(() => {
        if (user?.roleSet.includes('ADMIN')) {
            setRoutes(adminRoutes.menuItems);
        } else if (user?.roleSet.includes('USER')) {
            setRoutes(appRoutes.menuItems);
        } else if (user?.roleSet.includes('COMPANY')) {
            setRoutes(companyRoutes.menuItems);
        } else if (user?.roleSet.includes('LEARNER')) {
            setRoutes(learnerRoutes.menuItems);
        } else if (user?.roleSet.includes('OBSERVER')) {
            setRoutes(observerRoutes.menuItems);
        } else if (user?.roleSet.includes('INSTRUCTOR')) {
            setRoutes(instructorRoutes.menuItems);
        } else {
            setRoutes(publicRoutes.menuItems);
        }
    }, []);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isOpen) {
                onCloseAction();
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isOpen, onCloseAction]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                    onClick={onCloseAction}
                />
            )}

            <aside className={`
                fixed top-0 left-0 h-screen w-64
                bg-gray-800 shadow-lg z-30 transition-transform duration-300
                md:sticky md:translate-x-0 text-white
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Header Section - Fixed */}
                    <div className="flex-shrink-0">
                        <div className="md:hidden flex justify-end p-4">
                            <button
                                onClick={onCloseAction}
                                className="text-red-900 hover:text-amber-950"
                            >
                                <X className="h-6 w-6"/>
                            </button>
                        </div>

                        <div className="flex justify-center p-4">
                            <Link href={getPathByRole()} className="flex items-center">

                                <Image
                                    src={logo}
                                    alt="Logo"
                                    className="h-16 w-auto"
                                />
                        </Link>
                        </div>
                    </div>

                    {/* Navigation Section - Scrollable */}
                    <nav className="flex-1 py-2 px-4 overflow-y-auto min-h-0">
                        <div className="space-y-2">
                            {routes?.map((item) => (
                                <SidebarMenuItem
                                    key={item.path}
                                    item={item}
                                />
                            ))}
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
}

function SidebarMenuItem({item, level = 0}: MenuItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const {hasAnyDepartment, user} = useAuth();
    const pathname = usePathname();
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;

    const hasAccess = () => {
        // Eğer kullanıcı undefined ise hiçbir erişim yok
        if (!user) return false;

        // Departman kontrolü - kullanıcının hiç departmanı yoksa ve menü departman gerektiriyorsa erişim yok
        const hasRequiredDepartments = !item.requiredDepartments?.length ||
            (user.departmentSet?.length > 0 &&
                item.requiredDepartments.some(dept => hasAnyDepartment(dept as Department)));

        // Rol kontrolü
        const hasRequiredRoles = !item.requiredRoles?.length ||
            item.requiredRoles.some(role => user?.roleSet.includes(role));

        return hasRequiredDepartments && hasRequiredRoles;
    };

    if (!hasAccess()) {
        return null;
    }

    const isActive = pathname === item.path;
    const paddingLeft = level * 4 + 4;

    return (
        <div>
            <div
                onClick={() => hasChildren && setIsOpen(!isOpen)}
                className={`
                    group flex items-center py-2.5 cursor-pointer rounded
                    ${isActive ? 'bg-gray-700 border-l-4 border-white' : 'hover:bg-gray-700'}
                `}
                style={{paddingLeft: `${paddingLeft}px`}}
            >
                <div className="flex items-center flex-1 min-w-0">
                    {Icon && (
                        <Icon className={`
                            h-5 w-5 mr-3 flex-shrink-0
                            ${isActive ? 'text-white' : 'text-gray-500'}
                        `}/>
                    )}

                    {!hasChildren ? (
                        <Link
                            href={item.path}
                            className={`
                                text-sm truncate flex-1
                                ${isActive ? 'text-indigo-600 ' : 'text-white'}
                            `}
                        >
                            {item.title}
                        </Link>
                    ) : (
                        <span className={`
                            text-sm truncate flex-1
                            ${isActive ? 'text-indigo-600 ' : 'text-white'}
                        `}>
                            {item.title}
                        </span>
                    )}
                </div>

                {hasChildren && (
                    <div className="pr-4 flex-shrink-0">
                        {isOpen ? (
                            <ChevronDown className="h-4 w-4 text-gray-400"/>
                        ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400"/>
                        )}
                    </div>
                )}
            </div>

            {hasChildren && (
                <div className={`
                    overflow-hidden transition-all duration-300
                    ${isOpen ? 'overflow-y-auto' : 'max-h-0'}
                `}>
                    <div className="space-y-1 ml-6">
                        {item.children?.map((child) => (
                            <SidebarMenuItem
                                key={child.path}
                                item={child}
                                level={level + 1}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}