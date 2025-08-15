import {
    LayoutDashboard,
    Settings,
    FileText,
    Home,
    UserCog,
    Mail,
    HelpCircle, LucideIcon
} from 'lucide-react';
import {Department, Permission, Role} from "@/types/auth";

export interface MenuItem {
    title: string;
    path: string;
    icon?: LucideIcon;
    requiredPermissions?: Permission[];
    requiredDepartments?: Department[];
    requiredRoles?: Role[];
    children?: MenuItem[];
    parent?: MenuItem;
}

export interface RouteConfig {
    menuItems: MenuItem[];
}

export const adminRoutes: RouteConfig = {
    menuItems: [
        {
            title: 'Dashboard',
            path: '/admin',
            icon: LayoutDashboard,
            requiredRoles: ['ADMIN'],
        },
        {
            title: 'Courses',
            path: '/admin/course',
            icon: Settings,
            requiredRoles: ['ADMIN'],
        },
        {
            title: 'Exams',
            path: '/admin/exam',
            icon: Settings,
            requiredRoles: ['ADMIN'],
        }


    ]
};

export const appRoutes: RouteConfig = {
    menuItems: [
        {
            title: 'Dashboard',
            path: '/app/orders',
            icon: Home,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['ACCOUNTING', 'SALES', 'MANAGEMENT', 'FINANCE', 'EXTERNAL'],
            requiredRoles: ['USER'],
        }

    ]
};

export const publicRoutes: RouteConfig = {
    menuItems: [
        {
            title: 'Home',
            path: '/',
            icon: Home,

        },
        {
            title: 'About',
            path: '/about',
            icon: FileText
        },
        {
            title: 'Help',
            path: '/help',
            icon: HelpCircle
        }
    ]
};


export const instructorRoutes: RouteConfig = {
    menuItems: [
        {
            title: 'Ana Sayfa',
            path: '/learner',
            icon: Home,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['EXTERNAL'],
            requiredRoles: ['LEARNER'],
        },
        {
            title: 'Sevkiyatlar',
            path: '/learner/tasks',
            icon: UserCog,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['EXTERNAL'],
            requiredRoles: ['LEARNER'],
        },
        {
            title: 'Raporlar',
            path: '/learner/reports',
            icon: Mail,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['EXTERNAL'],
            requiredRoles: ['LEARNER'],
        },
        {
            title: 'Ayarlar',
            path: '/learner/setting',
            icon: Mail,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['EXTERNAL'],
            requiredRoles: ['LEARNER'],
        }
    ]
};


export const observerRoutes: RouteConfig = {
    menuItems: [
        {
            title: 'Dashboard',
            path: '/learner',
            icon: Home,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['EXTERNAL'],
            requiredRoles: ['LEARNER'],
        },
        {
            title: 'Tasks',
            path: '/learner/tasks',
            icon: UserCog,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['EXTERNAL'],
            requiredRoles: ['LEARNER'],
        },
        {
            title: 'Reports',
            path: '/learner/reports',
            icon: Mail,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['EXTERNAL'],
            requiredRoles: ['LEARNER'],
        },
        {
            title: 'Settings',
            path: '/learner/setting',
            icon: Mail,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['EXTERNAL'],
            requiredRoles: ['LEARNER'],
        }
    ]
};


export const learnerRoutes: RouteConfig = {
    menuItems: [
        {
            title: 'Dashboard',
            path: '/learner',
            icon: Home,
            requiredRoles: ['LEARNER'],
        },
        {
            title: 'Chat with AI',
            path: '/learner/ai',
            icon: UserCog,
            requiredRoles: ['LEARNER'],
        }
    ]
};

export const companyRoutes: RouteConfig = {
    menuItems: [
        {
            title: 'Ana Sayfa',
            path: '/company/orders',
            icon: Home,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['EXTERNAL'],
            requiredRoles: ['COMPANY'],
        }
    ]
};

export const getRoutesByRole = (roles: string[]): RouteConfig => {
    if (roles.includes('ADMIN')) return adminRoutes;
    if (roles.includes('USER')) return appRoutes;
    if (roles.includes('LEARNER')) return learnerRoutes;
    if (roles.includes('OBSERVER')) return observerRoutes;
    if (roles.includes('COMPANY')) return companyRoutes;

    return publicRoutes;
};


export const isPathAllowed = (path: string, role: string[]): boolean => {
    const config = getRoutesByRole(role);
    const allPaths = config.menuItems.flatMap(item =>
        item.children
            ? [item.path, ...item.children.map(child => child.path)]
            : [item.path]
    );

    return allPaths.includes(path);
};


export const findMenuItemByPath = (path: string): MenuItem | null => {
    const allRoutes = [adminRoutes, appRoutes, learnerRoutes, observerRoutes, instructorRoutes, companyRoutes, publicRoutes];

    for (const route of allRoutes) {
        const findItem = (items: MenuItem[]): MenuItem | null => {
            for (const item of items) {
                if (item.path === path) {
                    return item;
                }

                if (item.children) {
                    const found = findItem(item.children);
                    if (found) {
                        found.parent = item;
                        return found;
                    }
                }
            }
            return null;
        };

        const found = findItem(route.menuItems);
        if (found) return found;
    }

    return null;
};