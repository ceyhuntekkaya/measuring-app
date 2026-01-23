'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
    Clock, User, Hash, CheckCircle, XCircle,
    Users, Calendar, Activity, Info,
    BookOpen, UserCheck, Play, Edit, Trash2, Copy
} from 'lucide-react';
import type {ExamSessionDto} from '@/api/generated/model/examSessionDto';
import type {ApplicationDto} from '@/api/generated/model/applicationDto';
import {formatDate} from '@/utils/date-formater';
import LoadingComp from "@/components/ui/loading-comp";
import ExamParticipants from "@/components/proctor/ExamParticipants";
import ExamEvaluationPanel from "@/components/proctor/ExamEvaluation";
import {useGetApplicationsByExamSession} from "@/api/generated/application-management/application-management";

interface ExamSessionDetailProps {
    examSession: ExamSessionDto;
    statistics?: {
        totalParticipants: number;
        completedParticipants: number;
        activeParticipants: number;
        completionRate: number;
    };
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onStart?: () => void;
    onPause?: () => void;
    onStop?: () => void;
    onFinish?: () => void;
    onDuplicate?: () => void;
    onViewParticipants?: () => void;
    onViewResults?: () => void;
    onManageSupervisors?: () => void;
    onViewStatistics?: () => void;
}

