import {EStatus} from "@/types/enumeration";
import {User} from "@/types/auth";
import {RecordType} from "@/types/table";

export interface DatabaseObject extends RecordType{
    id: string;
    createdAt: Date | null;
    deletedAt?: Date | null;
    status: EStatus | null;
    createdBy: User | null;
    deletedBy: User | null;
}