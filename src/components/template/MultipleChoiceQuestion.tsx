import React, {useState, useEffect, useCallback} from 'react';
import type {MultipleChoiceTemplateDto, ChoiceOption} from '@/api/generated/model';
import {
    EMediaType, EQuestionType,
} from "@/types/exam/enum";
import type {QuestionTemplateType} from "@/types/exam/questionTemplateTypes";
import HtmlRender from "@/components/ui/html-render";
import MaybeHtml from "@/components/ui/maybe-html";


interface MultipleChoiceQuestionProps {
    template: MultipleChoiceTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (questionId:string, template: QuestionTemplateType, selectedOption: string, type: EQuestionType, mediaType: EMediaType, isEmptyAnswer: boolean) => void;
    initialAnswer?: string | null;
    isSubmitted?: boolean;
    showCorrectAnswer?: boolean;
    showLearnerEvaluation?: boolean;
    questionId:string;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
                                                                           template,
                                                                           isPreview = false,
                                                                           onAnswerChange,
                                                                           initialAnswer = null,
                                                                           isSubmitted = false,
                                                                           showCorrectAnswer = false,
                                                                           showLearnerEvaluation = false,
                                                                           questionId
                                                                       }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(initialAnswer);

    const choices = template.options?.choices ?? [];

    // initialAnswer içindeki text'i option ID'sine çevir
    const convertTextToId = useCallback((text: string | null): string | null => {
        if (!text || !template.options?.choices) {
            return text;
        }
        
        // Option text'ine göre ID bul
        const option = template.options.choices.find(opt => opt.text === text);
        if (option && option.id) {
            return option.id;
        }
        
        // Eğer text bulunamazsa, direkt text'i ID olarak kullan (fallback - belki de backend'den zaten ID geliyor)
        return text;
    }, [template.options?.choices]);

    // template.options.choices'i stable hale getir - sadece ID'leri kullan
    /*
    const choicesIds = useMemo(() => {
        return template.options?.choices?.map(c => c.id).filter(Boolean).join(',') || '';
    }, [template.options?.choices?.length]);

     */

    useEffect(() => {
        // initialAnswer text ise ID'ye çevir
        const convertedId = convertTextToId(initialAnswer);
        setSelectedOption(convertedId);
    }, [initialAnswer, convertTextToId]);

    const handleOptionSelect = (optionId: string) => {
        // isPreview true ise değişiklik yapılmasın
        if (isPreview || (isSubmitted && !isPreview)) return;

        const newSelection = selectedOption === optionId ? null : optionId;
        setSelectedOption(newSelection);
        if (onAnswerChange && !isPreview) {
            onAnswerChange(questionId, template, newSelection ? newSelection : '', EQuestionType.MULTIPLE_CHOICE, EMediaType.TEXT, false);
        }
    };

    // Doğru cevabı bul
    const getCorrectOptionId = (): string | null => {
        if (template.correctOptionIndex !== undefined && template.correctOptionIndex !== null && choices[template.correctOptionIndex]) {
            return choices[template.correctOptionIndex].id || null;
        }
        const correctChoice = choices.find(opt => opt.isCorrect === true);
        return correctChoice?.id || null;
    };

    const getOptionStyle = (option: ChoiceOption) => {
        const baseStyle = "p-4 border rounded-lg transition-all duration-200 ";
        const cursorStyle = isPreview ? "cursor-default " : "cursor-pointer ";

        // showLearnerEvaluation: Öğrencinin cevabı ile doğru cevabı karşılaştır
        if (showLearnerEvaluation) {
            const correctOptionId = getCorrectOptionId();
            const isCorrect = option.id === correctOptionId || option.isCorrect === true;
            const isSelected = selectedOption === option.id;

            if (isSelected && isCorrect) {
                // Öğrenci doğru seçeneği seçmiş: Yeşil
                return baseStyle + cursorStyle + "border-green-500 bg-green-50 text-green-800";
            } else if (isSelected && !isCorrect) {
                // Öğrenci yanlış seçeneği seçmiş: Kırmızı
                return baseStyle + cursorStyle + "border-red-500 bg-red-50 text-red-800";
            } else if (!isSelected && isCorrect) {
                // Öğrenci seçmemiş ama doğru seçenek: Mavi
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
            if (option.isCorrect) {
                return baseStyle + cursorStyle + "border-green-500 bg-green-50 text-green-800";
            }
            if (selectedOption === option.id && !option.isCorrect) {
                return baseStyle + cursorStyle + "border-red-500 bg-red-50 text-red-800";
            }
            return baseStyle + cursorStyle + "border-gray-300 bg-gray-50 opacity-60";
        }

        if (selectedOption === option.id) {
            return baseStyle + cursorStyle + "border-blue-500 bg-blue-50 text-blue-800";
        }

        return baseStyle + "border-gray-300 hover:border-blue-400 hover:bg-blue-50";
    };

    const renderMediaContent = (option: ChoiceOption) => {
        if (!option.mediaUrl) return null;

        switch (option.mediaType) {
            case EMediaType.TEXT:
                return (
                    <div className="mb-2">
                        <HtmlRender html={option.mediaUrl} />
                    </div>
                );
            case EMediaType.IMAGE:
                return (
                    <img
                        src={option.mediaUrl}
                        alt="Option media"
                        className="max-w-full h-auto rounded mb-2"
                        style={{maxHeight: '200px'}}
                    />
                );
            case EMediaType.VIDEO:
                return (
                    <video
                        src={option.mediaUrl}
                        controls
                        className="max-w-full h-auto rounded mb-2"
                        style={{maxHeight: '200px'}}
                    />
                );
            case EMediaType.AUDIO:
                return (
                    <audio
                        src={option.mediaUrl}
                        controls
                        className="w-full mb-2"
                    />
                );
            default:
                return null;
        }
    };

    const renderFeedback = (option: ChoiceOption) => {
        if (!isSubmitted || !showCorrectAnswer || !option.feedback) return null;

        return (
            <div className="mt-2 text-sm italic text-gray-600">
                <strong>Açıklama:</strong> <MaybeHtml value={option.feedback} />
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
                        <MaybeHtml className="text-gray-600 mt-1" value={template.description} />
                    )}
                </div>
            )}

            {/* Question Text */}
            {template.question && (
                <div className="mb-1">
                    <MaybeHtml className="text-gray-800 text-base leading-relaxed" value={template.question} />
                </div>
            )}

            {/* Instructions */}
            {template.instructions && (
                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <MaybeHtml className="text-blue-800 text-sm" value={template.instructions} />
                </div>
            )}

            {/* Options */}
            <div className="space-y-3">
                {choices.map((option, index) => (
                    <div
                        key={option.id || index}
                        className={getOptionStyle(option)}
                        onClick={() => handleOptionSelect(option.id || index.toString())}
                    >
                        <div className="flex items-start space-x-3">
                            {/* Radio Button */}
                            <div className="flex-shrink-0 mt-1">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    selectedOption === (option.id || index.toString())
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-400'
                                }`}>
                                    {selectedOption === (option.id || index.toString()) && (
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                    )}
                                </div>
                            </div>

                            {/* Option Content */}
                            <div className="flex-1">
                                {/* Media Content */}
                                {renderMediaContent(option)}

                                {/* Option Text */}
                                <div className="text-gray-800">
                                    <MaybeHtml value={option.text} />
                                </div>

                                {/* Feedback */}
                                {renderFeedback(option)}
                            </div>

                            {/* Correct/Incorrect Indicators */}
                            {isSubmitted && showCorrectAnswer && (
                                <div className="flex-shrink-0">
                                    {option.isCorrect && (
                                        <div className="text-green-600">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd"
                                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                    )}
                                    {selectedOption === (option.id || index.toString()) && !option.isCorrect && (
                                        <div className="text-red-600">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd"
                                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Overall explanation removed (DTO doesn't expose it) */}

            {/* Question Metadata (only in preview) */}
            {isPreview && (
                <div className="mt-4 p-4 bg-gray-50 rounded border">
                    <h4 className="font-semibold text-gray-700 mb-2">Soru Bilgileri:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        {/* Metadata fields removed (DTO doesn't expose them) */}
                    </div>
                </div>
            )}

           
        </div>
    );
};

export default MultipleChoiceQuestion;