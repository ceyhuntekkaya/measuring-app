'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumberInput } from "@/components/ui/number-input";
import type { QuestionGroupTypeDto, ExamSectionDto, ExamTypeDto, CreateQuestionGroupTypeRequest, UpdateQuestionGroupTypeRequest } from "@/api/generated/model";
import {EQuestionGroupTemplateLevel, EQuestionGroupType} from "@/types/exam/enum";



interface QuestionGroupTypeFormErrors {
    name?: string;
    examSectionId?: string;
    orderNumber?: string;
    level?: string;
    groupType?: string;
    description?: string;
}

interface QuestionGroupTypeFormProps {
    onSubmit: (data: CreateQuestionGroupTypeRequest | UpdateQuestionGroupTypeRequest) => void;
    questionGroupType?: QuestionGroupTypeDto | null;
    examSections: ExamSectionDto[];
    loading?: boolean;
}

const QuestionGroupTypeForm: React.FC<QuestionGroupTypeFormProps> = ({
                                                                         onSubmit,
                                                                         questionGroupType,
                                                                         examSections = [],
                                                                         loading = false
                                                                     }) => {




    const [formData, setFormData] = useState<CreateQuestionGroupTypeRequest>({
        name: '',
        examSectionId: '',
        orderNumber: 1,
        level: EQuestionGroupTemplateLevel.GROUP as CreateQuestionGroupTypeRequest['level'],
        groupType: EQuestionGroupType.GENERAL as CreateQuestionGroupTypeRequest['groupType']
    });

    const [errors, setErrors] = useState<QuestionGroupTypeFormErrors>({});

    useEffect(() => {
        if (questionGroupType) {
            setFormData({
                name: questionGroupType.name || '',
                examSectionId: questionGroupType.examSection?.id || '',
                orderNumber: questionGroupType.orderNumber || 1,
                level: questionGroupType.level as CreateQuestionGroupTypeRequest['level'],
                groupType: questionGroupType.groupType as CreateQuestionGroupTypeRequest['groupType']
            });
        }
    }, [questionGroupType]);

    const handleChange = <T extends keyof CreateQuestionGroupTypeRequest>(
        name: T,
        value: CreateQuestionGroupTypeRequest[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: QuestionGroupTypeFormErrors = {};

        if (!formData.name || !formData.name.trim()) {
            newErrors.name = 'Soru grubu tipi adı zorunludur';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Soru grubu tipi adı en az 3 karakter olmalıdır';
        }

        if (!formData.examSectionId) {
            newErrors.examSectionId = 'Sınav bölümü seçimi zorunludur';
        }

        if (!formData.level) {
            newErrors.level = 'Seviye seçimi zorunludur';
        }

        if (!formData.groupType) {
            newErrors.groupType = 'Grup tipi seçimi zorunludur';
        }

        if (formData.orderNumber !== undefined && formData.orderNumber <= 0) {
            newErrors.orderNumber = 'Sıra numarası 0\'dan büyük olmalıdır';
        } else if (formData.orderNumber !== undefined && formData.orderNumber > 100) {
            newErrors.orderNumber = 'Sıra numarası 100\'den büyük olamaz';
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Directly use formData - no manual mapping needed!
            const submitData: CreateQuestionGroupTypeRequest | UpdateQuestionGroupTypeRequest = {
                name: formData.name?.trim(),
                examSectionId: formData.examSectionId,
                orderNumber: formData.orderNumber,
                level: formData.level,
                groupType: formData.groupType
            };
            onSubmit(submitData);
        }
    };

    const getLevelDisplayName = (level: string): string => {
        switch (level) {
            case 'GROUP': return 'Grup';
            case 'QUESTION': return 'Soru';
            default: return level;
        }
    };

    const getGroupTypeDisplayName = (groupType: string): string => {
        switch (groupType) {
            case 'LISTENING': return 'Dinleme';
            case 'READING': return 'Okuma';
            case 'SPEAKING': return 'Konuşma';
            case 'WRITING': return 'Yazma';
            case 'GRAMMAR': return 'Gramer';
            case 'VOCABULARY': return 'Kelime';
            case 'GENERAL': return 'Genel';
            default: return groupType;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {questionGroupType ? "Soru Grubu Tipi Güncelle" : "Yeni Soru Grubu Tipi Oluştur"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Soru Grubu Tipi Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Soru Grubu Tipi Adı *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Soru grubu tipi adını giriniz"
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Sıra Numarası */}
                        <div className="space-y-2">
                            <Label htmlFor="orderNumber">Sıra Numarası *</Label>
                            <NumberInput
                                id="orderNumber"
                                inputType={"number"}
                                value={formData.orderNumber}
                                onChange={(value) => handleChange('orderNumber', value)}
                                minValue={1}
                                maxValue={100}
                                decimalPlaces={0}
                                className={errors.orderNumber ? 'border-red-500' : ''}
                            />
                            {errors.orderNumber && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.orderNumber}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Seviye */}
                        <div className="space-y-2">
                            <Label htmlFor="level">Seviye *</Label>
                            <Select
                                onValueChange={(value) => handleChange('level', value as CreateQuestionGroupTypeRequest['level'])}
                                value={formData.level || ''}
                            >
                                <SelectTrigger className={errors.level ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Seviye seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="GROUP">{getLevelDisplayName('GROUP')}</SelectItem>
                                        <SelectItem value="QUESTION">{getLevelDisplayName('QUESTION')}</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.level && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.level}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Grup Tipi */}
                        <div className="space-y-2">
                            <Label htmlFor="groupType">Grup Tipi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('groupType', value as CreateQuestionGroupTypeRequest['groupType'])}
                                value={formData.groupType || ''}
                            >
                                <SelectTrigger className={errors.groupType ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Grup tipi seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="LISTENING">{getGroupTypeDisplayName('LISTENING')}</SelectItem>
                                        <SelectItem value="READING">{getGroupTypeDisplayName('READING')}</SelectItem>
                                        <SelectItem value="SPEAKING">{getGroupTypeDisplayName('SPEAKING')}</SelectItem>
                                        <SelectItem value="WRITING">{getGroupTypeDisplayName('WRITING')}</SelectItem>
                                        <SelectItem value="GRAMMAR">{getGroupTypeDisplayName('GRAMMAR')}</SelectItem>
                                        <SelectItem value="VOCABULARY">{getGroupTypeDisplayName('VOCABULARY')}</SelectItem>
                                        <SelectItem value="GENERAL">{getGroupTypeDisplayName('GENERAL')}</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.groupType && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.groupType}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    {/* Sınav Bölümü */}
                    <div className="space-y-2">
                        <Label htmlFor="examSection">Sınav Bölümü *</Label>
                        <Select
                            onValueChange={(value) => handleChange('examSectionId', value as string)}
                            value={formData.examSectionId || ''}
                        >
                            <SelectTrigger className={errors.examSectionId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Sınav bölümü seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {examSections.map(section => {
                                        const examType = section.examType as ExamTypeDto | undefined;
                                        return (
                                            <SelectItem key={section.id} value={section.id || ''}>
                                                {section.name} ({examType?.name || ''})
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.examSectionId && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.examSectionId}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "İşleniyor..." : questionGroupType ? "Soru Grubu Tipi Güncelle" : "Soru Grubu Tipi Oluştur"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuestionGroupTypeForm;