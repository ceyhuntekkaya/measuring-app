'use client';

import React, {useEffect, useState} from 'react';
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import Checkbox from "@/components/ui/checkbox";
import {MultipleChoiceTemplateDto, MultipleChoiceOptions, ChoiceOption} from "@/types/exam/questionTemplates";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Trash2, Plus} from "lucide-react";
import {EMediaType} from "@/types/exam/enum";

interface MultipleChoiceTemplateFormData {
    question: string;
    options: MultipleChoiceOptions;
    correctOptionIndex: number;
    explanation: string;
    shuffleOptions: boolean;
}

interface MultipleChoiceTemplateFormErrors {
    question?: string;
    options?: string;
    correctOptionIndex?: string;
}

interface MultipleChoiceTemplateFormProps {
    value?: MultipleChoiceTemplateDto;
    onChange: (data: Partial<MultipleChoiceTemplateDto>) => void;
}

const MultipleChoiceTemplateForm: React.FC<MultipleChoiceTemplateFormProps> = ({
                                                                                   value,
                                                                                   onChange
                                                                               }) => {
    const [formData, setFormData] = useState<MultipleChoiceTemplateFormData>({
        question: '',
        options: {choices: []},
        correctOptionIndex: 0,
        explanation: '',
        shuffleOptions: false
    });

    const [errors, setErrors] = useState<MultipleChoiceTemplateFormErrors>({});

    useEffect(() => {
        if (value) {
            setFormData({
                question: value.question || '',
                options: value.options || {choices: []},
                correctOptionIndex: value.correctOptionIndex || 0,
                explanation: value.explanation || '',
                shuffleOptions: value.shuffleOptions || false
            });
        }
    }, [value]);

    const handleChange = <T extends keyof MultipleChoiceTemplateFormData>(
        field: T,
        newValue: MultipleChoiceTemplateFormData[T]
    ) => {
        const updatedData = {...formData, [field]: newValue};
        setFormData(updatedData);

        if (validateForm()) {
            onChange({
                question: updatedData.question,
                options: updatedData.options,
                correctOptionIndex: updatedData.correctOptionIndex,
                explanation: updatedData.explanation,
                shuffleOptions: updatedData.shuffleOptions
            });
        }
    };

    const addChoice = () => {
        const newChoice: ChoiceOption = {
            id: Date.now().toString(),
            text: '',
            isCorrect: false,
            feedback: '',
            mediaUrl: '',
            mediaType: EMediaType.TEXT
        };

        const updatedChoices = [...(formData.options.choices || []), newChoice];
        handleChange('options', {...formData.options, choices: updatedChoices});
    };

    const removeChoice = (index: number) => {
        const updatedChoices = formData.options.choices?.filter((_, i) => i !== index) || [];
        handleChange('options', {...formData.options, choices: updatedChoices});

        // Doğru cevap index'i ayarla
        if (formData.correctOptionIndex >= updatedChoices.length) {
            handleChange('correctOptionIndex', Math.max(0, updatedChoices.length - 1));
        }
    };

    const updateChoice = <K extends keyof ChoiceOption>(
        index: number,
        field: K,
        value: ChoiceOption[K]
    ) => {
        const updatedChoices = formData.options.choices?.map((choice, i) =>
            i === index ? {...choice, [field]: value} : choice
        ) || [];

        handleChange('options', {...formData.options, choices: updatedChoices});
    };



    const validateForm = (): boolean => {
        const newErrors: MultipleChoiceTemplateFormErrors = {};

        if (!formData.question.trim()) {
            newErrors.question = 'Soru metni zorunludur';
        }

        if (!formData.options.choices || formData.options.choices.length < 2) {
            newErrors.options = 'En az 2 seçenek olmalıdır';
        } else {
            const invalidChoices = formData.options.choices.some(choice => !choice.text?.trim());
            if (invalidChoices) {
                newErrors.options = 'Tüm seçenek metinleri doldurulmalıdır';
            }
        }

        if (formData.correctOptionIndex < 0 || formData.correctOptionIndex >= (formData.options.choices?.length || 0)) {
            newErrors.correctOptionIndex = 'Geçerli bir doğru cevap seçilmelidir';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Çoktan Seçmeli Soru Ayarları</h3>

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
                        <Plus className="w-4 h-4 mr-2"/>
                        Seçenek Ekle
                    </Button>
                </div>

                {formData.options.choices?.map((choice, index) => (
                    <div key={choice.id || index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                        <div className="col-span-1">
                            <Label>#{index + 1}</Label>
                            <div className="flex items-center space-x-2 mt-1">
                                <Checkbox
                                    checked={formData.correctOptionIndex === index}
                                    onChange={(checked) => {
                                        if (checked) {
                                            handleChange('correctOptionIndex', index);
                                        }
                                    }}
                                />
                                <Label className="text-xs">Doğru</Label>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <Label>Medya Tipi</Label>
                            <Select
                                onValueChange={(value) => updateChoice(index, 'mediaType', value as EMediaType)}
                                value={choice.mediaType || EMediaType.TEXT}
                            >
                                <SelectTrigger>
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.entries(EMediaType).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>
                                                {value}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-3">
                            <Label>Seçenek Metni</Label>
                            <Textarea
                                value={choice.text || ''}
                                onChange={(e) => updateChoice(index, 'text', e.target.value)}
                                placeholder="Seçenek metnini giriniz"
                                className="min-h-[60px]"
                            />
                        </div>

                        <div className="col-span-2">
                            <Label>Medya URL</Label>
                            <Input
                                value={choice.mediaUrl || ''}
                                onChange={(e) => updateChoice(index, 'mediaUrl', e.target.value)}
                                placeholder="Medya URL (opsiyonel)"
                            />
                        </div>

                        <div className="col-span-3">
                            <Label>Geri Bildirim</Label>
                            <Textarea
                                value={choice.feedback || ''}
                                onChange={(e) => updateChoice(index, 'feedback', e.target.value)}
                                placeholder="Geri bildirim metni (opsiyonel)"
                                className="min-h-[60px]"
                            />
                        </div>

                        <div className="col-span-1">
                            <Button
                                type="button"
                                onClick={() => removeChoice(index)}
                                variant="primary"
                                size="sm"
                            >
                                <Trash2 className="w-4 h-4"/>
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
                    placeholder="Soru açıklaması (opsiyonel)"
                />
            </div>

            {/* Seçenekleri Karıştır */}
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="shuffleOptions"
                        checked={formData.shuffleOptions}
                        onChange={(checked) => handleChange('shuffleOptions', !!checked)}
                    />
                    <Label htmlFor="shuffleOptions">Seçenekleri Karıştır</Label>
                </div>
            </div>
        </div>
    );
};

export default MultipleChoiceTemplateForm;