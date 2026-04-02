'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import type { VideoResponseTemplateDto } from "@/api/generated/model";

interface VideoResponseTemplateFormProps {
    onChange: (data: VideoResponseTemplateDto) => void;
    value?: VideoResponseTemplateDto | null;
    loading?: boolean;
}

interface VideoResponseTemplateFormErrors {
    maxRecordingDuration?: string;
    minRecordingDuration?: string;
}

export interface VideoResponseTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => VideoResponseTemplateFormErrors;
}

const VideoResponseTemplateForm = forwardRef<VideoResponseTemplateFormHandle, VideoResponseTemplateFormProps>(({
    value,
    onChange,
}, ref) => {
    const [formData, setFormData] = useState({
        maxRecordingDuration: 300,
        minRecordingDuration: 30,
    });

    const [errors, setErrors] = useState<VideoResponseTemplateFormErrors>({});

    useEffect(() => {
        if (value) {
            setFormData({
                maxRecordingDuration: value.maxRecordingDuration ?? 300,
                minRecordingDuration: value.minRecordingDuration ?? 30,
            });
        }
    }, [value?.id]);

    useEffect(() => {
        onChange({
            ...(value || {}),
            maxRecordingDuration: formData.maxRecordingDuration,
            minRecordingDuration: formData.minRecordingDuration,
            requiresManualGrading: true,
            allowedFormats: 'mp4,webm,mov',
            allowScreenRecording: true,
        });
    }, [formData.maxRecordingDuration, formData.minRecordingDuration]);

    const handleChange = (name: 'maxRecordingDuration' | 'minRecordingDuration', v: number | undefined) => {
        setFormData(prev => ({ ...prev, [name]: v ?? prev[name] }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: VideoResponseTemplateFormErrors = {};

        if (formData.maxRecordingDuration !== undefined && formData.maxRecordingDuration <= 0) {
            newErrors.maxRecordingDuration = 'Maksimum kayıt süresi 0\'dan büyük olmalıdır';
        } else if (formData.maxRecordingDuration !== undefined && formData.maxRecordingDuration > 3600) {
            newErrors.maxRecordingDuration = 'Maksimum kayıt süresi 1 saatten uzun olamaz';
        }

        if (formData.minRecordingDuration !== undefined && formData.minRecordingDuration <= 0) {
            newErrors.minRecordingDuration = 'Minimum kayıt süresi 0\'dan büyük olmalıdır';
        }

        if (formData.maxRecordingDuration !== undefined && formData.minRecordingDuration !== undefined &&
            formData.minRecordingDuration >= formData.maxRecordingDuration) {
            newErrors.minRecordingDuration = 'Minimum süre maksimum süreden küçük olmalıdır';
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
                <CardTitle>Video Yanıt Şablonu Özellikleri</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="maxRecordingDuration">Maksimum Kayıt Süresi (saniye)</Label>
                            <NumberInput
                                id="maxRecordingDuration"
                                inputType={"number"}
                                value={formData.maxRecordingDuration || 0}
                                onChange={(val) => handleChange('maxRecordingDuration', val || undefined)}
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

                        <div className="space-y-2">
                            <Label htmlFor="minRecordingDuration">Minimum Kayıt Süresi (saniye)</Label>
                            <NumberInput
                                id="minRecordingDuration"
                                inputType={"number"}
                                value={formData.minRecordingDuration || 0}
                                onChange={(val) => handleChange('minRecordingDuration', val || undefined)}
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
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});

VideoResponseTemplateForm.displayName = 'VideoResponseTemplateForm';

export default VideoResponseTemplateForm;
