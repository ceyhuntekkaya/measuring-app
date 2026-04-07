'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Checkbox from "@/components/ui/checkbox";
import type { MultipleResponseTemplateDto, ResponseOption } from "@/api/generated/model";
import { Trash2, Plus } from "lucide-react";

interface MultipleResponseTemplateFormProps {
    value?: MultipleResponseTemplateDto | null;
    onChange: (data: MultipleResponseTemplateDto) => void;
    loading?: boolean;
}

// Use ORVAL DTO types directly - only template-specific fields
type MultipleResponseTemplateFormData = {
    options: NonNullable<MultipleResponseTemplateDto['options']>;
    correctOptionIndices: number[];
};

interface MultipleResponseTemplateFormErrors {
    question?: string;
    options?: string;
    selections?: string;
    explanation?: string;
}

// Validation handle için ref interface
export interface MultipleResponseTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => MultipleResponseTemplateFormErrors;
}

const MultipleResponseTemplateForm = forwardRef<MultipleResponseTemplateFormHandle, MultipleResponseTemplateFormProps>(({
                                                                                                                            value,
                                                                                                                            onChange,
                                                                                                                        }, ref) => {
    const [formData, setFormData] = useState<MultipleResponseTemplateFormData>({
        options: {
            choices: [],
            selectionInstruction: 'Doğru olan tüm seçenekleri işaretleyiniz.' // UI'dan kaldırıldı, her zaman sabit değer
        },
        correctOptionIndices: [],
    });

    const [errors, setErrors] = useState<MultipleResponseTemplateFormErrors>({});

    // Value değiştiğinde form data'yı güncelle (Update modu için)
    useEffect(() => {
        if (value) {
            // Eğer correctOptionIndices yoksa, choices array'indeki isCorrect değerlerine göre hesapla
            let correctIndices: number[] = [];
            if (value.correctOptionIndices && value.correctOptionIndices.length > 0) {
                correctIndices = value.correctOptionIndices;
            } else if (value.options?.choices) {
                // choices array'indeki isCorrect: true olan seçeneklerin index'lerini bul
                correctIndices = value.options.choices
                    .map((choice, index) => choice.isCorrect ? index : -1)
                    .filter(index => index !== -1);
            }
            
            setFormData({
                options: {
                    ...(value.options || { choices: [] }),
                    selectionInstruction: 'Doğru olan tüm seçenekleri işaretleyiniz.' // UI'dan kaldırıldı, her zaman sabit değer
                },
                correctOptionIndices: correctIndices,
            });
        }
    }, []);

    // Form data değiştiğinde parent'a bildir (Anlık güncelleme)
    useEffect(() => {
        // İlk render'da onChange'i tetikleme
        if ( (formData.options?.choices ?? []).length > 0) {
            const templateData: MultipleResponseTemplateDto = {
                ...value,
                options: {
                    ...formData.options,
                    selectionInstruction: 'Doğru olan tüm seçenekleri işaretleyiniz.' // UI'dan kaldırıldı, her zaman sabit değer
                },
                correctOptionIndices: formData.correctOptionIndices,
                // minSelections/maxSelections/shuffleOptions/explanation are UI-only (not in DTO)
            };
            onChange(templateData);
        }
    }, [formData]); // onChange ve value bağımlılığı kaldırıldı - sonsuz döngü önlendi
/*
    const handleChange = <T extends keyof MultipleResponseTemplateFormData>(
        name: T,
        newValue: MultipleResponseTemplateFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Hata varsa temizle
        if (errors[name as keyof MultipleResponseTemplateFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };
    */


    const addChoice = () => {
        const newChoice: ResponseOption = {
            id: `choice_${Date.now()}`,
            text: '',
            isCorrect: false,
            feedback: '',
            mediaUrl: '',
            mediaType: ''
        };

        setFormData(prev => ({
            ...prev,
            options: {
                ...prev.options,
                choices: [...(prev.options?.choices || []), newChoice]
            }
        }));
    };

    const removeChoice = (index: number) => {
        setFormData(prev => {
            // Silinen seçeneğin doğru seçenekler listesinden de çıkarılması
            const newCorrectIndices = (prev.correctOptionIndices || [])
                .filter(i => i !== index)
                .map(i => i > index ? i - 1 : i);

            return {
                ...prev,
                options: {
                    ...prev.options,
                    choices: prev.options?.choices?.filter((_, i) => i !== index) || []
                },
                correctOptionIndices: newCorrectIndices
            };
        });
    };

    const updateChoice = <K extends keyof ResponseOption>(
        index: number,
        field: K,
        newValue: ResponseOption[K]
    ) => {
        setFormData(prev => ({
            ...prev,
            options: {
                ...prev.options,
                choices: prev.options?.choices?.map((choice, i) =>
                    i === index ? { ...choice, [field]: newValue } : choice
                ) || []
            }
        }));
    };

    const toggleCorrectOption = (index: number) => {
        setFormData(prev => {
            const currentIndices = prev.correctOptionIndices || [];
            const isCurrentlyCorrect = currentIndices.includes(index);
            const newCorrectIndices = isCurrentlyCorrect
                ? currentIndices.filter(i => i !== index)
                : [...currentIndices, index];

            // Seçenek objesindeki isCorrect değerini de güncelle
            const updatedChoices = prev.options?.choices?.map((choice, i) => ({
                ...choice,
                isCorrect: newCorrectIndices.includes(i)
            })) || [];

            return {
                ...prev,
                correctOptionIndices: newCorrectIndices,
                options: {
                    ...prev.options,
                    choices: updatedChoices
                }
            };
        });
    };

    // Validation fonksiyonu - parent tarafından çağrılacak
    const validateForm = (): boolean => {
        const newErrors: MultipleResponseTemplateFormErrors = {};

       

        if (!formData.options?.choices || formData.options.choices.length < 2) {
            newErrors.options = 'En az 2 seçenek olmalıdır';
        } else {
            const hasEmptyChoices = formData.options.choices.some(choice => !choice.text?.trim());
            if (hasEmptyChoices) {
                newErrors.options = 'Tüm seçenek metinleri doldurulmalıdır';
            }
        }

        if ((formData.correctOptionIndices?.length ?? 0) === 0) {
            newErrors.selections = 'En az bir doğru seçenek işaretlenmelidir';
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
                <CardTitle>Çoklu Yanıt Şablonu Ayarları</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">

                    {/* Seçenekler */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Seçenekler</Label>
                            <Button
                                type="button"
                                onClick={addChoice}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Seçenek Ekle
                            </Button>
                        </div>

                        {formData.options?.choices?.map((choice, index) => (
                            <div key={choice.id || index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                                <div className="col-span-1">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={(formData.correctOptionIndices || []).includes(index)}
                                            onChange={() => toggleCorrectOption(index)}
                                        />
                                        <Label className="text-sm">Doğru</Label>
                                    </div>
                                </div>

                                <div className="col-span-10">
                                    <Label>Seçenek Metni *</Label>
                                    <Textarea
                                        value={choice.text || ''}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                          updateChoice(index, 'text', e.target.value)
                                        }
                                        placeholder="Seçenek metnini giriniz"
                                        className="min-h-[60px]"
                                    />
                                </div>

                             

                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        onClick={() => removeChoice(index)}
                                        variant="destructive"
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

                    
                </div>
            </CardContent>
        </Card>
    );
});

MultipleResponseTemplateForm.displayName = 'MultipleResponseTemplateForm';

export default MultipleResponseTemplateForm;