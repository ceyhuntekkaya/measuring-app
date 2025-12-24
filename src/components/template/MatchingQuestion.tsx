import React, {useState, useEffect, useMemo} from 'react';
import { MatchingTemplateDto } from '@/types/exam/questionTemplates';
import {QuestionTemplateType} from "@/types/exam/examEntities";
import {EMediaType, EQuestionType} from "@/types/exam/enum";

interface MatchingQuestionProps {
    template: MatchingTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (questionId:string, template: QuestionTemplateType, selectedOption: string, type: EQuestionType, mediaType: EMediaType, isEmptyAnswer: boolean) => void;
    initialAnswer?: MatchingAnswers;
    isSubmitted?: boolean;
    showCorrectAnswer?: boolean;
    questionId: string;
}

interface MatchingAnswers {
    [leftId: string]: string; // leftId -> rightId
}

interface MatchingResult {
    leftId: string;
    rightId: string;
    isCorrect: boolean;
    correctRightId: string;
    leftText: string;
    rightText: string;
    correctRightText: string;
    feedback?: string;
}

interface RightItem {
    id: string;
    text: string;
    mediaUrl?: string;
    isDistractor: boolean;
}

const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
                                                               template,
                                                               isPreview = false,
                                                               onAnswerChange,
                                                               initialAnswer = {},
                                                               isSubmitted = false,
                                                               questionId,
                                                               showCorrectAnswer = false
                                                           }) => {
    const [matches, setMatches] = useState<MatchingAnswers>(initialAnswer || {});
    const [rightItems, setRightItems] = useState<RightItem[]>([]);
    const [draggedRightId, setDraggedRightId] = useState<string | null>(null);
    const [dragOverLeftId, setDragOverLeftId] = useState<string | null>(null);
    const [matchingResults, setMatchingResults] = useState<MatchingResult[]>([]);

    const stableInitialAnswer = useMemo(() => initialAnswer, [JSON.stringify(initialAnswer)]);

    useEffect(() => {
        setMatches(stableInitialAnswer || {});
    }, [stableInitialAnswer]);

    useEffect(() => {
        initializeRightItems();
    }, [template.options?.pairs, template.options?.distractors, template.shuffleItems]);

    useEffect(() => {
        if (isSubmitted && showCorrectAnswer) {
            evaluateMatches();
        }
    }, [isSubmitted, showCorrectAnswer, matches]);

    const initializeRightItems = (): void => {
        if (!template.options?.pairs) return;

        const items: RightItem[] = [];

        // Add all right items from pairs
        template.options.pairs.forEach(pair => {
            if (pair.rightId && pair.rightText) {
                items.push({
                    id: pair.rightId,
                    text: pair.rightText,
                    mediaUrl: pair.rightMediaUrl,
                    isDistractor: false
                });
            }
        });

        // Add distractors
        if (template.options.distractors) {
            template.options.distractors.forEach((distractor, index) => {
                items.push({
                    id: `distractor-${index}`,
                    text: distractor,
                    mediaUrl: undefined,
                    isDistractor: true
                });
            });
        }

        // Shuffle if needed
        if (template.shuffleItems && !isSubmitted) {
            const shuffled = [...items].sort(() => Math.random() - 0.5);
            setRightItems(shuffled);
        } else {
            setRightItems(items);
        }
    };

    const handleMatch = (leftId: string, rightId: string): void => {
        if (isSubmitted && !isPreview) return;

        const currentMatches = matches || {};
        const newMatches = { ...currentMatches };

        // If same right item is already matched to this left item, remove the match
        if (newMatches[leftId] === rightId) {
            delete newMatches[leftId];
        } else {
            // Remove this right item from any other left items
            Object.keys(newMatches).forEach(key => {
                if (newMatches[key] === rightId) {
                    delete newMatches[key];
                }
            });
            // Add new match
            newMatches[leftId] = rightId;
        }

        setMatches(newMatches);


    };

    const handleSaveAnswer =()=>{
        if (onAnswerChange) {
            onAnswerChange(questionId, template, matches ? JSON.stringify(matches) : '', EQuestionType.MATCHING, EMediaType.TEXT, false);
        }
    }

    const handleDragStart = (rightId: string): void => {
        if (isSubmitted && !isPreview) return;
        setDraggedRightId(rightId);
    };

    const handleDragOver = (e: React.DragEvent, leftId: string): void => {
        e.preventDefault();
        if (isSubmitted && !isPreview) return;
        setDragOverLeftId(leftId);
    };

    const handleDragLeave = (): void => {
        setDragOverLeftId(null);
    };

    const handleDrop = (e: React.DragEvent, leftId: string): void => {
        e.preventDefault();
        if (isSubmitted && !isPreview) return;

        if (draggedRightId) {
            handleMatch(leftId, draggedRightId);
        }

        setDraggedRightId(null);
        setDragOverLeftId(null);
    };

    const handleDragEnd = (): void => {
        setDraggedRightId(null);
        setDragOverLeftId(null);
    };

    const evaluateMatches = (): void => {
        if (!template.options?.pairs) return;

        const currentMatches = matches || {};
        const results: MatchingResult[] = template.options.pairs.map(pair => {
            const leftId = pair.leftId || '';
            const rightId = currentMatches[leftId] || '';
            const correctRightId = pair.rightId || '';
            const isCorrect = rightId === correctRightId;

            const matchedRightItem = rightItems.find(item => item.id === rightId);
            const correctRightItem = rightItems.find(item => item.id === correctRightId);

            return {
                leftId,
                rightId,
                isCorrect,
                correctRightId,
                leftText: pair.leftText || '',
                rightText: matchedRightItem?.text || '(Eşleştirilmedi)',
                correctRightText: correctRightItem?.text || '',
                feedback: pair.feedback
            };
        });

        setMatchingResults(results);
    };

    const getRightItemById = (rightId: string): RightItem | undefined => {
        return rightItems.find(item => item.id === rightId);
    };

    const isRightItemUsed = (rightId: string): boolean => {
        const currentMatches = matches || {};
        return Object.values(currentMatches).includes(rightId);
    };

    const getLeftItemStyle = (leftId: string): string => {
        const baseStyle = "p-4 border-2 rounded-lg transition-all duration-200 ";

        if (isSubmitted && showCorrectAnswer) {
            const result = matchingResults.find(r => r.leftId === leftId);
            if (result) {
                if (result.isCorrect) {
                    return baseStyle + "border-green-500 bg-green-50";
                } else {
                    return baseStyle + "border-red-500 bg-red-50";
                }
            }
        }

        if (dragOverLeftId === leftId) {
            return baseStyle + "border-blue-500 bg-blue-50 border-dashed";
        }

        const currentMatches = matches || {};
        if (currentMatches[leftId]) {
            return baseStyle + "border-blue-500 bg-blue-50";
        }

        return baseStyle + "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50";
    };

    const getRightItemStyle = (rightId: string): string => {
        const baseStyle = "p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 select-none ";

        if (isSubmitted && !isPreview) {
            return baseStyle + "border-gray-300 bg-gray-100 cursor-not-allowed";
        }

        if (draggedRightId === rightId) {
            return baseStyle + "border-blue-500 bg-blue-100 opacity-50";
        }

        if (isRightItemUsed(rightId)) {
            return baseStyle + "border-gray-400 bg-gray-200 opacity-60";
        }

        return baseStyle + "border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-100";
    };

    const renderMedia = (mediaUrl?: string): React.ReactNode => {
        if (!mediaUrl) return null;

        // Determine media type from URL
        const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(mediaUrl);
        const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
        const isAudio = /\.(mp3|wav|ogg)$/i.test(mediaUrl);

        if (isImage) {
            return (
                <img
                    src={mediaUrl}
                    alt="Media content"
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

    const renderMatchedItem = (leftId: string): React.ReactNode => {
        const currentMatches = matches || {};
        const rightId = currentMatches[leftId];
        if (!rightId) return null;

        const rightItem = getRightItemById(rightId);
        if (!rightItem) return null;

        const result = matchingResults.find(r => r.leftId === leftId);

        return (
            <div className={`mt-3 p-3 rounded-lg border-2 ${
                isSubmitted && showCorrectAnswer && result
                    ? result.isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                    : 'border-blue-400 bg-blue-50'
            }`}>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-800">{rightItem.text}</span>
                            {isSubmitted && showCorrectAnswer && result && (
                                <span>
                                    {result.isCorrect ? (
                                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </span>
                            )}
                        </div>
                        {rightItem.mediaUrl && renderMedia(rightItem.mediaUrl)}
                    </div>

                    {(!isSubmitted || isPreview) && (
                        <button
                            onClick={() => handleMatch(leftId, rightId)}
                            className="ml-3 p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                            title="Eşleşmeyi kaldır"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderDropdownSelector = (leftId: string): React.ReactNode => {
        if (isSubmitted && !isPreview) return null;

        const currentMatches = matches || {};
        const currentMatch = currentMatches[leftId];

        return (
            <select
                value={currentMatch || ''}
                onChange={(e) => {
                    if (e.target.value) {
                        handleMatch(leftId, e.target.value);
                    }
                }}
                className="mt-3 w-full p-2 border-2 border-gray-300 rounded-lg bg-white text-gray-800 focus:border-blue-500 focus:outline-none"
            >
                <option value="">-- Bir seçenek seçin --</option>
                {rightItems.map(item => (
                    <option
                        key={item.id}
                        value={item.id}
                        disabled={isRightItemUsed(item.id) && currentMatches[leftId] !== item.id}
                    >
                        {item.text} {item.isDistractor ? '(Çeldirici)' : ''}
                    </option>
                ))}
            </select>
        );
    };

    const renderCorrectAnswer = (leftId: string): React.ReactNode => {
        if (!isSubmitted || !showCorrectAnswer) return null;

        const result = matchingResults.find(r => r.leftId === leftId);
        if (!result || result.isCorrect) return null;

        return (
            <div className="mt-3 p-3 bg-green-50 border-2 border-green-400 rounded-lg">
                <p className="text-green-800 text-sm font-medium mb-1">
                    ✓ Doğru Eşleşme:
                </p>
                <p className="text-green-700">{result.correctRightText}</p>
                {result.feedback && (
                    <p className="text-green-700 text-sm italic mt-2">
                        <strong>Açıklama:</strong> {result.feedback}
                    </p>
                )}
            </div>
        );
    };

    const calculateScore = (): { correct: number; total: number; percentage: number } => {
        if (!template.options?.pairs) {
            return { correct: 0, total: 0, percentage: 0 };
        }

        const total = template.options.pairs.length;
        const correct = matchingResults.filter(r => r.isCorrect).length;
        const percentage = total > 0 ? (correct / total) * 100 : 0;

        return { correct, total, percentage };
    };

    const getProgressInfo = (): { matched: number; total: number } => {
        const total = template.options?.pairs?.length || 0;
        const currentMatches = matches || {};
        const matched = Object.keys(currentMatches).length;
        return { matched, total };
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
            {/* Instructions */}
            {template.instructions && (
                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <p className="text-blue-800 text-sm">{template.instructions}</p>
                </div>
            )}

            {/* Default Instructions */}
            {!template.instructions && (
                <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                    <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                            <p className="text-blue-800 text-sm font-medium">
                                Sol taraftaki öğeleri sağ taraftaki uygun eşleşmeleri ile eşleştirin.
                            </p>
                            <p className="text-blue-700 text-xs mt-1">
                                • Öğeleri sürükleyip bırakabilir veya açılır menüden seçebilirsiniz
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Progress Indicator */}
            {!isSubmitted && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-300 rounded">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 font-medium">İlerleme:</span>
                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">
                                {getProgressInfo().matched} / {getProgressInfo().total} eşleştirildi
                            </span>
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{
                                        width: `${getProgressInfo().total > 0
                                            ? (getProgressInfo().matched / getProgressInfo().total) * 100
                                            : 0}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Matching Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Items */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700 text-center pb-2 border-b-2 border-gray-300">
                        Eşleştirilecek Öğeler
                    </h4>
                    {template.options?.pairs?.map((pair, index) => (
                        <div
                            key={pair.leftId}
                            onDragOver={(e) => handleDragOver(e, pair.leftId || '')}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, pair.leftId || '')}
                            className={getLeftItemStyle(pair.leftId || '')}
                        >
                            {/* Item Number */}
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-700">
                                    {index + 1}
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* Left Text */}
                                    <p className="text-gray-800 font-medium">{pair.leftText}</p>

                                    {/* Left Media */}
                                    {pair.leftMediaUrl && renderMedia(pair.leftMediaUrl)}

                                    {/* Matched Item Display */}
                                    {(() => {
                                        const currentMatches = matches || {};
                                        return currentMatches[pair.leftId || ''] && renderMatchedItem(pair.leftId || '');
                                    })()}

                                    {/* Dropdown Selector */}
                                    {(() => {
                                        const currentMatches = matches || {};
                                        return !currentMatches[pair.leftId || ''] && renderDropdownSelector(pair.leftId || '');
                                    })()}

                                    {/* Correct Answer Display */}
                                    {renderCorrectAnswer(pair.leftId || '')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Items (Draggable Pool) */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700 text-center pb-2 border-b-2 border-gray-300">
                        Eşleşme Seçenekleri
                    </h4>
                    <div className="space-y-3 p-4 bg-gray-50 border-2 border-gray-300 rounded-lg min-h-[400px]">
                        {rightItems.map(item => (
                            <div
                                key={item.id}
                                draggable={!isSubmitted || isPreview}
                                onDragStart={() => handleDragStart(item.id)}
                                onDragEnd={handleDragEnd}
                                className={getRightItemStyle(item.id)}
                            >
                                <div className="flex items-start space-x-2">
                                    {/* Drag Handle */}
                                    {(!isSubmitted || isPreview) && (
                                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" />
                                        </svg>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-800 font-medium break-words">{item.text}</p>
                                        {item.mediaUrl && renderMedia(item.mediaUrl)}

                                        {/* Distractor Badge */}
                                        {item.isDistractor && isSubmitted && showCorrectAnswer && (
                                            <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                                Çeldirici
                                            </span>
                                        )}
                                    </div>

                                    {/* Used Indicator */}
                                    {isRightItemUsed(item.id) && (
                                        <div className="flex-shrink-0">
                                            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {!isPreview && (
                <button className={"btn btn-success"} onClick={handleSaveAnswer}>KAYDET</button>
            )}
            {/* Overall Explanation */}
            {isSubmitted && showCorrectAnswer && template.explanation && (
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <h4 className="font-semibold text-yellow-800 mb-2">Genel Açıklama:</h4>
                    <p className="text-yellow-700">{template.explanation}</p>
                </div>
            )}

            {/* Score Summary */}
            {isSubmitted && showCorrectAnswer && matchingResults.length > 0 && (
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
                                        {calculateScore().correct} / {calculateScore().total} doğru
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

                        {/* Statistics */}
                        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-300">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {calculateScore().correct}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">Doğru</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {calculateScore().total - calculateScore().correct}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">Yanlış</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-600">
                                    {calculateScore().total}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">Toplam</div>
                            </div>
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
                            <div><strong>Zorluk:</strong> {template.difficulty}</div>
                        )}
                        {template.points && (
                            <div><strong>Puan:</strong> {template.points}</div>
                        )}
                        {template.timeLimit && (
                            <div><strong>Süre:</strong> {template.timeLimit} saniye</div>
                        )}
                        {template.options?.pairs && (
                            <div><strong>Eşleşme Sayısı:</strong> {template.options.pairs.length}</div>
                        )}
                        {template.options?.distractors && (
                            <div><strong>Çeldirici Sayısı:</strong> {template.options.distractors.length}</div>
                        )}
                        {template.shuffleItems !== undefined && (
                            <div><strong>Karıştırma:</strong> {template.shuffleItems ? 'Evet' : 'Hayır'}</div>
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
        - Implement touch device support for mobile
        - Add keyboard shortcuts for accessibility
        - Support for partial credit scoring
        - Implement undo/redo functionality
        - Add animation for drag and drop feedback
        - Support for multiple correct matches (if needed)
        - Implement hint system
        - Add time tracking per match
        - Support for group matching (multiple items to one)
        - Implement collaborative features (optional)
        - Add accessibility features for screen readers
        - Support for RTL languages
        - Implement answer validation before submission
      */}
        </div>
    );
};

export default MatchingQuestion;