'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { findMenuItemByPath, MenuItem } from '@/config/routes';

interface PageHeaderProps {
    actions?: React.ReactNode;
}

export default function PageHeader({ actions }: PageHeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const currentPage = findMenuItemByPath(pathname);

    const getBreadcrumbs = (menuItem: MenuItem | null): MenuItem[] => {
        const breadcrumbs: MenuItem[] = [];
        let current = menuItem;

        while (current?.parent) {
            breadcrumbs.unshift(current.parent);
            current = current.parent;
        }

        if (menuItem) {
            breadcrumbs.push(menuItem);
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs(currentPage);

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
                        {currentPage?.title || ''}
                    </h1>

                    <div className="flex items-center mt-1 text-sm text-gray-500">
                        {breadcrumbs.map((item, index) => (
                            <div key={item.path} className="flex items-center">
                                {index > 0 && (
                                    <ChevronRight className="h-4 w-4 mx-2" />
                                )}
                                <Link
                                    href={item.path}
                                    className="hover:text-gray-700"
                                >
                                    {item.title}
                                </Link>
                            </div>
                        ))}
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