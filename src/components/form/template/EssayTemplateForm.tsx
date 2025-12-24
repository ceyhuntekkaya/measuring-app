'use client';

import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NumberInput } from "@/components/ui/number-input";
import { EssayTemplateDto } from "@/types/exam/questionTemplates";

interface EssayTemplateFormData {
    prompt: string;
    gradingCriteria: string[];
    minWords: number;
    maxWords: number;
    requiredTopics: string[];
    rubric: string;
    requiresManualGrading: boolean;
}

interface EssayTemplateFormErrors {
    prompt?: string;
    minWords?: string;
    maxWords?: string;
}

interface EssayTemplateFormProps {
    value?: EssayTemplateDto | null;
    onChange: (data: EssayTemplateDto) => void;
    loading?: boolean;
}

// Validation handle için ref interface
export interface EssayTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => EssayTemplateFormErrors;
}

const EssayTemplateForm = forwardRef<EssayTemplateFormHandle, EssayTemplateFormProps>(({
                                                                                           value,
                                                                                           onChange,
                                                                                       }, ref) => {
    const [formData, setFormData] = useState<EssayTemplateFormData>({
        prompt: '',
        gradingCriteria: [], // UI'dan kaldırıldı, her zaman boş array
        minWords: 50,
        maxWords: 1000,
        requiredTopics: [], // UI'dan kaldırıldı, her zaman boş array
        rubric: '',
        requiresManualGrading: true // UI'dan kaldırıldı, her zaman true
    });

    const [errors, setErrors] = useState<EssayTemplateFormErrors>({});

    // Value değiştiğinde form data'yı güncelle (Update modu için)
    useEffect(() => {
        if (value) {
            setFormData({
                prompt: value.prompt || '',
                gradingCriteria: [], // UI'dan kaldırıldı, her zaman boş array
                minWords: value.minWords || 50,
                maxWords: value.maxWords || 1000,
                requiredTopics: [], // UI'dan kaldırıldı, her zaman boş array
                rubric: value.rubric || '',
                requiresManualGrading: true // UI'dan kaldırıldı, her zaman true
            });
        }
    }, []);

    // Form data değiştiğinde parent'a bildir (Anlık güncelleme)
    useEffect(() => {
        // İlk render'da boş form için onChange tetikleme
        if (formData.prompt) {
            const templateData: EssayTemplateDto = {
                ...value,
                prompt: formData.prompt,
                gradingCriteria: [], // UI'dan kaldırıldı, her zaman boş array
                minWords: formData.minWords,
                maxWords: formData.maxWords,
                requiredTopics: [], // UI'dan kaldırıldı, her zaman boş array
                rubric: formData.rubric,
                requiresManualGrading: true // UI'dan kaldırıldı, her zaman true
            };
            onChange(templateData);
        }
    }, [formData]); // onChange ve value bağımlılığı yok - sonsuz döngü önlendi

    const handleChange = <T extends keyof EssayTemplateFormData>(
        field: T,
        newValue: EssayTemplateFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: newValue
        }));

        // Hata varsa temizle
        if (errors[field as keyof EssayTemplateFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };



    // Validation fonksiyonu - parent tarafından çağrılacak
    const validateForm = (): boolean => {
        const newErrors: EssayTemplateFormErrors = {};

        if (!formData.prompt.trim()) {
            newErrors.prompt = 'Kompozisyon konusu zorunludur';
        }

        if (formData.minWords <= 0) {
            newErrors.minWords = 'Minimum kelime sayısı 0\'dan büyük olmalıdır';
        }

        if (formData.maxWords <= formData.minWords) {
            newErrors.maxWords = 'Maksimum kelime sayısı minimum kelime sayısından büyük olmalıdır';
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
                <CardTitle>Kompozisyon Şablon Detayları</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Kompozisyon Konusu */}
                    <div className="space-y-2">
                        <Label htmlFor="prompt">Kompozisyon Konusu *</Label>
                        <Textarea
                            id="prompt"
                            value={formData.prompt}
                            onChange={(e) => handleChange('prompt', e.target.value)}
                            className={`min-h-[120px] ${errors.prompt ? 'border-red-500' : ''}`}
                            placeholder="Öğrencinin yazacağı kompozisyon konusunu ve yönergelerini giriniz"
                        />
                        {errors.prompt && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.prompt}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Kelime Sınırları */}
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

                    {/* Manuel Değerlendirme - YORUM SATIRI: UI'dan kaldırıldı, her zaman true gönderiliyor */}
                    {/* <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="requiresManualGrading"
                                checked={formData.requiresManualGrading}
                                onChange={(checked) => handleChange('requiresManualGrading', !!checked)}
                            />
                            <Label htmlFor="requiresManualGrading">Manuel Değerlendirme Gerekli</Label>
                        </div>
                        <p className="text-sm text-gray-600">
                            Bu seçenek işaretlendiğinde, kompozisyon otomatik değil manuel olarak değerlendirilecektir.
                        </p>
                    </div> */}

                    {/* Değerlendirme Kriterleri - YORUM SATIRI: UI'dan kaldırıldı, API'ye boş array gönderiliyor */}
                    {/* <div className="space-y-4">
                        <Label>Değerlendirme Kriterleri</Label>

                        <div className="flex gap-2">
                            <Input
                                value={criteriaInput}
                                onChange={(e) => setCriteriaInput(e.target.value)}
                                onKeyPress={handleCriteriaKeyPress}
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

                        {formData.gradingCriteria.length > 0 && (
                            <div className="space-y-2">
                                {formData.gradingCriteria.map((criteria, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-blue-50 rounded-md"
                                    >
                                        <span className="text-sm">{criteria}</span>
                                        <Button
                                            type="button"
                                            onClick={() => removeCriteria(index)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 hover:bg-blue-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div> */}

                    {/* Gerekli Konular - YORUM SATIRI: UI'dan kaldırıldı, API'ye boş array gönderiliyor */}
                    {/* <div className="space-y-4">
                        <Label>Gerekli Konular</Label>

                        <div className="flex gap-2">
                            <Input
                                value={topicInput}
                                onChange={(e) => setTopicInput(e.target.value)}
                                onKeyPress={handleTopicKeyPress}
                                placeholder="Kompozisyonda değinilmesi gereken konu ekleyin"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={addTopic}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Ekle
                            </Button>
                        </div>

                        {formData.requiredTopics.length > 0 && (
                            <div className="space-y-2">
                                {formData.requiredTopics.map((topic, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-green-50 rounded-md"
                                    >
                                        <span className="text-sm">{topic}</span>
                                        <Button
                                            type="button"
                                            onClick={() => removeTopic(index)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 hover:bg-green-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div> */}

                    {/* Değerlendirme Rubriği */}
                    <div className="space-y-2">
                        <Label htmlFor="rubric">Değerlendirme Rubriği</Label>
                        <Textarea
                            id="rubric"
                            value={formData.rubric}
                            onChange={(e) => handleChange('rubric', e.target.value)}
                            className="min-h-[150px]"
                            placeholder="Detaylı değerlendirme rubriği ve puanlama kriterleri"
                        />
                        <p className="text-sm text-gray-500">
                            Kompozisyonun nasıl puanlanacağına dair detaylı bilgi verin.
                        </p>
                    </div>

                    {/* KAYDET BUTONU KALDIRILDI - Parent component'te olacak */}
                </div>
            </CardContent>
        </Card>
    );
});

EssayTemplateForm.displayName = 'EssayTemplateForm';

export default EssayTemplateForm;