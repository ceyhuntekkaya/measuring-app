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


export enum EApprovalStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED =  'CANCELLED',
    EXPIRED =  'EXPIRED'
}




export enum EExamType {
    CERTIFICATE = 'CERTIFICATE',
    COURSE_EXAM = 'COURSE_EXAM',
    LEVEL_DETERMINATION = 'LEVEL_DETERMINATION',
    PRACTICE =  'PRACTICE',
    DEGREE =  'DEGREE'
}


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


export enum EQuestionGroupType {
    LISTENING = "LISTENING",
    READING = "READING",
    SPEAKING = "SPEAKING",
    WRITING = "WRITING",
    GRAMMAR = "GRAMMAR",
    VOCABULARY = "VOCABULARY",
    GENERAL = "GENERAL"
}


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



export enum EQuestionGroupTemplateLevel {
    GROUP = "GROUP",
    QUESTION = "QUESTION",
}


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

export type EQuestionType2 =
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


export enum EQuestionType {
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
    TRUE_FALSE = "TRUE_FALSE",
    FILL_IN_THE_BLANKS = "FILL_IN_THE_BLANKS",
    SHORT_ANSWER = "SHORT_ANSWER",
    MATCHING = "MATCHING",
    ESSAY = "ESSAY",
    ORDERING = "ORDERING",
    MULTIPLE_RESPONSE = "MULTIPLE_RESPONSE",
    HOT_SPOT = "HOT_SPOT",
    DRAG_AND_DROP = "DRAG_AND_DROP",
    AUDIO_RESPONSE = "AUDIO_RESPONSE",
    VIDEO_RESPONSE = "VIDEO_RESPONSE",
    IMAGE_RESPONSE = "IMAGE_RESPONSE"
}


