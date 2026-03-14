'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { findMenuItemByPath, generateBreadcrumbsFromPath, MenuItem } from '@/config/routes';
import {useExamApplicationContext} from "@/contexts/ExamApplicationContext";

interface PageHeaderProps {
    actions?: React.ReactNode;
}

export default function PageExamHeader({ actions }: PageHeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const currentPage = findMenuItemByPath(pathname);
    const {candidate} = useExamApplicationContext();

    // Kullanıcı adı soyadı
    const userName = candidate ? `${candidate.name || ''} ${candidate.lastName || ''}`.trim() : '';
    const greeting = userName ? `Merhaba, ${userName}` : 'Merhaba';

    const getBreadcrumbs = (): MenuItem[] => {
        // Önce menüden bulmaya çalış
        if (currentPage) {
            const chain: MenuItem[] = [];
            let current: MenuItem | null = currentPage;

            // Root'a kadar çık ve tüm parent chain'i topla
            while (current) {
                chain.push(current);
                current = current.parent || null;
            }

            // Root'dan başlayarak sırala
            const menuBreadcrumbs = chain.reverse();
            
            // Eğer menüden breadcrumb bulunduysa, onu kullan
            if (menuBreadcrumbs.length > 0) {
                return menuBreadcrumbs;
            }
        }

        // Menüde yoksa, path'ten oluştur
        return generateBreadcrumbsFromPath(pathname);
    };

    const breadcrumbs = getBreadcrumbs();

    return (<>
            <div className="mt-1 mb-4 p-2 flex items-center justify-between bg-white">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                          {greeting}
                        </h1>

                        <div className="flex items-center mt-1 text-sm text-gray-500">
                            {breadcrumbs.map((item, index) => {
                                // Check if this is a container (menu group, not a real page)
                                const isContainer = item.isContainer === true;
                                
                                // Use index + path for unique key to avoid duplicate key warnings
                                const uniqueKey = `${item.path}-${index}`;
                                
                                return (
                                    <div key={uniqueKey} className="flex items-center">
                                        {index > 0 && (
                                            <ChevronRight className="h-4 w-4 mx-2" />
                                        )}
                                        {isContainer ? (
                                            <span className="text-gray-500 cursor-default">
                                                {item.title}
                                            </span>
                                        ) : (
                                            <Link
                                                href={item.path}
                                                className="hover:text-gray-700"
                                            >
                                                {item.title}
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {actions && (
                    <div className="flex items-center space-x-2">
                        {actions}
                    </div>
                )}
            </div>

        </>
    );
}