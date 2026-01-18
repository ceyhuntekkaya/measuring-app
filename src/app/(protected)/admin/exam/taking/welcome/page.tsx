// components/exam/ExamWelcomePage.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Calendar, FileText, ArrowRight } from 'lucide-react';
import {useExamApplicationContext} from "@/contexts/ExamApplicationContext";

export default function ExamWelcomePage() {
    const router = useRouter();
    const { application } = useExamApplicationContext();
    const loading = false;
    const error: Error | null = null;


    useEffect(() => {
        if (!application && !loading) {
            router.push('/admin/exam/taking');
        }
    }, [application, loading, router]);

    const handleContinue = () => {
        router.push('/admin/exam/taking/preparation');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Yükleniyor...</span>
                </div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <Alert variant="destructive">
                            <AlertDescription>
                                {error && 'message' in error ? (error as Error).message : 'Oturum bilgileri bulunamadı. Lütfen tekrar giriş yapın.'}
                            </AlertDescription>
                        </Alert>
                        <Button
                            onClick={() => router.push('/admin/exam/taking')}
                            className="w-full mt-4"
                        >
                            Giriş Sayfasına Dön
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl shadow-xl">
                <CardHeader className="text-center space-y-4 pb-6">
                    <CardTitle className="text-3xl font-bold text-gray-900">
                        Hoş Geldiniz
                    </CardTitle>
                    <div className="w-20 h-1 bg-blue-600 rounded-full mx-auto"></div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Kullanıcı Bilgileri */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border">
                            <User className="w-8 h-8 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Aday</p>
                                <p className="font-semibold text-gray-900">
                                    {application.candidateName} {application.candidateLastName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border">
                            <Calendar className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Oturum</p>
                                <p className="font-semibold text-gray-900">
                                    {application.examSessionName || 'Sınav Oturumu'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border">
                            <FileText className="w-8 h-8 text-purple-600" />
                            <div>
                                <p className="text-sm font-medium text-gray-600">Başvuru</p>
                                <p className="font-semibold text-gray-900">
                                    {application.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hoş Geldin Mesajı */}
                    <div className="text-center space-y-4 py-6">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Sayın {application.candidateName} {application.candidateLastName},
                        </h2>
                        <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">
                            <strong>{application.examSessionName}</strong> oturumu için kayıtlı olan <strong>{application.name}</strong> başvurunuz ile sınav sistemine başarıyla giriş yaptınız.
                        </p>
                        <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">
                            Sınavınızı başlatmadan önce teknik hazırlık aşamasına geçerek mikrofon ve diğer ayarlarınızı kontrol ediniz.
                        </p>
                    </div>

                    {/* Bilgilendirme Kutusu */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h3 className="font-semibold text-amber-800 mb-2">Önemli Hatırlatmalar</h3>
                        <ul className="text-sm text-amber-700 space-y-1">
                            <li>• Sınav sırasında tarayıcıdan çıkmayınız</li>
                            <li>• Başka uygulamalara geçiş yapmayınız</li>
                            <li>• İnternet bağlantınızın stabil olduğundan emin olunuz</li>
                            <li>• Mikrofon iznini vererek ses kontrolünü yapınız</li>
                        </ul>
                    </div>

                    {/* Devam Butonu */}
                    <div className="flex justify-center pt-4">
                        <Button
                            onClick={handleContinue}
                            size="lg"
                            className="px-8 py-3 text-lg"
                        >
                            Hazırlık Aşamasına Geç
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}