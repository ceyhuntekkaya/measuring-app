import React, { useState, useEffect, useRef } from 'react';
import { VideoResponseTemplateDto } from '@/types/exam/questionTemplates';

interface VideoResponseQuestionProps {
    template: VideoResponseTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (videoData: VideoAnswerData | null) => void;
    initialAnswer?: VideoAnswerData | null;
    isSubmitted?: boolean;
    showCorrectAnswer?: boolean;
}

interface VideoAnswerData {
    videoUrl?: string;
    videoBlob?: Blob;
    duration?: number;
    recordedAt?: string;
    fileName?: string;
}

const VideoResponseQuestion: React.FC<VideoResponseQuestionProps> = ({
                                                                         template,
                                                                         isPreview = false,
                                                                         onAnswerChange,
                                                                         initialAnswer = null,
                                                                         isSubmitted = false,
                                                                         showCorrectAnswer = false
                                                                     }) => {
    const [videoAnswer, setVideoAnswer] = useState<VideoAnswerData | null>(initialAnswer);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordingTime, setRecordingTime] = useState<number>(0);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string>('');

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const videoPreviewRef = useRef<HTMLVideoElement>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    console.log(showCorrectAnswer)
    useEffect(() => {
        setVideoAnswer(initialAnswer);
    }, [initialAnswer]);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            stopRecording();
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };
    }, [mediaStream]);

    const startRecording = async (): Promise<void> => {
        if (isSubmitted && !isPreview) return;

        try {
            setError('');
            const constraints: MediaStreamConstraints = {
                video: true,
                audio: true
            };

            if (template.allowScreenRecording) {
                // For screen recording, we would use getDisplayMedia
                // This is a simplified version
                constraints.video = {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                };
            }

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            setMediaStream(stream);

            if (videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = stream;
            }

            const options: MediaRecorderOptions = {
                mimeType: 'video/webm;codecs=vp9',
            };

            // Fallback to vp8 if vp9 is not supported
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

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);

                const newVideoData: VideoAnswerData = {
                    videoUrl: url,
                    videoBlob: blob,
                    duration: recordingTime,
                    recordedAt: new Date().toISOString(),
                    fileName: `video-response-${Date.now()}.webm`
                };

                setVideoAnswer(newVideoData);

                if (onAnswerChange) {
                    onAnswerChange(newVideoData);
                }

                // Stop all tracks
                if (mediaStream) {
                    mediaStream.getTracks().forEach(track => track.stop());
                }
                setMediaStream(null);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            timerIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    const newTime = prev + 1;

                    // Auto-stop if max duration reached
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

        if (onAnswerChange) {
            onAnswerChange(null);
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
            )}
            */}
            {/* Prompt */}
            {template.prompt && (
                <div className="mb-4 p-4 bg-purple-50 border-l-4 border-purple-400 rounded">
                    {//<h4 className="font-semibold text-purple-800 mb-2">Soru İstemi:</h4>
                    }
                    <p className="text-purple-700">{template.prompt}</p>
                </div>
            )}

            {/* Video Prompt */}
            {template.videoPromptUrl && (
                <div className="mb-6">
                    {//<h4 className="font-semibold text-gray-700 mb-2">Video İstem:</h4>
                    }
                    <video
                        src={template.videoPromptUrl}
                        controls
                        className="w-full max-w-2xl rounded-lg border border-gray-300"
                    >
                        Tarayıcınız video oynatmayı desteklemiyor.
                    </video>
                </div>
            )}

            {/* Recording Duration Info */}
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

            {/* Video Recording Section */}
            <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
                {/* Live Preview / Recorded Video */}
                {(isRecording || mediaStream) && (
                    <div className="mb-4">
                        <video
                            ref={videoPreviewRef}
                            autoPlay
                            muted
                            className="w-full max-w-2xl mx-auto rounded-lg border-2 border-blue-500"
                        />
                    </div>
                )}

                {/* Recorded Video Playback */}
                {videoAnswer?.videoUrl && !isRecording && !mediaStream && (
                    <div className="mb-4">
                        <video
                            src={videoAnswer.videoUrl}
                            controls
                            className="w-full max-w-2xl mx-auto rounded-lg border-2 border-green-500"
                        />
                        <div className="mt-2 text-center text-sm text-gray-600">
                            <span className="font-medium">Kayıt Süresi:</span> {formatTime(videoAnswer.duration || 0)}
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
                        <div className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-mono text-xl font-bold">
                            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                            <span>{formatTime(recordingTime)}</span>
                        </div>
                        {template.maxRecordingDuration && (
                            <p className="text-sm text-gray-600 mt-2">
                                Maksimum süre: {formatTime(template.maxRecordingDuration)}
                            </p>
                        )}
                    </div>
                )}

                {/* Control Buttons */}
                <div className="flex items-center justify-center space-x-4">
                    {!videoAnswer && !isRecording && (
                        <button
                            onClick={startRecording}
                            disabled={isSubmitted && !isPreview}
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
                                disabled={isSubmitted && !isPreview}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                                    isSubmitted && !isPreview
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
                                disabled={isSubmitted && !isPreview}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                                    isSubmitted && !isPreview
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

            {/* Allowed Formats Info
            {template.allowedFormats && (
                <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded">
                    <p className="text-gray-700 text-sm">
                        <strong>Desteklenen Formatlar:</strong> {template.allowedFormats}
                    </p>
                </div>
            )}
            */}
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
                        {template.subject && (
                            <div><strong>Konu:</strong> {template.subject}</div>
                        )}
                        {template.difficulty && (
                            <div><strong>Zorluk:</strong> {template.difficulty}</div>
                        )}
                        {template.points && (
                            <div><strong>Puan:</strong> {template.points}</div>
                        )}
                        {template.timeLimit && (
                            <div><strong>Süre:</strong> {template.timeLimit} saniye</div>
                        )}
                        {template.minRecordingDuration && (
                            <div><strong>Min. Kayıt:</strong> {formatTime(template.minRecordingDuration)}</div>
                        )}
                        {template.maxRecordingDuration && (
                            <div><strong>Maks. Kayıt:</strong> {formatTime(template.maxRecordingDuration)}</div>
                        )}
                        {template.requiresManualGrading !== undefined && (
                            <div><strong>Manuel Değerlendirme:</strong> {template.requiresManualGrading ? 'Evet' : 'Hayır'}</div>
                        )}
                        {template.allowScreenRecording !== undefined && (
                            <div><strong>Ekran Kaydı:</strong> {template.allowScreenRecording ? 'İzinli' : 'İzinsiz'}</div>
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
        - Implement video upload to backend/cloud storage
        - Add compression options for large video files
        - Handle upload progress indication
        - Add retry mechanism for failed uploads
        - Implement video quality settings
        - Support for multiple video formats
        - Add video thumbnail generation
        - Implement auto-save functionality
        - Handle network issues and offline scenarios
        - Add screen recording permission handling
        - Implement video playback controls
        - Add accessibility features (captions, transcripts)
        - Support for multiple languages/localization
        - Add AI-based video analysis (optional)
        - Implement plagiarism detection for videos
        - Add video editing features (trim, crop)
        - Handle browser compatibility issues
        - Add mobile device support
      */}
        </div>
    );
};

export default VideoResponseQuestion;