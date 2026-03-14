import {
    LayoutDashboard,
    Settings,
    FileText,
    Home,
    UserCog,
    PenLine,
    Computer,
    SignatureIcon,
    Type,
    Users,
    GaugeCircle,
    BookOpenCheck,
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
    isContainer?: boolean; // True if this is just a menu group, not a real page
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
                    title: 'Başvurular',
                    path: '/admin/applications',
                    icon: PenLine,
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Oturumlar',
                    path: '/admin/sessions',
                    icon: Computer,
                    requiredRoles: ['ADMIN'],
                },
                {
                    title: 'Sertifikalar',
                    path: '/admin/certificates',
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
            isContainer: true, // This is just a menu group, not a real page
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
                /*
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

                 */
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

// Path segment'lerinin Türkçe karşılıkları
const pathSegmentLabels: Record<string, string> = {
    'admin': 'Yönetim',
    'exam-type': 'Sınav Tipleri',
    'exam-types': 'Sınav Tipleri',
    'section': 'Bölümler',
    'sections': 'Bölümler',
    'group': 'Gruplar',
    'groups': 'Gruplar',
    'question-group': 'Soru Grupları',
    'question-groups': 'Soru Grupları',
    'candidates': 'Katılımcılar',
    'candidate': 'Katılımcı',
    'applications': 'Uygulamalar',
    'application': 'Uygulama',
    'sessions': 'Oturumlar',
    'session': 'Oturum',
    'exams': 'Sınavlar',
    'exam': 'Sınav',
    'approvals': 'Onaylar',
    'approval': 'Onay',
    'users': 'Kullanıcılar',
    'user': 'Kullanıcı',
    'brands': 'Markalar',
    'brand': 'Marka',
    'branches': 'Şubeler',
    'branch': 'Şube',
    'add': 'Yeni Ekle',
    'edit': 'Düzenle',
    'preview': 'Önizleme',
    'statistics': 'İstatistikler',
    'certificates': 'Sertifikalar',
    'certificate': 'Sertifika',
};

// UUID formatını kontrol et (basit regex)
const isUUID = (str: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

// Path'ten breadcrumb oluştur
export const generateBreadcrumbsFromPath = (path: string): MenuItem[] => {
    const breadcrumbs: MenuItem[] = [];
    const segments = path.split('/').filter(Boolean);
    const seenPaths = new Set<string>();
    let currentPath = '';
    
    for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        
        // UUID ise, atla (breadcrumb'a ekleme)
        if (isUUID(segment)) {
            currentPath += `/${segment}`;
            continue;
        }
        
        currentPath += `/${segment}`;
        
        // Duplicate kontrolü
        if (seenPaths.has(currentPath)) {
            continue;
        }
        seenPaths.add(currentPath);
        
        // Önce menüden eşleşme ara (sadece base path için, dinamik path'ler için değil)
        // Dinamik path'ler (UUID içeren) için menüden eşleşme aramayalım
        const hasUUID = currentPath.split('/').some(s => isUUID(s));
        let menuItem: MenuItem | null = null;
        
        if (!hasUUID) {
            menuItem = findMenuItemByPath(currentPath);
        } 
        
        if (menuItem) {
            // Menüden bulundu, ekle (duplicate kontrolü yap)
            const existingIndex = breadcrumbs.findIndex(b => b.path === menuItem!.path);
            if (existingIndex === -1) {
                breadcrumbs.push(menuItem);
            } 
        } else {
            // Menüde yok veya UUID içeriyor, path segment'inden oluştur
            const label = pathSegmentLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
            
            let title = label;
            if (segment === 'add') {
                if (i > 0) {
                    // Önceki segment'i bul (UUID değilse)
                    let prevIndex = i - 1;
                    while (prevIndex >= 0 && isUUID(segments[prevIndex])) {
                        prevIndex--;
                    }
                    if (prevIndex >= 0) {
                        const prevSegment = segments[prevIndex];
                        const prevLabel = pathSegmentLabels[prevSegment] || prevSegment;
                        title = `Yeni ${prevLabel} Ekle`;
                    }
                }
            } else if (segment === 'edit') {
                if (i > 0) {
                    // Önceki segment'i bul (UUID değilse)
                    let prevIndex = i - 1;
                    while (prevIndex >= 0 && isUUID(segments[prevIndex])) {
                        prevIndex--;
                    }
                    if (prevIndex >= 0) {
                        const prevSegment = segments[prevIndex];
                        const prevLabel = pathSegmentLabels[prevSegment] || prevSegment;
                        title = `${prevLabel} Düzenle`;
                    }
                }
            }
            
            const breadcrumbItem = {
                title,
                path: currentPath,
            };
            breadcrumbs.push(breadcrumbItem);
        }
    }
    
    // Final duplicate kontrolü - aynı path'leri kaldır
    const uniqueBreadcrumbs: MenuItem[] = [];
    const seenFinalPaths = new Set<string>();
    for (const breadcrumb of breadcrumbs) {
        if (!seenFinalPaths.has(breadcrumb.path)) {
            seenFinalPaths.add(breadcrumb.path);
            uniqueBreadcrumbs.push(breadcrumb);
        }
    }
    
    return uniqueBreadcrumbs;
};


export const findMenuItemByPath = (path: string): MenuItem | null => {
    const allRoutes = [adminRoutes, appRoutes, learnerRoutes, observerRoutes, instructorRoutes, companyRoutes, publicRoutes];

    // Helper function to check if a path matches (exact match or starts with for dynamic routes)
    const pathMatches = (menuPath: string, currentPath: string): boolean => {
        if (menuPath === currentPath) {
            return true;
        }
        // For dynamic routes, check if current path starts with menu path followed by /
        // e.g., /admin/exam-type matches /admin/exam-type/123/section/456
        // But NOT /admin matches /admin/exam-type/... (too generic)
        if (menuPath !== '/' && currentPath.startsWith(menuPath + '/')) {
            // Check if this is a root path like /admin - if so, only match if no more specific path exists
            // We'll handle this in findItem by checking children first
            return true;
        }
        return false;
    };
    
    // Helper to find the most specific matching item (longest path match)
    const findMostSpecificMatch = (items: MenuItem[], path: string): MenuItem | null => {
        let bestMatch: MenuItem | null = null;
        let bestMatchLength = 0;
        
        const checkItem = (item: MenuItem): void => {
            if (pathMatches(item.path, path)) {
                const matchLength = item.path.length;
                // Prefer longer (more specific) paths
                // e.g., /admin/exam-type is better than /admin
                if (matchLength > bestMatchLength) {
                    bestMatch = item;
                    bestMatchLength = matchLength;
                }
            }
            
            // Recursively check children
            if (item.children) {
                for (const child of item.children) {
                    checkItem(child);
                }
            }
        };
        
        for (const item of items) {
            checkItem(item);
        }
        
       
        return bestMatch;
    };

    // Helper to find which parent contains this item in its children
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const findParentInRoute = (targetPath: string, items: MenuItem[], _parentItem: MenuItem | null = null): MenuItem | null => {
        for (const item of items) {
            if (item.children) {
                // Check if any child matches the target path
                for (const child of item.children) {
                    if (pathMatches(child.path, targetPath)) {
                        return item;
                    }
                }
                // Recursively check nested children
                const found = findParentInRoute(targetPath, item.children, item);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    };

    // Helper to build parent chain for an item
    const buildParentChain = (item: MenuItem, routeItems: MenuItem[], visited = new Set<string>()): MenuItem => {
        // Prevent infinite loops
        if (visited.has(item.path)) {
            return { ...item };
        }
        visited.add(item.path);

        const itemCopy = { ...item };
        const parent = findParentInRoute(item.path, routeItems);
        if (parent && parent.path !== item.path && !visited.has(parent.path)) {
            itemCopy.parent = buildParentChain(parent, routeItems, visited);
        }
        return itemCopy;
    };

    for (const route of allRoutes) {
        // First, try to find the most specific match
        const mostSpecific = findMostSpecificMatch(route.menuItems, path);
        
        if (mostSpecific) {
            const result = buildParentChain(mostSpecific, route.menuItems);
            return result;
        }
        
        // Fallback to recursive search
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const findItem = (items: MenuItem[], _parentItem: MenuItem | null = null): MenuItem | null => {
            for (const item of items) {
                // First check children for more specific matches
                if (item.children) {
                    const found = findItem(item.children, item);
                    if (found) {
                        // Build parent chain for the found item
                        return buildParentChain(found, route.menuItems);
                    }
                }

                // Then check if this item matches (exact match or if path starts with menu item path for dynamic routes)
                if (pathMatches(item.path, path)) {
                    // Build parent chain for the matched item
                    const result = buildParentChain(item, route.menuItems);
                    return result;
                }
            }
            return null;
        };

        const found = findItem(route.menuItems);
        if (found) {
            return found;
        }
    }

    return null;
};