const ExamSessionDetail: React.FC<ExamSessionDetailProps> = ({
                                                                 examSession,
                                                                 statistics,
                                                                 isLoading = false,
                                                                 onEdit,
                                                                 onDelete,
                                                                 onStart,
                                                                 onStop,
                                                                 onFinish,
                                                                 onDuplicate,
                                                                 onViewParticipants,
                                                                 onViewResults,
                                                                 onManageSupervisors,
                                                                 onViewStatistics,
                                                             }) => {
    const [activeTab, setActiveTab] = useState("general");

    const {data: applicationsData} = useGetApplicationsByExamSession(examSession.id || '', {
        query: { enabled: !!examSession.id }
    });
    const examSessionApplications = (applicationsData as unknown as { data?: ApplicationDto[] })?.data || [];



    if (isLoading) {
        return <LoadingComp/>;
    }

    const getSessionStatus = () => {
        if (!examSession.startDate) {
            return { status: 'UNKNOWN', text: 'Bilinmiyor', color: 'bg-gray-100 text-gray-800' };
        }
        const now = new Date();
        const startDate = new Date(examSession.startDate);

        if (startDate > now) {
            return { status: 'SCHEDULED', text: 'Planlanmış', color: 'bg-blue-100 text-blue-800' };
        } else if (startDate <= now) {
            return { status: 'ACTIVE', text: 'Aktif', color: 'bg-green-100 text-green-800' };
        }
        return { status: 'COMPLETED', text: 'Tamamlanmış', color: 'bg-gray-100 text-gray-800' };
    };

    const getDaysUntilStart = () => {
        if (!examSession.startDate) {
            return 'Bilinmiyor';
        }
        const now = new Date();
        const startDate = new Date(examSession.startDate);
        const diffTime = startDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            return `${diffDays} gün sonra`;
        } else if (diffDays === 0) {
            return 'Bugün';
        } else {
            return `${Math.abs(diffDays)} gün önce`;
        }
    };

    const sessionStatus = getSessionStatus();

    return (<>
        <div className="container mx-auto space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sınav Oturumu Detayı</h1>
                    <p className="text-gray-500">{examSession.name}</p>
                    <p className="text-sm text-gray-400">{examSession.description}</p>
                </div>
                <div className="flex space-x-3">
                    {onEdit && (
                        <Button variant="outline" onClick={onEdit}>
                            <Edit className="h-4 w-4 mr-2"/>
                            Düzenle
                        </Button>
                    )}
                    {/* Başlat/Durdur butonu - isFinish false ise görünür */}
                    {!examSession.isFinish && (
                        <>
                            {onStart && !examSession.beginAt && (
                                <Button variant="primary" onClick={onStart}>
                                    <Play className="h-4 w-4 mr-2"/>
                                    Başlat
                                </Button>
                            )}
                            {onStop && examSession.beginAt && !examSession.endAt && (
                                <Button variant="outline" onClick={onStop}>
                                    <XCircle className="h-4 w-4 mr-2"/>
                                    Durdur
                                </Button>
                            )}
                        </>
                    )}
                    {/* OTURUMU SONLANDIR butonu */}
                    {onFinish && (
                        <Button 
                            variant={examSession.isFinish ? "outline" : "destructive"} 
                            onClick={onFinish}
                            disabled={examSession.isFinish}
                        >
                            {examSession.isFinish ? (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2"/>
                                    OTURUM SONLANDI
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 mr-2"/>
                                    OTURUMU SONLANDIR
                                </>
                            )}
                        </Button>
                    )}
                    {onDuplicate && (
                        <Button variant="outline" onClick={onDuplicate}>
                            <Copy className="h-4 w-4 mr-2"/>
                            Kopyala
                        </Button>
                    )}
                    {onDelete && (
                        <Button variant="destructive" onClick={onDelete}>
                            <Trash2 className="h-4 w-4 mr-2"/>
                            Sil
                        </Button>
                    )}
                </div>
            </div>

            {/* Sekme Navigasyonu */}
            <div className="border-b border-gray-200 mt-0 pt-0">
                <nav className="flex -mb-px space-x-8">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "general"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Genel Bilgiler
                    </button>

                   

                    <button
                        onClick={() => setActiveTab("evaluation")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "evaluation"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Sınav Sonucu Değerlendirme
                    </button>


                </nav>
            </div>

            {/* Sekme İçeriği */}
            <div>
                {/* Genel Bilgiler Sekmesi */}
                {activeTab === "general" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <BookOpen className="h-5 w-5"/>
                                    <span>Oturum Bilgileri</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <BookOpen className="h-6 w-6 text-blue-600"/>
                                    </div>
                                    <div>
                                        <p className="font-medium">{examSession.name}</p>
                                        <p className="text-sm text-gray-500">Oturum Adı</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Hash className="h-4 w-4 text-gray-400"/>
                                        <div>
                                            <p className="text-sm text-gray-500">Oturum ID</p>
                                            <p className="font-mono text-sm">{examSession.id}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Info className="h-4 w-4 text-gray-400"/>
                                        <div>
                                            <p className="text-sm text-gray-500">Açıklama</p>
                                            <p className="font-medium">{examSession.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4 text-gray-400"/>
                                        <div>
                                            <p className="text-sm text-gray-500">Kontenjan</p>
                                            <p className="font-medium">{examSession.quota} kişi</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Activity className="h-4 w-4 text-gray-400"/>
                                        <div>
                                            <p className="text-sm text-gray-500">Session State</p>
                                            <div className="font-medium">
                                                <Badge variant={
                                                    examSession.sessionState === 'IN_PROGRESS' ? 'default' :
                                                    examSession.sessionState === 'FINISHED' ? 'secondary' :
                                                    examSession.sessionState === 'PAUSED' ? 'outline' :
                                                    examSession.sessionState === 'CANCELLED' ? 'destructive' :
                                                    'outline'
                                                }>
                                                    {examSession.sessionState || 'NOT_SET'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Clock className="h-5 w-5"/>
                                    <span>Zaman Bilgileri</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="h-5 w-5 text-blue-500"/>
                                            <span>Başlangıç Tarihi</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">
                                                {examSession.startDate ? formatDate(examSession.startDate.toString()) : 'Belirtilmedi'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {getDaysUntilStart()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Activity className="h-5 w-5 text-green-500"/>
                                            <span>Durum</span>
                                        </div>
                                        <Badge className={sessionStatus.color}>
                                            {sessionStatus.text}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Clock className="h-5 w-5 text-purple-500"/>
                                            <span>Oluşturma Tarihi</span>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {formatDate(examSession.createdAt || '')}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Sınav Detayları Sekmesi */}
                {activeTab === "exam" && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <BookOpen className="h-5 w-5"/>
                                    <span>Sınav Yapılandırması</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <BookOpen className="h-4 w-4 text-gray-400"/>
                                            <div>
                                                <p className="text-sm text-gray-500">Sınav Şablonu</p>
                                                <p className="font-medium">{examSession.examTemplate}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Hash className="h-4 w-4 text-gray-400"/>
                                            <div>
                                                <p className="text-sm text-gray-500">Sınav Tipi</p>
                                                <p className="font-medium">{examSession.examType?.name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {examSession.examType?.durationInSeconds && (
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-gray-400"/>
                                                <div>
                                                    <p className="text-sm text-gray-500">Süre</p>
                                                    <p className="font-medium">
                                                        {Math.floor(examSession.examType.durationInSeconds / 60)} dakika
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {examSession.examType?.maximumScore && (
                                            <div className="flex items-center space-x-2">
                                                <CheckCircle className="h-4 w-4 text-gray-400"/>
                                                <div>
                                                    <p className="text-sm text-gray-500">Maksimum Puan</p>
                                                    <p className="font-medium">{examSession.examType.maximumScore}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {examSession.examType?.description && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-700 font-medium mb-2">Sınav Açıklaması</p>
                                        <p className="text-sm text-blue-600">{examSession.examType.description}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2"/>
                                        <p className="text-sm text-green-700">
                                            {examSession.examType?.isGraded ? 'Puanlı' : 'Puansız'}
                                        </p>
                                    </div>
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <Hash className="h-6 w-6 text-blue-600 mx-auto mb-2"/>
                                        <p className="text-sm text-blue-700">
                                            {examSession.examType?.isOrder ? 'Sıralı' : 'Sırasız'}
                                        </p>
                                    </div>
                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                        <Activity className="h-6 w-6 text-purple-600 mx-auto mb-2"/>
                                        <p className="text-sm text-purple-700">
                                            {examSession.examType?.isShowEvaluation ? 'Değerlendirme Göster' : 'Değerlendirme Gizle'}
                                        </p>
                                    </div>
                                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                                        <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2"/>
                                        <p className="text-sm text-orange-700">
                                            {examSession.examType?.screenRecordTime ? `${examSession.examType.screenRecordTime}s Kayıt` : 'Kayıt Yok'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Organizasyon Sekmesi */}
                {activeTab === "organization" && (
                    <div className="grid grid-cols-1 gap-6">


                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <UserCheck className="h-5 w-5"/>
                                    <span>Gözetmenler</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {examSession.supervisors && examSession.supervisors.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {examSession.supervisors.map((supervisor) => (
                                            <div key={supervisor.id} className="p-4 border rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-purple-100 p-2 rounded-full">
                                                        <User className="h-5 w-5 text-purple-600"/>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{supervisor.name} {supervisor.lastName}</p>
                                                        <p className="text-sm text-gray-500">@{supervisor.username}</p>
                                                        <p className="text-xs text-gray-400">{supervisor.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Gözetmen atanmamış</p>
                                )}

                                {onManageSupervisors && (
                                    <Button variant="outline" onClick={onManageSupervisors} className="mt-4">
                                        <Users className="h-4 w-4 mr-2"/>
                                        Gözetmenleri Yönet
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Katılımcılar & Sonuçlar Sekmesi */}
                {activeTab === "participants" && (
                    <div className="grid grid-cols-1 gap-6">


                            {


                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Kontenjan</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <Users className="h-8 w-8 text-blue-600 mx-auto mb-2"/>
                                        <p className="font-medium text-blue-900">{examSession.quota}</p>
                                        <p className="text-sm text-blue-700">Toplam Kontenjan</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Katılımcılar</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2"/>
                                        <p className="font-medium text-green-900">
                                            {statistics?.totalParticipants || 0}
                                        </p>
                                        <p className="text-sm text-green-700">Toplam Katılan</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Tamamlama Oranı</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2"/>
                                        <p className="font-medium text-purple-900">
                                            %{Math.round(statistics?.completionRate || 0)}
                                        </p>
                                        <p className="text-sm text-purple-700">
                                            {statistics?.completedParticipants || 0}/{statistics?.totalParticipants || 0} Tamamlandı
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>


                            }


                        <Card>
                            <CardHeader>
                                <CardTitle>Detaylı İstatistikler</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <Users className="h-6 w-6 text-blue-600 mx-auto mb-2"/>
                                        <p className="font-medium text-blue-900">{examSession.quota}</p>
                                        <p className="text-xs text-blue-700">Kontenjan</p>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2"/>
                                        <p className="font-medium text-green-900">{statistics?.totalParticipants || 0}</p>
                                        <p className="text-xs text-green-700">Katılan</p>
                                    </div>
                                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                                        <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2"/>
                                        <p className="font-medium text-orange-900">{statistics?.activeParticipants || 0}</p>
                                        <p className="text-xs text-orange-700">Devam Eden</p>
                                    </div>
                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                        <Activity className="h-6 w-6 text-purple-600 mx-auto mb-2"/>
                                        <p className="font-medium text-purple-900">{statistics?.completedParticipants || 0}</p>
                                        <p className="text-xs text-purple-700">Tamamlanan</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Hızlı İşlemler</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {onViewParticipants && (
                                        <Button variant="outline" onClick={onViewParticipants}>
                                            <Users className="h-4 w-4 mr-2"/>
                                            Katılımcıları Görüntüle
                                        </Button>
                                    )}
                                    {onViewResults && (
                                        <Button variant="outline" onClick={onViewResults}>
                                            <Activity className="h-4 w-4 mr-2"/>
                                            Sonuçları Görüntüle
                                        </Button>
                                    )}
                                    {onViewStatistics && (
                                        <Button variant="outline" onClick={onViewStatistics}>
                                            <Hash className="h-4 w-4 mr-2"/>
                                            İstatistikleri Görüntüle
                                        </Button>
                                    )}
                                    {onManageSupervisors && (
                                        <Button variant="outline" onClick={onManageSupervisors}>
                                            <UserCheck className="h-4 w-4 mr-2"/>
                                            Gözetmenleri Yönet
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Değerlendirme Sekmesi */}
                {activeTab === "evaluation" && (
                    <>
                        {(() => {
                            // Debug: isFinish değerini kontrol et
                            return examSession.isFinish;
                        })() ? (
                            <ExamEvaluationPanel sessionId={examSession.id || ''} candidates ={examSessionApplications ? examSessionApplications : []}/>
                        ) : (
                            <div className="flex items-center justify-center">
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-2xl border-4 border-yellow-400 p-8 max-w-2xl w-full mx-4">
                                    <div className="text-center">
                                        <div className="mb-6">
                                            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500 rounded-full mb-4">
                                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                                            Sınav Tamamlanmadan Değerlendirme Yapılamaz
                                        </h2>
                                        <p className="text-lg text-gray-600">
                                            Lütfen önce sınav oturumunu sonlandırın.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
        <ExamParticipants candidates ={examSessionApplications ? examSessionApplications : []}/>
</> );
};

export default ExamSessionDetail;