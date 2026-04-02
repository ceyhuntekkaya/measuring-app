'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Clock, User as UserIcon, Phone, Mail, MapPin, Globe, Calendar, IdCard, Key, CheckCircle, XCircle} from 'lucide-react';
import type {CandidateDto} from '@/api/generated/model/candidateDto';
import { formatDate } from '@/utils/date-formater';
import { getSessionStateLabel } from '@/utils/sessionStateLabel';
import LoadingComp from "@/components/ui/loading-comp";
import siteConfig from "@/config/config.json";
import ImageLightbox from "@/components/ui/image-lightbox";
import {useResetPassword} from "@/api/generated/candidate-management/candidate-management";
import {getErrorMessage, showNotification} from "@/lib/notification";

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
    const [activeTab, setActiveTab] = useState("candidate");
    const UPLOAD_SERVE_BASE_URL = siteConfig.api.invokeUrl + "/upload/serve";
    const resetPasswordMutation = useResetPassword();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [isPasswordPanelVisible, setIsPasswordPanelVisible] = useState(false);

    const getApplicationExamName = () => candidate.application?.examName || candidate.examSession?.examTemplate || '';
    const getApplicationSessionName = () => candidate.application?.examSessionName || candidate.examSession?.name || '';

    if (isLoading) {
        return (
            <LoadingComp/>
        );
    }

    const handleResetPasswordByUsername = async () => {
        if (!candidate.username) {
            showNotification.error("Kullanıcı adı bulunamadı");
            return;
        }

        if (!newPassword || !confirmPassword) {
            showNotification.error("Yeni şifre ve tekrar alanları zorunludur");
            return;
        }

        if (newPassword.length < 6) {
            showNotification.error("Yeni şifre en az 6 karakter olmalıdır");
            return;
        }

        if (newPassword !== confirmPassword) {
            showNotification.error("Yeni şifre ve tekrar aynı olmalıdır");
            return;
        }

        try {
            setIsResettingPassword(true);
            await resetPasswordMutation.mutateAsync({
                data: { username: candidate.username, newPassword },
            });
            showNotification.success("Şifre başarıyla güncellendi");
            setNewPassword("");
            setConfirmPassword("");
            setIsPasswordPanelVisible(false);
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            showNotification.error(errorMessage || "Şifre güncellenirken bir hata oluştu");
        } finally {
            setIsResettingPassword(false);
        }
    };

    return (
        <div className="container mx-auto py-4 space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">  {`${candidate.name || ''} ${candidate.lastName || ''}`.trim() || '—'}</h1>
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
                        onClick={() => setActiveTab("candidate")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "candidate"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Aday Bilgileri
                    </button>
                    <button
                        onClick={() => setActiveTab("exam")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "exam"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Sınav Bilgileri
                    </button>
                </nav>
            </div>

            {/* Sekme İçeriği */}
            <div className="mt-4">
                {/* Aday Bilgileri Sekmesi */}
                {activeTab === "candidate" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Temel Bilgiler</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <UserIcon className="h-5 w-5 text-gray-600"/>
                                        <span>Ad Soyad</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {`${candidate.name || ''} ${candidate.lastName || ''}`.trim() || '—'}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <UserIcon className="h-5 w-5 text-gray-600"/>
                                        <span>Kullanıcı Adı</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {candidate.username || '—'}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <Key className="h-5 w-5 text-blue-500"/>
                                        <span>Rol</span>
                                    </div>
                                    <Badge className="bg-blue-100 text-blue-800">
                                        {candidate.role || 'CANDIDATE'}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <IdCard className="h-5 w-5 text-gray-600"/>
                                        <span>Kimlik Numarası</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {candidate.identityNumber || '—'}
                                    </p>
                                </div>

                                {candidate.birthDate && (
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="h-5 w-5 text-gray-600"/>
                                            <span>Doğum Tarihi</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatDate(candidate.birthDate)}
                                        </p>
                                    </div>
                                )}

                                {(candidate.birthPlace || candidate.fatherName) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {candidate.birthPlace && (
                                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                                <div className="flex items-center space-x-3">
                                                    <MapPin className="h-5 w-5 text-gray-600"/>
                                                    <span>Doğum Yeri</span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {candidate.birthPlace}
                                                </p>
                                            </div>
                                        )}
                                        {candidate.fatherName && (
                                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                                <div className="flex items-center space-x-3">
                                                    <UserIcon className="h-5 w-5 text-gray-600"/>
                                                    <span>Baba Adı</span>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {candidate.fatherName}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="pt-2 border-t border-gray-200">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="text-sm font-semibold text-gray-900">Şifre Güncelleme</div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsPasswordPanelVisible((v) => !v)}
                                        >
                                            {isPasswordPanelVisible ? "Kapat" : "Şifre Güncelle"}
                                        </Button>
                                    </div>

                                    {isPasswordPanelVisible && (
                                        <div className="mt-3 p-4 bg-gray-50 rounded-md space-y-3">
                                            <p className="text-sm text-gray-600">
                                                Kullanıcı şifresini unuttuysa buradan yeni bir şifre belirleyebilirsiniz.
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <div className="text-xs font-semibold text-gray-700">Yeni Şifre</div>
                                                    <Input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        placeholder="Yeni şifre"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-xs font-semibold text-gray-700">Yeni Şifre (Tekrar)</div>
                                                    <Input
                                                        type="password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        placeholder="Yeni şifre tekrar"
                                                        error={Boolean(confirmPassword) && newPassword !== confirmPassword}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <Button
                                                    variant="outline"
                                                    onClick={handleResetPasswordByUsername}
                                                    disabled={isResettingPassword || resetPasswordMutation.isPending}
                                                >
                                                    {isResettingPassword || resetPasswordMutation.isPending ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="md:col-start-2 md:row-start-1 space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>İletişim Bilgileri</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {candidate.mobilePhone && (
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                            <div className="flex items-center space-x-3">
                                                <Phone className="h-5 w-5 text-gray-600"/>
                                                <span>Cep Telefonu</span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">
                                                <a href={`tel:${candidate.mobilePhone}`} className="text-blue-600 hover:text-blue-800">
                                                    {candidate.mobilePhone}
                                                </a>
                                            </p>
                                        </div>
                                    )}

                                    {candidate.gsmPhone && (
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                            <div className="flex items-center space-x-3">
                                                <Phone className="h-5 w-5 text-gray-600"/>
                                                <span>GSM Telefonu</span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">
                                                <a href={`tel:${candidate.gsmPhone}`} className="text-blue-600 hover:text-blue-800">
                                                    {candidate.gsmPhone}
                                                </a>
                                            </p>
                                        </div>
                                    )}

                                    {candidate.email && (
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                            <div className="flex items-center space-x-3">
                                                <Mail className="h-5 w-5 text-gray-600"/>
                                                <span>E-posta</span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">
                                                <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:text-blue-800">
                                                    {candidate.email}
                                                </a>
                                            </p>
                                        </div>
                                    )}

                                    {candidate.address && (
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                            <div className="flex items-center space-x-3">
                                                <MapPin className="h-5 w-5 text-gray-600"/>
                                                <span>Adres</span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 text-right">
                                                {candidate.address}
                                            </p>
                                        </div>
                                    )}

                                    {(candidate.city || candidate.country) && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {candidate.city && (
                                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                                    <div className="flex items-center space-x-3">
                                                        <MapPin className="h-5 w-5 text-gray-600"/>
                                                        <span>Şehir</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {candidate.city}
                                                    </p>
                                                </div>
                                            )}
                                            {candidate.country && (
                                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                                    <div className="flex items-center space-x-3">
                                                        <MapPin className="h-5 w-5 text-gray-600"/>
                                                        <span>Ülke</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {candidate.country}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {candidate.mainTongue && (
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                            <div className="flex items-center space-x-3">
                                                <Globe className="h-5 w-5 text-gray-600"/>
                                                <span>Ana Dil</span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {candidate.mainTongue}
                                            </p>
                                        </div>
                                    )}

                                    {!candidate.mobilePhone &&
                                        !candidate.gsmPhone &&
                                        !candidate.email &&
                                        !candidate.address &&
                                        !candidate.city &&
                                        !candidate.country &&
                                        !candidate.mainTongue && (
                                            <p className="text-gray-500 italic text-center py-4">
                                                İletişim bilgisi bulunmamaktadır.
                                            </p>
                                        )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Hesap Durumu</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
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

                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Yüklenen Dosyalar</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        {key: 'photoUrl' as const, title: 'Vesikalık Fotoğraf', kind: 'image'},
                                        {key: 'idCartUrl' as const, title: 'Kimlik Fotoğrafı', kind: 'image'},
                                        {key: 'voiceUrl' as const, title: 'Ses Kaydı', kind: 'audio'},
                                    ].map(({key, title, kind}) => {
                                        const path = candidate[key] || '';
                                        const fullUrl = path ? `${UPLOAD_SERVE_BASE_URL}/${path}` : undefined;

                                        return (
                                            <div key={key} className="p-4 rounded-lg border bg-gray-50 space-y-3">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="font-semibold text-gray-900">{title}</div>
                                                    <Badge className={fullUrl ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                                        {fullUrl ? 'Yüklendi' : 'Yok'}
                                                    </Badge>
                                                </div>

                                                {fullUrl && kind === 'image' && (
                                                    <ImageLightbox src={fullUrl} alt={title} title={title}>
                                                        <img
                                                            src={fullUrl}
                                                            alt={title}
                                                            className="w-full h-40 object-cover rounded border bg-white cursor-zoom-in"
                                                        />
                                                    </ImageLightbox>
                                                )}

                                                {fullUrl && kind === 'audio' && (
                                                    <audio controls src={fullUrl} className="w-full" preload="metadata">
                                                        Tarayıcınız ses oynatmayı desteklemiyor.
                                                    </audio>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        

                        
                    </div>
                )}

                {/* Sınav Bilgileri Sekmesi */}
                {activeTab === "exam" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Katıldığı Sınav</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <Key className="h-5 w-5 text-blue-500"/>
                                        <span>Sınav</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {getApplicationExamName() || '—'}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-blue-500"/>
                                        <span>Oturum</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {getApplicationSessionName() || '—'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <IdCard className="h-5 w-5 text-gray-600"/>
                                            <span>Sınav ID</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {candidate.application?.examId || '—'}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <IdCard className="h-5 w-5 text-gray-600"/>
                                            <span>Oturum ID</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {candidate.application?.examSessionId || candidate.examSessionId || '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="h-5 w-5 text-gray-600"/>
                                            <span>Oturum Başlangıç</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {candidate.examSession?.beginAt ? formatDate(candidate.examSession.beginAt) : '—'}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="h-5 w-5 text-gray-600"/>
                                            <span>Oturum Bitiş</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {candidate.examSession?.endAt ? formatDate(candidate.examSession.endAt) : '—'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Key className="h-5 w-5 text-gray-600"/>
                                            <span>Sınav Tipi</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {candidate.examSession?.examType?.name || '—'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Başvuru Durumu</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-blue-500"/>
                                        <span>Başlatıldı</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {candidate.application?.startedAt ? formatDate(candidate.application.startedAt) : '—'}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-blue-500"/>
                                        <span>Bitti</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {candidate.application?.endedAt ? formatDate(candidate.application.endedAt) : '—'}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="h-5 w-5 text-green-500"/>
                                        <span>Tamamlandı</span>
                                    </div>
                                    <Badge className={(candidate.application?.isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>
                                        {candidate.application?.isCompleted ? 'Evet' : 'Hayır'}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className={`h-5 w-5 ${candidate.application?.isEvaluated ? 'text-green-500' : 'text-yellow-500'}`}/>
                                        <span>Değerlendirildi</span>
                                    </div>
                                    <Badge className={(candidate.application?.isEvaluated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>
                                        {candidate.application?.isEvaluated ? 'Evet' : 'Hayır'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Sonuç</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        <Key className="h-5 w-5 text-blue-500"/>
                                        <span>Puan</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {candidate.application?.score ?? '—'}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                    <div className="flex items-center space-x-3">
                                        {candidate.application?.isSuccessful ? (
                                            <CheckCircle className="h-5 w-5 text-green-500"/>
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500"/>
                                        )}
                                        <span>Başarılı</span>
                                    </div>
                                    {candidate.application?.isSuccessful === undefined || candidate.application?.isSuccessful === null ? (
                                        <p className="text-sm font-medium text-gray-900">—</p>
                                    ) : (
                                        <Badge className={candidate.application?.isSuccessful ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                            {candidate.application?.isSuccessful ? 'Evet' : 'Hayır'}
                                        </Badge>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Key className="h-5 w-5 text-gray-600"/>
                                            <span>Sınav Türü</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {candidate.application?.examType || '—'}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Clock className="h-5 w-5 text-gray-600"/>
                                            <span>Oturum Durumu</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {candidate.application?.sessionState
                                                ? getSessionStateLabel(candidate.application.sessionState)
                                                : '—'}
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

export default CandidateDetailPage;