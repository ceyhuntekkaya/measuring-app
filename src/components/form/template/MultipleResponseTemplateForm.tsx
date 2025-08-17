'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Checkbox from "@/components/ui/checkbox";
import { NumberInput } from "@/components/ui/number-input";
import { MultipleResponseTemplateDto, MultipleResponseOptions, ResponseOption } from "@/types/exam/questionTemplates";
import { Trash2, Plus } from "lucide-react";

interface MultipleResponseTemplateFormProps {
    value?: MultipleResponseTemplateDto | null;
    onChange: (data: MultipleResponseTemplateDto) => void;
    loading?: boolean;
}

interface MultipleResponseTemplateFormData {
    question: string;
    options: MultipleResponseOptions;
    correctOptionIndices: number[];
    minSelections?: number;
    maxSelections?: number;
    shuffleOptions: boolean;
    explanation: string;
}

interface MultipleResponseTemplateFormErrors {
    question?: string;
    options?: string;
    selections?: string;
    explanation?: string;
}

const MultipleResponseTemplateForm: React.FC<MultipleResponseTemplateFormProps> = ({
                                                                                       value,
                                                                                       onChange,
                                                                                       loading = false
                                                                                   }) => {
    const [formData, setFormData] = useState<MultipleResponseTemplateFormData>({
        question: '',
        options: {
            choices: [],
            selectionInstruction: ''
        },
        correctOptionIndices: [],
        minSelections: 1,
        maxSelections: undefined,
        shuffleOptions: true,
        explanation: ''
    });

    const [errors, setErrors] = useState<MultipleResponseTemplateFormErrors>({});

    useEffect(() => {
        if (value) {
            setFormData({
                question: value.question || '',
                options: value.options || {
                    choices: [],
                    selectionInstruction: ''
                },
                correctOptionIndices: value.correctOptionIndices || [],
                minSelections: value.minSelections,
                maxSelections: value.maxSelections,
                shuffleOptions: value.shuffleOptions ?? true,
                explanation: value.explanation || ''
            });
        }
    }, [value]);

    const handleChange = <T extends keyof MultipleResponseTemplateFormData>(
        name: T,
        value: MultipleResponseTemplateFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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
                choices: [...(prev.options.choices || []), newChoice]
            }
        }));
    };

    const removeChoice = (index: number) => {
        setFormData(prev => {
            // Silinen seçeneğin doğru seçenekler listesinden de çıkarılması
            const newCorrectIndices = prev.correctOptionIndices
                .filter(i => i !== index)
                .map(i => i > index ? i - 1 : i);

            return {
                ...prev,
                options: {
                    ...prev.options,
                    choices: prev.options.choices?.filter((_, i) => i !== index) || []
                },
                correctOptionIndices: newCorrectIndices
            };
        });
    };

    const updateChoice = <K extends keyof ResponseOption>(
        index: number,
        field: K,
        value: ResponseOption[K]
    ) => {
        setFormData(prev => ({
            ...prev,
            options: {
                ...prev.options,
                choices: prev.options.choices?.map((choice, i) =>
                    i === index ? { ...choice, [field]: value } : choice
                ) || []
            }
        }));
    };

    const toggleCorrectOption = (index: number) => {
        setFormData(prev => {
            const isCurrentlyCorrect = prev.correctOptionIndices.includes(index);
            const newCorrectIndices = isCurrentlyCorrect
                ? prev.correctOptionIndices.filter(i => i !== index)
                : [...prev.correctOptionIndices, index];

            // Seçenek objesindeki isCorrect değerini de güncelle
            const updatedChoices = prev.options.choices?.map((choice, i) => ({
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

    const validateForm = (): boolean => {
        const newErrors: MultipleResponseTemplateFormErrors = {};

        if (!formData.question.trim()) {
            newErrors.question = 'Soru metni zorunludur';
        }

        if (!formData.options.choices || formData.options.choices.length < 2) {
            newErrors.options = 'En az 2 seçenek olmalıdır';
        } else {
            const hasEmptyChoices = formData.options.choices.some(choice => !choice.text?.trim());
            if (hasEmptyChoices) {
                newErrors.options = 'Tüm seçenek metinleri doldurulmalıdır';
            }
        }

        if (formData.correctOptionIndices.length === 0) {
            newErrors.selections = 'En az bir doğru seçenek işaretlenmelidir';
        }

        if (formData.minSelections && formData.maxSelections && formData.minSelections > formData.maxSelections) {
            newErrors.selections = 'Minimum seçim sayısı maksimum seçim sayısından büyük olamaz';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const submitData: MultipleResponseTemplateDto = {
                ...value,
                question: formData.question.trim(),
                options: formData.options,
                correctOptionIndices: formData.correctOptionIndices,
                minSelections: formData.minSelections,
                maxSelections: formData.maxSelections,
                shuffleOptions: formData.shuffleOptions,
                explanation: formData.explanation.trim()
            };

            onChange(submitData);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Çoklu Yanıt Şablonu Ayarları</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Soru Metni */}
                    <div className="space-y-2">
                        <Label htmlFor="question">Soru Metni *</Label>
                        <Textarea
                            id="question"
                            value={formData.question}
                            onChange={(e) => handleChange('question', e.target.value)}
                            className={`min-h-[100px] ${errors.question ? 'border-red-500' : ''}`}
                            placeholder="Soru metnini giriniz"
                        />
                        {errors.question && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.question}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Seçim Talimatı */}
                    <div className="space-y-2">
                        <Label htmlFor="selectionInstruction">Seçim Talimatı</Label>
                        <Input
                            id="selectionInstruction"
                            value={formData.options.selectionInstruction || ''}
                            onChange={(e) => handleChange('options', {
                                ...formData.options,
                                selectionInstruction: e.target.value
                            })}
                            placeholder="Örn: Doğru olan tüm seçenekleri işaretleyiniz"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {/* Minimum Seçim */}
                        <div className="space-y-2">
                            <Label htmlFor="minSelections">Minimum Seçim</Label>
                            <NumberInput
                                id="minSelections"
                                value={formData.minSelections || 1}
                                onChange={(value) => handleChange('minSelections', value || undefined)}
                                minValue={1}
                                decimalPlaces={0}
                            />
                        </div>

                        {/* Maksimum Seçim */}
                        <div className="space-y-2">
                            <Label htmlFor="maxSelections">Maksimum Seçim</Label>
                            <NumberInput
                                id="maxSelections"
                                value={formData.maxSelections || 0}
                                onChange={(value) => handleChange('maxSelections', value || undefined)}
                                minValue={1}
                                decimalPlaces={0}
                                placeholder="Sınırsız için boş bırakın"
                            />
                        </div>

                        {/* Seçenekleri Karıştır */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 mt-6">
                                <Checkbox
                                    id="shuffleOptions"
                                    checked={formData.shuffleOptions}
                                    onChange={(checked) => handleChange('shuffleOptions', !!checked)}
                                />
                                <Label htmlFor="shuffleOptions">Seçenekleri Karıştır</Label>
                            </div>
                        </div>
                    </div>

                    {errors.selections && (
                        <Alert variant="destructive">
                            <AlertDescription>{errors.selections}</AlertDescription>
                        </Alert>
                    )}

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

                        {formData.options.choices?.map((choice, index) => (
                            <div key={choice.id || index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                                <div className="col-span-1">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={formData.correctOptionIndices.includes(index)}
                                            onChange={() => toggleCorrectOption(index)}
                                        />
                                        <Label className="text-sm">Doğru</Label>
                                    </div>
                                </div>

                                <div className="col-span-4">
                                    <Label>Seçenek Metni *</Label>
                                    <Textarea
                                        value={choice.text || ''}
                                        onChange={(e) => updateChoice(index, 'text', e.target.value)}
                                        placeholder="Seçenek metnini giriniz"
                                        className="min-h-[60px]"
                                    />
                                </div>

                                <div className="col-span-3">
                                    <Label>Medya URL</Label>
                                    <Input
                                        value={choice.mediaUrl || ''}
                                        onChange={(e) => updateChoice(index, 'mediaUrl', e.target.value)}
                                        placeholder="Medya URL (opsiyonel)"
                                    />
                                </div>

                                <div className="col-span-3">
                                    <Label>Geri Bildirim</Label>
                                    <Input
                                        value={choice.feedback || ''}
                                        onChange={(e) => updateChoice(index, 'feedback', e.target.value)}
                                        placeholder="Geri bildirim (opsiyonel)"
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

                    {/* Açıklama */}
                    <div className="space-y-2">
                        <Label htmlFor="explanation">Açıklama</Label>
                        <Textarea
                            id="explanation"
                            value={formData.explanation}
                            onChange={(e) => handleChange('explanation', e.target.value)}
                            className="min-h-[100px]"
                            placeholder="Cevap açıklaması giriniz (opsiyonel)"
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

export default MultipleResponseTemplateForm;