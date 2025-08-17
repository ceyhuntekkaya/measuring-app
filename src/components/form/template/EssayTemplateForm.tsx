'use client';

import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NumberInput } from "@/components/ui/number-input";
import { EssayTemplateDto } from "@/types/exam/questionTemplates";
import { Trash2, Plus } from "lucide-react";
import Checkbox from "@/components/ui/checkbox";

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
    value?: EssayTemplateDto;
    onChange: (data: Partial<EssayTemplateDto>) => void;
}

const EssayTemplateForm: React.FC<EssayTemplateFormProps> = ({
                                                                 value,
                                                                 onChange
                                                             }) => {
    const [formData, setFormData] = useState<EssayTemplateFormData>({
        prompt: '',
        gradingCriteria: [],
        minWords: 50,
        maxWords: 1000,
        requiredTopics: [],
        rubric: '',
        requiresManualGrading: true
    });

    const [errors, setErrors] = useState<EssayTemplateFormErrors>({});
    const [criteriaInput, setCriteriaInput] = useState('');
    const [topicInput, setTopicInput] = useState('');

    useEffect(() => {
        if (value) {
            setFormData({
                prompt: value.prompt || '',
                gradingCriteria: value.gradingCriteria || [],
                minWords: value.minWords || 50,
                maxWords: value.maxWords || 1000,
                requiredTopics: value.requiredTopics || [],
                rubric: value.rubric || '',
                requiresManualGrading: value.requiresManualGrading ?? true
            });
        }
    }, [value]);

    const handleChange = <T extends keyof EssayTemplateFormData>(
        field: T,
        newValue: EssayTemplateFormData[T]
    ) => {
        const updatedData = { ...formData, [field]: newValue };
        setFormData(updatedData);

        // Parent component'e değişiklikleri bildir

        if (validateForm()) {
            onChange({
                prompt: updatedData.prompt,
                gradingCriteria: updatedData.gradingCriteria,
                minWords: updatedData.minWords,
                maxWords: updatedData.maxWords,
                requiredTopics: updatedData.requiredTopics,
                rubric: updatedData.rubric,
                requiresManualGrading: updatedData.requiresManualGrading
            });
        }

    };

    const addCriteria = () => {
        if (criteriaInput.trim() && !formData.gradingCriteria.includes(criteriaInput.trim())) {
            const updatedCriteria = [...formData.gradingCriteria, criteriaInput.trim()];
            handleChange('gradingCriteria', updatedCriteria);
            setCriteriaInput('');
        }
    };

    const removeCriteria = (index: number) => {
        const updatedCriteria = formData.gradingCriteria.filter((_, i) => i !== index);
        handleChange('gradingCriteria', updatedCriteria);
    };

    const addTopic = () => {
        if (topicInput.trim() && !formData.requiredTopics.includes(topicInput.trim())) {
            const updatedTopics = [...formData.requiredTopics, topicInput.trim()];
            handleChange('requiredTopics', updatedTopics);
            setTopicInput('');
        }
    };

    const removeTopic = (index: number) => {
        const updatedTopics = formData.requiredTopics.filter((_, i) => i !== index);
        handleChange('requiredTopics', updatedTopics);
    };

    const handleCriteriaKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCriteria();
        }
    };

    const handleTopicKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTopic();
        }
    };

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

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Kompozisyon Soru Ayarları</h3>

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
                        value={formData.minWords}
                        onChange={(value) => handleChange('minWords', value)}
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
                        value={formData.maxWords}
                        onChange={(value) => handleChange('maxWords', value)}
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

            {/* Manuel Değerlendirme */}
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="requiresManualGrading"
                    checked={formData.requiresManualGrading}
                    onChange={(checked) => handleChange('requiresManualGrading', !!checked)}
                />
                <Label htmlFor="requiresManualGrading">Manuel Değerlendirme Gerekli</Label>
            </div>

            {/* Değerlendirme Kriterleri */}
            <div className="space-y-4">
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
            </div>

            {/* Gerekli Konular */}
            <div className="space-y-4">
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
            </div>

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
        </div>
    );
};

export default EssayTemplateForm;