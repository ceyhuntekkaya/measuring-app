import React, {useState, useEffect} from 'react';
import {MultipleChoiceTemplateDto, ChoiceOption} from '@/types/exam/questionTemplates';
import {
    EMediaType, EQuestionType,
} from "@/types/exam/enum";
import {QuestionTemplateType} from "@/types/exam/examEntities";


interface MultipleChoiceQuestionProps {
    template: MultipleChoiceTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (questionId:string, template: QuestionTemplateType, selectedOption: string, type: EQuestionType, mediaType: EMediaType, isEmptyAnswer: boolean) => void;
    initialAnswer?: string | null;
    isSubmitted?: boolean;
    showCorrectAnswer?: boolean;
    questionId:string;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
                                                                           template,
                                                                           isPreview = false,
                                                                           onAnswerChange,
                                                                           initialAnswer = null,
                                                                           isSubmitted = false,
                                                                           showCorrectAnswer = false,
                                                                           questionId
                                                                       }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(initialAnswer);
    const [shuffledOptions, setShuffledOptions] = useState<ChoiceOption[]>([]);

    useEffect(() => {
        if (template.options?.choices) {
            // Shuffle options if specified in template and not in preview mode
            const options = template.shuffleOptions && !isPreview
                ? [...template.options.choices].sort(() => Math.random() - 0.5)
                : template.options.choices;
            setShuffledOptions(options);
        }
    }, [template, isPreview]);

    useEffect(() => {
        setSelectedOption(initialAnswer);
    }, [initialAnswer]);

    const handleOptionSelect = (optionId: string) => {
        if (isSubmitted && !isPreview) return; // Prevent changes after submission

        const newSelection = selectedOption === optionId ? null : optionId;
        setSelectedOption(newSelection);
        if (onAnswerChange) {
            onAnswerChange(questionId, template, newSelection ? newSelection : '', EQuestionType.MULTIPLE_CHOICE, EMediaType.TEXT, false);
        }
    };

    const getOptionStyle = (option: ChoiceOption) => {
        const baseStyle = "p-4 border rounded-lg cursor-pointer transition-all duration-200 ";

        if (isPreview) {
            return baseStyle + "border-gray-300 hover:border-blue-400 hover:bg-blue-50";
        }

        if (isSubmitted && showCorrectAnswer) {
            if (option.isCorrect) {
                return baseStyle + "border-green-500 bg-green-50 text-green-800";
            }
            if (selectedOption === option.id && !option.isCorrect) {
                return baseStyle + "border-red-500 bg-red-50 text-red-800";
            }
            return baseStyle + "border-gray-300 bg-gray-50 opacity-60";
        }

        if (selectedOption === option.id) {
            return baseStyle + "border-blue-500 bg-blue-50 text-blue-800";
        }

        return baseStyle + "border-gray-300 hover:border-blue-400 hover:bg-blue-50";
    };

    const renderMediaContent = (option: ChoiceOption) => {
        if (!option.mediaUrl) return null;

        switch (option.mediaType) {
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
                <strong>Açıklama:</strong> {option.feedback}
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

            {/* Question Text */}
            {template.question && (
                <div className="mb-6">
                    <p className="text-gray-800 text-base leading-relaxed">{template.question}</p>
                </div>
            )}

            {/* Instructions */}
            {template.instructions && (
                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-blue-800 text-sm">{template.instructions}</p>
                </div>
            )}

            {/* Options */}
            <div className="space-y-3">
                {shuffledOptions.map((option, index) => (
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
                                    {option.text}
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

            {/* Overall Explanation */}
            {isSubmitted && showCorrectAnswer && template.explanation && (
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <h4 className="font-semibold text-yellow-800 mb-2">Genel Açıklama:</h4>
                    <p className="text-yellow-700">{template.explanation}</p>
                </div>
            )}

            {/* Preview Mode Indicator */}
            {isPreview && (
                <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded">
                    <p className="text-gray-600 text-sm italic">
                        👁️ Önizleme Modu - Bu sorunun nasıl görüneceğinin önizlemesidir
                    </p>
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
                            <div><strong>Zorluk:</strong> {template.difficulty}</div>
                        )}
                        {template.points && (
                            <div><strong>Puan:</strong> {template.points}</div>
                        )}
                        {template.timeLimit && (
                            <div><strong>Süre:</strong> {template.timeLimit} saniye</div>
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
        - Add timer functionality
        - Save answers to backend
        - Handle exam submission
        - Add progress tracking
        - Implement navigation between questions
        - Add exam state management (paused, resumed, etc.)
        - Security measures for exam integrity
        - Auto-save functionality
        - Handle network issues
      */}
        </div>
    );
};

export default MultipleChoiceQuestion;