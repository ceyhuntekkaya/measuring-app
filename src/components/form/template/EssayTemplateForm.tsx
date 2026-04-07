'use client';

import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import type { EssayTemplateDto } from "@/api/generated/model";

type EssayTemplateFormData = Pick<EssayTemplateDto, 'minWords' | 'maxWords'>;

interface EssayTemplateFormErrors {
    minWords?: string;
    maxWords?: string;
}

interface EssayTemplateFormProps {
    value?: EssayTemplateDto | null;
    onChange: (data: EssayTemplateDto) => void;
    loading?: boolean;
}

export interface EssayTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => EssayTemplateFormErrors;
}

const EssayTemplateForm = forwardRef<EssayTemplateFormHandle, EssayTemplateFormProps>(({
    value,
    onChange,
}, ref) => {
    const [formData, setFormData] = useState<EssayTemplateFormData>({
        minWords: 50,
        maxWords: 1000,
    });

    const [errors, setErrors] = useState<EssayTemplateFormErrors>({});

    useEffect(() => {
        if (value) {
            setFormData({
                minWords: value.minWords ?? 50,
                maxWords: value.maxWords ?? 1000,
            });
        }
    }, [value?.id]);

    useEffect(() => {
        onChange({
            ...(value || {}),
            minWords: formData.minWords,
            maxWords: formData.maxWords,
        });
    }, [formData.minWords, formData.maxWords]);

    const handleChange = <T extends keyof EssayTemplateFormData>(
        field: T,
        newValue: EssayTemplateFormData[T]
    ) => {
        setFormData(prev => ({ ...prev, [field]: newValue }));
        if (errors[field as keyof EssayTemplateFormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: EssayTemplateFormErrors = {};

        if ((formData.minWords ?? 0) <= 0) {
            newErrors.minWords = 'Minimum kelime sayısı 0\'dan büyük olmalıdır';
        }

        if ((formData.maxWords ?? 0) <= (formData.minWords ?? 0)) {
            newErrors.maxWords = 'Maksimum kelime sayısı minimum kelime sayısından büyük olmalıdır';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
        validate: validateForm,
        getErrors: () => errors,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Kompozisyon Şablon Detayları</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="minWords">Minimum Kelime Sayısı</Label>
                            <NumberInput
                                id="minWords"
                                inputType={"number"}
                                value={formData.minWords}
                                onChange={(val) => handleChange('minWords', val)}
                                minValue={1}
                                decimalPlaces={0}
                                unit="kelime"
                                className={errors.minWords ? 'border-red-500' : ''}
                            />
                            {errors.minWords && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.minWords}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxWords">Maksimum Kelime Sayısı</Label>
                            <NumberInput
                                id="maxWords"
                                inputType={"number"}
                                value={formData.maxWords}
                                onChange={(val) => handleChange('maxWords', val)}
                                minValue={1}
                                decimalPlaces={0}
                                unit="kelime"
                                className={errors.maxWords ? 'border-red-500' : ''}
                            />
                            {errors.maxWords && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.maxWords}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});

EssayTemplateForm.displayName = 'EssayTemplateForm';

export default EssayTemplateForm;
