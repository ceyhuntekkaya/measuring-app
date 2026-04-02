'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import type { AudioResponseTemplateDto } from "@/api/generated/model";

interface AudioResponseTemplateFormProps {
    value?: AudioResponseTemplateDto | null;
    onChange: (data: AudioResponseTemplateDto) => void;
    loading?: boolean;
}

interface AudioResponseTemplateFormErrors {
    minRecordingDuration?: string;
    maxRecordingDuration?: string;
}

export interface AudioResponseTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => AudioResponseTemplateFormErrors;
}

const AudioResponseTemplateForm = forwardRef<AudioResponseTemplateFormHandle, AudioResponseTemplateFormProps>(({
    value,
    onChange,
}, ref) => {
    const [formData, setFormData] = useState({
        maxRecordingDuration: 300,
        minRecordingDuration: 10,
    });

    const [errors, setErrors] = useState<AudioResponseTemplateFormErrors>({});

    useEffect(() => {
        if (value) {
            setFormData({
                maxRecordingDuration: value.maxRecordingDuration ?? 300,
                minRecordingDuration: value.minRecordingDuration ?? 10,
            });
        }
    }, [value?.id]);

    useEffect(() => {
        onChange({
            ...(value || {}),
            maxRecordingDuration: formData.maxRecordingDuration,
            minRecordingDuration: formData.minRecordingDuration,
            requiresManualGrading: true,
            allowedFormats: 'mp3,wav,m4a',
        });
    }, [formData.maxRecordingDuration, formData.minRecordingDuration]);

    const handleChange = (name: 'maxRecordingDuration' | 'minRecordingDuration', newValue: number | undefined) => {
        setFormData(prev => ({ ...prev, [name]: newValue ?? prev[name] }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: AudioResponseTemplateFormErrors = {};

        if (formData.maxRecordingDuration && formData.minRecordingDuration &&
            formData.maxRecordingDuration <= formData.minRecordingDuration) {
            newErrors.maxRecordingDuration = 'Maksimum süre minimum süreden büyük olmalıdır';
        }

        if (formData.minRecordingDuration && formData.minRecordingDuration < 1) {
            newErrors.minRecordingDuration = 'Minimum süre 1 saniyeden az olamaz';
        }

        if (formData.maxRecordingDuration && formData.maxRecordingDuration > 3600) {
            newErrors.maxRecordingDuration = 'Maksimum süre 1 saatten fazla olamaz';
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
                <CardTitle>Ses Yanıtı Şablon Detayları</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="minRecordingDuration">Minimum Kayıt Süresi (saniye)</Label>
                            <NumberInput
                                id="minRecordingDuration"
                                inputType={"number"}
                                value={formData.minRecordingDuration || 10}
                                onChange={(val) => handleChange('minRecordingDuration', val)}
                                minValue={1}
                                maxValue={3600}
                                decimalPlaces={0}
                                unit="saniye"
                                className={errors.minRecordingDuration ? 'border-red-500' : ''}
                            />
                            {errors.minRecordingDuration && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.minRecordingDuration}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxRecordingDuration">Maksimum Kayıt Süresi (saniye)</Label>
                            <NumberInput
                                inputType={"number"}
                                id="maxRecordingDuration"
                                value={formData.maxRecordingDuration || 300}
                                onChange={(val) => handleChange('maxRecordingDuration', val)}
                                minValue={1}
                                maxValue={3600}
                                decimalPlaces={0}
                                unit="saniye"
                                className={errors.maxRecordingDuration ? 'border-red-500' : ''}
                            />
                            {errors.maxRecordingDuration && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.maxRecordingDuration}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});

AudioResponseTemplateForm.displayName = 'AudioResponseTemplateForm';

export default AudioResponseTemplateForm;
