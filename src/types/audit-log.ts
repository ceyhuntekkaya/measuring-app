import {ActionType} from "@/types/enumeration";
import {DatabaseObject} from "@/types/base";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface AuditLog  extends DatabaseObject {
    userId: string;
    username: string;
    actionType: ActionType;
    entityType: string;
    entityId: string;
    oldValue: string;
    newValue: string;
    ipAddress: string;
    userAgent: string;
}

