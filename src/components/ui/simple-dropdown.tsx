// components/ui/simple-dropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MoreVertical, LucideIcon } from 'lucide-react';


/*
<ActionButtons
    onAdd={() => console.log('Add clicked')}
    addButtonText="Ürün Ekle"
    dropdownActions={[
        { text: "Excel Aktar", icon: Download, onClick: () => console.log('Export') },
        { text: "Toplu Sil", icon: Trash, onClick: () => console.log('Delete') },
        { text: "Ayarlar", icon: Settings, onClick: () => console.log('Settings') }
    ]}
/>
 */
interface DropdownAction {
    text: string;
    icon: LucideIcon;
    onClick: () => void;
}

interface ActionButtonsProps {
    onAdd?: () => void;
    addButtonText?: string;
    dropdownActions?: DropdownAction[];
}

export function ActionButtons({
                                  onAdd,
                                  addButtonText = "Yeni Ekle",
                                  dropdownActions = []
                              }: ActionButtonsProps) {
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

    const hasDropdownActions = dropdownActions.length > 0;

    return (
        <div className="flex items-center gap-2">
            {/* Ana Ekle butonu */}
            {onAdd && (
                <Button onClick={onAdd}>
                    <Plus className="w-4 h-4 mr-2" />
                    {addButtonText}
                </Button>
            )}

            {/* Dropdown - sadece actions varsa göster */}
            {hasDropdownActions && (
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
                                {dropdownActions.map((action, index) => {
                                    const IconComponent = action.icon;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                action.onClick();
                                                setIsOpen(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <IconComponent className="mr-2 h-4 w-4" />
                                            {action.text}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}