import React from 'react';

interface WelcomeComponentProps {
    setStep: (step: 'login' | 'welcome' | 'camera' | 'audio' |  'section-selection' | 'exam-taking' | 'completed') => void;
}

const WelcomeComponent: React.FC<WelcomeComponentProps> = ({ setStep }) => {
    return (
        <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-100 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
                <div className="m-6 w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 text-center">
                        <h1 className="text-4xl font-bold mb-2">e-YADİS TÜRKÇE</h1>
                        <div className="w-24 h-1 bg-white mx-auto mt-4 rounded-full"></div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        {/* Ana Açıklama */}
                        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
                            <p className="text-gray-700 leading-relaxed">
                                Türkçeyi yabancı dil olarak öğrenen yetişkin bireylerin dil becerilerini
                                Türkiye içinde veya dışında internet üzerinden bilgisayar tabanlı olarak
                                ölçmek üzere Ankara Üniversitesi Türkçe ve Yabancı Dil Araştırma ve
                                Uygulama Merkezi (TÖMER) tarafından geliştirilen bir düzey belirleme ve
                                sertifikalandırma sınavıdır.
                            </p>
                        </div>

                        {/* Sınav Bilgileri */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                A1 DÜZEYİ BECERİ DÜZLEMLERİ
                            </h2>

                            <div className="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-200">
                                <p className="text-gray-700">
                                    <span className="font-semibold">Önemli:</span> Sınavda toplam 5 bölüm bulunmaktadır.
                                    Sınavda bölümler sıralı olarak gelmemektedir. Bölümler seçilebilmektedir.
                                </p>
                            </div>

                            {/* Bölümler */}
                            <div className="space-y-4">
                                {/* Dinleme */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-blue-600 font-bold text-lg">🎧</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-2">Dinleme</h3>
                                            <p className="text-gray-600 text-sm">
                                                Sözlü anlatım ve karşılıklı konuşma kayıtlarının içeriğine yönelik
                                                çoktan seçmeli soruların yer aldığı düzlemdir.
                                            </p>
                                            <p className="text-blue-600 font-semibold mt-2 text-sm">25 soru</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Okuma */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-green-600 font-bold text-lg">📖</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-2">Okuma</h3>
                                            <p className="text-gray-600 text-sm">
                                                Yazılı metinlerin içeriğine yönelik çoktan seçmeli soruların yer aldığı düzlemdir.
                                            </p>
                                            <p className="text-green-600 font-semibold mt-2 text-sm">25 soru</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Karşılıklı Konuşma */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-purple-600 font-bold text-lg">💬</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-2">Karşılıklı Konuşma</h3>
                                            <p className="text-gray-600 text-sm">
                                                Ses kayıtları yoluyla adaylara yöneltilen ve adayların sözlü olarak
                                                yanıtlaması beklenen soruların yer aldığı düzlemdir.
                                            </p>
                                            <p className="text-purple-600 font-semibold mt-2 text-sm">9 soru</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sözlü Anlatım */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-orange-600 font-bold text-lg">🗣️</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-2">Sözlü Anlatım</h3>
                                            <p className="text-gray-600 text-sm">
                                                Adaylara yazılı ve görsel soru kökleri kullanılarak yöneltilen ve
                                                adayların sözlü olarak yanıtlaması beklenen soruların yer aldığı düzlemdir.
                                            </p>
                                            <p className="text-orange-600 font-semibold mt-2 text-sm">5 soru</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Yazılı Anlatım */}
                                <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-red-600 font-bold text-lg">✍️</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 mb-2">Yazılı Anlatım</h3>
                                            <p className="text-gray-600 text-sm">
                                                Adaylara yazılı soru kökleri kullanılarak yöneltilen ve adayların
                                                yazarak yanıtlaması beklenen soruların yer aldığı düzlemdir.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Uyarı */}
                        <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                            <p className="text-red-800 font-semibold">
                                ⚠️ Sınavda ara verilmemektedir.
                            </p>
                        </div>

                        {/* Başla Butonu */}
                        {setStep && (
                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={()=>setStep("camera")}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all shadow-lg"
                                >
                                    Sınava Başla
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeComponent;