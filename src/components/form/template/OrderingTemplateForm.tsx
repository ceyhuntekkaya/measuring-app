'use client';

import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NumberInput } from "@/components/ui/number-input";
import {OrderingTemplateDto, OrderingOptions, OrderingItem} from "@/types/exam/questionTemplates";
import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";

interface OrderingTemplateFormProps {
    value?: OrderingTemplateDto | null;
    onChange: (data: OrderingTemplateDto) => void;
    loading?: boolean;
}

interface OrderingTemplateFormData {
    instructions: string;
    options: OrderingOptions;
    shuffleItems: boolean;
    explanation: string;
}

interface OrderingTemplateFormErrors {
    instructions?: string;
    options?: string;
    explanation?: string;
}


export interface OrderingTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => OrderingTemplateFormErrors;
}

const OrderingTemplateForm = forwardRef<OrderingTemplateFormHandle, OrderingTemplateFormProps>(({
                                                                                              value,
                                                                                              onChange,
                                                                                          }, ref) => {

    const [formData, setFormData] = useState<OrderingTemplateFormData>({
        instructions: '',
        options: {
            items: [],
            orderingType: 'SEQUENTIAL' // UI'dan kaldırıldı, her zaman "SEQUENTIAL"
        },
        shuffleItems: true, // UI'dan kaldırıldı, her zaman true
        explanation: '' // UI'dan kaldırıldı, her zaman boş string
    });

    const [errors, setErrors] = useState<OrderingTemplateFormErrors>({});

    useEffect(() => {
        if (value) {
            setFormData({
                instructions: value.instructions || '',
                options: {
                    ...(value.options || { items: [] }),
                    orderingType: 'SEQUENTIAL' // UI'dan kaldırıldı, her zaman "SEQUENTIAL"
                },
                shuffleItems: true, // UI'dan kaldırıldı, her zaman true
                explanation: '' // UI'dan kaldırıldı, her zaman boş string
            });
        }
    }, []);

    const handleChange = <T extends keyof OrderingTemplateFormData>(
        name: T,
        value: OrderingTemplateFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addItem = () => {
        const newItem: OrderingItem = {
            id: `item_${Date.now()}`,
            text: '',
            correctPosition: (formData.options.items?.length || 0) + 1,
            mediaUrl: '',
            mediaType: '',
            feedback: ''
        };

        setFormData(prev => ({
            ...prev,
            options: {
                ...prev.options,
                items: [...(prev.options.items || []), newItem]
            }
        }));
    };

    const removeItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            options: {
                ...prev.options,
                items: prev.options.items?.filter((_, i) => i !== index) || []
            }
        }));
    };

    const updateItem = <K extends keyof OrderingItem>(
        index: number,
        field: K,
        value: OrderingItem[K]
    ) => {
        setFormData(prev => ({
            ...prev,
            options: {
                ...prev.options,
                items: prev.options.items?.map((item, i) =>
                    i === index ? { ...item, [field]: value } : item
                ) || []
            }
        }));
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const items = [...(formData.options.items || [])];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex >= 0 && newIndex < items.length) {
            [items[index], items[newIndex]] = [items[newIndex], items[index]];

            // Correct position'ları güncelle
            items.forEach((item, i) => {
                item.correctPosition = i + 1;
            });

            setFormData(prev => ({
                ...prev,
                options: {
                    ...prev.options,
                    items
                }
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: OrderingTemplateFormErrors = {};

        if (!formData.instructions.trim()) {
            newErrors.instructions = 'Talimatlar zorunludur';
        }

        if (!formData.options.items || formData.options.items.length < 2) {
            newErrors.options = 'En az 2 öğe olmalıdır';
        } else {
            const hasEmptyItems = formData.options.items.some(item => !item.text?.trim());
            if (hasEmptyItems) {
                newErrors.options = 'Tüm öğe metinleri doldurulmalıdır';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        // İlk render'da boş form için onChange tetikleme
        if (formData.instructions) {
            const templateData: OrderingTemplateDto = {
                ...value,
                instructions: formData.instructions.trim(),
                options: {
                    ...formData.options,
                    orderingType: 'SEQUENTIAL' // UI'dan kaldırıldı, her zaman "SEQUENTIAL"
                },
                shuffleItems: true, // UI'dan kaldırıldı, her zaman true
                explanation: '' // UI'dan kaldırıldı, her zaman boş string
            };
            onChange(templateData);
        }
    }, [formData]); // onChange ve value bağımlılığı yok - sonsuz döngü önlendi


    useImperativeHandle(ref, () => ({
        validate: validateForm,
        getErrors: () => errors
    }));


    return (
        <Card>
            <CardHeader>
                <CardTitle>Sıralama Şablonu Ayarları</CardTitle>
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
                            placeholder="Sıralama talimatlarını giriniz"
                        />
                        {errors.instructions && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.instructions}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Sıralama Tipi - YORUM SATIRI: UI'dan kaldırıldı, değeri "SEQUENTIAL" */}
                    {/* <div className="space-y-2">
                        <Label htmlFor="orderingType">Sıralama Tipi</Label>
                        <Select
                            onValueChange={(value) => handleChange('options', {
                                ...formData.options,
                                orderingType: value as keyof OrderingOptions
                            })}
                            value={formData.options.orderingType as keyof OrderingOptions}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sıralama tipi seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="SEQUENTIAL">Sıralı</SelectItem>
                                    <SelectItem value="CHRONOLOGICAL">Kronolojik</SelectItem>
                                    <SelectItem value="PRIORITY">Öncelik Sırasına Göre</SelectItem>
                                    <SelectItem value="ALPHABETICAL">Alfabetik</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div> */}

                    {/* Öğeleri Karıştır - YORUM SATIRI: UI'dan kaldırıldı, değeri true */}
                    {/* <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="shuffleItems"
                                checked={formData.shuffleItems}
                                onChange={(checked) => handleChange('shuffleItems', !!checked)}
                            />
                            <Label htmlFor="shuffleItems">Öğeleri Karıştır</Label>
                        </div>
                    </div> */}

                    {/* Sıralama Öğeleri */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Sıralama Öğeleri</Label>
                            <Button
                                type="button"
                                onClick={addItem}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Öğe Ekle
                            </Button>
                        </div>

                        {formData.options.items?.map((item, index) => (
                            <div key={item.id || index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                                <div className="col-span-1">
                                    <Label>Sıra</Label>
                                    <NumberInput
                                        inputType={"number"}
                                        value={item.correctPosition || index + 1}
                                        onChange={(value) => updateItem(index, 'correctPosition', value)}
                                        minValue={1}
                                        decimalPlaces={0}
                                        disabled
                                    />
                                </div>

                                <div className="col-span-10">
                                    <Label>Metin *</Label>
                                    <Textarea
                                        value={item.text || ''}
                                        onChange={(e) => updateItem(index, 'text', e.target.value)}
                                        placeholder="Öğe metnini giriniz"
                                        className="min-h-[60px]"
                                    />
                                </div>

                                {/* Medya URL - YORUM SATIRI: UI'dan kaldırıldı, belki sonra tekrar gösterilebilir */}
                                {/* <div className="col-span-3">
                                    <Label>Medya URL</Label>
                                    <Input
                                        value={item.mediaUrl || ''}
                                        onChange={(e) => updateItem(index, 'mediaUrl', e.target.value)}
                                        placeholder="Medya URL (opsiyonel)"
                                    />
                                </div> */}

                                {/* Geri Bildirim - YORUM SATIRI: UI'dan kaldırıldı, belki sonra tekrar gösterilebilir */}
                                {/* <div className="col-span-3">
                                    <Label>Geri Bildirim</Label>
                                    <Input
                                        value={item.feedback || ''}
                                        onChange={(e) => updateItem(index, 'feedback', e.target.value)}
                                        placeholder="Geri bildirim (opsiyonel)"
                                    />
                                </div> */}

                                <div className="col-span-1 flex flex-col gap-1">
                                    <Button
                                        type="button"
                                        onClick={() => moveItem(index, 'up')}
                                        variant="outline"
                                        size="sm"
                                        disabled={index === 0}
                                    >
                                        <ArrowUp className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => moveItem(index, 'down')}
                                        variant="outline"
                                        size="sm"
                                        disabled={index === (formData.options.items?.length || 0) - 1}
                                    >
                                        <ArrowDown className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        variant="destructive"
                                        size="sm"
                                    >
                                        <Trash2 className="w-3 h-3" />
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

                    {/* Açıklama - YORUM SATIRI: UI'dan kaldırıldı, API'ye boş string gönderiliyor */}
                    {/* <div className="space-y-2">
                        <Label htmlFor="explanation">Açıklama</Label>
                        <Textarea
                            id="explanation"
                            value={formData.explanation}
                            onChange={(e) => handleChange('explanation', e.target.value)}
                            className="min-h-[100px]"
                            placeholder="Sıralama açıklaması giriniz (opsiyonel)"
                        />
                    </div> */}
                </div>
            </CardContent>
        </Card>
    );
});

OrderingTemplateForm.displayName = 'OrderingTemplateForm';

export default OrderingTemplateForm;