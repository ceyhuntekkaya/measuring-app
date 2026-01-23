import React from 'react';
import type { QuestionGroupDto } from '@/api/generated/model/questionGroupDto';
import type { QuestionDto } from '@/api/generated/model/questionDto';
import { EQuestionGroupType, EMediaType, EQuestionType, EExamType } from '@/types/exam/enum';
import {Button} from "@/components/ui/button";
import { examTypeConverter, approvalStatusConverter, getApprovalStatusColor } from '@/utils/enum-converter';

interface QuestionGroupDetailProps {
    selectedQuestionGroup: QuestionGroupDto | null;
    onEdit: () => void;
    onDelete: () => void;
}

const QuestionGroupDetail: React.FC<QuestionGroupDetailProps> = ({ selectedQuestionGroup, onEdit, onDelete  }) => {
    if (!selectedQuestionGroup) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 text-lg">Soru grubu bulunamadı</div>
            </div>
        );
    }

    const formatDuration = (seconds?: number) => {
        if (!seconds) return 'Belirtilmedi';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        let result = '';
        if (hours > 0) result += `${hours} saat `;
        if (minutes > 0) result += `${minutes} dakika `;
        if (remainingSeconds > 0) result += `${remainingSeconds} saniye`;

        return result.trim() || '0 saniye';
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

    const getMediaTypeLabel = (mediaType?: EMediaType) => {
        const typeLabels = {
            IMAGE: 'Resim',
            VIDEO: 'Video',
            AUDIO: 'Ses',
            DOCUMENT: 'Belge',
            PDF: 'PDF',
            TEXT: 'Metin',
            OTHER: 'Diğer'
        };
        return mediaType ? typeLabels[mediaType] || mediaType : 'Belirtilmedi';
    };

    const getQuestionTypeLabel = (questionType?: EQuestionType) => {
        const typeLabels = {
            MULTIPLE_CHOICE: 'Çoktan Seçmeli',
            TRUE_FALSE: 'Doğru/Yanlış',
            FILL_IN_THE_BLANKS: 'Boşluk Doldurma',
            SHORT_ANSWER: 'Kısa Cevap',
            MATCHING: 'Eşleştirme',
            ESSAY: 'Kompozisyon',
            ORDERING: 'Sıralama',
            MULTIPLE_RESPONSE: 'Çoklu Seçim',
            HOT_SPOT: 'Nokta İşaretleme',
            DRAG_AND_DROP: 'Sürükle Bırak',
            AUDIO_RESPONSE: 'Ses Cevabı',
            VIDEO_RESPONSE: 'Video Cevabı',
            IMAGE_RESPONSE: 'Resim Cevabı'
        };
        return questionType ? typeLabels[questionType] || questionType : 'Belirtilmedi';
    };

    const getApprovalProgress = () => {
        const current = selectedQuestionGroup.currentApprovalCount || 0;
        const required = selectedQuestionGroup.requiredApprovalCount || 0;
        return { current, required, percentage: required > 0 ? (current / required) * 100 : 0 };
    };

    const approvalProgress = getApprovalProgress();

    return (
        <div className="mx-auto p-4 space-y-4">

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
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {selectedQuestionGroup.name || 'İsimsiz Soru Grubu'}
                        </h1>
                        <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getApprovalStatusColor(selectedQuestionGroup.approvalStatus)}`}>
                {approvalStatusConverter(selectedQuestionGroup.approvalStatus)}
              </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                selectedQuestionGroup.status === 'ACTIVE'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                {selectedQuestionGroup.status === 'ACTIVE' ? 'Aktif' : selectedQuestionGroup.status}
              </span>
                        </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                        <div>ID: {selectedQuestionGroup.id}</div>
                        {selectedQuestionGroup.createdAt && (
                            <div>Oluşturuldu: {new Date(selectedQuestionGroup.createdAt).toLocaleDateString('tr-TR')}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Grup Adı</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {selectedQuestionGroup.name || 'Belirtilmedi'}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Maksimum Puan</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {selectedQuestionGroup.maximumScore || 'Belirtilmedi'}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Süre</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {formatDuration(selectedQuestionGroup.durationInSeconds)}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Soru Sayısı</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {selectedQuestionGroup.questions?.length || 0}
                        </div>
                    </div>
                </div>
            </div>

            {/* Approval Status */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Onay Durumu</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <div className="text-sm font-medium text-gray-500">Mevcut Onay Durumu</div>
                            <div className={`text-lg font-semibold px-3 py-1 rounded-full inline-block border ${getApprovalStatusColor(selectedQuestionGroup.approvalStatus)}`}>
                                {approvalStatusConverter(selectedQuestionGroup.approvalStatus)}
                            </div>
                        </div>
                        {selectedQuestionGroup.approvalCompletedDate && (
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Tamamlanma Tarihi</div>
                                <div className="text-gray-900 font-medium">
                                    {new Date(selectedQuestionGroup.approvalCompletedDate).toLocaleDateString('tr-TR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {(selectedQuestionGroup.currentApprovalCount !== undefined || selectedQuestionGroup.requiredApprovalCount !== undefined) && (
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

            {/* Related Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Exam Type */}
                {selectedQuestionGroup.examType && (
                    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bağlı Sınav Türü</h3>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                            <div className="space-y-3">
                                <div>
                                    <div className="text-sm font-medium text-blue-600">Sınav Türü Adı</div>
                                    <div className="text-lg font-bold text-blue-900">
                                        {selectedQuestionGroup.examType.name}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <div className="text-xs text-blue-500">Tür</div>
                                        <div className="text-blue-900 font-semibold text-sm">
                                            {examTypeConverter(selectedQuestionGroup.examType.examType as EExamType)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-blue-500">Seviye</div>
                                        <div className="text-blue-900 font-semibold text-sm">
                                            {selectedQuestionGroup.examType.examLevel}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Exam Section */}
                {selectedQuestionGroup.examSection && (
                    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bağlı Sınav Bölümü</h3>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                            <div className="space-y-3">
                                <div>
                                    <div className="text-sm font-medium text-purple-600">Bölüm Adı</div>
                                    <div className="text-lg font-bold text-purple-900">
                                        {selectedQuestionGroup.examSection.name}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-purple-500">Sıra Numarası</div>
                                    <div className="text-purple-900 font-semibold">
                                        {selectedQuestionGroup.examSection.orderNumber}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Question Group Type */}
                {selectedQuestionGroup.questionGroupType && (
                    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Soru Grup Türü</h3>
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 border border-green-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <div className="text-sm font-medium text-green-600">Grup Türü Adı</div>
                                    <div className="text-lg font-bold text-green-900">
                                        {selectedQuestionGroup.questionGroupType.name}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-green-500">Tür</div>
                                    <div className="text-green-900 font-semibold">
                                        {getGroupTypeLabel(selectedQuestionGroup.questionGroupType.groupType as EQuestionGroupType)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-green-500">Seviye</div>
                                    <div className="text-green-900 font-semibold">
                                        {selectedQuestionGroup.questionGroupType.level}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-green-500">Sıra</div>
                                    <div className="text-green-900 font-semibold">
                                        {selectedQuestionGroup.questionGroupType.orderNumber}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Questions */}
            {selectedQuestionGroup.questions && selectedQuestionGroup.questions.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Sorular ({selectedQuestionGroup.questions.length})
                    </h2>
                    <div className="space-y-3">
                        {(selectedQuestionGroup.questions as QuestionDto[]).map((question, index) => (
                            <div key={question.id || index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                                {question.orderNumber || index + 1}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{question.name || `Soru ${index + 1}`}</div>
                                                <div className="text-sm text-gray-500">
                                                    {getQuestionTypeLabel(question.questionType as EQuestionType)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ml-11 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                            <div>
                                                <span className="text-gray-500">Puan:</span>
                                                <span className="ml-1 font-medium">{question.maximumScore || 'Belirtilmedi'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Süre:</span>
                                                <span className="ml-1 font-medium">{formatDuration(question.durationInSeconds)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Otomatik değerlendirme:</span>
                                                <span className={`ml-1 font-medium ${question.isAutomaticallyEvaluated ? 'text-green-600' : 'text-red-600'}`}>
                          {question.isAutomaticallyEvaluated ? 'Evet' : 'Hayır'}
                        </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className={`px-2 py-1 rounded text-xs font-medium ${getApprovalStatusColor(question.approvalStatus)}`}>
                                            {approvalStatusConverter(question.approvalStatus)}
                                        </div>
                                        {question.currentApprovalCount && question.requiredApprovalCount && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {question.currentApprovalCount}/{question.requiredApprovalCount} onay
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Headers */}
            {selectedQuestionGroup.headers && selectedQuestionGroup.headers.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Başlıklar ({selectedQuestionGroup.headers.length})
                    </h2>
                    <div className="space-y-3">
                        {selectedQuestionGroup.headers.map((header, index) => (
                            <div key={header.id || index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                                                {header.orderNumber || index + 1}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-500">
                                                    {getMediaTypeLabel(header.mediaType as EMediaType)}
                                                </div>
                                            </div>
                                        </div>

                                        {header.content && (
                                            <div className="ml-11 p-3 bg-gray-50 rounded-lg">
                                                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                                                    {header.content}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <div className={`px-2 py-1 rounded text-xs font-medium ${getApprovalStatusColor(header.approvalStatus)}`}>
                                            {approvalStatusConverter(header.approvalStatus)}
                                        </div>
                                        {header.currentApprovalCount && header.requiredApprovalCount && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {header.currentApprovalCount}/{header.requiredApprovalCount} onay
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default QuestionGroupDetail;