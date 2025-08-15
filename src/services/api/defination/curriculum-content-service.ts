

// curriculum-content.service.ts
import api from '../base-api';
import { CurriculumContent, CurriculumContentFormData } from "@/types/definition/curriculum-content";
import { ECurriculumLevel } from "@/types/enumeration";

class CurriculumContentService {
    private readonly baseUrl = '/curriculum-content';

    async createCurriculumContent(content: CurriculumContentFormData): Promise<CurriculumContent> {
        const response = await api.post<CurriculumContent>(`${this.baseUrl}/`, content);
        return response.data;
    }

    async updateCurriculumContent(contentId: string, content: CurriculumContentFormData): Promise<CurriculumContent> {
        const response = await api.put<CurriculumContent>(`${this.baseUrl}/${contentId}`, content);
        return response.data;
    }

    async deleteCurriculumContentById(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    async getCurriculumContentById(id: string): Promise<CurriculumContent> {
        const response = await api.get<CurriculumContent>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getAllCurriculumContents(): Promise<CurriculumContent[]> {
        const response = await api.get<CurriculumContent[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async updateParent(contentId: string, parentId: string): Promise<CurriculumContent> {
        const response = await api.post<CurriculumContent>(
            `${this.baseUrl}/${contentId}/parent/${parentId}`,
            {}
        );
        return response.data;
    }

    async findByLevel(level: ECurriculumLevel): Promise<CurriculumContent[]> {
        const response = await api.get<CurriculumContent[]>(`${this.baseUrl}/by-level/${level}`);
        return response.data;
    }

    async findByParentId(parentId: string): Promise<CurriculumContent[]> {
        const response = await api.get<CurriculumContent[]>(`${this.baseUrl}/by-parent/${parentId}`);
        return response.data;
    }

    async findTopLevelContents(): Promise<CurriculumContent[]> {
        const response = await api.get<CurriculumContent[]>(`${this.baseUrl}/top-level`);
        return response.data;
    }

    async addChild(parentId: string, childData: CurriculumContentFormData): Promise<CurriculumContent> {
        const response = await api.post<CurriculumContent>(
            `${this.baseUrl}/${parentId}/children`,
            childData
        );
        return response.data;
    }

    async removeChild(parentId: string, childId: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${parentId}/children/${childId}`);
    }

    async updateOrder(id: string, newOrder: number): Promise<CurriculumContent> {
        const response = await api.put<CurriculumContent>(
            `${this.baseUrl}/${id}/order`,
            { orderNumber: newOrder }
        );
        return response.data;
    }

    async moveContentToParent(contentId: string, newParentId: string | null): Promise<CurriculumContent> {
        const response = await api.post<CurriculumContent>(
            `${this.baseUrl}/${contentId}/move`,
            { parentId: newParentId }
        );
        return response.data;
    }

    async hasChildren(id: string): Promise<boolean> {
        const response = await api.get<{ hasChildren: boolean }>(`${this.baseUrl}/${id}/has-children`);
        return response.data.hasChildren;
    }
}

export const curriculumContentService = new CurriculumContentService();

