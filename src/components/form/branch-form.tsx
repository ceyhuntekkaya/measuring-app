'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateBranchRequest, UpdateBranchRequest, BranchDto } from "@/types/management/brand";
import { BrandDto } from "@/types/management/brand";

interface BranchFormData {
    branchName: string;
    code: string;
    brandId: string;
}

interface BranchFormErrors {
    branchName?: string;
    code?: string;
    brandId?: string;
}

interface BranchFormProps {
    onSubmit: (data: CreateBranchRequest | UpdateBranchRequest) => void;
    branch?: BranchDto | null;
    brands: BrandDto[];
    loading?: boolean;
}

const BranchForm: React.FC<BranchFormProps> = ({
                                                   onSubmit,
                                                   branch,
                                                   brands,
                                                   loading = false
                                               }) => {
    const [formData, setFormData] = useState<BranchFormData>({
        branchName: '',
        code: '',
        brandId: ''
    });

    const [errors, setErrors] = useState<BranchFormErrors>({});

    useEffect(() => {
        if (branch) {
            setFormData({
                branchName: branch.branchName || '',
                code: branch.code || '',
                brandId: branch.brandId || ''
            });
        }
    }, [branch]);

    const handleChange = <T extends keyof BranchFormData>(
        name: T,
        value: BranchFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: BranchFormErrors = {};

        if (!formData.branchName.trim()) {
            newErrors.branchName = 'Şube adı zorunludur';
        } else if (formData.branchName.trim().length < 2) {
            newErrors.branchName = 'Şube adı en az 2 karakter olmalıdır';
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Şube kodu zorunludur';
        } else if (formData.code.trim().length < 2) {
            newErrors.code = 'Şube kodu en az 2 karakter olmalıdır';
        } else if (!/^[A-Z0-9_-]+$/i.test(formData.code.trim())) {
            newErrors.code = 'Şube kodu sadece harf, rakam, tire ve alt çizgi içerebilir';
        }

        if (!formData.brandId) {
            newErrors.brandId = 'Marka seçimi zorunludur';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const submitData = {
                branchName: formData.branchName.trim(),
                code: formData.code.trim().toUpperCase(),
                brandId: formData.brandId
            };

            onSubmit(submitData);
        }
    };

    const selectedBrand = brands.find(brand => brand.id === formData.brandId);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {branch ? "Şube Güncelle" : "Yeni Şube Oluştur"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Şube Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="branchName">Şube Adı *</Label>
                            <Input
                                id="branchName"
                                value={formData.branchName}
                                onChange={(e) => handleChange('branchName', e.target.value)}
                                className={errors.branchName ? 'border-red-500' : ''}
                                placeholder="Şube adını giriniz"
                            />
                            {errors.branchName && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.branchName}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Şube Kodu */}
                        <div className="space-y-2">
                            <Label htmlFor="code">Şube Kodu *</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                                className={errors.code ? 'border-red-500' : ''}
                                placeholder="Şube kodunu giriniz"
                            />
                            {errors.code && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.code}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    {/* Marka Seçimi */}
                    <div className="space-y-2">
                        <Label htmlFor="brandId">Marka *</Label>
                        <Select
                            onValueChange={(value) => handleChange('brandId', value as string)}
                            value={formData.brandId}
                        >
                            <SelectTrigger className={errors.brandId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Marka seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand.id} value={brand.id}>
                                            {brand.name} ({brand.code})
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

                    {/* Seçilen Marka Bilgileri */}
                    {selectedBrand && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Seçilen Marka Bilgileri</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium">Marka Adı:</span> {selectedBrand.name}
                                </div>
                                <div>
                                    <span className="font-medium">Marka Kodu:</span> {selectedBrand.code}
                                </div>
                                {selectedBrand.email && (
                                    <div>
                                        <span className="font-medium">E-posta:</span> {selectedBrand.email}
                                    </div>
                                )}
                                {selectedBrand.phone && (
                                    <div>
                                        <span className="font-medium">Telefon:</span> {selectedBrand.phone}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bilgi Mesajı */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    Şube Kodu Önemli Bilgi
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p>
                                        Şube kodu oluşturulduktan sonra değiştirilebilir, ancak sistemde kullanılan
                                        tüm referanslar etkilenebilir. Kodu dikkatli seçin.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading || brands.length === 0}
                        >
                            {loading ? "İşleniyor..." : branch ? "Şube Güncelle" : "Şube Oluştur"}
                        </Button>
                    </div>

                    {brands.length === 0 && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                Şube oluşturmak için önce en az bir marka oluşturulması gereklidir.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default BranchForm;