'use client';

import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NumberInput } from "@/components/ui/number-input";
import {VideoResponseTemplateDto} from "@/types/exam/questionTemplates";

interface VideoResponseTemplateFormData {
    prompt?: string;
    videoPromptUrl?: string;
    maxRecordingDuration?: number;
    minRecordingDuration?: number;
    gradingCriteria: string[];
    rubric?: string;
    requiresManualGrading?: boolean;
    allowedFormats?: string;
    allowScreenRecording?: boolean;
}

interface VideoResponseTemplateFormErrors {
    prompt?: string;
    maxRecordingDuration?: string;
    minRecordingDuration?: string;
    gradingCriteria?: string;
}

interface VideoResponseTemplateFormProps {
    onChange: (data: VideoResponseTemplateFormData) => void;
    value?: VideoResponseTemplateDto | null;
    loading?: boolean;
}


export interface VideoResponseTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => VideoResponseTemplateFormErrors;
}


const VideoResponseTemplateForm = forwardRef<VideoResponseTemplateFormHandle, VideoResponseTemplateFormProps>(({
                                                                                                   value,
                                                                                                   onChange,
                                                                                               }, ref) => {

    const [formData, setFormData] = useState<VideoResponseTemplateFormData>({
        prompt: '',
        videoPromptUrl: '', // UI'dan kaldırıldı, her zaman boş string
        maxRecordingDuration: 300,
        minRecordingDuration: 30,
        gradingCriteria: [], // UI'dan kaldırıldı, her zaman boş array
        rubric: '',
        requiresManualGrading: true, // UI'dan kaldırıldı, her zaman true
        allowedFormats: 'mp4,webm,mov', // UI'dan kaldırıldı, her zaman sabit değer
        allowScreenRecording: true // UI'dan kaldırıldı, her zaman true
    });

    const [errors, setErrors] = useState<VideoResponseTemplateFormErrors>({});

    useEffect(() => {
        if (value) {
            setFormData({
                prompt: value.prompt || '',
                videoPromptUrl: '', // UI'dan kaldırıldı, her zaman boş string
                maxRecordingDuration: value.maxRecordingDuration || 300,
                minRecordingDuration: value.minRecordingDuration || 30,
                gradingCriteria: [], // UI'dan kaldırıldı, her zaman boş array
                rubric: value.rubric || '',
                requiresManualGrading: true, // UI'dan kaldırıldı, her zaman true
                allowedFormats: 'mp4,webm,mov', // UI'dan kaldırıldı, her zaman sabit değer
                allowScreenRecording: true // UI'dan kaldırıldı, her zaman true
            });
        }
    }, []);

    const handleChange = <T extends keyof VideoResponseTemplateFormData>(
        name: T,
        value: VideoResponseTemplateFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };



    const validateForm = (): boolean => {
        const newErrors: VideoResponseTemplateFormErrors = {};

        if (!formData.prompt?.trim()) {
            newErrors.prompt = 'Video istemi zorunludur';
        } else if (formData.prompt.trim().length < 10) {
            newErrors.prompt = 'Video istemi en az 10 karakter olmalıdır';
        }

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

        // gradingCriteria kontrolü kaldırıldı - UI'dan kaldırıldı, her zaman boş array

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };




    useEffect(() => {
        // İlk render'da boş form için onChange tetikleme
        if (formData.prompt) {
            onChange({
                ...formData,
                videoPromptUrl: '', // UI'dan kaldırıldı, her zaman boş string
                allowedFormats: 'mp4,webm,mov', // UI'dan kaldırıldı, her zaman sabit değer
                requiresManualGrading: true, // UI'dan kaldırıldı, her zaman true
                allowScreenRecording: true, // UI'dan kaldırıldı, her zaman true
                gradingCriteria: [] // UI'dan kaldırıldı, her zaman boş array
            });
        }
    }, [formData]); // onChange ve value bağımlılığı yok - sonsuz döngü önlendi

    useImperativeHandle(ref, () => ({
        validate: validateForm,
        getErrors: () => errors
    }));


    return (
        <Card>
            <CardHeader>
                <CardTitle>Video Yanıt Şablonu Özellikleri</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Video İstemi */}
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="prompt">Video İstemi *</Label>
                            <Textarea
                                id="prompt"
                                value={formData.prompt}
                                onChange={(e) => handleChange('prompt', e.target.value)}
                                className={`min-h-[100px] ${errors.prompt ? 'border-red-500' : ''}`}
                                placeholder="Öğrencilerin cevaplaması gereken video sorusunu yazınız"
                            />
                            {errors.prompt && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.prompt}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Video Prompt URL - YORUM SATIRI: UI'dan kaldırıldı, API'ye boş string gönderiliyor */}
                        {/* <div className="col-span-2 space-y-2">
                            <Label htmlFor="videoPromptUrl">Video Prompt URL</Label>
                            <Input
                                id="videoPromptUrl"
                                value={formData.videoPromptUrl}
                                onChange={(e) => handleChange('videoPromptUrl', e.target.value)}
                                placeholder="Örnek video URL'si (opsiyonel)"
                            />
                        </div> */}

                        {/* Maksimum Kayıt Süresi */}
                        <div className="space-y-2">
                            <Label htmlFor="maxRecordingDuration">Maksimum Kayıt Süresi (saniye)</Label>
                            <NumberInput
                                id="maxRecordingDuration"
                                inputType={"number"}
                                value={formData.maxRecordingDuration || 0}
                                onChange={(value) => handleChange('maxRecordingDuration', value || undefined)}
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

                        {/* Minimum Kayıt Süresi */}
                        <div className="space-y-2">
                            <Label htmlFor="minRecordingDuration">Minimum Kayıt Süresi (saniye)</Label>
                            <NumberInput
                                id="minRecordingDuration"
                                inputType={"number"}
                                value={formData.minRecordingDuration || 0}
                                onChange={(value) => handleChange('minRecordingDuration', value || undefined)}
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

                        {/* İzin Verilen Formatlar - YORUM SATIRI: UI'dan kaldırıldı, değeri "mp4,webm,mov" */}
                        {/* <div className="space-y-2">
                            <Label htmlFor="allowedFormats">İzin Verilen Formatlar</Label>
                            <Input
                                id="allowedFormats"
                                value={formData.allowedFormats}
                                onChange={(e) => handleChange('allowedFormats', e.target.value)}
                                placeholder="mp4,webm,mov"
                            />
                            <p className="text-sm text-gray-600">Virgülle ayırarak birden fazla format girebilirsiniz</p>
                        </div> */}

                        {/* Checkbox'lar - YORUM SATIRI: UI'dan kaldırıldı, değerleri sabit */}
                        {/* <div className="space-y-4">
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
                                    id="allowScreenRecording"
                                    checked={formData.allowScreenRecording}
                                    onChange={(checked) => handleChange('allowScreenRecording', !!checked)}
                                />
                                <Label htmlFor="allowScreenRecording">Ekran Kaydına İzin Ver</Label>
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
                </div>
            </CardContent>
        </Card>
    );
});

VideoResponseTemplateForm.displayName = 'VideoResponseTemplateForm';

export default VideoResponseTemplateForm;