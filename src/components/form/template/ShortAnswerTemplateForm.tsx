'use client';

import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Checkbox from "@/components/ui/checkbox";
import { NumberInput } from "@/components/ui/number-input";
import type { ShortAnswerTemplateDto, AcceptableAnswer, ShortAnswerOptions } from "@/api/generated/model";
import { Trash2, Plus } from "lucide-react";

type ShortAnswerTemplateFormData = {
    options: ShortAnswerOptions;
};

interface ShortAnswerTemplateFormErrors {
    question?: string;
    maxCharacters?: string;
    minCharacters?: string;
}

interface ShortAnswerTemplateFormProps {
    value?: ShortAnswerTemplateDto;
    onChange: (data: Partial<ShortAnswerTemplateDto>) => void;
    loading?: boolean;
}

export interface ShortAnswerTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => ShortAnswerTemplateFormErrors;
}

const ShortAnswerTemplateForm = forwardRef<ShortAnswerTemplateFormHandle, ShortAnswerTemplateFormProps>(({
                                                                                                 value,
                                                                                                 onChange,
                                                                                             }, ref) => {
    const [formData, setFormData] = useState<ShortAnswerTemplateFormData>({
        options: {
            acceptableAnswers: [],
            caseSensitive: false,
            exactMatch: false,
            placeholder: '' // UI'dan kaldırıldı, her zaman boş string
        },
    });

    const [errors, setErrors] = useState<ShortAnswerTemplateFormErrors>({});

    useEffect(() => {
        if (value) {
            setFormData({
                options: {
                    ...(value.options || {
                        acceptableAnswers: [],
                        caseSensitive: false,
                        exactMatch: false
                    }),
                    placeholder: '' // UI'dan kaldırıldı, her zaman boş string
                }
            });
        }
    }, []);

    const handleChange = <T extends keyof ShortAnswerTemplateFormData>(
        field: T,
        newValue: ShortAnswerTemplateFormData[T]
    ) => {
        const updatedData = { ...formData, [field]: newValue };
        setFormData(updatedData);

        // Her zaman onChange'i çağır, validation sadece submit için
        onChange({
            options: {
                ...updatedData.options,
                placeholder: '' // UI'dan kaldırıldı, her zaman boş string
            }
        });
    };

    const updateOptions = <K extends keyof ShortAnswerOptions>(
        field: K,
        value: ShortAnswerOptions[K]
    ) => {
        const updatedOptions = { 
            ...formData.options, 
            [field]: value,
            placeholder: '' // UI'dan kaldırıldı, her zaman boş string
        };
        handleChange('options', updatedOptions);
    };

    const addAcceptableAnswer = () => {
        const newAnswer: AcceptableAnswer = {
            answer: '',
            score: 1,
            feedback: ''
        };

        const updatedAnswers = [...(formData.options?.acceptableAnswers || []), newAnswer];
        updateOptions('acceptableAnswers', updatedAnswers);
    };

    const removeAcceptableAnswer = (index: number) => {
        const updatedAnswers = formData.options?.acceptableAnswers?.filter((_, i) => i !== index) || [];
        updateOptions('acceptableAnswers', updatedAnswers);
    };

    const updateAcceptableAnswer = <K extends keyof AcceptableAnswer>(
        index: number,
        field: K,
        value: AcceptableAnswer[K]
    ) => {
        const updatedAnswers = formData.options?.acceptableAnswers?.map((answer, i) =>
            i === index ? { ...answer, [field]: value } : answer
        ) || [];

        updateOptions('acceptableAnswers', updatedAnswers);
    };

    const validateForm = (): boolean => {
        const newErrors: ShortAnswerTemplateFormErrors = {};

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    useImperativeHandle(ref, () => ({
        validate: validateForm,
        getErrors: () => errors
    }));

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Kısa Cevap Soru Ayarları</h3>

          
            {/* Ayarlar */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="caseSensitive"
                        checked={formData.options?.caseSensitive || false}
                        onChange={(checked) => updateOptions('caseSensitive', !!checked)}
                    />
                    <Label htmlFor="caseSensitive">Büyük/Küçük Harf Duyarlı</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="exactMatch"
                        checked={formData.options?.exactMatch || false}
                        onChange={(checked) => updateOptions('exactMatch', !!checked)}
                    />
                    <Label htmlFor="exactMatch">Tam Eşleşme Gerekli</Label>
                </div>

                {/* Manuel Değerlendirme - YORUM SATIRI: UI'dan kaldırıldı, değeri her zaman false olarak gönderiliyor */}
                {/* <div className="flex items-center space-x-2">
                    <Checkbox
                        id="requiresManualGrading"
                        checked={formData.requiresManualGrading}
                        onChange={(checked) => handleChange('requiresManualGrading', !!checked)}
                    />
                    <Label htmlFor="requiresManualGrading">Manuel Değerlendirme</Label>
                </div> */}
            </div>

            {/* Kabul Edilebilir Cevaplar */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label>Kabul Edilebilir Cevaplar</Label>
                    <Button
                        type="button"
                        onClick={addAcceptableAnswer}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Cevap Ekle
                    </Button>
                </div>

                {formData.options?.acceptableAnswers?.map((answer, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                        <div className="col-span-9">
                            <Label>Cevap Metni</Label>
                            <Input
                                value={answer.answer || ''}
                                onChange={(e) => updateAcceptableAnswer(index, 'answer', e.target.value)}
                                placeholder="Kabul edilebilir cevap"
                            />
                        </div>

                        <div className="col-span-2">
                            <Label>Puan</Label>
                            <NumberInput
                                inputType={"number"}
                                value={answer.score || 1}
                                onChange={(value) => updateAcceptableAnswer(index, 'score', value)}
                                minValue={0}
                                decimalPlaces={0.1}
                            />
                        </div>

                       

                        <div className="col-span-1">
                            <Button
                                type="button"
                                onClick={() => removeAcceptableAnswer(index)}
                                variant="destructive"
                                size="sm"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            
        </div>
    );
});

ShortAnswerTemplateForm.displayName = 'ShortAnswerTemplateForm';

export default ShortAnswerTemplateForm;