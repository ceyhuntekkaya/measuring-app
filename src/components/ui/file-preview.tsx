import * as React from 'react';
import siteConfig from '@/config/config.json';
import {detectFileType} from "@/utils/detectFileType";

const API_URL = siteConfig.api.invokeUrl + "/upload/serve/";

type PreviewSize = 'small' | 'medium' | 'large' | 'full';

interface FilePreviewProps {
    fileUrl: string;
    alt?: string;
    size?: PreviewSize;
}

const FilePreview: React.FC<FilePreviewProps> = ({
                                                     fileUrl,
                                                     alt = 'file',
                                                     size = 'small'
                                                 }) => {


    const sizeClasses = {
        small: 'w-32 h-32',      // 128px - önizleme için
        medium: 'w-64 h-64',     // 256px - orta boy
        large: 'w-96 h-96',      // 384px - büyük
        full: 'w-full h-auto'    // tam genişlik
    };

    const fullUrl = API_URL + fileUrl;
    const fileType = detectFileType(fullUrl).type;

    return (
        <div className={`${sizeClasses[size]} bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden`}>
            {fileType === "image" ? (
                <img
                    src={fullUrl}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            ) : fileType === "video" ? (
                <video
                    src={fullUrl}
                    className="w-full h-full object-cover"
                    controls
                />
            ) : fileType === "audio" ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    <svg className="h-12 w-12 text-blue-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                    <audio controls src={fullUrl} className="w-full" preload="metadata">
                        Tarayıcınız audio elementini desteklemiyor.
                    </audio>
                </div>
            ) : (
                <div className="text-center p-2">
                    <svg className="mx-auto h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <p className="text-xs text-gray-500 mt-1 truncate px-1">
                        {fileType === "pdf" ? 'PDF' : 'Dosya'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default FilePreview;