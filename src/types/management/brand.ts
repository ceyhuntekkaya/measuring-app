// types/management/brandTypes.ts
export interface BrandDto {
    id: string;
    createdAt: string;
    deletedAt?: string;
    status: string;
    createdById?: string;
    deletedById?: string;
    name: string;
    code: string;
    description?: string;
    logo?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    taxNumber?: string;
    taxOffice?: string;
}



export interface Brand {
    id: string;
    createdAt: string;
    deletedAt?: string;
    status: string;
    createdById?: string;
    deletedById?: string;
    name: string;
    code: string;
    description?: string;
    logo?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    taxNumber?: string;
    taxOffice?: string;
}

export interface CreateBrandRequest {
    name: string;
    code: string;
    description?: string;
    logo?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    taxNumber?: string;
    taxOffice?: string;
}

export interface UpdateBrandRequest {
    name?: string;
    code?: string;
    description?: string;
    logo?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    taxNumber?: string;
    taxOffice?: string;
}

export interface BrandStatistics {
    brandId: string;
    totalBranches: number;
    hasBranches: boolean;
}

export interface BrandSummary {
    brand: BrandDto;
    statistics: BrandStatistics;
}

// types/management/branchTypes.ts
export interface BranchDto {
    id: string;
    createdAt: string;
    deletedAt?: string;
    status: string;
    createdById?: string;
    deletedById?: string;
    branchName: string;
    code: string;
    brandId: string;
}

export interface CreateBranchRequest {
    branchName: string;
    code: string;
    brandId: string;
}

export interface UpdateBranchRequest {
    branchName?: string;
    code?: string;
    brandId?: string;
}

export interface BranchStatistics {
    branchId: string;
    brandId: string;
    brandName: string;
}

export interface BrandBranchesSummary {
    brandId: string;
    totalBranches: number;
    branches: BranchDto[];
}

export interface CopyBranchRequest {
    targetBrandId: string;
}

export interface MoveBranchRequest {
    targetBrandId: string;
}

// types/application/applicationTypes.ts
export interface ApplicationDto {
    id: string;
    createdAt: string;
    deletedAt?: string;
    status: string;
    createdById?: string;
    deletedById?: string;
    name: string;
    code: string;
    examId: string;
    examName?: string;
    examSessionId: string;
    examSessionName?: string;
    candidateId: string;
    candidateName?: string;
    candidateLastName?: string;
    candidateIdentityNumber?: string;
    username: string;
    startedAt?: string;
    endedAt?: string;
    isCompleted: boolean;
    isEvaluated: boolean;
}

export interface CreateApplicationRequest {
    name: string;
    code: string;
    examId: string;
    examSessionId: string;
    candidateId: string;
    username?: string;
}

export interface UpdateApplicationRequest {
    name?: string;
    code?: string;
    username?: string;
}

export interface StartApplicationRequest {
    applicationId: string;
    startedAt?: string;
}

export interface CompleteApplicationRequest {
    applicationId: string;
    endedAt?: string;
}

export interface BulkCreateApplicationRequest {
    examSessionId: string;
    examId: string;
    candidateIds: string[];
    namePrefix?: string;
    codePrefix?: string;
}

export interface ApplicationStatistics {
    examSessionId: string;
    totalApplications: number;
    completedApplications: number;
    pendingApplications: number;
    completionRate: number;
}

export interface ExamSessionApplicationsSummary {
    examSessionId: string;
    applications: ApplicationDto[];
    statistics: ApplicationStatistics;
}

export interface ApplicationSearchParams {
    name?: string;
    examSessionId?: string;
    candidateId?: string;
    isCompleted?: boolean;
    isEvaluated?: boolean;
}

// types/application/applicationGraderTypes.ts
export interface ApplicationGraderDto {
    id: string;
    createdAt: string;
    deletedAt?: string;
    status: string;
    createdById?: string;
    deletedById?: string;
    userId: string;
    userName?: string;
    userLastName?: string;
    applicationId: string;
    applicationName?: string;
    endEndDate?: string;
    isCompleted: boolean;
    orderNumber: number;
    isReferee: boolean;
}

export interface CreateApplicationGraderRequest {
    userId: string;
    applicationId: string;
    endEndDate?: string;
    orderNumber: number;
    isReferee?: boolean;
}

export interface UpdateApplicationGraderRequest {
    endEndDate?: string;
    isCompleted?: boolean;
    orderNumber?: number;
    isReferee?: boolean;
}

export interface GraderStatistics {
    applicationId: string;
    totalGraders: number;
    completedGraders: number;
    pendingGraders: number;
    refereeCount: number;
    gradingProgress: number;
}

export interface ApplicationGradingSummary {
    applicationId: string;
    graders: ApplicationGraderDto[];
    referees: ApplicationGraderDto[];
    statistics: GraderStatistics;
}

export interface GraderWorkload {
    userId: string;
    totalAssignments: number;
    completedAssignments: number;
    pendingAssignments: number;
    refereeAssignments: number;
    assignments: ApplicationGraderDto[];
}

export interface GraderSearchParams {
    applicationId?: string;
    userId?: string;
    isCompleted?: boolean;
    isReferee?: boolean;
}

// types/application/candidateTypes.ts
export interface CandidateDto {
    id: string;
    createdAt: string;
    deletedAt?: string;
    status: string;
    createdById?: string;
    deletedById?: string;
    username: string;
    lastLoginTime: string;
    mobilePhone: string;
    gsmPhone?: string;
    email?: string;
    address?: string;
    country?: string;
    city?: string;
    mainTongue?: string;
    fatherName?: string;
    birthPlace?: string;
    birthDate?: string;
    activationCode?: string;
    photoUrl?: string;
    name: string;
    lastName: string;
    identityNumber: string;
    role: string;
}
// types/candidate/candidateTypes.ts
export interface CandidateDto {
    id: string;
    createdAt: string;
    deletedAt?: string;
    status: string;
    createdById?: string;
    deletedById?: string;
    username: string;
    lastLoginTime: string;
    mobilePhone: string;
    gsmPhone?: string;
    email?: string;
    address?: string;
    country?: string;
    city?: string;
    mainTongue?: string;
    fatherName?: string;
    birthPlace?: string;
    birthDate?: string;
    activationCode?: string;
    photoUrl?: string;
    name: string;
    lastName: string;
    identityNumber: string;
    role: string;
}

export interface CreateCandidateRequest {
    username: string;
    password: string;
    mobilePhone: string;
    gsmPhone?: string;
    email?: string;
    address?: string;
    country?: string;
    city?: string;
    mainTongue?: string;
    fatherName?: string;
    birthPlace?: string;
    birthDate?: string;
    photoUrl?: string;
    name: string;
    lastName: string;
    identityNumber: string;
    role?: string;
}

export interface UpdateCandidateRequest {
    username?: string;
    mobilePhone?: string;
    gsmPhone?: string;
    email?: string;
    address?: string;
    country?: string;
    city?: string;
    mainTongue?: string;
    fatherName?: string;
    birthPlace?: string;
    birthDate?: string;
    photoUrl?: string;
    name?: string;
    lastName?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface CandidateStatistics {
    totalCandidates: number;
    activeCandidates: number;
    inactiveCandidates: number;
}

export interface CandidateSearchParams {
    name?: string;
    city?: string;
    country?: string;
    email?: string;
}

