import {ApplicationDto, Brand, BrandDto, CandidateDto} from "@/types/management/brand";
import {RecordType} from "@/types/ui/table";
import {EStatus} from "@/types/exam/enum";
import {DatabaseObjectDto} from "@/types/exam/miscDtos";
import {EvaluationDto, ExamDto, ExamSessionDto} from "@/types/exam/examEntities";

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




export interface UserDto extends DatabaseObjectDto {

    username: string;
    password: string;
    lastLoginTime: null | string;
    mobilePhone: string;
    activationCode: string;
    name: string;
    lastName: string;
    authoritySet: Permission[];
    departmentSet: Department[];
    brandSet: BrandDto[];
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
    brandSet: BrandDto[];
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


export type EEvaluationStatus = 'NOT_STARTED' | 'EVALUATED' | 'PENDING' | 'CANCELLED' | 'FINISHED' | 'ALL' ;



export interface AuthLearnerResponse {
    accessToken: string;
    refreshToken: string;
    user: CandidateDto;


    examSession: ExamSessionDto;
    exam: ExamDto;
    application: ApplicationDto;
    evaluations: EvaluationDto[];

}






export interface RefreshTokenResponse {

    accessToken?: string | null;
    refreshToken?: string | null;
    user: User | CandidateDto | null;


   // private CandidateDto user;
    examSession?: ExamSessionDto | null;
    exam?: ExamDto | null;
    application?: ApplicationDto | null;
    evaluations?: EvaluationDto[];

}




export interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<boolean>;

    examLogin: (examCode: string) => Promise<boolean>;


    logout: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
    refreshToken: () => Promise<boolean>;
    hasPermission: (permission: Permission) => boolean;
    hasAnyDepartment: (departments: Department[]) => boolean;
    getPathByRole: () => string;
    isAuthenticated: boolean;
    activeBrand: Brand | null;
    changeActiveBrand: (id: string) => boolean;




    candidate: CandidateDto | null;
    examSession: ExamSessionDto | null;
    exam: ExamDto | null;
    application: ApplicationDto | null;
    evaluations: EvaluationDto[] | null;
}



export interface UserSearchRequest {
    username?: string;
    email?: string;
    name?: string;
    lastName?: string;
    mobilePhone?: string;
    identityNumber?: string;
    departments?: Department[];
    roles?: Role[];
    permissions?: Permission[];
    brandIds?: string[];
    lastLoginAfter?: string;
    lastLoginBefore?: string;
    exactMatch?: boolean;
    caseSensitive?: boolean;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
}

// Statistics interface
export interface UserStatistics {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    departmentCounts: Record<Department, number>;
    roleCounts: Record<Role, number>;
}

// Summary interface
export interface UserSummary {
    user: UserDto;
    statistics: UserStatistics;
    isActive: boolean;
    lastSeenDaysAgo?: number;
}

// Password change request
export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

// Password reset request
export interface ResetPasswordRequest {
    email: string;
}

// Pagination response interface
export interface PaginatedResponse<T> {
    content: T[];           // Sayfa içeriği
    totalElements: number;  // Toplam eleman sayısı
    totalPages: number;     // Toplam sayfa sayısı
    size: number;          // Sayfa boyutu
    number: number;        // Mevcut sayfa numarası
    first: boolean;        // İlk sayfa mı?
    last: boolean;         // Son sayfa mı?
    numberOfElements: number; // Bu sayfadaki eleman sayısı
    empty: boolean;        // Sayfa boş mu?
}

// User filter options for UI components
export interface UserFilterOptions {
    departments: Department[];
    roles: Role[];
    permissions: Permission[];
    brands: BrandDto[];
    searchTerm?: string;
    isActive?: boolean;
    dateRange?: {
        start: string;
        end: string;
    };
}

// User table row interface for data grid components
export interface UserTableRow {
    id: string;
    username: string;
    email: string;
    fullName: string;
    departmentNames: string[];
    roleNames: string[];
    lastLoginTime?: string;
    isActive: boolean;
    brandNames: string[];
}

// User profile interface for user detail pages
export interface UserProfile extends UserDto {
    fullName: string;
    displayRoles: string[];
    displayDepartments: string[];
    displayPermissions: string[];
    displayBrands: string[];
    isActiveUser: boolean;
    daysSinceLastLogin?: number;
}

// User creation wizard steps
export interface UserCreationStep {
    step: number;
    title: string;
    description: string;
    isCompleted: boolean;
    isActive: boolean;
    fields: string[];
}

// User bulk operation result
export interface UserBulkOperationResult {
    successful: UserDto[];
    failed: {
        data: UserFormData;
        error: string;
    }[];
    totalProcessed: number;
    successCount: number;
    failureCount: number;
}

// User activity log entry
export interface UserActivityLog {
    id: string;
    userId: string;
    action: string;
    timestamp: string;
    ipAddress?: string;
    userAgent?: string;
    details?: Record<string, string>;
}

// User preferences interface
export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    dateFormat: string;
    timeFormat: '12h' | '24h';
}

// User session interface
export interface UserSession {
    userId: string;
    username: string;
    fullName: string;
    email: string;
    roles: Role[];
    permissions: Permission[];
    departments: Department[];
    brands: BrandDto[];
    lastActivity: string;
    expiresAt: string;
    isActive: boolean;
}

// User export options
export interface UserExportOptions {
    format: 'xlsx' | 'csv' | 'pdf';
    fields: (keyof UserDto)[];
    filters?: UserSearchRequest;
    includeStatistics: boolean;
    fileName?: string;
}

// User import result
export interface UserImportResult {
    imported: UserDto[];
    skipped: {
        row: number;
        data: string;
        reason: string;
    }[];
    errors: {
        row: number;
        data: string;
        error: string;
    }[];
    totalRows: number;
    importedCount: number;
    skippedCount: number;
    errorCount: number;
}