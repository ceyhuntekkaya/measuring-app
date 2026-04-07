'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import HtmlEditor from "@/components/ui/html-editor";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumberInput } from "@/components/ui/number-input";
import type {
    ExamSectionDto,
    ExamTypeDto,
    CreateExamSectionRequest,
    UpdateExamSectionRequest,
    CreateExamSectionRequestQuestionSkillType
} from "@/api/generated/model";
import { CreateExamSectionRequestQuestionSkillType as QuestionSkillType } from "@/api/generated/model";
import TextYesNoCheckbox from "@/components/ui/text-yes-no-checkbox";








interface ExamSectionFormErrors {
    name?: string;
    examTypeId?: string;
    orderNumber?: string;
}

interface ExamSectionFormProps {
    onSubmit: (data: CreateExamSectionRequest | UpdateExamSectionRequest) => void;
    examSection?: ExamSectionDto | null;
    examTypes: ExamTypeDto[];
    loading?: boolean;
    defaultExamTypeId?: string;
}

const ExamSectionForm: React.FC<ExamSectionFormProps> = ({
                                                             onSubmit,
                                                             examSection,
                                                             examTypes = [],
                                                             loading = false,
                                                             defaultExamTypeId
                                                         }) => {
    const [formData, setFormData] = useState<CreateExamSectionRequest>({
        name: '',
        examTypeId: defaultExamTypeId || '',
        orderNumber: 1,
        sectionDescription: '',
        isOrder: false,
        hasTotalTime: false,
        totalTime: undefined,
        minScore: undefined,
        questionSkillType: undefined,
    });




    const [errors, setErrors] = useState<ExamSectionFormErrors>({});

    useEffect(() => {
        if (examSection) {
            const examType = examSection.examType as ExamTypeDto | undefined;
            setFormData({
                name: examSection.name || '',
                examTypeId: examType?.id || '',
                orderNumber: examSection.orderNumber || 1,
                sectionDescription: examSection.sectionDescription || '',
                isOrder: examSection.isOrder ?? false,
                hasTotalTime: examSection.hasTotalTime ?? false,
                totalTime: examSection.totalTime,
                minScore: examSection.minScore,
                questionSkillType: examSection.questionSkillType,
            });
        } else if (defaultExamTypeId) {
            setFormData(prev => ({
                ...prev,
                examTypeId: defaultExamTypeId
            }));
        }
    }, [examSection, defaultExamTypeId]);

    const handleChange = <T extends keyof CreateExamSectionRequest>(
        name: T,
        value: CreateExamSectionRequest[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: ExamSectionFormErrors = {};

        if (!formData.name || !formData.name.trim()) {
            newErrors.name = 'Sınav bölümü adı zorunludur';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Sınav bölümü adı en az 3 karakter olmalıdır';
        }

        if (!formData.examTypeId && !defaultExamTypeId) {
            newErrors.examTypeId = 'Sınav tipi seçimi zorunludur';
        }

        if (formData.orderNumber && formData.orderNumber <= 0) {
            newErrors.orderNumber = 'Sıra numarası 0\'dan büyük olmalıdır';
        } else if (formData.orderNumber && formData.orderNumber > 100) {
            newErrors.orderNumber = 'Sıra numarası 100\'den büyük olamaz';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            if (examSection) {
                // Update mode - UpdateExamSectionRequest doesn't include examTypeId
                const submitData: UpdateExamSectionRequest = {
                    name: formData.name?.trim(),
                    orderNumber: formData.orderNumber,
                    sectionDescription: formData.sectionDescription?.trim() || undefined,
                    isOrder: formData.isOrder,
                    hasTotalTime: formData.hasTotalTime,
                    totalTime: formData.hasTotalTime ? formData.totalTime : undefined,
                    minScore: formData.minScore,
                    questionSkillType: formData.questionSkillType || undefined,
                };
                onSubmit(submitData);
            } else {
                // Create mode - CreateExamSectionRequest includes examTypeId
                const submitData: CreateExamSectionRequest = {
                    name: formData.name?.trim(),
                    examTypeId: formData.examTypeId,
                    orderNumber: formData.orderNumber,
                    sectionDescription: formData.sectionDescription?.trim() || undefined,
                    isOrder: formData.isOrder,
                    hasTotalTime: formData.hasTotalTime,
                    totalTime: formData.hasTotalTime ? formData.totalTime : undefined,
                    minScore: formData.minScore,
                    questionSkillType: formData.questionSkillType || undefined,
                };
                onSubmit(submitData);
            }
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {examSection ? "Sınav Bölümü Güncelle" : "Yeni Sınav Bölümü Oluştur"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Sınav Bölümü Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Sınav Bölümü Adı *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Sınav bölümü adını giriniz"
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="questionSkillType">Soru / beceri tipi</Label>
                        <Select
                            value={formData.questionSkillType || ''}
                            onValueChange={(value) =>
                                handleChange(
                                    'questionSkillType',
                                    (value ? (value as CreateExamSectionRequestQuestionSkillType) : undefined)
                                )
                            }
                        >
                            <SelectTrigger id="questionSkillType">
                                <SelectValue placeholder="Seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="">Seçilmedi</SelectItem>
                                    {Object.values(QuestionSkillType).map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sınav Tipi - Sadece yeni oluşturma modunda ve defaultExamTypeId yoksa göster */}
                    {!examSection && !defaultExamTypeId && (
                        <div className="space-y-2">
                            <Label htmlFor="examType">Sınav Tipi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('examTypeId', value as string)}
                                value={formData.examTypeId || ''}
                            >
                                <SelectTrigger className={errors.examTypeId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Sınav tipi seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {examTypes.map(examType => (
                                            <SelectItem key={examType.id} value={examType.id || ''}>
                                                {examType.name} - {examType.examLevel}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.examTypeId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.examTypeId}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextYesNoCheckbox
                            id="sectionIsOrder"
                            checked={!!formData.isOrder}
                            onChange={(checked) => handleChange('isOrder', !!checked)}
                            html="<b>Bölüm sıralı</b><div class='text-gray-600 text-xs mt-1'>Bu bölümde sıra kısıtı uygulanır.</div>"
                        />
                        <TextYesNoCheckbox
                            id="sectionHasTotalTime"
                            checked={!!formData.hasTotalTime}
                            onChange={(checked) => handleChange('hasTotalTime', !!checked)}
                            html="<b>Toplam süre var</b><div class='text-gray-600 text-xs mt-1'>Bölüm için toplam süre tanımlanır.</div>"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="totalTime">Toplam süre</Label>
                            <NumberInput
                                id="totalTime"
                                inputType="number"
                                value={formData.totalTime ?? 0}
                                onChange={(value) => handleChange('totalTime', value || undefined)}
                                minValue={0}
                                decimalPlaces={0}
                                className={!formData.hasTotalTime ? 'opacity-50 pointer-events-none' : ''}
                            />
                            <p className="text-xs text-gray-500">Saniye cinsinden (backend alanı).</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minScore">Minimum puan</Label>
                            <NumberInput
                                id="minScore"
                                inputType="number"
                                value={formData.minScore ?? 0}
                                onChange={(value) => handleChange('minScore', value)}
                                minValue={0}
                                maxValue={1000}
                                decimalPlaces={2}
                            />
                        </div>
                    </div>

                    {/* Bölüm Açıklaması */}
                    <div className="space-y-2">
                        <Label htmlFor="sectionDescription">Bölüm Açıklaması</Label>
                        <HtmlEditor
                            id="sectionDescription"
                            value={formData.sectionDescription || ''}
                            onChange={(html) => handleChange('sectionDescription', html)}
                            placeholder="Bölüm açıklamasını giriniz"
                            minHeightClassName="min-h-[120px]"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "İşleniyor..." : examSection ? "Sınav Bölümü Güncelle" : "Sınav Bölümü Oluştur"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ExamSectionForm;