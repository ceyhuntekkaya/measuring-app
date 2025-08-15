// components/ui/simple-dropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Trash, MoreVertical } from 'lucide-react';

interface ActionButtonsProps {
    onAdd?: () => void;
    onExport?: () => void;
    onDelete?: () => void;
}

export function ActionButtons({ onAdd, onExport, onDelete }: ActionButtonsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex items-center gap-2">
            {/* Ana Ekle butonu */}
            <Button onClick={onAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Ekle
            </Button>

            {/* Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <MoreVertical className="h-4 w-4" />
                </Button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                            <button
                                onClick={() => {
                                    onExport?.();
                                    setIsOpen(false);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Excel Aktar
                            </button>
                            <button
                                onClick={() => {
                                    onDelete?.();
                                    setIsOpen(false);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Toplu Sil
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}