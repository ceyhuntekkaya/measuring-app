import { DatabaseObject } from "@/types/base";
import { ECurriculumLevel } from "@/types/enumeration";
import { Curriculum } from "@/types/definition/curriculum";

export interface CurriculumContent extends DatabaseObject {
    code: string;
    curriculum: Curriculum | null;
    level: ECurriculumLevel;
    content: string;
    orderNumber: number | null;
    parent: CurriculumContent | null;
    children: CurriculumContent[];
    updatedAt: Date | null;
    version: number | null;
}

export interface CurriculumContentFormData {
    id: string | null;
    code: string;
    curriculumId: string | null;
    level: ECurriculumLevel | null;
    content: string;
    orderNumber: number | null;
    parentId: string | null;
    updatedAt: Date | null;
    version: number | null;
}

export type CurriculumContentFormErrors = Partial<Record<keyof CurriculumContentFormData, string>>;