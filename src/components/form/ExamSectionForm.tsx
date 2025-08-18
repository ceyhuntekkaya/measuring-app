'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumberInput } from "@/components/ui/number-input";
import { CreateExamSectionRequest } from "@/types/exam/examEntities";
import { ExamSectionDto, ExamTypeDto } from "@/types/exam/examTemplates";
import {UpdateExamSectionRequest} from "@/types/exam/examResponses";

interface ExamSectionFormData {
    name: string;
    examTypeId: string;
    orderNumber: number;
}

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
}

const ExamSectionForm: React.FC<ExamSectionFormProps> = ({
                                                             onSubmit,
                                                             examSection,
                                                             examTypes = [],
                                                             loading = false
                                                         }) => {
    const [formData, setFormData] = useState<ExamSectionFormData>({
        name: '',
        examTypeId: '',
        orderNumber: 1
    });

    const [errors, setErrors] = useState<ExamSectionFormErrors>({});

    useEffect(() => {
        if (examSection) {
            setFormData({
                name: examSection.name || '',
                examTypeId: examSection.examType?.id || '',
                orderNumber: examSection.orderNumber || 1
            });
        }
    }, [examSection]);

    const handleChange = <T extends keyof ExamSectionFormData>(
        name: T,
        value: ExamSectionFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: ExamSectionFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Sınav bölümü adı zorunludur';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Sınav bölümü adı en az 3 karakter olmalıdır';
        }

        if (!formData.examTypeId) {
            newErrors.examTypeId = 'Sınav tipi seçimi zorunludur';
        }

        if (formData.orderNumber <= 0) {
            newErrors.orderNumber = 'Sıra numarası 0\'dan büyük olmalıdır';
        } else if (formData.orderNumber > 100) {
            newErrors.orderNumber = 'Sıra numarası 100\'den büyük olamaz';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const submitData = {
                name: formData.name.trim(),
                examTypeId: formData.examTypeId,
                orderNumber: formData.orderNumber
            };

            onSubmit(submitData);
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