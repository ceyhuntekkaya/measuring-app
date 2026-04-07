'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Clock, FileText, User as UserIcon, BookOpen, Calendar, Play, CheckCircle, XCircle, Hash, Users, Award} from 'lucide-react';
import type {ApplicationDto} from '@/api/generated/model/applicationDto';
import { formatDate } from '@/utils/date-formater';
import LoadingComp from "@/components/ui/loading-comp";

interface ApplicationDetailProps {
    application: ApplicationDto;
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onStart?: () => void;
    onComplete?: () => void;
    onViewExam?: () => void;
    onViewSession?: () => void;
    onViewCandidate?: () => void;
    onViewGraders?: () => void;
    onEvaluate?: () => void;
}

const ApplicationDetailPage: React.FC<ApplicationDetailProps> = ({
                                                                     application,
                                                                     isLoading = false,
                                                                     onEdit,
                                                                     onDelete,
                                                                     onStart,
                                                                     onComplete,
                                                                     onViewExam,
                                                                     onViewSession,
                                                                     onViewCandidate,
                                                                     onViewGraders,
                                                                     onEvaluate,
                                                                 }) => {
    const [activeTab, setActiveTab] = useState("details");

    if (isLoading) {
        return (
            <LoadingComp/>
        );
    }

    const getStatusColor = (isCompleted: boolean, isEvaluated: boolean) => {
        if (isEvaluated) return 'bg-green-100 text-green-800';
        if (isCompleted) return 'bg-blue-100 text-blue-800';
        return 'bg-yellow-100 text-yellow-800';
    };

    const getStatusText = (isCompleted: boolean, isEvaluated: boolean) => {
        if (isEvaluated) return 'Değerlendirildi';
        if (isCompleted) return 'Tamamlandı';
        return 'Devam Ediyor';
    };

    return (
        <div className="container mx-auto py-4 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Başvuru Detayı</h1>
                    <p className="text-gray-500">{application.name} ({application.code})</p>
                    <p className="text-sm text-gray-400">
                        Aday: {application.candidateName} {application.candidateLastName}
                    </p>
                </div>
                <div className="flex space-x-3">
                    {onEdit && (
                        <Button variant="outline" onClick={onEdit}>
                            Düzenle
                        </Button>
                    )}
                    {!application.isCompleted && application.startedAt && onComplete && (
                        <Button variant="outline" onClick={onComplete}>
                            Tamamla
                        </Button>
                    )}
                    {!application.startedAt && onStart && (
                        <Button variant="outline" onClick={onStart}>
                            <Play className="h-4 w-4 mr-2"/>
                            Başlat
                        </Button>
                    )}
                    {application.isCompleted && !application.isEvaluated && onEvaluate && (
                        <Button variant="outline" onClick={onEvaluate}>
                            <Award className="h-4 w-4 mr-2"/>
                            Değerlendir
                        </Button>
                    )}
                    {onViewGraders && (
                        <Button variant="outline" onClick={onViewGraders}>
                            <Users className="h-4 w-4 mr-2"/>
                            Değerlendiriciler
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
                        Başvuru Bilgileri
                    </button>
                    <button
                        onClick={() => setActiveTab("exam")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "exam"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Sınav ve Oturum
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
                {/* Başvuru Bilgileri Sekmesi */}
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
                                        <p className="font-medium">{application.name}</p>
                                        <p className="text-sm text-gray-500">Başvuru Adı</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Başvuru Kodu</p>
                                        <div className="flex items-center space-x-2">
                                            <Hash className="h-4 w-4 text-gray-400"/>
                                            <p className="font-medium">{application.code}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Kullanıcı Adı</p>
                                    <p className="font-medium">{application.username}</p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Başvuru ID</p>
                                    <p className="font-mono text-sm bg-gray-50 p-2 rounded border">
                                        {application.id}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Aday Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <UserIcon className="h-6 w-6 text-blue-600"/>
                                        </div>
                                        <div>
                                            <p className="font-medium text-blue-900">
                                                {application.candidateName} {application.candidateLastName}
                                            </p>
                                            <p className="text-sm text-blue-700">Aday</p>
                                            {application.candidateIdentityNumber && (
                                                <p className="text-xs text-blue-600">T.C.: {application.candidateIdentityNumber}</p>
                                            )}
                                            <p className="text-xs text-blue-600 font-mono">ID: {application.candidateId}</p>
                                        </div>
                                    </div>
                                    {onViewCandidate && (
                                        <Button variant="outline" size="sm" onClick={onViewCandidate}>
                                            Aday Detayı
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            {application.status === 'ACTIVE' ? (
                                                <CheckCircle className="h-5 w-5 text-green-500"/>
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500"/>
                                            )}
                                            <span>Durum</span>
                                        </div>
                                        <Badge
                                            className={application.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-800'
                                                : application.status === 'DELETED'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'}>
                                            {application.status === 'ACTIVE' ? 'Aktif' :
                                                application.status === 'DELETED' ? 'Silinmiş' :
                                                    application.status || 'Bilinmeyen'}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Clock className="h-5 w-5 text-blue-500"/>
                                            <span>Oluşturulma Tarihi</span>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {formatDate(application.createdAt || '')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Sınav ve Oturum Sekmesi */}
                {activeTab === "exam" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sınav Bilgileri</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <BookOpen className="h-6 w-6 text-green-600"/>
                                        </div>
                                        <div>
                                            <p className="font-medium text-green-900">
                                                {application.examName || 'Sınav Adı Yükleniyor...'}
                                            </p>
                                            <p className="text-sm text-green-700">Sınav</p>
                                            <p className="text-xs text-green-600 font-mono">ID: {application.examId}</p>
                                        </div>
                                    </div>
                                    {onViewExam && (
                                        <Button variant="outline" size="sm" onClick={onViewExam}>
                                            Sınav Detayı
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Sınav Oturumu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-purple-100 p-3 rounded-full">
                                            <Calendar className="h-6 w-6 text-purple-600"/>
                                        </div>
                                        <div>
                                            <p className="font-medium text-purple-900">
                                                {application.examSessionName || 'Oturum Adı Yükleniyor...'}
                                            </p>
                                            <p className="text-sm text-purple-700">Sınav Oturumu</p>
                                            <p className="text-xs text-purple-600 font-mono">ID: {application.examSessionId}</p>
                                        </div>
                                    </div>
                                    {onViewSession && (
                                        <Button variant="outline" size="sm" onClick={onViewSession}>
                                            Oturum Detayı
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Başvuru Durumu</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                                        <div className="flex justify-center mb-2">
                                            {application.isCompleted ? (
                                                <CheckCircle className="h-8 w-8 text-green-500"/>
                                            ) : application.startedAt ? (
                                                <Clock className="h-8 w-8 text-blue-500"/>
                                            ) : (
                                                <XCircle className="h-8 w-8 text-gray-400"/>
                                            )}
                                        </div>
                                        <p className="font-medium">Tamamlanma Durumu</p>
                                        <Badge className={getStatusColor(application.isCompleted ?? false, application.isEvaluated ?? false)}>
                                            {application.isCompleted ? 'Tamamlandı' : application.startedAt ? 'Devam Ediyor' : 'Başlatılmamış'}
                                        </Badge>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                                        <div className="flex justify-center mb-2">
                                            {application.isEvaluated ? (
                                                <Award className="h-8 w-8 text-green-500"/>
                                            ) : (
                                                <Clock className="h-8 w-8 text-yellow-500"/>
                                            )}
                                        </div>
                                        <p className="font-medium">Değerlendirme Durumu</p>
                                        <Badge className={application.isEvaluated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                            {application.isEvaluated ? 'Değerlendirildi' : 'Bekliyor'}
                                        </Badge>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                                        <div className="flex justify-center mb-2">
                                            <Users className="h-8 w-8 text-blue-500"/>
                                        </div>
                                        <p className="font-medium">Değerlendirici Yönetimi</p>
                                        {onViewGraders && (
                                            <Button variant="outline" size="sm" onClick={onViewGraders} className="mt-2">
                                                Görüntüle
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
                                <CardTitle>Başvuru Zaman Çizelgesi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex">
                                        <div className="mr-4 flex-shrink-0">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600">
                                                <FileText className="h-5 w-5"/>
                                            </div>
                                        </div>
                                    </div>

                                    {application.startedAt && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600">
                                                    <Play className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Sınav Başlatıldı</p>
                                                <p className="text-sm text-gray-500">{formatDate(application.startedAt)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {application.endedAt && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600">
                                                    <CheckCircle className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Sınav Tamamlandı</p>
                                                <p className="text-sm text-gray-500">{formatDate(application.endedAt)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {application.isEvaluated && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 text-purple-600">
                                                    <Award className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Değerlendirme Tamamlandı</p>
                                                <p className="text-sm text-gray-500">Başvuru değerlendirildi</p>
                                            </div>
                                        </div>
                                    )}

                     
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Başvuru İstatistikleri</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-gray-50 rounded-md">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Genel Durum</span>
                                            <Badge className={getStatusColor(application.isCompleted ?? false, application.isEvaluated ?? false)}>
                                                {getStatusText(application.isCompleted ?? false, application.isEvaluated ?? false)}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                                            <div>
                                                <p className="text-sm text-gray-500">Toplam Süre</p>
                                                <p className="font-medium">
                                                    {application.startedAt && application.endedAt
                                                        ? `${Math.floor((new Date(application.endedAt).getTime() - new Date(application.startedAt).getTime()) / (1000 * 60))} dakika`
                                                        : application.startedAt
                                                            ? `${Math.floor((new Date().getTime() - new Date(application.startedAt).getTime()) / (1000 * 60))} dakika (devam ediyor)`
                                                            : 'Henüz başlatılmamış'}
                                                </p>
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

export default ApplicationDetailPage;