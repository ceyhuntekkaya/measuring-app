import React, { useState, useEffect, useRef } from 'react';
import { AudioResponseTemplateDto } from '@/types/exam/questionTemplates';
import {QuestionTemplateType} from "@/types/exam/examEntities";
import {EMediaType, EQuestionType} from "@/types/exam/enum";
import {UploadedFileDto} from "@/types/exam/miscDtos";
import {uploadAudioFile} from "@/services/api/upload-file";

interface AudioResponseQuestionProps {
    template: AudioResponseTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (questionId:string, template: QuestionTemplateType, selectedOption: string, type: EQuestionType, mediaType: EMediaType, isEmptyAnswer: boolean) => void;
    initialAnswer?: AudioAnswerData | null;
    isSubmitted?: boolean;
    showCorrectAnswer?: boolean;
    questionId: string;
}

interface AudioAnswerData {
    audioUrl?: string;
    audioBlob?: Blob;
    duration?: number;
    recordedAt?: string;
    fileName?: string;
    uploadedFileData?: UploadedFileDto; // Upload sonucu
}

const AudioResponseQuestion: React.FC<AudioResponseQuestionProps> = ({
                                                                         template,
                                                                         isPreview = false,
                                                                         onAnswerChange,
                                                                         initialAnswer = null,
                                                                         questionId,
                                                                         isSubmitted = false,
                                                                         showCorrectAnswer = false
                                                                     }) => {
    const [audioAnswer, setAudioAnswer] = useState<AudioAnswerData | null>(initialAnswer);

    const [audioAnswerPath, setAudioAnswerPath] = useState<string>('');
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [recordingTime, setRecordingTime] = useState<number>(0);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string>('');
    const [audioLevel, setAudioLevel] = useState<number>(0);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    console.log("ceyhun: ",mediaStream )
    console.log("ceyhun: ",showCorrectAnswer )

    useEffect(() => {
        setAudioAnswer(initialAnswer);
    }, [initialAnswer]);

    // Cleanup ONLY on unmount - EMPTY dependency array!
    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                try {
                    mediaRecorderRef.current.stop();
                } catch (e) {
                    console.error('Error stopping recorder on unmount:', e);
                }
            }
        };
    }, []);

    const setupAudioAnalyser = (stream: MediaStream): void => {
        try {
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);

            analyser.fftSize = 256;
            source.connect(analyser);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            updateAudioLevel();
        } catch (err) {
            console.error('Error setting up audio analyser:', err);
        }
    };

    const updateAudioLevel = (): void => {
        if (!analyserRef.current) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedLevel = Math.min(average / 128, 1);

        setAudioLevel(normalizedLevel);

        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };

    const handleUploadAudio = async (audioBlob: Blob, duration: number): Promise<AudioAnswerData> => {

        // Eğer entityId yoksa veya preview modundaysa upload yapma
        if (!questionId || isPreview) {
            const url = URL.createObjectURL(audioBlob);
            return {
                audioUrl: url,
                audioBlob: audioBlob,
                duration: duration,
                recordedAt: new Date().toISOString(),
                fileName: `audio-response-${Date.now()}.webm`
            };
        }

        setIsUploading(true);
        setUploadProgress(0);
        setError('');

        try {
            const uploadedFiles = await uploadAudioFile(
                audioBlob,
                questionId,
                'AUDIO_RESPONSE',
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

                setAudioAnswerPath(uploadedFile.path || '--')
                const url = URL.createObjectURL(audioBlob);

                return {
                    audioUrl: url,
                    audioBlob: audioBlob,
                    duration: duration,
                    recordedAt: new Date().toISOString(),
                    fileName: uploadedFile.fileName || `audio-response-${Date.now()}.webm`,
                    uploadedFileData: uploadedFile
                };
            } else {
                throw new Error('Upload başarısız: Sunucudan veri dönmedi');
            }

        } catch (err) {
            setIsUploading(false);
            const errorMsg = err instanceof Error ? err.message : 'Audio yükleme başarısız';
            setError(errorMsg);
            throw err;
        }
    };

    const startRecording = async (): Promise<void> => {
        if (isSubmitted && !isPreview) return;

        try {
            setError('');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMediaStream(stream);

            setupAudioAnalyser(stream);

            const options: MediaRecorderOptions = {
                mimeType: 'audio/webm;codecs=opus',
            };

            if (!MediaRecorder.isTypeSupported(options.mimeType || '')) {
                options.mimeType = 'audio/webm';
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
                const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
                const finalDuration = recordingTime;

                try {
                    // Upload audio and get the result
                    const newAudioData = await handleUploadAudio(blob, finalDuration);
                    setAudioAnswer(newAudioData);

                    // Call onAnswerChange if upload was successful
                    if (onAnswerChange && newAudioData.uploadedFileData) {
                        onAnswerChange(
                            questionId,
                            template,
                            newAudioData.uploadedFileData.path  || '',
                            EQuestionType.AUDIO_RESPONSE,
                            EMediaType.AUDIO,
                            false
                        );
                    }
                } catch (err) {
                    console.error('Upload failed:', err);
                    // Even if upload fails, keep the local audio
                    const url = URL.createObjectURL(blob);
                    setAudioAnswer({
                        audioUrl: url,
                        audioBlob: blob,
                        duration: finalDuration,
                        recordedAt: new Date().toISOString(),
                        fileName: `audio-response-${Date.now()}.webm`
                    });
                }

                // Cleanup
                stream.getTracks().forEach(track => track.stop());
                setMediaStream(null);
                setAudioLevel(0);

                if (animationFrameRef.current) {
                    cancelAnimationFrame(animationFrameRef.current);
                    animationFrameRef.current = null;
                }
                if (audioContextRef.current) {
                    audioContextRef.current.close();
                    audioContextRef.current = null;
                }
            };

            mediaRecorder.start();
            setIsRecording(true);
            setIsPaused(false);
            setRecordingTime(0);

            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }

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
            const errorMessage = err instanceof Error ? err.message : 'Mikrofon erişimi sağlanamadı';
            setError(errorMessage);
            console.error('Error accessing microphone:', err);
        }
    };

    const handleSaveAnswer = () => {
        if (onAnswerChange && audioAnswerPath) {
            // If we have uploaded file data, use its ID
            onAnswerChange(
                questionId,
                template,
                audioAnswerPath,
                EQuestionType.AUDIO_RESPONSE,
                EMediaType.AUDIO,
                !audioAnswer
            );
        }
    }

    const pauseRecording = (): void => {
        if (mediaRecorderRef.current && isRecording && !isPaused) {
            mediaRecorderRef.current.pause();
            setIsPaused(true);

            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        }
    };

    const resumeRecording = (): void => {
        if (mediaRecorderRef.current && isRecording && isPaused) {
            mediaRecorderRef.current.resume();
            setIsPaused(false);

            timerIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    const newTime = prev + 1;

                    if (template.maxRecordingDuration && newTime >= template.maxRecordingDuration) {
                        stopRecording();
                    }

                    return newTime;
                });
            }, 1000);
        }
    };

    const stopRecording = (): void => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);

            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        }
    };

    const deleteRecording = (): void => {
        if (isSubmitted && !isPreview) return;

        setAudioAnswer(null);
        setRecordingTime(0);
        setUploadProgress(0);

        if (onAnswerChange) {
            onAnswerChange(questionId, template, '', EQuestionType.AUDIO_RESPONSE, EMediaType.AUDIO, true);
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
        if (!audioAnswer?.duration) return false;

        const duration = audioAnswer.duration;

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

        if (isRecording && !isPaused) {
            return "bg-red-500 hover:bg-red-600 animate-pulse";
        }

        return "bg-blue-500 hover:bg-blue-600";
    };

    const renderAudioLevelMeter = (): React.ReactNode => {
        if (!isRecording || isPaused) return null;

        return (
            <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                        style={{ width: `${audioLevel * 100}%` }}
                    />
                </div>
                <span className="text-xs text-gray-600 w-8">{Math.round(audioLevel * 100)}%</span>
            </div>
        );
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

            {template.audioPromptUrl && (
                <div className="mb-6">
                    <audio src={template.audioPromptUrl} controls className="w-full">
                        Tarayıcınız ses oynatmayı desteklemiyor.
                    </audio>
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
                        <span className="text-sm font-medium text-blue-800">Ses dosyası yükleniyor...</span>
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

            <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
                {isRecording && (
                    <div className="mb-6">
                        <div className="bg-white p-4 rounded-lg border-2 border-blue-500">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-gray-700">Kayıt Durumu:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    isPaused ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {isPaused ? '⏸ Duraklatıldı' : '● Kaydediliyor'}
                                </span>
                            </div>
                            {renderAudioLevelMeter()}
                        </div>
                    </div>
                )}

                {audioAnswer?.audioUrl && !isRecording && (
                    <div className="mb-6">
                        <div className="bg-white p-4 rounded-lg border-2 border-green-500">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-700">Kaydedilen Ses:</h4>
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Süre:</span> {formatTime(audioAnswer.duration || 0)}
                                    {audioAnswer.uploadedFileData && (
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
                            <audio src={audioAnswer.audioUrl} controls className="w-full">
                                Tarayıcınız ses oynatmayı desteklemiyor.
                            </audio>
                        </div>
                    </div>
                )}

                {isRecording && (
                    <div className="mb-6 text-center">
                        <div className="inline-flex items-center space-x-3 bg-white px-6 py-3 rounded-full border-2 border-gray-300 shadow-lg">
                            <div className={`w-4 h-4 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
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

                <div className="flex items-center justify-center space-x-3">
                    {!audioAnswer && !isRecording && (
                        <button
                            onClick={startRecording}
                            disabled={(isSubmitted && !isPreview) || isUploading}
                            className={`px-6 py-3 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${getRecordingButtonStyle()}`}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                            </svg>
                            <span>Kaydı Başlat</span>
                        </button>
                    )}

                    {isRecording && !isPaused && (
                        <>
                            <button onClick={pauseRecording} className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>Duraklat</span>
                            </button>
                            <button onClick={stopRecording} className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                                </svg>
                                <span>Durdur</span>
                            </button>
                        </>
                    )}

                    {isRecording && isPaused && (
                        <>
                            <button onClick={resumeRecording} className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                                <span>Devam Et</span>
                            </button>
                            <button onClick={stopRecording} className="px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                                </svg>
                                <span>Durdur</span>
                            </button>
                        </>
                    )}

                    {audioAnswer && !isRecording && (
                        <>
                            <button
                                onClick={deleteRecording}
                                disabled={(isSubmitted && !isPreview) || isUploading}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                                    (isSubmitted && !isPreview) || isUploading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'
                                }`}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span>Kaydı Sil</span>
                            </button>
                            <button
                                onClick={startRecording}
                                disabled={(isSubmitted && !isPreview) || isUploading}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                                    (isSubmitted && !isPreview) || isUploading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                                <span>Yeniden Kaydet</span>
                            </button>
                        </>
                    )}
                </div>

                {!audioAnswer && !isRecording && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">Mikrofon ile sesli yanıt kaydedebilirsiniz</p>
                    </div>
                )}
            </div>

            <button
                className={"btn btn-success"}
                onClick={handleSaveAnswer}
                disabled={isUploading || !audioAnswer}
            >
                KAYDET
            </button>

            {isSubmitted && audioAnswer && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <p className="text-green-800 font-semibold">Sesli yanıtınız başarıyla gönderildi</p>
                    </div>
                    {template.requiresManualGrading && (
                        <p className="text-green-700 text-sm mt-2">
                            Değerlendirme tamamlandığında sonuçları görebileceksiniz.
                        </p>
                    )}
                </div>
            )}

            {isPreview && (
                <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded">
                    <p className="text-gray-600 text-sm italic">
                        👁️ Önizleme Modu - Bu sorunun nasıl görüneceğinin önizlemesidir
                    </p>
                </div>
            )}

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
                        {template.tags && template.tags.length > 0 && (
                            <div className="col-span-2"><strong>Etiketler:</strong> {template.tags.join(', ')}</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AudioResponseQuestion;