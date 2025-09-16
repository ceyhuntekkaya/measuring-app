'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
    Clock, User, Hash, CheckCircle, XCircle, Building, Mail, Phone,
    Shield, Users, Building2, Key, UserCheck, UserX, Settings,
    Calendar, Activity, Info
} from 'lucide-react';
import {UserDto, Permission, Department, Role} from '@/types/auth';
import {BrandDto} from '@/types/management/brand';
import { formatDate } from '@/utils/date-formater';
import LoadingComp from "@/components/ui/loading-comp";

interface UserDetailProps {
    user: UserDto;
    brands?: BrandDto[];
    isLoading?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onActivate?: () => void;
    onDeactivate?: () => void;
    onResetPassword?: () => void;
    onChangePassword?: () => void;
    onViewActivity?: () => void;
    onImpersonate?: () => void;
}

const UserDetailPage: React.FC<UserDetailProps> = ({
                                                       user,
                                                       brands = [],
                                                       isLoading = false,
                                                       onEdit,
                                                       onDelete,
                                                       onActivate,
                                                       onDeactivate,
                                                       onResetPassword,
                                                       onChangePassword,
                                                       onViewActivity,
                                                       onImpersonate,
                                                   }) => {
    const [activeTab, setActiveTab] = useState("personal");

    if (isLoading) {
        return <LoadingComp/>;
    }

    const getUserBrands = () => {
        return user.brandSet?.map(userBrand =>
            brands.find(brand => brand.id === userBrand.id) || userBrand
        ) || [];
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'DELETED': return 'bg-red-100 text-red-800';
            case 'INACTIVE': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'Aktif';
            case 'DELETED': return 'Silinmiş';
            case 'INACTIVE': return 'Pasif';
            default: return status || 'Bilinmeyen';
        }
    };

    const getDaysAgo = (dateString: string | null) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Detayı</h1>
                    <p className="text-gray-500">{user.name} {user.lastName} ({user.username})</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                </div>
                <div className="flex space-x-3">
                    {onEdit && (
                        <Button variant="outline" onClick={onEdit}>
                            <Settings className="h-4 w-4 mr-2"/>
                            Düzenle
                        </Button>
                    )}
                    {user.enabled && onDeactivate && (
                        <Button variant="outline" onClick={onDeactivate}>
                            <UserX className="h-4 w-4 mr-2"/>
                            Deaktive Et
                        </Button>
                    )}
                    {!user.enabled && onActivate && (
                        <Button variant="outline" onClick={onActivate}>
                            <UserCheck className="h-4 w-4 mr-2"/>
                            Aktive Et
                        </Button>
                    )}
                    {onResetPassword && (
                        <Button variant="outline" onClick={onResetPassword}>
                            <Key className="h-4 w-4 mr-2"/>
                            Şifre Sıfırla
                        </Button>
                    )}
                    {onImpersonate && (
                        <Button variant="outline" onClick={onImpersonate}>
                            <User className="h-4 w-4 mr-2"/>
                            Taklit Et
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
                        onClick={() => setActiveTab("personal")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "personal"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Kişisel Bilgiler
                    </button>
                    <button
                        onClick={() => setActiveTab("permissions")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "permissions"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Yetkiler & Roller
                    </button>
                    <button
                        onClick={() => setActiveTab("brands")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "brands"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Markalar & Departmanlar
                    </button>
                    <button
                        onClick={() => setActiveTab("activity")}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === "activity"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                        Hesap Durumu
                    </button>
                </nav>
            </div>

            {/* Sekme İçeriği */}
            <div className="mt-6">
                {/* Kişisel Bilgiler Sekmesi */}
                {activeTab === "personal" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <User className="h-5 w-5"/>
                                    <span>Temel Bilgiler</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <User className="h-6 w-6 text-blue-600"/>
                                    </div>
                                    <div>
                                        <p className="font-medium">{user.name} {user.lastName}</p>
                                        <p className="text-sm text-gray-500">Ad Soyad</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Hash className="h-4 w-4 text-gray-400"/>
                                        <div>
                                            <p className="text-sm text-gray-500">Kullanıcı Adı</p>
                                            <p className="font-medium">{user.username}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-gray-400"/>
                                        <div>
                                            <p className="text-sm text-gray-500">E-posta</p>
                                            <p className="font-medium">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-gray-400"/>
                                        <div>
                                            <p className="text-sm text-gray-500">Telefon</p>
                                            <p className="font-medium">{user.mobilePhone || 'Belirtilmemiş'}</p>
                                        </div>
                                    </div>

                                    {user.identityNumber && (
                                        <div className="flex items-center space-x-2">
                                            <Info className="h-4 w-4 text-gray-400"/>
                                            <div>
                                                <p className="text-sm text-gray-500">TC Kimlik No</p>
                                                <p className="font-medium font-mono">{user.identityNumber}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">Kullanıcı ID</p>
                                    <p className="font-mono text-sm bg-gray-50 p-2 rounded border">
                                        {user.id}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Activity className="h-5 w-5"/>
                                    <span>Aktivite Bilgileri</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            {user.status === 'ACTIVE' ? (
                                                <CheckCircle className="h-5 w-5 text-green-500"/>
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500"/>
                                            )}
                                            <span>Hesap Durumu</span>
                                        </div>
                                        <Badge className={getStatusColor(user.status as string)}>
                                            {getStatusText(user.status as string)}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Clock className="h-5 w-5 text-blue-500"/>
                                            <span>Kayıt Tarihi</span>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {formatDate(user.createdAt || '')}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="h-5 w-5 text-green-500"/>
                                            <span>Son Giriş</span>
                                        </div>
                                        <div className="text-right">
                                            {user.lastLoginTime ? (
                                                <>
                                                    <p className="text-sm font-medium">
                                                        {formatDate(user.lastLoginTime)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {getDaysAgo(user.lastLoginTime)} gün önce
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-sm text-gray-500">Hiç giriş yapmamış</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            <Key className="h-5 w-5 text-purple-500"/>
                                            <span>Aktivasyon Kodu</span>
                                        </div>
                                        <p className="text-sm font-medium font-mono">
                                            {user.activationCode}
                                        </p>
                                    </div>
                                </div>

                                {onViewActivity && (
                                    <Button variant="outline" onClick={onViewActivity} className="w-full">
                                        <Activity className="h-4 w-4 mr-2"/>
                                        Detaylı Aktivite Geçmişi
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Yetkiler & Roller Sekmesi */}
                {activeTab === "permissions" && (
                    <div className="grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Shield className="h-5 w-5"/>
                                        <span>Roller</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {user.roleSet?.length > 0 ? (
                                            user.roleSet.map((role: Role) => (
                                                <Badge key={role} variant="secondary">
                                                    {role}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">Rol atanmamış</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Users className="h-5 w-5"/>
                                        <span>Departmanlar</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {user.departmentSet?.length > 0 ? (
                                            user.departmentSet.map((dept: Department) => (
                                                <Badge key={dept} variant="outline">
                                                    {dept}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">Departman atanmamış</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Key className="h-5 w-5"/>
                                    <span>Yetkiler</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {user.authoritySet?.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                        {user.authoritySet.map((permission: Permission) => (
                                            <Badge key={permission} variant="default" className="text-xs">
                                                {permission}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Özel yetki atanmamış</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Markalar & Departmanlar Sekmesi */}
                {activeTab === "brands" && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Building2 className="h-5 w-5"/>
                                    <span>Bağlı Markalar</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {getUserBrands().length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {getUserBrands().map((brand) => (
                                            <div key={brand.id} className="p-4 border rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-blue-100 p-2 rounded-full">
                                                        <Building className="h-5 w-5 text-blue-600"/>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{brand.name}</p>
                                                        <p className="text-sm text-gray-500">Kod: {brand.code}</p>
                                                        {brand.email && (
                                                            <p className="text-xs text-gray-400">{brand.email}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Marka atanmamış</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Yetki Özeti</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2"/>
                                        <p className="font-medium text-blue-900">{user.roleSet?.length || 0}</p>
                                        <p className="text-sm text-blue-700">Rol</p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <Users className="h-8 w-8 text-green-600 mx-auto mb-2"/>
                                        <p className="font-medium text-green-900">{user.departmentSet?.length || 0}</p>
                                        <p className="text-sm text-green-700">Departman</p>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2"/>
                                        <p className="font-medium text-purple-900">{user.brandSet?.length || 0}</p>
                                        <p className="text-sm text-purple-700">Marka</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Hesap Durumu Sekmesi */}
                {activeTab === "activity" && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <UserCheck className="h-5 w-5"/>
                                    <span>Hesap Durumu</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            {user.enabled ? (
                                                <CheckCircle className="h-5 w-5 text-green-500"/>
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500"/>
                                            )}
                                            <span>Hesap Durumu</span>
                                        </div>
                                        <Badge className={user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                            {user.enabled ? 'Aktif' : 'Pasif'}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            {user.accountNonLocked ? (
                                                <CheckCircle className="h-5 w-5 text-green-500"/>
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500"/>
                                            )}
                                            <span>Hesap Kilidi</span>
                                        </div>
                                        <Badge className={user.accountNonLocked ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                            {user.accountNonLocked ? 'Kilitli Değil' : 'Kilitli'}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            {user.accountNonExpired ? (
                                                <CheckCircle className="h-5 w-5 text-green-500"/>
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500"/>
                                            )}
                                            <span>Hesap Süresi</span>
                                        </div>
                                        <Badge className={user.accountNonExpired ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                            {user.accountNonExpired ? 'Geçerli' : 'Süresi Dolmuş'}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center space-x-3">
                                            {user.credentialsNonExpired ? (
                                                <CheckCircle className="h-5 w-5 text-green-500"/>
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500"/>
                                            )}
                                            <span>Şifre Süresi</span>
                                        </div>
                                        <Badge className={user.credentialsNonExpired ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                            {user.credentialsNonExpired ? 'Geçerli' : 'Süresi Dolmuş'}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="font-medium text-gray-900 mb-3">Hızlı İşlemler</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {onChangePassword && (
                                            <Button variant="outline" size="sm" onClick={onChangePassword}>
                                                <Key className="h-4 w-4 mr-1"/>
                                                Şifre Değiştir
                                            </Button>
                                        )}
                                        {onResetPassword && (
                                            <Button variant="outline" size="sm" onClick={onResetPassword}>
                                                <Key className="h-4 w-4 mr-1"/>
                                                Şifre Sıfırla
                                            </Button>
                                        )}
                                        {user.enabled && onDeactivate && (
                                            <Button variant="outline" size="sm" onClick={onDeactivate}>
                                                <UserX className="h-4 w-4 mr-1"/>
                                                Deaktive Et
                                            </Button>
                                        )}
                                        {!user.enabled && onActivate && (
                                            <Button variant="outline" size="sm" onClick={onActivate}>
                                                <UserCheck className="h-4 w-4 mr-1"/>
                                                Aktive Et
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Kayıt Zaman Çizelgesi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex">
                                        <div className="mr-4 flex-shrink-0">
                                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600">
                                                <User className="h-5 w-5"/>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Kullanıcı Oluşturuldu</p>
                                            <p className="text-sm text-gray-500">{formatDate(user.createdAt || '')}</p>
                                            {user.createdById && (
                                                <p className="text-xs text-gray-400">Oluşturan ID: {user.createdById}</p>
                                            )}
                                        </div>
                                    </div>

                                    {user.lastLoginTime && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600">
                                                    <Calendar className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Son Giriş</p>
                                                <p className="text-sm text-gray-500">{formatDate(user.lastLoginTime)}</p>
                                                <p className="text-xs text-gray-400">{getDaysAgo(user.lastLoginTime)} gün önce</p>
                                            </div>
                                        </div>
                                    )}

                                    {user.status === 'DELETED' && user.deletedAt && (
                                        <div className="flex">
                                            <div className="mr-4 flex-shrink-0">
                                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 text-red-600">
                                                    <XCircle className="h-5 w-5"/>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Kullanıcı Silindi</p>
                                                <p className="text-sm text-gray-500">{formatDate(user.deletedAt)}</p>
                                                {user.deletedById && (
                                                    <p className="text-xs text-gray-400">Silen ID: {user.deletedById}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetailPage;