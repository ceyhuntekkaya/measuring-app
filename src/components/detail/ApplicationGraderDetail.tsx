'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Clock, User as UserIcon, FileText, Calendar, Shield, CheckCircle, XCircle, Hash, Award, AlertCircle} from 'lucide-react';
import type {ApplicationGraderDto} from '@/api/generated/model/applicationGraderDto';
import { formatDate } from '@/utils/date-formater';
import LoadingComp from "@/components/ui/loading-comp";

interface ApplicationGraderDetailProps {
    grader: ApplicationGraderDto;
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onComplete?: () => void;
    onViewUser?: () => void;
    onViewApplication?: () => void;
    onAssignReferee?: () => void;
    onRemoveReferee?: () => void;
}

const ApplicationGraderDetailPage: React.FC<ApplicationGraderDetailProps> = ({
                                                                                 grader,
                                                                                 isLoading = false,
                                                                                 onEdit,
                                                                                 onDelete,
                                                                                 onComplete,
                                                                                 onViewUser,
                                                                                 onViewApplication,
                                                                                 onAssignReferee,
                                                                                 onRemoveReferee,
                                                                             }) => {
    const [activeTab, setActiveTab] = useState("details");

    if (isLoading) {
        return (
            <LoadingComp/>
        );
    }

    const getStatusColor = (isCompleted: boolean, isReferee: boolean) => {
        if (isCompleted) return 'bg-green-100 text-green-800';
        if (isReferee) return 'bg-purple-100 text-purple-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    const getStatusText = (isCompleted: boolean, isReferee: boolean) => {
        if (isCompleted) return 'Tamamlandı';
        if (isReferee) return 'Hakem - Devam Ediyor';
        return 'Devam Ediyor';
    };

    const isOverdue = grader.endEndDate && new Date(grader.endEndDate) < new Date() && !grader.isCompleted;

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Değerlendirici Detayı</h1>
                    <p className="text-gray-500">
                        {grader.userName} {grader.userLastName}
                        {grader.isReferee && <span className="text-purple-600 ml-2">(Hakem)</span>}
                    </p>
                    <p className="text-sm text-gray-400">
                        Başvuru: {grader.applicationName} | Sıra: {grader.orderNumber}
                    </p>
                </div>
                <div className="flex space-x-3">
                    {onEdit && (
                        <Button variant="outline" onClick={onEdit}>
                            Düzenle
                        </Button>
                    )}
                    {!grader.isCompleted && onComplete && (
                        <Button variant="outline" onClick={onComplete}>
                            <CheckCircle className="h-4 w-4 mr-2"/>
                            Tamamla
                        </Button>
                    )}
                    {!grader.isReferee && onAssignReferee && (
                        <Button variant="outline" onClick={onAssignReferee}>
                            <Shield className="h-4 w-4 mr-2"/>
                            Hakem Yap
                        </Button>
                    )}
                    {grader.isReferee && onRemoveReferee && (
                        <Button variant="outline" onClick={onRemoveReferee}>
                            Hakemlikten Çıkar
                        </Button>
                    )}
                    {onDelete && (
                        <Button variant="outline" onClick={onDelete}>
                            Sil
                        </Button>
                    )}
                </div>
            </div>

            {/* Durum Uyarısı */}
            {isOverdue && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-red-500"/>
                        <div>
                            <p className="font-medium text-red-800">Süre Aşımı</p>
                            <p className="text-sm text-red-600">
                                Değerlendirme süresi {formatDate(grader.endEndDate!)} tarihinde dolmuş
                            </p>
                        </div>
                    </div>
                </div>
            )}

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
                        Değerlendirici Bilgileri
                    </button>
                    <button
                        onClick={() => setActiveTab("assignment")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "assignment"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Atama Bilgileri
                    </button>
                    <button
                        onClick={() => setActiveTab("activity")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "activity"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Süreç Aktiviteleri
                    </button>
                </nav>
            </div>

            {/* Sekme İçeriği */}
            <div className="mt-6">
                {/* Değerlendirici Bilgileri Sekmesi */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Kullanıcı Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <UserIcon className="h-6 w-6 text-blue-600"/>
                                        </div>
                                        <div>
                                            <p className="font-medium text-blue-900">
                                                {grader.userName} {grader.userLastName}
                                            </p>
                                            <p className="text-sm text-blue-700">Değerlendirici</p>
                                            <p className="text-xs text-blue-600 font-mono">ID: {grader.userId}</p>
                                        </div>
                                    </div>
                                    {onViewUser && (
                                        <Button variant="outline" size="sm" onClick={onViewUser}>
                                            Kullanıcı Detayı
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Değerlendirici ID</p>
                                        <p className="font-mono text-sm bg-gray-50 p-2 rounded border">
                                            {grader.id}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        {grader.isReferee ? (
                                            <Shield className="h-5 w-5 text-purple-500"/>
                                        ) : (
                                            <UserIcon className="h-5 w-5 text-blue-500"/>
                                        )}
                                        <span>Rol</span>
                                    </div>
                                    <Badge className={grader.isReferee ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                                        {grader.isReferee ? 'Hakem' : 'Değerlendirici'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Görev Durumu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        {grader.isCompleted ? (
                                            <CheckCircle className="h-5 w-5 text-green-500"/>
                                        ) : (
                                            <Clock className="h-5 w-5 text-yellow-500"/>
                                        )}
                                        <span>Tamamlanma Durumu</span>
                                    </div>
                                    <Badge className={getStatusColor(grader.isCompleted ?? false, grader.isReferee ?? false)}>
                                        {getStatusText(grader.isCompleted ?? false, grader.isReferee ?? false)}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <Hash className="h-5 w-5 text-blue-500"/>
                                        <span>Sıra Numarası</span>
                                    </div>
                                    <Badge className="bg-gray-100 text-gray-800">
                                        {grader.orderNumber}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        {grader.status === 'ACTIVE' ? (
                                            <CheckCircle className="h-5 w-5 text-green-500"/>
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500"/>
                                        )}
                                        <span>Durum</span>
                                    </div>
                                    <Badge
                                        className={grader.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-800'
                                            : grader.status === 'DELETED'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-800'}>
                                        {grader.status === 'ACTIVE' ? 'Aktif' :
                                            grader.status === 'DELETED' ? 'Silinmiş' :
                                                grader.status || 'Bilinmeyen'}
                                    </Badge>
                                </div>

                                {grader.endEndDate && (
                                    <div className={`flex justify-between items-center p-3 rounded-md ${isOverdue ? 'bg-red-50' : 'bg-blue-50'}`}>
                                        <div className="flex items-center space-x-3">
                                            <Calendar className={`h-5 w-5 ${isOverdue ? 'text-red-500' : 'text-blue-500'}`}/>
                                            <span>Bitiş Tarihi</span>
                                        </div>
                                        <p className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-blue-600'}`}>
                                            {formatDate(grader.endEndDate)}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Atama Bilgileri Sekmesi */}
                {activeTab === "assignment" && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Başvuru Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <FileText className="h-6 w-6 text-green-600"/>
                                        </div>
                                        <div>
                                            <p className="font-medium text-green-900">
                                                {grader.applicationName || 'Başvuru Adı Yükleniyor...'}
                                            </p>
                                            <p className="text-sm text-green-700">Değerlendirilecek Başvuru</p>
                                            <p className="text-xs text-green-600 font-mono">ID: {grader.applicationId}</p>
                                        </div>
                                    </div>
                                    {onViewApplication && (
                                        <Button variant="outline" size="sm" onClick={onViewApplication}>
                                            Başvuru Detayı
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Atama Detayları</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-3">Görev Bilgileri</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-500">Sıra Numarası:</span>
                                                    <span className="text-sm font-medium">{grader.orderNumber}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-500">Rol:</span>
                                                    <Badge className={grader.isReferee ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                                                        {grader.isReferee ? 'Hakem' : 'Değerlendirici'}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-500">Durum:</span>
                                                    <Badge className={getStatusColor(grader.isCompleted ?? false, grader.isReferee ?? false)}>
                                                        {getStatusText(grader.isCompleted ?? false, grader.isReferee ?? false)}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-3">Zaman Bilgileri</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-500">Atanma Tarihi:</span>
                                                    <span className="text-sm font-medium">{formatDate(grader.createdAt || '')}</span>
                                                </div>
                                                {grader.endEndDate && (
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-500">Bitiş Tarihi:</span>
                                                        <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                                                            {formatDate(grader.endEndDate)}
                                                        </span>
                                                    </div>
                                                )}
                                                {grader.endEndDate && (
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-500">Kalan Süre:</span>
                                                        <span className={`text-sm font-medium ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                                                            {grader.isCompleted
                                                                ? 'Tamamlandı'
                                                                : isOverdue
                                                                    ? `${Math.floor((new Date().getTime() - new Date(grader.endEndDate).getTime()) / (1000 * 60 * 60 * 24))} gün gecikme`
                                                                    : `${Math.floor((new Date(grader.endEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} gün kaldı`}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h4 className="font-medium text-gray-900 mb-3">Hızlı İşlemler</h4>
                                    <div className="flex space-x-3">
                                        {!grader.isCompleted && onComplete && (
                                            <Button variant="outline" size="sm" onClick={onComplete}>
                                                <CheckCircle className="h-4 w-4 mr-2"/>
                                                Değerlendirmeyi Tamamla
                                            </Button>
                                        )}
                                        {!grader.isReferee && onAssignReferee && (
                                            <Button variant="outline" size="sm" onClick={onAssignReferee}>
                                                <Shield className="h-4 w-4 mr-2"/>
                                                Hakem Olarak Ata
                                            </Button>
                                        )}
                                        {grader.isReferee && onRemoveReferee && (
                                            <Button variant="outline" size="sm" onClick={onRemoveReferee}>
                                                Hakemlikten Çıkar
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Süreç Aktiviteleri Sekmesi */}
                {activeTab === "activity" && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Değerlendirme Zaman Çizelgesi</CardTitle>
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
                                            <p className="font-semibold">Değerlendirici Atandı</p>
                                            <p className="text-sm text-gray-500">{formatDate(grader.createdAt || '')}</p>
                                            {grader.createdById && (
                                                <p className="text-xs text-gray-400">Atayan ID: {grader.createdById}</p>
                                            )}
                                        </div>
                                    </div>

                                    {grader.isReferee && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-600">
                                                    <Shield className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Hakem Olarak Atandı</p>
                                                <p className="text-sm text-gray-500">Özel hakem yetkisi verildi</p>
                                            </div>
                                        </div>
                                    )}

                                    {grader.isCompleted && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600">
                                                    <Award className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Değerlendirme Tamamlandı</p>
                                                <p className="text-sm text-gray-500">Görev başarıyla tamamlandı</p>
                                            </div>
                                        </div>
                                    )}

                                    {grader.status === 'DELETED' && grader.deletedAt && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 text-red-600">
                                                    <XCircle className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Atama İptal Edildi</p>
                                                <p className="text-sm text-gray-500">{formatDate(grader.deletedAt)}</p>
                                                {grader.deletedById && (
                                                    <p className="text-xs text-gray-400">İptal Eden ID: {grader.deletedById}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Performans Özeti</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-gray-50 rounded-md">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Genel Durum</span>
                                            <Badge className={getStatusColor(grader.isCompleted ?? false, grader.isReferee ?? false)}>
                                                {getStatusText(grader.isCompleted ?? false, grader.isReferee ?? false)}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                                            <div>
                                                <p className="text-sm text-gray-500">Atanma Süresi</p>
                                                <p className="font-medium">
                                                    {grader.createdAt ? `${Math.floor((new Date().getTime() - new Date(grader.createdAt).getTime()) / (1000 * 60 * 60 * 24))} gün` : 'Bilinmiyor'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Değerlendirme Süresi</p>
                                                <p className="font-medium">
                                                    {grader.endEndDate && grader.createdAt
                                                        ? `${Math.floor((new Date(grader.endEndDate).getTime() - new Date(grader.createdAt).getTime()) / (1000 * 60 * 60 * 24))} gün`
                                                        : 'Süre belirlenmemiş'}
                                                </p>
                                            </div>
                                        </div>

                                        {isOverdue && (
                                            <div className="mt-4 pt-4 border-t border-red-200 bg-red-50 p-3 rounded">
                                                <div className="flex items-center space-x-2">
                                                    <AlertCircle className="h-4 w-4 text-red-500"/>
                                                    <span className="text-sm font-medium text-red-800">Dikkat: Süre aşımı</span>
                                                </div>
                                                <p className="text-xs text-red-600 mt-1">
                                                    Değerlendirme süresi dolmuş, acil müdahale gerekiyor.
                                                </p>
                                            </div>
                                        )}
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

export default ApplicationGraderDetailPage;