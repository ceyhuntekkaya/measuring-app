'use client';

import React from 'react';
import type {ExamDto} from '@/api/generated/model/examDto';
import type {QuestionGroupDto} from '@/api/generated/model/questionGroupDto';
import type {QuestionDto} from '@/api/generated/model/questionDto';
import type {QuestionTemplateType} from "@/types/exam/questionTemplateTypes";
import {EQuestionType, EMediaType} from '@/types/exam/enum';
import {getQuestionTypeLabel} from '@/utils/question-type-convert';
import {
    AudioResponseTemplateDto,
    DragAndDropTemplateDto,
    EssayTemplateDto,
    FillInTheBlanksTemplateDto,
    HotSpotTemplateDto,
    ImageResponseTemplateDto,
    MatchingTemplateDto,
    MultipleChoiceTemplateDto,
    MultipleResponseTemplateDto,
    OrderingTemplateDto,
    ShortAnswerTemplateDto,
    TrueFalseTemplateDto,
    VideoResponseTemplateDto
} from '@/api/generated/model';
import MultipleChoiceQuestion from '@/components/template/MultipleChoiceQuestion';
import TrueFalseQuestion from '@/components/template/TrueFalseQuestion';
import FillInTheBlanksQuestion from '@/components/template/FillInTheBlanksQuestion';
import ShortAnswerQuestion from '@/components/template/ShortAnswerQuestion';
import EssayQuestion from '@/components/template/EssayQuestion';
import MatchingQuestion from '@/components/template/MatchingQuestion';
import ImageResponseQuestion from '@/components/template/ImageResponseQuestion';
import VideoResponseQuestion from '@/components/template/VideoResponseQuestion';
import AudioResponseQuestion from '@/components/template/AudioResponseQuestion';
import DragAndDropQuestion from '@/components/template/DragAndDropQuestion';
import HotSpotQuestion from '@/components/template/HotSpotQuestion';
import MultipleResponseQuestion from '@/components/template/MultipleResponseQuestion';
import OrderingQuestion from '@/components/template/OrderingQuestion';
import FilePreview from '@/components/ui/file-preview';
import HtmlRender from '@/components/ui/html-render';

interface ExamPreviewListProps {
    exam: ExamDto;
}

