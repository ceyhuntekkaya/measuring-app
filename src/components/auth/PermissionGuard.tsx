import {Permission} from "@/types/auth";
import {ReactNode} from "react";
import {useAuth} from "@/hooks/use-auth";

interface PermissionGuardProps {
    permission: Permission;
    children: ReactNode;
}

export function PermissionGuard({ permission, children }: PermissionGuardProps) {
    const { hasPermission } = useAuth();

    if (!hasPermission(permission)) {
        return null;
    }

    return <>{children}</>;
}