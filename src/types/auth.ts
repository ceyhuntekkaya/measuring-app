import {Brand} from "@/types/management/brand";
import {RecordType} from "@/types/ui/table";
import {EStatus} from "@/types/exam/enum";

export type Role = 'ADMIN' | 'USER' | 'LEARNER' | 'INSTRUCTOR' | 'OBSERVER' | 'COMPANY';

export interface DatabaseObject extends RecordType{
    id: string;
    createdAt: Date | null;
    deletedAt?: Date | null;
    status: EStatus | null;
    createdBy: User | null;
    deletedBy: User | null;
}

export interface Authority {
    authority: string;
}

export type Department = 'ACCOUNTING' | 'FINANCE' | 'MANAGEMENT' | 'SALES' | 'EXTERNAL';

export const DepartmentList: Record<Department, string> = {
    ACCOUNTING: 'ACCOUNTING',
    FINANCE: 'FINANCE',
    MANAGEMENT: 'MANAGEMENT',
    SALES: 'SALES',
    EXTERNAL: 'EXTERNAL'
};




export type Permission =
    | 'APPROVAL'
    | 'USER_CREATE'
    | 'GENERAL'
    | 'FINANCE_OPERATION'
    | 'ACCOUNTING_OPERATION'
    | 'DELIVERY_OPERATION'
    | 'CUSTOMER_OPERATION'
    | 'OFFER_OPERATION'
    | 'ORDER_OPERATION'
    | 'SUPPLIER_OPERATION'
    | 'TRANSPORTATION_OPERATION'
    | 'DELIVERY_DOCUMENT'
    | 'SETTING';

export const PermissionList: Record<Permission, string> = {
    APPROVAL: 'APPROVAL',
    USER_CREATE: 'USER_CREATE',
    GENERAL: 'GENERAL',
    FINANCE_OPERATION: 'FINANCE_OPERATION',
    ACCOUNTING_OPERATION: 'ACCOUNTING_OPERATION',
    DELIVERY_OPERATION: 'DELIVERY_OPERATION',
    CUSTOMER_OPERATION: 'CUSTOMER_OPERATION',
    OFFER_OPERATION: 'OFFER_OPERATION',
    ORDER_OPERATION: 'ORDER_OPERATION',
    SUPPLIER_OPERATION: 'SUPPLIER_OPERATION',
    TRANSPORTATION_OPERATION: 'TRANSPORTATION_OPERATION',
    DELIVERY_DOCUMENT: 'DELIVERY_DOCUMENT',
    SETTING: 'SETTING'
};

export interface User extends DatabaseObject{
    username: string;
    lastLoginTime: null | string;
    mobilePhone: string;
    activationCode: string;
    name: string;
    lastName: string;
    token: null | string;
    authoritySet: Permission[];
    departmentSet: Department[];
    roleSet: Role[];
    brandSet: Brand[];
    enabled: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;
    accountNonExpired: boolean;
    email: string;
    identityNumber?: string | null;
    connectionId?: string | null;
}




export interface UserDto {
    id: string;
    createdAt: number;
    deletedAt: null | number;
    status: string;
    username: string;
    password: string;
    lastLoginTime: null | string;
    mobilePhone: string;
    activationCode: string;
    name: string;
    lastName: string;
    authoritySet: Permission[];
    departmentSet: Department[];
    brandSet: Brand[];
    roleSet: Role[];
    enabled: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;
    accountNonExpired: boolean;
    email: string;
    identityNumber?: string | null;
    connectionId?: string | null;
}


export interface UserFormData {
    id: string;
    createdAt: number;
    deletedAt: null | number;
    status: string;
    username: string;
    password: string;
    lastLoginTime: null | string;
    mobilePhone: string;
    activationCode: string;
    name: string;
    lastName: string;
    authoritySet: Permission[];
    departmentSet: Department[];
    brandSet: Brand[];
    roleSet: Role[];
    enabled: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;
    accountNonExpired: boolean;
    email: string;
    identityNumber?: string | null;
    connectionId?: string | null;
}



export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
    refreshToken: () => Promise<boolean>;
    hasPermission: (permission: Permission) => boolean;
    hasAnyDepartment: (departments: Department[]) => boolean;
    getPathByRole: () => string;
    isAuthenticated: boolean;
    activeBrand: Brand | null;
    changeActiveBrand: (id: string) => boolean;
}