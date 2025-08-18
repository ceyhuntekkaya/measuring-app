import React, { useState, useEffect, useMemo } from 'react';
import { FillInTheBlanksTemplateDto, BlankAnswer } from '@/types/exam/questionTemplates';

interface FillInTheBlanksQuestionProps {
    template: FillInTheBlanksTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (answers: Record<string, string>) => void;
    initialAnswers?: Record<string, string>;
    isSubmitted?: boolean;
    showCorrectAnswer?: boolean;
}

interface BlankItem {
    blankId: string;
    placeholder: string;
    config?: BlankAnswer;
}

const FillInTheBlanksQuestion: React.FC<FillInTheBlanksQuestionProps> = ({
                                                                             template,
                                                                             isPreview = false,
                                                                             onAnswerChange,
                                                                             initialAnswers = {},
                                                                             isSubmitted = false,
                                                                             showCorrectAnswer = false
                                                                         }) => {
    const [answers, setAnswers] = useState<Record<string, string>>(() => initialAnswers);

    // Parse text to find blanks and create structure
    const parsedContent = useMemo(() => {
        if (!template.textWithBlanks) return { parts: [], blanks: [] };

        // Find all blanks in format [blank_id] or {blank_id}
        const blankPattern = /\[([^\]]+)\]|\{([^}]+)\}/g;
        const parts: string[] = [];
        const blanks: BlankItem[] = [];
        let lastIndex = 0;
        let match;

        while ((match = blankPattern.exec(template.textWithBlanks)) !== null) {
            // Add text before the blank
            if (match.index > lastIndex) {
                parts.push(template.textWithBlanks.slice(lastIndex, match.index));
            }

            // Extract blank ID
            const blankId = match[1] || match[2];
            const blankConfig = template.options?.blanks?.find(b => b.blankId === blankId);

            // Add blank placeholder
            parts.push(`__BLANK_${blankId}__`);

            blanks.push({
                blankId: blankId,
                placeholder: `Boşluk ${blanks.length + 1}`,
              //  answer: '', // Remove dependency on answers state
                config: blankConfig
            });

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < template.textWithBlanks.length) {
            parts.push(template.textWithBlanks.slice(lastIndex));
        }

        return { parts, blanks };
    }, [template.textWithBlanks, template.options?.blanks]); // Remove answers from dependencies

    useEffect(() => {
        // Only update if initialAnswers actually changed (deep comparison for objects)
        const hasChanged = JSON.stringify(initialAnswers) !== JSON.stringify(answers);
        if (hasChanged) {
            setAnswers(initialAnswers);
        }
    }, [initialAnswers]); // Remove answers from dependency to prevent loop

    const handleAnswerChange = (blankId: string, value: string) => {
        if (isSubmitted && !isPreview) return;

        const newAnswers = { ...answers, [blankId]: value };
        setAnswers(newAnswers);

        if (onAnswerChange) {
            onAnswerChange(newAnswers);
        }
    };

    const checkAnswer = (blankId: string, userAnswer: string): boolean => {
        const blank = parsedContent.blanks.find(b => b.blankId === blankId);
        if (!blank?.config?.acceptableAnswers) return false;

        return blank.config.acceptableAnswers.some(acceptable => {
            if (blank.config?.exactMatch) {
                return blank.config.caseSensitive
                    ? acceptable === userAnswer
                    : acceptable.toLowerCase() === userAnswer.toLowerCase();
            } else {
                return blank.config?.caseSensitive
                    ? acceptable.includes(userAnswer)
                    : acceptable.toLowerCase().includes(userAnswer.toLowerCase());
            }
        });
    };

    const getBlankStyle = (blankId: string) => {
        const baseStyle = "inline-block min-w-24 px-3 py-1 border-b-2 bg-transparent text-center focus:outline-none transition-colors ";

        if (isPreview) {
            return baseStyle + "border-gray-300 focus:border-blue-500";
        }

        if (isSubmitted && showCorrectAnswer) {
            const isCorrect = checkAnswer(blankId, answers[blankId] || '');
            if (isCorrect) {
                return baseStyle + "border-green-500 bg-green-50 text-green-800";
            } else {
                return baseStyle + "border-red-500 bg-red-50 text-red-800";
            }
        }

        return baseStyle + "border-gray-400 focus:border-blue-500";
    };

    const getCorrectAnswers = (blankId: string): string[] => {
        const blank = parsedContent.blanks.find(b => b.blankId === blankId);
        return blank?.config?.acceptableAnswers || [];
    };

    const getFeedback = (blankId: string): string | null => {
        if (!isSubmitted || !showCorrectAnswer) return null;
        const blank = parsedContent.blanks.find(b => b.blankId === blankId);
        return blank?.config?.feedback || null;
    };

    const renderContent = () => {
        let blankIndex = 0;

        return parsedContent.parts.map((part, index) => {
            if (part.startsWith('__BLANK_') && part.endsWith('__')) {
                const blankId = part.replace('__BLANK_', '').replace('__', '');
                const blank = parsedContent.blanks[blankIndex];
                blankIndex++;

                return (
                    <span key={index} className="relative inline-block">
            <input
                type="text"
                value={answers[blankId] || ''}
                onChange={(e) => handleAnswerChange(blankId, e.target.value)}
                className={getBlankStyle(blankId)}
                placeholder={isPreview ? blank.placeholder : ''}
                disabled={isSubmitted && !isPreview}
                maxLength={blank.config?.acceptableAnswers?.[0]?.length ? blank.config.acceptableAnswers[0].length * 2 : 50}
            />
                        {isSubmitted && showCorrectAnswer && (
                            <div className="absolute top-full left-0 right-0 z-10">
                                {checkAnswer(blankId, answers[blankId] || '') ? (
                                    <div className="text-green-600 text-xs mt-1">
                                        <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Doğru
                                    </div>
                                ) : (
                                    <div className="text-red-600 text-xs mt-1">
                                        <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Yanlış
                                    </div>
                                )}
                            </div>
                        )}
          </span>
                );
            } else {
                return <span key={index}>{part}</span>;
            }
        });
    };

    const getTotalScore = (): { correct: number; total: number } => {
        let correct = 0;
        const total = parsedContent.blanks.length;

        parsedContent.blanks.forEach(blank => {
            if (checkAnswer(blank.blankId, answers[blank.blankId] || '')) {
                correct++;
            }
        });

        return { correct, total };
    };

    const scoreInfo = getTotalScore();

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

            {/* Missing textWithBlanks Warning */}
            {!template.textWithBlanks && template.options?.blanks && template.options.blanks.length > 0 && (
                <div className="mb-4 p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
                    <p className="text-orange-800 text-sm">
                        <strong>⚠️ Uyarı:</strong> Soru metni tanımlanmamış. Boşluklar otomatik olarak oluşturuldu.
                        {!isPreview && " Lütfen soru metnini düzenleyiniz."}
                    </p>
                </div>
            )}

            {/* Instructions */}
            {template.instructions && (
                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-blue-800 text-sm">{template.instructions}</p>
                </div>
            )}

            {/* Text with Blanks */}
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="text-base leading-relaxed text-gray-800 space-y-2">
                    {renderContent()}
                </div>
            </div>

            {/* Matching Settings Info (Preview Only) */}
            {isPreview && (template.caseSensitive || template.exactMatch) && (
                <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-yellow-800 text-sm">
                        <strong>Eşleştirme Ayarları:</strong>
                        {template.caseSensitive && ' Büyük/küçük harf duyarlı'}
                        {template.caseSensitive && template.exactMatch && ', '}
                        {template.exactMatch && ' Tam eşleşme gerekli'}
                    </p>
                </div>
            )}

            {/* Answer Summary */}
            {isSubmitted && showCorrectAnswer && (
                <div className="space-y-4">
                    {/* Score Summary */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-700">Sonuç Özeti</h4>
                            <div className={`text-lg font-bold ${
                                scoreInfo.correct === scoreInfo.total ? 'text-green-600' :
                                    scoreInfo.correct > scoreInfo.total / 2 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                                {scoreInfo.correct}/{scoreInfo.total}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Answers */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700">Detaylı Cevaplar:</h4>
                        {parsedContent.blanks.map((blank, index) => (
                            <div key={blank.blankId} className="p-3 border border-gray-200 rounded">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-700 mb-1">
                                            Boşluk {index + 1} ({blank.blankId})
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div>
                                                <strong>Cevabınız:</strong>
                                                <span className={checkAnswer(blank.blankId, answers[blank.blankId] || '') ? 'text-green-600' : 'text-red-600'}>
                          {' "' + (answers[blank.blankId] || 'Boş') + '"'}
                        </span>
                                            </div>
                                            <div>
                                                <strong>Kabul edilen cevaplar:</strong> {getCorrectAnswers(blank.blankId).join(', ')}
                                            </div>
                                            {getFeedback(blank.blankId) && (
                                                <div className="mt-2 text-xs italic text-gray-500">
                                                    <strong>Açıklama:</strong> {getFeedback(blank.blankId)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        {checkAnswer(blank.blankId, answers[blank.blankId] || '') ? (
                                            <div className="text-green-600">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <div className="text-red-600">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

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
                    <p className="text-gray-500 text-xs mt-1">
                        Boşlukları belirtmek için [boşluk_id] veya {'{boşluk_id}'} formatını kullanın
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
                        <div><strong>Boşluk Sayısı:</strong> {parsedContent.blanks.length}</div>
                        <div><strong>Büyük/Küçük Harf:</strong> {template.caseSensitive ? 'Duyarlı' : 'Duyarlı Değil'}</div>
                        <div><strong>Eşleşme Tipi:</strong> {template.exactMatch ? 'Tam Eşleşme' : 'Kısmi Eşleşme'}</div>
                        {template.tags && template.tags.length > 0 && (
                            <div className="col-span-2">
                                <strong>Etiketler:</strong> {template.tags.join(', ')}
                            </div>
                        )}
                    </div>

                    {/* Blank Configuration Details */}
                    {parsedContent.blanks.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h5 className="font-semibold text-gray-700 mb-2">Boşluk Yapılandırması:</h5>
                            <div className="space-y-2 text-xs">
                                {parsedContent.blanks.map((blank, index) => (
                                    <div key={blank.blankId} className="bg-white p-2 rounded border">
                                        <div><strong>Boşluk {index + 1} ({blank.blankId}):</strong></div>
                                        <div>Kabul edilen cevaplar: {getCorrectAnswers(blank.blankId).join(', ') || 'Tanımlanmamış'}</div>
                                        {blank.config?.feedback && (
                                            <div>Geri bildirim: {blank.config.feedback}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Development Notes - Comment for future exam implementation */}
            {/*
        TODO: Real exam implementation
        - Integrate with exam session management
        - Add timer functionality for individual questions
        - Save answers to backend with proper validation
        - Handle auto-save for partial answers
        - Add progress tracking within exam context
        - Implement navigation between questions
        - Add exam state management (paused, resumed, etc.)
        - Security measures for exam integrity
        - Handle network issues and offline scenarios
        - Implement proper scoring logic with weighted blanks
        - Add accessibility features for screen readers
        - Support for rich text formatting in blanks
        - Advanced pattern matching for answers
        - Spell check suggestions
        - Auto-completion for common answers
      */}
        </div>
    );
};

export default FillInTheBlanksQuestion;