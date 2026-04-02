'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Checkbox from "@/components/ui/checkbox";
import { NumberInput } from "@/components/ui/number-input";
import type { DragAndDropTemplateDto, DraggableItem, DropZone, DragAndDropOptions } from "@/api/generated/model";
import { Trash2, Plus } from "lucide-react";
import HtmlEditor from "@/components/ui/html-editor";

interface DragAndDropTemplateFormProps {
    value?: DragAndDropTemplateDto | null;
    onChange: (data: DragAndDropTemplateDto) => void;
    loading?: boolean;
}

interface DragAndDropTemplateFormErrors {
    instructions?: string;
    draggableItems?: string;
    dropZones?: string;
}

// Validation handle için ref interface
export interface DragAndDropTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => DragAndDropTemplateFormErrors;
}

const DragAndDropTemplateForm = forwardRef<DragAndDropTemplateFormHandle, DragAndDropTemplateFormProps>(({
                                                                                                             value,
                                                                                                             onChange,
                                                                                                         }, ref) => {
    const [formData, setFormData] = useState<DragAndDropTemplateDto>({
        instructions: '',
        options: undefined,
        allowMultipleItemsPerZone: false,
        shuffleDraggableItems: true,
        explanation: '' // UI'dan kaldırıldı, her zaman boş string
    });

    const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([]);
    const [dropZones, setDropZones] = useState<DropZone[]>([]);
    const [errors, setErrors] = useState<DragAndDropTemplateFormErrors>({});
    const isSyncingFromValueRef = useRef(false);

    // Value değiştiğinde form data'yı güncelle (Update modu için)
    useEffect(() => {
        if (value) {
            isSyncingFromValueRef.current = true;
            setFormData({
                instructions: value.instructions || '',
                options: value.options || undefined,
                allowMultipleItemsPerZone: value.allowMultipleItemsPerZone || false,
                shuffleDraggableItems: value.shuffleDraggableItems ?? true,
                explanation: '' // UI'dan kaldırıldı, her zaman boş string
            });

            // Parse options to get draggable items and drop zones
            if (value.options) {
                try {
                    const options = typeof value.options === 'string'
                        ? JSON.parse(value.options)
                        : value.options;

                    if (options.draggableItems) {
                        setDraggableItems(options.draggableItems);
                    }
                    if (options.dropZones) {
                        setDropZones(options.dropZones);
                    }
                } catch (error) {
                    console.error('Error parsing options:', error);
                }
            }
        }
    }, [value]);

    // Form data veya items değiştiğinde parent'a bildir (Anlık güncelleme)
    useEffect(() => {
        if (isSyncingFromValueRef.current) {
            isSyncingFromValueRef.current = false;
            return;
        }
        // İlk render'da boş form için onChange tetikleme
        if (formData.instructions || draggableItems.length > 0 || dropZones.length > 0) {
            const dragAndDropOptions: DragAndDropOptions = {
                draggableItems,
                dropZones
            };

            const templateData: DragAndDropTemplateDto = {
                ...value,
                instructions: formData.instructions,
                options: dragAndDropOptions,
                allowMultipleItemsPerZone: formData.allowMultipleItemsPerZone,
                shuffleDraggableItems: formData.shuffleDraggableItems,
                explanation: '' // UI'dan kaldırıldı, her zaman boş string
            };

            onChange(templateData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData, draggableItems, dropZones]); // onChange ve value bağımlılığı yok - onChange parent'tan geliyor ve her render'da değişebilir

    const handleChange = <T extends keyof DragAndDropTemplateDto>(
        name: T,
        newValue: DragAndDropTemplateDto[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Hata varsa temizle
        if (errors[name as keyof DragAndDropTemplateFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    // Draggable Items Management
    const addDraggableItem = () => {
        const newItem: DraggableItem = {
            id: `item_${Date.now()}`,
            text: '',
            mediaUrl: '',
            mediaType: '',
            correctZones: []
        };
        setDraggableItems(prev => [...prev, newItem]);
    };

    const removeDraggableItem = (index: number) => {
        setDraggableItems(prev => prev.filter((_, i) => i !== index));
    };

    const updateDraggableItem = <K extends keyof DraggableItem>(
        index: number,
        field: K,
        newValue: DraggableItem[K]
    ) => {
        setDraggableItems(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: newValue } : item
        ));
    };

    const updateCorrectZones = (itemIndex: number, zoneId: string, isChecked: boolean) => {
        setDraggableItems(prev => prev.map((item, i) => {
            if (i === itemIndex) {
                const currentZones = item.correctZones || [];
                if (isChecked) {
                    return { ...item, correctZones: [...currentZones, zoneId] };
                } else {
                    return { ...item, correctZones: currentZones.filter(id => id !== zoneId) };
                }
            }
            return item;
        }));
    };

    // Drop Zones Management
    const addDropZone = () => {
        const newZone: DropZone = {
            id: `zone_${Date.now()}`,
            label: '',
            maxItems: 1,
            feedback: '',
            position: ''
        };
        setDropZones(prev => [...prev, newZone]);
    };

    const removeDropZone = (index: number) => {
        setDropZones(prev => prev.filter((_, i) => i !== index));
    };

    const updateDropZone = <K extends keyof DropZone>(
        index: number,
        field: K,
        newValue: DropZone[K]
    ) => {
        setDropZones(prev => prev.map((zone, i) =>
            i === index ? { ...zone, [field]: newValue } : zone
        ));
    };

    // Validation fonksiyonu - parent tarafından çağrılacak
    const validateForm = (): boolean => {
        const newErrors: DragAndDropTemplateFormErrors = {};

        if (!formData.instructions?.trim()) {
            newErrors.instructions = 'Talimatlar zorunludur';
        }

        if (draggableItems.length === 0) {
            newErrors.draggableItems = 'En az bir sürüklenebilir öğe eklemelisiniz';
        } else {
            const hasEmptyItems = draggableItems.some(item => !item.text?.trim());
            if (hasEmptyItems) {
                newErrors.draggableItems = 'Tüm sürüklenebilir öğelerin metni doldurulmalıdır';
            }
        }

        if (dropZones.length === 0) {
            newErrors.dropZones = 'En az bir bırakma bölgesi eklemelisiniz';
        } else {
            const hasEmptyZones = dropZones.some(zone => !zone.label?.trim());
            if (hasEmptyZones) {
                newErrors.dropZones = 'Tüm bırakma bölgelerinin etiketi doldurulmalıdır';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Parent component'in validate fonksiyonunu çağırabilmesi için
    useImperativeHandle(ref, () => ({
        validate: validateForm,
        getErrors: () => errors
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sürükle ve Bırak Şablon Detayları</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Talimatlar */}
                    <div className="space-y-2">
                        <Label htmlFor="instructions">Talimatlar *</Label>
                        <HtmlEditor
                            id="instructions"
                            value={formData.instructions || ''}
                            onChange={(html) => handleChange('instructions', html)}
                            error={!!errors.instructions}
                            minHeightClassName="min-h-[100px]"
                            placeholder="Sürükle ve bırak talimatlarını giriniz"
                        />
                        {errors.instructions && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.instructions}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Ayarlar */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="allowMultipleItemsPerZone"
                                checked={formData.allowMultipleItemsPerZone}
                                onChange={(checked) => handleChange('allowMultipleItemsPerZone', !!checked)}
                            />
                            <Label htmlFor="allowMultipleItemsPerZone">Her Bölgeye Çoklu Öğe İzni</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="shuffleDraggableItems"
                                checked={formData.shuffleDraggableItems}
                                onChange={(checked) => handleChange('shuffleDraggableItems', !!checked)}
                            />
                            <Label htmlFor="shuffleDraggableItems">Sürüklenebilir Öğeleri Karıştır</Label>
                        </div>
                    </div>

                    {/* Sürüklenebilir Öğeler */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Sürüklenebilir Öğeler *</Label>
                            <Button
                                type="button"
                                onClick={addDraggableItem}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Öğe Ekle
                            </Button>
                        </div>

                        {draggableItems.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                                <div className="col-span-8">
                                    <Label>Metin *</Label>
                                    <Input
                                        value={item.text || ''}
                                        onChange={(e) => updateDraggableItem(index, 'text', e.target.value)}
                                        placeholder="Öğe metni"
                                    />
                                </div>

                              

                                <div className="col-span-3">
                                    <Label>Doğru Bölgeler</Label>
                                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                                        {dropZones.length > 0 ? (
                                            dropZones.map((zone) => (
                                                <div key={zone.id} className="flex items-center space-x-1">
                                                    <Checkbox
                                                        checked={item.correctZones?.includes(zone.id || '') || false}
                                                        onChange={(checked) => updateCorrectZones(index, zone.id || '', !!checked)}
                                                    />
                                                    <span className="text-xs">{zone.label || ''}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-500">Önce bölge ekleyin</span>
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        onClick={() => removeDraggableItem(index)}
                                        variant="destructive"
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {errors.draggableItems && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.draggableItems}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Bırakma Bölgeleri */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Bırakma Bölgeleri *</Label>
                            <Button
                                type="button"
                                onClick={addDropZone}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Bölge Ekle
                            </Button>
                        </div>

                        {dropZones.map((zone, index) => (
                            <div key={zone.id} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                                <div className="col-span-4">
                                    <Label>Etiket *</Label>
                                    <Input
                                        value={zone.label || ''}
                                        onChange={(e) => updateDropZone(index, 'label', e.target.value)}
                                        placeholder="Bölge etiketi"
                                    />
                                </div>

                                <div className="col-span-3">
                                    <Label>Maksimum Öğe</Label>
                                    <NumberInput
                                        inputType={"number"}
                                        value={zone.maxItems || 1}
                                        onChange={(val) => updateDropZone(index, 'maxItems', val)}
                                        minValue={1}
                                        decimalPlaces={0}
                                    />
                                </div>

                                <div className="col-span-4">
                                    <Label>Pozisyon</Label>
                                    <Input
                                        value={zone.position || ''}
                                        onChange={(e) => updateDropZone(index, 'position', e.target.value)}
                                        placeholder="left, right, center"
                                    />
                                </div>

                                {/* Geri Bildirim - YORUM SATIRI: UI'dan kaldırıldı, belki sonra tekrar gösterilebilir */}
                                {/* <div className="col-span-4">
                                    <Label>Geri Bildirim</Label>
                                    <Textarea
                                        value={zone.feedback || ''}
                                        onChange={(e) => updateDropZone(index, 'feedback', e.target.value)}
                                        placeholder="Bölge geri bildirimi"
                                        className="min-h-[60px]"
                                    />
                                </div> */}

                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        onClick={() => removeDropZone(index)}
                                        variant="destructive"
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {errors.dropZones && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.dropZones}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Açıklama - YORUM SATIRI: UI'dan kaldırıldı, API'ye boş string gönderiliyor */}
                    {/* <div className="space-y-2">
                        <Label htmlFor="explanation">Açıklama</Label>
                        <Textarea
                            id="explanation"
                            value={formData.explanation}
                            onChange={(e) => handleChange('explanation', e.target.value)}
                            className="min-h-[100px]"
                            placeholder="Doğru cevap açıklaması"
                        />
                    </div> */}

                    {/* KAYDET BUTONU KALDIRILDI - Parent component'te olacak */}
                </div>
            </CardContent>
        </Card>
    );
});

DragAndDropTemplateForm.displayName = 'DragAndDropTemplateForm';

export default DragAndDropTemplateForm;