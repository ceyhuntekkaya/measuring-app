import React, { useState, useEffect, useRef } from 'react';
import type { ImageResponseTemplateDto } from '@/api/generated/model';
import type {QuestionTemplateType} from "@/types/exam/questionTemplateTypes";
import {EMediaType, EQuestionType} from "@/types/exam/enum";
import {difficultyConverter} from "@/utils/enum-converter";
import type {UploadedFileDto} from "@/api/generated/model";
import {uploadFile} from "@/services/api/upload-file";
import siteConfig from "@/config/config.json";
import MaybeHtml from "@/components/ui/maybe-html";

interface ImageResponseQuestionProps {
    template: ImageResponseTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (questionId:string, template: QuestionTemplateType, selectedOption: string, type: EQuestionType, mediaType: EMediaType, isEmptyAnswer: boolean) => void;
    initialAnswer?: ImageAnswerData | null;
    isSubmitted?: boolean;
    questionId: string;
    showCorrectAnswer?: boolean;
}

interface ImageAnswerData {
    imageUrl?: string;
    imageBlob?: Blob;
    fileName?: string;
    fileSize?: number;
    uploadedAt?: string;
    isDrawing?: boolean;
    uploadedFileData?: UploadedFileDto; // Upload sonucu
}

interface Point {
    x: number;
    y: number;
}

