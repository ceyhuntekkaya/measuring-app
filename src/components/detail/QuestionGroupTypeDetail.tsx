import React from 'react';
import type { QuestionGroupTypeDto } from '@/api/generated/model/questionGroupTypeDto';
import type { ExamTypeDto } from '@/api/generated/model/examTypeDto';
import { EQuestionGroupType, EExamType } from '@/types/exam/enum';
import {Button} from "@/components/ui/button";
import { examTypeConverter } from '@/utils/enum-converter';
import HtmlRender from '@/components/ui/html-render';

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

    const yn = (v?: boolean) =>
        v === true ? 'Evet' : v === false ? 'Hayır' : 'Belirtilmedi';

    const instructionHtml = (selectedType.instruction || '').trim();

    return (
        <div className="mx-auto p-4 space-y-4">

            <div className="flex items-center justify-between">
                <div />
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

            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {selectedType.name || 'İsimsiz Soru Grup Türü'}
                        </h1>
                        <div className="flex items-center space-x-4">
                            {selectedType.orderNumber != null && (
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

            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Temel Bilgiler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Grup Türü Adı</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {selectedType.name || 'Belirtilmedi'}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Grup Türü</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {getGroupTypeLabel(selectedType.groupType as EQuestionGroupType)}
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Durum</div>
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                                selectedType.status === 'ACTIVE' ? 'bg-green-500' :
                                    selectedType.status === 'PASSIVE' ? 'bg-yellow-500' :
                                        'bg-gray-500'
                            }`} />
                            <span className="text-lg font-semibold text-gray-900">
                                {selectedType.status === 'ACTIVE' ? 'Aktif' :
                                    selectedType.status === 'PASSIVE' ? 'Pasif' :
                                        selectedType.status || 'Bilinmiyor'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Yönerge ve süre ayarları</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Yönerge var</div>
                        <div className="text-lg font-semibold text-gray-900">{yn(selectedType.hasInstruction)}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Grup süresi var</div>
                        <div className="text-lg font-semibold text-gray-900">{yn(selectedType.hasGroupDuration)}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Süre</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {selectedType.hasGroupDuration && selectedType.duration != null
                                ? selectedType.duration
                                : '—'}
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Bekleme süresi</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {selectedType.hasGroupDuration && selectedType.waitingDuration != null
                                ? selectedType.waitingDuration
                                : '—'}
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Oynatma sayısı</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {selectedType.playbackCount != null ? selectedType.playbackCount : '—'}
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-1">Kayıt süresi</div>
                        <div className="text-lg font-semibold text-gray-900">
                            {selectedType.recordingDuration != null ? selectedType.recordingDuration : '—'}
                        </div>
                    </div>
                </div>
                {instructionHtml && selectedType.hasInstruction && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-500 mb-2">Yönerge metni</div>
                        <HtmlRender
                            className="prose prose-sm max-w-none text-gray-900 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6"
                            html={instructionHtml}
                        />
                    </div>
                )}
            </div>

            {selectedType.examSection && (
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Bağlı Sınav Bölümü</h2>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
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
                                        {selectedType.examSection.orderNumber ?? 'Belirtilmedi'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm font-medium text-purple-600">Durum</div>
                                    <div className="text-purple-900 font-semibold">
                                        {selectedType.examSection.status === 'ACTIVE' ? 'Aktif' : selectedType.examSection.status}
                                    </div>
                                </div>
                            </div>

                            {selectedType.examSection.examType ? (
                                <div className="mt-4 p-4 bg-white/70 rounded-lg border border-purple-200">
                                    <div className="text-sm font-medium text-purple-600 mb-2">Sınav Türü Bilgileri</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <div className="text-xs text-purple-500">Sınav Türü Adı</div>
                                            <div className="text-purple-900 font-semibold">
                                                {(selectedType.examSection.examType as ExamTypeDto).name || 'Belirtilmedi'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-purple-500">Tür</div>
                                            <div className="text-purple-900 font-semibold">
                                                {examTypeConverter((selectedType.examSection.examType as ExamTypeDto).examType as EExamType)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default QuestionGroupTypeDetail;
