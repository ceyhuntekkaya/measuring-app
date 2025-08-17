import {DatabaseObjectDto} from "@/types/exam/miscDtos";
import {EStatus} from "@/types/exam/enum";

export interface BrandDto extends DatabaseObjectDto {
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

export interface BranchDto extends DatabaseObjectDto{
    branchName: string;
    code?: string;
    brand?: BrandDto;
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

export type BrandFormErrors = Partial<Record<keyof BrandDto, string>>;
