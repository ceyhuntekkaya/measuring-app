import React from 'react';
import { QuestionGroupTypeDto } from '@/types/exam/examTemplates';
import { EQuestionGroupTemplateLevel, EQuestionGroupType, EApprovalStatus, EExamType } from '@/types/exam/enum';
import {Button} from "@/components/ui/button";

interface QuestionGroupTypeDetailProps {
    selectedType: QuestionGroupTypeDto | null;
    onEdit?: () => void;
    onDelete: () => void;
}

const QuestionGroupTypeDetail: React.FC<QuestionGroupTypeDetailProps> = ({ selectedType, onEdit, onDelete }) => {
    if (!selectedType) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 text-lg">Soru grup türü bulunamadı</div>
            </div>
        );
    }

    const getLevelLabel = (level?: EQuestionGroupTemplateLevel) => {
        const levelLabels = {
            GROUP: 'Grup',
            QUESTION: 'Soru'
        };
        return level ? levelLabels[level] || level : 'Belirtilmedi';
    };

    const getGroupTypeLabel = (groupType?: EQuestionGroupType) => {
        const typeLabels = {
            LISTENING: 'Dinleme',
            READING: 'Okuma',
            SPEAKING: 'Konuşma',
            WRITING: 'Yazma',
            GRAMMAR: 'Dilbilgisi',
            VOCABULARY: 'Kelime Bilgisi',
            GENERAL: 'Genel'
        };
        return groupType ? typeLabels[groupType] || groupType : 'Belirtilmedi';
    };

    const getApprovalStatusLabel = (status?: EApprovalStatus) => {
        const statusLabels = {
            PENDING: 'Beklemede',
            APPROVED: 'Onaylandı',
            REJECTED: 'Reddedildi',
            CANCELLED: 'İptal Edildi',
            EXPIRED: 'Süresi Doldu'
        };
        return status ? statusLabels[status] || status : 'Belirtilmedi';
    };

    const getApprovalStatusColor = (status?: EApprovalStatus) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'REJECTED':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'CANCELLED':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'EXPIRED':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getExamTypeLabel = (examType?: EExamType) => {
        const typeLabels = {
            CERTIFICATE: 'Sertifika',
            COURSE_EXAM: 'Kurs Sınavı',
            LEVEL_DETERMINATION: 'Seviye Belirleme',
            PRACTICE: 'Pratik',
            DEGREE: 'Derece'
        };
        return examType ? typeLabels[examType] || examType : 'Belirtilmedi';
    };

    const getApprovalProgress = () => {
        const current = selectedType.currentApprovalCount || 0;
        const required = selectedType.requiredApprovalCount || 0;
        return { current, required, percentage: required > 0 ? (current / required) * 100 : 0 };
    };

    const approvalProgress = getApprovalProgress();

    return (
        <div className="mx-auto p-6 space-y-6">

            <div className="flex items-center justify-between">
                <div>

                </div>
                <div className="flex space-x-3">
                    {onEdit && (
                        <Button variant="outline" onClick={onEdit}>
                            Düzenle
                        </Button>
                    )}

                    {onDelete && (
                        <Button variant="outline" onClick={onDelete}>
                            Sil
                        </Button>
                    )}
                </div>
            </div>


            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {selectedType.name || 'İsimsiz Soru Grup Türü'}
                        </h1>
                        <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getApprovalStatusColor(selectedType.approvalStatus)}`}>
                {getApprovalStatusLabel(selectedType.approvalStatus)}
              </span>
                            {selectedType.orderNumber && (
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Sıra: {selectedType.orderNumber}
                </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                selectedType.status === 'ACTIVE'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                {selectedType.status === 'ACTIVE' ? 'Aktif' : selectedType.status}
              </span>
                        </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                        <div>ID: {selectedType.id}</div>
                        {selectedType.createdAt && (
                            <div>Oluşturuldu: {new Date(selectedType.createdAt).toLocaleDateString('tr-TR')}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Grup Türü Adı</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {selectedType.name || 'Belirtilmedi'}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Seviye</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {getLevelLabel(selectedType.level)}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Grup Türü</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {getGroupTypeLabel(selectedType.groupType)}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Sıra Numarası</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {selectedType.orderNumber || 'Belirtilmedi'}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Durum</div>
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                                selectedType.status === 'ACTIVE' ? 'bg-green-500' :
                                    selectedType.status === 'PASSIVE' ? 'bg-yellow-500' :
                                        'bg-gray-500'
                            }`}></div>
                            <span className="text-lg font-semibold text-gray-900">
                {selectedType.status === 'ACTIVE' ? 'Aktif' :
                    selectedType.status === 'PASSIVE' ? 'Pasif' :
                        selectedType.status || 'Bilinmiyor'}
              </span>
                        </div>
                    </div>

                    {selectedType.approvalCompletedDate && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-500 mb-1">Onay Tamamlanma</div>
                            <div className="text-lg font-semibold text-gray-900">
                                {new Date(selectedType.approvalCompletedDate).toLocaleDateString('tr-TR')}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Approval Status */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Onay Durumu</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <div className="text-sm font-medium text-gray-500">Mevcut Onay Durumu</div>
                            <div className={`text-lg font-semibold px-3 py-1 rounded-full inline-block border ${getApprovalStatusColor(selectedType.approvalStatus)}`}>
                                {getApprovalStatusLabel(selectedType.approvalStatus)}
                            </div>
                        </div>
                        {selectedType.approvalCompletedDate && (
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Tamamlanma Tarihi</div>
                                <div className="text-gray-900 font-medium">
                                    {new Date(selectedType.approvalCompletedDate).toLocaleDateString('tr-TR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {(selectedType.currentApprovalCount !== undefined || selectedType.requiredApprovalCount !== undefined) && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-medium text-gray-500">Onay İlerlemesi</div>
                                <div className="text-sm text-gray-600">
                                    {approvalProgress.current} / {approvalProgress.required} onay
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-300 ${
                                        approvalProgress.percentage === 100 ? 'bg-green-500' :
                                            approvalProgress.percentage >= 50 ? 'bg-yellow-500' :
                                                'bg-blue-500'
                                    }`}
                                    style={{ width: `${Math.min(approvalProgress.percentage, 100)}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {approvalProgress.percentage.toFixed(0)}% tamamlandı
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Exam Section Information */}
            {selectedType.examSection && (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Bağlı Sınav Bölümü</h2>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm font-medium text-purple-600 mb-1">Sınav Bölümü Adı</div>
                                <div className="text-xl font-bold text-purple-900">
                                    {selectedType.examSection.name || 'İsimsiz Bölüm'}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <div className="text-sm font-medium text-purple-600">Bölüm ID</div>
                                    <div className="text-purple-900 font-mono text-sm">{selectedType.examSection.id}</div>
                                </div>

                                <div>
                                    <div className="text-sm font-medium text-purple-600">Sıra Numarası</div>
                                    <div className="text-purple-900 font-semibold">
                                        {selectedType.examSection.orderNumber || 'Belirtilmedi'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm font-medium text-purple-600">Durum</div>
                                    <div className="text-purple-900 font-semibold">
                                        {selectedType.examSection.status === 'ACTIVE' ? 'Aktif' : selectedType.examSection.status}
                                    </div>
                                </div>
                            </div>

                            {/* Exam Type in Exam Section */}
                            {selectedType.examSection.examType && (
                                <div className="mt-4 p-4 bg-white/70 rounded-lg border border-purple-200">
                                    <div className="text-sm font-medium text-purple-600 mb-2">Sınav Türü Bilgileri</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <div className="text-xs text-purple-500">Sınav Türü Adı</div>
                                            <div className="text-purple-900 font-semibold">
                                                {selectedType.examSection.examType.name}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-purple-500">Tür</div>
                                            <div className="text-purple-900 font-semibold">
                                                {getExamTypeLabel(selectedType.examSection.examType.examType)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ek Bilgiler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedType.createdById && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-500">Oluşturan Kullanıcı ID</div>
                            <div className="text-gray-900 font-mono">{selectedType.createdById}</div>
                        </div>
                    )}

                    {selectedType.deletedAt && (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="text-sm font-medium text-red-600">Silinme Tarihi</div>
                            <div className="text-red-900 font-semibold">
                                {new Date(selectedType.deletedAt).toLocaleDateString('tr-TR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                            {selectedType.deletedById && (
                                <div className="text-xs text-red-600 mt-1">
                                    Silen: {selectedType.deletedById}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionGroupTypeDetail;