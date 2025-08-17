'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Checkbox from "@/components/ui/checkbox";
import { NumberInput } from "@/components/ui/number-input";
import { ImageResponseTemplateDto } from "@/types/exam/questionTemplates";
import { Trash2, Plus } from "lucide-react";

interface ImageResponseTemplateFormData {
    prompt?: string;
    referenceImageUrl?: string;
    maxFileSize?: number;
    gradingCriteria: string[];
    rubric?: string;
    requiresManualGrading?: boolean;
    allowedFormats?: string;
    requiresDrawing?: boolean;
    allowsUpload?: boolean;
}

interface ImageResponseTemplateFormErrors {
    prompt?: string;
    maxFileSize?: string;
    gradingCriteria?: string;
}

interface ImageResponseTemplateFormProps {
    onChange: (data: ImageResponseTemplateFormData) => void;
    value?: ImageResponseTemplateDto | null;
    loading?: boolean;
}

const ImageResponseTemplateForm: React.FC<ImageResponseTemplateFormProps> = ({
                                                                                 onChange,
                                                                                 value,
                                                                                 loading = false
                                                                             }) => {
    const [formData, setFormData] = useState<ImageResponseTemplateFormData>({
        prompt: '',
        referenceImageUrl: '',
        maxFileSize: 5,
        gradingCriteria: [],
        rubric: '',
        requiresManualGrading: true,
        allowedFormats: 'jpg,jpeg,png,gif,bmp',
        requiresDrawing: false,
        allowsUpload: true
    });

    const [errors, setErrors] = useState<ImageResponseTemplateFormErrors>({});
    const [criteriaInput, setCriteriaInput] = useState('');

    useEffect(() => {
        if (value) {
            setFormData({
                prompt: value.prompt || '',
                referenceImageUrl: value.referenceImageUrl || '',
                maxFileSize: value.maxFileSize || 5,
                gradingCriteria: value.gradingCriteria || [],
                rubric: value.rubric || '',
                requiresManualGrading: value.requiresManualGrading ?? true,
                allowedFormats: value.allowedFormats || 'jpg,jpeg,png,gif,bmp',
                requiresDrawing: value.requiresDrawing ?? false,
                allowsUpload: value.allowsUpload ?? true
            });
        }
    }, [value]);

    const handleChange = <T extends keyof ImageResponseTemplateFormData>(
        name: T,
        value: ImageResponseTemplateFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addCriteria = () => {
        if (criteriaInput.trim() && !formData.gradingCriteria.includes(criteriaInput.trim())) {
            setFormData(prev => ({
                ...prev,
                gradingCriteria: [...prev.gradingCriteria, criteriaInput.trim()]
            }));
            setCriteriaInput('');
        }
    };

    const removeCriteria = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gradingCriteria: prev.gradingCriteria.filter((_, i) => i !== index)
        }));
    };

    const handleCriteriaInputKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCriteria();
        }
    };

    const validateForm = (): boolean => {
        const newErrors: ImageResponseTemplateFormErrors = {};

        if (!formData.prompt?.trim()) {
            newErrors.prompt = 'Resim istemi zorunludur';
        } else if (formData.prompt.trim().length < 10) {
            newErrors.prompt = 'Resim istemi en az 10 karakter olmalıdır';
        }

        if (formData.maxFileSize !== undefined && formData.maxFileSize <= 0) {
            newErrors.maxFileSize = 'Maksimum dosya boyutu 0\'dan büyük olmalıdır';
        } else if (formData.maxFileSize !== undefined && formData.maxFileSize > 50) {
            newErrors.maxFileSize = 'Maksimum dosya boyutu 50 MB\'dan büyük olamaz';
        }

        if (formData.gradingCriteria.length === 0) {
            newErrors.gradingCriteria = 'En az bir değerlendirme kriteri eklenmelidir';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onChange(formData);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resim Yanıt Şablonu Özellikleri</CardTitle>
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

                        {/* Referans Resim URL */}
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="referenceImageUrl">Referans Resim URL</Label>
                            <Input
                                id="referenceImageUrl"
                                value={formData.referenceImageUrl}
                                onChange={(e) => handleChange('referenceImageUrl', e.target.value)}
                                placeholder="Örnek resim URL'si (opsiyonel)"
                            />
                        </div>

                        {/* Maksimum Dosya Boyutu */}
                        <div className="space-y-2">
                            <Label htmlFor="maxFileSize">Maksimum Dosya Boyutu (MB)</Label>
                            <NumberInput
                                id="maxFileSize"
                                value={formData.maxFileSize || 0}
                                onChange={(value) => handleChange('maxFileSize', value || undefined)}
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

                        {/* İzin Verilen Formatlar */}
                        <div className="space-y-2">
                            <Label htmlFor="allowedFormats">İzin Verilen Formatlar</Label>
                            <Input
                                id="allowedFormats"
                                value={formData.allowedFormats}
                                onChange={(e) => handleChange('allowedFormats', e.target.value)}
                                placeholder="jpg,jpeg,png,gif,bmp"
                            />
                            <p className="text-sm text-gray-600">Virgülle ayırarak birden fazla format girebilirsiniz</p>
                        </div>

                        {/* Checkbox'lar */}
                        <div className="col-span-2 grid grid-cols-2 gap-4">
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
                        </div>
                    </div>

                    {/* Değerlendirme Kriterleri */}
                    <div className="space-y-4">
                        <Label>Değerlendirme Kriterleri *</Label>

                        {/* Kriter Ekleme */}
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

                        {/* Mevcut Kriterler */}
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
                    </div>

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

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "İşleniyor..." : "Resim Yanıt Şablonu Kaydet"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ImageResponseTemplateForm;