import { useState, useCallback } from 'react';
import {
    UpdateFileMetadataRequest,
    UploadedFileSearchRequest,
    BulkUploadResult,
    FileContentDto,
    UploadedFileListResponse,
    FileStatistics,
    CleanupResult,
    uploadedFileService
} from '@/services/api/exam/upload-file-service';
import { showNotification } from '@/lib/notification';
import {UploadedFileDto} from "@/types/exam/miscDtos";
import {EMediaType} from "@/types/exam/enum";

interface UseUploadedFileReturn {
    uploadedFiles: UploadedFileListResponse | null;
    selectedFile: UploadedFileDto | null;
    bulkUploadResult: BulkUploadResult | null;
    fileContent: FileContentDto | null;
    fileStatistics: FileStatistics | null;
    cleanupResult: CleanupResult | null;
    loading: boolean;
    error: Error | null;
    uploadFile: (file: File, documentType?: EMediaType) => Promise<void>;
    uploadMultipleFiles: (files: File[], documentType?: EMediaType) => Promise<void>;
    getUploadedFileById: (id: string) => Promise<void>;
    downloadFile: (id: string) => Promise<Blob | null>;
    getFileContent: (id: string) => Promise<void>;
    getUploadedFiles: (searchRequest?: UploadedFileSearchRequest) => Promise<void>;
    updateFileMetadata: (id: string, updateRequest: UpdateFileMetadataRequest) => Promise<void>;
    deleteUploadedFile: (id: string) => Promise<void>;
    getFileStatistics: () => Promise<void>;
    cleanupOrphanedFiles: () => Promise<void>;
    clearFileData: () => void;
}

export const useUploadedFile = (): UseUploadedFileReturn => {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFileListResponse | null>(null);
    const [selectedFile, setSelectedFile] = useState<UploadedFileDto | null>(null);
    const [bulkUploadResult, setBulkUploadResult] = useState<BulkUploadResult | null>(null);
    const [fileContent, setFileContent] = useState<FileContentDto | null>(null);
    const [fileStatistics, setFileStatistics] = useState<FileStatistics | null>(null);
    const [cleanupResult, setCleanupResult] = useState<CleanupResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const uploadFile = useCallback(async (file: File, documentType?: EMediaType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.uploadFile(file, documentType);
            if (response.data && response.success) {
                setSelectedFile(response.data);
                showNotification.success('Dosya başarıyla yüklendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya yüklenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const uploadMultipleFiles = useCallback(async (files: File[], documentType?: EMediaType) => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.uploadMultipleFiles(files, documentType);
            if (response.data && response.success) {
                setBulkUploadResult(response.data);
                showNotification.success(`${response.data.successCount} dosya başarıyla yüklendi!`);
                if (response.data.failureCount > 0) {
                    showNotification.warning(`${response.data.failureCount} dosya yüklenemedi!`);
                }
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosyalar yüklenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUploadedFileById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.getUploadedFileById(id);
            if (response.data && response.success) {
                setSelectedFile(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya bilgileri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const downloadFile = useCallback(async (id: string): Promise<Blob | null> => {
        try {
            setLoading(true);
            setError(null);
            const blob = await uploadedFileService.downloadFile(id);
            showNotification.success('Dosya indiriliyor...');
            return blob;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya indirilirken bir hata oluştu!');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getFileContent = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.getFileContent(id);
            if (response.data && response.success) {
                setFileContent(response.data as unknown as FileContentDto);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya içeriği alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getUploadedFiles = useCallback(async (searchRequest: UploadedFileSearchRequest = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.getUploadedFiles(searchRequest);
            if (response.data && response.success) {
                setUploadedFiles(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosyalar alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateFileMetadata = useCallback(async (id: string, updateRequest: UpdateFileMetadataRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.updateFileMetadata(id, updateRequest);
            if (response.data && response.success) {
                setSelectedFile(response.data);
                showNotification.success('Dosya bilgileri başarıyla güncellendi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya bilgileri güncellenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteUploadedFile = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.deleteUploadedFile(id);
            if (response.data && response.success) {
                showNotification.success('Dosya başarıyla silindi!');
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya silinirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const getFileStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.getFileStatistics();
            if (response.data && response.success) {
                setFileStatistics(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya istatistikleri alınırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const cleanupOrphanedFiles = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await uploadedFileService.cleanupOrphanedFiles();
            if (response.data && response.success) {
                setCleanupResult(response.data);
                showNotification.success(`${response.data.orphanedFilesDeleted} dosya temizlendi!`);
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            showNotification.error('Dosya temizliği yapılırken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearFileData = useCallback(() => {
        setUploadedFiles(null);
        setSelectedFile(null);
        setBulkUploadResult(null);
        setFileContent(null);
        setFileStatistics(null);
        setCleanupResult(null);
        setError(null);
    }, []);

    return {
        uploadedFiles,
        selectedFile,
        bulkUploadResult,
        fileContent,
        fileStatistics,
        cleanupResult,
        loading,
        error,
        uploadFile,
        uploadMultipleFiles,
        getUploadedFileById,
        downloadFile,
        getFileContent,
        getUploadedFiles,
        updateFileMetadata,
        deleteUploadedFile,
        getFileStatistics,
        cleanupOrphanedFiles,
        clearFileData
    };
};