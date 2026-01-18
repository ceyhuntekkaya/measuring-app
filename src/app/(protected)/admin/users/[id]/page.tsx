'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetUserById, useDeleteUser, useActivateUser, useResetPassword } from '@/api/generated/user-management/user-management';
import { useGetAllBrands } from '@/api/generated/brand-management/brand-management';
import type { ApiResponseListBrandDto, ApiResponseUserDto } from '@/api/generated/model';
import UserDetailPage from '@/components/detail/UserDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {showNotification} from "@/lib/notification";

const UserDetailPageContainer: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const {data: userData, isLoading: loading, error} = useGetUserById(userId, {
        query: { enabled: !!userId }
    });
    const selectedUser = (userData as unknown as ApiResponseUserDto)?.data;
    
    const deleteUserMutation = useDeleteUser();
    const activateUserMutation = useActivateUser();
    const resetPasswordMutation = useResetPassword();

    const { data: brandsData } = useGetAllBrands();
    const brands = (brandsData as unknown as ApiResponseListBrandDto)?.data || null;

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showActivateDialog, setShowActivateDialog] = useState(false);
    const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
    const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Error handling
    useEffect(() => {
        if (error) {
            showNotification.error('Kullanıcı bilgileri yüklenirken bir hata oluştu');
            console.error('User detail error:', error);
        }
    }, [error]);

    // Event handlers
    const handleEdit = () => {
        router.push(`/admin/users/${userId}/edit`);
    };

    const handleDelete = async () => {
        if (!selectedUser) return;

        try {
            setActionLoading('delete');
            await deleteUserMutation.mutateAsync({ id: selectedUser.id || '' });
            showNotification.success('Kullanıcı başarıyla silindi');
            router.push('/users');
        } catch (error) {
            console.log(error)
            showNotification.error('Kullanıcı silinirken bir hata oluştu');
        } finally {
            setActionLoading(null);
            setShowDeleteDialog(false);
        }
    };

    const handleActivate = async () => {
        if (!selectedUser) return;

        const activationCode = selectedUser.activationCode;
        if (!activationCode) return;

        try {
            setActionLoading('activate');
            await activateUserMutation.mutateAsync({ activationCode });
            showNotification.success('Kullanıcı başarıyla aktive edildi');
        } catch (error) {
            console.log(error)
            showNotification.error('Kullanıcı aktive edilirken bir hata oluştu');
        } finally {
            setActionLoading(null);
            setShowActivateDialog(false);
        }
    };

    const handleDeactivate = async () => {
        if (!selectedUser) return;

        try {
            setActionLoading('deactivate');
            // Deaktive etmek için updateUser kullanabilirsin
            // Bu örnekte placeholder olarak bırakıyorum
            showNotification.info('Deaktive etme işlemi için API endpoint\'i implement edilmeli');
        } catch (error) {
            console.log(error)
            showNotification.error('Kullanıcı deaktive edilirken bir hata oluştu');
        } finally {
            setActionLoading(null);
            setShowDeactivateDialog(false);
        }
    };

    const handleResetPassword = async () => {
        if (!selectedUser) return;

        try {
            setActionLoading('resetPassword');
            await resetPasswordMutation.mutateAsync({ data: { email: selectedUser.email } });
            showNotification.success('Şifre sıfırlama e-postası gönderildi');
        } catch (error) {
            console.log(error)
            showNotification.error('Şifre sıfırlanırken bir hata oluştu');
        } finally {
            setActionLoading(null);
            setShowResetPasswordDialog(false);
        }
    };

    const handleChangePassword = () => {
        router.push(`/users/${userId}/change-password`);
    };

    const handleViewActivity = () => {
        router.push(`/users/${userId}/activity`);
    };

    const handleImpersonate = () => {
        if (!selectedUser) return;

        // Impersonate işlemi için güvenlik kontrolü
        const confirmImpersonate = window.confirm(
            `${selectedUser.name} ${selectedUser.lastName} kullanıcısı olarak giriş yapmak istediğinizden emin misiniz?`
        );

        if (confirmImpersonate) {
            // Impersonate işlemi burada implement edilecek
            showNotification.info('Kullanıcı taklit etme işlemi için API endpoint\'i implement edilmeli');
        }
    };

    const handleGoBack = () => {
        router.back();
    };

    // Loading state
    if (loading && !selectedUser) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex items-center space-x-4 mb-6">
                    <Button variant="outline" onClick={handleGoBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri
                    </Button>
                </div>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Kullanıcı bilgileri yükleniyor...</span>
                    </div>
                </div>
            </div>
        );
    }

    // User not found
    if (!loading && !selectedUser) {
        return (
            <div className="container mx-auto py-6">
                <div className="flex items-center space-x-4 mb-6">
                    <Button variant="outline" onClick={handleGoBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Geri
                    </Button>
                </div>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Kullanıcı Bulunamadı</h2>
                    <p className="text-gray-600 mb-4">
                        Aradığınız kullanıcı mevcut değil veya erişim yetkiniz bulunmuyor.
                    </p>
                    <Button onClick={() => router.push('/users')}>
                        Kullanıcı Listesine Dön
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Navigation */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
                <div className="container mx-auto">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" onClick={handleGoBack}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Geri
                        </Button>
                        <div className="flex-1">
                            <nav className="text-sm">
                                <span className="text-gray-500">Kullanıcılar</span>
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="text-gray-900">
                                    {selectedUser?.name} {selectedUser?.lastName}
                                </span>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4">
                <UserDetailPage
                    user={selectedUser!}
                    brands={brands || []}
                    isLoading={loading}
                    onEdit={handleEdit}
                    onDelete={() => setShowDeleteDialog(true)}
                    onActivate={selectedUser?.enabled ? undefined : () => setShowActivateDialog(true)}
                    onDeactivate={selectedUser?.enabled ? () => setShowDeactivateDialog(true) : undefined}
                    onResetPassword={() => setShowResetPasswordDialog(true)}
                    onChangePassword={handleChangePassword}
                    onViewActivity={handleViewActivity}
                    onImpersonate={handleImpersonate}
                />
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="font-semibold">{selectedUser?.name} {selectedUser?.lastName}</span>
                            {' '}kullanıcısını silmek istediğinizden emin misiniz?
                            Bu işlem geri alınamaz ve kullanıcının tüm verileri silinecektir.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={actionLoading === 'delete'}>
                            İptal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={actionLoading === 'delete'}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {actionLoading === 'delete' ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Siliniyor...
                                </>
                            ) : (
                                'Sil'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Activate Confirmation Dialog */}
            <AlertDialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Kullanıcıyı Aktive Et</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="font-semibold">{selectedUser?.name} {selectedUser?.lastName}</span>
                            {' '}kullanıcısını aktive etmek istediğinizden emin misiniz?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={actionLoading === 'activate'}>
                            İptal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleActivate}
                            disabled={actionLoading === 'activate'}
                        >
                            {actionLoading === 'activate' ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Aktive Ediliyor...
                                </>
                            ) : (
                                'Aktive Et'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Deactivate Confirmation Dialog */}
            <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Kullanıcıyı Deaktive Et</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="font-semibold">{selectedUser?.name} {selectedUser?.lastName}</span>
                            {' '}kullanıcısını deaktive etmek istediğinizden emin misiniz?
                            Kullanıcı sisteme giriş yapamayacaktır.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={actionLoading === 'deactivate'}>
                            İptal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeactivate}
                            disabled={actionLoading === 'deactivate'}
                        >
                            {actionLoading === 'deactivate' ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Deaktive Ediliyor...
                                </>
                            ) : (
                                'Deaktive Et'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reset Password Confirmation Dialog */}
            <AlertDialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Şifre Sıfırla</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className="font-semibold">{selectedUser?.name} {selectedUser?.lastName}</span>
                            {' '}kullanıcısının şifresini sıfırlamak istediğinizden emin misiniz?
                            Kullanıcıya e-posta ile yeni şifre gönderilecektir.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={actionLoading === 'resetPassword'}>
                            İptal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleResetPassword}
                            disabled={actionLoading === 'resetPassword'}
                        >
                            {actionLoading === 'resetPassword' ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Sıfırlanıyor...
                                </>
                            ) : (
                                'Şifre Sıfırla'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default UserDetailPageContainer;