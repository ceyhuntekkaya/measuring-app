'use client';

import React, {useEffect, useState, useMemo} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import type {CandidateDto, CreateCandidateRequest, UpdateCandidateRequest, ExamSessionDto, ExamTypeDto} from "@/api/generated/model";
import {countries, languages} from "@/types/country";
import { usernameCheck } from "../../api/generated/candidate-management/candidate-management";
import { parseBlobResponse } from "@/utils/api-helpers/parse-blob-response";
import {FileUpload} from "@/components/ui/file-upload";




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
    address?: string;
    country?: string;
    city?: string;
    mainTongue?: string;
    fatherName?: string;
    birthPlace?: string;
}

interface CandidateFormProps {
    onSubmit: (data: CreateCandidateRequest | UpdateCandidateRequest) => void;
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
    const [formData, setFormData] = useState<CreateCandidateRequest>({
        username: '',
        password: '',
        name: '',
        lastName: '',
        identityNumber: '',
        mobilePhone: '',
        email: '',
        address: '',
        country: 'Türkiye',
        city: '',
        mainTongue: 'Türkçe',
        fatherName: '',
        birthPlace: '',
        birthDate: '',
        photoUrl: '',
        idCartUrl: '',
        voiceUrl: '',
        examTypeId: '',
        examSessionId: ''
    });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
            setFormData({
                username: candidate.username || '',
                password: '', // Not used in update, but required by type
                name: candidate.name || '',
                lastName: candidate.lastName || '',
                identityNumber: candidate.identityNumber || '',
                mobilePhone: candidate.mobilePhone || '',
                email: candidate.email || '',
                address: candidate.address || '',
                country: candidate.country || 'Türkiye',
                city: candidate.city || '',
                mainTongue: candidate.mainTongue || 'Türkçe',
                fatherName: candidate.fatherName || '',
                birthPlace: candidate.birthPlace || '',
                birthDate: toISODateString(candidate.birthDate || ''),
                photoUrl: candidate.photoUrl || '',
                idCartUrl: candidate.idCartUrl || '',
                voiceUrl: candidate.voiceUrl || '',
                examTypeId: candidate.examSession?.examType?.id,
                examSessionId: candidate.examSessionId || ''
            });
            setPassword('');
            setConfirmPassword('');
        }
    }, [candidate, mode]);

    const toAsciiUsernamePart = (value: string): string => {
        // Türkçe karakterleri de sadeleştir
        const trMap: Record<string, string> = {
            'ç': 'c', 'Ç': 'c',
            'ğ': 'g', 'Ğ': 'g',
            'ı': 'i', 'İ': 'i',
            'ö': 'o', 'Ö': 'o',
            'ş': 's', 'Ş': 's',
            'ü': 'u', 'Ü': 'u'
        };

        return value
            .split('')
            .map((ch) => trMap[ch] ?? ch)
            .join('')
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[^a-z0-9]/g, '');
    };

    // Auto-generate username based on name + lastname and validate/suggest via API.
    useEffect(() => {
        let cancelled = false;

        const run = async (): Promise<void> => {
            if (mode !== 'create') return;
            if (!formData.name.trim() || !formData.lastName.trim()) return;

            const baseUsername =
                `${toAsciiUsernamePart(formData.name)}.${toAsciiUsernamePart(formData.lastName)}`
                    .replace(/\.+/g, '.')
                    .replace(/^\./, '')
                    .replace(/\.$/, '');

            if (!baseUsername || baseUsername.length < 3) return;

            try {
                const res = await usernameCheck(baseUsername);
                const parsed = await parseBlobResponse<{ success?: boolean; data?: string }>(res as unknown as Blob);
                const suggested = (parsed?.data || baseUsername).trim();

                if (cancelled) return;
                setFormData((prev) => ({
                    ...prev,
                    username: suggested
                }));
            } catch {
                if (cancelled) return;
                // API hata verirse en azından base username ile devam et
                setFormData((prev) => ({
                    ...prev,
                    username: prev.username || baseUsername
                }));
            }
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [formData.name, formData.lastName, mode]);

    // Filter sessions by selected exam type (compare as string - API may return id as number)
    const filteredExamSessions = useMemo(() => {
        if (!formData.examTypeId) {
            return [];
        }
        const selectedId = String(formData.examTypeId);
        return examSessions.filter(examSession => {
            const sessionExamTypeId = examSession.examType?.id;
            if (sessionExamTypeId == null || sessionExamTypeId === '') return false;
            return String(sessionExamTypeId) === selectedId;
        });
    }, [examSessions, formData.examTypeId]);

    // Clear exam session when exam type changes
    useEffect(() => {
        if (formData.examTypeId && formData.examSessionId) {
            const selectedSession = examSessions.find(s => s.id === formData.examSessionId);
            const sessionTypeId = selectedSession?.examType?.id;
            const matches = sessionTypeId != null && String(sessionTypeId) === String(formData.examTypeId);
            if (!matches) {
                setFormData(prev => ({
                    ...prev,
                    examSessionId: ''
                }));
            }
        }
    }, [formData.examTypeId, examSessions, formData.examSessionId]);

    const handleChange = <T extends keyof CreateCandidateRequest>(
        name: T,
        value: CreateCandidateRequest[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateIdentityNumber = (rawValue: string): string | null => {
        const value = rawValue.trim();
        if (!value) return 'Kimlik No zorunludur';

        const onlyDigits = /^\d+$/.test(value);
        if (onlyDigits) {
            if (!/^\d{11}$/.test(value)) {
                return 'TC Kimlik No 11 haneli sayı olmalıdır';
            }
            return null;
        }

        // Pasaport no: harf/rakam ve bazı karakterleri kabul edelim
        // (backend tarafı farklı bir kural uygularsa orada da güncellenmeli)
        if (!/^[A-Za-z0-9\-]{5,20}$/.test(value)) {
            return 'Pasaport No geçersiz (5-20 karakter, harf/rakam ve - kabul edilir)';
        }

        return null;
    };

    const validateForm = (): boolean => {
        const newErrors: CandidateFormErrors = {};

        // Exam selection validations
        if (!String(formData.examTypeId || '').trim()) {
            newErrors.examTypeId = 'Sınav tipi zorunludur';
        }
        if (!String(formData.examSessionId || '').trim()) {
            newErrors.examSessionId = 'Oturum seçimi zorunludur';
        }

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
            if (!password) {
                newErrors.password = 'Şifre zorunludur';
            } else if (password.length < 6) {
                newErrors.password = 'Şifre en az 6 karakter olmalıdır';
            }

            if (!confirmPassword) {
                newErrors.confirmPassword = 'Şifre tekrarı zorunludur';
            } else if (password !== confirmPassword) {
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
        const identityError = validateIdentityNumber(formData.identityNumber);
        if (identityError) newErrors.identityNumber = identityError;

        // Mobile phone validation
        if (!formData.mobilePhone || !formData.mobilePhone.trim()) {
            newErrors.mobilePhone = 'Cep telefonu zorunludur';
        } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.mobilePhone.trim())) {
            newErrors.mobilePhone = 'Geçersiz telefon formatı';
        }

        // Email validation
        if (!formData.email || !formData.email.trim()) {
            newErrors.email = 'E-posta zorunludur';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Geçersiz e-posta formatı';
        }

        // Birth date validation
        if (!formData.birthDate) {
            newErrors.birthDate = 'Doğum tarihi zorunludur';
        } else {
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

        // Remaining required fields (gsm + 3 upload alanı hariç tüm alanlar)
        if (!formData.address || !formData.address.trim()) newErrors.address = 'Adres zorunludur';
        if (!formData.country || !formData.country.trim()) newErrors.country = 'Ülke zorunludur';
        if (!formData.city || !formData.city.trim()) newErrors.city = 'Şehir zorunludur';
        if (!formData.mainTongue || !formData.mainTongue.trim()) newErrors.mainTongue = 'Ana dil zorunludur';
        if (!formData.fatherName || !formData.fatherName.trim()) newErrors.fatherName = 'Baba adı zorunludur';
        if (!formData.birthPlace || !formData.birthPlace.trim()) newErrors.birthPlace = 'Doğum yeri zorunludur';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            // Directly use formData - no manual mapping needed!
            const submitData: CreateCandidateRequest | UpdateCandidateRequest = {
                username: formData.username.trim(),
                name: formData.name.trim(),
                lastName: formData.lastName.trim(),
                identityNumber: formData.identityNumber.trim(),
                mobilePhone: formData.mobilePhone.trim(),
                // GSM telefonu formda yok: her zaman null gönder
                gsmPhone: null as unknown as string,
                email: formData.email?.trim(),
                address: formData.address?.trim(),
                country: formData.country?.trim(),
                city: formData.city?.trim(),
                mainTongue: formData.mainTongue?.trim(),
                fatherName: formData.fatherName?.trim(),
                birthPlace: formData.birthPlace?.trim(),
                birthDate: formData.birthDate
                    ? new Date(formData.birthDate + 'T00:00:00').toISOString()
                    : undefined,
                photoUrl: formData.photoUrl,
                idCartUrl: formData.idCartUrl,
                voiceUrl: formData.voiceUrl,
                examTypeId: formData.examTypeId,
                examSessionId: formData.examSessionId
            };

            if (mode === 'create') {
                (submitData as CreateCandidateRequest).password = password;
            }

            onSubmit(submitData);
        }
    };



    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                    {mode === 'update' ? "Aday Güncelle" : "Yeni Aday Oluştur"}
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
                                                        {examType.name}
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
                                        disabled={!formData.examTypeId || filteredExamSessions.length === 0}
                                    >
                                        <SelectTrigger className={errors.examSessionId ? 'border-red-500' : ''}>
                                            <SelectValue placeholder={!formData.examTypeId ? "Önce sınav tipi seçin" : filteredExamSessions.length === 0 ? "Bu sınav tipi için oturum bulunamadı" : "Oturum seçin"}/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredExamSessions.length > 0 && (
                                                <SelectGroup>
                                                    {filteredExamSessions.map(examSession => (
                                                        <SelectItem key={examSession.id} value={examSession.id || ''}>
                                                            {examSession.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            )}
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
               
                <CardContent>
                    <div className="space-y-6">
                        {mode === 'create' && !formData.examSessionId ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="text-sm text-blue-800 font-medium">
                                    Devam etmek için önce <span className="font-semibold">Sınav Tipi</span> ve <span className="font-semibold">Oturum</span> seçin.
                                </div>
                            </div>
                        ) : (
                            <>
                            {/* Bilgi Mesajları */}
                        {mode === 'create' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                       
                                        <div className="mt-2 text-sm text-blue-700">
                                            <ul className="list-disc list-inside grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                                                <li>Kimlik No oluşturulduktan sonra değiştirilemez</li>
                                                <li>Kullanıcı adı ad ve soyada göre otomatik oluşturulur ve değiştirilemez</li>
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

                                {/* 2. satır: ad, soyad, baba adı */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                                    <div className="space-y-2">
                                        <Label htmlFor="fatherName">Baba Adı *</Label>
                                        <Input
                                            id="fatherName"
                                            value={formData.fatherName}
                                            onChange={(e) => handleChange('fatherName', e.target.value)}
                                            placeholder="Baba adını giriniz"
                                            className={errors.fatherName ? 'border-red-500' : ''}
                                        />
                                        {errors.fatherName && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.fatherName}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                </div>

                                {/* 3. satır: kimlik no, doğum tarihi, doğum yeri */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="identityNumber">Kimlik No (TC / Pasaport) *</Label>
                                        <Input
                                            id="identityNumber"
                                            value={formData.identityNumber}
                                            onChange={(e) => handleChange('identityNumber', e.target.value)}
                                            className={errors.identityNumber ? 'border-red-500' : ''}
                                            placeholder="TC: 12345678901 veya Pasaport: U1234567"
                                            maxLength={20}
                                            disabled={mode === 'update'}
                                        />
                                        {errors.identityNumber && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.identityNumber}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="birthDate">Doğum Tarihi *</Label>
                                        <Input
                                            id="birthDate"
                                            type="date"
                                            lang="tr-TR"
                                            value={formData.birthDate || ''}
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

                                    <div className="space-y-2">
                                        <Label htmlFor="birthPlace">Doğum Yeri *</Label>
                                        <Input
                                            id="birthPlace"
                                            value={formData.birthPlace}
                                            onChange={(e) => handleChange('birthPlace', e.target.value)}
                                            placeholder="Doğum yerini giriniz"
                                            className={errors.birthPlace ? 'border-red-500' : ''}
                                        />
                                        {errors.birthPlace && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.birthPlace}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                </div>

                                {/* 4. satır: kullanıcı adı, şifre, şifre tekrarı */}
                                <div className={`grid grid-cols-1 ${mode === 'create' ? 'md:grid-cols-3' : 'md:grid-cols-1'} gap-4`}>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Kullanıcı Adı *</Label>
                                        <Input
                                            id="username"
                                            value={formData.username}
                                            disabled
                                            className={errors.username ? 'border-red-500' : ''}
                                            placeholder="Otomatik oluşturulur"
                                        />
                                        {errors.username && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.username}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    {mode === 'create' && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="password">Şifre *</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
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

                                            <div className="space-y-2">
                                                <Label htmlFor="confirmPassword">Şifre Tekrarı *</Label>
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
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

                                {/* 5. satır: cep telefonu, eposta, anadil */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                                    <div className="space-y-2">
                                        <Label htmlFor="email">E-posta *</Label>
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

                                    <div className="space-y-2">
                                        <Label htmlFor="mainTongue">Ana Dil *</Label>
                                        <Select
                                            onValueChange={(value) => handleChange('mainTongue', value as string)}
                                            value={formData.mainTongue || ''}
                                        >
                                            <SelectTrigger className={errors.mainTongue ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Ana dil seçin"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {languages.map((language) => (
                                                        <SelectItem key={language.code} value={language.name}>
                                                            {language.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {errors.mainTongue && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.mainTongue}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                </div>

                                {/* 6. satır: ülke, şehir, adres */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Ülke *</Label>
                                        <Select
                                            onValueChange={(value) => handleChange('country', value as string)}
                                            value={formData.country || ''}
                                        >
                                            <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Ülke seçin"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {countries.map((country) => (
                                                        <SelectItem key={country.code} value={country.name}>
                                                            {country.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {errors.country && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.country}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city">Şehir *</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => handleChange('city', e.target.value)}
                                            placeholder="Şehir adını giriniz"
                                            className={errors.city ? 'border-red-500' : ''}
                                        />
                                        {errors.city && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.city}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Adres *</Label>
                                        <Textarea
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) => handleChange('address', e.target.value)}
                                            className={`min-h-[80px] ${errors.address ? 'border-red-500' : ''}`}
                                            placeholder="Adres bilgilerini giriniz"
                                        />
                                        {errors.address && (
                                            <Alert variant="destructive">
                                                <AlertDescription>{errors.address}</AlertDescription>
                                            </Alert>
                                        )}
                                    </div>
                                </div>

                                {/* 7. satır: upload alanları */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <FileUpload
                                            acceptedFileTypes={['image']}
                                            maxFileSize={10}
                                            entityId={(candidate?.id || formData.identityNumber || 'candidate_new') as string}
                                            uploadType="photoUrl"
                                            multiple={false}
                                            labelText="Fotoğraf Yükle"
                                            existingFileUrl={formData.photoUrl || ''}
                                            onUploadComplete={(files) => {
                                                if (files && files.length > 0) {
                                                    handleChange('photoUrl', files[0].path ?? '');
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FileUpload
                                            acceptedFileTypes={['image']}
                                            maxFileSize={10}
                                            entityId={(candidate?.id || formData.identityNumber || 'candidate_new') as string}
                                            uploadType="idCartUrl"
                                            multiple={false}
                                            labelText="Kimlik Fotoğrafı Yükle"
                                            existingFileUrl={formData.idCartUrl || ''}
                                            onUploadComplete={(files) => {
                                                if (files && files.length > 0) {
                                                    handleChange('idCartUrl', files[0].path ?? '');
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <FileUpload
                                            acceptedFileTypes={['audio']}
                                            maxFileSize={20}
                                            entityId={(candidate?.id || formData.identityNumber || 'candidate_new') as string}
                                            uploadType="voiceUrl"
                                            multiple={false}
                                            labelText="Ses Kaydı Yükle"
                                            existingFileUrl={formData.voiceUrl || ''}
                                            onUploadComplete={(files) => {
                                                if (files && files.length > 0) {
                                                    handleChange('voiceUrl', files[0].path ?? '');
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </>
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
                                        <span className="font-medium">Kimlik No:</span> {formData.identityNumber}
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