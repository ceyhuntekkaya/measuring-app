'use client';

import * as React from "react";
import {Label} from "@/components/ui/label";
import {Alert, AlertDescription} from "@/components/ui/alert";
import siteConfig from '@/config/config.json';
import {Progress} from "@/components/ui/progress";

const API_URL = siteConfig.api.invokeUrl;

type FileType = 'image' | 'video' | 'pdf' | 'file';

interface UploadedFile {
    fileName:string;
    originalFileName:string;
    fileUrl:string;
    thumbnailUrl:string;
    fileSizeBytes:number;
    mimeType:number;
    mediaType:string;
    width:number;
    height:number;
    durationSeconds:number;
    uploadId:string;
    isProcessed:boolean;
    processingError:string;
    id:number;
}

export interface FileUploadProps {
    acceptedFileTypes?: FileType[];
    maxFileSize?: number; // MB cinsinden
    maxFiles?: number;
    multiple?: boolean;
    onUploadComplete?: (files: UploadedFile[]) => void;
    labelText?: string;
    error?: boolean;
    errorText?: string;
    className?: string;
    id?: string;
    schoolId: string;
    uploadType: string
}

interface FileWithPreview {
    file: File;
    preview: string;
    id: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
                                                   acceptedFileTypes = ['image', 'video', 'pdf'],
                                                   maxFileSize = 10, // default 10MB
                                                   maxFiles = 10,
                                                   multiple = true,
                                                   onUploadComplete,
                                                   labelText = "Dosya Yükle",
                                                   error = false,
                                                   errorText,
                                                   className = "",
                                                   id = "file-upload",
                                                   schoolId,
                                                   uploadType
                                               }) => {
    const [selectedFiles, setSelectedFiles] = React.useState<FileWithPreview[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [localError, setLocalError] = React.useState<string>("");
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // FileType'ı accept string'ine çevir
    const getAcceptString = () => {
        const acceptMap: Record<FileType, string> = {
            image: 'image/*',
            video: 'video/*',
            pdf: 'application/pdf',
            file: '*/*'
        };

        return acceptedFileTypes.map(type => acceptMap[type]).join(',');
    };

    // Dosya boyutunu kontrol et
    const validateFileSize = (file: File): boolean => {
        const maxSizeInBytes = maxFileSize * 1024 * 1024 * maxFileSize;
        return file.size <= maxSizeInBytes;
    };

    // Dosya tipini kontrol et
    const validateFileType = (file: File): boolean => {
        if (acceptedFileTypes.includes('file')) return true;

        const fileType = file.type;

        for (const type of acceptedFileTypes) {
            if (type === 'image' && fileType.startsWith('image/')) return true;
            if (type === 'video' && fileType.startsWith('video/')) return true;
            if (type === 'pdf' && fileType === 'application/pdf') return true;
        }

        return false;
    };

    // Preview URL oluştur
    const createPreview = (file: File): string => {
        if (file.type.startsWith('image/')) {
            return URL.createObjectURL(file);
        } else if (file.type.startsWith('video/')) {
            return URL.createObjectURL(file);
        } else if (file.type === 'application/pdf') {
            return '/pdf-icon.svg'; // PDF ikonu göster
        }
        return '/file-icon.svg'; // Genel dosya ikonu
    };

    // Dosyaları işle
    const handleFiles = (files: FileList | null) => {
        if (!files) return;

        setLocalError("");
        const fileArray = Array.from(files);

        // Maksimum dosya sayısı kontrolü
        if (!multiple && fileArray.length > 1) {
            setLocalError("Sadece bir dosya seçebilirsiniz.");
            return;
        }

        if (selectedFiles.length + fileArray.length > maxFiles) {
            setLocalError(`En fazla ${maxFiles} dosya yükleyebilirsiniz.`);
            return;
        }

        // Her dosyayı kontrol et
        const validFiles: FileWithPreview[] = [];
        const errors: string[] = [];

        for (const file of fileArray) {
            if (!validateFileSize(file)) {
                errors.push(`${file.name} dosyası çok büyük (max ${maxFileSize}MB)`);
                continue;
            }

            if (!validateFileType(file)) {
                errors.push(`${file.name} desteklenmeyen dosya tipi`);
                continue;
            }

            validFiles.push({
                file,
                preview: createPreview(file),
                id: Math.random().toString(36).substr(2, 9)
            });
        }

        if (errors.length > 0) {
            setLocalError(errors.join(', '));
        }

        if (validFiles.length > 0) {
            setSelectedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
        }
    };

    // Dosya seçimi
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    // Drag & Drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    // Dosya sil
    const removeFile = (fileId: string) => {
        setSelectedFiles(prev => {
            const updated = prev.filter(f => f.id !== fileId);
            // Preview URL'i temizle
            const fileToRemove = prev.find(f => f.id === fileId);
            if (fileToRemove && fileToRemove.file.type.startsWith('image/')) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
            return updated;
        });
    };

    // Dosyaları yükle
    const uploadFiles = async () => {
        if (selectedFiles.length === 0) {
            setLocalError("Lütfen en az bir dosya seçin.");
            return;
        }
        setIsUploading(true);
        setUploadProgress(0);
        setLocalError("");

        try {
            const formData = new FormData();
            selectedFiles.forEach(({file}) => {
                formData.append('files', file);
            });

            // XMLHttpRequest ile progress tracking
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const progress = Math.round((e.loaded / e.total) * 100);
                    setUploadProgress(progress);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const response: UploadedFile[] = JSON.parse(xhr.responseText);

                        // Preview URL'lerini temizle
                        selectedFiles.forEach(({preview, file}) => {
                            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                                URL.revokeObjectURL(preview);
                            }
                        });

                        setSelectedFiles([]);
                        setUploadProgress(0);
                        onUploadComplete?.(response);
                    } catch (parseError) {
                        console.error(parseError);
                        setLocalError("Sunucu yanıtı işlenirken hata oluştu.");
                    }
                } else {
                    setLocalError(`Yükleme başarısız: ${xhr.statusText}`);
                }
                setIsUploading(false);
            });

            xhr.addEventListener('error', () => {
                setLocalError("Yükleme sırasında bir hata oluştu.");
                setIsUploading(false);
            });
            xhr.open('POST', `${API_URL}/upload/` + schoolId + "/" + uploadType);
            xhr.send(formData);

        } catch (err) {
            console.log(err);
            setLocalError("Yükleme sırasında bir hata oluştu.");
            setIsUploading(false);
        }
    };

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            selectedFiles.forEach(({preview, file}) => {
                if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [selectedFiles]);

    return (
        <div className={`w-full ${className}`}>
            <Label htmlFor={id}>{labelText}</Label>

            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`
          mt-2 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-500' : ''}
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    id={id}
                    className="hidden"
                    accept={getAcceptString()}
                    multiple={multiple}
                    onChange={handleFileSelect}
                    disabled={isUploading}
                />

                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                >
                    <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

                <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">Dosya seçin</span> veya sürükleyip bırakın
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    {acceptedFileTypes.map(type => type.toUpperCase()).join(', ')} • Maks {maxFileSize}MB
                    {multiple && ` • En fazla ${maxFiles} dosya`}
                </p>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-700">
                            Seçili Dosyalar ({selectedFiles.length})
                        </p>
                        {!isUploading && (
                            <button
                                onClick={uploadFiles}
                                className="px-4 py-2 text-xs font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Yükle
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {selectedFiles.map(({file, preview, id: fileId}) => (
                            <div
                                key={fileId}
                                className="relative group border border-gray-200 rounded-lg overflow-hidden"
                            >
                                {/* Preview */}
                                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                    {file.type.startsWith('image/') ? (
                                        <img
                                            src={preview}
                                            alt={file.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : file.type.startsWith('video/') ? (
                                        <video
                                            src={preview}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center p-2">
                                            <svg
                                                className="mx-auto h-8 w-8 text-gray-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <p className="text-xs text-gray-500 mt-1 truncate px-1">
                                                {file.type === 'application/pdf' ? 'PDF' : 'Dosya'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* File Info */}
                                <div className="p-2 bg-white">
                                    <p className="text-xs font-medium text-gray-700 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>

                                {/* Remove Button */}
                                {!isUploading && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(fileId);
                                        }}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-700">Yükleniyor...</p>
                        <p className="text-sm text-gray-600">{uploadProgress}%</p>
                    </div>
                    <Progress value={uploadProgress}/>
                </div>
            )}

            {/* Error Message */}
            {(localError || errorText) && (
                <div className="mt-3">
                    <Alert variant="destructive">
                        <AlertDescription>{localError || errorText}</AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
};

FileUpload.displayName = "FileUpload";

export {FileUpload};