const ImageResponseQuestion: React.FC<ImageResponseQuestionProps> = ({
                                                                         template,
                                                                         isPreview = false,
                                                                         onAnswerChange,
                                                                         initialAnswer = null,
                                                                         isSubmitted = false,
                                                                         questionId,
                                                                     }) => {
    const [imageAnswer, setImageAnswer] = useState<ImageAnswerData | null>(initialAnswer);

    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
    const [currentColor, setCurrentColor] = useState<string>('#000000');
    const [lineWidth, setLineWidth] = useState<number>(2);
    const [error, setError] = useState<string>('');
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const lastPositionRef = useRef<Point | null>(null);

    const API_URL = siteConfig.api.invokeUrl + "/upload/serve";

    useEffect(() => {
        if (!initialAnswer) {
            setImageAnswer(null);
            return;
        }

        // Eğer initialAnswer'da uploadedFileData varsa, imageUrl'i API URL formatında oluştur
        if (initialAnswer.uploadedFileData?.path) {
            const path = initialAnswer.uploadedFileData.path;
            const imageUrl = `${API_URL}/${path}`;
            setImageAnswer({
                ...initialAnswer,
                imageUrl: imageUrl, // API URL formatında
                uploadedFileData: initialAnswer.uploadedFileData
            });
        } else if (typeof initialAnswer === 'object' && 'path' in initialAnswer) {
            // Eğer initialAnswer direkt path içeriyorsa
            const answerWithPath = initialAnswer as { path?: string } & ImageAnswerData;
            const path = answerWithPath.path || '';
            if (path) {
                setImageAnswer({
                    ...answerWithPath,
                    imageUrl: `${API_URL}/${path}`
                });
            } else {
                setImageAnswer(initialAnswer);
            }
        } else {
            setImageAnswer(initialAnswer);
        }

        // Canvas'a çizim için image yükle
        if (initialAnswer?.imageUrl && template.requiresDrawing && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                // imageUrl API URL formatında olabilir, CORS için crossOrigin ekle
                img.crossOrigin = 'anonymous';
                img.src = initialAnswer.imageUrl;
            }
        }
    }, [initialAnswer, template.requiresDrawing, API_URL]);

    useEffect(() => {
        if (template.requiresDrawing && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
            }
        }
    }, [template.requiresDrawing]);

    const handleUploadImage = async (imageFile: File): Promise<ImageAnswerData> => {
        // Eğer questionId yoksa veya preview modundaysa upload yapma
        if (!questionId || isPreview) {
            const url = URL.createObjectURL(imageFile);
            return {
                imageUrl: url,
                imageBlob: imageFile,
                fileName: imageFile.name,
                fileSize: imageFile.size,
                uploadedAt: new Date().toISOString(),
                isDrawing: false
            };
        }

        setIsUploading(true);
        setUploadProgress(0);
        setError('');

        try {
            const uploadedFiles = await uploadFile(
                imageFile,
                questionId,
                'IMAGE_RESPONSE',
                {
                    onProgress: (progress) => {
                        setUploadProgress(progress);
                    },
                    onError: (errorMsg) => {
                        setError(errorMsg);
                    }
                }
            );

            setIsUploading(false);

            if (uploadedFiles && uploadedFiles.length > 0) {
                const uploadedFile = uploadedFiles[0];
                const filePath = uploadedFile.path || '';
                // Yeni kayıt için imageUrl'i API URL formatında oluştur
                const imageUrl = filePath ? `${API_URL}/${filePath}` : URL.createObjectURL(imageFile);

                return {
                    imageUrl: imageUrl,
                    imageBlob: imageFile,
                    fileName: uploadedFile.fileName || imageFile.name,
                    fileSize: imageFile.size,
                    uploadedAt: new Date().toISOString(),
                    isDrawing: false,
                    uploadedFileData: uploadedFile
                };
            } else {
                throw new Error('Upload başarısız: Dosya yüklenemedi');
            }
        } catch (err) {
            setIsUploading(false);
            const errorMsg = err instanceof Error ? err.message : 'Resim yüklenirken bir hata oluştu';
            setError(errorMsg);
            // Hata olsa bile local image'i göster
            const url = URL.createObjectURL(imageFile);
            return {
                imageUrl: url,
                imageBlob: imageFile,
                fileName: imageFile.name,
                fileSize: imageFile.size,
                uploadedAt: new Date().toISOString(),
                isDrawing: false
            };
        }
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (isSubmitted && !isPreview) return;

        const file = event.target.files?.[0];
        if (!file) return;

        setError('');

        // Validate file type
        if (template.allowedFormats) {
            const allowedFormats = template.allowedFormats.toLowerCase().split(',').map(f => f.trim());
            const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
            const fileType = file.type.toLowerCase();

            const isValidFormat = allowedFormats.some(format =>
                fileType.includes(format) || fileExtension === format.replace('.', '')
            );

            if (!isValidFormat) {
                setError(`Desteklenmeyen dosya formatı. İzin verilen formatlar: ${template.allowedFormats}`);
                return;
            }
        }

        // Validate file size (maxFileSize from API is bytes)
        if (template.maxFileSize && file.size > template.maxFileSize) {
            const maxSizeMB = (template.maxFileSize / (1024 * 1024)).toFixed(2);
            setError(`Dosya boyutu çok büyük. Maksimum boyut: ${maxSizeMB} MB`);
            return;
        }

        try {
            // Upload image and get the result
            const newImageData = await handleUploadImage(file);

            // Upload başarılı olduğunda otomatik olarak kaydet
            if (onAnswerChange && newImageData.uploadedFileData) {
                const filePath = newImageData.uploadedFileData.path || '';
                // Otomatik kaydetme işlemi
                onAnswerChange(
                    questionId,
                    template,
                    filePath,
                    EQuestionType.IMAGE_RESPONSE,
                    EMediaType.IMAGE,
                    false
                );
            }
            
            // State'i en son güncelle ki yeni görsel görünsün
            setImageAnswer(newImageData);
        } catch (err) {
            console.error('Image upload failed:', err);
            // Hata olsa bile local image'i göster
            const url = URL.createObjectURL(file);
            setImageAnswer({
                imageUrl: url,
                imageBlob: file,
                fileName: file.name,
                fileSize: file.size,
                uploadedAt: new Date().toISOString(),
                isDrawing: false
            });
        }
    };

    const handleSaveAnswer = () => {
        if (onAnswerChange && imageAnswer) {
            // Eğer resim zaten upload edilmişse, path'i gönder
            const filePath = imageAnswer.uploadedFileData?.path || imageAnswer.imageUrl || '';
            onAnswerChange(questionId, template, filePath, EQuestionType.IMAGE_RESPONSE, EMediaType.IMAGE, false);
        }
    }

    const handleUploadClick = (): void => {
        if (isSubmitted && !isPreview) return;
        fileInputRef.current?.click();
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        if (!isSubmitted || isPreview) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        setIsDragging(false);

        if (isSubmitted && !isPreview) return;

        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const fakeEvent = {
                target: { files: [file] }
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            handleFileSelect(fakeEvent);
        }
    };

    const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>): void => {
        if (isSubmitted && !isPreview) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setIsDrawing(true);
        lastPositionRef.current = { x, y };
    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement>): void => {
        if (!isDrawing || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx || !lastPositionRef.current) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
        ctx.lineTo(x, y);

        if (currentTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = lineWidth * 3;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = lineWidth;
        }

        ctx.stroke();
        ctx.closePath();

        lastPositionRef.current = { x, y };
    };

    const stopDrawing = (): void => {
        setIsDrawing(false);
        lastPositionRef.current = null;

        // Save canvas as image
        if (canvasRef.current) {
            canvasRef.current.toBlob((blob) => {
                if (blob) {
                    const imageUrl = URL.createObjectURL(blob);
                    const newImageData: ImageAnswerData = {
                        imageUrl,
                        imageBlob: blob,
                        fileName: `drawing-${Date.now()}.png`,
                        fileSize: blob.size,
                        uploadedAt: new Date().toISOString(),
                        isDrawing: true
                    };

                    setImageAnswer(newImageData);

                    if (onAnswerChange) {
                      //  onAnswerChange(newImageData);
                    }
                }
            }, 'image/png');
        }
    };

    const clearCanvas = (): void => {
        if (isSubmitted && !isPreview) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Reset to white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        setImageAnswer(null);

        if (onAnswerChange) {
           // onAnswerChange(null);
        }
    };

    const deleteImage = (): void => {
        if (isSubmitted && !isPreview) return;

        setImageAnswer(null);

        if (onAnswerChange) {
          //  onAnswerChange(null);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const getMaxFileSizeText = (): string => {
        if (!template.maxFileSize) return '';
        return formatFileSize(template.maxFileSize);
    };

    const getUploadAreaStyle = (): string => {
        const baseStyle = "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ";

        if (isSubmitted && !isPreview) {
            return baseStyle + "border-gray-300 bg-gray-100 cursor-not-allowed";
        }

        if (isDragging) {
            return baseStyle + "border-blue-500 bg-blue-50";
        }

        return baseStyle + "border-gray-400 bg-gray-50 hover:border-blue-500 hover:bg-blue-50 cursor-pointer";
    };

    return (
        <div className="space-y-6">
            {/* Question Title */}
            {template.title && template.title === "NOT_SET" && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{template.title}</h3>
                    {template.description && (
                        <p className="text-gray-600 mt-1">{template.description}</p>
                    )}
                </div>
            )}

            {/* Question Statement
            {template.statement && (
                <div className="mb-6">
                    <p className="text-gray-800 text-base leading-relaxed">{template.statement}</p>
                </div>
            )}*/}

            {(template.description || template.instructions) && (
                <div className="mb-4 p-4 bg-purple-50 border-l-4 border-purple-400 rounded">
                    {template.description && (
                        <MaybeHtml className="text-purple-700" value={template.description} />
                    )}
                    {template.instructions && (
                        <p className="text-purple-700 text-sm whitespace-pre-wrap mt-2">{template.instructions}</p>
                    )}
                </div>
            )}

            {/* Reference Image */}
            {template.referenceImageUrl && (
                <div className="mb-6">
                    {//<h4 className="font-semibold text-gray-700 mb-2">Referans Görsel:</h4>
                    }
                    <img
                        src={template.referenceImageUrl}
                        alt="Referans görsel"
                        className="max-w-full h-auto rounded-lg border-2 border-gray-300"
                        style={{ maxHeight: '400px' }}
                    />
                </div>
            )}

            {/* Grading Criteria
            {template.gradingCriteria && template.gradingCriteria.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <h4 className="font-semibold text-yellow-800 mb-2">Değerlendirme Kriterleri:</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {template.gradingCriteria.map((criterion, index) => (
                            <li key={index} className="text-yellow-700 text-sm">{criterion}</li>
                        ))}
                    </ul>
                </div>
            )}
            */}
            {/* Rubric
            {template.rubric && (
                <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 rounded">
                    <h4 className="font-semibold text-green-800 mb-2">Değerlendirme Rubriği:</h4>
                    <p className="text-green-700 text-sm whitespace-pre-wrap">{template.rubric}</p>
                </div>
            )}
            */}
            {/* Manual Grading Notice
            {template.requiresManualGrading && (
                <div className="mb-4 p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
                    <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-orange-800 text-sm">
                            Bu soru manuel değerlendirme gerektirir. Yanıtınız öğretmeniniz tarafından değerlendirilecektir.
                        </p>
                    </div>
                </div>
            )}
            */}
            {/* File Requirements */}
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <div className="space-y-1 text-sm text-blue-800">
                    {template.allowedFormats && (
                        <p><strong>Desteklenen Formatlar:</strong> {template.allowedFormats}</p>
                    )}
                    {template.maxFileSize && (
                        <p><strong>Maksimum Dosya Boyutu:</strong> {getMaxFileSizeText()}</p>
                    )}
                    {template.requiresDrawing && (
                        <p><strong>Çizim Gerekli:</strong> Evet</p>
                    )}
                    {template.allowsUpload && (
                        <p><strong>Yükleme İzni:</strong> Evet</p>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-400 rounded">
                    <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Drawing Canvas */}
            {template.requiresDrawing && !imageAnswer && (
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                    <div className="mb-4 flex items-center justify-between">
                        <h4 className="font-semibold text-gray-700">Çizim Alanı</h4>

                        {/* Drawing Tools */}
                        <div className="flex items-center space-x-4">
                            {/* Tool Selection */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentTool('pen')}
                                    disabled={isSubmitted && !isPreview}
                                    className={`p-2 rounded ${
                                        currentTool === 'pen'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    } ${isSubmitted && !isPreview ? 'cursor-not-allowed opacity-50' : ''}`}
                                    title="Kalem"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setCurrentTool('eraser')}
                                    disabled={isSubmitted && !isPreview}
                                    className={`p-2 rounded ${
                                        currentTool === 'eraser'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    } ${isSubmitted && !isPreview ? 'cursor-not-allowed opacity-50' : ''}`}
                                    title="Silgi"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>

                            {/* Color Picker */}
                            {currentTool === 'pen' && (
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm text-gray-700">Renk:</label>
                                    <input
                                        type="color"
                                        value={currentColor}
                                        onChange={(e) => setCurrentColor(e.target.value)}
                                        disabled={isSubmitted && !isPreview}
                                        className="w-10 h-10 rounded cursor-pointer"
                                    />
                                </div>
                            )}

                            {/* Line Width */}
                            <div className="flex items-center space-x-2">
                                <label className="text-sm text-gray-700">Kalınlık:</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={lineWidth}
                                    onChange={(e) => setLineWidth(Number(e.target.value))}
                                    disabled={isSubmitted && !isPreview}
                                    className="w-20"
                                />
                                <span className="text-sm text-gray-600 w-6">{lineWidth}</span>
                            </div>

                            {/* Clear Button */}
                            <button
                                onClick={clearCanvas}
                                disabled={isSubmitted && !isPreview}
                                className={`px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm ${
                                    isSubmitted && !isPreview ? 'cursor-not-allowed opacity-50' : ''
                                }`}
                            >
                                Temizle
                            </button>
                        </div>
                    </div>

                    {/* Canvas */}
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="border border-gray-300 rounded cursor-crosshair bg-white w-full"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </div>
            )}

            {/* Image Upload / Display */}
            {(template.allowsUpload || !template.requiresDrawing) && (
                <div>
                    {!imageAnswer ? (
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={template.allowedFormats || 'image/*'}
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={isSubmitted && !isPreview}
                            />

                            <div
                                onClick={handleUploadClick}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={getUploadAreaStyle()}
                            >
                                <div className="flex flex-col items-center space-y-4">
                                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <div>
                                        <p className="text-gray-700 font-medium">
                                            {isDragging ? 'Dosyayı buraya bırakın' : 'Görsel yüklemek için tıklayın veya sürükleyin'}
                                        </p>
                                        <p className="text-gray-500 text-sm mt-2">
                                            {template.allowedFormats || 'Tüm görsel formatları'} • Maks: {getMaxFileSizeText() || 'Sınırsız'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h4 className="font-semibold text-gray-700">Yüklenen Görsel</h4>
                                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                                        {imageAnswer.fileName && (
                                            <p><strong>Dosya:</strong> {imageAnswer.fileName}</p>
                                        )}
                                        {imageAnswer.fileSize && (
                                            <p><strong>Boyut:</strong> {formatFileSize(imageAnswer.fileSize)}</p>
                                        )}
                                        {imageAnswer.isDrawing && (
                                            <p className="text-purple-600"><strong>Tür:</strong> Çizim</p>
                                        )}
                                    </div>
                                </div>

                                {(!isSubmitted || isPreview) && (
                                    <button
                                        onClick={deleteImage}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>Sil</span>
                                    </button>
                                )}
                            </div>
                            {

                            }

                            <img
                                key={`${imageAnswer.imageUrl || ''}-${imageAnswer.uploadedFileData?.path || ''}`}
                                src={
                                    imageAnswer.uploadedFileData?.path
                                        ? `${API_URL}/${imageAnswer.uploadedFileData.path}`
                                        : imageAnswer.imageUrl || ''
                                }
                                alt="Yüklenen görsel"
                                className="max-w-full h-auto rounded border border-gray-200"
                                style={{ maxHeight: '600px' }}
                            />
                        </div>
                    )}
                </div>
            )}
            {/* Upload Progress */}
            {isUploading && (
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Yükleniyor...</span>
                        <span className="text-sm text-gray-600">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}
            
            {/* KAYDET butonu - sadece upload başarısız olursa veya manuel kaydetme gerekiyorsa göster */}
            {!isPreview && imageAnswer && !isUploading && !imageAnswer.uploadedFileData && (
                <button className={"btn btn-success"} onClick={handleSaveAnswer}>KAYDET</button>
            )}
            {/* Submission Status */}
            {isSubmitted && imageAnswer && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <p className="text-green-800 font-semibold">
                            Görsel yanıtınız başarıyla gönderildi
                        </p>
                    </div>
                    {template.requiresManualGrading && (
                        <p className="text-green-700 text-sm mt-2">
                            Değerlendirme tamamlandığında sonuçları görebileceksiniz.
                        </p>
                    )}
                </div>
            )}

            {/* Question Metadata (only in preview) */}
            {isPreview && (
                <div className="mt-4 p-4 bg-gray-50 rounded border">
                    <h4 className="font-semibold text-gray-700 mb-2">Soru Bilgileri:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        {template.subject && (
                            <div><strong>Konu:</strong> {template.subject}</div>
                        )}
                        {template.difficulty && (
                            <div><strong>Zorluk:</strong> {difficultyConverter(template.difficulty)}</div>
                        )}
                        {template.points && (
                            <div><strong>Puan:</strong> {template.points}</div>
                        )}
                        {template.timeLimit && (
                            <div><strong>Süre:</strong> {template.timeLimit} saniye</div>
                        )}
                        {template.maxFileSize && (
                            <div><strong>Maks. Dosya:</strong> {getMaxFileSizeText()}</div>
                        )}
                        {template.requiresManualGrading !== undefined && (
                            <div><strong>Manuel Değerlendirme:</strong> {template.requiresManualGrading ? 'Evet' : 'Hayır'}</div>
                        )}
                        {template.requiresDrawing !== undefined && (
                            <div><strong>Çizim Gerekli:</strong> {template.requiresDrawing ? 'Evet' : 'Hayır'}</div>
                        )}
                        {template.allowsUpload !== undefined && (
                            <div><strong>Yükleme İzni:</strong> {template.allowsUpload ? 'Evet' : 'Hayır'}</div>
                        )}
                        {template.tags && template.tags.length > 0 && (
                            <div className="col-span-2">
                                <strong>Etiketler:</strong> {template.tags.join(', ')}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Development Notes - Comment for future exam implementation */}
            {/*
        TODO: Real exam implementation
        - Integrate with exam session management
        - Implement image upload to backend/cloud storage
        - Add image compression options
        - Handle upload progress indication
        - Add retry mechanism for failed uploads
        - Support for advanced drawing tools (shapes, text, etc.)
        - Implement layers for complex drawings
        - Add undo/redo functionality for drawings
        - Support for touch devices and stylus
        - Implement image annotation features
        - Add AI-based image analysis (optional)
        - Handle network issues and offline scenarios
        - Add image filters and effects
        - Implement collaborative drawing (optional)
        - Support for multiple images upload
        - Add accessibility features
        - Handle browser compatibility issues
        - Implement auto-save functionality
      */}
        </div>
    );
};

export default ImageResponseQuestion;