
import api from '../base-api';
import { AcademicYear, AcademicYearFormData } from "@/types/definition/academic-year";

class AcademicYearService {
    private readonly baseUrl = '/academic-year';

    async createAcademicYear(academicYear: AcademicYearFormData): Promise<AcademicYear> {
        const response = await api.post<AcademicYear>(`${this.baseUrl}/`, academicYear);
        return response.data;
    }

    async updateAcademicYear(academicYearId: string, academicYear: AcademicYearFormData): Promise<AcademicYear> {
        const response = await api.put<AcademicYear>(`${this.baseUrl}/${academicYearId}`, academicYear);
        return response.data;
    }

    async deleteAcademicYearById(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    async getAcademicYearById(id: string): Promise<AcademicYear> {
        const response = await api.get<AcademicYear>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getAllAcademicYears(): Promise<AcademicYear[]> {
        const response = await api.get<AcademicYear[]>(`${this.baseUrl}/`);
        return response.data;
    }
}

export const academicYearService = new AcademicYearService();