type FileType = 'image' | 'video' | 'pdf' | 'audio' | 'document' | 'archive' | 'unknown';

interface FileTypeResult {
    type: FileType;
    extension: string | null;
    mimeType: string | null;
}

/**
 * Verilen URL'den dosya tipini tespit eder
 * @param url - Kontrol edilecek URL
 * @returns Dosya tipi bilgisi
 */
export function detectFileType(url: string): FileTypeResult {
    try {
        // URL'den dosya uzantısını çıkar
        const urlObj = new URL(url);
        const pathname = urlObj.pathname.toLowerCase();
        const extension = pathname.split('.').pop() || null;

        // Resim formatları
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif', 'heic', 'heif'];

        // Video formatları
        const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v', 'mpg', 'mpeg', '3gp'];

        // Ses formatları
        const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma', 'opus'];

        // Döküman formatları
        const documentExtensions = ['doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx', 'csv'];

        // Arşiv formatları
        const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];

        if (extension) {
            if (extension === 'pdf') {
                return {
                    type: 'pdf',
                    extension: 'pdf',
                    mimeType: 'application/pdf'
                };
            }

            if (imageExtensions.includes(extension)) {
                return {
                    type: 'image',
                    extension,
                    mimeType: `image/${extension === 'jpg' ? 'jpeg' : extension}`
                };
            }

            if (videoExtensions.includes(extension)) {
                return {
                    type: 'video',
                    extension,
                    mimeType: `video/${extension}`
                };
            }

            if (audioExtensions.includes(extension)) {
                return {
                    type: 'audio',
                    extension,
                    mimeType: `audio/${extension}`
                };
            }

            if (documentExtensions.includes(extension)) {
                return {
                    type: 'document',
                    extension,
                    mimeType: 'application/octet-stream'
                };
            }

            if (archiveExtensions.includes(extension)) {
                return {
                    type: 'archive',
                    extension,
                    mimeType: 'application/octet-stream'
                };
            }
        }

        return {
            type: 'unknown',
            extension,
            mimeType: null
        };

    } catch (error) {
        console.log(error)
        return {
            type: 'unknown',
            extension: null,
            mimeType: null
        };
    }
}

/**
 * Asenkron olarak URL'den dosya tipini HTTP header'ları ile tespit eder
 * @param url - Kontrol edilecek URL
 * @returns Dosya tipi bilgisi
 */
export async function detectFileTypeFromHeaders(url: string): Promise<FileTypeResult> {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type')?.toLowerCase();

        if (contentType) {
            if (contentType.includes('image')) {
                return {
                    type: 'image',
                    extension: contentType.split('/')[1]?.split(';')[0] || null,
                    mimeType: contentType
                };
            }

            if (contentType.includes('video')) {
                return {
                    type: 'video',
                    extension: contentType.split('/')[1]?.split(';')[0] || null,
                    mimeType: contentType
                };
            }

            if (contentType.includes('pdf') || contentType.includes('application/pdf')) {
                return {
                    type: 'pdf',
                    extension: 'pdf',
                    mimeType: contentType
                };
            }

            if (contentType.includes('audio')) {
                return {
                    type: 'audio',
                    extension: contentType.split('/')[1]?.split(';')[0] || null,
                    mimeType: contentType
                };
            }
        }

        // Header'dan tespit edilemezse URL'den tespit et
        return detectFileType(url);

    } catch (error) {
        console.log(error)
        // Hata durumunda URL'den tespit et
        return detectFileType(url);
    }
}

// Kullanım örnekleri:
/*
const result1 = detectFileType('https://example.com/image.jpg');
console.log(result1); // { type: 'image', extension: 'jpg', mimeType: 'image/jpeg' }

const result2 = detectFileType('https://example.com/video.mp4');
console.log(result2); // { type: 'video', extension: 'mp4', mimeType: 'video/mp4' }

const result3 = detectFileType('https://example.com/document.pdf');
console.log(result3); // { type: 'pdf', extension: 'pdf', mimeType: 'application/pdf' }

// Asenkron kullanım:
const result4 = await detectFileTypeFromHeaders('https://example.com/file');
console.log(result4);
*/