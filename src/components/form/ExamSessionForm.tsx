'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {NumberInput} from "@/components/ui/number-input";
import {ExamSessionFormData} from "@/types/exam/examResponses";
import {ExamSessionDto} from "@/types/exam/examEntities";
import {EExamType, EStatus} from "@/types/exam/enum";
import {BrandDto, BranchDto} from "@/types/management/brand";
import {UserDto} from "@/types/auth";
import {ExamTypeDto} from "@/types/exam/examTemplates";


interface ExamSessionFormErrors {
    name?: string;
    description?: string;
    brandId?: string;
    examTypeId?: string;
    branchId?: string;
    examTemplate?: string;
    startDate?: string;
    quota?: string;
    supervisorIds?: string;
}

interface ExamSessionFormProps {
    onSubmit: (data: ExamSessionFormData) => void;
    examSession?: ExamSessionDto | null;
    loading?: boolean;
    brands: BrandDto[];
    examTypes: ExamTypeDto[];
    branches: BranchDto[];
    supervisors: UserDto[];
    onBrandChange: (brandId: string) => void;
}

const ExamSessionForm: React.FC<ExamSessionFormProps> = ({
                                                             onSubmit,
                                                             examSession,
                                                             loading = false,
                                                             brands = [],
                                                             examTypes = [],
                                                             branches = [],
                                                             supervisors = [],
                                                             onBrandChange
                                                         }) => {
    const [formData, setFormData] = useState<ExamSessionFormData>({
        name: '',
        description: '',
        brandId: '',
        branchId: '',
        examTypeId: '',
        examTemplate: null,
        startDate: null,
        quota: 30,
        supervisorIds: [],
        id: '',
        createdAt: new Date(),
        deletedAt: null,
        status: EStatus.ACTIVE,
        createdById: '',
        deletedById: ''
    });

    const [errors, setErrors] = useState<ExamSessionFormErrors>({});

    useEffect(() => {
        if (examSession) {
            // ISO string formatında tarih dönüşümü
           /* const formatDateForInput = (date: Date | string | undefined) => {
                if (!date) return '';
                const dateObj = typeof date === 'string' ? new Date(date) : date;
                if (isNaN(dateObj.getTime())) return '';
                return dateObj.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm format
            };

            */

            setFormData({

                id: examSession.id || '',
                createdAt: examSession.createdAt || new Date(),
                deletedAt: examSession.deletedAt || null,
                status: examSession.status,
                createdById: examSession.createdById || null,
                deletedById: examSession.deletedById || null,


                name: examSession.name || '',
                description: examSession.description || '',
                brandId: examSession.brand?.id || '',
                branchId: examSession.branch?.id || '',
                examTypeId: examSession.examType?.id || '',
                examTemplate: examSession.examTemplate || '',
                startDate: examSession.startDate,
                quota: examSession.quota || 30,
                supervisorIds: examSession.supervisors?.map(s => s.id) || []
            });
        }
    }, [examSession]);



    const handleChange = <T extends keyof ExamSessionFormData>(
        name: T,
        value: ExamSessionFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Brand seçimi değiştiğinde branch'leri güncelle
        if (name === 'brandId' && onBrandChange) {
            onBrandChange(value as string);
            setFormData(prev => ({...prev, branchId: ''})); // Branch'i sıfırla
        }
    };

    const validateForm = (): boolean => {
        const newErrors: ExamSessionFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Sınav oturumu adı zorunludur';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Sınav oturumu adı en az 3 karakter olmalıdır';
        } else if (formData.name.trim().length > 100) {
            newErrors.name = 'Sınav oturumu adı en fazla 100 karakter olmalıdır';
        }
        if (formData.description) {
            if (!formData.description.trim()) {
                newErrors.description = 'Açıklama zorunludur';
            } else if (formData.description.trim().length < 10) {
                newErrors.description = 'Açıklama en az 10 karakter olmalıdır';
            } else if (formData.description.trim().length > 500) {
                newErrors.description = 'Açıklama en fazla 500 karakter olmalıdır';
            }
        }

        if (!formData.brandId) {
            newErrors.brandId = 'Marka seçimi zorunludur';
        }

        if (!formData.branchId) {
            newErrors.branchId = 'Şube seçimi zorunludur';
        }

        if (!formData.examTypeId) {
            newErrors.examTypeId = 'Sınav Tipi seçimi zorunludur';
        }

        if (!formData.examTemplate) {
            newErrors.examTemplate = 'Sınav şablonu seçimi zorunludur';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Başlangıç tarihi zorunludur';
        } else {
            const startDate = new Date(formData.startDate);
            const now = new Date();
            if (startDate <= now) {
                newErrors.startDate = 'Başlangıç tarihi gelecekte olmalıdır';
            }
        }


        if (formData.quota <= 0) {
            newErrors.quota = 'Kapasite 0\'dan büyük olmalıdır';
        } else if (formData.quota > 1000) {
            newErrors.quota = 'Kapasite 1000\'den fazla olamaz';
        }

        if (formData.supervisorIds.length === 0) {
            newErrors.supervisorIds = 'En az bir gözetmen seçilmelidir';
        } else if (formData.supervisorIds.length > 10) {
            newErrors.supervisorIds = 'En fazla 10 gözetmen seçilebilir';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const submitData = {
                id: formData.id || '',
                createdAt: formData.createdAt || new Date(),
                deletedAt: formData.deletedAt || null,
                status: formData.status,
                createdById: formData.createdById || null,
                deletedById: formData.deletedById || null,

                name: formData.name.trim(),
                description: formData.description.trim(),
                brandId: formData.brandId,
                branchId: formData.branchId,
                examTypeId: formData.examTypeId,
                examTemplate: formData.examTemplate as EExamType,
                startDate: formData.startDate,
                quota: formData.quota,
                supervisorIds: formData.supervisorIds
            };

            onSubmit(submitData);
        }
    };

    const handleSupervisorToggle = (supervisorId: string) => {
        setFormData(prev => ({
            ...prev,
            supervisorIds: prev.supervisorIds.includes(supervisorId)
                ? prev.supervisorIds.filter(id => id !== supervisorId)
                : [...prev.supervisorIds, supervisorId]
        }));
    };

    const getSelectedSupervisorsText = () => {
        if (formData.supervisorIds.length === 0) return 'Gözetmen seçin';
        if (formData.supervisorIds.length === 1) {
            const supervisor = supervisors.find(s => s.id === formData.supervisorIds[0]);
            return supervisor ? `${supervisor.name} ${supervisor.lastName}` : 'Gözetmen seçin';
        }
        return `${formData.supervisorIds.length} gözetmen seçildi`;
    };



    const formatDateTimeLocal = (date: Date | null): string => {
        if (date == null) return '';
        const d = (date instanceof Date) ? date : new Date(date);

        if (isNaN(d.getTime())) return ''; // Geçersiz tarih kontrolü

        return d.toISOString().slice(0, 16);
    };

    const parseDateTimeLocal = (value: string): Date | null => {
        if (!value) return null;
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    };



    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {examSession ? "Sınav Oturumu Güncelle" : "Yeni Sınav Oturumu Oluştur"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Sınav Oturumu Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Sınav Oturumu Adı *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Sınav oturumu adını giriniz"
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>



                        <div className="space-y-2">
                            <Label htmlFor="examTypeId">Sınav Tipi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('examTypeId', value as string)}
                                value={formData.examTypeId || ''}
                            >
                                <SelectTrigger className={errors.examTypeId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Sınav tipi seçin"/>
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

                        {/* Kapasite */}
                        <div className="space-y-2">
                            <Label htmlFor="quota">Kapasite *</Label>
                            <NumberInput
                                id="quota"
                                inputType="number"
                                value={formData.quota}
                                onChange={(value) => handleChange('quota', value)}
                                minValue={1}
                                maxValue={1000}
                                decimalPlaces={0}
                                className={errors.quota ? 'border-red-500' : ''}
                            />
                            {errors.quota && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.quota}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Marka */}
                        <div className="space-y-2">
                            <Label htmlFor="brandId">Marka *</Label>
                            <Select
                                onValueChange={(value) => handleChange('brandId', value as string)}
                                value={formData.brandId}
                            >
                                <SelectTrigger className={errors.brandId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Marka seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {brands.map((brand) => (
                                            <SelectItem key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.brandId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.brandId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Şube */}
                        <div className="space-y-2">
                            <Label htmlFor="branchId">Şube *</Label>
                            <Select
                                onValueChange={(value) => handleChange('branchId', value as string)}
                                value={formData.branchId}
                                disabled={!formData.brandId}
                            >
                                <SelectTrigger className={errors.branchId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Şube seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {branches.map((branch) => (
                                            <SelectItem key={branch.id} value={branch.id}>
                                                {branch.branchName}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.branchId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.branchId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Sınav Şablonu */}
                        <div className="space-y-2">
                            <Label htmlFor="examTemplate">Sınav Şablonu *</Label>
                            <Select
                                onValueChange={(value) => handleChange('examTemplate', value as EExamType)}
                                value={formData.examTemplate as string}
                            >
                                <SelectTrigger className={errors.examTemplate ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Sınav şablonu seçin"/>
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
                            {errors.examTemplate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.examTemplate}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Başlangıç Tarihi */}
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Başlangıç Tarihi *</Label>
                            <Input
                                id="startDate"
                                type="datetime-local"
                                value={formatDateTimeLocal(formData.startDate)}
                                onChange={(e) => handleChange('startDate', parseDateTimeLocal(e.target.value))}
                                className={errors.startDate ? 'border-red-500' : ''}
                            />
                            {errors.startDate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.startDate}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Bitiş Tarihi */}

                    </div>

                    {/* Açıklama */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                            placeholder="Sınav oturumu hakkında açıklama giriniz"
                        />
                        {errors.description && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.description}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Gözetmenler */}
                    <div className="space-y-2">
                        <Label>Gözetmenler *</Label>
                        <div className="border rounded-lg p-4 max-h-40 overflow-y-auto">
                            <div className="text-sm text-gray-600 mb-2">
                                {getSelectedSupervisorsText()}
                            </div>
                            {supervisors.map((supervisor) => (
                                <div
                                    key={supervisor.id}
                                    className="flex items-center space-x-2 py-1"
                                >
                                    <input
                                        type="checkbox"
                                        id={`supervisor-${supervisor.id}`}
                                        checked={formData.supervisorIds.includes(supervisor.id)}
                                        onChange={() => handleSupervisorToggle(supervisor.id)}
                                        className="rounded"
                                    />
                                    <Label
                                        htmlFor={`supervisor-${supervisor.id}`}
                                        className="cursor-pointer"
                                    >
                                        {supervisor.name} {supervisor.lastName}
                                        {supervisor.email && (
                                            <span className="text-gray-500 text-xs ml-2">
                                                ({supervisor.email})
                                            </span>
                                        )}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {errors.supervisorIds && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.supervisorIds}</AlertDescription>
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
                            {loading ? "İşleniyor..." : examSession ? "Sınav Oturumu Güncelle" : "Sınav Oturumu Oluştur"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ExamSessionForm;