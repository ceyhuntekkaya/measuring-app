'use client';

import * as React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Department, Permission, Role } from "@/types/auth";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
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
            if (!requiredPermissions?.length && !requiredDepartments?.length && !requiredRoles?.length) {
                return true;
            }

            if (!user) return false;

            const hasRequiredPermissions = !requiredPermissions?.length ||
                requiredPermissions.some(perm => hasPermission(perm));

            const hasRequiredDepartments = !requiredDepartments?.length ||
                (user.departmentSet?.length > 0 &&
                    requiredDepartments.some(dept => hasAnyDepartment(dept as Department)));

            const hasRequiredRoles = !requiredRoles?.length ||
                requiredRoles.some(role => user?.roleSet.includes(role));

            return hasRequiredPermissions && hasRequiredDepartments && hasRequiredRoles;
        };

        if (!hasAccess()) {
            return null;
        }

        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700",
            secondary: "bg-gray-600 text-white hover:bg-gray-700",
            outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
            ghost: "bg-transparent hover:bg-gray-100"
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