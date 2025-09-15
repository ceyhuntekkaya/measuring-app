'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Clock, Building, Globe, Mail, Phone, MapPin, FileText, Hash, CheckCircle, XCircle} from 'lucide-react';
import {BrandDto} from '@/types/management/brand';
import { formatDate } from '@/utils/date-formater';
import LoadingComp from "@/components/ui/loading-comp";

interface BrandDetailProps {
    brand: BrandDto;
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onViewBranches?: () => void;
}

const BrandDetailPage: React.FC<BrandDetailProps> = ({
                                                         brand,
                                                         isLoading = false,
                                                         onEdit,
                                                         onDelete,
                                                         onViewBranches,
                                                     }) => {
    const [activeTab, setActiveTab] = useState("details");

    if (isLoading) {
        return (
            <LoadingComp/>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Marka Detayı</h1>
                    <p className="text-gray-500">{brand.name} ({brand.code})</p>
                </div>
                <div className="flex space-x-3">
                    {onEdit && (
                        <Button variant="outline" onClick={onEdit}>
                            Düzenle
                        </Button>
                    )}
                    {onViewBranches && (
                        <Button variant="outline" onClick={onViewBranches}>
                            Şubeleri Görüntüle
                        </Button>
                    )}
                    {onDelete && (
                        <Button variant="outline" onClick={onDelete}>
                            Sil
                        </Button>
                    )}
                </div>
            </div>

            {/* Basit Sekme Navigasyonu */}
            <div className="border-b border-gray-200">
                <nav className="flex -mb-px space-x-8">
                    <button
                        onClick={() => setActiveTab("details")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "details"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Marka Bilgileri
                    </button>
                    <button
                        onClick={() => setActiveTab("contact")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "contact"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        İletişim Bilgileri
                    </button>
                    <button
                        onClick={() => setActiveTab("activity")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "activity"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Kayıt Aktiviteleri
                    </button>
                </nav>
            </div>

            {/* Sekme İçeriği */}
            <div className="mt-6">
                {/* Marka Bilgileri Sekmesi */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Temel Bilgiler</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 p-3 rounded-full">
                                        <Building className="h-6 w-6 text-gray-500"/>
                                    </div>
                                    <div>
                                        <p className="font-medium">{brand.name}</p>
                                        <p className="text-sm text-gray-500">Marka Adı</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Marka Kodu</p>
                                        <div className="flex items-center space-x-2">
                                            <Hash className="h-4 w-4 text-gray-400"/>
                                            <p className="font-medium">{brand.code}</p>
                                        </div>
                                    </div>
                                </div>

                                {brand.description && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Açıklama</p>
                                        <div className="flex items-start space-x-2">
                                            <FileText className="h-4 w-4 text-gray-400 mt-1"/>
                                            <p className="font-medium text-sm leading-relaxed">{brand.description}</p>
                                        </div>
                                    </div>
                                )}

                                {brand.logo && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Logo</p>
                                        <img
                                            src={brand.logo}
                                            alt={`${brand.name} Logo`}
                                            className="h-16 w-auto object-contain border rounded"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Kayıt Durumu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        {brand.status === 'ACTIVE' ? (
                                            <CheckCircle className="h-5 w-5 text-green-500"/>
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500"/>
                                        )}
                                        <span>Durum</span>
                                    </div>
                                    <Badge
                                        className={brand.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-800'
                                            : brand.status === 'DELETED'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-800'}>
                                        {brand.status === 'ACTIVE' ? 'Aktif' :
                                            brand.status === 'DELETED' ? 'Silinmiş' :
                                                brand.status || 'Bilinmeyen'}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-blue-500"/>
                                        <span>Oluşturulma Tarihi</span>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {formatDate(brand.createdAt)}
                                    </p>
                                </div>

                                {brand.deletedAt && (
                                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <XCircle className="h-5 w-5 text-red-500"/>
                                            <span>Silinme Tarihi</span>
                                        </div>
                                        <p className="text-sm font-medium text-red-600">
                                            {formatDate(brand.deletedAt)}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* İletişim Bilgileri Sekmesi */}
                {activeTab === "contact" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>İletişim</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {brand.website && (
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-100 p-3 rounded-full">
                                            <Globe className="h-6 w-6 text-gray-500"/>
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <a
                                                    href={brand.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    {brand.website}
                                                </a>
                                            </p>
                                            <p className="text-sm text-gray-500">Web Sitesi</p>
                                        </div>
                                    </div>
                                )}

                                {brand.email && (
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-100 p-3 rounded-full">
                                            <Mail className="h-6 w-6 text-gray-500"/>
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <a
                                                    href={`mailto:${brand.email}`}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    {brand.email}
                                                </a>
                                            </p>
                                            <p className="text-sm text-gray-500">E-posta</p>
                                        </div>
                                    </div>
                                )}

                                {brand.phone && (
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-100 p-3 rounded-full">
                                            <Phone className="h-6 w-6 text-gray-500"/>
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <a
                                                    href={`tel:${brand.phone}`}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    {brand.phone}
                                                </a>
                                            </p>
                                            <p className="text-sm text-gray-500">Telefon</p>
                                        </div>
                                    </div>
                                )}

                                {brand.address && (
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-gray-100 p-3 rounded-full">
                                            <MapPin className="h-6 w-6 text-gray-500"/>
                                        </div>
                                        <div>
                                            <p className="font-medium">{brand.address}</p>
                                            <p className="text-sm text-gray-500">Adres</p>
                                        </div>
                                    </div>
                                )}

                                {!brand.website && !brand.email && !brand.phone && !brand.address && (
                                    <p className="text-gray-500 italic text-center py-4">
                                        İletişim bilgisi bulunmamaktadır.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Vergi Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {brand.taxNumber && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Vergi Numarası</p>
                                        <p className="font-medium">{brand.taxNumber}</p>
                                    </div>
                                )}

                                {brand.taxOffice && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Vergi Dairesi</p>
                                        <p className="font-medium">{brand.taxOffice}</p>
                                    </div>
                                )}

                                {!brand.taxNumber && !brand.taxOffice && (
                                    <p className="text-gray-500 italic text-center py-4">
                                        Vergi bilgisi bulunmamaktadır.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Kayıt Aktiviteleri Sekmesi */}
                {activeTab === "activity" && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Kayıt Zaman Çizelgesi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex">
                                        <div className="mr-4 flex-shrink-0">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600">
                                                <Building className="h-5 w-5"/>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Marka Oluşturuldu</p>
                                            <p className="text-sm text-gray-500">{formatDate(brand.createdAt || '')}</p>
                                            {brand.createdById && (
                                                <p className="text-xs text-gray-400">Oluşturan ID: {brand.createdById}</p>
                                            )}
                                        </div>
                                    </div>

                                    {brand.status === 'DELETED' && brand.deletedAt && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 text-red-600">
                                                    <XCircle className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Marka Silindi</p>
                                                <p className="text-sm text-gray-500">{formatDate(brand.deletedAt)}</p>
                                                {brand.deletedById && (
                                                    <p className="text-xs text-gray-400">Silen ID: {brand.deletedById}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Marka Durumu</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-gray-50 rounded-md">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Mevcut Durum</span>
                                            <Badge className={
                                                brand.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : brand.status === 'DELETED'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-gray-100 text-gray-800'
                                            }>
                                                {brand.status === 'ACTIVE' ? 'Aktif' :
                                                    brand.status === 'DELETED' ? 'Silinmiş' :
                                                        brand.status || 'Bilinmeyen'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {brand.status === 'ACTIVE'
                                                ? 'Marka aktif durumda ve işlemler gerçekleştirilebilir.'
                                                : brand.status === 'DELETED'
                                                    ? 'Marka silinmiş durumda. Geri yükleme için yöneticiye başvurun.'
                                                    : 'Marka durumu belirsiz.'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandDetailPage;