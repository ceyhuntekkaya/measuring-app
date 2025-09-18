// services/microphone-test-service.ts

export interface MicrophoneTestResult {
    isAvailable: boolean;
    hasPermission: boolean;
    audioLevel: number;
    error?: string;
}

export interface AudioRecordingResult {
    blob: Blob;
    duration: number;
    size: number;
}

declare global {
    interface Window {
        webkitAudioContext?: typeof AudioContext;
    }
}

class MicrophoneTestService {
    private mediaStream: MediaStream | null = null;
    private audioContext: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private recordedChunks: Blob[] = [];



    async checkMicrophoneAvailability(): Promise<MicrophoneTestResult> {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                return {
                    isAvailable: false,
                    hasPermission: false,
                    audioLevel: 0,
                    error: 'Mikrofon desteği bulunamadı'
                };
            }

            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // Cross-browser AudioContext
            const AudioContextClass = window.AudioContext || window.webkitAudioContext!;
            this.audioContext = new AudioContextClass();

            const source = this.audioContext.createMediaStreamSource(this.mediaStream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            source.connect(this.analyser);

            return {
                isAvailable: true,
                hasPermission: true,
                audioLevel: 0
            };
        } catch (error: unknown) {
            let errorMessage = 'Mikrofon erişim hatası';

            if (error instanceof DOMException) {
                if (error.name === 'NotAllowedError') {
                    errorMessage = 'Mikrofon izni reddedildi';
                } else if (error.name === 'NotFoundError') {
                    errorMessage = 'Mikrofon bulunamadı';
                } else if (error.name === 'NotReadableError') {
                    errorMessage = 'Mikrofon kullanımda';
                }
            }

            return {
                isAvailable: false,
                hasPermission: false,
                audioLevel: 0,
                error: errorMessage
            };
        }
    }

    getAudioLevel(): number {
        if (!this.analyser) return 0;

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }

        return sum / bufferLength / 255; // Normalize to 0-1
    }

    async startRecording(): Promise<void> {
        if (!this.mediaStream) {
            throw new Error('Mikrofon stream bulunamadı');
        }

        this.recordedChunks = [];
        this.mediaRecorder = new MediaRecorder(this.mediaStream, {
            mimeType: 'audio/webm;codecs=opus'
        });

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.recordedChunks.push(event.data);
            }
        };

        this.mediaRecorder.start(1000); // Collect data every 1 second
    }

    async stopRecording(): Promise<AudioRecordingResult> {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder) {
                reject(new Error('MediaRecorder bulunamadı'));
                return;
            }

            const startTime = Date.now();

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'audio/webm;codecs=opus' });
                const duration = Date.now() - startTime;

                resolve({
                    blob,
                    duration,
                    size: blob.size
                });
            };

            this.mediaRecorder.onerror = (error) => {
                reject(error);
            };

            this.mediaRecorder.stop();
        });
    }

    async playRecording(blob: Blob): Promise<void> {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            const url = URL.createObjectURL(blob);

            audio.src = url;
            audio.onended = () => {
                URL.revokeObjectURL(url);
                resolve();
            };
            audio.onerror = reject;

            audio.play();
        });
    }

    stopMicrophoneTest(): void {
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }

        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }

        this.analyser = null;
    }

    async getAudioDevices(): Promise<MediaDeviceInfo[]> {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => device.kind === 'audioinput');
    }
}

export const microphoneTestService = new MicrophoneTestService();