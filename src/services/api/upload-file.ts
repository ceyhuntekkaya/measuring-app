import type { UploadedFileDto } from "@/api/generated/model";
import { AXIOS_INSTANCE } from '@/api/axios-instance';

type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data?: T;
    errors?: string[];
    timestamp?: string;
    path?: string;
};

export type DatabaseObjectDto = {
    id?: string;
    createdAt?: string;
    createdBy?: string;
    updatedBy?: string;
};

export interface UploadFileOptions {
    onProgress?: (progress: number) => void;
    onError?: (error: string) => void;
}

/**
 * Upload a single file to the server using Orval's uploadFiles endpoint
 * @param file - File or Blob to upload
 * @param entityId - Entity ID for the upload endpoint (groupId)
 * @param uploadType - Upload type for the upload endpoint (type)
 * @param options - Optional callbacks for progress and error handling
 * @returns Promise<UploadedFileDto[]> - Array with single uploaded file data
 */
export const uploadFile = async (
    file: File | Blob,
    entityId: string,
    uploadType: string,
    options?: UploadFileOptions
): Promise<UploadedFileDto[]> => {
    try {
        const formData = new FormData();

        // If it's a Blob without a name, create a default filename
        if (file instanceof Blob && !(file instanceof File)) {
            const fileName = `audio-${Date.now()}.webm`;
            formData.append('files', file, fileName);
        } else {
            formData.append('files', file);
        }

        // Use AXIOS_INSTANCE directly for progress tracking support
        const response = await AXIOS_INSTANCE.post<ApiResponse<UploadedFileDto[]>>(
            `/upload/${entityId}/${uploadType}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent: { loaded: number; total?: number }) => {
                    if (progressEvent.total && options?.onProgress) {
                        const percentComplete = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        options.onProgress(percentComplete);
                    }
                },
            }
        );

        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        } else {
            const errorMsg = response.data?.message || 'Yükleme başarısız';
            if (options?.onError) {
                options.onError(errorMsg);
            }
            throw new Error(errorMsg);
        }
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Yükleme başlatılırken hata oluştu';
        if (options?.onError) {
            options.onError(errorMsg);
        }
        throw err;
    }
};

/**
 * Upload audio file specifically
 * @param audioBlob - Audio blob to upload
 * @param entityId - Entity ID
 * @param uploadType - Upload type (e.g., 'AUDIO_RESPONSE')
 * @param options - Optional callbacks
 * @returns Promise<UploadedFileDto[]>
 */
export const uploadAudioFile = async (
    audioBlob: Blob,
    entityId: string,
    uploadType: string = 'AUDIO_RESPONSE',
    options?: UploadFileOptions
): Promise<UploadedFileDto[]> => {
    return uploadFile(audioBlob, entityId, uploadType, options);
};

export const uploadVideoFile = async (
      videoBlob: Blob,
       entityId: string,
       uploadType: string = 'VIDEO_RESPONSE',
        options?: UploadFileOptions
) : Promise<UploadedFileDto[]> => {

       return uploadFile(videoBlob, entityId, uploadType, options);
    };