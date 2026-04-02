import React, { useState, useEffect } from 'react';
import type { TrueFalseTemplateDto } from '@/api/generated/model';
import type {QuestionTemplateType} from "@/types/exam/questionTemplateTypes";
import {EMediaType, EQuestionType} from "@/types/exam/enum";
import {difficultyConverter} from "@/utils/enum-converter";
import MaybeHtml from "@/components/ui/maybe-html";

interface TrueFalseQuestionProps {
    template: TrueFalseTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (questionId:string, template: QuestionTemplateType, selectedOption: string, type: EQuestionType, mediaType: EMediaType, isEmptyAnswer: boolean) => void;
    initialAnswer?: boolean | null;
    isSubmitted?: boolean;
    showCorrectAnswer?: boolean;
    showLearnerEvaluation?: boolean;
    questionId: string;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({
                                                                 template,
                                                                 isPreview = false,
                                                                 onAnswerChange,
                                                                 initialAnswer = null,
                                                                 isSubmitted = false,
                                                                 showCorrectAnswer = false,
                                                                 showLearnerEvaluation = false,
                                                                 questionId
                                                             }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(initialAnswer);

    useEffect(() => {
        setSelectedAnswer(initialAnswer);
    }, [initialAnswer]);

    const handleAnswerSelect = (answer: boolean) => {
        // isPreview true ise değişiklik yapılmasın
        if (isPreview || (isSubmitted && !isPreview)) return;

        const newSelection = selectedAnswer === answer ? null : answer;
        setSelectedAnswer(newSelection);

        if (onAnswerChange && !isPreview) {
            onAnswerChange(questionId, template, newSelection ? newSelection+'' : 'false', EQuestionType.TRUE_FALSE, EMediaType.TEXT, false);
        }
    };

    const getOptionStyle = (optionValue: boolean) => {
        const baseStyle = "p-4 border rounded-lg transition-all duration-200 flex items-center space-x-3 ";
        const cursorStyle = isPreview ? "cursor-default " : "cursor-pointer ";

        // Doğru cevabı bul
        const correctAnswer = template.correctAnswer ?? template.options?.correctAnswer;

        // showLearnerEvaluation: Öğrencinin cevabı ile doğru cevabı karşılaştır
        if (showLearnerEvaluation && correctAnswer !== undefined) {
            const isCorrect = correctAnswer === optionValue;
            const isSelected = selectedAnswer === optionValue;

            if (isSelected && isCorrect) {
                // Öğrenci doğru cevabı seçmiş: Yeşil
                return baseStyle + cursorStyle + "border-green-500 bg-green-50 text-green-800";
            } else if (isSelected && !isCorrect) {
                // Öğrenci yanlış cevabı seçmiş: Kırmızı
                return baseStyle + cursorStyle + "border-red-500 bg-red-50 text-red-800";
            } else if (!isSelected && isCorrect) {
                // Öğrenci seçmemiş ama doğru cevap: Mavi
                return baseStyle + cursorStyle + "border-blue-500 bg-blue-50 text-blue-800";
            } else {
                // Diğer seçenekler: Gri
                return baseStyle + cursorStyle + "border-gray-300 bg-gray-50 opacity-60";
            }
        }

        if (isPreview) {
            return baseStyle + cursorStyle + "border-gray-300 hover:border-blue-400 hover:bg-blue-50";
        }

        if (isSubmitted && showCorrectAnswer) {
            const isCorrect = correctAnswer === optionValue;
            if (isCorrect) {
                return baseStyle + cursorStyle + "border-green-500 bg-green-50 text-green-800";
            }
            if (selectedAnswer === optionValue && !isCorrect) {
                return baseStyle + cursorStyle + "border-red-500 bg-red-50 text-red-800";
            }
            return baseStyle + cursorStyle + "border-gray-300 bg-gray-50 opacity-60";
        }

        if (selectedAnswer === optionValue) {
            return baseStyle + cursorStyle + "border-blue-500 bg-blue-50 text-blue-800";
        }

        return baseStyle + cursorStyle + "border-gray-300 hover:border-blue-400 hover:bg-blue-50";
    };

    const getOptionText = (optionValue: boolean) => {
        if (template.options?.trueLabel && template.options?.falseLabel) {
            return optionValue ? template.options.trueLabel : template.options.falseLabel;
        }
        return optionValue ? 'Doğru' : 'Yanlış';
    };

    const getFeedback = (optionValue: boolean) => {
        if (!isSubmitted || !showCorrectAnswer || !template.options) return null;

        if (selectedAnswer === optionValue) {
            if (optionValue && template.options.trueFeedback) {
                return template.options.trueFeedback;
            }
            if (!optionValue && template.options.falseFeedback) {
                return template.options.falseFeedback;
            }
        }
        return null;
    };

    const renderFeedback = (optionValue: boolean) => {
        const feedback = getFeedback(optionValue);
        if (!feedback) return null;

        return (
            <div className="mt-2 text-sm italic text-gray-600">
                <strong>Açıklama:</strong> {feedback}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Question Title */}
            {template.title && template.title === "NOT_SET" && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{template.title}</h3>
                    {template.description && (
                        <p className="text-gray-600 mt-1">{template.description}</p>
                    )}
                </div>
            )}

            {/* Question Statement */}
            {template.statement && (
                <div className="mb-1">
                    <MaybeHtml className="text-gray-800 text-base leading-relaxed" value={template.statement} />
                </div>
            )}

            {/* Instructions */}
            {template.instructions && (
                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <MaybeHtml className="text-blue-800 text-sm" value={template.instructions} />
                </div>
            )}

            {/* True/False Options */}
            <div className="space-y-3">
                {/* True Option */}
                <div
                    className={getOptionStyle(true)}
                    onClick={() => handleAnswerSelect(true)}
                >
                    <div className="flex items-start space-x-3 w-full">
                        {/* Radio Button */}
                        <div className="flex-shrink-0 mt-1">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedAnswer === true
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-400'
                            }`}>
                                {selectedAnswer === true && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                            </div>
                        </div>

                        {/* Option Content */}
                        <div className="flex-1">
                            <div className="text-gray-800 font-medium">
                                {getOptionText(true)}
                            </div>
                            {/* Feedback */}
                            {renderFeedback(true)}
                        </div>

                        {/* Correct/Incorrect Indicators */}
                        {isSubmitted && showCorrectAnswer && (
                            <div className="flex-shrink-0">
                                {template.correctAnswer === true && (
                                    <div className="text-green-600">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                                {selectedAnswer === true && template.correctAnswer !== true && (
                                    <div className="text-red-600">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* False Option */}
                <div
                    className={getOptionStyle(false)}
                    onClick={() => handleAnswerSelect(false)}
                >
                    <div className="flex items-start space-x-3 w-full">
                        {/* Radio Button */}
                        <div className="flex-shrink-0 mt-1">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedAnswer === false
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-400'
                            }`}>
                                {selectedAnswer === false && (
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                            </div>
                        </div>

                        {/* Option Content */}
                        <div className="flex-1">
                            <div className="text-gray-800 font-medium">
                                {getOptionText(false)}
                            </div>
                            {/* Feedback */}
                            {renderFeedback(false)}
                        </div>

                        {/* Correct/Incorrect Indicators */}
                        {isSubmitted && showCorrectAnswer && (
                            <div className="flex-shrink-0">
                                {template.correctAnswer === false && (
                                    <div className="text-green-600">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                                {selectedAnswer === false && template.correctAnswer !== false && (
                                    <div className="text-red-600">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Overall Explanation */}
            {isSubmitted && showCorrectAnswer && template.explanation && (
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <h4 className="font-semibold text-yellow-800 mb-2">Genel Açıklama:</h4>
                    <MaybeHtml className="text-yellow-700" value={template.explanation} />
                </div>
            )}

            {/* Answer Summary (for submitted state) */}
            {isSubmitted && showCorrectAnswer && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
                    <div className="flex items-center space-x-4 text-sm">
                        <div>
                            <strong>Seçiminiz:</strong> {
                            selectedAnswer !== null
                                ? getOptionText(selectedAnswer)
                                : 'Seçim yapılmadı'
                        }
                        </div>
                        <div>
                            <strong>Doğru Cevap:</strong> {
                            template.correctAnswer !== undefined
                                ? getOptionText(template.correctAnswer)
                                : 'Belirtilmemiş'
                        }
                        </div>
                        <div className={`font-semibold ${
                            selectedAnswer === template.correctAnswer
                                ? 'text-green-600'
                                : 'text-red-600'
                        }`}>
                            {selectedAnswer === template.correctAnswer ? '✓ Doğru' : '✗ Yanlış'}
                        </div>
                    </div>
                </div>
            )}

            {/* Question Metadata (only in preview) */}
            {isPreview && (
                <div className="mt-4 p-4 bg-gray-50 rounded border">
                    <h4 className="font-semibold text-gray-700 mb-2">Soru Bilgileri:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        {template.subject && (
                            <div><strong>Konu:</strong> {template.subject}</div>
                        )}
                        {template.difficulty && (
                            <div><strong>Zorluk:</strong> {difficultyConverter(template.difficulty)}</div>
                        )}
                        {template.points && (
                            <div><strong>Puan:</strong> {template.points}</div>
                        )}
                        {template.timeLimit && (
                            <div><strong>Süre:</strong> {template.timeLimit} saniye</div>
                        )}
                        {template.correctAnswer !== undefined && (
                            <div><strong>Doğru Cevap:</strong> {getOptionText(template.correctAnswer)}</div>
                        )}
                        {template.tags && template.tags.length > 0 && (
                            <div className="col-span-2">
                                <strong>Etiketler:</strong> {template.tags.join(', ')}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Development Notes - Comment for future exam implementation */}
            {/*
        TODO: Real exam implementation
        - Integrate with exam session management
        - Add timer functionality for individual questions
        - Save answers to backend with proper validation
        - Handle exam submission and auto-save
        - Add progress tracking within exam context
        - Implement navigation between questions
        - Add exam state management (paused, resumed, etc.)
        - Security measures for exam integrity
        - Handle network issues and offline scenarios
        - Implement proper scoring logic
        - Add accessibility features for screen readers
        - Support for multiple languages/localization
      */}
        </div>
    );
};

export default TrueFalseQuestion;