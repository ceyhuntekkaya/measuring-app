'use client';

import React, {useEffect, useState, useImperativeHandle, forwardRef} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {MatchingTemplateDto, MatchingOptions, MatchingPair} from "@/types/exam/questionTemplates";
import {Trash2, Plus} from "lucide-react";
import Checkbox from "@/components/ui/checkbox";

interface MatchingTemplateFormData {
    instructions: string;
    options: MatchingOptions;
    shuffleItems: boolean;
    explanation: string;
}

interface MatchingTemplateFormErrors {
    instructions?: string;
    options?: string;
}

interface MatchingTemplateFormProps {
    value?: MatchingTemplateDto | null;
    onChange: (data: MatchingTemplateDto) => void;
    loading?: boolean;
}

// Validation handle için ref interface
export interface MatchingTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => MatchingTemplateFormErrors;
}

const MatchingTemplateForm = forwardRef<MatchingTemplateFormHandle, MatchingTemplateFormProps>(({
                                                                                                    value,
                                                                                                    onChange,
                                                                                                }, ref) => {
    const [formData, setFormData] = useState<MatchingTemplateFormData>({
        instructions: '',
        options: {pairs: [], distractors: []},
        shuffleItems: true,
        explanation: ''
    });

    const [errors, setErrors] = useState<MatchingTemplateFormErrors>({});
    const [distractorInput, setDistractorInput] = useState('');

    // Value değiştiğinde form data'yı güncelle (Update modu için)
    useEffect(() => {
        if (value) {
            setFormData({
                instructions: value.instructions || '',
                options: value.options || {pairs: [], distractors: []},
                shuffleItems: value.shuffleItems ?? true,
                explanation: value.explanation || ''
            });
        }
    }, [value]);

    // Form data değiştiğinde parent'a bildir (Anlık güncelleme)
    useEffect(() => {
        // İlk render'da boş form için onChange tetikleme
        if (formData.instructions || (formData.options.pairs ?? []).length > 0) {
            const templateData: MatchingTemplateDto = {
                ...value,
                instructions: formData.instructions,
                options: formData.options,
                shuffleItems: formData.shuffleItems,
                explanation: formData.explanation
            };
            onChange(templateData);
        }
    }, [formData]); // onChange ve value bağımlılığı yok - sonsuz döngü önlendi

    const handleChange = <T extends keyof MatchingTemplateFormData>(
        field: T,
        newValue: MatchingTemplateFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: newValue
        }));

        // Hata varsa temizle
        if (errors[field as keyof MatchingTemplateFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const addPair = () => {
        const newPair: MatchingPair = {
            leftId: `left_${Date.now()}`,
            leftText: '',
            leftMediaUrl: '',
            rightId: `right_${Date.now()}`,
            rightText: '',
            rightMediaUrl: '',
            feedback: ''
        };

        const updatedPairs = [...(formData.options.pairs || []), newPair];
        handleChange('options', {...formData.options, pairs: updatedPairs});
    };

    const removePair = (index: number) => {
        const updatedPairs = formData.options.pairs?.filter((_, i) => i !== index) || [];
        handleChange('options', {...formData.options, pairs: updatedPairs});
    };

    const updatePair = <K extends keyof MatchingPair>(
        index: number,
        field: K,
        newValue: MatchingPair[K]
    ) => {
        const updatedPairs = formData.options.pairs?.map((pair, i) =>
            i === index ? {...pair, [field]: newValue} : pair
        ) || [];

        handleChange('options', {...formData.options, pairs: updatedPairs});
    };

    const addDistractor = () => {
        if (distractorInput.trim() && !formData.options.distractors?.includes(distractorInput.trim())) {
            const updatedDistractors = [...(formData.options.distractors || []), distractorInput.trim()];
            handleChange('options', {...formData.options, distractors: updatedDistractors});
            setDistractorInput('');
        }
    };

    const removeDistractor = (index: number) => {
        const updatedDistractors = formData.options.distractors?.filter((_, i) => i !== index) || [];
        handleChange('options', {...formData.options, distractors: updatedDistractors});
    };

    const handleDistractorKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addDistractor();
        }
    };

    // Validation fonksiyonu - parent tarafından çağrılacak
    const validateForm = (): boolean => {
        const newErrors: MatchingTemplateFormErrors = {};

        if (!formData.instructions.trim()) {
            newErrors.instructions = 'Eşleştirme talimatları zorunludur';
        }

        if (!formData.options.pairs || formData.options.pairs.length < 2) {
            newErrors.options = 'En az 2 eşleştirme çifti olmalıdır';
        } else {
            const invalidPairs = formData.options.pairs.some(pair =>
                !pair.leftText?.trim() || !pair.rightText?.trim()
            );
            if (invalidPairs) {
                newErrors.options = 'Tüm eşleştirme çiftlerinin sol ve sağ metinleri doldurulmalıdır';
            }
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
                <CardTitle>Eşleştirme Şablon Detayları</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Talimatlar */}
                    <div className="space-y-2">
                        <Label htmlFor="instructions">Eşleştirme Talimatları *</Label>
                        <Textarea
                            id="instructions"
                            value={formData.instructions}
                            onChange={(e) => handleChange('instructions', e.target.value)}
                            className={`min-h-[100px] ${errors.instructions ? 'border-red-500' : ''}`}
                            placeholder="Öğrenciye eşleştirme yapması için talimatları giriniz"
                        />
                        {errors.instructions && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.instructions}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Eşleştirme Çiftleri */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Eşleştirme Çiftleri *</Label>
                            <Button
                                type="button"
                                onClick={addPair}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2"/>
                                Çift Ekle
                            </Button>
                        </div>

                        {formData.options.pairs?.map((pair, index) => (
                            <div key={pair.leftId || index} className="p-4 border rounded-lg space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Sol Taraf */}
                                    <div className="space-y-2">
                                        <Label>Sol Taraf (#{index + 1}) *</Label>
                                        <Input
                                            value={pair.leftText || ''}
                                            onChange={(e) => updatePair(index, 'leftText', e.target.value)}
                                            placeholder="Sol taraf metni"
                                        />
                                        <Input
                                            value={pair.leftMediaUrl || ''}
                                            onChange={(e) => updatePair(index, 'leftMediaUrl', e.target.value)}
                                            placeholder="Sol taraf medya URL (opsiyonel)"
                                        />
                                    </div>

                                    {/* Sağ Taraf */}
                                    <div className="space-y-2">
                                        <Label>Sağ Taraf (#{index + 1}) *</Label>
                                        <Input
                                            value={pair.rightText || ''}
                                            onChange={(e) => updatePair(index, 'rightText', e.target.value)}
                                            placeholder="Sağ taraf metni"
                                        />
                                        <Input
                                            value={pair.rightMediaUrl || ''}
                                            onChange={(e) => updatePair(index, 'rightMediaUrl', e.target.value)}
                                            placeholder="Sağ taraf medya URL (opsiyonel)"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-10">
                                        <Label>Geri Bildirim</Label>
                                        <Input
                                            value={pair.feedback || ''}
                                            onChange={(e) => updatePair(index, 'feedback', e.target.value)}
                                            placeholder="Bu eşleştirme için geri bildirim (opsiyonel)"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Button
                                            type="button"
                                            onClick={() => removePair(index)}
                                            variant="primary"
                                            size="sm"
                                            className="w-full"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {errors.options && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.options}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Çeldiriciler */}
                    <div className="space-y-4">
                        <Label>Çeldiriciler (Yanlış Seçenekler)</Label>

                        <div className="flex gap-2">
                            <Input
                                value={distractorInput}
                                onChange={(e) => setDistractorInput(e.target.value)}
                                onKeyPress={handleDistractorKeyPress}
                                placeholder="Çeldirici seçenek eklemek için yazın ve Enter'a basın"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={addDistractor}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2"/>
                                Ekle
                            </Button>
                        </div>

                        {formData.options.distractors && formData.options.distractors.length > 0 && (
                            <div className="space-y-2">
                                {formData.options.distractors.map((distractor, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-orange-50 rounded-md"
                                    >
                                        <span className="text-sm">{distractor}</span>
                                        <Button
                                            type="button"
                                            onClick={() => removeDistractor(index)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 hover:bg-orange-200"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Ayarlar */}
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="shuffleItems"
                                checked={formData.shuffleItems}
                                onChange={(checked) => handleChange('shuffleItems', !!checked)}
                            />
                            <Label htmlFor="shuffleItems">Öğeleri Karıştır</Label>
                        </div>
                        <p className="text-sm text-gray-600">
                            Bu seçenek işaretlendiğinde, eşleştirme öğeleri rastgele sırada gösterilir.
                        </p>
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

                    {/* KAYDET BUTONU KALDIRILDI - Parent component'te olacak */}
                </div>
            </CardContent>
        </Card>
    );
});

MatchingTemplateForm.displayName = 'MatchingTemplateForm';

export default MatchingTemplateForm;