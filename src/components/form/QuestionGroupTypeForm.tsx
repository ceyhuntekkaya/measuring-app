'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NumberInput } from "@/components/ui/number-input";
import type { QuestionGroupTypeDto, ExamSectionDto, CreateQuestionGroupTypeRequest, UpdateQuestionGroupTypeRequest } from "@/api/generated/model";
import { EQuestionGroupType } from "@/types/exam/enum";
import TextSelect from "@/components/ui/text-select";
import TextYesNoCheckbox from "@/components/ui/text-yes-no-checkbox";


interface QuestionGroupTypeFormErrors {
    name?: string;
    orderNumber?: string;
    groupType?: string;
}

interface QuestionGroupTypeFormProps {
    onSubmit: (data: CreateQuestionGroupTypeRequest | UpdateQuestionGroupTypeRequest) => void;
    questionGroupType?: QuestionGroupTypeDto | null;
    examSections: ExamSectionDto[];
    examSectionId?: string;
    loading?: boolean;
}

const defaultCreateState = (examSectionId?: string): CreateQuestionGroupTypeRequest => ({
    name: '',
    examSectionId: examSectionId || '',
    orderNumber: 1,
    groupType: EQuestionGroupType.GENERAL as CreateQuestionGroupTypeRequest['groupType'],
    hasInstruction: false,
    instruction: '',
    hasGroupDuration: false,
    duration: undefined,
    waitingDuration: undefined,
    playbackCount: undefined,
    recordingDuration: undefined,
});

const QuestionGroupTypeForm: React.FC<QuestionGroupTypeFormProps> = ({
    onSubmit,
    questionGroupType,
    examSectionId,
    loading = false
}) => {
    const [formData, setFormData] = useState<CreateQuestionGroupTypeRequest>(() =>
        defaultCreateState(examSectionId)
    );

    const [errors, setErrors] = useState<QuestionGroupTypeFormErrors>({});

    useEffect(() => {
        if (questionGroupType) {
            setFormData({
                name: questionGroupType.name || '',
                examSectionId: examSectionId || questionGroupType.examSection?.id || '',
                orderNumber: questionGroupType.orderNumber || 1,
                groupType: questionGroupType.groupType as CreateQuestionGroupTypeRequest['groupType'],
                hasInstruction: questionGroupType.hasInstruction ?? false,
                instruction: questionGroupType.instruction || '',
                hasGroupDuration: questionGroupType.hasGroupDuration ?? false,
                duration: questionGroupType.duration,
                waitingDuration: questionGroupType.waitingDuration,
                playbackCount: questionGroupType.playbackCount,
                recordingDuration: questionGroupType.recordingDuration,
            });
        } else {
            setFormData(defaultCreateState(examSectionId));
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
        if (!validateForm()) return;

        const instructionTrim = formData.instruction?.trim();
        if (questionGroupType) {
            const submitData: UpdateQuestionGroupTypeRequest = {
                name: formData.name?.trim(),
                orderNumber: formData.orderNumber,
                groupType: formData.groupType,
                hasInstruction: formData.hasInstruction,
                instruction: formData.hasInstruction ? instructionTrim || undefined : undefined,
                hasGroupDuration: formData.hasGroupDuration,
                duration: formData.hasGroupDuration ? formData.duration : undefined,
                waitingDuration: formData.hasGroupDuration ? formData.waitingDuration : undefined,
                playbackCount: formData.playbackCount,
                recordingDuration: formData.recordingDuration,
            };
            onSubmit(submitData);
        } else {
            const finalExamSectionId = examSectionId || formData.examSectionId;
            const submitData: CreateQuestionGroupTypeRequest = {
                name: formData.name?.trim(),
                examSectionId: finalExamSectionId,
                orderNumber: formData.orderNumber,
                groupType: formData.groupType,
                hasInstruction: formData.hasInstruction,
                instruction: formData.hasInstruction ? instructionTrim || undefined : undefined,
                hasGroupDuration: formData.hasGroupDuration,
                duration: formData.hasGroupDuration ? formData.duration : undefined,
                waitingDuration: formData.hasGroupDuration ? formData.waitingDuration : undefined,
                playbackCount: formData.playbackCount,
                recordingDuration: formData.recordingDuration,
            };
            onSubmit(submitData);
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

    const durationDisabled = !formData.hasGroupDuration;

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

                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <TextSelect
                                id="groupType"
                                value={formData.groupType || ''}
                                onChange={(value) => handleChange('groupType', value as CreateQuestionGroupTypeRequest['groupType'])}
                                placeholder="Grup tipi seçin"
                                html="<b>Grup Tipi *</b><div class='text-gray-600 text-xs mt-1'>Beceri alanı.</div>"
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

                    <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                        <TextYesNoCheckbox
                            id="hasInstruction"
                            checked={!!formData.hasInstruction}
                            onChange={(checked) => handleChange('hasInstruction', !!checked)}
                            html="<b>Yönerge var</b><div class='text-gray-600 text-xs mt-1'>Bu grup tipi için yönerge metni kullanılır.</div>"
                        />
                        <div className="space-y-2">
                            <Label htmlFor="instruction">Yönerge</Label>
                            <Textarea
                                id="instruction"
                                value={formData.instruction || ''}
                                onChange={(e) => handleChange('instruction', e.target.value)}
                                disabled={!formData.hasInstruction}
                                placeholder="Yönerge metni"
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                        <TextYesNoCheckbox
                            id="hasGroupDuration"
                            checked={!!formData.hasGroupDuration}
                            onChange={(checked) => handleChange('hasGroupDuration', !!checked)}
                            html="<b>Grup süresi var</b><div class='text-gray-600 text-xs mt-1'>Süre ve bekleme alanları anlamlı olur.</div>"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="duration">Süre</Label>
                                <NumberInput
                                    id="duration"
                                    inputType="number"
                                    value={formData.duration ?? 0}
                                    onChange={(v) => handleChange('duration', v)}
                                    minValue={0}
                                    decimalPlaces={0}
                                    className={durationDisabled ? 'opacity-50 pointer-events-none' : ''}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="waitingDuration">Bekleme süresi</Label>
                                <NumberInput
                                    id="waitingDuration"
                                    inputType="number"
                                    value={formData.waitingDuration ?? 0}
                                    onChange={(v) => handleChange('waitingDuration', v)}
                                    minValue={0}
                                    decimalPlaces={0}
                                    className={durationDisabled ? 'opacity-50 pointer-events-none' : ''}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="playbackCount">Oynatma sayısı</Label>
                                <NumberInput
                                    id="playbackCount"
                                    inputType="number"
                                    value={formData.playbackCount ?? 0}
                                    onChange={(v) => handleChange('playbackCount', v)}
                                    minValue={0}
                                    decimalPlaces={0}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="recordingDuration">Kayıt süresi</Label>
                                <NumberInput
                                    id="recordingDuration"
                                    inputType="number"
                                    value={formData.recordingDuration ?? 0}
                                    onChange={(v) => handleChange('recordingDuration', v)}
                                    minValue={0}
                                    decimalPlaces={0}
                                />
                            </div>
                        </div>
                    </div>

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
