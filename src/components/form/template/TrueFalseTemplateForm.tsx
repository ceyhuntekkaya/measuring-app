'use client';

import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrueFalseTemplateDto, TrueFalseOptions } from "@/types/exam/questionTemplates";

interface TrueFalseTemplateFormData {
    statement: string;
    options: TrueFalseOptions;
    correctAnswer: boolean;
    explanation: string;
}

interface TrueFalseTemplateFormErrors {
    statement?: string;
}

interface TrueFalseTemplateFormProps {
    value?: TrueFalseTemplateDto;
    onChange: (data: TrueFalseTemplateDto) => void;
    loading?: boolean;
}


export interface TrueFalseTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => TrueFalseTemplateFormErrors;
}

const TrueFalseTemplateForm = forwardRef<TrueFalseTemplateFormHandle, TrueFalseTemplateFormProps>(({
                                                                                                                                                         value,
                                                                                                                                                         onChange,
                                                                                                                                                     }, ref) => {
    const [formData, setFormData] = useState<TrueFalseTemplateFormData>({
        statement: '',
        options: {
            correctAnswer: true,
            trueLabel: 'Doğru',
            falseLabel: 'Yanlış',
            trueFeedback: '',
            falseFeedback: ''
        },
        correctAnswer: true,
        explanation: ''
    });

    const [errors, setErrors] = useState<TrueFalseTemplateFormErrors>({});

    useEffect(() => {
        if (value) {
            setFormData({
                statement: value.statement || '',
                options: value.options || {
                    correctAnswer: true,
                    trueLabel: 'Doğru',
                    falseLabel: 'Yanlış',
                    trueFeedback: '',
                    falseFeedback: ''
                },
                correctAnswer: value.correctAnswer ?? true,
                explanation: value.explanation || ''
            });
        }
    }, []);

    const handleChange = <T extends keyof TrueFalseTemplateFormData>(
        field: T,
        newValue: TrueFalseTemplateFormData[T]
    ) => {
        const updatedData = { ...formData, [field]: newValue };
        setFormData(updatedData);

        if (validateForm()) {
            onChange({
                statement: updatedData.statement,
                options: updatedData.options,
                correctAnswer: updatedData.correctAnswer,
                explanation: updatedData.explanation
            });
        }
    };

    const updateOptions = <K extends keyof TrueFalseOptions>(
        field: K,
        value: TrueFalseOptions[K]
    ) => {
        const updatedOptions = { ...formData.options, [field]: value };
        handleChange('options', updatedOptions);
    };

    const validateForm = (): boolean => {
        const newErrors: TrueFalseTemplateFormErrors = {};

        if (!formData.statement.trim()) {
            newErrors.statement = 'İfade metni zorunludur';
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
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Doğru/Yanlış Soru Ayarları</h3>

            {/* İfade Metni */}
            <div className="space-y-2">
                <Label htmlFor="statement">İfade Metni *</Label>
                <Textarea
                    id="statement"
                    value={formData.statement}
                    onChange={(e) => handleChange('statement', e.target.value)}
                    className={`min-h-[100px] ${errors.statement ? 'border-red-500' : ''}`}
                    placeholder="Değerlendirilecek ifadeyi giriniz"
                />
                {errors.statement && (
                    <Alert variant="destructive">
                        <AlertDescription>{errors.statement}</AlertDescription>
                    </Alert>
                )}
            </div>

            {/* Doğru Cevap */}
            <div className="space-y-2">
                <Label htmlFor="correctAnswer">Doğru Cevap</Label>
                <Select
                    onValueChange={(value) => {
                        const isTrue = value === 'true';
                        handleChange('correctAnswer', isTrue);
                        updateOptions('correctAnswer', isTrue);
                    }}
                    value={formData.correctAnswer.toString()}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="true">Doğru</SelectItem>
                            <SelectItem value="false">Yanlış</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Seçenek Etiketleri */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="trueLabel">Doğru Etiketi</Label>
                    <Input
                        id="trueLabel"
                        value={formData.options.trueLabel || ''}
                        onChange={(e) => updateOptions('trueLabel', e.target.value)}
                        placeholder="Doğru seçeneği etiketi"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="falseLabel">Yanlış Etiketi</Label>
                    <Input
                        id="falseLabel"
                        value={formData.options.falseLabel || ''}
                        onChange={(e) => updateOptions('falseLabel', e.target.value)}
                        placeholder="Yanlış seçeneği etiketi"
                    />
                </div>
            </div>

            {/* Geri Bildirimler */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="trueFeedback">Doğru Cevap Geri Bildirimi</Label>
                    <Textarea
                        id="trueFeedback"
                        value={formData.options.trueFeedback || ''}
                        onChange={(e) => updateOptions('trueFeedback', e.target.value)}
                        className="min-h-[80px]"
                        placeholder="Doğru cevap verildiğinde gösterilecek mesaj"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="falseFeedback">Yanlış Cevap Geri Bildirimi</Label>
                    <Textarea
                        id="falseFeedback"
                        value={formData.options.falseFeedback || ''}
                        onChange={(e) => updateOptions('falseFeedback', e.target.value)}
                        className="min-h-[80px]"
                        placeholder="Yanlış cevap verildiğinde gösterilecek mesaj"
                    />
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
                    placeholder="Soru açıklaması (opsiyonel)"
                />
            </div>
        </div>
    );
});

TrueFalseTemplateForm.displayName = 'TrueFalseTemplateForm';


export default TrueFalseTemplateForm;