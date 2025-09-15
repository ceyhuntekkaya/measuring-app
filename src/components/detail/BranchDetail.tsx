'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Clock, Building2, Hash, CheckCircle, XCircle, Building} from 'lucide-react';
import {BranchDto} from '@/types/management/brand';
import { formatDate } from '@/utils/date-formater';
import LoadingComp from "@/components/ui/loading-comp";

interface BranchDetailProps {
    branch: BranchDto;
    brandName?: string;
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onCopy?: () => void;
    onMove?: () => void;
    onViewBrand?: () => void;
}

const BranchDetailPage: React.FC<BranchDetailProps> = ({
                                                           branch,
                                                           brandName,
                                                           isLoading = false,
                                                           onEdit,
                                                           onDelete,
                                                           onCopy,
                                                           onMove,
                                                           onViewBrand,
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
                    <h1 className="text-3xl font-bold tracking-tight">Şube Detayı</h1>
                    <p className="text-gray-500">{branch.branchName} ({branch.code})</p>
                    {brandName && (
                        <p className="text-sm text-gray-400">Marka: {brandName}</p>
                    )}
                </div>
                <div className="flex space-x-3">
                    {onEdit && (
                        <Button variant="outline" onClick={onEdit}>
                            Düzenle
                        </Button>
                    )}
                    {onCopy && (
                        <Button variant="outline" onClick={onCopy}>
                            Kopyala
                        </Button>
                    )}
                    {onMove && (
                        <Button variant="outline" onClick={onMove}>
                            Taşı
                        </Button>
                    )}
                    {onViewBrand && (
                        <Button variant="outline" onClick={onViewBrand}>
                            Markayı Görüntüle
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
                        Şube Bilgileri
                    </button>
                    <button
                        onClick={() => setActiveTab("brand")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "brand"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Marka İlişkisi
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
                {/* Şube Bilgileri Sekmesi */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Temel Bilgiler</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 p-3 rounded-full">
                                        <Building2 className="h-6 w-6 text-gray-500"/>
                                    </div>
                                    <div>
                                        <p className="font-medium">{branch.branchName}</p>
                                        <p className="text-sm text-gray-500">Şube Adı</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Şube Kodu</p>
                                        <div className="flex items-center space-x-2">
                                            <Hash className="h-4 w-4 text-gray-400"/>
                                            <p className="font-medium">{branch.code}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Şube ID</p>
                                    <p className="font-mono text-sm bg-gray-50 p-2 rounded border">
                                        {branch.id}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Kayıt Durumu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        {branch.status === 'ACTIVE' ? (
                                            <CheckCircle className="h-5 w-5 text-green-500"/>
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500"/>
                                        )}
                                        <span>Durum</span>
                                    </div>
                                    <Badge
                                        className={branch.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-800'
                                            : branch.status === 'DELETED'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-gray-100 text-gray-800'}>
                                        {branch.status === 'ACTIVE' ? 'Aktif' :
                                            branch.status === 'DELETED' ? 'Silinmiş' :
                                                branch.status || 'Bilinmeyen'}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-blue-500"/>
                                        <span>Oluşturulma Tarihi</span>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {formatDate(branch.createdAt)}
                                    </p>
                                </div>

                                {branch.deletedAt && (
                                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <XCircle className="h-5 w-5 text-red-500"/>
                                            <span>Silinme Tarihi</span>
                                        </div>
                                        <p className="text-sm font-medium text-red-600">
                                            {formatDate(branch.deletedAt)}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Marka İlişkisi Sekmesi */}
                {activeTab === "brand" && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Bağlı Marka</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <Building className="h-6 w-6 text-blue-600"/>
                                        </div>
                                        <div>
                                            <p className="font-medium text-blue-900">
                                                {brandName || 'Marka Adı Yükleniyor...'}
                                            </p>
                                            <p className="text-sm text-blue-700">Bağlı Marka</p>
                                            <p className="text-xs text-blue-600 font-mono">ID: {branch.brandId}</p>
                                        </div>
                                    </div>
                                    {onViewBrand && (
                                        <Button variant="outline" size="sm" onClick={onViewBrand}>
                                            Marka Detayı
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900">Hızlı İşlemler</h4>
                                        <div className="space-y-2">
                                            {onCopy && (
                                                <Button variant="outline" size="sm" onClick={onCopy} className="w-full justify-start">
                                                    <Building2 className="h-4 w-4 mr-2"/>
                                                    Şubeyi Kopyala
                                                </Button>
                                            )}
                                            {onMove && (
                                                <Button variant="outline" size="sm" onClick={onMove} className="w-full justify-start">
                                                    <Building className="h-4 w-4 mr-2"/>
                                                    Şubeyi Taşı
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900">İlişki Bilgisi</h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>Bu şube seçili markaya bağlıdır</p>
                                            <p>Marka değişikliği için Taşı işlemini kullanın</p>
                                            <p>Kopyalama ile aynı şubeyi farklı markada oluşturabilirsiniz</p>
                                        </div>
                                    </div>
                                </div>
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
                                                <Building2 className="h-5 w-5"/>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Şube Oluşturuldu</p>
                                            <p className="text-sm text-gray-500">{formatDate(branch.createdAt || '')}</p>
                                            {branch.createdById && (
                                                <p className="text-xs text-gray-400">Oluşturan ID: {branch.createdById}</p>
                                            )}
                                        </div>
                                    </div>

                                    {branch.status === 'DELETED' && branch.deletedAt && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 text-red-600">
                                                    <XCircle className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Şube Silindi</p>
                                                <p className="text-sm text-gray-500">{formatDate(branch.deletedAt)}</p>
                                                {branch.deletedById && (
                                                    <p className="text-xs text-gray-400">Silen ID: {branch.deletedById}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Şube Durumu</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-gray-50 rounded-md">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Mevcut Durum</span>
                                            <Badge className={
                                                branch.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : branch.status === 'DELETED'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-gray-100 text-gray-800'
                                            }>
                                                {branch.status === 'ACTIVE' ? 'Aktif' :
                                                    branch.status === 'DELETED' ? 'Silinmiş' :
                                                        branch.status || 'Bilinmeyen'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {branch.status === 'ACTIVE'
                                                ? 'Şube aktif durumda ve işlemler gerçekleştirilebilir.'
                                                : branch.status === 'DELETED'
                                                    ? 'Şube silinmiş durumda. Geri yükleme için yöneticiye başvurun.'
                                                    : 'Şube durumu belirsiz.'}
                                        </p>

                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h4 className="font-medium text-gray-900 mb-2">İşlem Geçmişi</h4>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>• Oluşturulma: {formatDate(branch.createdAt || '')}</p>
                                                {branch.deletedAt && (
                                                    <p>• Silinme: {formatDate(branch.deletedAt)}</p>
                                                )}
                                                <p>• Toplam yaşam süresi: {
                                                    branch.deletedAt
                                                        ? Math.floor((new Date(branch.deletedAt).getTime() - new Date(branch.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                                                        : Math.floor((new Date().getTime() - new Date(branch.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                                                } gün</p>
                                            </div>
                                        </div>
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

export default BranchDetailPage;