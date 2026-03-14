'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NumberInput } from "@/components/ui/number-input";
import type { AudioResponseTemplateDto } from "@/api/generated/model";

interface AudioResponseTemplateFormProps {
    value?: AudioResponseTemplateDto | null;
    onChange: (data: AudioResponseTemplateDto) => void;
    loading?: boolean;
}

interface AudioResponseTemplateFormErrors {
    prompt?: string;
    minRecordingDuration?: string;
    maxRecordingDuration?: string;
}

// Validation handle için ref interface
export interface AudioResponseTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => AudioResponseTemplateFormErrors;
}

const AudioResponseTemplateForm = forwardRef<AudioResponseTemplateFormHandle, AudioResponseTemplateFormProps>(({
                                                                                                                   value,
                                                                                                                   onChange,
                                                                                                               }, ref) => {
    const [formData, setFormData] = useState<AudioResponseTemplateDto>({
        prompt: '',
        audioPromptUrl: '', // UI'dan kaldırıldı, her zaman boş string
        maxRecordingDuration: 300,
        minRecordingDuration: 10,
        gradingCriteria: [], // UI'dan kaldırıldı, her zaman boş array
        rubric: '',
        requiresManualGrading: true, // UI'dan kaldırıldı, her zaman true
        allowedFormats: 'mp3,wav,m4a' // UI'dan kaldırıldı, her zaman sabit değer
    });

    const [errors, setErrors] = useState<AudioResponseTemplateFormErrors>({});

    // Value değiştiğinde form data'yı güncelle (Update modu için)
    useEffect(() => {
        if (value) {
            setFormData({
                prompt: value.prompt || '',
                audioPromptUrl: '', // UI'dan kaldırıldı, her zaman boş string
                maxRecordingDuration: value.maxRecordingDuration || 300,
                minRecordingDuration: value.minRecordingDuration || 10,
                gradingCriteria: [], // UI'dan kaldırıldı, her zaman boş array
                rubric: value.rubric || '',
                requiresManualGrading: true, // UI'dan kaldırıldı, her zaman true
                allowedFormats: 'mp3,wav,m4a' // UI'dan kaldırıldı, her zaman sabit değer
            });
        }
    }, []);

    // Form data değiştiğinde parent'a bildir (Anlık güncelleme)
    useEffect(() => {
        // İlk render'da boş form için onChange tetikleme
        if (formData.prompt) {
            const templateData: AudioResponseTemplateDto = {
                ...value,
                prompt: formData.prompt,
                audioPromptUrl: '', // UI'dan kaldırıldı, her zaman boş string
                maxRecordingDuration: formData.maxRecordingDuration,
                minRecordingDuration: formData.minRecordingDuration,
                gradingCriteria: [], // UI'dan kaldırıldı, her zaman boş array
                rubric: formData.rubric,
                requiresManualGrading: true, // UI'dan kaldırıldı, her zaman true
                allowedFormats: 'mp3,wav,m4a' // UI'dan kaldırıldı, her zaman sabit değer
            };
            onChange(templateData);
        }
    }, [formData]); // onChange ve value bağımlılığı yok - sonsuz döngü önlendi

    const handleChange = <T extends keyof AudioResponseTemplateDto>(
        name: T,
        newValue: AudioResponseTemplateDto[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Hata varsa temizle
        if (errors[name as keyof AudioResponseTemplateFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };


    // Validation fonksiyonu - parent tarafından çağrılacak
    const validateForm = (): boolean => {
        const newErrors: AudioResponseTemplateFormErrors = {};

        if (!formData.prompt?.trim()) {
            newErrors.prompt = 'Soru metni zorunludur';
        }

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

    // Parent component'in validate fonksiyonunu çağırabilmesi için
    useImperativeHandle(ref, () => ({
        validate: validateForm,
        getErrors: () => errors
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ses Yanıtı Şablon Detayları</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Soru Metni */}
                    <div className="space-y-2">
                        <Label htmlFor="prompt">Soru Metni *</Label>
                        <Textarea
                            id="prompt"
                            value={formData.prompt}
                            onChange={(e) => handleChange('prompt', e.target.value)}
                            className={`min-h-[100px] ${errors.prompt ? 'border-red-500' : ''}`}
                            placeholder="Öğrencilere verilecek ses yanıtı sorusunu giriniz"
                        />
                        {errors.prompt && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.prompt}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Ses Prompt URL - YORUM SATIRI: UI'dan kaldırıldı, API'ye boş string gönderiliyor */}
                    {/* <div className="space-y-2">
                        <Label htmlFor="audioPromptUrl">Ses Prompt URL</Label>
                        <Input
                            id="audioPromptUrl"
                            value={formData.audioPromptUrl}
                            onChange={(e) => handleChange('audioPromptUrl', e.target.value)}
                            placeholder="Dinletilecek ses dosyasının URL'sini giriniz (opsiyonel)"
                        />


                        <FileUpload
                            acceptedFileTypes={['audio']}
                            maxFileSize={20} // 2MB
                            entityId={"qg_audio"}
                            uploadType="audioPromptUrl"
                            multiple={false}

                            labelText="Sesli Açıklama Ekle"
                            onUploadComplete={(files) => {
                                handleChange('audioPromptUrl', files[0].path)
                            }}
                        />

                        {
                            formData.audioPromptUrl && formData.audioPromptUrl !== '' &&
                            <FilePreview fileUrl={formData.audioPromptUrl} alt="Logo" />
                        }


                    </div> */}

                    {/* Kayıt Süreleri */}
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

                    {/* İzin Verilen Formatlar - YORUM SATIRI: UI'dan kaldırıldı, değeri "mp3,wav,m4a" */}
                    {/* <div className="space-y-2">
                        <Label htmlFor="allowedFormats">İzin Verilen Formatlar</Label>
                        <Input
                            id="allowedFormats"
                            value={formData.allowedFormats}
                            onChange={(e) => handleChange('allowedFormats', e.target.value)}
                            placeholder="mp3,wav,m4a (virgülle ayırarak yazınız)"
                        />
                        <p className="text-sm text-gray-600">
                            Desteklenen formatları virgülle ayırarak yazınız (örn: mp3,wav,m4a)
                        </p>
                    </div> */}

                    {/* Değerlendirme Kriterleri - YORUM SATIRI: UI'dan kaldırıldı, API'ye boş array gönderiliyor */}
                    {/* <div className="space-y-4">
                        <Label>Değerlendirme Kriterleri</Label>

                        <div className="flex gap-2">
                            <Input
                                value={criteriaInput}
                                onChange={(e) => setCriteriaInput(e.target.value)}
                                onKeyPress={handleCriteriaInputKeyPress}
                                placeholder="Değerlendirme kriteri eklemek için yazın ve Enter'a basın"
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

                        {formData.gradingCriteria && formData.gradingCriteria.length > 0 && (
                            <div className="space-y-2">
                                {formData.gradingCriteria.map((criteria, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                                    >
                                        <span>{criteria}</span>
                                        <Button
                                            type="button"
                                            onClick={() => removeCriteria(index)}
                                            variant="primary"
                                            size="sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
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
                            placeholder="Detaylı değerlendirme rubriğini giriniz"
                        />
                    </div>

                    {/* Manuel Değerlendirme - YORUM SATIRI: UI'dan kaldırıldı, her zaman true gönderiliyor */}
                    {/* <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="requiresManualGrading"
                                checked={formData.requiresManualGrading}
                                onChange={(checked) => handleChange('requiresManualGrading', !!checked)}
                            />
                            <Label htmlFor="requiresManualGrading">Manuel Değerlendirme Gerekir</Label>
                        </div>
                        <p className="text-sm text-gray-600">
                            Bu seçenek işaretlendiğinde, ses yanıtları otomatik değil manuel olarak değerlendirilecektir.
                        </p>
                    </div> */}

                    {/* KAYDET BUTONU KALDIRILDI - Parent component'te olacak */}
                </div>
            </CardContent>
        </Card>
    );
});

AudioResponseTemplateForm.displayName = 'AudioResponseTemplateForm';

export default AudioResponseTemplateForm;