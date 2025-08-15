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


/*
    async previewFile(fileId: string, fileName: string, fileType: string): Promise<Blob> {
        switch(fileType.toLowerCase()) {
            case 'pdf':
                return await this.previewFileAsPdf(fileId, fileName);
            case 'image':
                return await this.previewFileAsImage(fileId, fileName);
            case 'video':
                return await this.previewFileAsVideo(fileId, fileName);
            case 'jpeg':
            case 'jpg':
                return await this.previewFileAsJPEG(fileId, fileName);
            case 'png':
                return await this.previewFileAsPNG(fileId, fileName);
            case 'mp4':
                return await this.previewFileAsMP4(fileId, fileName);
            default:
                throw new Error('Desteklenmeyen dosya formatı');
        }
    }

 */

    /*
    try {
  // Dosya yükleme
  const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
  if (fileInput?.files?.[0]) {
    const uploadedFilePath = await storageService.uploadFile(fileInput.files[0]);
    console.log('Yüklenen dosya path:', uploadedFilePath);
  }

  // Dosya önizleme - Octet Stream
  const fileBlob = await storageService.previewFileAsOctetStream('123', 'document.pdf');
  // Blob ile yapılacak işlemler...

  // Dosya önizleme - PDF
  const pdfBlob = await storageService.previewFileAsPdf('123', 'document.pdf');
  // PDF gösterimi veya indirme işlemi

} catch (error) {
  // Hata yönetimi
  console.error('İşlem sırasında bir hata oluştu:', error);
  throw error;
}

// React/Vue gibi bir frontend framework'ünde kullanım örneği:
const FileUploadComponent = () => {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.files?.[0]) {
        const uploadedPath = await storageService.uploadFile(event.target.files[0]);
        console.log('Dosya başarıyla yüklendi:', uploadedPath);
      }
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
    }
  };

  return (
    <input
      type="file"
      onChange={handleFileUpload}
      accept="application/pdf,image/*"
    />
  );
};
     */

