'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { findMenuItemByPath, generateBreadcrumbsFromPath, MenuItem } from '@/config/routes';

interface PageHeaderProps {
    title?: string;
    actions?: React.ReactNode;
}

export default function PageHeader({ title, actions }: PageHeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const currentPage = findMenuItemByPath(pathname);



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
            
       
            
            // Eğer sadece "Ana Sayfa" bulunduysa ve pathname farklıysa, path'ten oluştur
            const isOnlyHomePage = menuBreadcrumbs.length === 1 && menuBreadcrumbs[0]?.path === '/admin';
            const isNotExactMatch = pathname !== '/admin';
            
            // Eğer currentPage.path pathname ile tam eşleşmiyorsa (pathname daha uzunsa), path'ten oluştur
            // Örnek: currentPage.path = "/admin/exam-type", pathname = "/admin/exam-type/123/section/456"
            const isPathnameLonger = currentPage?.path && pathname !== currentPage.path && pathname.startsWith(currentPage.path + '/');
            
            if ((isOnlyHomePage && isNotExactMatch) || isPathnameLonger) {
                const pathBreadcrumbs = generateBreadcrumbsFromPath(pathname);
                return pathBreadcrumbs;
            }
            
            // Eğer menüden breadcrumb bulunduysa ve pathname ile eşleşiyorsa, onu kullan
            if (menuBreadcrumbs.length > 0) {
                return menuBreadcrumbs;
            }
        }

        // Menüde yoksa, path'ten oluştur
        const pathBreadcrumbs = generateBreadcrumbsFromPath(pathname);
        return pathBreadcrumbs;
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
                        {title || currentPage?.title || ''}
                    </h1>

                    {breadcrumbs.length > 0 && (
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
                    )}
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