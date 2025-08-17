'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumberInput } from "@/components/ui/number-input";
import { CreateQuestionGroupRequest, CreateQuestionGroupHeaderRequest } from "@/types/exam/examRequests";
import { ExamTypeDto, ExamSectionDto, QuestionGroupTypeDto } from "@/types/exam/examTemplates";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import {EMediaType} from "@/types/exam/enum";
import {QuestionGroupDto} from "@/types/exam/examEntities";

interface QuestionGroupFormData {
    name: string;
    examTypeId: string;
    examSectionId: string;
    questionGroupTypeId: string;
    maximumScore?: number;
    durationInSeconds?: number;
    headers: CreateQuestionGroupHeaderRequest[];
}

interface QuestionGroupFormErrors {
    name?: string;
    examTypeId?: string;
    examSectionId?: string;
    questionGroupTypeId?: string;
    maximumScore?: string;
    durationInSeconds?: string;
    headers?: string;
}

interface QuestionGroupFormProps {
    onSubmit: (data: CreateQuestionGroupRequest) => void;
    questionGroup?: QuestionGroupDto | null;
    examTypes: ExamTypeDto[];
    examSections: ExamSectionDto[];
    questionGroupTypes: QuestionGroupTypeDto[];
    loading?: boolean;
}

const QuestionGroupForm: React.FC<QuestionGroupFormProps> = ({
                                                                 onSubmit,
                                                                 questionGroup,
                                                                 examTypes = [],
                                                                 examSections = [],
                                                                 questionGroupTypes = [],
                                                                 loading = false
                                                             }) => {
    const [formData, setFormData] = useState<QuestionGroupFormData>({
        name: '',
        examTypeId: '',
        examSectionId: '',
        questionGroupTypeId: '',
        maximumScore: undefined,
        durationInSeconds: undefined,
        headers: []
    });

    const [errors, setErrors] = useState<QuestionGroupFormErrors>({});
    const [filteredSections, setFilteredSections] = useState<ExamSectionDto[]>([]);
    const [filteredGroupTypes, setFilteredGroupTypes] = useState<QuestionGroupTypeDto[]>([]);

    useEffect(() => {
        if (questionGroup) {
            setFormData({
                name: questionGroup.name || '',
                examTypeId: questionGroup.examType?.id || '',
                examSectionId: questionGroup.examSection?.id || '',
                questionGroupTypeId: questionGroup.questionGroupType?.id || '',
                maximumScore: questionGroup.maximumScore,
                durationInSeconds: questionGroup.durationInSeconds,
                headers: []
            });
        }
    }, [questionGroup]);

    // Exam Type değiştiğinde sections'ı filtrele
    useEffect(() => {
        if (formData.examTypeId) {
            const filtered = examSections.filter(section => section.examType?.id === formData.examTypeId);
            setFilteredSections(filtered);

            // Eğer seçili section artık mevcut değilse temizle
            if (formData.examSectionId && !filtered.find(s => s.id === formData.examSectionId)) {
                setFormData(prev => ({ ...prev, examSectionId: '' }));
            }
        } else {
            setFilteredSections([]);
            setFormData(prev => ({ ...prev, examSectionId: '' }));
        }
    }, [formData.examTypeId, examSections]);

    // Exam Section değiştiğinde group types'ı filtrele
    useEffect(() => {
        if (formData.examSectionId) {
            const filtered = questionGroupTypes.filter(type => type.examSection?.id === formData.examSectionId);
            setFilteredGroupTypes(filtered);

            // Eğer seçili group type artık mevcut değilse temizle
            if (formData.questionGroupTypeId && !filtered.find(t => t.id === formData.questionGroupTypeId)) {
                setFormData(prev => ({ ...prev, questionGroupTypeId: '' }));
            }
        } else {
            setFilteredGroupTypes([]);
            setFormData(prev => ({ ...prev, questionGroupTypeId: '' }));
        }
    }, [formData.examSectionId, questionGroupTypes]);

    const handleChange = <T extends keyof QuestionGroupFormData>(
        name: T,
        value: QuestionGroupFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addHeader = () => {
        const newHeader: CreateQuestionGroupHeaderRequest = {
            orderNumber: formData.headers.length + 1,
            mediaType: EMediaType.TEXT,
            content: ''
        };

        setFormData(prev => ({
            ...prev,
            headers: [...prev.headers, newHeader]
        }));
    };

    const removeHeader = (index: number) => {
        setFormData(prev => ({
            ...prev,
            headers: prev.headers.filter((_, i) => i !== index)
        }));
    };

    const updateHeader = (index: number, field: keyof CreateQuestionGroupHeaderRequest, value: CreateQuestionGroupHeaderRequest[keyof CreateQuestionGroupHeaderRequest]) => {
        setFormData(prev => ({
            ...prev,
            headers: prev.headers.map((header, i) =>
                i === index ? { ...header, [field]: value } : header
            )
        }));
    };



    const validateForm = (): boolean => {
        const newErrors: QuestionGroupFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Soru grubu adı zorunludur';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Soru grubu adı en az 3 karakter olmalıdır';
        }

        if (!formData.examTypeId) {
            newErrors.examTypeId = 'Sınav tipi seçimi zorunludur';
        }

        if (!formData.examSectionId) {
            newErrors.examSectionId = 'Sınav bölümü seçimi zorunludur';
        }

        if (!formData.questionGroupTypeId) {
            newErrors.questionGroupTypeId = 'Soru grubu tipi seçimi zorunludur';
        }

        if (formData.maximumScore !== undefined && formData.maximumScore <= 0) {
            newErrors.maximumScore = 'Maksimum puan 0\'dan büyük olmalıdır';
        }

        if (formData.durationInSeconds !== undefined && formData.durationInSeconds <= 0) {
            newErrors.durationInSeconds = 'Süre 0\'dan büyük olmalıdır';
        }

        // Header validasyonu
        const invalidHeaders = formData.headers.some(header => !header.content.trim());
        if (invalidHeaders) {
            newErrors.headers = 'Tüm başlık içerikleri doldurulmalıdır';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const submitData: CreateQuestionGroupRequest = {
                name: formData.name.trim(),
                examTypeId: formData.examTypeId,
                examSectionId: formData.examSectionId,
                questionGroupTypeId: formData.questionGroupTypeId,
                ...(formData.maximumScore !== undefined && { maximumScore: formData.maximumScore }),
                ...(formData.durationInSeconds !== undefined && { durationInSeconds: formData.durationInSeconds }),
                ...(formData.headers.length > 0 && { headers: formData.headers })
            };

            onSubmit(submitData);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {questionGroup ? "Soru Grubu Güncelle" : "Yeni Soru Grubu Oluştur"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Soru Grubu Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Soru Grubu Adı *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Soru grubu adını giriniz"
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Sınav Tipi */}
                        <div className="space-y-2">
                            <Label htmlFor="examType">Sınav Tipi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('examTypeId', value as string)}
                                value={formData.examTypeId}
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

                        {/* Sınav Bölümü */}
                        <div className="space-y-2">
                            <Label htmlFor="examSection">Sınav Bölümü *</Label>
                            <Select
                                onValueChange={(value) => handleChange('examSectionId', value as string)}
                                value={formData.examSectionId}
                                disabled={!formData.examTypeId}
                            >
                                <SelectTrigger className={errors.examSectionId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Sınav bölümü seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {filteredSections.map(section => (
                                            <SelectItem key={section.id} value={section.id || ''}>
                                                {section.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.examSectionId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.examSectionId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Soru Grubu Tipi */}
                        <div className="space-y-2">
                            <Label htmlFor="questionGroupType">Soru Grubu Tipi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('questionGroupTypeId', value as string)}
                                value={formData.questionGroupTypeId}
                                disabled={!formData.examSectionId}
                            >
                                <SelectTrigger className={errors.questionGroupTypeId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Soru grubu tipi seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {filteredGroupTypes.map(groupType => (
                                            <SelectItem key={groupType.id} value={groupType.id || ''}>
                                                {groupType.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.questionGroupTypeId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.questionGroupTypeId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Maksimum Puan */}
                        <div className="space-y-2">
                            <Label htmlFor="maximumScore">Maksimum Puan</Label>
                            <NumberInput
                                id="maximumScore"
                                value={formData.maximumScore || 0}
                                onChange={(value) => handleChange('maximumScore', value || undefined)}
                                minValue={0}
                                decimalPlaces={0}
                                className={errors.maximumScore ? 'border-red-500' : ''}
                                placeholder="0"
                            />
                            {errors.maximumScore && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.maximumScore}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Süre */}
                        <div className="space-y-2">
                            <Label htmlFor="durationInSeconds">Süre (saniye)</Label>
                            <NumberInput
                                id="durationInSeconds"
                                value={formData.durationInSeconds || 0}
                                onChange={(value) => handleChange('durationInSeconds', value || undefined)}
                                minValue={0}
                                decimalPlaces={0}
                                unit="saniye"
                                className={errors.durationInSeconds ? 'border-red-500' : ''}
                                placeholder="0"
                            />
                            {errors.durationInSeconds && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.durationInSeconds}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    {/* Headers Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Başlıklar</Label>
                            <Button
                                type="button"
                                onClick={addHeader}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Başlık Ekle
                            </Button>
                        </div>

                        {formData.headers.map((header, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                                <div className="col-span-1">
                                    <Label>Sıra</Label>
                                    <NumberInput
                                        value={header.orderNumber}
                                        onChange={(value) => updateHeader(index, 'orderNumber', value)}
                                        minValue={1}
                                        decimalPlaces={0}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label>Medya Tipi</Label>
                                    <Select
                                        onValueChange={(value) => updateHeader(index, 'mediaType', value as EMediaType)}
                                        value={header.mediaType || "TEXT"}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>

                                                {Object.entries(EMediaType).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-8">
                                    <Label>İçerik</Label>
                                    <Textarea
                                        value={header.content}
                                        onChange={(e) => updateHeader(index, 'content', e.target.value)}
                                        placeholder="Başlık içeriğini giriniz"
                                        className="min-h-[60px]"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        onClick={() => removeHeader(index)}
                                        variant="primary"
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {errors.headers && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.headers}</AlertDescription>
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
                            {loading ? "İşleniyor..." : questionGroup ? "Soru Grubu Güncelle" : "Soru Grubu Oluştur"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuestionGroupForm;