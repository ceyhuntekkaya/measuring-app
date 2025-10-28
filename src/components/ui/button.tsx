'use client';

import * as React from "react";

// --- Mock Authentication ---
// Gerçek bir uygulamada, bunlar harici dosyalardan içe aktarılır.
// Bu component'in kendi kendine çalışabilmesi için burada sahte veriler oluşturulmuştur.

// Normalde "@/types/auth" dosyasından gelecek olan sahte tipler
type Permission = 'edit:post' | 'delete:post' | 'view:dashboard';
type Department = 'engineering' | 'marketing' | 'sales';
type Role = 'admin' | 'editor' | 'viewer';

// Sahte kullanıcı verisi
const mockUser = {
    id: '123',
    name: 'Mock User',
    departmentSet: ['engineering' as Department],
    roleSet: ['admin' as Role],
    permissionSet: ['edit:post', 'view:dashboard' as Permission]
};

// Normalde "@/hooks/use-auth" dosyasından gelecek olan sahte hook
const useAuth = () => {
    const user = mockUser; // Test için her zaman sahte kullanıcıyı döndürür

    const hasPermission = (permission: Permission): boolean => {
        if (!user) return false;
        return user.permissionSet.includes(permission);
    };

    const hasAnyDepartment = (department: Department): boolean => {
        if (!user) return false;
        return user.departmentSet.includes(department);
    };

    return { user, hasPermission, hasAnyDepartment };
};

// --- Button Component ---

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
    size?: "sm" | "md" | "lg";
    requiredPermissions?: Permission[];
    requiredDepartments?: Department[];
    requiredRoles?: Role[];
    className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
         className = "",
         variant = "primary",
         size = "md",
         requiredPermissions,
         requiredDepartments,
         requiredRoles,
         ...props
     }, ref) => {
        const { hasPermission, hasAnyDepartment, user } = useAuth();

        const hasAccess = (): boolean => {
            // Eğer herhangi bir yetki, departman veya rol gerekmiyorsa, erişim izni ver.
            if (!requiredPermissions?.length && !requiredDepartments?.length && !requiredRoles?.length) {
                return true;
            }

            // Kullanıcı yoksa erişim izni verme.
            if (!user) return false;

            // Gerekli izinlerin kontrolü
            const hasRequiredPermissions = !requiredPermissions?.length ||
                requiredPermissions.some(perm => hasPermission(perm));

            // Gerekli departmanların kontrolü
            const hasRequiredDepartments = !requiredDepartments?.length ||
                (user.departmentSet?.length > 0 &&
                    requiredDepartments.some(dept => hasAnyDepartment(dept as Department)));

            // Gerekli rollerin kontrolü
            console.log("ceyhun 14")
            const hasRequiredRoles = !requiredRoles?.length ||
                requiredRoles.some(role => user?.roleSet.includes(role));

            return hasRequiredPermissions && hasRequiredDepartments && hasRequiredRoles;
        };

        // Kullanıcının erişimi yoksa butonu render etme.
        if (!hasAccess()) {
            return null;
        }

        // Stil tanımlamaları
        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700",
            secondary: "bg-gray-600 text-white hover:bg-gray-700",
            outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50",
            ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
            destructive: "bg-red-600 text-white hover:bg-red-700"
        };

        const sizes = {
            sm: "h-8 px-3 text-sm",
            md: "h-10 px-4",
            lg: "h-12 px-6 text-lg"
        };

        return (
            <button
                className={`
          inline-flex items-center justify-center rounded-md font-medium
          transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:pointer-events-none disabled:opacity-50
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button };
