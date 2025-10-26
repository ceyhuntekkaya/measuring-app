import React, {useState, useEffect, useMemo} from 'react';
import {MultipleResponseTemplateDto, ResponseOption} from '@/types/exam/questionTemplates';

interface MultipleResponseQuestionProps {
    template: MultipleResponseTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (selectedIds: string[]) => void;
    initialAnswer?: string[];
    isSubmitted?: boolean;
    showCorrectAnswer?: boolean;
}

interface OptionResult {
    id: string;
    text: string;
    isSelected: boolean;
    isCorrect: boolean;
    shouldBeSelected: boolean;
    feedback?: string;
}

const MultipleResponseQuestion: React.FC<MultipleResponseQuestionProps> = ({
                                                                               template,
                                                                               isPreview = false,
                                                                               onAnswerChange,
                                                                               initialAnswer = [],
                                                                               isSubmitted = false,
                                                                               showCorrectAnswer = false
                                                                           }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>(initialAnswer);
    const [shuffledOptions, setShuffledOptions] = useState<ResponseOption[]>([]);
    const [optionResults, setOptionResults] = useState<OptionResult[]>([]);





    const stableInitialAnswer = useMemo(() => initialAnswer, [JSON.stringify(initialAnswer)]);

    useEffect(() => {
        setSelectedOptions(stableInitialAnswer);
    }, [stableInitialAnswer]);

    useEffect(() => {
        initializeOptions();
    }, [template.options?.choices, template.shuffleOptions]);

    useEffect(() => {
        if (isSubmitted && showCorrectAnswer) {
            evaluateAnswers();
        }
    }, [isSubmitted, showCorrectAnswer, selectedOptions]);

    const initializeOptions = (): void => {
        if (!template.options?.choices) return;

        const options = [...template.options.choices];

        if (template.shuffleOptions && !isSubmitted) {
            const shuffled = options.sort(() => Math.random() - 0.5);
            setShuffledOptions(shuffled);
        } else {
            setShuffledOptions(options);
        }
    };

    const handleOptionToggle = (optionId: string): void => {
        if (isSubmitted && !isPreview) return;

        const isSelected = selectedOptions.includes(optionId);
        let newSelectedOptions: string[];

        if (isSelected) {
            // Deselect
            newSelectedOptions = selectedOptions.filter(id => id !== optionId);
        } else {
            // Select
            // Check max selections
            if (template.maxSelections && selectedOptions.length >= template.maxSelections) {
                // Don't allow more selections
                return;
            }
            newSelectedOptions = [...selectedOptions, optionId];
        }

        setSelectedOptions(newSelectedOptions);

        if (onAnswerChange) {
            onAnswerChange(newSelectedOptions);
        }
    };

    const evaluateAnswers = (): void => {
        if (!template.options?.choices) return;
        if (!shuffledOptions) return;
        const results: OptionResult[] = shuffledOptions.map(option => {
            const isSelected = selectedOptions.includes(option.id || '');
            const shouldBeSelected = option.isCorrect || false;
            const isCorrect = isSelected === shouldBeSelected;

            return {
                id: option.id || '',
                text: option.text || '',
                isSelected,
                isCorrect,
                shouldBeSelected,
                feedback: option.feedback
            };
        });

        setOptionResults(results);
    };

    const getOptionStyle = (optionId: string): string => {
        const baseStyle = "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ";
        const isSelected = selectedOptions.includes(optionId);

        if (isPreview) {
            if (isSelected) {
                return baseStyle + "border-blue-500 bg-blue-50";
            }
            return baseStyle + "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50";
        }

        if (isSubmitted && showCorrectAnswer) {
            const result = optionResults.find(r => r.id === optionId);
            if (!result) return baseStyle + "border-gray-300 bg-white";

            if (result.shouldBeSelected && result.isSelected) {
                // Correct selection
                return baseStyle + "border-green-500 bg-green-50";
            } else if (result.shouldBeSelected && !result.isSelected) {
                // Missed correct answer
                return baseStyle + "border-yellow-500 bg-yellow-50";
            } else if (!result.shouldBeSelected && result.isSelected) {
                // Wrong selection
                return baseStyle + "border-red-500 bg-red-50";
            } else {
                // Correct rejection
                return baseStyle + "border-gray-300 bg-gray-50 opacity-60";
            }
        }

        if (isSelected) {
            return baseStyle + "border-blue-500 bg-blue-50";
        }

        return baseStyle + "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50";
    };

    const getCheckboxStyle = (optionId: string): string => {
        const isSelected = selectedOptions.includes(optionId);
        const baseStyle = "w-5 h-5 rounded border-2 flex items-center justify-center transition-all ";

        if (isSubmitted && showCorrectAnswer) {
            const result = optionResults.find(r => r.id === optionId);
            if (!result) return baseStyle + "border-gray-400";

            if (result.shouldBeSelected && result.isSelected) {
                return baseStyle + "border-green-500 bg-green-500";
            } else if (result.shouldBeSelected && !result.isSelected) {
                return baseStyle + "border-yellow-500 bg-yellow-500";
            } else if (!result.shouldBeSelected && result.isSelected) {
                return baseStyle + "border-red-500 bg-red-500";
            } else {
                return baseStyle + "border-gray-400";
            }
        }

        if (isSelected) {
            return baseStyle + "border-blue-500 bg-blue-500";
        }

        return baseStyle + "border-gray-400";
    };

    const renderMedia = (mediaUrl?: string, mediaType?: string): React.ReactNode => {
        if (!mediaUrl) return null;

        const type = mediaType?.toLowerCase() || '';
        const isImage = type === 'image' || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(mediaUrl);
        const isVideo = type === 'video' || /\.(mp4|webm|ogg)$/i.test(mediaUrl);
        const isAudio = type === 'audio' || /\.(mp3|wav|ogg)$/i.test(mediaUrl);

        if (isImage) {
            return (
                <img
                    src={mediaUrl}
                    alt="Option media"
                    className="max-w-full h-auto rounded border border-gray-200 mt-2"
                    style={{ maxHeight: '150px' }}
                />
            );
        }

        if (isVideo) {
            return (
                <video
                    src={mediaUrl}
                    controls
                    className="max-w-full h-auto rounded border border-gray-200 mt-2"
                    style={{ maxHeight: '150px' }}
                >
                    Tarayıcınız video oynatmayı desteklemiyor.
                </video>
            );
        }

        if (isAudio) {
            return (
                <audio
                    src={mediaUrl}
                    controls
                    className="w-full mt-2"
                >
                    Tarayıcınız ses oynatmayı desteklemiyor.
                </audio>
            );
        }

        return null;
    };

    const renderOptionIndicator = (optionId: string): React.ReactNode => {
        if (!isSubmitted || !showCorrectAnswer) return null;

        const result = optionResults.find(r => r.id === optionId);
        if (!result) return null;

        if (result.shouldBeSelected && result.isSelected) {
            // Correct selection - green check
            return (
                <div className="text-green-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            );
        } else if (result.shouldBeSelected && !result.isSelected) {
            // Missed correct answer - yellow warning
            return (
                <div className="text-yellow-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
            );
        } else if (!result.shouldBeSelected && result.isSelected) {
            // Wrong selection - red X
            return (
                <div className="text-red-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            );
        }

        return null;
    };

    const renderFeedback = (optionId: string): React.ReactNode => {
        if (!isSubmitted || !showCorrectAnswer) return null;

        const result = optionResults.find(r => r.id === optionId);
        if (!result || !result.feedback) return null;

        // Only show feedback for selected options or missed correct answers
        if (!result.isSelected && !result.shouldBeSelected) return null;

        const feedbackColor = result.isCorrect ? 'text-green-700' : 'text-red-700';

        return (
            <div className={`mt-2 text-sm italic ${feedbackColor}`}>
                <strong>Açıklama:</strong> {result.feedback}
            </div>
        );
    };

    const calculateScore = (): { correct: number; total: number; percentage: number } => {
        if (!template.options?.choices) {
            return { correct: 0, total: 0, percentage: 0 };
        }

       // const totalCorrectOptions = shuffledOptions.filter(opt => opt.isCorrect).length;
        const correctSelections = optionResults.filter(r => r.isCorrect).length;
        const totalOptions = shuffledOptions?.length;

        // Calculate based on correct decisions (both correct selections and correct rejections)
        const percentage = totalOptions && totalOptions > 0 ? (correctSelections / totalOptions) * 100 : 0;

        return {
            correct: correctSelections,
            total: totalOptions || 0,
            percentage
        };
    };

    const getSelectionStatus = (): { status: 'valid' | 'warning' | 'invalid'; message: string } => {
        const count = selectedOptions.length;

        if (template.minSelections && count < template.minSelections) {
            return {
                status: 'invalid',
                message: `En az ${template.minSelections} seçenek seçmelisiniz`
            };
        }

        if (template.maxSelections && count > template.maxSelections) {
            return {
                status: 'invalid',
                message: `Maksimum ${template.maxSelections} seçenek seçebilirsiniz`
            };
        }

        if (template.minSelections && template.maxSelections && count >= template.minSelections && count <= template.maxSelections) {
            return {
                status: 'valid',
                message: 'Seçim sayısı uygun'
            };
        }

        return { status: 'valid', message: '' };
    };

    const getSelectionStatusColor = (): string => {
        const status = getSelectionStatus().status;
        switch (status) {
            case 'valid':
                return 'text-green-600';
            case 'warning':
                return 'text-yellow-600';
            case 'invalid':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* Question Title */}
            {template.title && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{template.title}</h3>
                    {template.description && (
                        <p className="text-gray-600 mt-1">{template.description}</p>
                    )}
                </div>
            )}

            {/* Question Statement
            {template.statement && (
                <div className="mb-6">
                    <p className="text-gray-800 text-base leading-relaxed">{template.statement}</p>
                </div>
            )}
            */}
            {/* Question Text */}
            {template.question && (
                <div className="mb-4 p-4 bg-purple-50 border-l-4 border-purple-400 rounded">
                    <p className="text-purple-800 font-medium">{template.question}</p>
                </div>
            )}

            {/* Selection Instructions */}
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                        <p className="text-blue-800 text-sm font-medium">
                            {template.options?.selectionInstruction || 'Doğru olan tüm seçenekleri işaretleyin'}
                        </p>
                        <div className="mt-2 space-y-1 text-xs text-blue-700">
                            {template.minSelections && template.maxSelections && (
                                <p>• {template.minSelections} ile {template.maxSelections} arası seçenek seçmelisiniz</p>
                            )}
                            {template.minSelections && !template.maxSelections && (
                                <p>• En az {template.minSelections} seçenek seçmelisiniz</p>
                            )}
                            {!template.minSelections && template.maxSelections && (
                                <p>• Maksimum {template.maxSelections} seçenek seçebilirsiniz</p>
                            )}
                            {!template.minSelections && !template.maxSelections && (
                                <p>• Birden fazla seçenek doğru olabilir</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Selection Status */}
            {!isSubmitted && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-300 rounded">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 font-medium">Seçim Durumu:</span>
                        <div className="flex items-center space-x-3">
                            <span className={`text-sm font-semibold ${getSelectionStatusColor()}`}>
                                {selectedOptions.length} seçildi
                                {template.maxSelections && ` / ${template.maxSelections}`}
                            </span>
                            {getSelectionStatus().message && (
                                <span className={`text-xs ${getSelectionStatusColor()}`}>
                                    {getSelectionStatus().message}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Options */}
            <div className="space-y-3">
                {shuffledOptions && shuffledOptions.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => handleOptionToggle(option.id || '')}
                        className={getOptionStyle(option.id || '')}
                    >
                        <div className="flex items-start space-x-3">
                            {/* Checkbox */}
                            <div className="flex-shrink-0 mt-1">
                                <div className={getCheckboxStyle(option.id || '')}>
                                    {selectedOptions.includes(option.id || '') && (
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Option Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-gray-800 font-medium break-words">
                                            {option.text}
                                        </p>

                                        {/* Media */}
                                        {option.mediaUrl && renderMedia(option.mediaUrl, option.mediaType)}

                                        {/* Feedback */}
                                        {renderFeedback(option.id || '')}
                                    </div>

                                    {/* Indicator */}
                                    <div className="flex-shrink-0 ml-3">
                                        {renderOptionIndicator(option.id || '')}
                                    </div>
                                </div>
                            </div>
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

            {/* Score Summary */}
            {isSubmitted && showCorrectAnswer && optionResults.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-800">Sonuç:</h4>
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <div className={`text-2xl font-bold ${
                                        calculateScore().percentage === 100
                                            ? 'text-green-600'
                                            : calculateScore().percentage >= 50
                                                ? 'text-yellow-600'
                                                : 'text-red-600'
                                    }`}>
                                        {calculateScore().percentage.toFixed(0)}%
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {calculateScore().correct} / {calculateScore().total} doğru karar
                                    </div>
                                </div>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                    calculateScore().percentage === 100
                                        ? 'bg-green-100'
                                        : calculateScore().percentage >= 50
                                            ? 'bg-yellow-100'
                                            : 'bg-red-100'
                                }`}>
                                    {calculateScore().percentage === 100 ? (
                                        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Statistics */}
                        <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-300">
                            <div className="text-center">
                                <div className="text-xl font-bold text-green-600">
                                    {optionResults.filter(r => r.shouldBeSelected && r.isSelected).length}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">Doğru Seçim</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-yellow-600">
                                    {optionResults.filter(r => r.shouldBeSelected && !r.isSelected).length}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">Kaçırılan</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-red-600">
                                    {optionResults.filter(r => !r.shouldBeSelected && r.isSelected).length}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">Yanlış Seçim</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-gray-600">
                                    {optionResults.filter(r => !r.shouldBeSelected && !r.isSelected).length}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">Doğru Red</div>
                            </div>
                        </div>

                        {/* Correct Answers List */}
                        <div className="pt-3 border-t border-gray-300">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Doğru Cevaplar:</p>
                            <div className="space-y-1">
                                {shuffledOptions && shuffledOptions
                                    .filter(opt => opt.isCorrect)
                                    .map(opt => (
                                        <div key={opt.id} className="text-sm text-green-700 flex items-start space-x-2">
                                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>{opt.text}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
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
                        {shuffledOptions && shuffledOptions.length > 0 && (
                            <div><strong>Seçenek Sayısı:</strong> {shuffledOptions.length}</div>
                        )}
                        {shuffledOptions && shuffledOptions.filter(opt => opt.isCorrect).length > 0 && (
                            <div><strong>Doğru Cevap Sayısı:</strong> {shuffledOptions.filter(opt => opt.isCorrect).length}</div>
                        )}
                        {template.minSelections && (
                            <div><strong>Min. Seçim:</strong> {template.minSelections}</div>
                        )}
                        {template.maxSelections && (
                            <div><strong>Maks. Seçim:</strong> {template.maxSelections}</div>
                        )}
                        {template.shuffleOptions !== undefined && (
                            <div><strong>Karıştırma:</strong> {template.shuffleOptions ? 'Evet' : 'Hayır'}</div>
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
        - Add auto-save functionality
        - Implement keyboard shortcuts (space to toggle)
        - Support for partial credit scoring
        - Add accessibility features for screen readers
        - Implement answer validation before submission
        - Add time tracking per selection
        - Support for grouped options (categories)
        - Implement hint system
        - Add collaborative features (optional)
        - Support for conditional logic (show/hide based on selections)
        - Implement undo/redo functionality
      */}
        </div>
    );
};

export default MultipleResponseQuestion;