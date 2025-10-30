import React, {useState, useEffect} from 'react';
import {FillInTheBlanksTemplateDto} from '@/types/exam/questionTemplates';

interface FillInTheBlanksQuestionProps {
    template: FillInTheBlanksTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (answers: BlankAnswers) => void;
    initialAnswer?: BlankAnswers;
    isSubmitted?: boolean;
    showCorrectAnswer?: boolean;
}

interface BlankAnswers {
    [blankId: string]: string;
}

interface BlankResult {
    blankId: string;
    isCorrect: boolean;
    userAnswer: string;
    acceptableAnswers: string[];
    feedback?: string;
    score?: number;
}

const BackupFillInTheBlanksQuestion: React.FC<FillInTheBlanksQuestionProps> = ({
                                                                             template,
                                                                             isPreview = false,
                                                                             onAnswerChange,
                                                                             initialAnswer = {},
                                                                             isSubmitted = false,
                                                                             showCorrectAnswer = false
                                                                         }) => {
    const [answers, setAnswers] = useState<BlankAnswers>(initialAnswer);
    const [blankResults, setBlankResults] = useState<BlankResult[]>([]);



    useEffect(() => {
        if (isSubmitted && showCorrectAnswer) {
            evaluateAnswers();
        }
    }, [isSubmitted, showCorrectAnswer, answers]);

    const handleInputChange = (blankId: string, value: string): void => {
        if (isSubmitted && !isPreview) return;

        const newAnswers = {...answers, [blankId]: value};
        setAnswers(newAnswers);

        if (onAnswerChange) {
            onAnswerChange(newAnswers);
        }
    };

    const evaluateAnswers = (): void => {
        if (!template.options?.blanks) return;

        const results: BlankResult[] = template.options.blanks.map(blank => {
            const blankId = blank.blankId || '';
            const userAnswer = answers[blankId] || '';
            const acceptableAnswers = blank.acceptableAnswers || [];

            // Determine case sensitivity
            const isCaseSensitive = blank.caseSensitive !== undefined
                ? blank.caseSensitive
                : template.caseSensitive !== undefined
                    ? template.caseSensitive
                    : false;

            // Determine exact match requirement
            const requiresExactMatch = blank.exactMatch !== undefined
                ? blank.exactMatch
                : template.exactMatch !== undefined
                    ? template.exactMatch
                    : true;

            let isCorrect = false;

            if (requiresExactMatch) {
                // Exact match comparison
                isCorrect = acceptableAnswers.some(acceptableAnswer => {
                    if (isCaseSensitive) {
                        return userAnswer.trim() === acceptableAnswer.trim();
                    } else {
                        return userAnswer.trim().toLowerCase() === acceptableAnswer.trim().toLowerCase();
                    }
                });
            } else {
                // Partial match comparison
                isCorrect = acceptableAnswers.some(acceptableAnswer => {
                    if (isCaseSensitive) {
                        return userAnswer.trim().includes(acceptableAnswer.trim());
                    } else {
                        return userAnswer.trim().toLowerCase().includes(acceptableAnswer.trim().toLowerCase());
                    }
                });
            }

            return {
                blankId,
                isCorrect,
                userAnswer,
                acceptableAnswers,
                feedback: blank.feedback,
                score: blank.score
            };
        });

        setBlankResults(results);
    };

    const parseTextWithBlanks = (): React.ReactNode[] => {
        if (!template.textWithBlanks) return [];

        const parts: React.ReactNode[] = [];
        const regex = /\[blank:([^\]]+)\]/g;
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(template.textWithBlanks)) !== null) {
            const blankId = match[1];
            const matchIndex = match.index;

            // Add text before the blank
            if (matchIndex > lastIndex) {
                const textBefore = template.textWithBlanks.substring(lastIndex, matchIndex);
                parts.push(
                    <span key={`text-${lastIndex}`} className="text-gray-800">
                        {textBefore}
                    </span>
                );
            }

            // Add the blank input
            parts.push(renderBlankInput(blankId));

            lastIndex = regex.lastIndex;
        }

        // Add remaining text after the last blank
        if (lastIndex < template.textWithBlanks.length) {
            const remainingText = template.textWithBlanks.substring(lastIndex);
            parts.push(
                <span key={`text-${lastIndex}`} className="text-gray-800">
                    {remainingText}
                </span>
            );
        }

        return parts;
    };

    const renderBlankInput = (blankId: string): React.ReactNode => {
        const userAnswer = answers[blankId] || '';
        const result = blankResults.find(r => r.blankId === blankId);

        const getInputStyle = (): string => {
            const baseStyle = "inline-block mx-1 px-3 py-1 border-b-2 outline-none transition-all duration-200 ";

            if (isSubmitted && showCorrectAnswer && result) {
                if (result.isCorrect) {
                    return baseStyle + "border-green-500 bg-green-50 text-green-800";
                } else {
                    return baseStyle + "border-red-500 bg-red-50 text-red-800";
                }
            }

            if (userAnswer) {
                return baseStyle + "border-blue-500 bg-blue-50 text-gray-800";
            }

            return baseStyle + "border-gray-400 bg-white text-gray-800 focus:border-blue-500 focus:bg-blue-50";
        };

        const getInputWidth = (): string => {
            const length = Math.max(userAnswer.length, 10);
            return `${length + 2}ch`;
        };

        return (
            <span key={`blank-${blankId}`} className="inline-flex items-center">
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => handleInputChange(blankId, e.target.value)}
                    disabled={isSubmitted && !isPreview}
                    className={getInputStyle()}
                    style={{width: getInputWidth(), minWidth: '100px'}}
                    placeholder="..."
                />
                {isSubmitted && showCorrectAnswer && result && (
                    <span className="ml-1">
                        {result.isCorrect ? (
                            <svg className="w-5 h-5 text-green-600 inline-block" fill="currentColor"
                                 viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"/>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-red-600 inline-block" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"/>
                            </svg>
                        )}
                    </span>
                )}
            </span>
        );
    };

    const renderBlankFeedback = (): React.ReactNode => {
        if (!isSubmitted || !showCorrectAnswer || blankResults.length === 0) return null;

        const incorrectResults = blankResults.filter(r => !r.isCorrect);
        if (incorrectResults.length === 0) return null;

        return (
            <div className="mt-6 space-y-3">
                <h4 className="font-semibold text-gray-800 text-lg">Boşluk Detayları:</h4>
                {incorrectResults.map((result) => (
                    <div key={`feedback-${result.blankId}`} className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
                        <div className="space-y-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-red-800 font-medium">
                                        {incorrectResults.map((result, index) => {
                                            const blankIndex = template.options?.blanks?.findIndex(b => b.blankId === result.blankId);
                                            const blankNumber = blankIndex !== undefined && blankIndex !== -1 ? blankIndex + 1 : index + 1;
                                            return (
                                                <span key={index}>  Boşluk {blankNumber}</span>
                                            );
                                        })}
                                    </p>
                                    <p className="text-red-700 text-sm mt-1">
                                        <strong>Cevabınız:</strong> {result.userAnswer || '(Boş bırakıldı)'}
                                    </p>
                                </div>
                                <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="currentColor"
                                     viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"/>
                                </svg>
                            </div>

                            <div className="mt-2 p-3 bg-white rounded border border-red-200">
                                <p className="text-green-800 font-medium text-sm mb-1">
                                    Kabul Edilen Cevaplar:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                    {result.acceptableAnswers.map((answer, idx) => (
                                        <li key={idx} className="text-green-700 text-sm">
                                            {answer}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {result.feedback && (
                                <div className="mt-2 text-sm italic text-red-700">
                                    <strong>Açıklama:</strong> {result.feedback}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const calculateScore = (): { earned: number; total: number; percentage: number } => {
        if (!template.options?.blanks || blankResults.length === 0) {
            return {earned: 0, total: 0, percentage: 0};
        }

        let earnedScore = 0;
        let totalScore = 0;

        blankResults.forEach(result => {
            const blankScore = result.score || 1;
            totalScore += blankScore;
            if (result.isCorrect) {
                earnedScore += blankScore;
            }
        });

        const percentage = totalScore > 0 ? (earnedScore / totalScore) * 100 : 0;

        return {earned: earnedScore, total: totalScore, percentage};
    };

    const getProgressInfo = (): { filled: number; total: number } => {
        const total = template.options?.blanks?.length || 0;
        const filled = Object.values(answers).filter(answer => answer.trim() !== '').length;
        return {filled, total};
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
            {/* Instructions */}
            <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"/>
                    </svg>
                    <div className="flex-1">
                        <p className="text-blue-800 text-sm font-medium">
                            Aşağıdaki metindeki boşlukları uygun kelimelerle doldurun.
                        </p>
                        <div className="mt-2 space-y-1 text-xs text-blue-700">
                            {template.caseSensitive && (
                                <p>• Büyük-küçük harf duyarlıdır</p>
                            )}
                            {template.exactMatch && (
                                <p>• Tam eşleşme gereklidir</p>
                            )}
                            {!isSubmitted && (
                                <p>• Boşluklar metin içinde ____ ile gösterilmiştir</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Indicator */}
            {!isSubmitted && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-300 rounded">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 font-medium">İlerleme:</span>
                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">
                                {getProgressInfo().filled} / {getProgressInfo().total} boşluk dolduruldu
                            </span>
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{
                                        width: `${getProgressInfo().total > 0
                                            ? (getProgressInfo().filled / getProgressInfo().total) * 100
                                            : 0}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Text with Blanks */}
            <div className="p-6 bg-white border-2 border-gray-300 rounded-lg">
                <div className="text-lg leading-relaxed">
                    {parseTextWithBlanks()}
                </div>
            </div>

            {/* Blank Feedback (for incorrect answers) */}
            {renderBlankFeedback()}

            {/* Overall Explanation */}
            {isSubmitted && showCorrectAnswer && template.explanation && (
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <h4 className="font-semibold text-yellow-800 mb-2">Genel Açıklama:</h4>
                    <p className="text-yellow-700">{template.explanation}</p>
                </div>
            )}

            {/* Score Summary (for submitted state) */}
            {isSubmitted && showCorrectAnswer && blankResults.length > 0 && (
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
                                        {calculateScore().earned} / {calculateScore().total} puan
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
                                            <path fillRule="evenodd"
                                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    ) : (
                                        <svg className="w-8 h-8 text-yellow-600" fill="currentColor"
                                             viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                  clipRule="evenodd"/>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-300">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {blankResults.filter(r => r.isCorrect).length}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">Doğru</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {blankResults.filter(r => !r.isCorrect).length}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">Yanlış</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-600">
                                    {blankResults.length}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">Toplam</div>
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
                        {template.options?.blanks && (
                            <div><strong>Boşluk Sayısı:</strong> {template.options.blanks.length}</div>
                        )}
                        {template.caseSensitive !== undefined && (
                            <div><strong>Harf Duyarlı:</strong> {template.caseSensitive ? 'Evet' : 'Hayır'}</div>
                        )}
                        {template.exactMatch !== undefined && (
                            <div><strong>Tam Eşleşme:</strong> {template.exactMatch ? 'Evet' : 'Hayır'}</div>
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
        - Add auto-save functionality for answers
        - Implement spell check suggestions
        - Add keyboard shortcuts for navigation
        - Support for rich text in blanks
        - Implement partial credit scoring
        - Add hint system for blanks
        - Support for multiple acceptable answer variations
        - Implement answer validation before submission
        - Add accessibility features for screen readers
        - Support for RTL languages
        - Implement answer history/undo functionality
        - Add collaborative features (optional)
        - Support for mathematical expressions in blanks
        - Implement fuzzy matching for answers
        - Add time tracking per blank
        - Support for audio/video prompts in blanks
      */}
        </div>
    );
};

export default BackupFillInTheBlanksQuestion;