'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CandidateFormData, CandidateDto} from "@/types/management/brand";
import {EStatus} from "@/types/exam/enum";
import {ExamSessionDto} from "@/types/exam/examEntities";
import {ExamTypeDto} from "@/types/exam/examTemplates";


interface CandidateFormErrors {
    username?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
    lastName?: string;
    identityNumber?: string;
    mobilePhone?: string;
    email?: string;
    birthDate?: string;
    examTypeId?: string,
    examSessionId?: string
}

interface CandidateFormProps {
    onSubmit: (data: CandidateFormData) => void;
    candidate?: CandidateDto | null;
    loading?: boolean;
    mode?: 'create' | 'update';
    examSessions: ExamSessionDto[];
    examTypes: ExamTypeDto[];
}

const CandidateForm: React.FC<CandidateFormProps> = ({
                                                         onSubmit,
                                                         candidate,
                                                         loading = false,
                                                         mode = 'create',
                                                         examSessions = [],
                                                         examTypes = []
                                                     }) => {
    const [formData, setFormData] = useState<CandidateFormData>({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        lastName: '',
        identityNumber: '',
        mobilePhone: '',
        gsmPhone: '',
        email: '',
        address: '',
        country: 'Türkiye',
        city: '',
        mainTongue: 'Türkçe',
        fatherName: '',
        birthPlace: '',
        birthDate: '',
        photoUrl: '',

        id: '',
        createdAt: new Date(),
        deletedAt: null,
        status: EStatus.ACTIVE,
        createdById: '',
        deletedById: '',
        examTypeId: '',
        examSessionId: ''
    });
    const [errors, setErrors] = useState<CandidateFormErrors>({});
    const [showPassword, setShowPassword] = useState(false);

    function toISODateString(dateStr: string | null): string {
        if (!dateStr) return '';
        // "2009-09-15 00:00:00.0" -> "2009-09-15T00:00:00"
        const cleaned = dateStr.replace(' ', 'T').replace(/\.0$/, '');
        const d = new Date(cleaned);
        return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
    }


    useEffect(() => {



        if (candidate && mode === 'update') {

            console.log(candidate)
            setFormData({

                id: candidate.id || '',
                createdAt: candidate.createdAt || new Date(),
                deletedAt: candidate.deletedAt || null,
                status: candidate.status,
                createdById: candidate.createdById || null,
                deletedById: candidate.deletedById || null,


                username: candidate.username || '',
                password: '', // Never populate password fields
                confirmPassword: '',
                name: candidate.name || '',
                lastName: candidate.lastName || '',
                identityNumber: candidate.identityNumber || '',
                mobilePhone: candidate.mobilePhone || '',
                gsmPhone: candidate.gsmPhone || '',
                email: candidate.email || '',
                address: candidate.address || '',
                country: candidate.country || 'Türkiye',
                city: candidate.city || '',
                mainTongue: candidate.mainTongue || 'Türkçe',
                fatherName: candidate.fatherName || '',
                birthPlace: candidate.birthPlace || '',
                birthDate: toISODateString(candidate.birthDate || ''),
                photoUrl: candidate.photoUrl || '',

                examTypeId: candidate.examSession?.examType.id,
                examSessionId: candidate.examSessionId || ''
            });
        }
    }, [candidate, mode]);

    // Auto-generate username based on name and lastname
    useEffect(() => {
        if (mode === 'create' && formData.name && formData.lastName && !formData.username) {
            const baseUsername = `${formData.name.toLowerCase()}.${formData.lastName.toLowerCase()}`.replace(/[^a-z.]/g, '');
            setFormData(prev => ({
                ...prev,
                username: baseUsername
            }));
        }
    }, [formData.name, formData.lastName, mode]);

    const handleChange = <T extends keyof CandidateFormData>(
        name: T,
        value: CandidateFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: CandidateFormErrors = {};

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Kullanıcı adı zorunludur';
        } else if (formData.username.trim().length < 3) {
            newErrors.username = 'Kullanıcı adı en az 3 karakter olmalıdır';
        } else if (!/^[a-zA-Z0-9._@-]+$/.test(formData.username.trim())) {
            newErrors.username = 'Kullanıcı adı sadece harf, rakam, @, nokta, tire ve alt çizgi içerebilir';
        }


        // Password validation (only for create mode)
        if (mode === 'create') {
            if (!formData.password) {
                newErrors.password = 'Şifre zorunludur';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Şifre en az 6 karakter olmalıdır';
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Şifre tekrarı zorunludur';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Şifreler eşleşmiyor';
            }
        }

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Ad zorunludur';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Ad en az 2 karakter olmalıdır';
        }

        // Last name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Soyad zorunludur';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Soyad en az 2 karakter olmalıdır';
        }

        // Identity number validation
        if (!formData.identityNumber.trim()) {
            newErrors.identityNumber = 'TC Kimlik No zorunludur';
        } else if (!/^\d{11}$/.test(formData.identityNumber.trim())) {
            newErrors.identityNumber = 'TC Kimlik No 11 haneli sayı olmalıdır';
        }

        // Mobile phone validation
        if (formData.mobilePhone && !formData.mobilePhone.trim()) {
            newErrors.mobilePhone = 'Cep telefonu zorunludur';
        } else if (formData.mobilePhone && !/^[\d\s\-\+\(\)]+$/.test(formData.mobilePhone)) {
            newErrors.mobilePhone = 'Geçersiz telefon formatı';
        }

        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Geçersiz e-posta formatı';
        }

        // Birth date validation
        if (formData.birthDate) {
            const birthDate = new Date(formData.birthDate);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();

            if (birthDate > today) {
                newErrors.birthDate = 'Doğum tarihi gelecekte olamaz';
            } else if (age < 16) {
                newErrors.birthDate = 'Aday en az 16 yaşında olmalıdır';
            } else if (age > 100) {
                newErrors.birthDate = 'Geçersiz doğum tarihi';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();


        console.log(formData.birthDate)
        if (validateForm()) {
            const submitData: CandidateFormData = {

                id: formData.id || '',
                createdAt: formData.createdAt || new Date(),
                deletedAt: formData.deletedAt || null,
                status: formData.status,
                createdById: formData.createdById || null,
                deletedById: formData.deletedById || null,

                password: formData.password,
                identityNumber: formData.identityNumber,
                username: formData.username.trim(),
                name: formData.name.trim(),
                lastName: formData.lastName.trim(),
                mobilePhone: formData.mobilePhone,
                gsmPhone: formData.gsmPhone,
                email: formData.email,
                address: formData.address,
                country: formData.country,
                city: formData.city,
                mainTongue: formData.mainTongue,
                fatherName: formData.fatherName,
                birthPlace: formData.birthPlace,
                birthDate: formData.birthDate
                    ? new Date(formData.birthDate + 'T00:00:00').toISOString()
                    : '',
                photoUrl: formData.photoUrl,
                examTypeId: formData.examTypeId,
                examSessionId: formData.examSessionId
            };

            if (mode === 'create') {
                (submitData as CandidateFormData).password = formData.password;
                (submitData as CandidateFormData).identityNumber = formData.identityNumber.trim();
            }

            onSubmit(submitData);
        }
    };

    const countries = ['Türkiye', 'Almanya', 'Fransa', 'İngiltere', 'Amerika', 'Diğer'];
    const languages = ['Türkçe', 'İngilizce', 'Almanca', 'Fransızca', 'Arapça', 'Diğer'];

    return (

        <>


            <Card>
                <CardHeader>
                    <CardTitle>
                        Oturum Seçimi
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <div className="grid grid-cols-2 gap-4">
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

                                <div className="space-y-2">
                                    <Label htmlFor="examSessionId">Oturumlar *</Label>
                                    <Select
                                        onValueChange={(value) => handleChange('examSessionId', value as string)}
                                        value={formData.examSessionId || ''}
                                    >
                                        <SelectTrigger className={errors.examSessionId ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Sınav tipi seçin"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {examSessions.map(examSession => (
                                                    examSession.examType.id === formData.examTypeId && (
                                                        <SelectItem key={examSession.id} value={examSession.id || ''}>
                                                            {examSession.name}
                                                        </SelectItem>
                                                    )))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.examSessionId && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.examSessionId}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>


                            </div>
                        </div>

                    </div>
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>
                        {mode === 'update' ? "Aday Güncelle" : "Yeni Aday Oluştur"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Kimlik Bilgileri */}
                        <div>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Ad */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Ad *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                        placeholder="Adınızı giriniz"
                                    />
                                    {errors.name && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.name}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Soyad */}
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Soyad *</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => handleChange('lastName', e.target.value)}
                                        className={errors.lastName ? 'border-red-500' : ''}
                                        placeholder="Soyadınızı giriniz"
                                    />
                                    {errors.lastName && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.lastName}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* TC Kimlik No */}
                                <div className="space-y-2">
                                    <Label htmlFor="identityNumber">TC Kimlik No *</Label>
                                    <Input
                                        id="identityNumber"
                                        value={formData.identityNumber}
                                        onChange={(e) => handleChange('identityNumber', e.target.value)}
                                        className={errors.identityNumber ? 'border-red-500' : ''}
                                        placeholder="12345678901"
                                        maxLength={11}
                                        disabled={mode === 'update'}
                                    />
                                    {errors.identityNumber && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.identityNumber}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Doğum Tarihi */}
                                <div className="space-y-2">
                                    <Label htmlFor="birthDate">Doğum Tarihi</Label>
                                    <Input
                                        id="birthDate"
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => handleChange('birthDate', e.target.value)}
                                        className={errors.birthDate ? 'border-red-500' : ''}
                                        max={new Date(Date.now() - 16 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                    />
                                    {errors.birthDate && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.birthDate}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Baba Adı */}
                                <div className="space-y-2">
                                    <Label htmlFor="fatherName">Baba Adı</Label>
                                    <Input
                                        id="fatherName"
                                        value={formData.fatherName}
                                        onChange={(e) => handleChange('fatherName', e.target.value)}
                                        placeholder="Baba adını giriniz"
                                    />
                                </div>

                                {/* Doğum Yeri */}
                                <div className="space-y-2">
                                    <Label htmlFor="birthPlace">Doğum Yeri</Label>
                                    <Input
                                        id="birthPlace"
                                        value={formData.birthPlace}
                                        onChange={(e) => handleChange('birthPlace', e.target.value)}
                                        placeholder="Doğum yerini giriniz"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Hesap Bilgileri */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Hesap Bilgileri</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Kullanıcı Adı */}
                                <div className="space-y-2">
                                    <Label htmlFor="username">Kullanıcı Adı *</Label>
                                    <Input
                                        id="username"
                                        value={formData.username}
                                        onChange={(e) => handleChange('username', e.target.value)}
                                        className={errors.username ? 'border-red-500' : ''}
                                        placeholder="Kullanıcı adını giriniz"
                                    />
                                    {errors.username && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.username}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {mode === 'create' && (
                                    <>
                                        {/* Şifre */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Şifre *</Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={(e) => handleChange('password', e.target.value)}
                                                    className={errors.password ? 'border-red-500' : ''}
                                                    placeholder="Şifrenizi giriniz"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? "Gizle" : "Göster"}
                                                </Button>
                                            </div>
                                            {errors.password && (
                                                <Alert variant="destructive">
                                                    <AlertDescription>{errors.password}</AlertDescription>
                                                </Alert>
                                            )}
                                        </div>

                                        {/* Şifre Tekrarı */}
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="confirmPassword">Şifre Tekrarı *</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={formData.confirmPassword as string}
                                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                                className={errors.confirmPassword ? 'border-red-500' : ''}
                                                placeholder="Şifrenizi tekrar giriniz"
                                            />
                                            {errors.confirmPassword && (
                                                <Alert variant="destructive">
                                                    <AlertDescription>{errors.confirmPassword}</AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* İletişim Bilgileri */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">İletişim Bilgileri</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Cep Telefonu */}
                                <div className="space-y-2">
                                    <Label htmlFor="mobilePhone">Cep Telefonu *</Label>
                                    <Input
                                        id="mobilePhone"
                                        value={formData.mobilePhone}
                                        onChange={(e) => handleChange('mobilePhone', e.target.value)}
                                        className={errors.mobilePhone ? 'border-red-500' : ''}
                                        placeholder="+90 555 123 4567"
                                    />
                                    {errors.mobilePhone && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.mobilePhone}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* GSM Telefonu */}
                                <div className="space-y-2">
                                    <Label htmlFor="gsmPhone">GSM Telefonu</Label>
                                    <Input
                                        id="gsmPhone"
                                        value={formData.gsmPhone}
                                        onChange={(e) => handleChange('gsmPhone', e.target.value)}
                                        placeholder="+90 555 987 6543"
                                    />
                                </div>

                                {/* E-posta */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-posta</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className={errors.email ? 'border-red-500' : ''}
                                        placeholder="ornek@email.com"
                                    />
                                    {errors.email && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{errors.email}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Lokasyon Bilgileri */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Lokasyon Bilgileri</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Ülke */}
                                <div className="space-y-2">
                                    <Label htmlFor="country">Ülke</Label>
                                    <Select
                                        onValueChange={(value) => handleChange('country', value as string)}
                                        value={formData.country || ''}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Ülke seçin"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {countries.map((country) => (
                                                    <SelectItem key={country} value={country}>
                                                        {country}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Şehir */}
                                <div className="space-y-2">
                                    <Label htmlFor="city">Şehir</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => handleChange('city', e.target.value)}
                                        placeholder="Şehir adını giriniz"
                                    />
                                </div>

                                {/* Ana Dil */}
                                <div className="space-y-2">
                                    <Label htmlFor="mainTongue">Ana Dil</Label>
                                    <Select
                                        onValueChange={(value) => handleChange('mainTongue', value as string)}
                                        value={formData.mainTongue || ''}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Ana dil seçin"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {languages.map((language) => (
                                                    <SelectItem key={language} value={language}>
                                                        {language}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Fotoğraf URL */}
                                <div className="space-y-2">
                                    <Label htmlFor="photoUrl">Fotoğraf URL</Label>
                                    <Input
                                        id="photoUrl"
                                        value={formData.photoUrl}
                                        onChange={(e) => handleChange('photoUrl', e.target.value)}
                                        placeholder="Fotoğraf bağlantısını giriniz"
                                    />
                                </div>
                            </div>

                            {/* Adres */}
                            <div className="space-y-2 mt-4">
                                <Label htmlFor="address">Adres</Label>
                                <Textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    className="min-h-[80px]"
                                    placeholder="Adres bilgilerini giriniz"
                                />
                            </div>
                        </div>

                        {/* Bilgi Mesajları */}
                        {mode === 'create' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800">
                                            Aday Oluşturma Bilgileri
                                        </h3>
                                        <div className="mt-2 text-sm text-blue-700">
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>TC Kimlik No oluşturulduktan sonra değiştirilemez</li>
                                                <li>Kullanıcı adı ad ve soyada göre otomatik oluşturulur</li>
                                                <li>Güvenli bir şifre oluşturun (en az 6 karakter)</li>
                                                <li>E-posta adresi sistem bildirimleri için kullanılır</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {mode === 'update' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800">
                                            Güncelleme Bilgileri
                                        </h3>
                                        <div className="mt-2 text-sm text-yellow-700">
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>TC Kimlik No değiştirilemez</li>
                                                <li>Şifre değişikliği için ayrı form kullanın</li>
                                                <li>E-posta değişikliği sistem bildirimlerini etkiler</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form Özeti */}
                        {(formData.name && formData.lastName && formData.identityNumber) && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">Aday Özeti</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <span
                                            className="font-medium">Ad Soyad:</span> {formData.name} {formData.lastName}
                                    </div>
                                    <div>
                                        <span className="font-medium">TC Kimlik:</span> {formData.identityNumber}
                                    </div>
                                    <div>
                                        <span className="font-medium">Kullanıcı Adı:</span> {formData.username}
                                    </div>
                                    <div>
                                        <span className="font-medium">Telefon:</span> {formData.mobilePhone}
                                    </div>
                                    {formData.email && (
                                        <div>
                                            <span className="font-medium">E-posta:</span> {formData.email}
                                        </div>
                                    )}
                                    {formData.city && formData.country && (
                                        <div>
                                            <span
                                                className="font-medium">Lokasyon:</span> {formData.city}, {formData.country}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <Button
                                onClick={handleSubmit}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={loading}
                            >
                                {loading ? "İşleniyor..." : mode === 'update' ? "Aday Güncelle" : "Aday Oluştur"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </>
    );
};

export default CandidateForm;