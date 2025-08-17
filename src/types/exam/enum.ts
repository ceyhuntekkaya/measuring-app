// enums.ts

export type ELogOperation =
    | 'ADD'
    | 'REMOVE'
    | 'CREATE'
    | 'DELETE'
    | 'UPDATE'
    | 'START'
    | 'SUCCESS'
    | 'ERROR'
    | 'COMPLETE'
    | 'END'
    | 'NEW'
    | 'APPROVE'
    | 'REJECT'
    | 'CHANGE';

export type ECurriculumLevel =
    | 'UNIT'
    | 'TOPIC'
    | 'SUB_TOPIC'
    | 'GAIN';

export type ActionType =
    | 'CREATE'
    | 'LIST'
    | 'UPDATE'
    | 'DELETE'
    | 'LOGIN'
    | 'LOGOUT'
    | 'OTHER';

export type Department =
    | 'AUTHOR'
    | 'GRADER'
    | 'SUPERVISOR'
    | 'MANAGEMENT'
    | 'IT'
    | 'AUTHOR_REVIEWER'
    | 'ADMIN'
    | 'REVIEWER';

export type EExamCategory =
    | 'TURKISH';

export type EApprovalType =
    | 'NORMAL'
    | 'REFEREE';

export type EInfoStatus =
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED';

export type EApprovalStatus =
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'EXPIRED';

export type EExamType =
    | 'CERTIFICATE'
    | 'COURSE_EXAM'
    | 'LEVEL_DETERMINATION'
    | 'PRACTICE'
    | 'DEGREE';

export type ELogType =
    | 'INFO'
    | 'ERROR';

// moreEnums.ts

export type EMediaType2 =
    | 'IMAGE'
    | 'VIDEO'
    | 'AUDIO'
    | 'DOCUMENT'
    | 'PDF'
    | 'TEXT'
    | 'OTHER';


export enum EMediaType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    DOCUMENT = "DOCUMENT",
    PDF = "PDF",
    TEXT = "TEXT",
    OTHER = "OTHER"
}

export type EQuestionGroupType =
    | 'LISTENING'
    | 'READING'
    | 'SPEAKING'
    | 'WRITING'
    | 'GRAMMAR'
    | 'VOCABULARY'
    | 'GENERAL';
/*
export type EStatus =
    | 'ACTIVE'
    | 'PASSIVE'
    | 'DELETED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'PENDING'
    | 'SUSPENDED';

 */


export enum EStatus {
    ACTIVE = "ACTIVE",
    PASSIVE = "PASSIVE",
    DELETED = "DELETED",
    WAITING = "WAITING",
    CONFIRMED = "CONFIRMED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
    PENDING = "PENDING",
    SUSPENDED = "SUSPENDED"
}

export type EQuestionGroupTemplateLevel =
    | 'GROUP'
    | 'QUESTION';

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

export type Role =
    | 'USER'
    | 'ADMIN'
    | 'CANDIDATE'
    | 'COMPANY';

export type TokenType =
    | 'BEARER';

export type ObjectType =
    | 'QUESTION'
    | 'QUESTION_GROUP'
    | 'QUESTION_GROUP_TYPE'
    | 'QUESTION_GROUP_HEADER'
    | 'QUESTION_PART'
    | 'UPLOADED_FILE';

export type EQuestionType =
    | 'MULTIPLE_CHOICE'
    | 'TRUE_FALSE'
    | 'FILL_IN_THE_BLANKS'
    | 'SHORT_ANSWER'
    | 'MATCHING'
    | 'ESSAY'
    | 'ORDERING'
    | 'MULTIPLE_RESPONSE'
    | 'HOT_SPOT'
    | 'DRAG_AND_DROP'
    | 'AUDIO_RESPONSE'
    | 'VIDEO_RESPONSE'
    | 'IMAGE_RESPONSE';


