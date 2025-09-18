// hooks/use-microphone-test.ts

import { useState, useCallback, useEffect, useRef } from 'react';
import {
    microphoneTestService,
    MicrophoneTestResult,
    AudioRecordingResult
} from '@/services/api/exam/microphone-service';

interface UseMicrophoneTestReturn {
    testResult: MicrophoneTestResult | null;
    audioLevel: number;
    isRecording: boolean;
    recordingResult: AudioRecordingResult | null;
    availableDevices: MediaDeviceInfo[];
    loading: boolean;
    error: Error | null;
    checkMicrophone: () => Promise<void>;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<void>;
    playRecording: (blob?: Blob) => Promise<void>;
    getAudioDevices: () => Promise<void>;
    stopTest: () => void;
    isTestActive: boolean;
}

export const useMicrophoneTest = (): UseMicrophoneTestReturn => {
    const [testResult, setTestResult] = useState<MicrophoneTestResult | null>(null);
    const [audioLevel, setAudioLevel] = useState<number>(0);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [recordingResult, setRecordingResult] = useState<AudioRecordingResult | null>(null);
    const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [isTestActive, setIsTestActive] = useState<boolean>(false);

    const audioLevelInterval = useRef<NodeJS.Timeout | null>(null);

    const checkMicrophone = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await microphoneTestService.checkMicrophoneAvailability();
            setTestResult(result);

            if (result.isAvailable && result.hasPermission) {
                setIsTestActive(true);
                // Start monitoring audio level
                audioLevelInterval.current = setInterval(() => {
                    const level = microphoneTestService.getAudioLevel();
                    setAudioLevel(level);
                }, 100);
            } else {
                setIsTestActive(false);
                if (result.error) {
                    setError(new Error(result.error));
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Mikrofon testi başarısız'));
            setIsTestActive(false);
        } finally {
            setLoading(false);
        }
    }, []);

    const startRecording = useCallback(async () => {
        try {
            setError(null);
            if (!testResult?.isAvailable) {
                throw new Error('Mikrofon kullanılamıyor');
            }

            await microphoneTestService.startRecording();
            setIsRecording(true);
            setRecordingResult(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Kayıt başlatılamadı'));
        }
    }, [testResult]);

    const stopRecording = useCallback(async () => {
        try {
            setError(null);
            if (!isRecording) return;

            const result = await microphoneTestService.stopRecording();
            setRecordingResult(result);
            setIsRecording(false);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Kayıt durdurulamadı'));
            setIsRecording(false);
        }
    }, [isRecording]);

    const playRecording = useCallback(async (blob?: Blob) => {
        try {
            setError(null);
            const audioBlob = blob || recordingResult?.blob;
            if (!audioBlob) {
                throw new Error('Oynatılacak ses kaydı bulunamadı');
            }

            await microphoneTestService.playRecording(audioBlob);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Ses kaydı oynatılamadı'));
        }
    }, [recordingResult]);

    const getAudioDevices = useCallback(async () => {
        try {
            setError(null);
            const devices = await microphoneTestService.getAudioDevices();
            setAvailableDevices(devices);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Ses cihazları alınamadı'));
        }
    }, []);

    const stopTest = useCallback(() => {
        if (audioLevelInterval.current) {
            clearInterval(audioLevelInterval.current);
            audioLevelInterval.current = null;
        }

        microphoneTestService.stopMicrophoneTest();
        setIsTestActive(false);
        setAudioLevel(0);
        setIsRecording(false);
        setTestResult(null);
        setRecordingResult(null);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopTest();
        };
    }, [stopTest]);

    // Auto-stop recording after 30 seconds
    useEffect(() => {
        if (isRecording) {
            const timeout = setTimeout(() => {
                stopRecording();
            }, 30000);

            return () => clearTimeout(timeout);
        }
    }, [isRecording, stopRecording]);

    return {
        testResult,
        audioLevel,
        isRecording,
        recordingResult,
        availableDevices,
        loading,
        error,
        checkMicrophone,
        startRecording,
        stopRecording,
        playRecording,
        getAudioDevices,
        stopTest,
        isTestActive
    };
};