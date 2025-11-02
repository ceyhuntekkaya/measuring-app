import React, { useState, useEffect } from 'react';
import {OrderingItem, OrderingTemplateDto} from '@/types/exam/questionTemplates';
import {QuestionTemplateType} from "@/types/exam/examEntities";
import {EMediaType, EQuestionType} from "@/types/exam/enum";

interface OrderingQuestionProps {
    template: OrderingTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (questionId:string, template: QuestionTemplateType, selectedOption: string, type: EQuestionType, mediaType: EMediaType, isEmptyAnswer: boolean) => void;
    initialAnswer?: string[] | null;
    isSubmitted?: boolean;
    showCorrectAnswer?: boolean;
    questionId: string;
}

const OrderingQuestion: React.FC<OrderingQuestionProps> = ({
                                                               template,
                                                               isPreview = false,
                                                               onAnswerChange,
                                                               initialAnswer = null,
                                                               isSubmitted = false,
                                                               questionId,
                                                               showCorrectAnswer = false
                                                           }) => {
    const [orderedItems, setOrderedItems] = useState<string[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    useEffect(() => {
        // Initialize items
        if (initialAnswer && initialAnswer.length > 0) {
            setOrderedItems(initialAnswer);
        } else if (template.options?.items) {
            const items = [...template.options.items];
            if (template.shuffleItems && !isSubmitted) {
                // Shuffle items for initial display
                const shuffled = items.sort(() => Math.random() - 0.5);
                const itemIds = shuffled.map(item => item.id || '');
                setOrderedItems(itemIds);
            } else {
                const itemIds = items.map(item => item.id || '');
                setOrderedItems(itemIds);
            }
        }
    }, [initialAnswer, template.options?.items, template.shuffleItems, isSubmitted]);

    const handleDragStart = (index: number) => {
        if (isSubmitted && !isPreview) return;
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (isSubmitted && !isPreview) return;
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (isSubmitted && !isPreview) return;

        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const newOrderedItems = [...orderedItems];
        const draggedItem = newOrderedItems[draggedIndex];

        // Remove dragged item
        newOrderedItems.splice(draggedIndex, 1);
        // Insert at new position
        newOrderedItems.splice(dropIndex, 0, draggedItem);

        setOrderedItems(newOrderedItems);
        setDraggedIndex(null);
        setDragOverIndex(null);


    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (isSubmitted && !isPreview) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= orderedItems.length) return;

        const newOrderedItems = [...orderedItems];
        const temp = newOrderedItems[index];
        newOrderedItems[index] = newOrderedItems[newIndex];
        newOrderedItems[newIndex] = temp;

        setOrderedItems(newOrderedItems);


    };

    const handleSaveAnswer =()=>{
        if (onAnswerChange) {
            onAnswerChange(questionId, template, orderedItems ? JSON.stringify(orderedItems) : '', EQuestionType.ORDERING, EMediaType.TEXT, false);
        }
    }

    const getItemById = (id: string) => {
        return template.options?.items?.find(item => item.id === id);
    };

    const getCorrectPosition = (itemId: string) => {
        const item = getItemById(itemId);
        return item?.correctPosition;
    };

    const isItemInCorrectPosition = (itemId: string, currentIndex: number) => {
        const correctPos = getCorrectPosition(itemId);
        return correctPos !== undefined && correctPos === currentIndex + 1;
    };

    const getItemStyle = (index: number, itemId: string) => {
        const baseStyle = "p-4 border rounded-lg transition-all duration-200 ";

        if (isPreview) {
            return baseStyle + "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-move";
        }

        if (isSubmitted && showCorrectAnswer) {
            const isCorrect = isItemInCorrectPosition(itemId, index);
            if (isCorrect) {
                return baseStyle + "border-green-500 bg-green-50";
            } else {
                return baseStyle + "border-red-500 bg-red-50";
            }
        }

        if (draggedIndex === index) {
            return baseStyle + "border-blue-500 bg-blue-100 opacity-50 cursor-grabbing";
        }

        if (dragOverIndex === index) {
            return baseStyle + "border-blue-500 bg-blue-50 border-dashed";
        }

        return baseStyle + "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-move";
    };

    const getPositionBadgeStyle = (itemId: string, currentIndex: number) => {
        if (!isSubmitted || !showCorrectAnswer) {
            return "bg-gray-100 text-gray-700";
        }

        const isCorrect = isItemInCorrectPosition(itemId, currentIndex);
        return isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
    };

    const renderMedia = (item: OrderingItem) => {
        if (!item.mediaUrl) return null;

        if (item.mediaType === 'image') {
            return (
                <div className="mt-2 mb-2">
                    <img
                        src={item.mediaUrl}
                        alt={item.text || 'Soru görseli'}
                        className="max-w-full h-auto rounded border border-gray-200"
                        style={{ maxHeight: '200px' }}
                    />
                </div>
            );
        }

        if (item.mediaType === 'video') {
            return (
                <div className="mt-2 mb-2">
                    <video
                        src={item.mediaUrl}
                        controls
                        className="max-w-full h-auto rounded border border-gray-200"
                        style={{ maxHeight: '200px' }}
                    >
                        Tarayıcınız video oynatmayı desteklemiyor.
                    </video>
                </div>
            );
        }

        if (item.mediaType === 'audio') {
            return (
                <div className="mt-2 mb-2">
                    <audio
                        src={item.mediaUrl}
                        controls
                        className="w-full"
                    >
                        Tarayıcınız ses oynatmayı desteklemiyor.
                    </audio>
                </div>
            );
        }

        return null;
    };

    const renderFeedback = (itemId: string, currentIndex: number) => {
        if (!isSubmitted || !showCorrectAnswer) return null;

        const item = getItemById(itemId);
        if (!item?.feedback) return null;

        const isCorrect = isItemInCorrectPosition(itemId, currentIndex);

        return (
            <div className={`mt-2 p-2 rounded text-sm ${
                isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
                <strong>Açıklama:</strong> {item.feedback}
            </div>
        );
    };

    const renderCorrectPositionInfo = (itemId: string, currentIndex: number) => {
        if (!isSubmitted || !showCorrectAnswer) return null;

        const correctPos = getCorrectPosition(itemId);
        const isCorrect = isItemInCorrectPosition(itemId, currentIndex);

        if (isCorrect) return null;

        return (
            <div className="mt-2 text-sm text-red-600">
                <strong>Doğru Sıra:</strong> {correctPos}. sırada olmalıydı
            </div>
        );
    };

    const calculateScore = () => {
        if (!template.options?.items) return { correct: 0, total: 0 };

        let correct = 0;
        const total = orderedItems.length;

        orderedItems.forEach((itemId, index) => {
            if (isItemInCorrectPosition(itemId, index)) {
                correct++;
            }
        });

        return { correct, total };
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

            {/* Ordering Type Info
            {template.options?.orderingType && (
                <div className="mb-4 p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                    <p className="text-purple-800 text-sm">
                        <strong>Sıralama Türü:</strong> {template.options.orderingType}
                    </p>
                </div>
            )}
            */}
            {/* Drag & Drop Hint */}
            {!isSubmitted && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-300 rounded flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    <p className="text-gray-700 text-sm">
                        Öğeleri sürükleyip bırakarak veya ok tuşlarını kullanarak sıralayın
                    </p>
                </div>
            )}

            {/* Ordering Items */}
            <div className="space-y-3">
                {orderedItems.map((itemId, index) => {
                    const item = getItemById(itemId);
                    if (!item) return null;

                    return (
                        <div
                            key={itemId}
                            draggable={!isSubmitted || isPreview}
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={getItemStyle(index, itemId)}
                        >
                            <div className="flex items-start space-x-3">
                                {/* Drag Handle */}
                                {(!isSubmitted || isPreview) && (
                                    <div className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing">
                                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" />
                                        </svg>
                                    </div>
                                )}

                                {/* Position Badge */}
                                <div className="flex-shrink-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                                        getPositionBadgeStyle(itemId, index)
                                    }`}>
                                        {index + 1}
                                    </div>
                                </div>

                                {/* Item Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="text-gray-800 font-medium break-words">
                                        {item.text}
                                    </div>

                                    {/* Media */}
                                    {renderMedia(item)}

                                    {/* Feedback */}
                                    {renderFeedback(itemId, index)}

                                    {/* Correct Position Info */}
                                    {renderCorrectPositionInfo(itemId, index)}
                                </div>

                                {/* Move Buttons */}
                                {(!isSubmitted || isPreview) && (
                                    <div className="flex-shrink-0 flex flex-col space-y-1">
                                        <button
                                            onClick={() => moveItem(index, 'up')}
                                            disabled={index === 0}
                                            className={`p-1 rounded ${
                                                index === 0
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-gray-600 hover:bg-gray-200'
                                            }`}
                                            aria-label="Yukarı taşı"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => moveItem(index, 'down')}
                                            disabled={index === orderedItems.length - 1}
                                            className={`p-1 rounded ${
                                                index === orderedItems.length - 1
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'text-gray-600 hover:bg-gray-200'
                                            }`}
                                            aria-label="Aşağı taşı"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                {/* Correct/Incorrect Indicator */}
                                {isSubmitted && showCorrectAnswer && (
                                    <div className="flex-shrink-0">
                                        {isItemInCorrectPosition(itemId, index) ? (
                                            <div className="text-green-600">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <div className="text-red-600">
                                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <button className={"btn btn-success"} onClick={handleSaveAnswer}>KAYDET</button>
            {/* Overall Explanation */}
            {isSubmitted && showCorrectAnswer && template.explanation && (
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <h4 className="font-semibold text-yellow-800 mb-2">Genel Açıklama:</h4>
                    <p className="text-yellow-700">{template.explanation}</p>
                </div>
            )}

            {/* Answer Summary (for submitted state) */}
            {isSubmitted && showCorrectAnswer && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <strong>Sonuç:</strong>
                            </div>
                            <div className={`font-semibold text-lg ${
                                calculateScore().correct === calculateScore().total
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }`}>
                                {calculateScore().correct} / {calculateScore().total} Doğru
                                {calculateScore().correct === calculateScore().total && ' ✓'}
                            </div>
                        </div>

                        {/* Correct Order Display */}
                        <div className="mt-3 pt-3 border-t border-gray-300">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Doğru Sıralama:</p>
                            <div className="space-y-1">
                                {template.options?.items
                                    ?.sort((a, b) => (a.correctPosition || 0) - (b.correctPosition || 0))
                                    .map((item, idx) => (
                                        <div key={item.id} className="text-sm text-gray-600 flex items-start">
                                            <span className="font-medium text-gray-700 mr-2">{idx + 1}.</span>
                                            <span>{item.text}</span>
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
                        {template.options?.orderingType && (
                            <div><strong>Sıralama Türü:</strong> {template.options.orderingType}</div>
                        )}
                        {template.shuffleItems !== undefined && (
                            <div><strong>Karıştırma:</strong> {template.shuffleItems ? 'Evet' : 'Hayır'}</div>
                        )}
                        {template.options?.items && (
                            <div><strong>Öğe Sayısı:</strong> {template.options.items.length}</div>
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
        - Add accessibility features for screen readers and keyboard navigation
        - Support for multiple languages/localization
        - Add touch device support for mobile
        - Implement undo/redo functionality
        - Add animation for drag and drop feedback
      */}
        </div>
    );
};

export default OrderingQuestion;