import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type ModalSize = "small" | "medium" | "large";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string | null;
    cancelText?: string | null;
    size?: ModalSize;
};

const sizeClasses: Record<ModalSize, string> = {
    small: "max-w-md",
    medium: "max-w-xl",
    large: "w-[79vw] max-h-[79vh]",
};

const ModalPanel: React.FC<ModalProps> = ({
                                         isOpen,
                                         onClose,
                                         title,
                                         children,
                                         onConfirm,
                                         onCancel,
                                         confirmText,
                                         cancelText,
                                         size = "small",
                                     }) => {
    const backdropRef = useRef(null);

    // ESC ile kapanma
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Dış tıklamayla kapanma
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === backdropRef.current) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={handleBackdropClick}
                    ref={backdropRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={`bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]} relative p-6 max-h-[90vh] flex flex-col`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-black"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

                        <div className="overflow-y-auto flex-1 pr-1">
                            {children}
                        </div>

                        {(confirmText || cancelText) && (
                            <div className="flex justify-end gap-3 mt-6">
                                {cancelText && onCancel && (
                                    <button
                                        onClick={onCancel}
                                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        {cancelText}
                                    </button>
                                )}
                                {confirmText && onConfirm && (
                                    <button
                                        onClick={onConfirm}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        {confirmText}
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalPanel;
