'use client';

import { X } from 'lucide-react';

interface ChatPanelProps {
    onClose: () => void;
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
    return (
        <div className="fixed bottom-24 right-6 w-80 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
            {/* Header */}
            <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Gözetmen</h3>
                </div>
                <button
                    onClick={onClose}
                    className="hover:bg-blue-700 rounded p-1 transition-colors"
                    aria-label="Kapat"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Disabled Message */}
            <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
                <div className="text-center text-gray-500">
                    <p className="text-sm font-medium mb-2">Chat özelliği devre dışı</p>
                    <p className="text-xs">Bu özellik şu an kapalı</p>
                </div>
            </div>
        </div>
    );
}