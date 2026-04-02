'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import type { QuestionGroupTypeDto, ExamSectionDto, CreateQuestionGroupTypeRequest, UpdateQuestionGroupTypeRequest } from "@/api/generated/model";
import {EQuestionGroupTemplateLevel, EQuestionGroupType} from "@/types/exam/enum";
import TextSelect from "@/components/ui/text-select";



interface QuestionGroupTypeFormErrors {
    name?: string;
    orderNumber?: string;
    level?: string;
    groupType?: string;
    description?: string;
}

interface QuestionGroupTypeFormProps {
    onSubmit: (data: CreateQuestionGroupTypeRequest | UpdateQuestionGroupTypeRequest) => void;
    questionGroupType?: QuestionGroupTypeDto | null;
    examSections: ExamSectionDto[];
    examSectionId?: string;
    loading?: boolean;
}

const QuestionGroupTypeForm: React.FC<QuestionGroupTypeFormProps> = ({
                                                                         onSubmit,
                                                                         questionGroupType,
                                                                         // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                                         examSections: _examSections = [],
                                                                         examSectionId,
                                                                         loading = false
                                                                     }) => {




    const [formData, setFormData] = useState<CreateQuestionGroupTypeRequest>({
        name: '',
        examSectionId: examSectionId || '',
        orderNumber: 1,
        level: EQuestionGroupTemplateLevel.GROUP as CreateQuestionGroupTypeRequest['level'],
        groupType: EQuestionGroupType.GENERAL as CreateQuestionGroupTypeRequest['groupType']
    });

    const [errors, setErrors] = useState<QuestionGroupTypeFormErrors>({});

    useEffect(() => {
        if (questionGroupType) {
            setFormData({
                name: questionGroupType.name || '',
                examSectionId: examSectionId || questionGroupType.examSection?.id || '',
                orderNumber: questionGroupType.orderNumber || 1,
                level: questionGroupType.level as CreateQuestionGroupTypeRequest['level'],
                groupType: questionGroupType.groupType as CreateQuestionGroupTypeRequest['groupType']
            });
        } else if (examSectionId) {
            setFormData(prev => ({
                ...prev,
                examSectionId: examSectionId
            }));
        }
    }, [questionGroupType, examSectionId]);

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
            if (questionGroupType) {
                // Update request - examSectionId should not be included
                const submitData: UpdateQuestionGroupTypeRequest = {
                    name: formData.name?.trim(),
                    orderNumber: formData.orderNumber,
                    level: formData.level,
                    groupType: formData.groupType
                };
                onSubmit(submitData);
            } else {
                // Create request - examSectionId is required
                const finalExamSectionId = examSectionId || formData.examSectionId;
                const submitData: CreateQuestionGroupTypeRequest = {
                    name: formData.name?.trim(),
                    examSectionId: finalExamSectionId,
                    orderNumber: formData.orderNumber,
                    level: formData.level,
                    groupType: formData.groupType
                };
                onSubmit(submitData);
            }
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
                            <TextSelect
                                id="level"
                                value={formData.level || ''}
                                onChange={(value) => handleChange('level', value as CreateQuestionGroupTypeRequest['level'])}
                                placeholder="Seviye seçin"
                                html="<b>Seviye *</b><div class='text-gray-600 text-xs mt-1'>Soru grubu şablonunun seviyesini belirler.</div>"
                                className={errors.level ? 'border-red-500' : ''}
                                options={[
                                    { value: 'GROUP', label: getLevelDisplayName('GROUP') },
                                    { value: 'QUESTION', label: getLevelDisplayName('QUESTION') },
                                ]}
                            />
                            {errors.level && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.level}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Grup Tipi */}
                        <div className="space-y-2">
                            <TextSelect
                                id="groupType"
                                value={formData.groupType || ''}
                                onChange={(value) => handleChange('groupType', value as CreateQuestionGroupTypeRequest['groupType'])}
                                placeholder="Grup tipi seçin"
                                html="<b>Grup Tipi *</b><div class='text-gray-600 text-xs mt-1'>Bu grup tipinin hangi beceri alanına ait olduğunu belirler.</div>"
                                className={errors.groupType ? 'border-red-500' : ''}
                                options={[
                                    { value: 'LISTENING', label: getGroupTypeDisplayName('LISTENING') },
                                    { value: 'READING', label: getGroupTypeDisplayName('READING') },
                                    { value: 'SPEAKING', label: getGroupTypeDisplayName('SPEAKING') },
                                    { value: 'WRITING', label: getGroupTypeDisplayName('WRITING') },
                                    { value: 'GRAMMAR', label: getGroupTypeDisplayName('GRAMMAR') },
                                    { value: 'VOCABULARY', label: getGroupTypeDisplayName('VOCABULARY') },
                                    { value: 'GENERAL', label: getGroupTypeDisplayName('GENERAL') },
                                ]}
                            />
                            {errors.groupType && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.groupType}</AlertDescription>
                                </Alert>
                            )}
                        </div>
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