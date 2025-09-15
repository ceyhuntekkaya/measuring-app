'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Clock, User as UserIcon, Phone, Mail, MapPin, Globe, Calendar, IdCard, Key, CheckCircle, XCircle, Camera} from 'lucide-react';
import {CandidateDto} from '@/types/management/brand';
import { formatDate } from '@/utils/date-formater';
import LoadingComp from "@/components/ui/loading-comp";

interface CandidateDetailProps {
    candidate: CandidateDto;
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onResetPassword?: () => void;
    onViewApplications?: () => void;
    onActivate?: () => void;
}

const CandidateDetailPage: React.FC<CandidateDetailProps> = ({
                                                                 candidate,
                                                                 isLoading = false,
                                                                 onEdit,
                                                                 onDelete,
                                                                 onResetPassword,
                                                                 onViewApplications,
                                                                 onActivate,
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
                    <h1 className="text-3xl font-bold tracking-tight">Aday Detayı</h1>
                    <p className="text-gray-500">{candidate.name} {candidate.lastName} ({candidate.username})</p>
                    <p className="text-sm text-gray-400">T.C. Kimlik No: {candidate.identityNumber}</p>
                </div>
                <div className="flex space-x-3">
                    {onEdit && (
                        <Button variant="outline" onClick={onEdit}>
                            Düzenle
                        </Button>
                    )}
                    {onResetPassword && (
                        <Button variant="outline" onClick={onResetPassword}>
                            Şifre Sıfırla
                        </Button>
                    )}
                    {onViewApplications && (
                        <Button variant="outline" onClick={onViewApplications}>
                            Başvurularını Gör
                        </Button>
                    )}
                    {candidate.activationCode && onActivate && (
                        <Button variant="outline" onClick={onActivate}>
                            Hesabı Aktifleştir
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
                        Kişisel Bilgiler
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
                        Hesap Aktiviteleri
                    </button>
                </nav>
            </div>

            {/* Sekme İçeriği */}
            <div className="mt-6">
                {/* Kişisel Bilgiler Sekmesi */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Temel Bilgiler</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 p-3 rounded-full">
                                        {candidate.photoUrl ? (
                                            <img
                                                src={candidate.photoUrl}
                                                alt={`${candidate.name} ${candidate.lastName}`}
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <UserIcon className="h-6 w-6 text-gray-500"/>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">{candidate.name} {candidate.lastName}</p>
                                        <p className="text-sm text-gray-500">Ad Soyad</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Kullanıcı Adı</p>
                                        <p className="font-medium">{candidate.username}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Rol</p>
                                        <Badge className="bg-blue-100 text-blue-800">
                                            {candidate.role || 'CANDIDATE'}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 p-3 rounded-full">
                                        <IdCard className="h-6 w-6 text-gray-500"/>
                                    </div>
                                    <div>
                                        <p className="font-medium">{candidate.identityNumber}</p>
                                        <p className="text-sm text-gray-500">T.C. Kimlik Numarası</p>
                                    </div>
                                </div>

                                {candidate.birthDate && (
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-100 p-3 rounded-full">
                                            <Calendar className="h-6 w-6 text-gray-500"/>
                                        </div>
                                        <div>
                                            <p className="font-medium">{formatDate(candidate.birthDate)}</p>
                                            <p className="text-sm text-gray-500">Doğum Tarihi</p>
                                        </div>
                                    </div>
                                )}

                                {candidate.birthPlace && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Doğum Yeri</p>
                                        <p className="font-medium">{candidate.birthPlace}</p>
                                    </div>
                                )}

                                {candidate.fatherName && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Baba Adı</p>
                                        <p className="font-medium">{candidate.fatherName}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Hesap Durumu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        {candidate.status === 'ACTIVE' ? (
                                            <CheckCircle className="h-5 w-5 text-green-500"/>
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500"/>
                                        )}
                                        <span>Durum</span>
                                    </div>
                                    <Badge
                                        className={candidate.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-800'
                                            : candidate.status === 'DELETED'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-800'}>
                                        {candidate.status === 'ACTIVE' ? 'Aktif' :
                                            candidate.status === 'DELETED' ? 'Silinmiş' :
                                                candidate.status || 'Bilinmeyen'}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <Key className={`h-5 w-5 ${candidate.activationCode ? 'text-yellow-500' : 'text-green-500'}`}/>
                                        <span>Aktivasyon Durumu</span>
                                    </div>
                                    <Badge
                                        className={candidate.activationCode
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-green-100 text-green-800'}>
                                        {candidate.activationCode ? 'Bekliyor' : 'Aktifleştirildi'}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-blue-500"/>
                                        <span>Oluşturulma Tarihi</span>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {formatDate(candidate.createdAt || '')}
                                    </p>
                                </div>

                                {candidate.lastLoginTime && (
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Clock className="h-5 w-5 text-blue-500"/>
                                            <span>Son Giriş</span>
                                        </div>
                                        <p className="text-sm font-medium text-blue-600">
                                            {formatDate(candidate.lastLoginTime)}
                                        </p>
                                    </div>
                                )}

                                {candidate.deletedAt && (
                                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <XCircle className="h-5 w-5 text-red-500"/>
                                            <span>Silinme Tarihi</span>
                                        </div>
                                        <p className="text-sm font-medium text-red-600">
                                            {formatDate(candidate.deletedAt)}
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
                                {candidate.mobilePhone && (
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-100 p-3 rounded-full">
                                            <Phone className="h-6 w-6 text-gray-500"/>
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <a
                                                    href={`tel:${candidate.mobilePhone}`}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    {candidate.mobilePhone}
                                                </a>
                                            </p>
                                            <p className="text-sm text-gray-500">Cep Telefonu</p>
                                        </div>
                                    </div>
                                )}

                                {candidate.gsmPhone && (
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-100 p-3 rounded-full">
                                            <Phone className="h-6 w-6 text-gray-500"/>
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <a
                                                    href={`tel:${candidate.gsmPhone}`}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    {candidate.gsmPhone}
                                                </a>
                                            </p>
                                            <p className="text-sm text-gray-500">GSM Telefonu</p>
                                        </div>
                                    </div>
                                )}

                                {candidate.email && (
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-100 p-3 rounded-full">
                                            <Mail className="h-6 w-6 text-gray-500"/>
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                <a
                                                    href={`mailto:${candidate.email}`}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    {candidate.email}
                                                </a>
                                            </p>
                                            <p className="text-sm text-gray-500">E-posta</p>
                                        </div>
                                    </div>
                                )}

                                {!candidate.mobilePhone && !candidate.gsmPhone && !candidate.email && (
                                    <p className="text-gray-500 italic text-center py-4">
                                        İletişim bilgisi bulunmamaktadır.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Adres ve Konum</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {candidate.address && (
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-gray-100 p-3 rounded-full">
                                            <MapPin className="h-6 w-6 text-gray-500"/>
                                        </div>
                                        <div>
                                            <p className="font-medium">{candidate.address}</p>
                                            <p className="text-sm text-gray-500">Adres</p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    {candidate.city && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Şehir</p>
                                            <p className="font-medium">{candidate.city}</p>
                                        </div>
                                    )}
                                    {candidate.country && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Ülke</p>
                                            <p className="font-medium">{candidate.country}</p>
                                        </div>
                                    )}
                                </div>

                                {candidate.mainTongue && (
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-100 p-3 rounded-full">
                                            <Globe className="h-6 w-6 text-gray-500"/>
                                        </div>
                                        <div>
                                            <p className="font-medium">{candidate.mainTongue}</p>
                                            <p className="text-sm text-gray-500">Ana Dil</p>
                                        </div>
                                    </div>
                                )}

                                {!candidate.address && !candidate.city && !candidate.country && !candidate.mainTongue && (
                                    <p className="text-gray-500 italic text-center py-4">
                                        Adres bilgisi bulunmamaktadır.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Hesap Aktiviteleri Sekmesi */}
                {activeTab === "activity" && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hesap Zaman Çizelgesi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex">
                                        <div className="mr-4 flex-shrink-0">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600">
                                                <UserIcon className="h-5 w-5"/>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Hesap Oluşturuldu</p>
                                            <p className="text-sm text-gray-500">{formatDate(candidate.createdAt || '')}</p>
                                            {candidate.createdById && (
                                                <p className="text-xs text-gray-400">Oluşturan ID: {candidate.createdById}</p>
                                            )}
                                        </div>
                                    </div>

                                    {candidate.lastLoginTime && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600">
                                                    <Clock className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Son Giriş</p>
                                                <p className="text-sm text-gray-500">{formatDate(candidate.lastLoginTime)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {candidate.status === 'DELETED' && candidate.deletedAt && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 text-red-600">
                                                    <XCircle className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Hesap Silindi</p>
                                                <p className="text-sm text-gray-500">{formatDate(candidate.deletedAt)}</p>
                                                {candidate.deletedById && (
                                                    <p className="text-xs text-gray-400">Silen ID: {candidate.deletedById}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Aktivasyon Durumu</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-gray-50 rounded-md">
                                    {candidate.activationCode ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Aktivasyon Kodu</span>
                                                <Badge className="bg-yellow-100 text-yellow-800">Onay Bekliyor</Badge>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Aday hesabını henüz aktifleştirmemiş. Aktivasyon kodu mevcut.
                                            </p>
                                            <div className="flex justify-end space-x-2">
                                                <Button variant="outline" size="sm">
                                                    Aktivasyon Kodu Yeniden Gönder
                                                </Button>
                                                {onActivate && (
                                                    <Button variant="outline" size="sm" onClick={onActivate}>
                                                        Manuel Aktifleştir
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Aktivasyon Durumu</span>
                                                <Badge className="bg-green-100 text-green-800">Aktifleştirildi</Badge>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Aday hesabını aktifleştirmiş. Aktivasyon kodu kullanılmış.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {candidate.photoUrl && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Profil Fotoğrafı</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-100 p-3 rounded-full">
                                            <Camera className="h-6 w-6 text-gray-500"/>
                                        </div>
                                        <div className="flex-1">
                                            <img
                                                src={candidate.photoUrl}
                                                alt={`${candidate.name} ${candidate.lastName}`}
                                                className="h-24 w-24 rounded-lg object-cover border"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CandidateDetailPage;