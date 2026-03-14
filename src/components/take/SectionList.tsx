import React from 'react';
import type {ExamSectionDto} from "@/api/generated/model";
import {useExamApplicationContext} from "@/contexts/ExamApplicationContext";
import {useSetEndedAt, useUpdateSessionState1} from "@/api/generated/application-management/application-management";
import {ESessionState} from "@/types/exam/enum";
import type {UpdateSessionStateRequestSessionState} from "@/api/generated/model";

interface ExamSectionsListProps {
    sections: ExamSectionDto[];
    onSectionSelect?: (section: ExamSectionDto) => void;
}

const ExamSectionsList: React.FC<ExamSectionsListProps> = ({
                                                               sections,
                                                               onSectionSelect
                                                           }) => {
    const {candidate, application} = useExamApplicationContext();
    const setEndedAtMutation = useSetEndedAt();
    const updateSessionStateMutation = useUpdateSessionState1();
    const loading = setEndedAtMutation.isPending || updateSessionStateMutation.isPending;

    const handleCompleteExam = async () => {
        if (!application?.id) {
            return;
        }

        if (window.confirm('Sınavı tamamlamak istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
            try {
                await setEndedAtMutation.mutateAsync({ id: application.id });
                await updateSessionStateMutation.mutateAsync({ 
                    id: application.id, 
                    data: { 
                        applicationId: application.id,
                        sessionState: ESessionState.FINISHED as UpdateSessionStateRequestSessionState
                    } 
                });
            } catch (error) {
                console.error('Sınav tamamlanırken hata oluştu:', error);
            }
        }
    };

    // orderNumber'a göre sırala
    const sortedSections = [...sections].sort((a, b) => {
        const orderA = a.orderNumber ?? 0;
        const orderB = b.orderNumber ?? 0;
        return orderA - orderB;
    });

    // Kullanıcı adı soyadı
    const userName = candidate ? `${candidate.name || ''} ${candidate.lastName || ''}`.trim() : '';
    const greeting = userName ? `Merhaba, ${userName}` : 'Sınav Bölümleri';

    return (
        <div className="w-full mx-auto p-6 pt-4 bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{greeting}</h2>

            <div className="space-y-3">
                {sortedSections.map((section, index) => (
                    <div
                        key={section.id || index}
                        onClick={() => onSectionSelect?.(section)}
                        className={`
              bg-white rounded-lg border-2 border-gray-200 p-5 
              transition-all duration-200
              ${onSectionSelect ? 'cursor-pointer hover:border-blue-500 hover:shadow-lg hover:scale-[1.02]' : ''}
            `}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Order Number Badge */}
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-bold text-lg">
                    {section.orderNumber ?? '-'}
                  </span>
                                </div>

                                {/* Section Name */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {section.name || 'İsimsiz Bölüm'}
                                    </h3>
                                    {(section.examType as { name?: string })?.name && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {(section.examType as { name?: string }).name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Arrow Icon (if clickable) */}
                            {onSectionSelect && (
                                <div className="flex-shrink-0">
                                    <svg
                                        className="w-6 h-6 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {sortedSections.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">Henüz sınav bölümü bulunmamaktadır.</p>
                    </div>
                )}
            </div>

            {/* Sınavı Tamamla Butonu */}
            <div className="mt-8 flex justify-center">
                <button
                    onClick={handleCompleteExam}
                    disabled={loading || !application?.id}
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? 'İşleniyor...' : 'Sınavı Tamamla'}
                </button>
            </div>
        </div>
    );
};

export default ExamSectionsList;