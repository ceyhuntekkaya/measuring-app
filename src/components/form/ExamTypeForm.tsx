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
import type {ExamTypeDto} from "@/api/generated/model";
import { ExamTypeDtoDepartment } from "@/api/generated/model/examTypeDtoDepartment";
import { ExamTypeDtoStatus } from "@/api/generated/model/examTypeDtoStatus";
import {EExamType} from "@/types/exam/enum";
import TextYesNoCheckbox from "@/components/ui/text-yes-no-checkbox";
import TextSelect from "@/components/ui/text-select";
import {examTypeConverter} from "@/utils/enum-converter";



interface ExamTypeFormErrors {
    name?: string;
    examLevel?: string;
    examType?: string;
    infoScreen?: string;
    description?: string;
    screenRecordTime?: string;
    maximumScore?: string;
    durationInSeconds?: string;
}

interface ExamTypeFormProps {
    onSubmit: (data: ExamTypeDto) => void;
    examType?: ExamTypeDto | null;
    loading?: boolean;
}

const ExamTypeForm: React.FC<ExamTypeFormProps> = ({
                                                       onSubmit,
                                                       examType,
                                                       loading = false
                                                   }) => {
    const statusLabelTr = (status: ExamTypeDtoStatus | string) => {
        switch (status) {
            case ExamTypeDtoStatus.ACTIVE:
            case 'ACTIVE':
                return 'Aktif';
            case ExamTypeDtoStatus.PASSIVE:
            case 'PASSIVE':
                return 'Pasif';
            case ExamTypeDtoStatus.DELETED:
            case 'DELETED':
                return 'Silindi';
            default:
                return String(status);
        }
    };

    const [formData, setFormData] = useState<ExamTypeDto>({
        name: '',
        examLevel: '',
        examType: EExamType.CERTIFICATE as ExamTypeDto['examType'],
        infoScreen: '',
        description: '',
        isOrder: false,
        isShowEvaluation: false,
        isFinalized: false,
        status: ExamTypeDtoStatus.ACTIVE,
        isGraded: false,
        screenRecordTime: 0,
        maximumScore: 100,
        durationInSeconds: 3600,
        examLanguage: '',
        questionGroupTypes: []
    });




    const [errors, setErrors] = useState<ExamTypeFormErrors>({});

    useEffect(() => {
        if (examType) {
            setFormData({
                name: examType.name || '',
                examLevel: examType.examLevel || '',
                examType: examType.examType || EExamType.CERTIFICATE as ExamTypeDto['examType'],
                infoScreen: examType.infoScreen || '',
                description: examType.description || '',
                isOrder: examType.isOrder || false,
                isShowEvaluation: examType.isShowEvaluation || false,
                isFinalized: examType.isFinalized || false,
                isGraded: examType.isGraded || false,
                status: examType.status || ExamTypeDtoStatus.ACTIVE,
                screenRecordTime: examType.screenRecordTime || 0,
                maximumScore: examType.maximumScore || 100,
                durationInSeconds: examType.durationInSeconds || 3600,
                examLanguage: examType.examLanguage || '',
                department: examType.department,
                questionGroupTypes: examType.questionGroupTypes || []
            });
        }
    }, [examType]);

    const handleChange = <T extends keyof ExamTypeDto>(
        name: T,
        value: ExamTypeDto[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: ExamTypeFormErrors = {};

        const plainText = (html?: string) => {
            const raw = (html ?? '').trim();
            if (!raw) return '';
            try {
                const doc = new DOMParser().parseFromString(raw, 'text/html');
                return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
            } catch {
                return raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            }
        };

        if (!formData.name || !formData.name.trim()) {
            newErrors.name = 'Sınav tipi adı zorunludur';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Sınav tipi adı en az 3 karakter olmalıdır';
        }

        if (!formData.examLevel || !formData.examLevel.trim()) {
            newErrors.examLevel = 'Sınav seviyesi zorunludur';
        }

        if (!formData.examType) {
            newErrors.examType = 'Sınav tipi seçimi zorunludur';
        }

        if (!plainText(formData.infoScreen)) {
            newErrors.infoScreen = 'Bilgi ekranı zorunludur';
        }

        const descriptionText = plainText(formData.description);
        if (!descriptionText) {
            newErrors.description = 'Açıklama zorunludur';
        } else if (descriptionText.length < 10) {
            newErrors.description = 'Açıklama en az 10 karakter olmalıdır';
        }

        if (formData.screenRecordTime !== undefined && formData.screenRecordTime < 0) {
            newErrors.screenRecordTime = 'Ekran kayıt süresi 0\'dan küçük olamaz';
        }

        if (formData.maximumScore !== undefined && formData.maximumScore <= 0) {
            newErrors.maximumScore = 'Maksimum puan 0\'dan büyük olmalıdır';
        } else if (formData.maximumScore !== undefined && formData.maximumScore > 1000) {
            newErrors.maximumScore = 'Maksimum puan 1000\'den büyük olamaz';
        }

        if (formData.durationInSeconds !== undefined && formData.durationInSeconds <= 0) {
            newErrors.durationInSeconds = 'Süre 0\'dan büyük olmalıdır';
        } else if (formData.durationInSeconds !== undefined && formData.durationInSeconds > 86400) { // 24 saat
            newErrors.durationInSeconds = 'Süre 24 saatten uzun olamaz';
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const departmentLabel = (d: string) => {
        const labels: Record<string, string> = {
            TURKISH: 'Türkçe',
            ENGLISH: 'İngilizce',
            GERMAN: 'Almanca',
            CHINESE: 'Çince',
            ARABIC: 'Arapça',
            FRENCH: 'Fransızca',
            JAPANESE: 'Japonca',
            RUSSIAN: 'Rusça',
            KOREAN: 'Korece',
            GREEK: 'Yunanca',
            PERSIAN: 'Farsça',
        };
        return labels[d] ?? d;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Directly use formData - ExamTypeDto is used directly by API
            onSubmit(formData);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {examType ? "Sınav Tipi Güncelle" : "Yeni Sınav Tipi Oluştur"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Sınav Tipi Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Sınav Tipi Adı *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Sınav tipi adını giriniz"
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Sınav Seviyesi */}
                        <div className="space-y-2">
                            <Label htmlFor="examLevel">Sınav Seviyesi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('examLevel', value as string)}
                                value={formData.examLevel || ''}
                            >
                                <SelectTrigger className={errors.examLevel ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Sınav seviyesini seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.examLevel && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.examLevel}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Sınav Tipi */}
                        <div className="space-y-2">
                            <Label htmlFor="examType">Sınav Tipi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('examType', value as EExamType)}
                                value={(formData.examType || '') as string}
                            >
                                <SelectTrigger className={errors.examType ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Sınav tipi seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            Object.values(EExamType).map((item, key) => (
                                                <SelectItem key={key} value={item}>{examTypeConverter(item)}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.examType && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.examType}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Maksimum Puan */}
                        <div className="space-y-2">
                            <Label htmlFor="maximumScore">Maksimum Puan *</Label>
                            <NumberInput
                                id="maximumScore"
                                inputType={"number"}
                                value={formData.maximumScore}
                                onChange={(value) => handleChange('maximumScore', value)}
                                minValue={1}
                                maxValue={1000}
                                decimalPlaces={0}
                                className={errors.maximumScore ? 'border-red-500' : ''}
                            />
                            {errors.maximumScore && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.maximumScore}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Süre (saniye) */}
                        <div className="space-y-2">
                            <Label htmlFor="durationInSeconds">Süre (saniye) *</Label>
                            <NumberInput
                                id="durationInSeconds"
                                inputType={"number"}
                                value={formData.durationInSeconds}
                                onChange={(value) => handleChange('durationInSeconds', value)}
                                minValue={1}
                                maxValue={86400}
                                decimalPlaces={0}
                                unit="saniye"
                                className={errors.durationInSeconds ? 'border-red-500' : ''}
                            />
                            {errors.durationInSeconds && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.durationInSeconds}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Ekran Kayıt Süresi */}
                        <div className="space-y-2">
                            <Label htmlFor="screenRecordTime">Ekran Kayıt Süresi (saniye)</Label>
                            <NumberInput
                                id="screenRecordTime"
                                inputType={"number"}
                                value={formData.screenRecordTime}
                                onChange={(value) => handleChange('screenRecordTime', value)}
                                minValue={0}
                                decimalPlaces={0}
                                unit="saniye"
                                className={errors.screenRecordTime ? 'border-red-500' : ''}
                            />
                            {errors.screenRecordTime && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.screenRecordTime}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Sınav dili (serbest metin) */}
                        <div className="space-y-2">
                            <Label htmlFor="examLanguage">Sınav dili</Label>
                            <Input
                                id="examLanguage"
                                value={formData.examLanguage || ''}
                                onChange={(e) => handleChange('examLanguage', e.target.value)}
                                placeholder="Örn. Türkçe, İngilizce"
                            />
                        </div>

                        {/* Bölüm (dil enstitüsü) */}
                        <div className="space-y-2">
                            <TextSelect
                                id="department"
                                value={(formData.department || '') as string}
                                onChange={(value) =>
                                    handleChange(
                                        'department',
                                        (value || undefined) as ExamTypeDto['department']
                                    )
                                }
                                placeholder="Bölüm seçin (isteğe bağlı)"
                                html="<b>Bölüm</b><div class='text-gray-600 text-xs mt-1'>Dil / enstitü bölümü.</div>"
                                options={Object.values(ExamTypeDtoDepartment).map((d) => ({
                                    value: d,
                                    label: departmentLabel(d),
                                }))}
                            />
                        </div>
                    </div>

                    {/* Bilgi Ekranı */}
                    <div className="space-y-2">
                        <Label htmlFor="infoScreen">Bilgi Ekranı *</Label>
                        <HtmlEditor
                            id="infoScreen"
                            value={formData.infoScreen || ''}
                            onChange={(html) => handleChange('infoScreen', html)}
                            error={!!errors.infoScreen}
                            placeholder="Sınav öncesi gösterilecek bilgi metnini giriniz"
                            minHeightClassName="min-h-[160px]"
                        />
                        {errors.infoScreen && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.infoScreen}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Açıklama */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama *</Label>
                        <HtmlEditor
                            id="description"
                            value={formData.description || ''}
                            onChange={(html) => handleChange('description', html)}
                            error={!!errors.description}
                            placeholder="Sınav tipi hakkında açıklama giriniz"
                            minHeightClassName="min-h-[160px]"
                        />
                        {errors.description && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.description}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Checkbox'lar */}
                    <div className="grid grid-cols-3 gap-4">
                        <TextYesNoCheckbox
                            id="isOrder"
                            checked={formData.isOrder}
                            onChange={(checked) => handleChange('isOrder', !!checked)}
                            html="<b>Sıralı Sınav</b><div class='text-gray-600 text-xs mt-1'>Sorular belirlenen sırayla ilerler.</div>"
                        />

                        <TextYesNoCheckbox
                            id="isShowEvaluation"
                            checked={formData.isShowEvaluation}
                            onChange={(checked) => handleChange('isShowEvaluation', !!checked)}
                            html="<b>Değerlendirme Göster</b><div class='text-gray-600 text-xs mt-1'>Sınav sonrası değerlendirme ekranı gösterilir.</div>"
                        />

                        <TextYesNoCheckbox
                            id="isGraded"
                            checked={formData.isGraded}
                            onChange={(checked) => handleChange('isGraded', !!checked)}
                            html="<b>Notlandırılabilir</b><div class='text-gray-600 text-xs mt-1'>Sınav puanlanabilir/notlandırılabilir olur.</div>"
                        />
                    </div>

                    {/* Status & Finalize */}
                    <div className="grid grid-cols-2 gap-4">
                        <TextSelect
                            id="status"
                            value={(formData.status || ExamTypeDtoStatus.ACTIVE) as string}
                            onChange={(value) => handleChange('status', value as ExamTypeDto['status'])}
                            placeholder="Durum seçin"
                            html="<b>Durum</b><div class='text-gray-600 text-xs mt-1'>Sınav tipinin aktif/pasif durumunu belirler.</div>"
                            options={Object.values(ExamTypeDtoStatus).map((s) => ({ value: s, label: statusLabelTr(s) }))}
                        />

                        <TextYesNoCheckbox
                            id="isFinalized"
                            checked={!!formData.isFinalized}
                            onChange={(checked) => handleChange('isFinalized', !!checked)}
                            html="<b>Kesinleştirildi</b><div class='text-gray-600 text-xs mt-1'>Taslak yerine kesinleşmiş olarak işaretler.</div>"
                            yesLabel="Evet"
                            noLabel="Hayır"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "İşleniyor..." : examType ? "Sınav Tipi Güncelle" : "Sınav Tipi Oluştur"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ExamTypeForm;