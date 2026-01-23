'use client';

import { toast, ToastOptions, ToastContent, Id, TypeOptions } from 'react-toastify';

// Varsayılan Toast ayarları
const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

// Global bildirim fonksiyonları
export const showNotification = {
    success: (message: string, options: ToastOptions = {}) => {
        return toast.success(message, {
            ...defaultOptions,
            ...options,
        });
    },
    error: (message: string, options: ToastOptions = {}) => {
        return toast.error(message, {
            ...defaultOptions,
            autoClose: 5000, // Hatalar için daha uzun süre
            ...options,
        });
    },
    info: (message: string, options: ToastOptions = {}) => {
        return toast.info(message, {
            ...defaultOptions,
            ...options,
        });
    },
    warning: (message: string, options: ToastOptions = {}) => {
        return toast.warning(message, {
            ...defaultOptions,
            autoClose: 4000, // Uyarılar için biraz daha uzun süre
            ...options,
        });
    },
    loading: (message: string, options: ToastOptions = {}) => {
        return toast.loading(message, {
            ...defaultOptions,
            ...options,
        });
    },
    // Mevcut bir bildirimi güncelle (loading -> success/error vb.)
    update: (toastId: Id, options: { type?: TypeOptions; render: ToastContent; autoClose?: number | false }) => {
        return toast.update(toastId, options);
    },
    // Bildirimi kapat
    dismiss: (toastId?: Id) => {
        toast.dismiss(toastId);
    }
};

// API hata mesajlarını parse eden helper fonksiyon
export const getErrorMessage = (error: unknown): string => {
   
    
    if (error && typeof error === 'object') {
        // Axios error formatı - backend ApiResponse formatını kontrol et
        if ('response' in error && error.response) {
            const response = error.response as { 
                data?: { 
                    success?: boolean;
                    message?: string; 
                    error?: string;
                    errors?: string[] | string;
                } 
            };
            
            
            
            // ApiResponse formatı: { success: false, message: "...", errors: [...] }
            // success: false ise message field'ında hata açıklaması var
            if (response.data) {
                // Önce message field'ını kontrol et (backend'in gönderdiği ana hata mesajı)
                // success: false durumunda message field'ı hata mesajını içerir
                if (response.data.message && typeof response.data.message === 'string') {
                    const trimmedMessage = response.data.message.trim();
                   
                    if (trimmedMessage) {
                        return trimmedMessage;
                    }
                }
                
                // errors array'i varsa, ilk hatayı al
                if (response.data.errors) {
                    if (Array.isArray(response.data.errors) && response.data.errors.length > 0) {
                        const firstError = response.data.errors[0];
                        if (typeof firstError === 'string' && firstError.trim()) {
                            return firstError;
                        }
                    }
                    if (typeof response.data.errors === 'string' && response.data.errors.trim()) {
                        return response.data.errors;
                    }
                }
                
                // error field'ı varsa (alternatif format)
                if (response.data.error && typeof response.data.error === 'string' && response.data.error.trim()) {
                    return response.data.error;
                }
                
            } 
        } 
        
        // Error object with message - önce error.message'i kontrol et
        // (customInstance veya response interceptor'da oluşturduğumuz error'un message'i backend'den geliyor olabilir)
        if ('message' in error && typeof error.message === 'string') {
            const message = error.message.trim();
            // Eğer message "İşlem başarısız oldu" değilse ve genel bir hata mesajı değilse, kullan
            if (message && message !== 'İşlem başarısız oldu' && !message.includes('Request failed with status code')) {
                return message;
            }
        }
    }
    // Fallback
    return 'Bir hata oluştu';
};