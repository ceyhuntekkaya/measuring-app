'use client';

import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import HtmlEditor from "@/components/ui/html-editor";
import Checkbox from "@/components/ui/checkbox";
import type {MultipleChoiceTemplateDto, ChoiceOption} from "@/api/generated/model";
import {Trash2, Plus} from "lucide-react";
import {EMediaType} from "@/types/exam/enum";

// Use ORVAL DTO types directly - only template-specific fields
type MultipleChoiceTemplateFormData = Pick<MultipleChoiceTemplateDto, 'options' | 'correctOptionIndex'>;

interface MultipleChoiceTemplateFormErrors {
    question?: string;
    options?: string;
    correctOptionIndex?: string;
}

interface MultipleChoiceTemplateFormProps {
    value?: MultipleChoiceTemplateDto | null;
    onChange: (data: MultipleChoiceTemplateDto) => void;
    loading?: boolean;
}


// Validation handle için ref interface
export interface MultipleChoiceTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => MultipleChoiceTemplateFormErrors;
}

const MultipleChoiceTemplateForm = forwardRef<MultipleChoiceTemplateFormHandle, MultipleChoiceTemplateFormProps>(({
                                                                                                                                                                 value,
                                                                                                                                                                 onChange,
                                                                                                                                                             }, ref) => {
    const [formData, setFormData] = useState<MultipleChoiceTemplateFormData>({
        options: {choices: []},
        correctOptionIndex: 0,
    });

    const [errors, setErrors] = useState<MultipleChoiceTemplateFormErrors>({});

    const normalizeOptionsWithCorrect = (
        options: MultipleChoiceTemplateFormData['options'],
        correctOptionIndex: number | null | undefined
    ): { options: MultipleChoiceTemplateFormData['options']; correctOptionIndex: number } => {
        const choices = options?.choices || [];

        if (choices.length === 0) {
            return { options: { ...(options || {}), choices }, correctOptionIndex: 0 };
        }

        const idxFromState =
            typeof correctOptionIndex === 'number' &&
            correctOptionIndex >= 0 &&
            correctOptionIndex < choices.length
                ? correctOptionIndex
                : null;

        const idxFromChoices = choices.findIndex((c) => c.isCorrect === true);
        const resolvedIndex = idxFromState ?? (idxFromChoices >= 0 ? idxFromChoices : 0);

        const normalizedChoices = choices.map((c, i) => ({
            ...c,
            isCorrect: i === resolvedIndex
        }));

        return {
            options: { ...(options || {}), choices: normalizedChoices },
            correctOptionIndex: resolvedIndex
        };
    };

    useEffect(() => {
        if (value) {
            // Eğer correctOptionIndex yoksa veya null ise, choices array'indeki isCorrect: true olan seçeneğin index'ini bul
            let correctIndex = value.correctOptionIndex ?? null;
            if (correctIndex === null || correctIndex === undefined) {
                // choices array'indeki isCorrect: true olan seçeneğin index'ini bul
                const correctChoiceIndex = value.options?.choices?.findIndex(choice => choice.isCorrect === true);
                if (correctChoiceIndex !== undefined && correctChoiceIndex !== -1) {
                    correctIndex = correctChoiceIndex;
                } else {
                    correctIndex = 0; // Varsayılan olarak ilk seçeneği seç
                }
            }
            
            // choices array'indeki isCorrect değerlerini correctOptionIndex'e göre ayarla
            const choices = value.options?.choices?.map((choice, i) => ({
                ...choice,
                isCorrect: i === correctIndex
            })) || [];
            
            setFormData({
                options: {
                    ...(value.options || {}),
                    choices: choices
                },
                correctOptionIndex: correctIndex,
            });
        }
    }, []);

    const handleChange = <T extends keyof MultipleChoiceTemplateFormData>(
        field: T,
        newValue: MultipleChoiceTemplateFormData[T]
    ) => {
        let updatedData = {...formData, [field]: newValue};

        // Eğer correctOptionIndex değiştiyse, choices array'indeki isCorrect değerlerini de güncelle
        if (field === 'correctOptionIndex') {
            const updatedChoices = updatedData.options?.choices?.map((choice, i) => ({
                ...choice,
                isCorrect: i === newValue
            })) || [];
            
            updatedData = {
                ...updatedData,
                options: {
                    ...updatedData.options,
                    choices: updatedChoices
                }
            };
        }

        // Eğer options/choices değiştiyse, correctOptionIndex ile isCorrect değerlerini senkron tut
        if (field === 'options') {
            const normalized = normalizeOptionsWithCorrect(
                updatedData.options,
                updatedData.correctOptionIndex ?? null
            );
            updatedData = {
                ...updatedData,
                options: normalized.options,
                correctOptionIndex: normalized.correctOptionIndex
            };
        }

        setFormData(updatedData);

        // Her zaman onChange'i çağır, validation sadece submit için
        // ÖNEMLİ: value'dan gelen id ve diğer base field'ları koru (update modu için gerekli)
        onChange({
            ...(value || {}), // id ve diğer base field'ları koru (value null ise boş obje)
            options: updatedData.options,
            correctOptionIndex: updatedData.correctOptionIndex,
        });
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

        const updatedChoices = [...(formData.options?.choices || []), newChoice];
        const updatedOptions = {...formData.options, choices: updatedChoices};
        handleChange('options', updatedOptions);
    };

    const removeChoice = (index: number) => {
        const updatedChoices = formData.options?.choices?.filter((_, i) => i !== index) || [];
        
        // Doğru cevap index'i ayarla
        let newCorrectIndex = formData.correctOptionIndex ?? 0;
        if ((formData.correctOptionIndex ?? 0) >= updatedChoices.length) {
            newCorrectIndex = Math.max(0, updatedChoices.length - 1);
        } else if ((formData.correctOptionIndex ?? 0) > index) {
            // Silinen seçenek doğru seçeneğin önündeyse, index'i bir azalt
            newCorrectIndex = (formData.correctOptionIndex ?? 0) - 1;
        }
        
        // isCorrect değerlerini güncelle
        const choicesWithCorrect = updatedChoices.map((choice, i) => ({
            ...choice,
            isCorrect: i === newCorrectIndex
        }));
        
        const updatedOptions = {...formData.options, choices: choicesWithCorrect};
        const updatedData = {
            ...formData,
            options: updatedOptions,
            correctOptionIndex: newCorrectIndex
        };
        setFormData(updatedData);
        
        // ÖNEMLİ: value'dan gelen id ve diğer base field'ları koru (update modu için gerekli)
        onChange({
            ...(value || {}), // id ve diğer base field'ları koru (value null ise boş obje)
            options: updatedData.options,
            correctOptionIndex: updatedData.correctOptionIndex,
        });
    };

    const updateChoice = <K extends keyof ChoiceOption>(
        index: number,
        field: K,
        value: ChoiceOption[K]
    ) => {
        const updatedChoices = formData.options?.choices?.map((choice, i) =>
            i === index ? {...choice, [field]: value} : choice
        ) || [];

        handleChange('options', {...formData.options, choices: updatedChoices});
    };



    const validateForm = (): boolean => {
        const newErrors: MultipleChoiceTemplateFormErrors = {};

        

        if (!formData.options?.choices || formData.options.choices.length < 2) {
            newErrors.options = 'En az 2 seçenek olmalıdır';
        } else {
            const invalidChoices = formData.options.choices.some(choice => !choice.text?.trim());
            if (invalidChoices) {
                newErrors.options = 'Tüm seçenek metinleri doldurulmalıdır';
            }
        }

        if ((formData.correctOptionIndex ?? -1) < 0 || (formData.correctOptionIndex ?? -1) >= (formData.options?.choices?.length || 0)) {
            newErrors.correctOptionIndex = 'Geçerli bir doğru cevap seçilmelidir';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
        validate: validateForm,
        getErrors: () => errors
    }));

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Çoktan Seçmeli Soru Ayarları</h3>

          

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

                {formData.options?.choices?.map((choice, index) => (
                    <div key={choice.id || index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                        <div className="col-span-1">
                            <Label>#{index + 1}</Label>
                            <div className="flex items-center space-x-2 mt-1">
                                <Checkbox
                                    checked={(formData.correctOptionIndex ?? -1) === index}
                                    onChange={(checked) => {
                                        if (checked) {
                                            handleChange('correctOptionIndex', index);
                                        }
                                    }}
                                />
                                <Label className="text-xs">Doğru</Label>
                            </div>
                        </div>

                        

                        <div className="col-span-10">
                            <Label>Seçenek Metni</Label>
                            <HtmlEditor
                              value={choice.text || ''}
                              onChange={(nextHtml) => updateChoice(index, 'text', nextHtml)}
                              placeholder="Seçenek metnini giriniz"
                              minHeightClassName="min-h-[60px]"
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
        </div>
    );
});


MultipleChoiceTemplateForm.displayName = 'MultipleChoiceTemplateForm';
export default MultipleChoiceTemplateForm;