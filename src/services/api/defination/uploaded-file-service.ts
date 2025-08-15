
// uploaded-file.service.ts
import api from '../base-api';
import { UploadedFile, UploadedFileFormData } from "@/types/definition/uploaded-file";

class UploadedFileService {
    private readonly baseUrl = '/uploaded-file';

    async createUploadedFile(file: UploadedFileFormData): Promise<UploadedFile> {
        const response = await api.post<UploadedFile>(`${this.baseUrl}/`, file);
        return response.data;
    }

    async updateUploadedFile(fileId: string, file: UploadedFileFormData): Promise<UploadedFile> {
        const response = await api.put<UploadedFile>(`${this.baseUrl}/${fileId}`, file);
        return response.data;
    }

    async deleteUploadedFileById(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    async getUploadedFileById(id: string): Promise<UploadedFile> {
        const response = await api.get<UploadedFile>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getAllUploadedFiles(): Promise<UploadedFile[]> {
        const response = await api.get<UploadedFile[]>(`${this.baseUrl}/`);
        return response.data;
    }
}

export const uploadedFileService = new UploadedFileService();
