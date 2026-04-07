'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { HotSpotTemplateDto, HotSpotArea, HotSpotOptions } from "@/api/generated/model";
import { Trash2, Plus } from "lucide-react";
import Checkbox from "@/components/ui/checkbox";

interface HotSpotTemplateFormProps {
    value?: HotSpotTemplateDto | null;
    onChange: (data: HotSpotTemplateDto) => void;
    loading?: boolean;
}

// Use ORVAL DTO types directly - only template-specific fields
type HotSpotTemplateFormData = Pick<HotSpotTemplateDto,  'imageUrl' | 'options' >;

interface HotSpotTemplateFormErrors {
    instructions?: string;
    imageUrl?: string;
    options?: string;
    maxSelections?: string;
}

// Validation handle için ref interface
export interface HotSpotTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => HotSpotTemplateFormErrors;
}

const HotSpotTemplateForm = forwardRef<HotSpotTemplateFormHandle, HotSpotTemplateFormProps>(({
                                                                                                 value,
                                                                                                 onChange,
                                                                                             }, ref) => {
    const [formData, setFormData] = useState<HotSpotTemplateFormData>({
        imageUrl: '',
        options: {
            backgroundImageUrl: '',
            hotSpots: [],
            selectionType: 'SINGLE'
        },
    });

    const [errors, setErrors] = useState<HotSpotTemplateFormErrors>({});

    // Value değiştiğinde form data'yı güncelle (Update modu için)
    useEffect(() => {
        if (value) {
            setFormData({
                imageUrl: value.imageUrl || '',
                options: value.options || {
                    backgroundImageUrl: '',
                    hotSpots: [],
                    selectionType: 'SINGLE'
                },
            });
        }
    }, []);

    // Form data değiştiğinde parent'a bildir (Anlık güncelleme)
    useEffect(() => {
        // İlk render'da boş form için onChange tetikleme
        if ( formData.imageUrl || (formData.options?.hotSpots ?? []).length > 0) {
            // Background image URL'yi sync et
            const optionsWithImage: HotSpotOptions = {
                ...formData.options,
                backgroundImageUrl: formData.imageUrl
            };

            const templateData: HotSpotTemplateDto = {
                ...value,
                imageUrl: formData.imageUrl,
                options: optionsWithImage,
            };

            onChange(templateData);
        }
    }, [formData]); // onChange ve value bağımlılığı yok - sonsuz döngü önlendi

    const handleChange = <T extends keyof HotSpotTemplateFormData>(
        name: T,
        newValue: HotSpotTemplateFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Hata varsa temizle
        if (errors[name as keyof HotSpotTemplateFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const addHotSpot = () => {
        const newHotSpot: HotSpotArea = {
            id: `hotspot_${Date.now()}`,
            shape: 'RECTANGLE',
            coordinates: '',
            isCorrect: false,
            feedback: '',
            label: ''
        };

        setFormData(prev => ({
            ...prev,
            options: {
                ...prev.options,
                hotSpots: [...(prev.options?.hotSpots || []), newHotSpot]
            }
        }));
    };

    const removeHotSpot = (index: number) => {
        setFormData(prev => ({
            ...prev,
            options: {
                ...prev.options,
                hotSpots: prev.options?.hotSpots?.filter((_, i) => i !== index) || []
            }
        }));
    };

    const updateHotSpot = <K extends keyof HotSpotArea>(
        index: number,
        field: K,
        newValue: HotSpotArea[K]
    ) => {
        setFormData(prev => ({
            ...prev,
            options: {
                ...prev.options,
                hotSpots: prev.options?.hotSpots?.map((hotSpot, i) =>
                    i === index ? { ...hotSpot, [field]: newValue } : hotSpot
                ) || []
            }
        }));
    };

    // Validation fonksiyonu - parent tarafından çağrılacak
    const validateForm = (): boolean => {
        const newErrors: HotSpotTemplateFormErrors = {};

        

        if (!formData.imageUrl?.trim() && !formData.options?.backgroundImageUrl?.trim()) {
            newErrors.imageUrl = 'Arkaplan resmi URL\'si zorunludur';
        }

        if (!formData.options?.hotSpots || formData.options.hotSpots.length === 0) {
            newErrors.options = 'En az bir sıcak nokta tanımlanmalıdır';
        } else {
            const hasEmptyHotSpots = formData.options.hotSpots.some(hotSpot =>
                !hotSpot.coordinates?.trim() || !hotSpot.label?.trim()
            );
            if (hasEmptyHotSpots) {
                newErrors.options = 'Tüm sıcak noktaların koordinatları ve etiketleri doldurulmalıdır';
            }

            const hasCorrectHotSpot = formData.options.hotSpots.some(hotSpot => hotSpot.isCorrect);
            if (!hasCorrectHotSpot) {
                newErrors.options = 'En az bir doğru sıcak nokta işaretlenmelidir';
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
                <CardTitle>Sıcak Nokta Şablon Detayları</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                   

                    {/* Arkaplan Resmi */}
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Arkaplan Resmi URL *</Label>
                        <Input
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={(e) => handleChange('imageUrl', e.target.value)}
                            className={errors.imageUrl ? 'border-red-500' : ''}
                            placeholder="Arkaplan resmi URL'sini giriniz"
                        />
                        {errors.imageUrl && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.imageUrl}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Ayarlar Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Seçim Tipi */}
                        <div className="space-y-2">
                            <Label htmlFor="selectionType">Seçim Tipi</Label>
                            <Select
                                onValueChange={(val) => handleChange('options', {
                                    ...formData.options,
                                    selectionType: val as string
                                })}
                                value={formData.options?.selectionType || 'SINGLE'}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seçim tipi seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="SINGLE">Tekli Seçim</SelectItem>
                                        <SelectItem value="MULTIPLE">Çoklu Seçim</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                      

                    </div>

                    {/* Sıcak Noktalar */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Sıcak Noktalar *</Label>
                            <Button
                                type="button"
                                onClick={addHotSpot}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Sıcak Nokta Ekle
                            </Button>
                        </div>

                        {formData.options?.hotSpots?.map((hotSpot, index) => (
                            <div key={hotSpot.id || index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                                <div className="col-span-1">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={hotSpot.isCorrect || false}
                                            onChange={(checked) => updateHotSpot(index, 'isCorrect', !!checked)}
                                        />
                                        <Label className="text-sm">Doğru</Label>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <Label>Şekil</Label>
                                    <Select
                                        onValueChange={(val) => updateHotSpot(index, 'shape', val as string)}
                                        value={hotSpot.shape || 'RECTANGLE'}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="RECTANGLE">Dikdörtgen</SelectItem>
                                                <SelectItem value="CIRCLE">Daire</SelectItem>
                                                <SelectItem value="POLYGON">Çokgen</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-2">
                                    <Label>Etiket *</Label>
                                    <Input
                                        value={hotSpot.label || ''}
                                        onChange={(e) => updateHotSpot(index, 'label', e.target.value)}
                                        placeholder="Etiket giriniz"
                                    />
                                </div>

                                <div className="col-span-3">
                                    <Label>Koordinatlar *</Label>
                                    <Input
                                        value={hotSpot.coordinates || ''}
                                        onChange={(e) => updateHotSpot(index, 'coordinates', e.target.value)}
                                        placeholder="x,y,width,height veya x,y,radius"
                                    />
                                </div>

                                <div className="col-span-3">
                                    <Label>Geri Bildirim</Label>
                                    <Input
                                        value={hotSpot.feedback || ''}
                                        onChange={(e) => updateHotSpot(index, 'feedback', e.target.value)}
                                        placeholder="Geri bildirim (opsiyonel)"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        onClick={() => removeHotSpot(index)}
                                        variant="primary"
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {errors.options && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.options}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Koordinat Yardımı */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <Label className="text-sm font-medium text-blue-800">Koordinat Formatları:</Label>
                        <div className="text-sm text-blue-700 mt-2 space-y-1">
                            <div><strong>Dikdörtgen:</strong> x,y,width,height (örn: 100,50,200,150)</div>
                            <div><strong>Daire:</strong> x,y,radius (örn: 150,100,50)</div>
                            <div><strong>Çokgen:</strong> x1,y1,x2,y2,x3,y3,... (örn: 100,50,200,50,150,150)</div>
                        </div>
                    </div>

                    {/* Açıklama - YORUM SATIRI: UI'dan kaldırıldı, API'ye boş string gönderiliyor */}
                    {/* <div className="space-y-2">
                        <Label htmlFor="explanation">Açıklama</Label>
                        <Textarea
                            id="explanation"
                            value={formData.explanation}
                            onChange={(e) => handleChange('explanation', e.target.value)}
                            className="min-h-[100px]"
                            placeholder="Sıcak nokta açıklaması giriniz (opsiyonel)"
                        />
                    </div> */}

                    {/* KAYDET BUTONU KALDIRILDI - Parent component'te olacak */}
                </div>
            </CardContent>
        </Card>
    );
});

HotSpotTemplateForm.displayName = 'HotSpotTemplateForm';

export default HotSpotTemplateForm;