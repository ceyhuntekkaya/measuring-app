'use client';

import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NumberInput } from "@/components/ui/number-input";
import type { ImageResponseTemplateDto } from "@/api/generated/model";

// Use ORVAL DTO types directly - only template-specific fields
type ImageResponseTemplateFormData = Pick<ImageResponseTemplateDto, 'prompt' | 'referenceImageUrl' | 'maxFileSize' | 'gradingCriteria' | 'rubric' | 'requiresManualGrading' | 'allowedFormats' | 'requiresDrawing' | 'allowsUpload'>;

interface ImageResponseTemplateFormErrors {
    prompt?: string;
    maxFileSize?: string;
    gradingCriteria?: string;
}

interface ImageResponseTemplateFormProps {
    onChange: (data: ImageResponseTemplateDto) => void;
    value?: ImageResponseTemplateDto | null;
    loading?: boolean;
}

// Validation handle için ref interface
export interface ImageResponseTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => ImageResponseTemplateFormErrors;
}

const ImageResponseTemplateForm = forwardRef<ImageResponseTemplateFormHandle, ImageResponseTemplateFormProps>(({
                                                                                                                   onChange,
                                                                                                                   value,
                                                                                                               }, ref) => {
    const [formData, setFormData] = useState<ImageResponseTemplateFormData>({
        prompt: '',
        referenceImageUrl: '', // UI'dan kaldırıldı, her zaman boş string
        maxFileSize: 5,
        gradingCriteria: [], // UI'dan kaldırıldı, her zaman boş array
        rubric: '',
        requiresManualGrading: true, // UI'dan kaldırıldı, her zaman true
        allowedFormats: 'jpg,jpeg,png,gif,bmp', // UI'dan kaldırıldı, her zaman sabit değer
        requiresDrawing: false, // UI'dan kaldırıldı, her zaman false
        allowsUpload: true // UI'dan kaldırıldı, her zaman true
    });

    const [errors, setErrors] = useState<ImageResponseTemplateFormErrors>({});

    // Value değiştiğinde form data'yı güncelle (Update modu için)
    useEffect(() => {
        if (value) {
            setFormData({
                prompt: value.prompt || '',
                referenceImageUrl: '', // UI'dan kaldırıldı, her zaman boş string
                maxFileSize: value.maxFileSize || 5,
                gradingCriteria: [], // UI'dan kaldırıldı, her zaman boş array
                rubric: value.rubric || '',
                requiresManualGrading: true, // UI'dan kaldırıldı, her zaman true
                allowedFormats: 'jpg,jpeg,png,gif,bmp', // UI'dan kaldırıldı, her zaman sabit değer
                requiresDrawing: false, // UI'dan kaldırıldı, her zaman false
                allowsUpload: true // UI'dan kaldırıldı, her zaman true
            });
        }
    }, []);

    // Form data değiştiğinde parent'a bildir (Anlık güncelleme)
    useEffect(() => {
        // İlk render'da boş form için onChange tetikleme
        if (formData.prompt) {
            const templateData: ImageResponseTemplateDto = {
                ...value,
                prompt: formData.prompt,
                referenceImageUrl: '', // UI'dan kaldırıldı, her zaman boş string
                maxFileSize: formData.maxFileSize,
                gradingCriteria: [], // UI'dan kaldırıldı, her zaman boş array
                rubric: formData.rubric,
                requiresManualGrading: true, // UI'dan kaldırıldı, her zaman true
                allowedFormats: 'jpg,jpeg,png,gif,bmp', // UI'dan kaldırıldı, her zaman sabit değer
                requiresDrawing: false, // UI'dan kaldırıldı, her zaman false
                allowsUpload: true // UI'dan kaldırıldı, her zaman true
            };
            onChange(templateData);
        }
    }, [formData]); // onChange ve value bağımlılığı yok - sonsuz döngü önlendi

    const handleChange = <T extends keyof ImageResponseTemplateFormData>(
        name: T,
        newValue: ImageResponseTemplateFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Hata varsa temizle
        if (errors[name as keyof ImageResponseTemplateFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };



    // Validation fonksiyonu - parent tarafından çağrılacak
    const validateForm = (): boolean => {
        const newErrors: ImageResponseTemplateFormErrors = {};

        if (!formData.prompt?.trim()) {
            newErrors.prompt = 'Resim istemi zorunludur';
        } else if (formData.prompt.trim().length < 10) {
            newErrors.prompt = 'Resim istemi en az 10 karakter olmalıdır';
        }

        if (formData.maxFileSize !== undefined && formData.maxFileSize <= 0) {
            newErrors.maxFileSize = 'Maksimum dosya boyutu 0\'dan büyük olmalıdır';
        } else         if (formData.maxFileSize !== undefined && formData.maxFileSize > 50) {
            newErrors.maxFileSize = 'Maksimum dosya boyutu 50 MB\'dan büyük olamaz';
        }

        // gradingCriteria kontrolü kaldırıldı - UI'dan kaldırıldı, her zaman boş array

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Parent component'in validate fonksiyonunu çağırabilmesi için
    useImperativeHandle(ref, () => ({
        validate: validateForm,
        getErrors: () => errors
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resim Yanıt Şablon Detayları</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Resim İstemi */}
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="prompt">Resim İstemi *</Label>
                            <Textarea
                                id="prompt"
                                value={formData.prompt}
                                onChange={(e) => handleChange('prompt', e.target.value)}
                                className={`min-h-[100px] ${errors.prompt ? 'border-red-500' : ''}`}
                                placeholder="Öğrencilerin cevaplaması gereken resim sorusunu yazınız"
                            />
                            {errors.prompt && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.prompt}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Referans Resim URL - YORUM SATIRI: UI'dan kaldırıldı, API'ye boş string gönderiliyor */}
                        {/* <div className="col-span-2 space-y-2">
                            <Label htmlFor="referenceImageUrl">Referans Resim URL</Label>
                            <Input
                                id="referenceImageUrl"
                                value={formData.referenceImageUrl}
                                onChange={(e) => handleChange('referenceImageUrl', e.target.value)}
                                placeholder="Örnek resim URL'si (opsiyonel)"
                            />
                        </div> */}

                        {/* Maksimum Dosya Boyutu */}
                        <div className="space-y-2">
                            <Label htmlFor="maxFileSize">Maksimum Dosya Boyutu (MB)</Label>
                            <NumberInput
                                id="maxFileSize"
                                inputType={"number"}
                                value={formData.maxFileSize || 0}
                                onChange={(val) => handleChange('maxFileSize', val || undefined)}
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

                        {/* İzin Verilen Formatlar - YORUM SATIRI: UI'dan kaldırıldı, değeri "jpg,jpeg,png,gif,bmp" */}
                        {/* <div className="space-y-2">
                            <Label htmlFor="allowedFormats">İzin Verilen Formatlar</Label>
                            <Input
                                id="allowedFormats"
                                value={formData.allowedFormats}
                                onChange={(e) => handleChange('allowedFormats', e.target.value)}
                                placeholder="jpg,jpeg,png,gif,bmp"
                            />
                            <p className="text-sm text-gray-600">Virgülle ayırarak birden fazla format girebilirsiniz</p>
                        </div> */}

                        {/* Checkbox'lar - YORUM SATIRI: UI'dan kaldırıldı, değerleri sabit */}
                        {/* <div className="col-span-2 grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="requiresManualGrading"
                                        checked={formData.requiresManualGrading}
                                        onChange={(checked) => handleChange('requiresManualGrading', !!checked)}
                                    />
                                    <Label htmlFor="requiresManualGrading">Manuel Değerlendirme Gerekli</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="requiresDrawing"
                                        checked={formData.requiresDrawing}
                                        onChange={(checked) => handleChange('requiresDrawing', !!checked)}
                                    />
                                    <Label htmlFor="requiresDrawing">Çizim Gerekli</Label>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="allowsUpload"
                                        checked={formData.allowsUpload}
                                        onChange={(checked) => handleChange('allowsUpload', !!checked)}
                                    />
                                    <Label htmlFor="allowsUpload">Dosya Yüklemeye İzin Ver</Label>
                                </div>
                            </div>
                        </div> */}
                    </div>

                    {/* Değerlendirme Kriterleri - YORUM SATIRI: UI'dan kaldırıldı, API'ye boş array gönderiliyor */}
                    {/* <div className="space-y-4">
                        <Label>Değerlendirme Kriterleri *</Label>

                        <div className="flex gap-2">
                            <Input
                                value={criteriaInput}
                                onChange={(e) => setCriteriaInput(e.target.value)}
                                onKeyPress={handleCriteriaInputKeyPress}
                                placeholder="Değerlendirme kriterini yazın ve Enter'a basın"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={addCriteria}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Ekle
                            </Button>
                        </div>

                        {formData.gradingCriteria.length > 0 && (
                            <div className="space-y-2">
                                {formData.gradingCriteria.map((criteria, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                                    >
                                        <span className="flex-1">{criteria}</span>
                                        <Button
                                            type="button"
                                            onClick={() => removeCriteria(index)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 hover:text-red-800 hover:bg-red-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {errors.gradingCriteria && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.gradingCriteria}</AlertDescription>
                            </Alert>
                        )}
                    </div> */}

                    {/* Rubrik */}
                    <div className="space-y-2">
                        <Label htmlFor="rubric">Değerlendirme Rubriği</Label>
                        <Textarea
                            id="rubric"
                            value={formData.rubric}
                            onChange={(e) => handleChange('rubric', e.target.value)}
                            className="min-h-[120px]"
                            placeholder="Detaylı değerlendirme rubriğini yazınız (opsiyonel)"
                        />
                    </div>

                    {/* KAYDET BUTONU KALDIRILDI - Parent component'te olacak */}
                </div>
            </CardContent>
        </Card>
    );
});

ImageResponseTemplateForm.displayName = 'ImageResponseTemplateForm';

export default ImageResponseTemplateForm;