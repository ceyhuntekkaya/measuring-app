
// curriculum.service.ts
import api from '../base-api';
import { Curriculum, CurriculumFormData } from "@/types/definition/curriculum";

class CurriculumService {
    private readonly baseUrl = '/curriculum';

    async createCurriculum(curriculum: CurriculumFormData): Promise<Curriculum> {
        const response = await api.post<Curriculum>(`${this.baseUrl}/`, curriculum);
        return response.data;
    }

    async updateCurriculum(curriculumId: string, curriculum: CurriculumFormData): Promise<Curriculum> {
        const response = await api.put<Curriculum>(`${this.baseUrl}/${curriculumId}`, curriculum);
        return response.data;
    }

    async deleteCurriculumById(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    async getCurriculumById(id: string): Promise<Curriculum> {
        const response = await api.get<Curriculum>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getAllCurriculums(): Promise<Curriculum[]> {
        const response = await api.get<Curriculum[]>(`${this.baseUrl}/`);
        return response.data;
    }
}

export const curriculumService = new CurriculumService();