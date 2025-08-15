import {useContext, useCallback} from 'react';
import {AuthContext} from '@/contexts/auth-context';
import {Department, Permission, Role} from '@/types/auth';

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const {user, loading, login, logout, error} = context;


    const hasAnyDepartment = useCallback(
        (department: Department) => {
            if (!user) return false;
            return user.departmentSet.includes(department);
        },
        [user]
    );



    const hasPermission = useCallback(
        (permission: Permission) => {
            if (!user) return false;
            return user.authoritySet.includes(permission);
        },
        [user]
    );

    const hasAnyPermission = useCallback(
        (permissions: Permission[]) => {
            if (!user) return false;
            return permissions.some(permission => user.authoritySet.includes(permission));
        },
        [user]
    );

    const hasAllPermissions = useCallback(
        (permissions: Permission[]) => {
            if (!user) return false;
            return permissions.every(permission => user.authoritySet.includes(permission));
        },
        [user]
    );

    const hasRole = useCallback(
        (role: Role) => {
            if (!user) return false;
            return user.roleSet.includes(role);
        },
        [user]
    );

    const isAuthenticated = useCallback(() => {
        return !!user;
    }, [user]);

    const isAdmin = useCallback(() => {
        if (!user) return false;
        return user.roleSet.includes('ADMIN');
    }, [user]);

    const isLoading = useCallback(() => {
        return loading;
    }, [loading]);

    return {
        user,
        loading,
        login,
        logout,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        isAuthenticated,
        isAdmin,
        isLoading,
        error,
        hasAnyDepartment,
    };
}

export function useProtectedRoute(requiredRole?: string, requiredPermissions: Permission[] = []) {
    const {user, loading, hasAllPermissions} = useAuth();


    const isAuthorized = useCallback(() => {
        if (!user) return false;

        if (!(requiredRole && user.roleSet.some(role => requiredRole.includes(role)))) {
            return false;
        }

        if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
            console.log("requiredPermissions")
            return false;
        }

        return true;
    }, [user, requiredRole, requiredPermissions, hasAllPermissions]);


    return {
        isLoading: loading,
        isAuthorized: isAuthorized(),
        user: user
    };
}

export function usePermissions() {
    const {hasPermission, hasAnyPermission, hasAllPermissions} = useAuth();

    const can = useCallback(
        (permission: Permission) => {
            return hasPermission(permission);
        },
        [hasPermission]
    );

    const canAny = useCallback(
        (permissions: Permission[]) => {
            return hasAnyPermission(permissions);
        },
        [hasAnyPermission]
    );

    const canAll = useCallback(
        (permissions: Permission[]) => {
            return hasAllPermissions(permissions);
        },
        [hasAllPermissions]
    );

    return {
        can,
        canAny,
        canAll,
    };
}