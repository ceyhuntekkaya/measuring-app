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
        // Axios error formatı
        if ('response' in error && error.response) {
            const response = error.response as { data?: { message?: string; error?: string } };
            if (response.data?.message) {
                return response.data.message;
            }
            if (response.data?.error) {
                return response.data.error;
            }
        }
        // Error object with message
        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }
    }
    // Fallback
    return 'Bir hata oluştu';
};