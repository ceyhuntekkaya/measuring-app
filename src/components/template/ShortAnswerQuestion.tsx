import React, { useState, useEffect } from 'react';
import { ShortAnswerTemplateDto, AcceptableAnswer } from '@/types/exam/questionTemplates';
import {QuestionTemplateType} from "@/types/exam/examEntities";
import {EMediaType, EQuestionType} from "@/types/exam/enum";

interface ShortAnswerQuestionProps {
    template: ShortAnswerTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (questionId:string, template: QuestionTemplateType, selectedOption: string, type: EQuestionType, mediaType: EMediaType, isEmptyAnswer: boolean) => void;
    initialAnswer?: string;
    isSubmitted?: boolean;
    showCorrectAnswer?: boolean;
    questionId: string;
}

const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({
                                                                     template,
                                                                     isPreview = false,
                                                                     onAnswerChange,
                                                                     initialAnswer = '',
                                                                     isSubmitted = false,
                                                                     questionId,
                                                                     showCorrectAnswer = false
                                                                 }) => {
    const [answer, setAnswer] = useState<string>(initialAnswer);
    const [characterCount, setCharacterCount] = useState<number>(initialAnswer.length);

    useEffect(() => {
        setAnswer(initialAnswer);
        setCharacterCount(initialAnswer.length);
    }, [initialAnswer]);

    const handleAnswerChange = (value: string) => {
        if (isSubmitted && !isPreview) return;

        // Check character limits
        if (template.maxCharacters && value.length > template.maxCharacters) {
            return; // Don't allow input beyond max characters
        }

        setAnswer(value);
        setCharacterCount(value.length);

    };



    const handleSaveAnswer =()=>{
        if (onAnswerChange) {
            onAnswerChange(questionId, template, answer ? answer : '', EQuestionType.SHORT_ANSWER, EMediaType.TEXT, false);
        }
    }

    const checkAnswer = (userAnswer: string): { isCorrect: boolean; matchedAnswer?: AcceptableAnswer; score: number } => {
        if (!template.options?.acceptableAnswers || template.options.acceptableAnswers.length === 0) {
            return { isCorrect: false, score: 0 };
        }

        // Find the best matching answer
        let bestMatch: AcceptableAnswer | undefined;
        let isCorrect = false;

        for (const acceptable of template.options.acceptableAnswers) {
            if (!acceptable.answer) continue;

            let matches = false;

            if (template.options.exactMatch) {
                // Exact match comparison
                matches = template.options.caseSensitive
                    ? acceptable.answer === userAnswer
                    : acceptable.answer.toLowerCase() === userAnswer.toLowerCase();
            } else {
                // Partial match comparison
                matches = template.options.caseSensitive
                    ? acceptable.answer.includes(userAnswer) || userAnswer.includes(acceptable.answer)
                    : acceptable.answer.toLowerCase().includes(userAnswer.toLowerCase()) ||
                    userAnswer.toLowerCase().includes(acceptable.answer.toLowerCase());
            }

            if (matches) {
                isCorrect = true;
                bestMatch = acceptable;
                break; // Take the first match
            }
        }

        const score = bestMatch?.score || (isCorrect ? 100 : 0);
        return { isCorrect, matchedAnswer: bestMatch, score };
    };

    const getTextAreaStyle = () => {
        const baseStyle = "w-full p-3 border rounded-lg resize-vertical focus:outline-none transition-colors ";

        if (isPreview) {
            return baseStyle + "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
        }

        if (isSubmitted && showCorrectAnswer) {
            const result = checkAnswer(answer);
            if (result.isCorrect) {
                return baseStyle + "border-green-500 bg-green-50 text-green-800";
            } else {
                return baseStyle + "border-red-500 bg-red-50 text-red-800";
            }
        }

        return baseStyle + "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
    };

    const getCharacterCountStyle = () => {
        if (!template.maxCharacters) return "text-gray-500";

        const percentage = (characterCount / template.maxCharacters) * 100;
        if (percentage >= 90) return "text-red-600 font-semibold";
        if (percentage >= 75) return "text-yellow-600";
        return "text-gray-500";
    };

    const isCharacterLimitValid = () => {
        if (template.minCharacters && characterCount < template.minCharacters) return false;
        if (template.maxCharacters && characterCount > template.maxCharacters) return false;
        return true;
    };

    const result = isSubmitted ? checkAnswer(answer) : null;

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

            {/* Character Limit Info */}
            {(template.minCharacters || template.maxCharacters) && (
                <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-yellow-800 text-sm">
                        <strong>Karakter Sınırları:</strong>
                        {template.minCharacters && ` En az ${template.minCharacters} karakter`}
                        {template.minCharacters && template.maxCharacters && ', '}
                        {template.maxCharacters && ` En fazla ${template.maxCharacters} karakter`}
                    </p>
                </div>
            )}

            {/* Answer Input */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Cevabınız:
                </label>
                <textarea
                    value={answer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className={getTextAreaStyle()}
                    placeholder={template.options?.placeholder || (isPreview ? "Cevabınızı buraya yazın..." : "")}
                    disabled={isSubmitted && !isPreview}
                    rows={4}
                    maxLength={template.maxCharacters}
                />
                <button className={"btn btn-success"} onClick={handleSaveAnswer}>KAYDET</button>

                {/* Character Count */}
                <div className="flex justify-between items-center text-sm">
                    <div className={getCharacterCountStyle()}>
                        {characterCount} karakter
                        {template.maxCharacters && ` / ${template.maxCharacters}`}
                    </div>

                    {/* Character Limit Warning */}
                    {!isCharacterLimitValid() && (
                        <div className="text-red-600 text-sm">
                            {template.minCharacters && characterCount < template.minCharacters &&
                                `En az ${template.minCharacters - characterCount} karakter daha gerekli`}
                            {template.maxCharacters && characterCount > template.maxCharacters &&
                                `${characterCount - template.maxCharacters} karakter fazla`}
                        </div>
                    )}
                </div>

            </div>

            {/* Manual Grading Note
            {template.requiresManualGrading && (
                <div className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
                    <p className="text-orange-800 text-sm">
                        <strong>Not:</strong> Bu soru manuel değerlendirme gerektirir. Cevabınız öğretmen tarafından incelenecektir.
                    </p>
                </div>
            )}
            */}
            {/* Answer Evaluation (only if not manual grading) */}
            {isSubmitted && showCorrectAnswer && !template.requiresManualGrading && result && (
                <div className="space-y-4">
                    {/* Score and Result */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-700">Değerlendirme Sonucu</h4>
                            <div className={`text-lg font-bold ${
                                result.isCorrect ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {result.isCorrect ? '✓ Doğru' : '✗ Yanlış'}
                            </div>
                        </div>

                        {result.score !== undefined && result.score !== 100 && result.score !== 0 && (
                            <div className="text-sm text-gray-600">
                                <strong>Puan:</strong> {result.score}/100
                            </div>
                        )}
                    </div>

                    {/* User Answer */}
                    <div className="p-3 border border-gray-200 rounded">
                        <div className="mb-2">
                            <strong className="text-gray-700">Cevabınız:</strong>
                        </div>
                        <div className="p-2 bg-gray-100 rounded text-gray-800">
                            {answer || 'Cevap verilmedi'}
                        </div>
                    </div>


                    {/* Accepted Answers */}
                    {template.options?.acceptableAnswers && template.options.acceptableAnswers.length > 0 && (
                        <div className="p-3 border border-gray-200 rounded">
                            <div className="mb-2">
                                <strong className="text-gray-700">Kabul edilen cevaplar:</strong>
                            </div>
                            <div className="space-y-1">
                                {template.options.acceptableAnswers.map((acceptable, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded text-sm">
                                        <span className="text-green-800">&quot;{acceptable.answer}&quot;</span>
                                        {acceptable.score !== undefined && acceptable.score !== 100 && (
                                            <span className="text-green-600 font-medium">{acceptable.score} puan</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Feedback */}
                    {result.matchedAnswer?.feedback && (
                        <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                            <div className="text-blue-800 text-sm">
                                <strong>Geri Bildirim:</strong> {result.matchedAnswer.feedback}
                            </div>
                        </div>
                    )}

                    {/* Matching Settings Info */}
                    {template.options && (template.options.caseSensitive || template.options.exactMatch) && (
                        <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                            <div className="text-yellow-800 text-sm">
                                <strong>Eşleştirme Ayarları:</strong>
                                {template.options.caseSensitive && ' Büyük/küçük harf duyarlı'}
                                {template.options.caseSensitive && template.options.exactMatch && ', '}
                                {template.options.exactMatch && ' Tam eşleşme gerekli'}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Rubric (if available) */}
            {isSubmitted && showCorrectAnswer && template.rubric && (
                <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded">
                    <h4 className="font-semibold text-purple-800 mb-2">Değerlendirme Kriteri:</h4>
                    <div className="text-purple-700 text-sm whitespace-pre-line">{template.rubric}</div>
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
                        {template.minCharacters && (
                            <div><strong>Min. Karakter:</strong> {template.minCharacters}</div>
                        )}
                        {template.maxCharacters && (
                            <div><strong>Max. Karakter:</strong> {template.maxCharacters}</div>
                        )}
                        <div><strong>Manuel Değerlendirme:</strong> {template.requiresManualGrading ? 'Evet' : 'Hayır'}</div>
                        {template.options?.caseSensitive !== undefined && (
                            <div><strong>Büyük/Küçük Harf:</strong> {template.options.caseSensitive ? 'Duyarlı' : 'Duyarlı Değil'}</div>
                        )}
                        {template.options?.exactMatch !== undefined && (
                            <div><strong>Eşleşme Tipi:</strong> {template.options.exactMatch ? 'Tam Eşleşme' : 'Kısmi Eşleşme'}</div>
                        )}
                        {template.tags && template.tags.length > 0 && (
                            <div className="col-span-2">
                                <strong>Etiketler:</strong> {template.tags.join(', ')}
                            </div>
                        )}
                    </div>

                    {/* Acceptable Answers Preview */}
                    {template.options?.acceptableAnswers && template.options.acceptableAnswers.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h5 className="font-semibold text-gray-700 mb-2">Kabul Edilen Cevaplar:</h5>
                            <div className="space-y-2">
                                {template.options.acceptableAnswers.map((acceptable, index) => (
                                    <div key={index} className="bg-white p-2 rounded border text-xs">
                                        <div>
                                            <strong>Cevap {index + 1}:</strong> &quot;{acceptable.answer}&quot;
                                        </div>
                                        {acceptable.score !== undefined && acceptable.score !== 100 && (
                                            <div><strong>Puan:</strong> {acceptable.score}</div>
                                        )}
                                        {acceptable.feedback && (
                                            <div><strong>Geri Bildirim:</strong> {acceptable.feedback}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Rubric Preview */}
                    {template.rubric && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h5 className="font-semibold text-gray-700 mb-2">Değerlendirme Kriteri:</h5>
                            <div className="bg-white p-2 rounded border text-xs whitespace-pre-line">
                                {template.rubric}
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
        - Implement advanced text analysis for scoring
        - Add spell check and grammar suggestions
        - Support for rich text formatting
        - Plagiarism detection for longer answers
        - AI-powered answer evaluation
        - Support for multiple languages
        - Export answers for manual review
        - Batch grading interface for instructors
      */}
        </div>
    );
};

export default ShortAnswerQuestion;