import React from 'react';
import type { ExamSectionDto, ExamTypeDto } from '@/api/generated/model';
import {Button} from "@/components/ui/button";
import { examTypeConverter } from '@/utils/enum-converter';
import { EExamType } from '@/types/exam/enum';
import HtmlRender from '@/components/ui/html-render';

interface ExamSectionDetailProps {
    selectedExamSection: ExamSectionDto | null;
    onEdit: () => void;
    onDelete: () => void;
}

const ExamSectionDetail: React.FC<ExamSectionDetailProps> = ({ selectedExamSection, onEdit, onDelete}) => {
    if (!selectedExamSection) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 text-lg">Sınav bölümü bulunamadı</div>
            </div>
        );
    }

    const sectionDescriptionHtml = (selectedExamSection.sectionDescription || '').trim();

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

    const examType = selectedExamSection.examType as ExamTypeDto | undefined;

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
                            {selectedExamSection.name || 'İsimsiz Sınav Bölümü'}
                        </h1>
                        <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedExamSection.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : selectedExamSection.status === 'PASSIVE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedExamSection.status === 'ACTIVE' ? 'Aktif' :
                    selectedExamSection.status === 'PASSIVE' ? 'Pasif' :
                        selectedExamSection.status || 'Bilinmiyor'}
              </span>
                            {selectedExamSection.orderNumber && (
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Sıra: {selectedExamSection.orderNumber}
                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                        <div>ID: {selectedExamSection.id}</div>
                        {selectedExamSection.createdAt && (
                            <div>Oluşturuldu: {new Date(selectedExamSection.createdAt).toLocaleDateString('tr-TR')}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-500 mb-1">Bölüm Adı</div>
                            <div className="text-lg font-semibold text-gray-900">
                                {selectedExamSection.name || 'Belirtilmedi'}
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-500 mb-1">Sıra Numarası</div>
                            <div className="text-lg font-semibold text-gray-900">
                                {selectedExamSection.orderNumber || 'Belirtilmedi'}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-500 mb-1">Durum</div>
                            <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${
                                    selectedExamSection.status === 'ACTIVE' ? 'bg-green-500' :
                                        selectedExamSection.status === 'PASSIVE' ? 'bg-yellow-500' :
                                            'bg-gray-500'
                                }`}></div>
                                <span className="text-lg font-semibold text-gray-900">
                  {selectedExamSection.status === 'ACTIVE' ? 'Aktif' :
                      selectedExamSection.status === 'PASSIVE' ? 'Pasif' :
                          selectedExamSection.status || 'Bilinmiyor'}
                </span>
                            </div>
                        </div>

                        {selectedExamSection.createdAt && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm font-medium text-gray-500 mb-1">Oluşturulma Tarihi</div>
                                <div className="text-lg font-semibold text-gray-900">
                                    {new Date(selectedExamSection.createdAt).toLocaleDateString('tr-TR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {sectionDescriptionHtml && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-2">Bölüm Açıklaması</div>
                        <HtmlRender
                          className="prose prose-sm max-w-none text-gray-900 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
                          html={sectionDescriptionHtml}
                        />
                    </div>
                )}
            </div>

            {/* Exam Type Information */}
            {examType && (
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Bağlı Sınav Türü</h2>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-start justify-between">
                            <div className="space-y-3">
                                <div>
                                    <div className="text-sm font-medium text-blue-600 mb-1">Sınav Türü Adı</div>
                                    <div className="text-xl font-bold text-blue-900">
                                        {examType.name || 'İsimsiz Sınav Türü'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <div className="text-sm font-medium text-blue-600">Tür</div>
                                        <div className="text-blue-900 font-semibold">
                                            {examTypeConverter(examType.examType as EExamType)}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm font-medium text-blue-600">Seviye</div>
                                        <div className="text-blue-900 font-semibold">
                                            {examType.examLevel || 'Belirtilmedi'}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm font-medium text-blue-600">Maksimum Puan</div>
                                        <div className="text-blue-900 font-semibold">
                                            {examType.maximumScore || 'Belirtilmedi'}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm font-medium text-blue-600">Süre</div>
                                        <div className="text-blue-900 font-semibold">
                                            {formatDuration(examType.durationInSeconds)}
                                        </div>
                                    </div>
                                </div>

                                {examType.description && (
                                    <div className="mt-4 p-3 bg-white/70 rounded-lg border border-blue-200">
                                        <div className="text-sm font-medium text-blue-600 mb-1">Açıklama</div>
                                        <HtmlRender
                                          className="prose prose-sm max-w-none text-blue-900 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
                                          html={examType.description}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col space-y-2 ml-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    examType.isFinalized
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {examType.isFinalized ? 'Kesinleştirildi' : 'Taslak'}
                </span>

                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    examType.status === 'ACTIVE'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                  {examType.status === 'ACTIVE' ? 'Aktif' : examType.status}
                </span>

                                <div className="text-xs text-blue-600 text-right">
                                    ID: {examType.id}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default ExamSectionDetail;