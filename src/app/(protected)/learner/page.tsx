'use client';

import {useAuth} from "@/hooks/use-auth";
import React, {useEffect} from "react";
import {useExamApplicationContext} from "@/contexts/ExamApplicationContext";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import PageFooter from "@/components/layout/page-footer";
import PageExamHeader from "@/components/layout/page-exam-header";
import {useRouter} from "next/navigation";
import {EApplicationUpdateState} from "@/types/exam/enum";

export default function UserDashboard() {
    const {logout} = useAuth();
    const {examSession, application, updateApplicationStateStatus} = useExamApplicationContext();
    const router = useRouter();

    useEffect(() => {
        if (application && application.notificationRead) {
            router.push('/learner/check');
        }
    }, [application, router]);


    console.log(examSession?.startDate)

    // Bugünün tarihini kontrol et (saat bilgisi olmadan sadece gün)
    const isToday = (date: Date | undefined) => {
        if (!date) return false;
        const today = new Date();
        const examDate = new Date(date);
        return (
            today.getFullYear() === examDate.getFullYear() &&
            today.getMonth() === examDate.getMonth() &&
            today.getDate() === examDate.getDate()
        );
    };

    const formatDate = (date: Date | undefined) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderContent = () => {
        // Durum 1: Sınav sonlandırılmış
        if (examSession?.sessionState === 'FINISHED') {
            return (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 border-l-4 border-gray-500">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800">Sınav Sonlandırılmıştır</h2>
                        </div>
                        <p className="text-gray-600 text-lg">
                            Bu sınav oturumu tamamlanmıştır. Sonuçlarınız değerlendirme sürecinde olabilir.
                        </p>
                    </div>
                </div>
            );
        }

        // Durum 2: Bugün ve sınav aktif (NOT_STARTED veya IN_PROGRESS)
        else if (isToday(examSession?.startDate)) {
            return (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div
                        className="w-full bg-gradient-to-br m-2 from-blue-50 to-indigo-50 rounded-xl shadow-xl p-4 md:p-12 border border-blue-100">
                        <div className="text-center mb-3">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">e-YADİS</h1>

                        </div>

                        <div className="bg-white rounded-lg p-6 md:p-8 shadow-md mb-6">
                            <p className="text-gray-700 leading-relaxed mb-4">
                              Türkçeyi yabancı dil olarak öğrenen yetişkin bireylerin dil becerilerini Türkiye içinde
                                veya dışında
                                internet üzerinden bilgisayar tabanlı olarak ölçmek üzere <span
                                className="font-semibold">Ankara Üniversitesi
                                Türkçe ve Yabancı Dil Araştırma ve Uygulama Merkezi (TOMER)</span> tarafından
                                geliştirilen bir düzey belirleme
                                ve sertifikalandırma sınavıdır.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-6 md:p-8 shadow-md mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                A1 DÜZEYİ BECERİ DÜZLEMLERİ
                            </h2>
                            <p className="text-gray-600 mb-4 font-medium">
                                Sınavda toplam 5 bölüm bulunmaktadır. Sınavda bölümler sıralı olarak gelmemektedir.
                                Bölümler seçilebilmektedir.
                            </p>

                            <div className="space-y-4">
                                <div className="flex gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                                    <div
                                        className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        25
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Dinleme</h3>
                                        <p className="text-gray-600 text-sm">
                                            Sözlü anlatım ve karşılıklı konuşma kayıtlarının içeriğine yönelik çoktan
                                            seçmeli soruların yer aldığı düzlemdir.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-600">
                                    <div
                                        className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        25
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Okuma</h3>
                                        <p className="text-gray-600 text-sm">
                                            Yazılı metinlerin içeriğine yönelik çoktan seçmeli soruların yer aldığı
                                            düzlemdir.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600">
                                    <div
                                        className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        9
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Karşılıklı Konuşma</h3>
                                        <p className="text-gray-600 text-sm">
                                            Ses kayıtları yoluyla adaylara yöneltilen ve adayların sözlü olarak
                                            yanıtlaması beklenen soruların yer aldığı düzlemdir.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 p-4 bg-pink-50 rounded-lg border-l-4 border-pink-600">
                                    <div
                                        className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        5
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Sözlü Anlatım</h3>
                                        <p className="text-gray-600 text-sm">
                                            Adaylara yazılı ve görsel soru kökleri kullanılarak yöneltilen ve adayların
                                            sözlü olarak yanıtlaması beklenen soruların yer aldığı düzlemdir.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 p-4 bg-teal-50 rounded-lg border-l-4 border-teal-600">
                                    <div
                                        className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        ✎
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Yazılı Anlatım</h3>
                                        <p className="text-gray-600 text-sm">
                                            Adaylara yazılı soru kökleri kullanılarak yöneltilen ve adayların yazarak
                                            yanıtlaması beklenen soruların yer aldığı düzlemdir.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6 shadow-md mb-6">
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor"
                                     viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                          clipRule="evenodd"/>
                                </svg>
                                <p className="text-amber-800 font-semibold">
                                    Sınavda ara verilmemektedir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        // Durum 3: Sınav tarihi farklı bir gün
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-full bg-white rounded-lg shadow-lg m-2 p-6 border-l-4 border-blue-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800">Sınav Bilgilendirmesi</h2>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-6 mb-4">
                        <p className="text-gray-700 text-lg mb-3">
                            Sınav tarihiniz:
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                            {formatDate(examSession?.startDate)}
                        </p>
                    </div>
                    <p className="text-gray-600 text-base">
                        Lütfen sınav saatinde tekrar giriş yapınız. Sınav öncesinde sisteme erişiminizin olduğundan emin
                        olun.
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">

            {
                application && !application.notificationRead && <>

                    <PageExamHeader actions={
                        <ActionButtons
                            onAdd={logout}
                            addButtonText="Çıkış"
                        />
                    }/>
                    <div>
                        {renderContent()}
                    </div>

                    <PageFooter actions={
                        <ActionButtons
                            onAdd={() => {
                                updateApplicationStateStatus(EApplicationUpdateState.READ_TERM)
                            }}
                            addButtonText="SONRAKİ"
                        />
                    }/>
                </>
            }

        </div>
    );
}