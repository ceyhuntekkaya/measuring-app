import React, { useState, useEffect, useRef } from 'react';
import { EssayTemplateDto } from '@/types/exam/questionTemplates';
import {QuestionTemplateType} from "@/types/exam/examEntities";
import {EMediaType, EQuestionType} from "@/types/exam/enum";

interface EssayQuestionProps {
    template: EssayTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (questionId:string, template: QuestionTemplateType, selectedOption: string, type: EQuestionType, mediaType: EMediaType, isEmptyAnswer: boolean) => void;
    initialAnswer?: EssayAnswerData | null;
    isSubmitted?: boolean;
    showCorrectAnswer?: boolean;
    questionId: string;
}

interface EssayAnswerData {
    text: string;
    wordCount: number;
    characterCount: number;
    submittedAt?: string;
}

const EssayQuestion: React.FC<EssayQuestionProps> = ({
                                                         template,
                                                         isPreview = false,
                                                         onAnswerChange,
                                                         initialAnswer = null,
                                                         isSubmitted = false,
                                                         questionId,
                                                         showCorrectAnswer = false
                                                     }) => {
    const [essayText, setEssayText] = useState<string>(initialAnswer?.text || '');
    const [wordCount, setWordCount] = useState<number>(0);
    const [characterCount, setCharacterCount] = useState<number>(0);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    console.log(showCorrectAnswer)
    useEffect(() => {
        if (initialAnswer) {
            setEssayText(initialAnswer.text);
            updateCounts(initialAnswer.text);
        }
    }, [initialAnswer]);

    useEffect(() => {
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [essayText]);

    const updateCounts = (text: string): void => {
        // Count words (split by whitespace and filter empty strings)
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wCount = words.length;

        // Count characters (excluding spaces)
        const cCount = text.replace(/\s/g, '').length;

        setWordCount(wCount);
        setCharacterCount(cCount);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        if (isSubmitted && !isPreview) return;

        const newText = e.target.value;
        setEssayText(newText);
        updateCounts(newText);
/*
        const essayData: EssayAnswerData = {
            text: newText,
            wordCount: newText.trim().split(/\s+/).filter(word => word.length > 0).length,
            characterCount: newText.replace(/\s/g, '').length,
            submittedAt: new Date().toISOString()
        };

 */


    };

    const handleSaveAnswer =()=>{
        if (onAnswerChange) {
            onAnswerChange(questionId, template, essayText ? essayText : '', EQuestionType.ESSAY, EMediaType.TEXT, false);
        }
    }

    const getWordCountStatus = (): { status: 'valid' | 'warning' | 'invalid'; message: string } => {
        if (!template.minWords && !template.maxWords) {
            return { status: 'valid', message: '' };
        }

        if (template.minWords && wordCount < template.minWords) {
            return {
                status: 'invalid',
                message: `En az ${template.minWords} kelime gerekli`
            };
        }

        if (template.maxWords && wordCount > template.maxWords) {
            return {
                status: 'invalid',
                message: `Maksimum ${template.maxWords} kelimeyi aştınız`
            };
        }

        if (template.minWords && wordCount >= template.minWords && template.maxWords && wordCount <= template.maxWords) {
            return {
                status: 'valid',
                message: 'Kelime sayısı uygun'
            };
        }

        if (template.minWords && wordCount >= template.minWords && !template.maxWords) {
            return {
                status: 'valid',
                message: 'Kelime sayısı uygun'
            };
        }

        return { status: 'valid', message: '' };
    };

    const getWordCountColor = (): string => {
        const status = getWordCountStatus().status;
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

    const getProgressPercentage = (): number => {
        if (!template.minWords && !template.maxWords) return 0;

        if (template.minWords && template.maxWords) {
            const range = template.maxWords - template.minWords;
            if (wordCount < template.minWords) {
                return (wordCount / template.minWords) * 50;
            } else if (wordCount <= template.maxWords) {
                return 50 + ((wordCount - template.minWords) / range) * 50;
            } else {
                return 100;
            }
        }

        if (template.minWords) {
            return Math.min((wordCount / template.minWords) * 100, 100);
        }

        if (template.maxWords) {
            return (wordCount / template.maxWords) * 100;
        }

        return 0;
    };

    const getProgressColor = (): string => {
       // const percentage = getProgressPercentage();
        const status = getWordCountStatus().status;

        if (status === 'invalid') return 'bg-red-500';
        if (status === 'valid') return 'bg-green-500';
        return 'bg-blue-500';
    };

    const clearText = (): void => {
        if (isSubmitted && !isPreview) return;

        setEssayText('');
        setWordCount(0);
        setCharacterCount(0);

        if (onAnswerChange) {
           // onAnswerChange(null);
        }
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

            {/* Question Statement
            {template.statement && (
                <div className="mb-6">
                    <p className="text-gray-800 text-base leading-relaxed">{template.statement}</p>
                </div>
            )}
            */}
            {/* Prompt */}
            {template.prompt && (
                <div className="mb-4 p-4 bg-purple-50 border-l-4 border-purple-400 rounded">
                    {//<h4 className="font-semibold text-purple-800 mb-2">Kompozisyon İstemi:</h4>
                         }
                    <p className="text-purple-700 whitespace-pre-wrap">{template.prompt}</p>
                </div>
            )}

            {/* Word Count Requirements */}
            {(template.minWords || template.maxWords) && (
                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="text-blue-800 text-sm">
                            <strong>Kelime Sayısı Gereksinimleri:</strong>
                            <span className="ml-2">
                                {template.minWords && template.maxWords &&
                                    `${template.minWords} - ${template.maxWords} kelime`
                                }
                                {template.minWords && !template.maxWords &&
                                    `En az ${template.minWords} kelime`
                                }
                                {!template.minWords && template.maxWords &&
                                    `Maksimum ${template.maxWords} kelime`
                                }
                            </span>
                        </div>
                    </div>

                </div>
            )}

            {/* Required Topics
            {template.requiredTopics && template.requiredTopics.length > 0 && (
                <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <h4 className="font-semibold text-yellow-800 mb-2">İşlenmesi Gereken Konular:</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {template.requiredTopics.map((topic, index) => (
                            <li key={index} className="text-yellow-700 text-sm">{topic}</li>
                        ))}
                    </ul>
                </div>
            )}
            */}
            {/* Grading Criteria
            {template.gradingCriteria && template.gradingCriteria.length > 0 && (
                <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 rounded">
                    <h4 className="font-semibold text-green-800 mb-2">Değerlendirme Kriterleri:</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {template.gradingCriteria.map((criterion, index) => (
                            <li key={index} className="text-green-700 text-sm">{criterion}</li>
                        ))}
                    </ul>
                </div>
            )}
            */}
            {/* Rubric
            {template.rubric && (
                <div className="mb-4 p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded">
                    <h4 className="font-semibold text-indigo-800 mb-2">Değerlendirme Rubriği:</h4>
                    <p className="text-indigo-700 text-sm whitespace-pre-wrap">{template.rubric}</p>
                </div>
            )}
            */}
            {/* Manual Grading Notice
            {template.requiresManualGrading && (
                <div className="mb-4 p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
                    <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-orange-800 text-sm">
                            Bu kompozisyon manuel değerlendirme gerektirir. Yanıtınız öğretmeniniz tarafından değerlendirilecektir.
                        </p>
                    </div>
                </div>
            )}
            */}
            {/* Essay Text Area */}
            <div className={`border-2 rounded-lg transition-all duration-200 ${
                isFocused
                    ? 'border-blue-500 shadow-lg'
                    : isSubmitted && !isPreview
                        ? 'border-gray-300'
                        : 'border-gray-300 hover:border-blue-400'
            }`}>
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-300 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className={`text-sm font-semibold ${getWordCountColor()}`}>
                                {wordCount} kelime
                            </span>
                        </div>

                        <div className="text-sm text-gray-600">
                            <span className="font-medium">{characterCount}</span> karakter
                        </div>

                        {getWordCountStatus().message && (
                            <div className={`text-xs ${getWordCountColor()}`}>
                                {getWordCountStatus().message}
                            </div>
                        )}
                    </div>

                    {!isSubmitted && essayText.length > 0 && (
                        <button
                            onClick={clearText}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                            Temizle
                        </button>
                    )}
                </div>

                {/* Progress Bar */}
                {(template.minWords || template.maxWords) && (
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-300">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${getProgressColor()}`}
                                style={{ width: `${Math.min(getProgressPercentage(), 100)}%` }}
                            />
                        </div>
                    </div>
                )}

                <textarea
                    ref={textareaRef}
                    value={essayText}
                    onChange={handleTextChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={isSubmitted && !isPreview}
                    placeholder="Kompozisyonunuzu buraya yazın..."
                    className="w-full p-4 resize-none outline-none bg-white text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    style={{ minHeight: '300px' }}
                />

            </div>
            <button className={"btn btn-success"} onClick={handleSaveAnswer}>KAYDET</button>
            {/* Writing Tips */}
            {!isSubmitted && essayText.length === 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span>Yazım İpuçları:</span>
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                        <li>• Kompozisyonunuzu yazmaya başlamadan önce bir taslak oluşturun</li>
                        <li>• Giriş, gelişme ve sonuç bölümlerine dikkat edin</li>
                        <li>• Paragraflar arası geçişleri net yapın</li>
                        <li>• Yazım kurallarına ve noktalama işaretlerine özen gösterin</li>
                        {template.requiredTopics && template.requiredTopics.length > 0 && (
                            <li>• Belirtilen tüm konuları işlemeyi unutmayın</li>
                        )}
                    </ul>
                </div>
            )}

            {/* Submission Status */}
            {isSubmitted && essayText.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-green-800 font-semibold">
                                Kompozisyonunuz başarıyla gönderildi
                            </p>
                            <div className="mt-2 text-sm text-green-700 space-y-1">
                                <p>• Kelime Sayısı: {wordCount}</p>
                                <p>• Karakter Sayısı: {characterCount}</p>
                            </div>
                            {template.requiresManualGrading && (
                                <p className="text-green-700 text-sm mt-2">
                                    Değerlendirme tamamlandığında sonuçları görebileceksiniz.
                                </p>
                            )}
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
                        {template.minWords && (
                            <div><strong>Min. Kelime:</strong> {template.minWords}</div>
                        )}
                        {template.maxWords && (
                            <div><strong>Maks. Kelime:</strong> {template.maxWords}</div>
                        )}
                        {template.requiredTopics && template.requiredTopics.length > 0 && (
                            <div><strong>Konu Sayısı:</strong> {template.requiredTopics.length}</div>
                        )}
                        {template.requiresManualGrading !== undefined && (
                            <div><strong>Manuel Değerlendirme:</strong> {template.requiresManualGrading ? 'Evet' : 'Hayır'}</div>
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
        - Implement auto-save functionality (every 30 seconds)
        - Add spell check and grammar suggestions
        - Support for rich text formatting (bold, italic, lists)
        - Implement word processor features (undo/redo)
        - Add plagiarism detection
        - Support for citations and references
        - Implement AI-based writing suggestions
        - Add readability score calculation
        - Support for multiple drafts
        - Implement collaborative editing (optional)
        - Add accessibility features for screen readers
        - Support for voice typing
        - Implement keyword highlighting for required topics
        - Add writing time tracking
        - Support for templates and outlines
        - Implement sentiment analysis (optional)
      */}
        </div>
    );
};

export default EssayQuestion;