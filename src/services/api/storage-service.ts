import api from './base-api';

class StorageService {
    private readonly baseUrl = '/storage';

    async uploadFile(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<string>(
            `${this.baseUrl}/upload/file`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    }

    async previewFileAsOctetStream(fileId: string, fileName: string): Promise<Blob> {
        const response = await api.get<Blob>(
            `${this.baseUrl}/preview2/file/${fileId}/${fileName}`,
            {
                responseType: 'blob'
            }
        );
        return response.data;
    }



    async previewFileAsPdf(fileId: string, fileName: string): Promise<Blob> {
        const response = await api.get<Blob>(
            `${this.baseUrl}/preview/file/${fileId}/${fileName}`,
            {
                responseType: 'blob',
                headers: {
                    'Accept': 'application/pdf'
                }
            }
        );
        return response.data;
    }

    async previewFileAsImage(fileId: string, fileName: string): Promise<Blob> {
        const response = await api.get<Blob>(
            `${this.baseUrl}/preview/file/${fileId}/${fileName}`,
            {
                responseType: 'blob',
                headers: {
                    'Accept': 'image/*'
                }
            }
        );
        return response.data;
    }


    async previewFileAsVideo(fileId: string, fileName: string): Promise<Blob> {
        const response = await api.get<Blob>(
            `${this.baseUrl}/preview/file/${fileId}/${fileName}`,
            {
                responseType: 'blob',
                headers: {
                    'Accept': 'video/*'
                }
            }
        );
        return response.data;
    }


    async previewFileAsJPEG(fileId: string, fileName: string): Promise<Blob> {
        const response = await api.get<Blob>(
            `${this.baseUrl}/preview/file/${fileId}/${fileName}`,
            {
                responseType: 'blob',
                headers: {
                    'Accept': 'image/jpeg'
                }
            }
        );
        return response.data;
    }

    async previewFileAsPNG(fileId: string, fileName: string): Promise<Blob> {
        const response = await api.get<Blob>(
            `${this.baseUrl}/preview/file/${fileId}/${fileName}`,
            {
                responseType: 'blob',
                headers: {
                    'Accept': 'image/png'
                }
            }
        );
        return response.data;
    }

    async previewFileAsMP4(fileId: string, fileName: string): Promise<Blob> {
        const response = await api.get<Blob>(
            `${this.baseUrl}/preview/file/${fileId}/${fileName}`,
            {
                responseType: 'blob',
                headers: {
                    'Accept': 'video/mp4'
                }
            }
        );
        return response.data;
    }

    private downloadFile(blob: Blob, fileName: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

}

export const storageService = new StorageService();

