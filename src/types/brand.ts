import {EStatus} from "@/types/enumeration";

export interface BrandFormData {
    name: string;
    code?: string;
    description?: string;
    logo?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    taxNumber?: string;
    taxOffice?: string;
    status?: EStatus | null;
    id?: string | null;
    createdAt?: Date | null;
    deletedAt?: Date | null;
}


export interface Brand {
    id: string;
    createdAt: Date | null;
    deletedAt: Date | null;
    status: EStatus | null;
    name: string;
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

export type BrandFormErrors = Partial<Record<keyof BrandFormData, string>>;
