'use client';

import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import type { ImageResponseTemplateDto } from "@/api/generated/model";

interface ImageResponseTemplateFormProps {
    onChange: (data: ImageResponseTemplateDto) => void;
    value?: ImageResponseTemplateDto | null;
    loading?: boolean;
}

interface ImageResponseTemplateFormErrors {
    maxFileSize?: string;
}

export interface ImageResponseTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => ImageResponseTemplateFormErrors;
}

/** UI: MB; API: bytes */
function mbToBytes(mb: number): number {
    return Math.round(mb * 1024 * 1024);
}

function bytesToMb(bytes: number | undefined): number {
    if (bytes == null || bytes <= 0) return 5;
    return Math.round((bytes / (1024 * 1024)) * 10) / 10;
}

const ImageResponseTemplateForm = forwardRef<ImageResponseTemplateFormHandle, ImageResponseTemplateFormProps>(({
    onChange,
    value,
}, ref) => {
    const [maxFileSizeMb, setMaxFileSizeMb] = useState(5);
    const [errors, setErrors] = useState<ImageResponseTemplateFormErrors>({});

    useEffect(() => {
        if (value?.maxFileSize != null) {
            setMaxFileSizeMb(bytesToMb(value.maxFileSize));
        }
    }, [value?.id]);

    useEffect(() => {
        onChange({
            ...(value || {}),
            maxFileSize: mbToBytes(maxFileSizeMb),
            requiresManualGrading: true,
            allowedFormats: 'jpg,jpeg,png,gif,bmp',
            requiresDrawing: false,
            allowsUpload: true,
        });
    }, [maxFileSizeMb]);

    const validateForm = (): boolean => {
        const newErrors: ImageResponseTemplateFormErrors = {};

        if (maxFileSizeMb <= 0) {
            newErrors.maxFileSize = 'Maksimum dosya boyutu 0\'dan büyük olmalıdır';
        } else if (maxFileSizeMb > 50) {
            newErrors.maxFileSize = 'Maksimum dosya boyutu 50 MB\'dan büyük olamaz';
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
                <CardTitle>Resim Yanıt Şablon Detayları</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="maxFileSize">Maksimum Dosya Boyutu (MB)</Label>
                        <NumberInput
                            id="maxFileSize"
                            inputType={"number"}
                            value={maxFileSizeMb || 0}
                            onChange={(val) => {
                                setMaxFileSizeMb(val || 0);
                                if (errors.maxFileSize) {
                                    setErrors(prev => ({ ...prev, maxFileSize: undefined }));
                                }
                            }}
                            minValue={0.1}
                            maxValue={50}
                            decimalPlaces={1}
                            unit="MB"
                            className={errors.maxFileSize ? 'border-red-500' : ''}
                        />
                        {errors.maxFileSize && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.maxFileSize}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});

ImageResponseTemplateForm.displayName = 'ImageResponseTemplateForm';

export default ImageResponseTemplateForm;
