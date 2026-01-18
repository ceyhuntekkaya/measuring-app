'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumberInput } from "@/components/ui/number-input";
import Checkbox from "@/components/ui/checkbox";
import type { CreateApplicationGraderRequest, UpdateApplicationGraderRequest, ApplicationGraderDto, ApplicationDto } from "@/api/generated/model";

// Basit user type'ı
interface UserOption {
    id: string;
    name: string;
    lastName: string;
    email?: string;
}


interface ApplicationGraderFormErrors {
    userId?: string;
    applicationId?: string;
    endEndDate?: string;
    orderNumber?: string;
}

interface ApplicationGraderFormProps {
    onSubmit: (data: CreateApplicationGraderRequest | UpdateApplicationGraderRequest) => void;
    grader?: ApplicationGraderDto | null;
    users: UserOption[];
    applications: ApplicationDto[];
    existingGraders?: ApplicationGraderDto[];
    loading?: boolean;
    mode?: 'create' | 'update';
}

const ApplicationGraderForm: React.FC<ApplicationGraderFormProps> = ({
                                                                         onSubmit,
                                                                         grader,
                                                                         users,
                                                                         applications,
                                                                         existingGraders = [],
                                                                         loading = false,
                                                                         mode = 'create'
                                                                     }) => {
    const [formData, setFormData] = useState<CreateApplicationGraderRequest>({
        userId: '',
        applicationId: '',
        endEndDate: undefined,
        orderNumber: 1,
        isReferee: false
    });

    const [errors, setErrors] = useState<ApplicationGraderFormErrors>({});

    useEffect(() => {
        if (grader) {
            setFormData({
                userId: grader.userId || '',
                applicationId: grader.applicationId || '',
                endEndDate: grader.endEndDate ? grader.endEndDate.split('T')[0] : undefined,
                orderNumber: grader.orderNumber || 1,
                isReferee: grader.isReferee || false
            });
        }
    }, [grader]);

    // Otomatik order number belirleme
    useEffect(() => {
        if (mode === 'create' && formData.applicationId && !grader) {
            const appGraders = existingGraders.filter(g => g.applicationId === formData.applicationId);
            const maxOrder = appGraders.length > 0 ? Math.max(...appGraders.map(g => g.orderNumber || 0)) : 0;
            setFormData(prev => ({
                ...prev,
                orderNumber: maxOrder + 1
            }));
        }
    }, [formData.applicationId, existingGraders, mode, grader]);

    const handleChange = <T extends keyof CreateApplicationGraderRequest>(
        name: T,
        value: CreateApplicationGraderRequest[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: ApplicationGraderFormErrors = {};

        if (!formData.userId) {
            newErrors.userId = 'Değerlendirici seçimi zorunludur';
        }

        if (!formData.applicationId && mode === 'create') {
            newErrors.applicationId = 'Başvuru seçimi zorunludur';
        }

        if (formData.orderNumber !== undefined && formData.orderNumber < 1) {
            newErrors.orderNumber = 'Sıra numarası 1\'den küçük olamaz';
        }

        // Aynı başvuru için aynı order number kontrolü
        if (formData.applicationId) {
            const appGraders = existingGraders.filter(g =>
                g.applicationId === formData.applicationId &&
                (mode === 'update' ? g.id !== grader?.id : true)
            );

            const orderExists = appGraders.some(g => g.orderNumber === formData.orderNumber);
            if (orderExists) {
                newErrors.orderNumber = 'Bu sıra numarası bu başvuru için zaten kullanılmakta';
            }

            // Aynı kullanıcının aynı başvuruya atanma kontrolü
            const userExists = appGraders.some(g => g.userId === formData.userId);
            if (userExists && mode === 'create') {
                newErrors.userId = 'Bu değerlendirici zaten bu başvuruya atanmış';
            }
        }

        if (formData.endEndDate) {
            const selectedDate = new Date(formData.endEndDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.endEndDate = 'Bitiş tarihi bugünden önce olamaz';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Directly use formData - no manual mapping needed!
            if (mode === 'create') {
                onSubmit(formData as CreateApplicationGraderRequest);
            } else {
                const submitData: UpdateApplicationGraderRequest = {
                    endEndDate: formData.endEndDate,
                    orderNumber: formData.orderNumber,
                    isReferee: formData.isReferee
                };
                onSubmit(submitData);
            }
        }
    };

    const selectedUser = users.find(u => u.id === formData.userId);
    const selectedApplication = applications.find(a => a.id === formData.applicationId);
    const applicationGraders = existingGraders.filter(g => g.applicationId === formData.applicationId);

    // Tamamlanmış başvuruları filtrele
    const completedApplications = applications.filter(app => app.isCompleted && !app.isEvaluated);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {grader ? "Değerlendirici Ataması Güncelle" : "Yeni Değerlendirici Ata"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Değerlendirici Seçimi */}
                        <div className="space-y-2">
                            <Label htmlFor="userId">Değerlendirici *</Label>
                            <Select
                                onValueChange={(value) => handleChange('userId', value as string)}
                                value={formData.userId}
                                disabled={grader?.isCompleted}
                            >
                                <SelectTrigger className={errors.userId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Değerlendirici seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {users.filter(user => user.id).map((user) => (
                                            <SelectItem key={user.id} value={user.id!}>
                                                {user.name} {user.lastName}
                                                {user.email && <span className="text-gray-500 ml-2">({user.email})</span>}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.userId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.userId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Sıra Numarası */}
                        <div className="space-y-2">
                            <Label htmlFor="orderNumber">Sıra Numarası *</Label>
                            <NumberInput
                                id="orderNumber"
                                inputType="number"
                                value={formData.orderNumber}
                                onChange={(value) => handleChange('orderNumber', value)}
                                minValue={1}
                                maxValue={100}
                                decimalPlaces={0}
                                className={errors.orderNumber ? 'border-red-500' : ''}
                                disabled={grader?.isCompleted}
                            />
                            {errors.orderNumber && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.orderNumber}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    {/* Başvuru Seçimi (sadece create modunda) */}
                    {mode === 'create' && (
                        <div className="space-y-2">
                            <Label htmlFor="applicationId">Başvuru *</Label>
                            <Select
                                onValueChange={(value) => handleChange('applicationId', value as string)}
                                value={formData.applicationId || ''}
                            >
                                <SelectTrigger className={errors.applicationId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Başvuru seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {completedApplications.filter(app => app.id).map((app) => (
                                            <SelectItem key={app.id} value={app.id!}>
                                                {app.name} - {app.candidateName} {app.candidateLastName}
                                                <span className="text-gray-500 ml-2">({app.examSessionName})</span>
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.applicationId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.applicationId}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}

                    {/* Bitiş Tarihi */}
                    <div className="space-y-2">
                        <Label htmlFor="endEndDate">Değerlendirme Bitiş Tarihi</Label>
                        <Input
                            id="endEndDate"
                            type="date"
                            value={formData.endEndDate}
                            onChange={(e) => handleChange('endEndDate', e.target.value)}
                            className={errors.endEndDate ? 'border-red-500' : ''}
                            min={new Date().toISOString().split('T')[0]}
                            disabled={grader?.isCompleted}
                        />
                        {errors.endEndDate && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.endEndDate}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Hakem Checkbox */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isReferee"
                            checked={formData.isReferee}
                            onChange={(checked) => handleChange('isReferee', !!checked)}
                            disabled={grader?.isCompleted}
                        />
                        <Label htmlFor="isReferee">Hakem Değerlendirici</Label>
                    </div>

                    {/* Seçilen Bilgilerin Özeti */}
                    {(selectedUser || selectedApplication) && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3">Atama Özeti</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {selectedUser && (
                                    <div className="space-y-1">
                                        <span className="font-medium text-gray-700">Değerlendirici:</span>
                                        <div className="text-gray-600">
                                            <div>{selectedUser.name} {selectedUser.lastName}</div>
                                            {selectedUser.email && <div>E-posta: {selectedUser.email}</div>}
                                            <div>Sıra: {formData.orderNumber}</div>
                                            <div>Tip: {formData.isReferee ? 'Hakem' : 'Normal'} Değerlendirici</div>
                                        </div>
                                    </div>
                                )}

                                {selectedApplication && (
                                    <div className="space-y-1">
                                        <span className="font-medium text-gray-700">Başvuru:</span>
                                        <div className="text-gray-600">
                                            <div>{selectedApplication.name}</div>
                                            <div>Aday: {selectedApplication.candidateName} {selectedApplication.candidateLastName}</div>
                                            <div>Oturum: {selectedApplication.examSessionName}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Mevcut Değerlendiriciler */}
                    {applicationGraders.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">
                                Bu Başvurudaki Mevcut Değerlendiriciler ({applicationGraders.length})
                            </h4>
                            <div className="space-y-1 text-sm text-blue-800">
                                {applicationGraders.map((g, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span>
                                            {g.orderNumber}. {g.userName} {g.userLastName}
                                            {g.isReferee && <span className="text-blue-600 ml-1">(Hakem)</span>}
                                        </span>
                                        <span className={g.isCompleted ? 'text-green-600' : 'text-gray-500'}>
                                            {g.isCompleted ? 'Tamamlandı' : 'Beklemede'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Duruma Özel Bilgilendirmeler */}
                    {grader?.isCompleted && (
                        <Alert>
                            <AlertDescription>
                                Bu değerlendirme tamamlanmıştır. Değişiklik yapılamaz.
                            </AlertDescription>
                        </Alert>
                    )}

                    {mode === 'create' && completedApplications.length === 0 && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                Değerlendirici atamak için tamamlanmış ve değerlendirilmemiş başvuru bulunmamaktadır.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Bilgi Mesajları */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                    Değerlendirici Atama Kuralları
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Aynı başvuruya aynı değerlendirici birden fazla atanamaz</li>
                                        <li>Sıra numaraları aynı başvuru için benzersiz olmalıdır</li>
                                        <li>Hakem değerlendiriciler son kontrol için kullanılır</li>
                                        <li>Değerlendirme tamamlandıktan sonra değişiklik yapılamaz</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={
                                loading ||
                                users.length === 0 ||
                                (mode === 'create' && completedApplications.length === 0) ||
                                grader?.isCompleted
                            }
                        >
                            {loading ? "İşleniyor..." : grader ? "Atama Güncelle" : "Değerlendirici Ata"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ApplicationGraderForm;