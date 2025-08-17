
import api from "@/services/api/base-api";
import {UploadedFileDto} from "@/types/exam/miscDtos";
import {EMediaType} from "@/types/exam/enum";
import {ApiResponse} from "@/types/exam/examValidationAndAnalytics";
import {
    BulkUploadResult, CleanupResult,
    FileContentResponse, FileStatistics, UpdateFileMetadataRequest,
    UploadedFileListResponse,
    UploadedFileSearchRequest
} from "@/types/exam/examResponses";


class UploadedFileService {
    private readonly baseUrl = '/files';

    async uploadFile(file: File, documentType?: EMediaType): Promise<ApiResponse<UploadedFileDto>> {
        const formData = new FormData();
        formData.append('file', file);
        if (documentType) {
            formData.append('documentType', documentType);
        }

        const response = await api.post<ApiResponse<UploadedFileDto>>(`${this.baseUrl}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async uploadMultipleFiles(files: File[], documentType?: EMediaType): Promise<ApiResponse<BulkUploadResult>> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        if (documentType) {
            formData.append('documentType', documentType);
        }

        const response = await api.post<ApiResponse<BulkUploadResult>>(`${this.baseUrl}/bulk`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    async getUploadedFileById(id: string): Promise<ApiResponse<UploadedFileDto>> {
        const response = await api.get<ApiResponse<UploadedFileDto>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async downloadFile(id: string): Promise<Blob> {
        const response = await api.get(`${this.baseUrl}/${id}/download`, {
            responseType: 'blob',
        });
        return response.data;
    }

    async getFileContent(id: string): Promise<ApiResponse<FileContentResponse>> {
        const response = await api.get<ApiResponse<FileContentResponse>>(`${this.baseUrl}/${id}/content`);
        return response.data;
    }

    async getUploadedFiles(searchRequest: UploadedFileSearchRequest = {}): Promise<ApiResponse<UploadedFileListResponse>> {
        const params = new URLSearchParams();

        if (searchRequest.fileName) params.append('fileName', searchRequest.fileName);
        if (searchRequest.documentType) params.append('documentType', searchRequest.documentType);
        if (searchRequest.minFileSize) params.append('minFileSize', searchRequest.minFileSize.toString());
        if (searchRequest.maxFileSize) params.append('maxFileSize', searchRequest.maxFileSize.toString());
        if (searchRequest.uploadedAfter) params.append('uploadedAfter', searchRequest.uploadedAfter);
        if (searchRequest.uploadedBefore) params.append('uploadedBefore', searchRequest.uploadedBefore);
        if (searchRequest.page !== undefined) params.append('page', searchRequest.page.toString());
        if (searchRequest.size !== undefined) params.append('size', searchRequest.size.toString());
        if (searchRequest.sortBy) params.append('sortBy', searchRequest.sortBy);
        if (searchRequest.sortDirection) params.append('sortDirection', searchRequest.sortDirection);

        const response = await api.get<ApiResponse<UploadedFileListResponse>>(`${this.baseUrl}?${params}`);
        return response.data;
    }

    async updateFileMetadata(id: string, updateRequest: UpdateFileMetadataRequest): Promise<ApiResponse<UploadedFileDto>> {
        const response = await api.put<ApiResponse<UploadedFileDto>>(`${this.baseUrl}/${id}`, updateRequest);
        return response.data;
    }

    async deleteUploadedFile(id: string): Promise<ApiResponse<void>> {
        const response = await api.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getFileStatistics(): Promise<ApiResponse<FileStatistics>> {
        const response = await api.get<ApiResponse<FileStatistics>>(`${this.baseUrl}/statistics`);
        return response.data;
    }

    async cleanupOrphanedFiles(): Promise<ApiResponse<CleanupResult>> {
        const response = await api.post<ApiResponse<CleanupResult>>(`${this.baseUrl}/cleanup`);
        return response.data;
    }
}

export const uploadedFileService = new UploadedFileService();