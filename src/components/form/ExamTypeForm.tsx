'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { NumberInput } from "@/components/ui/number-input";
import {ExamTypeDto} from "@/types/exam/examTemplates";
import {EExamType, EStatus} from "@/types/exam/enum";
import Checkbox from "@/components/ui/checkbox";



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
    const [formData, setFormData] = useState<ExamTypeDto>({
        name: '',
        examLevel: '',
        examType: EExamType.CERTIFICATE,
        infoScreen: '',
        description: '',
        isOrder: false,
        isShowEvaluation: false,
        isFinalized: false,
        isGraded: false,
        screenRecordTime: 0,
        maximumScore: 100,
        durationInSeconds: 3600,
        questionGroupTypes:[],

        id: '',
        createdAt: new Date(),
        deletedAt: null,
        status: EStatus.ACTIVE,
        createdById: '',
        deletedById: ''
    });




    const [errors, setErrors] = useState<ExamTypeFormErrors>({});

    useEffect(() => {
        if (examType) {
            setFormData({
                name: examType.name || '',
                examLevel: examType.examLevel || '',
                examType: examType.examType || EExamType.CERTIFICATE,
                infoScreen: examType.infoScreen || '',
                description: examType.description || '',
                isOrder: examType.isOrder || false,
                isShowEvaluation: examType.isShowEvaluation || false,
                isFinalized: examType.isFinalized || false,
                isGraded: examType.isGraded || false,
                screenRecordTime: examType.screenRecordTime || 0,
                maximumScore: examType.maximumScore || 100,
                durationInSeconds: examType.durationInSeconds || 3600,
                questionGroupTypes: examType.questionGroupTypes || [],
                id: examType.id,
                createdAt: examType.createdAt,
                deletedAt: examType.deletedAt || null,
                status: examType.status,
                createdById: examType.createdById,
                deletedById: examType.deletedById
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

        if (!formData.name.trim()) {
            newErrors.name = 'Sınav tipi adı zorunludur';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Sınav tipi adı en az 3 karakter olmalıdır';
        }

        if (!formData.examLevel.trim()) {
            newErrors.examLevel = 'Sınav seviyesi zorunludur';
        }

        if (!formData.examType) {
            newErrors.examType = 'Sınav tipi seçimi zorunludur';
        }

        if (!formData.infoScreen.trim()) {
            newErrors.infoScreen = 'Bilgi ekranı zorunludur';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Açıklama zorunludur';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Açıklama en az 10 karakter olmalıdır';
        }

        if (formData.screenRecordTime < 0) {
            newErrors.screenRecordTime = 'Ekran kayıt süresi 0\'dan küçük olamaz';
        }

        if (formData.maximumScore <= 0) {
            newErrors.maximumScore = 'Maksimum puan 0\'dan büyük olmalıdır';
        } else if (formData.maximumScore > 1000) {
            newErrors.maximumScore = 'Maksimum puan 1000\'den büyük olamaz';
        }

        if (formData.durationInSeconds <= 0) {
            newErrors.durationInSeconds = 'Süre 0\'dan büyük olmalıdır';
        } else if (formData.durationInSeconds > 86400) { // 24 saat
            newErrors.durationInSeconds = 'Süre 24 saatten uzun olamaz';
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
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
                            <Input
                                id="examLevel"
                                value={formData.examLevel}
                                onChange={(e) => handleChange('examLevel', e.target.value)}
                                className={errors.examLevel ? 'border-red-500' : ''}
                                placeholder="Sınav seviyesini giriniz"
                            />
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
                                value={formData.examType}
                            >
                                <SelectTrigger className={errors.examType ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Sınav tipi seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="CERTIFICATE">Sertifika</SelectItem>
                                        <SelectItem value="COURSE_EXAM">Kurs Sınavı</SelectItem>
                                        <SelectItem value="LEVEL_DETERMINATION">Seviye Belirleme</SelectItem>
                                        <SelectItem value="PRACTICE">Pratik</SelectItem>
                                        <SelectItem value="DEGREE">Derece</SelectItem>
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
                    </div>

                    {/* Bilgi Ekranı */}
                    <div className="space-y-2">
                        <Label htmlFor="infoScreen">Bilgi Ekranı *</Label>
                        <Textarea
                            id="infoScreen"
                            value={formData.infoScreen}
                            onChange={(e) => handleChange('infoScreen', e.target.value)}
                            className={`min-h-[100px] ${errors.infoScreen ? 'border-red-500' : ''}`}
                            placeholder="Sınav öncesi gösterilecek bilgi metnini giriniz"
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
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                            placeholder="Sınav tipi hakkında açıklama giriniz"
                        />
                        {errors.description && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.description}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Checkbox'lar */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isOrder"
                                checked={formData.isOrder}
                                onChange={(checked) => handleChange('isOrder', !!checked)}
                            />
                            <Label htmlFor="isOrder">Sıralı Sınav</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isShowEvaluation"
                                checked={formData.isShowEvaluation}
                                onChange={(checked) => handleChange('isShowEvaluation', !!checked)}
                            />
                            <Label htmlFor="isShowEvaluation">Değerlendirme Göster</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isGraded"
                                checked={formData.isGraded}
                                onChange={(checked) => handleChange('isGraded', !!checked)}
                            />
                            <Label htmlFor="isGraded">Notlandırılabilir</Label>
                        </div>
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