import React from 'react';
import { ExamTypeDto } from '@/types/exam/examTemplates';
import {Button} from "@/components/ui/button";
import { examTypeConverter, approvalStatusConverter, getApprovalStatusColor } from '@/utils/enum-converter';

interface ExamTypeDetailProps {
    selectedExamType: ExamTypeDto | null;
    onEdit: () => void;
    onDelete: () => void;
}

const ExamTypeDetail: React.FC<ExamTypeDetailProps> = ({ selectedExamType, onEdit, onDelete }) => {
    if (!selectedExamType) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 text-lg">Sınav türü bulunamadı</div>
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
                            {selectedExamType.name || 'İsimsiz Sınav Türü'}
                        </h1>
                        <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedExamType.isFinalized
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedExamType.isFinalized ? 'Kesinleştirildi' : 'Taslak'}
              </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                selectedExamType.status === 'ACTIVE'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                {selectedExamType.status === 'ACTIVE' ? 'Aktif' : selectedExamType.status}
              </span>
                        </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                        <div>ID: {selectedExamType.id}</div>
                        {selectedExamType.createdAt && (
                            <div>Oluşturuldu: {new Date(selectedExamType.createdAt).toLocaleDateString('tr-TR')}</div>
                        )}
                    </div>
                </div>

                {selectedExamType.description && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Açıklama</h3>
                        <p className="text-gray-600">{selectedExamType.description}</p>
                    </div>
                )}
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">Sınav Türü</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {examTypeConverter(selectedExamType.examType)}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">Sınav Seviyesi</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {selectedExamType.examLevel || 'Belirtilmedi'}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">Maksimum Puan</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {selectedExamType.maximumScore || 'Belirtilmedi'}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">Süre</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {formatDuration(selectedExamType.durationInSeconds)}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">Ekran Kayıt Süresi</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {formatDuration(selectedExamType.screenRecordTime)}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500">Durumu</div>
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${selectedExamType.isGraded ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="text-sm text-gray-600">Notlandırılır</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${selectedExamType.isOrder ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="text-sm text-gray-600">Sıralı</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${selectedExamType.isShowEvaluation ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="text-sm text-gray-600">Değerlendirme Gösterir</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Screen */}
            {selectedExamType.infoScreen && (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Bilgilendirme Ekranı</h2>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="whitespace-pre-wrap text-gray-700">
                            {selectedExamType.infoScreen}
                        </div>
                    </div>
                </div>
            )}

            {/* Question Group Types */}
            {selectedExamType.questionGroupTypes && selectedExamType.questionGroupTypes.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Soru Grup Türleri ({selectedExamType.questionGroupTypes.length})
                    </h2>
                    <div className="space-y-3">
                        {selectedExamType.questionGroupTypes.map((groupType, index) => (
                            <div key={groupType.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                        {groupType.orderNumber || index + 1}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{groupType.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {groupType.groupType} • {groupType.level}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`px-2 py-1 rounded text-xs font-medium ${getApprovalStatusColor(groupType.approvalStatus)}`}>
                                        {approvalStatusConverter(groupType.approvalStatus)}
                                    </div>
                                    {groupType.currentApprovalCount && groupType.requiredApprovalCount && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {groupType.currentApprovalCount}/{groupType.requiredApprovalCount} onay
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamTypeDetail;