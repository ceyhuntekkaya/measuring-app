import {Department, Permission, Role, User} from "@/types/auth";


export interface DataContextType {
    users: User[] | null;
    loading: boolean;
    error: string | null;
    permissions: Permission[];
    departments: Department[];
    roles: Role[];
}