import React from 'react';
import {ExamSectionDto} from "@/types/exam/examTemplates";
import {SectionQuestionCounts} from "@/app/(protected)/learner/check/start/page";





interface ExamSectionsListProps {
    sections: ExamSectionDto[];
    onSectionSelect?: (section: ExamSectionDto) => void;
    sectionQuestionStatics:SectionQuestionCounts[];
}

const ExamSectionsList: React.FC<ExamSectionsListProps> = ({
                                                               sections,
                                                               onSectionSelect,
                                                               sectionQuestionStatics
                                                           }) => {
    // orderNumber'a göre sırala
    const sortedSections = [...sections].sort((a, b) => {
        const orderA = a.orderNumber ?? 0;
        const orderB = b.orderNumber ?? 0;
        return orderA - orderB;
    });

console.log("ceyhun: ", sectionQuestionStatics)

    return (
        <div className="w-full mx-auto p-6 pt-4 bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sınav Bölümleri</h2>

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
                                    {section.examType?.name && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {section.examType.name}
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
        </div>
    );
};

export default ExamSectionsList;