// Permission.ts
export enum Permission {
    APPROVAL = "APPROVAL",
    USER_CREATE = "USER_CREATE",
    GENERAL = "GENERAL",
    FINANCE_OPERATION = "FINANCE_OPERATION",
    ACCOUNTING_OPERATION = "ACCOUNTING_OPERATION",
    DELIVERY_OPERATION = "DELIVERY_OPERATION",
    CUSTOMER_OPERATION = "CUSTOMER_OPERATION",
    OFFER_OPERATION = "OFFER_OPERATION",
    ORDER_OPERATION = "ORDER_OPERATION",
    SUPPLIER_OPERATION = "SUPPLIER_OPERATION",
    TRANSPORTATION_OPERATION = "TRANSPORTATION_OPERATION",
    DELIVERY_DOCUMENT = "DELIVERY_DOCUMENT",
    SETTING = "SETTING"
}

// EStatus.ts
export enum EStatus {
    ACTIVE = "ACTIVE",
    PASSIVE = "PASSIVE",
    DELETED = "DELETED",
    WAITING = "WAITING",
    CONFIRMED = "CONFIRMED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
    IN_PROGRESS = "IN_PROGRESS",
    NOT_STARTED = "NOT_STARTED",
    PENDING = "PENDING",
    SUSPENDED = "SUSPENDED",
    WORKING = "WORKING",
    NEW = "NEW",
    FINISHED = "FINISHED"
}
// EUserLevel.ts
export enum EUserLevel {
    BRAND = "BRAND",
    CAMPUS = "CAMPUS",
    INSTITUTION = "INSTITUTION",
    GENERAL = "GENERAL",
    ADMIN = "ADMIN"
}


// Role.ts
export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    LEARNER = "LEARNER",
    INSTRUCTOR = "INSTRUCTOR",
    OBSERVER = "OBSERVER",
    COMPANY = "COMPANY"
}

// Eğer izinlerle birlikte rol bilgilerini tutmak isterseniz, şu şekilde bir yardımcı nesne de ekleyebilirsiniz:
export const RolePermissions: Record<Role, Permission[]> = {
    [Role.USER]: [Permission.GENERAL],
    [Role.ADMIN]: [Permission.GENERAL],
    [Role.LEARNER]: [Permission.GENERAL],
    [Role.INSTRUCTOR]: [Permission.GENERAL],
    [Role.OBSERVER]: [Permission.GENERAL],
    [Role.COMPANY]: [Permission.GENERAL]
};

// TokenType.ts
export enum TokenType {
    BEARER = "BEARER"
}

// EGrade.ts
export enum EGrade {
    GRADE_1 = "GRADE_1",
    GRADE_2 = "GRADE_2",
    GRADE_3 = "GRADE_3",
    GRADE_4 = "GRADE_4",
    GRADE_5 = "GRADE_5",
    GRADE_6 = "GRADE_6",
    GRADE_7 = "GRADE_7",
    GRADE_8 = "GRADE_8",
    GRADE_9 = "GRADE_9",
    GRADE_10 = "GRADE_10",
    GRADE_11 = "GRADE_11",
    GRADE_12 = "GRADE_12",
    OTHER = "OTHER"
}

// ELogOperation.ts
export enum ELogOperation {
    ADD = "ADD",
    REMOVE = "REMOVE",
    CREATE = "CREATE",
    DELETE = "DELETE",
    UPDATE = "UPDATE",
    START = "START",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    COMPLETE = "COMPLETE",
    END = "END",
    NEW = "NEW",
    APPROVE = "APPROVE",
    REJECT = "REJECT",
    CHANGE = "CHANGE"
}

// ELogType.ts
export enum ELogType {
    INFO = "INFO",
    ERROR = "ERROR"
}

// EMediaType.ts
export enum EMediaType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    DOCUMENT = "DOCUMENT",
    PDF = "PDF",
    TEXT = "TEXT",
    LINK = "LINK",
    OTHER = "OTHER"
}

// ELessonLevel.ts
export enum ELessonLevel {
    UNIT = "UNIT",
    TOPIC = "TOPIC",
    LESSON = "LESSON"
}

// ECourseCategory.ts
export enum ECourseCategory {
    IELTS = "IELTS",
    TOEFL = "TOEFL"
}

// Department.ts
export enum Department {
    ACCOUNTING = "ACCOUNTING",
    FINANCE = "FINANCE",
    MANAGEMENT = "MANAGEMENT",
    SALES = "SALES",
    EXTERNAL = "EXTERNAL"
}

// ActionType.ts
export enum ActionType {
    CREATE = "CREATE",
    LIST = "LIST",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    OTHER = "OTHER"
}

// ECurriculumLevel.ts
export enum ECurriculumLevel {
    UNIT = "UNIT",
    TOPIC = "TOPIC",
    SUB_TOPIC = "SUB_TOPIC",
    GAIN = "GAIN"
}


