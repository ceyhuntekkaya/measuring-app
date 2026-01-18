import type {ApplicationDto} from "@/api/generated/model/applicationDto";
import type {CandidateDto} from "@/api/generated/model/candidateDto";
import type {BrandDto} from "@/api/generated/model";
import type {EvaluationDto} from "@/api/generated/model";
import type {ExamDto} from "@/api/generated/model/examDto";
import type {ExamSessionDto} from "@/api/generated/model/examSessionDto";
import type {UserDto} from "@/api/generated/model/userDto";

// Custom types - these are still needed for type safety in the app
export type Role = 'ADMIN' | 'USER' | 'LEARNER' | 'INSTRUCTOR' | 'OBSERVER' | 'COMPANY';

export type Department = 'GRADER' | 'SUPERVISOR' | 'MANAGEMENT' | 'IT' | 'AUTHOR_REVIEWER' | 'ADMIN' | 'REVIEWER';

export const DepartmentList: Record<Department, string> = {
    GRADER: 'GRADER',
    SUPERVISOR: 'SUPERVISOR',
    MANAGEMENT: 'MANAGEMENT',
    IT: 'IT',
    AUTHOR_REVIEWER: 'AUTHOR_REVIEWER',
    ADMIN: 'ADMIN',
    REVIEWER: 'REVIEWER'
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

// Helper type aliases for better type safety
// Use UserDto from ORVAL instead of custom User interface
export type User = UserDto;

// Helper functions to safely convert ORVAL types to custom types
export function getUserRoles(user: UserDto | null | undefined): Role[] {
    if (!user?.roleSet) return [];
    return user.roleSet?.filter((role): role is Role => 
        ['ADMIN', 'USER', 'LEARNER', 'INSTRUCTOR', 'OBSERVER', 'COMPANY'].includes(role as Role)
    ) as Role[];
}

export function getUserDepartments(user: UserDto | null | undefined): Department[] {
    if (!user?.departmentSet) return [];
    return user.departmentSet.filter((dept): dept is Department =>
        ['GRADER', 'SUPERVISOR', 'MANAGEMENT', 'IT', 'AUTHOR_REVIEWER', 'ADMIN', 'REVIEWER'].includes(dept as Department)
    ) as Department[];
}

export function getUserPermissions(user: UserDto | null | undefined): Permission[] {
    if (!user?.authoritySet) return [];
    return user.authoritySet.filter((perm): perm is Permission =>
        ['APPROVAL', 'USER_CREATE', 'GENERAL', 'FINANCE_OPERATION', 'ACCOUNTING_OPERATION', 
         'DELIVERY_OPERATION', 'CUSTOMER_OPERATION', 'OFFER_OPERATION', 'ORDER_OPERATION',
         'SUPPLIER_OPERATION', 'TRANSPORTATION_OPERATION', 'DELIVERY_DOCUMENT', 'SETTING'].includes(perm as Permission)
    ) as Permission[];
}

// Helper functions to check roles, departments, permissions safely
export function hasRole(user: UserDto | null | undefined, role: Role): boolean {
    return getUserRoles(user).includes(role);
}

export function hasDepartment(user: UserDto | null | undefined, department: Department): boolean {
    return getUserDepartments(user).includes(department);
}

export function hasPermission(user: UserDto | null | undefined, permission: Permission): boolean {
    return getUserPermissions(user).includes(permission);
}

export type EEvaluationStatus = 'NOT_STARTED' | 'EVALUATED' | 'PENDING' | 'CANCELLED' | 'FINISHED' | 'ALL';

export interface RefreshTokenResponse {
    accessToken?: string | null;
    refreshToken?: string | null;
    user: UserDto | CandidateDto | null;
    examSession?: ExamSessionDto | null;
    exam?: ExamDto | null;
    application?: ApplicationDto | null;
    evaluations?: EvaluationDto[];
}

export interface AuthContextType {
    user: UserDto | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    examLogin: (examCode: string) => Promise<boolean>;
    logout: () => Promise<void>;
    updateUser: (userData: Partial<UserDto>) => void;
    refreshToken: () => Promise<boolean>;
    hasPermission: (permission: Permission) => boolean;
    hasAnyDepartment: (departments: Department[]) => boolean;
    getPathByRole: () => string;
    isAuthenticated: boolean;
    activeBrand: BrandDto | null;
    changeActiveBrand: (id: string) => boolean;
    candidate: CandidateDto | null;
    examSession: ExamSessionDto | null;
    exam: ExamDto | null;
    application: ApplicationDto | null;
    evaluations: EvaluationDto[] | null;
}
