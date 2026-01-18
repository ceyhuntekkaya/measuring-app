'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import type {SelectValue as SelectValueType, SelectValues} from "@/components/ui/select";
import {NumberInput} from "@/components/ui/number-input";
import type {ExamSessionDto, ExamTypeDto, BrandDto, BranchDto, CreateExamSessionRequest, UpdateExamSessionRequest} from "@/api/generated/model";
import {EExamType} from "@/types/exam/enum";
import {examTypeConverter} from "@/utils/enum-converter";
import type {UserDto} from "@/api/generated/model";


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
    onSubmit: (data: CreateExamSessionRequest | UpdateExamSessionRequest) => void;
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
    const [formData, setFormData] = useState<CreateExamSessionRequest>({
        name: '',
        description: '',
        brandId: '',
        branchId: '',
        examTypeId: '',
        examTemplate: undefined,
        startDate: undefined,
        quota: 30,
        supervisorIds: []
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
                name: examSession.name || '',
                description: examSession.description || '',
                brandId: examSession.brand?.id || '',
                branchId: examSession.branch?.id || '',
                examTypeId: examSession.examType?.id || '',
                examTemplate: examSession.examTemplate as CreateExamSessionRequest['examTemplate'],
                startDate: examSession.startDate,
                quota: examSession.quota || 30,
                supervisorIds: examSession.supervisors?.map(s => s.id).filter((id): id is string => !!id) || []
            });
        }
    }, [examSession]);



    const handleChange = <T extends keyof CreateExamSessionRequest>(
        name: T,
        value: CreateExamSessionRequest[T]
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

        if (!formData.name || !formData.name.trim()) {
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


        if (!formData.quota || formData.quota <= 0) {
            newErrors.quota = 'Kapasite 0\'dan büyük olmalıdır';
        } else if (formData.quota > 1000) {
            newErrors.quota = 'Kapasite 1000\'den fazla olamaz';
        }

        if (!formData.supervisorIds || formData.supervisorIds.length === 0) {
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
            // Directly use formData - no manual mapping needed!
            const submitData: CreateExamSessionRequest | UpdateExamSessionRequest = {
                name: formData.name?.trim() || '',
                description: formData.description?.trim(),
                brandId: formData.brandId || '',
                branchId: formData.branchId || '',
                examTypeId: formData.examTypeId || '',
                examTemplate: formData.examTemplate,
                startDate: formData.startDate,
                quota: formData.quota,
                supervisorIds: formData.supervisorIds || []
            };

            onSubmit(submitData);
        }
    };

    const handleSupervisorToggle = (supervisorId: string) => {
        setFormData(prev => ({
            ...prev,
            supervisorIds: (prev.supervisorIds || []).includes(supervisorId)
                ? (prev.supervisorIds || []).filter(id => id !== supervisorId)
                : [...(prev.supervisorIds || []), supervisorId]
        }));
    };

    const getSelectedSupervisorsText = () => {
        if (!formData.supervisorIds || formData.supervisorIds.length === 0) return 'Gözetmen seçin';
        if (formData.supervisorIds.length === 1) {
            const supervisor = supervisors.find(s => s.id === formData.supervisorIds?.[0]);
            return supervisor ? `${supervisor.name} ${supervisor.lastName}` : 'Gözetmen seçin';
        }
        return `${formData.supervisorIds.length} gözetmen seçildi`;
    };



    // Tarih ve saat için ayrı state'ler
    const [dateValue, setDateValue] = useState<string>('');
    const [hourValue, setHourValue] = useState<string>('00');
    const [minuteValue, setMinuteValue] = useState<string>('00');

    // Date objesinden tarih ve saat değerlerini ayır
    const getDateAndTimeFromDate = (date: Date | null): { date: string; hour: string; minute: string } => {
        if (!date) return { date: '', hour: '00', minute: '00' };
        
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d.getTime())) return { date: '', hour: '00', minute: '00' };

        // Türkiye saat dilimine göre formatla
        const formatter = new Intl.DateTimeFormat('tr-TR', {
            timeZone: 'Europe/Istanbul',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // 24 saat formatı
        });
        
        const parts = formatter.formatToParts(d);
        const year = parts.find(p => p.type === 'year')?.value || '';
        const month = parts.find(p => p.type === 'month')?.value || '';
        const day = parts.find(p => p.type === 'day')?.value || '';
        const hour = parts.find(p => p.type === 'hour')?.value || '00';
        const minute = parts.find(p => p.type === 'minute')?.value || '00';
        
        return {
            date: `${year}-${month}-${day}`,
            hour: hour,
            minute: minute
        };
    };

    // Tarih ve saat değerlerinden Date objesi oluştur
    const createDateFromDateAndTime = (dateStr: string, hourStr: string, minuteStr: string): Date | null => {
        if (!dateStr || !hourStr || !minuteStr) return null;
        
        const [year, month, day] = dateStr.split('-').map(Number);
        const hours = parseInt(hourStr, 10);
        const minutes = parseInt(minuteStr, 10);
        
        if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
            return null;
        }
        
        // Türkiye saat dilimine göre Date oluştur
        // YYYY-MM-DDTHH:mm:ss formatında string oluştur
        const dateString = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
        
        // Türkiye saat dilimi (UTC+3) için Date oluştur
        // Date objesi UTC'de saklanır, bu yüzden Türkiye saatini UTC'ye çevir
        const tempDate = new Date(dateString);
        const localOffset = tempDate.getTimezoneOffset() * 60 * 1000; // Local timezone offset (dakika cinsinden)
        const turkishOffset = 3 * 60 * 60 * 1000; // Türkiye UTC+3 (3 saat = 10800000 ms)
        const utcTime = tempDate.getTime() - localOffset - turkishOffset;
        
        const turkishDate = new Date(utcTime);
        
        return isNaN(turkishDate.getTime()) ? null : turkishDate;
    };

    // formData.startDate değiştiğinde dateValue, hourValue ve minuteValue'yu güncelle
    useEffect(() => {
        if (formData.startDate) {
            const startDate = typeof formData.startDate === 'string' ? new Date(formData.startDate) : formData.startDate;
            const { date, hour, minute } = getDateAndTimeFromDate(startDate);
            setDateValue(date);
            setHourValue(hour);
            setMinuteValue(minute);
        } else {
            setDateValue('');
            setHourValue('00');
            setMinuteValue('00');
        }
    }, [formData.startDate]);

    // Tarih değiştiğinde
    const handleDateChange = (value: string) => {
        setDateValue(value);
        const newDate = createDateFromDateAndTime(value, hourValue, minuteValue);
        if (newDate) {
            handleChange('startDate', newDate.toISOString());
        }
    };

    // Saat değiştiğinde
    const handleHourChange = (value: SelectValueType | SelectValues) => {
        // SelectValue | SelectValues tipini handle et
        const hourStr = Array.isArray(value) ? String(value[0]) : String(value);
        setHourValue(hourStr);
        const newDate = createDateFromDateAndTime(dateValue, hourStr, minuteValue);
        if (newDate) {
            handleChange('startDate', newDate.toISOString());
        }
    };

    // Dakika değiştiğinde
    const handleMinuteChange = (value: SelectValueType | SelectValues) => {
        // SelectValue | SelectValues tipini handle et
        const minuteStr = Array.isArray(value) ? String(value[0]) : String(value);
        setMinuteValue(minuteStr);
        const newDate = createDateFromDateAndTime(dateValue, hourValue, minuteStr);
        if (newDate) {
            handleChange('startDate', newDate.toISOString());
        }
    };

    // Saat ve dakika seçenekleri oluştur (24 saat formatı)
    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));



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
                                value={formData.brandId || ''}
                            >
                                <SelectTrigger className={errors.brandId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Marka seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {brands.filter(b => b.id).map((brand) => (
                                            <SelectItem key={brand.id} value={brand.id!}>
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
                                value={formData.branchId || ''}
                                disabled={!formData.brandId}
                            >
                                <SelectTrigger className={errors.branchId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Şube seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {branches.filter(b => b.id).map((branch) => (
                                            <SelectItem key={branch.id} value={branch.id!}>
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
                                value={(formData.examTemplate as string) || ''}
                            >
                                <SelectTrigger className={errors.examTemplate ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Sınav şablonu seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Object.values(EExamType).map((examType) => (
                                            <SelectItem key={examType} value={examType}>
                                                {examTypeConverter(examType)}
                                            </SelectItem>
                                        ))}
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
                            <div className="flex gap-2 items-center">
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={dateValue}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    className={errors.startDate ? 'border-red-500' : ''}
                                    lang="tr"
                                />
                                <div className="flex items-center gap-1">
                                    <Select
                                        value={hourValue}
                                        onValueChange={handleHourChange}
                                    >
                                        <SelectTrigger className={`w-20 ${errors.startDate ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Saat" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {hours.map((hour) => (
                                                <SelectItem key={hour} value={hour}>
                                                    {hour}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <span className="text-gray-500">:</span>
                                    <Select
                                        value={minuteValue}
                                        onValueChange={handleMinuteChange}
                                    >
                                        <SelectTrigger className={`w-20 ${errors.startDate ? 'border-red-500' : ''}`}>
                                            <SelectValue placeholder="Dakika" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {minutes.map((minute) => (
                                                <SelectItem key={minute} value={minute}>
                                                    {minute}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
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
                                        checked={(formData.supervisorIds || []).includes(supervisor.id || '')}
                                        onChange={() => handleSupervisorToggle(supervisor.id || '')}
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