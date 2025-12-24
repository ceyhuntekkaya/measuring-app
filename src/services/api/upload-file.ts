import siteConfig from '@/config/config.json';
import {UploadedFileDto} from "@/types/exam/miscDtos";

const API_URL = siteConfig.api.invokeUrl;

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
 * Upload a single file to the server
 * @param file - File or Blob to upload
 * @param entityId - Entity ID for the upload endpoint
 * @param uploadType - Upload type for the upload endpoint
 * @param options - Optional callbacks for progress and error handling
 * @returns Promise<UploadedFileDto[]> - Array with single uploaded file data
 */
export const uploadFile = async (
    file: File | Blob,
    entityId: string,
    uploadType: string,
    options?: UploadFileOptions
): Promise<UploadedFileDto[]> => {
    return new Promise((resolve, reject) => {
        try {
            const formData = new FormData();

            // If it's a Blob without a name, create a default filename
            if (file instanceof Blob && !(file instanceof File)) {
                const fileName = `audio-${Date.now()}.webm`;
                formData.append('files', file, fileName);
            } else {
                formData.append('files', file);
            }

            const xhr = new XMLHttpRequest();

            // Progress tracking
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && options?.onProgress) {
                    const percentComplete = Math.round((e.loaded / e.total) * 100);
                    options.onProgress(percentComplete);
                }
            });

            // Success handler
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const response: UploadedFileDto[] = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch (e) {
                        const errorMsg = `Sunucu yanıtı işlenirken hata oluştu: ${e}`;
                        if (options?.onError) {
                            options.onError(errorMsg);
                        }
                        reject(new Error(errorMsg));
                    }
                } else {
                    const errorMsg = `Yükleme hatası: ${xhr.status} - ${xhr.statusText}`;
                    if (options?.onError) {
                        options.onError(errorMsg);
                    }
                    reject(new Error(errorMsg));
                }
            });

            // Error handler
            xhr.addEventListener('error', () => {
                const errorMsg = 'Yükleme sırasında bir hata oluştu.';
                if (options?.onError) {
                    options.onError(errorMsg);
                }
                reject(new Error(errorMsg));
            });

            // Abort handler
            xhr.addEventListener('abort', () => {
                const errorMsg = 'Yükleme iptal edildi.';
                if (options?.onError) {
                    options.onError(errorMsg);
                }
                reject(new Error(errorMsg));
            });

            // Open connection
            xhr.open('POST', `${API_URL}/upload/${entityId}/${uploadType}`);

            // Set authorization header
            const token = localStorage.getItem('accessToken');
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }

            // Send request
            xhr.send(formData);

        } catch (err) {
            const errorMsg = `Yükleme başlatılırken hata oluştu: ${err}`;
            if (options?.onError) {
                options.onError(errorMsg);
            }
            reject(new Error(errorMsg));
        }
    });
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