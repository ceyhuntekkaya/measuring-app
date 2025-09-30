import {
    LayoutDashboard,
    Settings,
    FileText,
    Home,
    UserCog,
    PenLine,
    Computer,
    SignatureIcon,
    Hotel,
    HousePlugIcon,
    Type,
    Users,
    GaugeCircle,
    BookOpenCheck,
    FileUser,
    BookCheck,
    FileQuestionIcon,
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
/*
 {
            title: 'Başvurular',
            path: '/admin/attends',
            icon: FileUser,
            requiredRoles: ['ADMIN'],
            children:[

            ]
        },
 */
export const adminRoutes: RouteConfig = {
    menuItems: [
        {
            title: 'Ana Sayfa',
            path: '/admin',
            icon: LayoutDashboard,
            requiredRoles: ['ADMIN'],
        },

        {
            title: 'Uygulamalar',
            path: '/',
            icon: BookOpenCheck,
            requiredRoles: ['ADMIN'],
            children:[
                {
                    title: 'Katılımcılar',
                    path: '/admin/candidates',
                    icon: Users,
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Uygulamalar',
                    path: '/admin/applications',
                    icon: PenLine,
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Oturumlar',
                    path: '/admin/sessions',
                    icon: Computer,
                    requiredRoles: ['ADMIN'],
                }

            ]
        },
        {
            title: 'Sınav Hazırlık',
            path: '/admin/pre',
            icon: GaugeCircle,
            requiredRoles: ['ADMIN'],
            children:[
                {
                    title: 'Sınav Tipleri',
                    path: '/admin/exam-type',
                    icon: Type,
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Soru Grupları',
                    path: '/admin/question-group',
                    icon: FileQuestionIcon,
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Sınavlar',
                    path: '/admin/exams',
                    icon: BookCheck,
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Onaylar',
                    path: '/admin/approvals',
                    icon: SignatureIcon,
                    requiredRoles: ['ADMIN'],
                },
            ]
        },
        {
            title: 'Ayarlar',
            path: '/admin/setting',
            icon: Settings,
            requiredRoles: ['ADMIN'],
            children:[
                {
                    title: 'Onay Ayarları',
                    path: '/admin/settings/approval',
                    icon: SignatureIcon,
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Markalar',
                    path: '/admin/brands',
                    icon: Hotel,
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Şubeler',
                    path: '/admin/branches',
                    icon: HousePlugIcon,
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Kullanıcılar',
                    path: '/admin/users',
                    icon: Users,
                    requiredRoles: ['ADMIN'],
                }
            ]
        },
    ]
};

export const appRoutes: RouteConfig = {
    menuItems: [
        {
            title: 'Dashboard',
            path: '/app/orders',
            icon: Home,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['GRADER' , 'SUPERVISOR' , 'MANAGEMENT' , 'IT' , 'AUTHOR_REVIEWER' , 'ADMIN' , 'REVIEWER'],
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
            requiredDepartments: ['GRADER' , 'SUPERVISOR' , 'MANAGEMENT' , 'IT' , 'AUTHOR_REVIEWER' , 'ADMIN' , 'REVIEWER'],
            requiredRoles: ['LEARNER'],
        },
        {
            title: 'Sevkiyatlar',
            path: '/learner/tasks',
            icon: UserCog,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['GRADER' , 'SUPERVISOR' , 'MANAGEMENT' , 'IT' , 'AUTHOR_REVIEWER' , 'ADMIN' , 'REVIEWER'],
            requiredRoles: ['LEARNER'],
        },
        {
            title: 'Raporlar',
            path: '/learner/reports',
            icon: Mail,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['GRADER' , 'SUPERVISOR' , 'MANAGEMENT' , 'IT' , 'AUTHOR_REVIEWER' , 'ADMIN' , 'REVIEWER'],
            requiredRoles: ['LEARNER'],
        },
        {
            title: 'Ayarlar',
            path: '/learner/setting',
            icon: Mail,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['GRADER' , 'SUPERVISOR' , 'MANAGEMENT' , 'IT' , 'AUTHOR_REVIEWER' , 'ADMIN' , 'REVIEWER'],
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
            requiredDepartments: ['GRADER' , 'SUPERVISOR' , 'MANAGEMENT' , 'IT' , 'AUTHOR_REVIEWER' , 'ADMIN' , 'REVIEWER'],
            requiredRoles: ['LEARNER'],
        },
        {
            title: 'Tasks',
            path: '/learner/tasks',
            icon: UserCog,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['GRADER' , 'SUPERVISOR' , 'MANAGEMENT' , 'IT' , 'AUTHOR_REVIEWER' , 'ADMIN' , 'REVIEWER'],
            requiredRoles: ['LEARNER'],
        },
        {
            title: 'Reports',
            path: '/learner/reports',
            icon: Mail,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['GRADER' , 'SUPERVISOR' , 'MANAGEMENT' , 'IT' , 'AUTHOR_REVIEWER' , 'ADMIN' , 'REVIEWER'],
            requiredRoles: ['LEARNER'],
        },
        {
            title: 'Settings',
            path: '/learner/setting',
            icon: Mail,
            requiredPermissions: ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION', 'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'],
            requiredDepartments: ['GRADER' , 'SUPERVISOR' , 'MANAGEMENT' , 'IT' , 'AUTHOR_REVIEWER' , 'ADMIN' , 'REVIEWER'],
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
            requiredDepartments: ['GRADER' , 'SUPERVISOR' , 'MANAGEMENT' , 'IT' , 'AUTHOR_REVIEWER' , 'ADMIN' , 'REVIEWER'],
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