import React, {useState, useRef, JSX} from 'react';
import { Upload, X, File, Image, Check } from 'lucide-react';

interface FileObject {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
    status: 'pending' | 'uploading' | 'completed' | 'error';
}

interface UploadProgress {
    [key: string]: number;
}

const FileUpload: React.FC = () => {
    const [files, setFiles] = useState<FileObject[]>([]);
    const [isDragOver, setIsDragOver] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (selectedFiles: FileList | null) => {
        if (!selectedFiles) return;

        const fileArray = Array.from(selectedFiles);
        const newFiles: FileObject[] = fileArray.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'pending' // pending, uploading, completed, error
        }));

        setFiles(prev => [...prev, ...newFiles]);

        // Simulate upload process
        newFiles.forEach(fileObj => {
            simulateUpload(fileObj.id);
        });
    };

    const simulateUpload = (fileId: string): void => {
        setFiles(prev => prev.map(f =>
            f.id === fileId ? { ...f, status: 'uploading' as const } : f
        ));

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setFiles(prev => prev.map(f =>
                    f.id === fileId ? { ...f, status: 'completed' as const } : f
                ));
                setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
            } else {
                setUploadProgress(prev => ({ ...prev, [fileId]: Math.floor(progress) }));
            }
        }, 200);
    };

    const removeFile = (fileId: string): void => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[fileId];
            return newProgress;
        });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            handleFileSelect(droppedFiles);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType: string): JSX.Element => {
        if (fileType.startsWith('image/')) {
            return <Image className="w-5 h-5 text-blue-500" />;
        }
        return <File className="w-5 h-5 text-gray-500" />;
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <div className="space-y-4">
                {/* Upload Area */}
                <div
                    className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
            ${isDragOver
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
          `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files)}
                        accept="*/*"
                    />

                    <div className="flex flex-col items-center space-y-2">
                        <Upload className={`w-12 h-12 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                        <div>
                            <p className="text-lg font-medium text-gray-700">
                                Dosyaları buraya sürükleyin veya seçmek için tıklayın
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                PNG, JPG, PDF, DOC ve diğer dosya türleri desteklenir
                            </p>
                        </div>
                    </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-900">Yüklenen Dosyalar</h3>
                        <div className="space-y-2">
                            {files.map((fileObj) => (
                                <div
                                    key={fileObj.id}
                                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                                >
                                    <div className="flex items-center space-x-3 flex-1">
                                        {getFileIcon(fileObj.type)}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {fileObj.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(fileObj.size)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        {/* Status and Progress */}
                                        <div className="flex items-center space-x-2">
                                            {fileObj.status === 'pending' && (
                                                <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                                            )}

                                            {fileObj.status === 'uploading' && (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                            style={{ width: `${uploadProgress[fileObj.id] || 0}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 min-w-[2rem]">
                            {uploadProgress[fileObj.id] || 0}%
                          </span>
                                                </div>
                                            )}

                                            {fileObj.status === 'completed' && (
                                                <div className="flex items-center space-x-1 text-green-600">
                                                    <Check className="w-4 h-4" />
                                                    <span className="text-xs">Tamamlandı</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFile(fileObj.id)}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Summary */}
                {files.length > 0 && (
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">
              Toplam {files.length} dosya
            </span>
                        <span className="text-sm text-gray-600">
              {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
            </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;