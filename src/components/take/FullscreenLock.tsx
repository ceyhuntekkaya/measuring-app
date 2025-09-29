import React, { useEffect, useState, useRef } from 'react';

// Tarayıcı API tipleri için interface'ler
interface DocumentWithFullscreen extends Document {
    webkitFullscreenElement?: Element;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
}

interface ElementWithFullscreen extends HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
}

const FullscreenLock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showWarning, setShowWarning] = useState(true); // Başlangıçta uyarı göster
    const containerRef = useRef<HTMLDivElement>(null);
    const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Tam ekran durumunu kontrol et
    const checkFullscreen = () => {
        const doc = document as DocumentWithFullscreen;
        const isFull = !!(
            doc.fullscreenElement ||
            doc.webkitFullscreenElement ||
            doc.mozFullScreenElement ||
            doc.msFullscreenElement
        );
        setIsFullscreen(isFull);

        if (!isFull) {
            setShowWarning(true);
        } else {
            setShowWarning(false);
            if (warningTimeoutRef.current) {
                clearTimeout(warningTimeoutRef.current);
            }
        }
    };

    // Tam ekran isteği
    const requestFullscreen = async () => {
        try {
            const elem = containerRef.current as ElementWithFullscreen | null;
            if (!elem) return;

            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                await elem.webkitRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                await elem.mozRequestFullScreen();
            } else if (elem.msRequestFullscreen) {
                await elem.msRequestFullscreen();
            }
        } catch (err) {
            console.error('Tam ekran hatası:', err);
        }
    };

    // Tam ekrandan çık
    const exitFullscreen = async () => {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if ((document as DocumentWithFullscreen & { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
                await (document as DocumentWithFullscreen & { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
            } else if ((document as DocumentWithFullscreen & { mozCancelFullScreen?: () => Promise<void> }).mozCancelFullScreen) {
                await (document as DocumentWithFullscreen & { mozCancelFullScreen: () => Promise<void> }).mozCancelFullScreen();
            } else if ((document as DocumentWithFullscreen & { msExitFullscreen?: () => Promise<void> }).msExitFullscreen) {
                await (document as DocumentWithFullscreen & { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
            }
        } catch (err) {
            console.error('Tam ekrandan çıkış hatası:', err);
        }
    };

    useEffect(() => {
        // Fullscreen değişikliklerini dinle
        const events = [
            'fullscreenchange',
            'webkitfullscreenchange',
            'mozfullscreenchange',
            'MSFullscreenChange'
        ] as const;

        events.forEach(event => {
            document.addEventListener(event, checkFullscreen);
        });

        // Sayfa görünürlüğünü kontrol et (başka sekmeye geçildiğinde)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setShowWarning(true);
            } else {
                checkFullscreen();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, checkFullscreen);
            });
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (warningTimeoutRef.current) {
                clearTimeout(warningTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="relative w-screen h-screen bg-gray-900">
            {/* Geri butonu - sadece fullscreen iken görünür */}
            {isFullscreen && !showWarning && (
                <button
                    onClick={exitFullscreen}
                    className="absolute top-4 left-4 z-40 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                    title="Tam ekrandan çık"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}

            {/* Ana içerik */}
            <div
                className={`w-full h-full overflow-auto transition-all duration-300 ${
                    !isFullscreen || showWarning ? 'blur-lg scale-95 opacity-50' : ''
                }`}
            >
                {children}
            </div>

            {/* Uyarı overlay */}
            {(!isFullscreen || showWarning) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
                        <div className="mb-4">
                            <svg
                                className="w-16 h-16 mx-auto text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Tam Ekran Gerekli
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Bu sayfa tam ekran modunda kullanılmalıdır. Devam etmek için aşağıdaki butona tıklayın.
                        </p>
                        <button
                            onClick={requestFullscreen}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                        >
                            Tam Ekrana Geç
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FullscreenLock;