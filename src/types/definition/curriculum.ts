import { DatabaseObject } from "@/types/base";
import { ECourseCategory } from "@/types/enumeration";

export interface Curriculum extends DatabaseObject {
    name: string;
    description: string;
    category: ECourseCategory;
    updatedAt: Date | null;
    version: number | null;
}

export interface CurriculumFormData {
    id: string | null;
    name: string;
    description: string;
    category: ECourseCategory | null;
    updatedAt: Date | null;
    version: number | null;
}

export type CurriculumFormErrors = Partial<Record<keyof CurriculumFormData, string>>;