const ExamPreviewList: React.FC<ExamPreviewListProps> = ({ exam }) => {
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

    const renderQuestionTemplate = (question: QuestionDto) => {
        if (!question.questionType || !question.questionTemplate) {
            return (
                <div className="text-gray-500 text-sm p-4 bg-gray-50 rounded">
                    Soru şablonu bulunamadı
                </div>
            );
        }

        const type = question.questionType as EQuestionType;
        const template = question.questionTemplate as QuestionTemplateType;

        switch (type) {
            case 'MULTIPLE_CHOICE':
                return (
                    <MultipleChoiceQuestion
                        template={template as MultipleChoiceTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'TRUE_FALSE':
                return (
                    <TrueFalseQuestion
                        template={template as TrueFalseTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'FILL_IN_THE_BLANKS':
                return (
                    <FillInTheBlanksQuestion
                        template={template as FillInTheBlanksTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'SHORT_ANSWER':
                return (
                    <ShortAnswerQuestion
                        template={template as ShortAnswerTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'ESSAY':
                return (
                    <EssayQuestion
                        template={template as EssayTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'MATCHING':
                return (
                    <MatchingQuestion
                        template={template as MatchingTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'ORDERING':
                return (
                    <OrderingQuestion
                        template={template as OrderingTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'MULTIPLE_RESPONSE':
                return (
                    <MultipleResponseQuestion
                        template={template as MultipleResponseTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'HOT_SPOT':
                return (
                    <HotSpotQuestion
                        template={template as HotSpotTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'DRAG_AND_DROP':
                return (
                    <DragAndDropQuestion
                        template={template as DragAndDropTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'AUDIO_RESPONSE':
                return (
                    <AudioResponseQuestion
                        template={template as AudioResponseTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'VIDEO_RESPONSE':
                return (
                    <VideoResponseQuestion
                        template={template as VideoResponseTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'IMAGE_RESPONSE':
                return (
                    <ImageResponseQuestion
                        template={template as ImageResponseTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            default:
                return (
                    <div className="text-gray-500 text-sm p-4 bg-gray-50 rounded">
                        Desteklenmeyen soru tipi: {getQuestionTypeLabel(type)}
                    </div>
                );
        }
    };

    const sortedQuestionGroups = [...(exam.questionGroups || [])].sort((a, b) => {
        const orderA = a.examSection?.orderNumber ?? 0;
        const orderB = b.examSection?.orderNumber ?? 0;
        if (orderA !== orderB) return orderA - orderB;
        // Aynı section içinde orderNumber'a göre sırala
        const groupOrderA = a.questionGroupType?.orderNumber ?? 0;
        const groupOrderB = b.questionGroupType?.orderNumber ?? 0;
        return groupOrderA - groupOrderB;
    });

    return (
        <div className="w-full mx-auto p-6 space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{exam.name}</h1>
                <p className="text-gray-600">Kod: {exam.code}</p>
                {exam.examType && (
                    <p className="text-sm text-gray-500 mt-1">Sınav Tipi: {exam.examType.name}</p>
                )}
            </div>

            {sortedQuestionGroups.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg">Bu sınavda henüz soru grubu bulunmamaktadır.</p>
                </div>
            ) : (
                sortedQuestionGroups.map((questionGroup: QuestionGroupDto, groupIndex: number) => {
                    const sortedQuestions = [...((questionGroup.questions || []) as QuestionDto[])].sort((a: QuestionDto, b: QuestionDto) => {
                        return (a.orderNumber ?? 0) - (b.orderNumber ?? 0);
                    });

                    return (
                        <div
                            key={questionGroup.id || groupIndex}
                            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                        >
                            {/* Question Group Header */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                                                {groupIndex + 1}
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    {questionGroup.name || `Soru Grubu ${groupIndex + 1}`}
                                                </h2>
                                                {questionGroup.examSection && (
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Bölüm: {questionGroup.examSection.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="ml-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-3">
                                            <div>
                                                <span className="text-gray-500">Maksimum Puan:</span>
                                                <span className="ml-2 font-medium">{questionGroup.maximumScore || 'Belirtilmedi'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Süre:</span>
                                                <span className="ml-2 font-medium">{formatDuration(questionGroup.durationInSeconds)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Soru Sayısı:</span>
                                                <span className="ml-2 font-medium">{sortedQuestions.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Question Group Headers */}
                            {questionGroup.headers && questionGroup.headers.length > 0 && (
                                <div className="p-4 bg-gray-50 border-b border-gray-200">
                                    {questionGroup.headers.map((header, headerIndex) => (
                                        <div key={header.id || headerIndex} className="mb-2 last:mb-0">
                                            {header.mediaType === EMediaType.TEXT ? (
                                                <HtmlRender className="prose max-w-none" html={header.content || ''} />
                                            ) : (
                                                <div className="flex justify-center">
                                                    <FilePreview size="medium" fileUrl={header.content || ''} alt="Header" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Questions */}
                            <div className="p-6 space-y-6">
                                {sortedQuestions.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>Bu soru grubunda henüz soru bulunmamaktadır.</p>
                                    </div>
                                ) : (
                                    sortedQuestions.map((question: QuestionDto, questionIndex: number) => (
                                        <div
                                            key={question.id || questionIndex}
                                            className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                                        >
                                            {/* Question Header */}
                                            <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">
                                                        {question.orderNumber || questionIndex + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {question.name || `Soru ${questionIndex + 1}`}
                                                        </div>
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            {getQuestionTypeLabel(question.questionType as EQuestionType)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm">
                                                        <span className="text-gray-500">Puan:</span>
                                                        <span className="ml-1 font-medium">{question.maximumScore || 'Belirtilmedi'}</span>
                                                    </div>
                                                    {question.durationInSeconds && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {formatDuration(question.durationInSeconds)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Question Template */}
                                            <div className="mt-4">
                                                {renderQuestionTemplate(question)}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ExamPreviewList;

