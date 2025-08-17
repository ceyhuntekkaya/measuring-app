'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumberInput } from "@/components/ui/number-input";
import { HotSpotTemplateDto, HotSpotOptions, HotSpotArea } from "@/types/exam/questionTemplates";
import { Trash2, Plus } from "lucide-react";
import Checkbox from "@/components/ui/checkbox";

interface HotSpotTemplateFormProps {
    value?: HotSpotTemplateDto | null;
    onChange: (data: HotSpotTemplateDto) => void;
    loading?: boolean;
}

interface HotSpotTemplateFormData {
    instructions: string;
    imageUrl: string;
    options: HotSpotOptions;
    maxSelections?: number;
    allowMultipleSpots: boolean;
    explanation: string;
}

interface HotSpotTemplateFormErrors {
    instructions?: string;
    imageUrl?: string;
    options?: string;
    maxSelections?: string;
    explanation?: string;
}

const HotSpotTemplateForm: React.FC<HotSpotTemplateFormProps> = ({
                                                                     value,
                                                                     onChange,
                                                                     loading = false
                                                                 }) => {
    const [formData, setFormData] = useState<HotSpotTemplateFormData>({
        instructions: '',
        imageUrl: '',
        options: {
            backgroundImageUrl: '',
            hotSpots: [],
            selectionType: 'SINGLE'
        },
        maxSelections: 1,
        allowMultipleSpots: false,
        explanation: ''
    });

    const [errors, setErrors] = useState<HotSpotTemplateFormErrors>({});

    useEffect(() => {
        if (value) {
            setFormData({
                instructions: value.instructions || '',
                imageUrl: value.imageUrl || '',
                options: value.options || {
                    backgroundImageUrl: '',
                    hotSpots: [],
                    selectionType: 'SINGLE'
                },
                maxSelections: value.maxSelections,
                allowMultipleSpots: value.allowMultipleSpots ?? false,
                explanation: value.explanation || ''
            });
        }
    }, [value]);

    const handleChange = <T extends keyof HotSpotTemplateFormData>(
        name: T,
        value: HotSpotTemplateFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
                hotSpots: [...(prev.options.hotSpots || []), newHotSpot]
            }
        }));
    };

    const removeHotSpot = (index: number) => {
        setFormData(prev => ({
            ...prev,
            options: {
                ...prev.options,
                hotSpots: prev.options.hotSpots?.filter((_, i) => i !== index) || []
            }
        }));
    };

    const updateHotSpot = <K extends keyof HotSpotArea>(
        index: number,
        field: K,
        value: HotSpotArea[K]
    ) => {
        setFormData(prev => ({
            ...prev,
            options: {
                ...prev.options,
                hotSpots: prev.options.hotSpots?.map((hotSpot, i) =>
                    i === index ? { ...hotSpot, [field]: value } : hotSpot
                ) || []
            }
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: HotSpotTemplateFormErrors = {};

        if (!formData.instructions.trim()) {
            newErrors.instructions = 'Talimatlar zorunludur';
        }

        if (!formData.imageUrl.trim() && !formData.options.backgroundImageUrl?.trim()) {
            newErrors.imageUrl = 'Arkaplan resmi URL\'si zorunludur';
        }

        if (!formData.options.hotSpots || formData.options.hotSpots.length === 0) {
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

        if (formData.maxSelections && formData.maxSelections <= 0) {
            newErrors.maxSelections = 'Maksimum seçim sayısı 0\'dan büyük olmalıdır';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Background image URL'yi sync et
            const optionsWithImage = {
                ...formData.options,
                backgroundImageUrl: formData.imageUrl
            };

            const submitData: HotSpotTemplateDto = {
                ...value,
                instructions: formData.instructions.trim(),
                imageUrl: formData.imageUrl.trim(),
                options: optionsWithImage,
                maxSelections: formData.maxSelections,
                allowMultipleSpots: formData.allowMultipleSpots,
                explanation: formData.explanation.trim()
            };

            onChange(submitData);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sıcak Nokta Şablonu Ayarları</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Talimatlar */}
                    <div className="space-y-2">
                        <Label htmlFor="instructions">Talimatlar *</Label>
                        <Textarea
                            id="instructions"
                            value={formData.instructions}
                            onChange={(e) => handleChange('instructions', e.target.value)}
                            className={`min-h-[100px] ${errors.instructions ? 'border-red-500' : ''}`}
                            placeholder="Sıcak nokta talimatlarını giriniz"
                        />
                        {errors.instructions && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.instructions}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Arkaplan Resmi URL */}
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Arkaplan Resmi URL *</Label>
                        <Input
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={(e) => {
                                handleChange('imageUrl', e.target.value);
                                // Options içindeki backgroundImageUrl'yi de güncelle
                                handleChange('options', {
                                    ...formData.options,
                                    backgroundImageUrl: e.target.value
                                });
                            }}
                            className={errors.imageUrl ? 'border-red-500' : ''}
                            placeholder="https://example.com/image.jpg"
                        />
                        {errors.imageUrl && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.imageUrl}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {/* Seçim Tipi */}
                        <div className="space-y-2">
                            <Label htmlFor="selectionType">Seçim Tipi</Label>
                            <Select
                                onValueChange={(value) => handleChange('options', {
                                    ...formData.options,
                                    selectionType: value as string
                                })}
                                value={formData.options.selectionType || 'SINGLE'}
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

                        {/* Maksimum Seçim */}
                        <div className="space-y-2">
                            <Label htmlFor="maxSelections">Maksimum Seçim</Label>
                            <NumberInput
                                id="maxSelections"
                                value={formData.maxSelections || 1}
                                onChange={(value) => handleChange('maxSelections', value || undefined)}
                                minValue={1}
                                decimalPlaces={0}
                                className={errors.maxSelections ? 'border-red-500' : ''}
                            />
                            {errors.maxSelections && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.maxSelections}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Çoklu Spot İzni */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 mt-6">
                                <Checkbox
                                    id="allowMultipleSpots"
                                    checked={formData.allowMultipleSpots}
                                    onChange={(checked) => handleChange('allowMultipleSpots', !!checked)}
                                />
                                <Label htmlFor="allowMultipleSpots">Çoklu Spot İzni</Label>
                            </div>
                        </div>
                    </div>

                    {/* Sıcak Noktalar */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Sıcak Noktalar</Label>
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

                        {formData.options.hotSpots?.map((hotSpot, index) => (
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
                                        onValueChange={(value) => updateHotSpot(index, 'shape', value as string)}
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

                    {/* Açıklama */}
                    <div className="space-y-2">
                        <Label htmlFor="explanation">Açıklama</Label>
                        <Textarea
                            id="explanation"
                            value={formData.explanation}
                            onChange={(e) => handleChange('explanation', e.target.value)}
                            className="min-h-[100px]"
                            placeholder="Sıcak nokta açıklaması giriniz (opsiyonel)"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "İşleniyor..." : "Kaydet"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default HotSpotTemplateForm;