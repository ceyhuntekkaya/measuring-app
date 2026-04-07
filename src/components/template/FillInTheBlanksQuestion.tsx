import React, {useState, useEffect, useMemo} from 'react';
import type {FillInTheBlanksTemplateDto} from '@/api/generated/model';
import type {QuestionTemplateType} from "@/types/exam/questionTemplateTypes";
import {EMediaType, EQuestionType} from "@/types/exam/enum";
import MaybeHtml from "@/components/ui/maybe-html";

interface FillInTheBlanksQuestionProps {
    template: FillInTheBlanksTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (questionId: string, template: QuestionTemplateType, selectedOption: string, type: EQuestionType, mediaType: EMediaType, isEmptyAnswer: boolean) => void;
    initialAnswer?: BlankAnswers;
    isSubmitted?: boolean;
    showCorrectAnswer?: boolean;
    showLearnerEvaluation?: boolean;
    questionId: string;
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

interface SingleBlankAnswer {
    blankId: string;
    answer: string;
}

const FillInTheBlanksQuestion: React.FC<FillInTheBlanksQuestionProps> = ({
                                                                             template,
                                                                             isPreview = false,
                                                                             onAnswerChange,
                                                                             initialAnswer = {},
                                                                             isSubmitted = false,
                                                                             showCorrectAnswer = false,
                                                                             showLearnerEvaluation = false,
                                                                             questionId
                                                                         }) => {
    const [answers, setAnswers] = useState<BlankAnswers>(initialAnswer || {});

    const [blankResults, setBlankResults] = useState<BlankResult[]>([]);

    // initialAnswer'ı stable hale getir (obje referansı değişmesin diye)
    const stableInitialAnswer = useMemo(() => {
        if (!initialAnswer || typeof initialAnswer !== 'object') {
            return {};
        }
        return initialAnswer;
    }, [questionId, JSON.stringify(initialAnswer)]);

    // initialAnswer değiştiğinde state'i güncelle (soru değiştiğinde veya eski cevap yüklendiğinde)
    useEffect(() => {
        if (stableInitialAnswer && typeof stableInitialAnswer === 'object') {
            // initialAnswer'ı kontrol et ve güncelle
            const hasValidData = Object.keys(stableInitialAnswer).length > 0;
            if (hasValidData) {
                setAnswers(stableInitialAnswer);
            } else {
                setAnswers({});
            }
        } else {
            setAnswers({});
        }
    }, [questionId, stableInitialAnswer]);

    const blankHintFlags = useMemo(() => {
        const blanks = template.options?.blanks ?? [];
        return {
            anyCaseSensitive: blanks.some(b => b.caseSensitive),
            anyExact: blanks.some(b => b.exactMatch),
        };
    }, [template.options?.blanks]);

    useEffect(() => {
        if (isSubmitted && showCorrectAnswer) {
            evaluateAnswers();
        }
    }, [isSubmitted, showCorrectAnswer, answers]);


    const handleInputChange = (blankId: string, value: string): void => {
        // isPreview true ise değişiklik yapılmasın
        if (isPreview || (isSubmitted && !isPreview)) return;

        //const propName = "blank_"+blankId;
        const currentAnswers = answers || {};
        const newAnswers = {...currentAnswers, [blankId]: value};
        setAnswers(newAnswers);

        if (onAnswerChange && !isPreview) {
            //   onAnswerChange(questionId, template, newAnswers ? JSON.stringify(newAnswers) : '', EQuestionType.TRUE_FALSE, EMediaType.TEXT, false);
        }
    };

    const handleSaveAnswer = () => {
        if (onAnswerChange) {
            function convertToBlankAnswers(
                answer: Record<string, string>
            ): SingleBlankAnswer[] {
                if (!answer || typeof answer !== 'object') {
                    return [];
                }
                return Object.entries(answer).map(([index, answerValue]) => {
                    const blankIndex = parseInt(index) - 1; // "1" -> index 0, "2" -> index 1

                    if (template && template.options && template.options.blanks) {
                        const blank = template.options?.blanks[blankIndex];
                        return {
                            blankId: blank?.blankId || '',
                            answer: answerValue
                        };
                    }
                    return {
                        blankId: '',
                        answer: answerValue
                    };
                });
            }

            const currentAnswers = answers || {};
            const converted = convertToBlankAnswers(currentAnswers);
            onAnswerChange(questionId, template, currentAnswers ? JSON.stringify(converted) : '', EQuestionType.TRUE_FALSE, EMediaType.TEXT, false);
        }
    }


    const evaluateAnswers = (): void => {
        if (!template.options?.blanks) return;

        const currentAnswers = answers || {};
        const results: BlankResult[] = template.options.blanks.map(blank => {
            const blankId = blank.blankId || '';
            const userAnswer = currentAnswers[blankId] || '';
            const acceptableAnswers = blank.acceptableAnswers || [];

            const isCaseSensitive = blank.caseSensitive ?? false;
            const requiresExactMatch = blank.exactMatch ?? false;

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
        const regex = /\[blank_([^\]]+)\]/g;
        let lastIndex = 0;
        let match: RegExpExecArray | null;
        let blankIndex = 0; // Template'deki blank'ların sırasını takip et

        while ((match = regex.exec(template.textWithBlanks)) !== null) {
            const matchedId = match[1]; // Regex'ten yakalanan değer (örneğin "1", "2" veya "blank_1765265652017")
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

            // Gerçek blankId'yi bul
            let actualBlankId: string;
            
            // Eğer matchedId zaten "blank_" ile başlıyorsa (örneğin "blank_1765265652017"), direkt kullan
            if (matchedId.startsWith('blank_')) {
                actualBlankId = matchedId;
            } else {
                // Eğer matchedId bir sayı ise (örneğin "1", "2"), template.options.blanks array'inden gerçek blankId'yi al
                const numericIndex = parseInt(matchedId, 10);
                if (!isNaN(numericIndex) && template.options?.blanks && template.options.blanks[numericIndex - 1]) {
                    // Index 1-based ise (1, 2, 3...), 0-based'e çevir (0, 1, 2...)
                    actualBlankId = template.options.blanks[numericIndex - 1].blankId || matchedId;
                } else if (template.options?.blanks && template.options.blanks[blankIndex]) {
                    // Eğer parse edilemezse, blankIndex kullan (sırayla)
                    actualBlankId = template.options.blanks[blankIndex].blankId || matchedId;
                } else {
                    // Fallback: matchedId'yi kullan
                    actualBlankId = matchedId;
                }
            }
            // Add the blank input
            parts.push(renderBlankInput(actualBlankId));

            blankIndex++; // Bir sonraki blank için index'i artır
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
        const currentAnswers = answers || {};
        const userAnswer = currentAnswers[blankId] || '';
        const result = blankResults.find(r => r.blankId === blankId);
        const getInputStyle = (): string => {
            const baseStyle = "inline-block mx-1 px-3 py-1 border-b-2 outline-none transition-all duration-200 ";

            // showLearnerEvaluation: Öğrencinin cevabı ile doğru cevabı karşılaştır
            if (showLearnerEvaluation) {
                const blank = template.options?.blanks?.find(b => b.blankId === blankId);
                if (blank && blank.acceptableAnswers && blank.acceptableAnswers.length > 0) {
                    const isCorrect = blank.acceptableAnswers.some(acceptable => {
                        if (blank.caseSensitive) {
                            return acceptable === userAnswer;
                        } else {
                            return acceptable.toLowerCase() === userAnswer.toLowerCase();
                        }
                    });

                    if (userAnswer && isCorrect) {
                        // Öğrenci doğru cevabı vermiş: Yeşil
                        return baseStyle + "border-green-500 bg-green-50 text-green-800";
                    } else if (userAnswer && !isCorrect) {
                        // Öğrenci yanlış cevabı vermiş: Kırmızı
                        return baseStyle + "border-red-500 bg-red-50 text-red-800";
                    } else if (!userAnswer) {
                        // Öğrenci cevap vermemiş ama doğru cevap var: Mavi (placeholder gibi)
                        return baseStyle + "border-blue-500 bg-blue-50 text-blue-600 italic";
                    }
                }
            }

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
                    onChange={(e) => {
                        handleInputChange(blankId, e.target.value)
                    }}
                    disabled={isPreview || (isSubmitted && !isPreview)}
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
                                    <strong>Açıklama:</strong> <MaybeHtml value={result.feedback} />
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
        // answers null veya undefined olabilir, kontrol et
        if (!answers || typeof answers !== 'object') {
            return {filled: 0, total};
        }
        const filled = Object.values(answers).filter(answer => answer && typeof answer === 'string' && answer.trim() !== '').length;
        return {filled, total};
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
                            {blankHintFlags.anyCaseSensitive && (
                                <p>• Bazı boşluklar büyük-küçük harf duyarlıdır</p>
                            )}
                            {blankHintFlags.anyExact && (
                                <p>• Bazı boşluklarda tam eşleşme gereklidir</p>
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
            {!isPreview && (
                <button className={"btn btn-success"} onClick={handleSaveAnswer}>KAYDET</button>
            )}
            {/* Blank Feedback (for incorrect answers) */}
            {renderBlankFeedback()}

            {/* Overall explanation removed (DTO doesn't expose it) */}

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

         
        </div>
    );
};

export default FillInTheBlanksQuestion;