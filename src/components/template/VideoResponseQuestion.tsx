import React, { useState, useEffect, useRef } from 'react';
import { VideoResponseTemplateDto } from '@/types/exam/questionTemplates';
import {QuestionTemplateType} from "@/types/exam/examEntities";
import {EMediaType, EQuestionType} from "@/types/exam/enum";
import {uploadVideoFile} from "@/services/api/upload-file";
import {UploadedFileDto} from "@/types/exam/miscDtos";
import siteConfig from "@/config/config.json";

interface VideoResponseQuestionProps {
    template: VideoResponseTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (questionId:string, template: QuestionTemplateType, selectedOption: string, type: EQuestionType, mediaType: EMediaType, isEmptyAnswer: boolean) => void;
    initialAnswer?: VideoAnswerData | null;
    isSubmitted?: boolean;
    questionId: string;
}

interface VideoAnswerData {
    videoUrl?: string;
    videoBlob?: Blob;
    duration?: number;
    recordedAt?: string;
    fileName?: string;
    uploadedFileData?: UploadedFileDto;
}

const VideoResponseQuestion: React.FC<VideoResponseQuestionProps> = ({
                                                                         template,
                                                                         isPreview = false,
                                                                         onAnswerChange,
                                                                         initialAnswer = null,
                                                                         questionId,
                                                                         isSubmitted = false
                                                                     }) => {
    const [videoAnswer, setVideoAnswer] = useState<VideoAnswerData | null>(initialAnswer);
    const [videoAnswerPath, setVideoAnswerPath] = useState<string>('');
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordingTime, setRecordingTime] = useState<number>(0);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string>('');
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);


    const API_URL = siteConfig.api.invokeUrl + "/upload/serve";

    useEffect(() => {
        if (!initialAnswer) {
            setVideoAnswer(null);
            setVideoAnswerPath('');
            return;
        }

        // Eğer initialAnswer'da uploadedFileData varsa, path'i set et ve videoAnswer'ı güncelle
        if (initialAnswer.uploadedFileData?.path) {
            const path = initialAnswer.uploadedFileData.path;
            setVideoAnswerPath(path);
            // videoAnswer state'ini de güncelle ki video element render edilsin
            setVideoAnswer({
                ...initialAnswer,
                videoUrl: `${API_URL}/${path}`, // URL'i oluştur
                uploadedFileData: initialAnswer.uploadedFileData
            });
        } else if (typeof initialAnswer === 'object' && 'path' in initialAnswer) {
            // Eğer initialAnswer direkt path içeriyorsa (string olarak gelebilir)
            const answerWithPath = initialAnswer as { path?: string } & VideoAnswerData;
            const path = answerWithPath.path || '';
            setVideoAnswerPath(path);
            if (path) {
                setVideoAnswer({
                    ...answerWithPath,
                    videoUrl: `${API_URL}/${path}`
                });
            } else {
                setVideoAnswer(initialAnswer);
            }
        } else {
            setVideoAnswer(initialAnswer);
        }
    }, [initialAnswer, API_URL]);


    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                try {
                    mediaRecorderRef.current.stop();
                } catch (e) {
                    console.error('Error stopping recorder on unmount:', e);
                }
            }
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []); // CRITICAL: Empty array!

    const handleUploadVideo = async (videoBlob: Blob, duration: number): Promise<VideoAnswerData> => {
        // Eğer entityId yoksa veya preview modundaysa upload yapma
        if (!template || isPreview) {
            const url = URL.createObjectURL(videoBlob);
            return {
                videoUrl: url,
                videoBlob: videoBlob,
                duration: duration,
                recordedAt: new Date().toISOString(),
                fileName: `video-response-${Date.now()}.webm`
            };
        }

        setIsUploading(true);
        setUploadProgress(0);
        setError('');
        try {
            const uploadedFiles = await uploadVideoFile(
                videoBlob,
                questionId,
                'VIDEO_RESPONSE',
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
                setVideoAnswerPath(filePath);
                // Yeni kayıt için videoUrl'i API URL formatında oluştur
                const videoUrl = filePath ? `${API_URL}/${filePath}` : URL.createObjectURL(videoBlob);
                return {
                    videoUrl: videoUrl,
                    videoBlob: videoBlob,
                    duration: duration,
                    recordedAt: new Date().toISOString(),
                    fileName: uploadedFile.fileName || `video-response-${Date.now()}.webm`,
                    uploadedFileData: uploadedFile
                };
            } else {
                throw new Error('Upload başarısız: Sunucudan veri dönmedi');
            }

        } catch (err) {
            setIsUploading(false);
            const errorMsg = err instanceof Error ? err.message : 'Video yükleme başarısız';
            setError(errorMsg);
            throw err;
        }
    };

    // Video preview setup when stream is available
    useEffect(() => {
        if (mediaStream && videoPreviewRef.current && isRecording) {
            videoPreviewRef.current.srcObject = mediaStream;
            videoPreviewRef.current.muted = true;

            videoPreviewRef.current.onloadedmetadata = async () => {
                try {
                    await videoPreviewRef.current?.play();
                } catch (playErr) {
                    console.log(playErr)
                }
            };
        }
    }, [mediaStream, isRecording]);

    const startRecording = async (): Promise<void> => {
        if (isSubmitted && !isPreview) return;

        try {
            setError('');
            const constraints: MediaStreamConstraints = {
                video: true,
                audio: true
            };

            if (template.allowScreenRecording) {
                constraints.video = {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                };
            }

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setMediaStream(stream);



            const options: MediaRecorderOptions = {
                mimeType: 'video/webm;codecs=vp9',
            };

            if (!MediaRecorder.isTypeSupported(options.mimeType || '')) {
                options.mimeType = 'video/webm;codecs=vp8';
            }

            const mediaRecorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = mediaRecorder;
            recordedChunksRef.current = [];

            mediaRecorder.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const finalDuration = recordingTime;

                try {
                    // Upload video and get the result
                    const newVideoData = await handleUploadVideo(blob, finalDuration);
                    
                    // Call onAnswerChange if upload was successful
                    if (onAnswerChange && newVideoData.uploadedFileData) {
                        const filePath = newVideoData.uploadedFileData.path || '';
                        setVideoAnswerPath(filePath);
                        onAnswerChange(
                            questionId,
                            template,
                            filePath,
                            EQuestionType.VIDEO_RESPONSE,
                            EMediaType.VIDEO,
                            false
                        );
                    }
                    
                    // State'i en son güncelle ki yeni video görünsün
                    setVideoAnswer(newVideoData);
                } catch (err) {
                    console.error('Upload failed:', err);
                    // Even if upload fails, keep the local video
                    const url = URL.createObjectURL(blob);
                    setVideoAnswer({
                        videoUrl: url,
                        videoBlob: blob,
                        duration: finalDuration,
                        recordedAt: new Date().toISOString(),
                        fileName: `video-response-${Date.now()}.webm`
                    });
                }

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
                setMediaStream(null);

                // Clear video preview
                if (videoPreviewRef.current) {
                    videoPreviewRef.current.srcObject = null;
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            // Clear any existing timer
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }

            // Start timer
            timerIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    const newTime = prev + 1;

                    if (template.maxRecordingDuration && newTime >= template.maxRecordingDuration) {
                        stopRecording();
                    }

                    return newTime;
                });
            }, 1000);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Kamera erişimi sağlanamadı';
            setError(errorMessage);
            console.error('Error accessing media devices:', err);
        }
    };

    const handleSaveAnswer = () => {
        if (onAnswerChange && videoAnswer) {
            onAnswerChange(
                questionId,
                template,
                videoAnswerPath,
                EQuestionType.VIDEO_RESPONSE,
                EMediaType.VIDEO,
                !videoAnswer
            );
        }
    }

    const stopRecording = (): void => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        }
    };

    const deleteRecording = (): void => {
        if (isSubmitted && !isPreview) return;

        setVideoAnswer(null);
        setRecordingTime(0);
        setUploadProgress(0);

        if (onAnswerChange) {
            onAnswerChange(questionId, template, '', EQuestionType.VIDEO_RESPONSE, EMediaType.VIDEO, true);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getDurationInfo = (): string => {
        const parts: string[] = [];

        if (template.minRecordingDuration) {
            parts.push(`Min: ${formatTime(template.minRecordingDuration)}`);
        }

        if (template.maxRecordingDuration) {
            parts.push(`Maks: ${formatTime(template.maxRecordingDuration)}`);
        }

        return parts.length > 0 ? parts.join(' | ') : '';
    };

    const isValidDuration = (): boolean => {
        if (!videoAnswer?.duration) return false;

        const duration = videoAnswer.duration;

        if (template.minRecordingDuration && duration < template.minRecordingDuration) {
            return false;
        }

        if (template.maxRecordingDuration && duration > template.maxRecordingDuration) {
            return false;
        }

        return true;
    };

    const getRecordingButtonStyle = (): string => {
        if (isSubmitted && !isPreview) {
            return "bg-gray-400 cursor-not-allowed";
        }

        if (isRecording) {
            return "bg-red-500 hover:bg-red-600 animate-pulse";
        }

        return "bg-blue-500 hover:bg-blue-600";
    };

    return (
        <div className="space-y-6">
            {template.title && template.title !== "NOT_SET" && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{template.title}</h3>
                    {template.description && (
                        <p className="text-gray-600 mt-1">{template.description}</p>
                    )}
                </div>
            )}

            {template.prompt && (
                <div className="mb-4 p-4 bg-purple-50 border-l-4 border-purple-400 rounded">
                    <p className="text-purple-700">{template.prompt}</p>
                </div>
            )}


            {getDurationInfo() && (
                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-blue-800 text-sm">
                            <strong>Kayıt Süresi:</strong> {getDurationInfo()}
                        </p>
                    </div>
                </div>
            )}

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

            {/* Upload Progress Bar */}
            {isUploading && (
                <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-800">Video dosyası yükleniyor...</span>
                        <span className="text-sm font-bold text-blue-900">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Video Recording Section */}
            <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
                {/* Live Preview During Recording */}
                {(isRecording || mediaStream) && (
                    <div className="mb-4">
                        <div className="relative">
                            <video
                                ref={videoPreviewRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full max-w-2xl mx-auto rounded-lg border-2 border-red-500 shadow-lg"
                            />
                            {/* Recording Indicator Overlay */}
                            <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-2 rounded-lg shadow-lg">
                                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                <span className="font-semibold">REC</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recorded Video Playback */}
                {(videoAnswer?.videoUrl || videoAnswerPath) && !isRecording && videoAnswer && (
                    <div className="mb-4">
                        <video
                            key={`${videoAnswer.videoUrl || ''}-${videoAnswerPath || ''}-${videoAnswer.uploadedFileData?.path || ''}`}
                            src={
                                videoAnswerPath 
                                    ? `${API_URL}/${videoAnswerPath}` 
                                    : videoAnswer.videoUrl || ''
                            }
                            controls
                            className="w-full max-w-2xl mx-auto rounded-lg border-2 border-green-500"
                        />
                        <div className="mt-2 text-center text-sm text-gray-600">
                            <span className="font-medium">Kayıt Süresi:</span> {formatTime(videoAnswer.duration || 0)}
                            {videoAnswer.uploadedFileData && (
                                <span className="ml-3 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                                    ✓ Yüklendi
                                </span>
                            )}
                            {!isValidDuration() && (
                                <span className="ml-2 text-red-600 font-semibold">
                                    ⚠️ Süre gereksinimlerini karşılamıyor
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Recording Timer */}
                {isRecording && (
                    <div className="mb-4 text-center">
                        <div className="inline-flex items-center space-x-3 bg-white px-6 py-3 rounded-full border-2 border-gray-300 shadow-lg">
                            <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="font-mono text-3xl font-bold text-gray-800">
                                {formatTime(recordingTime)}
                            </span>
                        </div>
                        {template.maxRecordingDuration && (
                            <p className="text-sm text-gray-600 mt-2">
                                Kalan süre: {formatTime(Math.max(0, template.maxRecordingDuration - recordingTime))}
                            </p>
                        )}
                    </div>
                )}

                {/* Control Buttons */}
                <div className="flex items-center justify-center space-x-4">
                    {!videoAnswer && !isRecording && (
                        <button
                            onClick={startRecording}
                            disabled={(isSubmitted && !isPreview) || isUploading}
                            className={`px-6 py-3 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                                getRecordingButtonStyle()
                            }`}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            <span>Kaydı Başlat</span>
                        </button>
                    )}

                    {isRecording && (
                        <button
                            onClick={stopRecording}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                            </svg>
                            <span>Kaydı Durdur</span>
                        </button>
                    )}

                    {videoAnswer && !isRecording && (
                        <>
                            <button
                                onClick={deleteRecording}
                                disabled={(isSubmitted && !isPreview) || isUploading}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                                    (isSubmitted && !isPreview) || isUploading
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>Kaydı Sil</span>
                            </button>

                            <button
                                onClick={startRecording}
                                disabled={(isSubmitted && !isPreview) || isUploading}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                                    (isSubmitted && !isPreview) || isUploading
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                </svg>
                                <span>Yeniden Kaydet</span>
                            </button>
                        </>
                    )}
                </div>

                {/* Info Text */}
                {!videoAnswer && !isRecording && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            {template.allowScreenRecording
                                ? 'Kamera veya ekran kaydı yapabilirsiniz'
                                : 'Kamera ile video kaydı yapın'
                            }
                        </p>
                    </div>
                )}
            </div>

            <button
                className={"btn btn-success"}
                onClick={handleSaveAnswer}
                disabled={isUploading || !videoAnswer}
            >
                KAYDET
            </button>

            {/* Submission Status */}
            {isSubmitted && videoAnswer && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <p className="text-green-800 font-semibold">
                            Video yanıtınız başarıyla gönderildi
                        </p>
                    </div>
                    {template.requiresManualGrading && (
                        <p className="text-green-700 text-sm mt-2">
                            Değerlendirme tamamlandığında sonuçları görebileceksiniz.
                        </p>
                    )}
                </div>
            )}

            {/* Preview Mode Indicator */}
            {isPreview && (
                <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded">
                    <p className="text-gray-600 text-sm italic">
                        👁️ Önizleme Modu - Bu sorunun nasıl görüneceğinin önizlemesidir
                    </p>
                </div>
            )}

            {/* Question Metadata (only in preview) */}
            {isPreview && (
                <div className="mt-4 p-4 bg-gray-50 rounded border">
                    <h4 className="font-semibold text-gray-700 mb-2">Soru Bilgileri:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        {template.subject && <div><strong>Konu:</strong> {template.subject}</div>}
                        {template.difficulty && <div><strong>Zorluk:</strong> {template.difficulty}</div>}
                        {template.points && <div><strong>Puan:</strong> {template.points}</div>}
                        {template.timeLimit && <div><strong>Süre:</strong> {template.timeLimit} saniye</div>}
                        {template.minRecordingDuration && <div><strong>Min. Kayıt:</strong> {formatTime(template.minRecordingDuration)}</div>}
                        {template.maxRecordingDuration && <div><strong>Maks. Kayıt:</strong> {formatTime(template.maxRecordingDuration)}</div>}
                        {template.requiresManualGrading !== undefined && <div><strong>Manuel Değerlendirme:</strong> {template.requiresManualGrading ? 'Evet' : 'Hayır'}</div>}
                        {template.allowScreenRecording !== undefined && <div><strong>Ekran Kaydı:</strong> {template.allowScreenRecording ? 'İzinli' : 'İzinsiz'}</div>}
                        {template.tags && template.tags.length > 0 && (
                            <div className="col-span-2"><strong>Etiketler:</strong> {template.tags.join(', ')}</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoResponseQuestion;