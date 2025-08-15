import { DatabaseObject } from "@/types/base";

export interface AcademicYear extends DatabaseObject {
    name: string;
    startDate: Date;
    endDate: Date;
}

export interface AcademicYearFormData {
    id: string | null;
    name: string;
    startDate: Date;
    endDate: Date;
}

export type AcademicYearFormErrors = Partial<Record<keyof AcademicYearFormData, string>>;