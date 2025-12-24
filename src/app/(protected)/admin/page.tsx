'use client';


import PageHeader from "@/components/layout/page-header";
import React from "react";
import {
    PlayCircle,
    Calendar,
    FileEdit,
    CheckCircle,
    ClipboardCheck,
    Clock,
    Award,
    UserPlus,
    Users,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import {useRouter} from "next/navigation";

interface DashboardCardProps {
    title: string;
    count: number;
    icon: React.ReactNode;
    bgColor: string;
    buttonText: string;
    onButtonClick: () => void;
}
const dashboardData = [
    {
        title: 'Devam Eden Sınavlar',
        count: 0,
        icon: <PlayCircle className="w-8 h-8" />,
        bgColor: 'bg-blue-100',
        buttonText: 'Sınavları Görüntüle',
        link:'/admin/sessions'
    },
    {
        title: 'Bu Hafta Planlanan Sınavlar',
        count: 1,
        icon: <Calendar className="w-8 h-8" />,
        bgColor: 'bg-purple-100',
        buttonText: 'Planları İncele',
        link:'/admin/sessions'
    },
    {
        title: 'Yazımı Beklenen Soru Sayısı',
        count: 45,
        icon: <FileEdit className="w-8 h-8" />,
        bgColor: 'bg-amber-100',
        buttonText: 'Soruları Gör',
        link:'/admin/question-group'
    },
    {
        title: 'Onaydaki Soru Sayısı',
        count: 23,
        icon: <CheckCircle className="w-8 h-8" />,
        bgColor: 'bg-green-100',
        buttonText: 'Onay İşlemleri',
        link:'/admin/approvals'
    },
    {
        title: 'Değerlendirme Bekleyen Sınavlar',
        count: 0,
        icon: <ClipboardCheck className="w-8 h-8" />,
        bgColor: 'bg-rose-100',
        buttonText: 'Değerlendir',
        link:'/admin/sessions'
    },
    {
        title: 'Onay Bekleyen İşlemlerim',
        count: 0,
        icon: <Clock className="w-8 h-8" />,
        bgColor: 'bg-orange-100',
        buttonText: 'İşlemleri Gör',
        link:'/admin/approvals'
    },
    {
        title: 'Bu Ay Verilen Sertifika Sayısı',
        count: 0,
        icon: <Award className="w-8 h-8" />,
        bgColor: 'bg-yellow-100',
        buttonText: 'Sertifikaları Listele',
        link:'/admin'
    },
    {
        title: 'Bugün Yapılan Başvurular',
        count: 2,
        icon: <UserPlus className="w-8 h-8" />,
        bgColor: 'bg-teal-100',
        buttonText: 'Başvuruları İncele',
        link:'/admin/candidates'
    },
    {
        title: 'Kayıt Alınan Oturum Sayısı',
        count: 1,
        icon: <Users className="w-8 h-8" />,
        bgColor: 'bg-cyan-100',
        buttonText: 'Oturumları Gör',
        link:'/admin/sessions'
    },
    {
        title: 'Dolan Oturum Sayısı',
        count: 0,
        icon: <AlertCircle className="w-8 h-8" />,
        bgColor: 'bg-red-100',
        buttonText: 'Dolu Oturumlar',
        link:'/admin/sessions'
    }
];

const DashboardCard = ({ title, count, icon, bgColor, buttonText, onButtonClick }: DashboardCardProps) => {



    return (
        <div className={`${bgColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
                    <p className="text-4xl font-bold text-gray-800">{count}</p>
                </div>
                <div className="text-gray-600">
                    {icon}
                </div>
            </div>

            <button
                onClick={onButtonClick}
                className="w-full mt-4 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
                {buttonText}
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default function AdminPage() {
    const router = useRouter();

    const handleCardClick = (link: string) => {
        router.push(link);
    };

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="min-h-screen bg-gray-50 p-2">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 pt-4">
                        {dashboardData.map((card, index) => (
                            <DashboardCard
                                key={index}
                                title={card.title}
                                count={card.count}
                                icon={card.icon}
                                bgColor={card.bgColor}
                                buttonText={card.buttonText}
                                onButtonClick={() => handleCardClick(card.link)}
                            />
                        ))}
                    </div>

                    <div className="mt-3 bg-white rounded-xl p-4 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Hızlı Erişim</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center" onClick={()=>handleCardClick("/admin/question-group/add")}>
                                <FileEdit className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Yeni Soru</span>
                            </button>
                            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center" onClick={()=>handleCardClick("/admin/sessions/add")}>
                                <Calendar className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Sınav Planla</span>
                            </button>
                            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center" onClick={()=>handleCardClick("/admin/candidates/add")}>
                                <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Katılımcı Ekle</span>
                            </button>
                            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center" onClick={()=>handleCardClick("/")}>
                                <Award className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">Sertifika Oluştur</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}