'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateBrandRequest, UpdateBrandRequest, BrandDto } from "@/types/management/brand";

interface BrandFormData {
    name: string;
    code: string;
    description: string;
    logo: string;
    website: string;
    email: string;
    phone: string;
    address: string;
    taxNumber: string;
    taxOffice: string;
}

interface BrandFormErrors {
    name?: string;
    code?: string;
    description?: string;
    email?: string;
    website?: string;
    phone?: string;
    taxNumber?: string;
}

interface BrandFormProps {
    onSubmit: (data: CreateBrandRequest | UpdateBrandRequest) => void;
    brand?: BrandDto | null;
    loading?: boolean;
}

const BrandForm: React.FC<BrandFormProps> = ({
                                                 onSubmit,
                                                 brand,
                                                 loading = false
                                             }) => {
    const [formData, setFormData] = useState<BrandFormData>({
        name: '',
        code: '',
        description: '',
        logo: '',
        website: '',
        email: '',
        phone: '',
        address: '',
        taxNumber: '',
        taxOffice: ''
    });

    const [errors, setErrors] = useState<BrandFormErrors>({});

    useEffect(() => {
        if (brand) {
            setFormData({
                name: brand.name || '',
                code: brand.code || '',
                description: brand.description || '',
                logo: brand.logo || '',
                website: brand.website || '',
                email: brand.email || '',
                phone: brand.phone || '',
                address: brand.address || '',
                taxNumber: brand.taxNumber || '',
                taxOffice: brand.taxOffice || ''
            });
        }
    }, [brand]);

    const handleChange = <T extends keyof BrandFormData>(
        name: T,
        value: BrandFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: BrandFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Marka adı zorunludur';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Marka adı en az 2 karakter olmalıdır';
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Marka kodu zorunludur';
        } else if (formData.code.trim().length < 2) {
            newErrors.code = 'Marka kodu en az 2 karakter olmalıdır';
        } else if (!/^[A-Z0-9_-]+$/i.test(formData.code.trim())) {
            newErrors.code = 'Marka kodu sadece harf, rakam, tire ve alt çizgi içerebilir';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Geçersiz e-posta formatı';
        }

        if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
            newErrors.website = 'Website URL\'si http:// veya https:// ile başlamalıdır';
        }

        if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
            newErrors.phone = 'Geçersiz telefon formatı';
        }

        if (formData.taxNumber && !/^\d{10,11}$/.test(formData.taxNumber.replace(/\s/g, ''))) {
            newErrors.taxNumber = 'Vergi numarası 10 veya 11 haneli olmalıdır';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const submitData = {
                name: formData.name.trim(),
                code: formData.code.trim().toUpperCase(),
                description: formData.description.trim() || undefined,
                logo: formData.logo.trim() || undefined,
                website: formData.website.trim() || undefined,
                email: formData.email.trim() || undefined,
                phone: formData.phone.trim() || undefined,
                address: formData.address.trim() || undefined,
                taxNumber: formData.taxNumber.trim() || undefined,
                taxOffice: formData.taxOffice.trim() || undefined
            };

            onSubmit(submitData);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {brand ? "Marka Güncelle" : "Yeni Marka Oluştur"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Marka Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Marka Adı *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Marka adını giriniz"
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Marka Kodu */}
                        <div className="space-y-2">
                            <Label htmlFor="code">Marka Kodu *</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                                className={errors.code ? 'border-red-500' : ''}
                                placeholder="Marka kodunu giriniz"
                            />
                            {errors.code && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.code}</AlertDescription>
                                </Alert>
                            )}
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
                                placeholder="ornek@firma.com"
                            />
                            {errors.email && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.email}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Telefon */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className={errors.phone ? 'border-red-500' : ''}
                                placeholder="+90 212 555 0000"
                            />
                            {errors.phone && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.phone}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Website */}
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                value={formData.website}
                                onChange={(e) => handleChange('website', e.target.value)}
                                className={errors.website ? 'border-red-500' : ''}
                                placeholder="https://www.ornek.com"
                            />
                            {errors.website && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.website}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Logo */}
                        <div className="space-y-2">
                            <Label htmlFor="logo">Logo URL</Label>
                            <Input
                                id="logo"
                                value={formData.logo}
                                onChange={(e) => handleChange('logo', e.target.value)}
                                placeholder="Logo dosya yolu"
                            />
                        </div>

                        {/* Vergi Numarası */}
                        <div className="space-y-2">
                            <Label htmlFor="taxNumber">Vergi Numarası</Label>
                            <Input
                                id="taxNumber"
                                value={formData.taxNumber}
                                onChange={(e) => handleChange('taxNumber', e.target.value)}
                                className={errors.taxNumber ? 'border-red-500' : ''}
                                placeholder="1234567890"
                            />
                            {errors.taxNumber && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.taxNumber}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Vergi Dairesi */}
                        <div className="space-y-2">
                            <Label htmlFor="taxOffice">Vergi Dairesi</Label>
                            <Input
                                id="taxOffice"
                                value={formData.taxOffice}
                                onChange={(e) => handleChange('taxOffice', e.target.value)}
                                placeholder="Vergi dairesi adı"
                            />
                        </div>
                    </div>

                    {/* Açıklama */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="min-h-[100px]"
                            placeholder="Marka hakkında açıklama giriniz"
                        />
                    </div>

                    {/* Adres */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Adres</Label>
                        <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="min-h-[80px]"
                            placeholder="Marka adresi giriniz"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "İşleniyor..." : brand ? "Marka Güncelle" : "Marka Oluştur"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BrandForm;