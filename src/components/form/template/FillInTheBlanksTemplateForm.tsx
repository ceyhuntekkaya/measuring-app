'use client';

import React, {useEffect, useState} from 'react';
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {NumberInput} from "@/components/ui/number-input";
import {FillInTheBlanksTemplateDto, FillInTheBlanksOptions, BlankAnswer} from "@/types/exam/questionTemplates";
import {Trash2, Plus} from "lucide-react";
import Checkbox from "@/components/ui/checkbox";

interface FillInTheBlanksTemplateFormData {
    textWithBlanks: string;
    options: FillInTheBlanksOptions;
    caseSensitive: boolean;
    exactMatch: boolean;
    explanation: string;
}

interface FillInTheBlanksTemplateFormErrors {
    textWithBlanks?: string;
    options?: string;
}

interface FillInTheBlanksTemplateFormProps {
    value?: FillInTheBlanksTemplateDto;
    onChange: (data: Partial<FillInTheBlanksTemplateDto>) => void;
}

const FillInTheBlanksTemplateForm: React.FC<FillInTheBlanksTemplateFormProps> = ({
                                                                                     value,
                                                                                     onChange
                                                                                 }) => {
    const [formData, setFormData] = useState<FillInTheBlanksTemplateFormData>({
        textWithBlanks: '',
        options: {blanks: []},
        caseSensitive: false,
        exactMatch: false,
        explanation: ''
    });

    const [errors, setErrors] = useState<FillInTheBlanksTemplateFormErrors>({});

    useEffect(() => {
        if (value) {
            setFormData({
                textWithBlanks: value.textWithBlanks || '',
                options: value.options || {blanks: []},
                caseSensitive: value.caseSensitive || false,
                exactMatch: value.exactMatch || false,
                explanation: value.explanation || ''
            });
        }
    }, [value]);

    const handleChange = <T extends keyof FillInTheBlanksTemplateFormData>(
        field: T,
        newValue: FillInTheBlanksTemplateFormData[T]
    ) => {
        const updatedData = {...formData, [field]: newValue};
        setFormData(updatedData);

        // Parent component'e değişiklikleri bildir
        if (validateForm()) {
            onChange({
                textWithBlanks: updatedData.textWithBlanks,
                options: updatedData.options,
                caseSensitive: updatedData.caseSensitive,
                exactMatch: updatedData.exactMatch,
                explanation: updatedData.explanation
            });
        }
    };

    const addBlank = () => {
        const newBlank: BlankAnswer = {
            blankId: `blank_${Date.now()}`,
            acceptableAnswers: [''],
            caseSensitive: false,
            exactMatch: false,
            score: 1,
            feedback: ''
        };

        const updatedBlanks = [...(formData.options.blanks || []), newBlank];
        handleChange('options', {...formData.options, blanks: updatedBlanks});
    };

    const removeBlank = (index: number) => {
        const updatedBlanks = formData.options.blanks?.filter((_, i) => i !== index) || [];
        handleChange('options', {...formData.options, blanks: updatedBlanks});
    };

    const updateBlank = <K extends keyof BlankAnswer>(
        index: number,
        field: K,
        value: BlankAnswer[K]
    ) => {
        const updatedBlanks = formData.options.blanks?.map((blank, i) =>
            i === index ? {...blank, [field]: value} : blank
        ) || [];

        handleChange('options', {...formData.options, blanks: updatedBlanks});
    };

    const addAcceptableAnswer = (blankIndex: number) => {
        const updatedBlanks = formData.options.blanks?.map((blank, i) =>
            i === blankIndex
                ? {...blank, acceptableAnswers: [...(blank.acceptableAnswers || []), '']}
                : blank
        ) || [];

        handleChange('options', {...formData.options, blanks: updatedBlanks});
    };

    const removeAcceptableAnswer = (blankIndex: number, answerIndex: number) => {
        const updatedBlanks = formData.options.blanks?.map((blank, i) =>
            i === blankIndex
                ? {
                    ...blank,
                    acceptableAnswers: blank.acceptableAnswers?.filter((_, j) => j !== answerIndex) || []
                }
                : blank
        ) || [];

        handleChange('options', {...formData.options, blanks: updatedBlanks});
    };

    const updateAcceptableAnswer = (blankIndex: number, answerIndex: number, value: string) => {
        const updatedBlanks = formData.options.blanks?.map((blank, i) =>
            i === blankIndex
                ? {
                    ...blank,
                    acceptableAnswers: blank.acceptableAnswers?.map((answer, j) =>
                        j === answerIndex ? value : answer
                    ) || []
                }
                : blank
        ) || [];

        handleChange('options', {...formData.options, blanks: updatedBlanks});
    };

    const validateForm = (): boolean => {
        const newErrors: FillInTheBlanksTemplateFormErrors = {};

        if (!formData.textWithBlanks.trim()) {
            newErrors.textWithBlanks = 'Boşluklu metin zorunludur';
        }

        if (!formData.options.blanks || formData.options.blanks.length === 0) {
            newErrors.options = 'En az bir boşluk tanımlanmalıdır';
        } else {
            const invalidBlanks = formData.options.blanks.some(blank =>
                !blank.acceptableAnswers || blank.acceptableAnswers.length === 0 ||
                blank.acceptableAnswers.some(answer => !answer.trim())
            );
            if (invalidBlanks) {
                newErrors.options = 'Tüm boşluklar için en az bir kabul edilebilir cevap girilmelidir';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Boşluk Doldurma Soru Ayarları</h3>

            {/* Boşluklu Metin */}
            <div className="space-y-2">
                <Label htmlFor="textWithBlanks">Boşluklu Metin *</Label>
                <Textarea
                    id="textWithBlanks"
                    value={formData.textWithBlanks}
                    onChange={(e) => handleChange('textWithBlanks', e.target.value)}
                    className={`min-h-[120px] ${errors.textWithBlanks ? 'border-red-500' : ''}`}
                    placeholder="Metni giriniz. Boşlukları [blank_1], [blank_2] şeklinde işaretleyiniz."
                />
                <p className="text-sm text-gray-500">
                    İpucu: Boşlukları [blank_1], [blank_2], [blank_3] şeklinde numaralandırarak işaretleyin.
                </p>
                {errors.textWithBlanks && (
                    <Alert variant="destructive">
                        <AlertDescription>{errors.textWithBlanks}</AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Genel Ayarlar */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="caseSensitive"
                        checked={formData.caseSensitive}
                        onChange={(checked) => handleChange('caseSensitive', !!checked)}
                    />
                    <Label htmlFor="caseSensitive">Büyük/Küçük Harf Duyarlı</Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="exactMatch"
                        checked={formData.exactMatch}
                        onChange={(checked) => handleChange('exactMatch', !!checked)}
                    />
                    <Label htmlFor="exactMatch">Tam Eşleşme Gerekli</Label>
                </div>
            </div>

            {/* Boşluk Tanımları */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label>Boşluk Tanımları</Label>
                    <Button
                        type="button"
                        onClick={addBlank}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                    >
                        <Plus className="w-4 h-4 mr-2"/>
                        Boşluk Ekle
                    </Button>
                </div>

                {formData.options.blanks?.map((blank, blankIndex) => (
                    <div key={blank.blankId || blankIndex} className="p-4 border rounded-lg space-y-4">
                        <div className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-2">
                                <Label>Boşluk ID</Label>
                                <Input
                                    value={blank.blankId || ''}
                                    onChange={(e) => updateBlank(blankIndex, 'blankId', e.target.value)}
                                    placeholder="blank_1"
                                />
                            </div>

                            <div className="col-span-2">
                                <Label>Puan</Label>
                                <NumberInput
                                    inputType={"number"}
                                    value={blank.score || 1}
                                    onChange={(value) => updateBlank(blankIndex, 'score', value)}
                                    minValue={0}
                                    decimalPlaces={0}
                                />
                            </div>

                            <div className="col-span-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={blank.caseSensitive || false}
                                        onChange={(checked) => updateBlank(blankIndex, 'caseSensitive', !!checked)}
                                    />
                                    <Label className="text-xs">Harf Duyarlı</Label>
                                </div>
                            </div>

                            <div className="col-span-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={blank.exactMatch || false}
                                        onChange={(checked) => updateBlank(blankIndex, 'exactMatch', !!checked)}
                                    />
                                    <Label className="text-xs">Tam Eşleşme</Label>
                                </div>
                            </div>

                            <div className="col-span-3">
                                <Label>Geri Bildirim</Label>
                                <Input
                                    value={blank.feedback || ''}
                                    onChange={(e) => updateBlank(blankIndex, 'feedback', e.target.value)}
                                    placeholder="Geri bildirim (opsiyonel)"
                                />
                            </div>

                            <div className="col-span-1">
                                <Button
                                    type="button"
                                    onClick={() => removeBlank(blankIndex)}
                                    variant="primary"
                                    size="sm"
                                >
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            </div>
                        </div>

                        {/* Kabul Edilebilir Cevaplar */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Kabul Edilebilir Cevaplar</Label>
                                <Button
                                    type="button"
                                    onClick={() => addAcceptableAnswer(blankIndex)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    size="sm"
                                >
                                    <Plus className="w-4 h-4 mr-2"/>
                                    Cevap Ekle
                                </Button>
                            </div>

                            {blank.acceptableAnswers?.map((answer, answerIndex) => (
                                <div key={answerIndex} className="flex gap-2">
                                    <Input
                                        value={answer}
                                        onChange={(e) => updateAcceptableAnswer(blankIndex, answerIndex, e.target.value)}
                                        placeholder={`Kabul edilebilir cevap ${answerIndex + 1}`}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => removeAcceptableAnswer(blankIndex, answerIndex)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </Button>
                                </div>
                            ))}
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
        </div>
    );
};

export default FillInTheBlanksTemplateForm;