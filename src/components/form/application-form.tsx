'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {ApplicationDto, ApplicationFormData} from "@/types/management/brand";
import { CandidateDto } from "@/types/management/brand";
import {EStatus} from "@/types/exam/enum";

// Basit exam ve exam session type'ları
interface ExamOption {
    id: string;
    name: string;
    code: string;
}

interface ExamSessionOption {
    id: string;
    name: string;
    startDate?: string;
}


interface ApplicationFormErrors {
    name?: string;
    code?: string;
    examId?: string;
    examSessionId?: string;
    candidateId?: string;
    username?: string;
}

interface ApplicationFormProps {
    onSubmit: (data: ApplicationFormData) => void;
    application?: ApplicationDto | null;
    candidates: CandidateDto[];
    exams: ExamOption[];
    examSessions: ExamSessionOption[];
    loading?: boolean;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
                                                             onSubmit,
                                                             application,
                                                             candidates,
                                                             exams,
                                                             examSessions,
                                                             loading = false
                                                         }) => {
    const [formData, setFormData] = useState<ApplicationFormData>({
        name: '',
        code: '',
        examId: '',
        examSessionId: '',
        candidateId: '',
        username: '',
        id: '',
        createdAt: new Date(),
        deletedAt: null,
        status: EStatus.ACTIVE,
        createdById: '',
        deletedById: ''
    });

    const [errors, setErrors] = useState<ApplicationFormErrors>({});
    const [autoGenerateUsername, setAutoGenerateUsername] = useState(true);

    useEffect(() => {
        if (application) {
            setFormData({

                id: application.id || '',
                createdAt: application.createdAt || new Date(),
                deletedAt: application.deletedAt || null,
                status: application.status,
                createdById: application.createdById || null,
                deletedById: application.deletedById || null,

                name: application.name || '',
                code: application.code || '',
                examId: application.examId || '',
                examSessionId: application.examSessionId || '',
                candidateId: application.candidateId || '',
                username: application.username || ''
            });
            setAutoGenerateUsername(false);
        }
    }, [application]);

    // Otomatik username oluşturma
    useEffect(() => {
        if (autoGenerateUsername && formData.candidateId && !application) {
            const candidate = candidates.find(c => c.id === formData.candidateId);
            if (candidate) {
                const baseUsername = `${candidate.name?.toLowerCase()}.${candidate.lastName?.toLowerCase()}`.replace(/[^a-z.]/g, '');
                setFormData(prev => ({
                    ...prev,
                    username: baseUsername
                }));
            }
        }
    }, [formData.candidateId, candidates, autoGenerateUsername, application]);

    const handleChange = <T extends keyof ApplicationFormData>(
        name: T,
        value: ApplicationFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Username manuel değiştirilirse otomatik oluşturmayı durdur
        if (name === 'username') {
            setAutoGenerateUsername(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: ApplicationFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Başvuru adı zorunludur';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Başvuru adı en az 3 karakter olmalıdır';
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Başvuru kodu zorunludur';
        } else if (formData.code.trim().length < 3) {
            newErrors.code = 'Başvuru kodu en az 3 karakter olmalıdır';
        } else if (!/^[A-Z0-9_-]+$/i.test(formData.code.trim())) {
            newErrors.code = 'Başvuru kodu sadece harf, rakam, tire ve alt çizgi içerebilir';
        }

        if (!formData.examId) {
            newErrors.examId = 'Sınav seçimi zorunludur';
        }

        if (!formData.examSessionId) {
            newErrors.examSessionId = 'Sınav oturumu seçimi zorunludur';
        }

        if (!formData.candidateId) {
            newErrors.candidateId = 'Aday seçimi zorunludur';
        }

        if (formData.username) {

            if (!formData.username.trim()) {
                newErrors.username = 'Kullanıcı adı zorunludur';
            } else if (formData.username.trim().length < 3) {
                newErrors.username = 'Kullanıcı adı en az 3 karakter olmalıdır';
            } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.username.trim())) {
                newErrors.username = 'Kullanıcı adı sadece harf, rakam, nokta, tire ve alt çizgi içerebilir';
            }
        }else{
            newErrors.username = 'Kullanıcı adı zorunludur';
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const submitData = {


                id: formData.id || '',
                createdAt: formData.createdAt || new Date(),
                deletedAt: formData.deletedAt || null,
                status: formData.status,
                createdById: formData.createdById || null,
                deletedById: formData.deletedById || null,

                name: formData.name.trim(),
                code: formData.code.trim().toUpperCase(),
                examId: formData.examId,
                examSessionId: formData.examSessionId,
                candidateId: formData.candidateId,
                username: formData.username ? formData.username.trim().toLowerCase() : ''
            };

            onSubmit(submitData);
        }
    };

    const selectedCandidate = candidates.find(c => c.id === formData.candidateId);
    const selectedExam = exams.find(e => e.id === formData.examId);
    const selectedExamSession = examSessions.find(es => es.id === formData.examSessionId);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {application ? "Başvuru Güncelle" : "Yeni Başvuru Oluştur"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Başvuru Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Başvuru Adı *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Başvuru adını giriniz"/>
                                {errors.code && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.code}</AlertDescription>
                                    </Alert>
                                )}
                        </div>



                        {/* Kullanıcı Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="username">Kullanıcı Adı *</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => handleChange('username', e.target.value)}
                                className={errors.username ? 'border-red-500' : ''}
                                placeholder="Kullanıcı adını giriniz"
                                disabled={application?.isCompleted}
                            />
                            {errors.username && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.username}</AlertDescription>
                                </Alert>
                            )}
                            {autoGenerateUsername && !application && (
                                <p className="text-sm text-gray-500">
                                    Kullanıcı adı aday seçimine göre otomatik oluşturuldu
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Sınav Seçimi */}
                    <div className="space-y-2">
                        <Label htmlFor="examId">Sınav *</Label>
                        <Select
                            onValueChange={(value) => handleChange('examId', value as string)}
                            value={formData.examId}
                            disabled={!!application}
                        >
                            <SelectTrigger className={errors.examId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Sınav seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {exams.map((exam) => (
                                        <SelectItem key={exam.id} value={exam.id}>
                                            {exam.name} ({exam.code})
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.examId && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.examId}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Sınav Oturumu Seçimi */}
                    <div className="space-y-2">
                        <Label htmlFor="examSessionId">Sınav Oturumu *</Label>
                        <Select
                            onValueChange={(value) => handleChange('examSessionId', value as string)}
                            value={formData.examSessionId}
                            disabled={!!application}
                        >
                            <SelectTrigger className={errors.examSessionId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Sınav oturumu seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {examSessions.map((session) => (
                                        <SelectItem key={session.id} value={session.id}>
                                            {session.name}
                                            {session.startDate && (
                                                <span className="text-gray-500 ml-2">
                                                    ({new Date(session.startDate).toLocaleDateString('tr-TR')})
                                                </span>
                                            )}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.examSessionId && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.examSessionId}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Aday Seçimi */}
                    <div className="space-y-2">
                        <Label htmlFor="candidateId">Aday *</Label>
                        <Select
                            onValueChange={(value) => handleChange('candidateId', value as string)}
                            value={formData.candidateId}
                            disabled={!!application}
                        >
                            <SelectTrigger className={errors.candidateId ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Aday seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {candidates.map((candidate) => (
                                        <SelectItem key={candidate.id} value={candidate.id}>
                                            {candidate.name} {candidate.lastName} - {candidate.identityNumber}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.candidateId && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.candidateId}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Seçilen Bilgilerin Özeti */}
                    {(selectedCandidate || selectedExam || selectedExamSession) && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-3">Başvuru Özeti</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                {selectedCandidate && (
                                    <div className="space-y-1">
                                        <span className="font-medium text-gray-700">Aday Bilgileri:</span>
                                        <div className="text-gray-600">
                                            <div>{selectedCandidate.name} {selectedCandidate.lastName}</div>
                                            <div>TC: {selectedCandidate.identityNumber}</div>
                                            {selectedCandidate.email && <div>E-posta: {selectedCandidate.email}</div>}
                                        </div>
                                    </div>
                                )}

                                {selectedExam && (
                                    <div className="space-y-1">
                                        <span className="font-medium text-gray-700">Sınav Bilgileri:</span>
                                        <div className="text-gray-600">
                                            <div>{selectedExam.name}</div>
                                            <div>Kod: {selectedExam.code}</div>
                                        </div>
                                    </div>
                                )}

                                {selectedExamSession && (
                                    <div className="space-y-1">
                                        <span className="font-medium text-gray-700">Oturum Bilgileri:</span>
                                        <div className="text-gray-600">
                                            <div>{selectedExamSession.name}</div>
                                            {selectedExamSession.startDate && (
                                                <div>Tarih: {new Date(selectedExamSession.startDate).toLocaleDateString('tr-TR')}</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Duruma Özel Bilgilendirmeler */}
                    {application?.isCompleted && (
                        <Alert>
                            <AlertDescription>
                                Bu başvuru tamamlanmıştır. Sadece kullanıcı adı ve başvuru adı güncellenebilir.
                            </AlertDescription>
                        </Alert>
                    )}

                    {!application && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Başvuru Oluşturma Bilgileri
                                    </h3>
                                    <div className="mt-2 text-sm text-blue-700">
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Başvuru oluşturulduktan sonra sınav, oturum ve aday değiştirilemez</li>
                                            <li>Sistem otomatik olarak güvenli bir şifre oluşturacaktır</li>
                                            <li>Aday aynı oturuma sadece bir kez başvuru yapabilir</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading || candidates.length === 0 || exams.length === 0 || examSessions.length === 0}
                        >
                            {loading ? "İşleniyor..." : application ? "Başvuru Güncelle" : "Başvuru Oluştur"}
                        </Button>
                    </div>

                    {/* Eksik Veri Uyarıları */}
                    {(candidates.length === 0 || exams.length === 0 || examSessions.length === 0) && (
                        <div className="space-y-2">
                            {candidates.length === 0 && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        Başvuru oluşturmak için en az bir aday kaydı gereklidir.
                                    </AlertDescription>
                                </Alert>
                            )}
                            {exams.length === 0 && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        Başvuru oluşturmak için en az bir sınav kaydı gereklidir.
                                    </AlertDescription>
                                </Alert>
                            )}
                            {examSessions.length === 0 && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        Başvuru oluşturmak için en az bir sınav oturumu kaydı gereklidir.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ApplicationForm;
