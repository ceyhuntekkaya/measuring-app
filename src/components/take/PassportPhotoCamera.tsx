import React, {useRef, useState, useCallback, useEffect} from 'react';
import siteConfig from "@/config/config.json";
import {showNotification} from "@/lib/notification";
import {EApplicationUpdateState} from "@/types/exam/enum";
import {useExamApplicationContext} from "@/contexts/ExamApplicationContext";

const API_URL = siteConfig.api.invokeUrl;

interface PassportPhotoCameraProps {
    applicationId: string;
    title: string;
    uploadState: string;
    updateState: EApplicationUpdateState;
}


const PassportPhotoCamera: React.FC<PassportPhotoCameraProps> = ({applicationId, title, uploadState, updateState}) => {

    const videoRef = useRef<HTMLVideoElement>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const {updateApplicationStateStatus} = useExamApplicationContext();

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: {ideal: 600},
                    height: {ideal: 800}
                }
            });
            setStream(mediaStream);
            setIsCameraActive(true);
            setCapturedPhoto(null);
        } catch (error) {
            console.log(error)
            alert('Kameraya erişim izni gerekli. Lütfen izin verin.');
        }
    }, []);

    // Stream değiştiğinde video elementine bağla
    useEffect(() => {
        if (stream && videoRef.current && isCameraActive) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current?.play().then(() => {
                    console.log('Video play() başarılı');
                }).catch(err => {
                    console.error('Video play() hatası:', err);
                });
            };
        }
    }, [stream, isCameraActive]);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setIsCameraActive(false);
        }
    }, [stream]);

    const capturePhoto = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const photoData = canvas.toDataURL('image/png');
                setCapturedPhoto(photoData);
                stopCamera();
            }
        }
    }, [stopCamera]);

    const retakePhoto = useCallback(() => {
        setCapturedPhoto(null);
        startCamera();
    }, [startCamera]);

    const uploadPhoto = async () => {
        if (!capturedPhoto) {
            alert("Yüklenecek fotoğraf bulunamadı.");
            return;
        }

        setIsUploading(true);

        try {
            // Base64'ü Blob'a çevir
            const response = await fetch(capturedPhoto);
            const blob = await response.blob();

            const formData = new FormData();
            // Blob'u File objesine çevirip ekliyoruz
            const photoFile = new File([blob], 'passport-photo.png', {
                type: 'image/png'
            });
            formData.append('files', photoFile);

            const xhr = new XMLHttpRequest();

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        JSON.parse(xhr.responseText);
                        //console.log(response)
                        showNotification.success('Fotğraf kaydı başarıyla yüklendi!');
                        updateApplicationStateStatus(updateState)
                        // Örneğin: onUploadComplete(response);
                    } catch (e) {
                        console.error(e);
                        showNotification.error('Fotoğraf kaydedilemedi...');
                    }
                } else {
                    alert(`Yükleme hatası: ${xhr.status}`);
                }
                setIsUploading(false);
            });

            xhr.addEventListener('error', () => {
                alert("Yükleme sırasında bir hata oluştu.");
                setIsUploading(false);
            });

            xhr.open('POST', `${API_URL}/upload/${applicationId}/${uploadState}`);

            const token = localStorage.getItem('accessToken');
            if (token) {
                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            }

            xhr.send(formData);

        } catch (err) {
            console.log(err);
            alert("Yükleme sırasında bir hata oluştu.");
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center  w-full  bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6   items-center justify-center">
                <h1 className="text-2xl font-bold text-center mb-13text-gray-800">
                    {title}
                </h1>

                <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-4 w-full  items-center justify-center  max-w-md"
                     style={{aspectRatio: '3/4', minHeight: '400px'}}>
                    {!isCameraActive && !capturedPhoto && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-16 h-16 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                <p className="text-gray-500 text-sm">Kamera kapalı</p>
                            </div>
                        </div>
                    )}

                    {isCameraActive && (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{display: 'block'}}
                        />
                    )}

                    {capturedPhoto && (
                        <img
                            src={capturedPhoto}
                            alt="Çekilen fotoğraf"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}

                    <canvas ref={canvasRef} className="hidden"/>
                </div>

                <div className="flex flex-col gap-3">
                    {!isCameraActive && !capturedPhoto && (
                        <button
                            onClick={startCamera}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                        >
                            Kamerayı Aç
                        </button>
                    )}

                    {isCameraActive && (
                        <>
                            <button
                                onClick={capturePhoto}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                            >
                                Fotoğraf Çek
                            </button>
                            <button
                                onClick={stopCamera}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                            >
                                İptal
                            </button>
                        </>
                    )}

                    {capturedPhoto && (
                        <>
                            <button
                                onClick={retakePhoto}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                            >
                                Tekrar Çek
                            </button>
                            {
                                /*
                                 <a
                                href={capturedPhoto}
                                download="vesikalik-fotograf.png"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-center"
                            >
                                Fotoğrafı İndir
                            </a>
                                 */
                            }

                            <button
                                onClick={uploadPhoto}
                                disabled={isUploading}
                                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isUploading ? 'YÜKLENIYOR...' : 'FOTOĞRAFI ONAYLA VE GÖNDER'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PassportPhotoCamera;