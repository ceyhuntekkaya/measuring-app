'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Clock, FileText, Hash, CheckCircle, XCircle, Building, BookOpen, Users, Timer, Trophy} from 'lucide-react';
import {ExamDto} from '@/types/exam/examEntities';
import { formatDate } from '@/utils/date-formater';
import LoadingComp from "@/components/ui/loading-comp";

interface ExamDetailProps {
    exam: ExamDto;
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onCopy?: () => void;
    onMove?: () => void;
    onViewBrand?: () => void;
    onViewBranch?: () => void;
    onViewExamType?: () => void;
    onActivate?: () => void;
    onDeactivate?: () => void;
    onArchive?: () => void;
    onRestore?: () => void;
}

const ExamDetail: React.FC<ExamDetailProps> = ({
                                                   exam,
                                                   isLoading = false,
                                                   onEdit,
                                                   onDelete,
                                                   onCopy,
                                                   onMove,
                                                   onViewBrand,
                                                   onViewBranch,
                                                   onViewExamType,
                                                   onActivate,
                                                   onDeactivate,
                                                   onArchive,
                                                   onRestore,
                                               }) => {
    const [activeTab, setActiveTab] = useState("details");

    if (isLoading) {
        return <LoadingComp/>;
    }

    const totalQuestions = exam.questionGroups?.reduce((total, qg) =>
        total + (qg.questions?.length || 0), 0) || 0;

    const totalScore = exam.questionGroups?.reduce((total, qg) =>
        total + (qg.maximumScore || 0), 0) || 0;

    const totalDuration = exam.questionGroups?.reduce((total, qg) =>
        total + (qg.durationInSeconds || 0), 0) || 0;

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sınav Detayı</h1>
                    <p className="text-gray-500">{exam.name} ({exam.code})</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                        <span>Marka: {exam.brand?.name}</span>
                        <span>•</span>
                        <span>Şube: {exam.branch?.branchName}</span>
                        <span>•</span>
                        <span>Tip: {exam.examType?.name}</span>
                    </div>
                </div>
                <div className="flex space-x-3">
                    {exam.status === 'ACTIVE' && onDeactivate && (
                        <Button variant="outline" onClick={onDeactivate}>
                            Pasif Et
                        </Button>
                    )}
                    {exam.status === 'PASSIVE' && onActivate && (
                        <Button variant="outline" onClick={onActivate}>
                            Aktif Et
                        </Button>
                    )}
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
                    {onArchive && exam.status !== 'SUSPENDED' && (
                        <Button variant="outline" onClick={onArchive}>
                            Arşivle
                        </Button>
                    )}
                    {onRestore && exam.status === 'SUSPENDED' && (
                        <Button variant="outline" onClick={onRestore}>
                            Geri Yükle
                        </Button>
                    )}
                    {onDelete && (
                        <Button variant="destructive" onClick={onDelete}>
                            Sil
                        </Button>
                    )}
                </div>
            </div>

            {/* Sekme Navigasyonu */}
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
                        Sınav Bilgileri
                    </button>
                    <button
                        onClick={() => setActiveTab("questions")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "questions"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Soru Grupları
                    </button>
                    <button
                        onClick={() => setActiveTab("relations")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "relations"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        İlişkiler
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
                {/* Sınav Bilgileri Sekmesi */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Temel Bilgiler</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 p-3 rounded-full">
                                        <FileText className="h-6 w-6 text-gray-500"/>
                                    </div>
                                    <div>
                                        <p className="font-medium">{exam.name}</p>
                                        <p className="text-sm text-gray-500">Sınav Adı</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Sınav Kodu</p>
                                        <div className="flex items-center space-x-2">
                                            <Hash className="h-4 w-4 text-gray-400"/>
                                            <p className="font-medium">{exam.code}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Sınav ID</p>
                                    <p className="font-mono text-sm bg-gray-50 p-2 rounded border">
                                        {exam.id}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Sınav İstatistikleri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-md">
                                        <Users className="h-5 w-5 text-blue-500"/>
                                        <div>
                                            <p className="text-sm font-medium text-blue-900">
                                                {exam.questionGroups?.length || 0}
                                            </p>
                                            <p className="text-xs text-blue-600">Soru Grubu</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-md">
                                        <BookOpen className="h-5 w-5 text-green-500"/>
                                        <div>
                                            <p className="text-sm font-medium text-green-900">
                                                {totalQuestions}
                                            </p>
                                            <p className="text-xs text-green-600">Toplam Soru</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-md">
                                        <Trophy className="h-5 w-5 text-purple-500"/>
                                        <div>
                                            <p className="text-sm font-medium text-purple-900">
                                                {totalScore}
                                            </p>
                                            <p className="text-xs text-purple-600">Maksimum Puan</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-md">
                                        <Timer className="h-5 w-5 text-orange-500"/>
                                        <div>
                                            <p className="text-sm font-medium text-orange-900">
                                                {Math.round(totalDuration / 60)} dk
                                            </p>
                                            <p className="text-xs text-orange-600">Toplam Süre</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        {exam.status === 'ACTIVE' ? (
                                            <CheckCircle className="h-5 w-5 text-green-500"/>
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500"/>
                                        )}
                                        <span>Durum</span>
                                    </div>
                                    <Badge
                                        className={exam.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-800'
                                            : exam.status === 'PASSIVE'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : exam.status === 'SUSPENDED'
                                                    ? 'bg-gray-100 text-gray-800'
                                                    : 'bg-red-100 text-red-800'}>
                                        {exam.status === 'ACTIVE' ? 'Aktif' :
                                            exam.status === 'PASSIVE' ? 'Pasif' :
                                                exam.status === 'SUSPENDED' ? 'Arşivlenmiş' : 'Silinmiş'}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-blue-500"/>
                                        <span>Oluşturulma Tarihi</span>
                                    </div>
                                    <p className="text-sm font-medium">
                                        {formatDate(exam.createdAt || '')}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Soru Grupları Sekmesi */}
                {activeTab === "questions" && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Soru Grupları ({exam.questionGroups?.length || 0})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {exam.questionGroups && exam.questionGroups.length > 0 ? (
                                    <div className="space-y-4">
                                        {exam.questionGroups.map((qg, index) => (
                                            <div key={qg.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-4">
                                                        <div className="bg-blue-100 p-2 rounded-full">
                                                            <BookOpen className="h-4 w-4 text-blue-600"/>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h4 className="font-medium">{qg.name}</h4>
                                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                <span>{qg.questions?.length || 0} soru</span>
                                                                <span>•</span>
                                                                <span>{qg.maximumScore || 0} puan</span>
                                                                <span>•</span>
                                                                <span>{Math.round((qg.durationInSeconds || 0) / 60)} dk</span>
                                                            </div>
                                                            {qg.examSection && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    {qg.examSection.name}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-sm text-gray-400">#{index + 1}</span>
                                                        {qg.approvalStatus && (
                                                            <div className="mt-1">
                                                                <Badge
                                                                    className={qg.approvalStatus === 'APPROVED'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : qg.approvalStatus === 'PENDING'
                                                                            ? 'bg-yellow-100 text-yellow-800'
                                                                            : 'bg-red-100 text-red-800'}
                                                                >
                                                                    {qg.approvalStatus === 'APPROVED' ? 'Onaylandı' :
                                                                        qg.approvalStatus === 'PENDING' ? 'Bekliyor' : 'Reddedildi'}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                                        <p className="text-gray-500">Bu sınavda henüz soru grubu bulunmuyor</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* İlişkiler Sekmesi */}
                {activeTab === "relations" && (
                    <div className="grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Marka İlişkisi */}
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
                                                    {exam.brand?.name}
                                                </p>
                                                <p className="text-sm text-blue-700">({exam.brand?.code})</p>
                                                <p className="text-xs text-blue-600 font-mono">ID: {exam.brand?.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {onViewBrand && (
                                        <Button variant="outline" size="sm" onClick={onViewBrand} className="w-full">
                                            Marka Detayı
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Şube İlişkisi */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Bağlı Şube</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-green-100 p-3 rounded-full">
                                                <Building className="h-6 w-6 text-green-600"/>
                                            </div>
                                            <div>
                                                <p className="font-medium text-green-900">
                                                    {exam.branch?.branchName}
                                                </p>
                                                <p className="text-sm text-green-700">({exam.branch?.code})</p>
                                                <p className="text-xs text-green-600 font-mono">ID: {exam.branch?.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {onViewBranch && (
                                        <Button variant="outline" size="sm" onClick={onViewBranch} className="w-full">
                                            Şube Detayı
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Sınav Tipi İlişkisi */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sınav Tipi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-purple-100 p-3 rounded-full">
                                                <FileText className="h-6 w-6 text-purple-600"/>
                                            </div>
                                            <div>
                                                <p className="font-medium text-purple-900">
                                                    {exam.examType?.name}
                                                </p>
                                                <p className="text-sm text-purple-700">{exam.examType?.examLevel}</p>
                                                <p className="text-xs text-purple-600 font-mono">ID: {exam.examType?.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {onViewExamType && (
                                        <Button variant="outline" size="sm" onClick={onViewExamType} className="w-full">
                                            Sınav Tipi Detayı
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Hızlı İşlemler */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Hızlı İşlemler</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {onCopy && (
                                        <Button variant="outline" onClick={onCopy} className="justify-start">
                                            <FileText className="h-4 w-4 mr-2"/>
                                            Sınavı Kopyala
                                        </Button>
                                    )}
                                    {onMove && (
                                        <Button variant="outline" onClick={onMove} className="justify-start">
                                            <Building className="h-4 w-4 mr-2"/>
                                            Sınavı Taşı
                                        </Button>
                                    )}
                                    {exam.status === 'ACTIVE' && onDeactivate && (
                                        <Button variant="outline" onClick={onDeactivate} className="justify-start">
                                            <XCircle className="h-4 w-4 mr-2"/>
                                            Pasif Et
                                        </Button>
                                    )}
                                    {exam.status !== 'ACTIVE' && onActivate && (
                                        <Button variant="outline" onClick={onActivate} className="justify-start">
                                            <CheckCircle className="h-4 w-4 mr-2"/>
                                            Aktif Et
                                        </Button>
                                    )}
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
                                                <FileText className="h-5 w-5"/>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Sınav Oluşturuldu</p>
                                            <p className="text-sm text-gray-500">{formatDate(exam.createdAt || '')}</p>
                                            {exam.createdById && (
                                                <p className="text-xs text-gray-400">Oluşturan ID: {exam.createdById}</p>
                                            )}
                                        </div>
                                    </div>

                                    {exam.status === 'DELETED' && exam.deletedAt && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 text-red-600">
                                                    <XCircle className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Sınav Silindi</p>
                                                <p className="text-sm text-gray-500">{formatDate(exam.deletedAt)}</p>
                                                {exam.deletedById && (
                                                    <p className="text-xs text-gray-400">Silen ID: {exam.deletedById}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Sınav Durumu</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-gray-50 rounded-md">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Mevcut Durum</span>
                                            <Badge className={
                                                exam.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : exam.status === 'PASSIVE'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : exam.status === 'SUSPENDED'
                                                            ? 'bg-gray-100 text-gray-800'
                                                            : 'bg-red-100 text-red-800'
                                            }>
                                                {exam.status === 'ACTIVE' ? 'Aktif' :
                                                    exam.status === 'PASSIVE' ? 'Pasif' :
                                                        exam.status === 'SUSPENDED' ? 'Arşivlenmiş' : 'Silinmiş'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {exam.status === 'ACTIVE'
                                                ? 'Sınav aktif durumda ve kullanıma hazır.'
                                                : exam.status === 'PASSIVE'
                                                    ? 'Sınav pasif durumda. Aktif etmek için düzenleyiniz.'
                                                    : exam.status === 'SUSPENDED'
                                                        ? 'Sınav arşivlenmiş durumda.'
                                                        : 'Sınav silinmiş durumda. Geri yükleme için yöneticiye başvurun.'}
                                        </p>

                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h4 className="font-medium text-gray-900 mb-2">İşlem Geçmişi</h4>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>• Oluşturulma: {formatDate(exam.createdAt || '')}</p>
                                                {exam.deletedAt && (
                                                    <p>• Silinme: {formatDate(exam.deletedAt)}</p>
                                                )}
                                                <p>• Toplam yaşam süresi: {
                                                    exam.deletedAt
                                                        ? Math.floor((new Date(exam.deletedAt).getTime() - new Date(exam.createdAt || '').getTime()) / (1000 * 60 * 60 * 24))
                                                        : Math.floor((new Date().getTime() - new Date(exam.createdAt || '').getTime()) / (1000 * 60 * 60 * 24))
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

export default ExamDetail;