import React, {useState, useEffect, useMemo} from 'react';
import { DragAndDropTemplateDto } from '@/types/exam/questionTemplates';
import {QuestionTemplateType} from "@/types/exam/examEntities";
import {EMediaType, EQuestionType} from "@/types/exam/enum";

interface DragAndDropQuestionProps {
    template: DragAndDropTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (questionId:string, template: QuestionTemplateType, selectedOption: string, type: EQuestionType, mediaType: EMediaType, isEmptyAnswer: boolean) => void;
    initialAnswer?: DragDropPlacements;
    isSubmitted?: boolean;
    showCorrectAnswer?: boolean;
    questionId: string;
}

interface DragDropPlacements {
    [zoneId: string]: string[]; // zoneId -> array of draggableItemIds
}

interface DraggableItem {
    id: string;
    text: string;
    correctZoneId?: string;
    mediaUrl?: string;
    feedback?: string;
}

interface DropZone {
    id: string;
    label: string;
    acceptsItems?: string[]; // specific item IDs this zone accepts (optional)
    maxItems?: number;
}

interface DragDropOptions {
    draggableItems?: DraggableItem[];
    dropZones?: DropZone[];
}

interface ItemResult {
    itemId: string;
    currentZoneId: string;
    correctZoneId: string;
    isCorrect: boolean;
    text: string;
    feedback?: string;
}

const DragAndDropQuestion: React.FC<DragAndDropQuestionProps> = ({
                                                                     template,
                                                                     isPreview = false,
                                                                     onAnswerChange,
                                                                     initialAnswer = {},
                                                                     isSubmitted = false,
                                                                     questionId,
                                                                     showCorrectAnswer = false
                                                                 }) => {
    const [placements, setPlacements] = useState<DragDropPlacements>(initialAnswer);
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [dragOverZoneId, setDragOverZoneId] = useState<string | null>(null);
    const [availableItems, setAvailableItems] = useState<DraggableItem[]>([]);
    const [itemResults, setItemResults] = useState<ItemResult[]>([]);

    const options: DragDropOptions | null = template.options ? parseOptions(JSON.stringify(template.options)) : null;

    const stableInitialAnswer = useMemo(() => initialAnswer, [JSON.stringify(initialAnswer)]);

    useEffect(() => {
        setPlacements(stableInitialAnswer);
    }, [stableInitialAnswer]);

    useEffect(() => {
        initializeAvailableItems();
    }, [template.options, template.shuffleDraggableItems]);

    useEffect(() => {
        if (isSubmitted && showCorrectAnswer) {
            evaluatePlacements();
        }
    }, [isSubmitted, showCorrectAnswer, placements]);

    function parseOptions(optionsString: string): DragDropOptions | null {
        try {
            return JSON.parse(optionsString) as DragDropOptions;
        } catch (error) {
            console.error('Error parsing drag and drop options:', error);
            return null;
        }
    }

    const initializeAvailableItems = (): void => {
        if (!options?.draggableItems) return;

        const items = [...options.draggableItems];

        if (template.shuffleDraggableItems && !isSubmitted) {
            const shuffled = items.sort(() => Math.random() - 0.5);
            setAvailableItems(shuffled);
        } else {
            setAvailableItems(items);
        }
    };

    const getItemLocation = (itemId: string): { zoneId: string | null; index: number } => {
        for (const [zoneId, items] of Object.entries(placements)) {
            const index = items.indexOf(itemId);
            if (index !== -1) {
                return { zoneId, index };
            }
        }
        return { zoneId: null, index: -1 };
    };

    const handleDragStart = (itemId: string): void => {
        if (isSubmitted && !isPreview) return;
        setDraggedItemId(itemId);
    };

    const handleDragOver = (e: React.DragEvent, zoneId: string): void => {
        e.preventDefault();
        if (isSubmitted && !isPreview) return;
        setDragOverZoneId(zoneId);
    };

    const handleDragLeave = (): void => {
        setDragOverZoneId(null);
    };

    const handleDrop = (e: React.DragEvent, targetZoneId: string): void => {
        e.preventDefault();
        if (isSubmitted && !isPreview) return;

        if (!draggedItemId) {
            setDragOverZoneId(null);
            return;
        }

        const zone = options?.dropZones?.find(z => z.id === targetZoneId);

        // Check if zone has max items limit
        if (!template.allowMultipleItemsPerZone && zone?.maxItems) {
            const currentItems = placements[targetZoneId] || [];
            if (currentItems.length >= zone.maxItems && !currentItems.includes(draggedItemId)) {
                setDraggedItemId(null);
                setDragOverZoneId(null);
                return;
            }
        }

        const newPlacements = { ...placements };

        // Remove item from its current location
        const currentLocation = getItemLocation(draggedItemId);
        if (currentLocation.zoneId) {
            newPlacements[currentLocation.zoneId] = newPlacements[currentLocation.zoneId].filter(
                id => id !== draggedItemId
            );
        }

        // Add item to new zone
        if (!newPlacements[targetZoneId]) {
            newPlacements[targetZoneId] = [];
        }

        // Check if item is already in this zone
        if (!newPlacements[targetZoneId].includes(draggedItemId)) {
            if (template.allowMultipleItemsPerZone) {
                newPlacements[targetZoneId].push(draggedItemId);
            } else {
                // Replace existing item
                newPlacements[targetZoneId] = [draggedItemId];
            }
        }

        setPlacements(newPlacements);
        setDraggedItemId(null);
        setDragOverZoneId(null);


    };

    const handleSaveAnswer =()=>{
        if (onAnswerChange) {
            onAnswerChange(questionId, template, placements ? JSON.stringify(placements) : '', EQuestionType.DRAG_AND_DROP, EMediaType.TEXT, false);
        }
    }

    const handleDragEnd = (): void => {
        setDraggedItemId(null);
        setDragOverZoneId(null);
    };

    const removeItemFromZone = (itemId: string, zoneId: string): void => {
        if (isSubmitted && !isPreview) return;

        const newPlacements = { ...placements };
        newPlacements[zoneId] = newPlacements[zoneId].filter(id => id !== itemId);

        setPlacements(newPlacements);

        if (onAnswerChange) {
         //   onAnswerChange(newPlacements);
        }
    };

    const evaluatePlacements = (): void => {
        if (!options?.draggableItems) return;

        const results: ItemResult[] = options.draggableItems.map(item => {
            const location = getItemLocation(item.id);
            const currentZoneId = location.zoneId || 'unplaced';
            const correctZoneId = item.correctZoneId || '';
            const isCorrect = currentZoneId === correctZoneId;

            return {
                itemId: item.id,
                currentZoneId,
                correctZoneId,
                isCorrect,
                text: item.text,
                feedback: item.feedback
            };
        });

        setItemResults(results);
    };

    const getItemById = (itemId: string): DraggableItem | undefined => {
        return availableItems.find(item => item.id === itemId);
    };

    const getZoneById = (zoneId: string): DropZone | undefined => {
        return options?.dropZones?.find(zone => zone.id === zoneId);
    };

    const isItemPlaced = (itemId: string): boolean => {
        return getItemLocation(itemId).zoneId !== null;
    };

    const getUnplacedItems = (): DraggableItem[] => {
        return availableItems.filter(item => !isItemPlaced(item.id));
    };

    const getDraggableItemStyle = (itemId: string): string => {
        const baseStyle = "p-3 border-2 rounded-lg cursor-move transition-all duration-200 select-none ";

        if (isSubmitted && !isPreview) {
            return baseStyle + "border-gray-300 bg-gray-100 cursor-not-allowed";
        }

        if (draggedItemId === itemId) {
            return baseStyle + "border-blue-500 bg-blue-100 opacity-50";
        }

        return baseStyle + "border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50";
    };

    const getDropZoneStyle = (zoneId: string): string => {
        const baseStyle = "min-h-[120px] p-4 border-2 rounded-lg transition-all duration-200 ";

        if (isSubmitted && showCorrectAnswer) {
            const zoneItems = placements[zoneId] || [];
            const allCorrect = zoneItems.every(itemId => {
                const item = getItemById(itemId);
                return item?.correctZoneId === zoneId;
            });

            if (zoneItems.length > 0) {
                if (allCorrect) {
                    return baseStyle + "border-green-500 bg-green-50";
                } else {
                    return baseStyle + "border-red-500 bg-red-50";
                }
            }
            return baseStyle + "border-gray-300 bg-gray-50";
        }

        if (dragOverZoneId === zoneId) {
            return baseStyle + "border-blue-500 bg-blue-50 border-dashed";
        }

        return baseStyle + "border-gray-300 bg-gray-50";
    };

    const getItemInZoneStyle = (itemId: string, zoneId: string): string => {
        const baseStyle = "p-3 mb-2 border-2 rounded-lg transition-all duration-200 ";

        if (isSubmitted && showCorrectAnswer) {
            const item = getItemById(itemId);
            const isCorrect = item?.correctZoneId === zoneId;

            if (isCorrect) {
                return baseStyle + "border-green-500 bg-green-50 text-green-800";
            } else {
                return baseStyle + "border-red-500 bg-red-50 text-red-800";
            }
        }

        return baseStyle + "border-blue-400 bg-blue-50 text-gray-800";
    };

    const renderMedia = (mediaUrl?: string): React.ReactNode => {
        if (!mediaUrl) return null;

        const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(mediaUrl);
        const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);
        const isAudio = /\.(mp3|wav|ogg)$/i.test(mediaUrl);

        if (isImage) {
            return (
                <img
                    src={mediaUrl}
                    alt="Item media"
                    className="max-w-full h-auto rounded border border-gray-200 mt-2"
                    style={{ maxHeight: '100px' }}
                />
            );
        }

        if (isVideo) {
            return (
                <video
                    src={mediaUrl}
                    controls
                    className="max-w-full h-auto rounded border border-gray-200 mt-2"
                    style={{ maxHeight: '100px' }}
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

    const calculateScore = (): { correct: number; total: number; percentage: number } => {
        if (!options?.draggableItems) {
            return { correct: 0, total: 0, percentage: 0 };
        }

        const total = options.draggableItems.length;
        const correct = itemResults.filter(r => r.isCorrect).length;
        const percentage = total > 0 ? (correct / total) * 100 : 0;

        return { correct, total, percentage };
    };

    const getProgressInfo = (): { placed: number; total: number } => {
        const total = availableItems.length;
        const placed = availableItems.filter(item => isItemPlaced(item.id)).length;
        return { placed, total };
    };

    if (!options) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-red-800">Soru seçenekleri yüklenemedi.</p>
            </div>
        );
    }

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
                                Aşağıdaki öğeleri uygun alanlara sürükleyip bırakın.
                            </p>
                            <div className="mt-2 space-y-1 text-xs text-blue-700">
                                {template.allowMultipleItemsPerZone && (
                                    <p>• Bir alana birden fazla öğe yerleştirebilirsiniz</p>
                                )}
                                {!template.allowMultipleItemsPerZone && (
                                    <p>• Her alana sadece bir öğe yerleştirebilirsiniz</p>
                                )}
                            </div>
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
                                {getProgressInfo().placed} / {getProgressInfo().total} yerleştirildi
                            </span>
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{
                                        width: `${getProgressInfo().total > 0
                                            ? (getProgressInfo().placed / getProgressInfo().total) * 100
                                            : 0}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Drag and Drop Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Draggable Items Pool */}
                <div className="lg:col-span-1">
                    <div className="sticky top-4">
                        <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-gray-300">
                            Yerleştirilecek Öğeler
                        </h4>
                        <div className="space-y-3 p-4 bg-gray-50 border-2 border-gray-300 rounded-lg min-h-[200px]">
                            {getUnplacedItems().length === 0 ? (
                                <div className="text-center text-gray-500 text-sm py-8">
                                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Tüm öğeler yerleştirildi
                                </div>
                            ) : (
                                getUnplacedItems().map(item => (
                                    <div
                                        key={item.id}
                                        draggable={!isSubmitted || isPreview}
                                        onDragStart={() => handleDragStart(item.id)}
                                        onDragEnd={handleDragEnd}
                                        className={getDraggableItemStyle(item.id)}
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
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Drop Zones */}
                <div className="lg:col-span-2">
                    <h4 className="font-semibold text-gray-700 mb-3 pb-2 border-b-2 border-gray-300">
                        Yerleştirme Alanları
                    </h4>
                    <div className="space-y-4">
                        {options.dropZones?.map(zone => (
                            <div
                                key={zone.id}
                                onDragOver={(e) => handleDragOver(e, zone.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, zone.id)}
                                className={getDropZoneStyle(zone.id)}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h5 className="font-semibold text-gray-700 text-lg">{zone.label}</h5>
                                    {zone.maxItems && (
                                        <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">
                                            Maks: {zone.maxItems}
                                        </span>
                                    )}
                                </div>

                                {/* Items in this zone */}
                                <div className="space-y-2">
                                    {(placements[zone.id] || []).map(itemId => {
                                        const item = getItemById(itemId);
                                        if (!item) return null;

                                        const result = itemResults.find(r => r.itemId === itemId);

                                        return (
                                            <div
                                                key={itemId}
                                                className={getItemInZoneStyle(itemId, zone.id)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2">
                                                            <p className="text-gray-800 font-medium break-words">{item.text}</p>
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
                                                        {item.mediaUrl && renderMedia(item.mediaUrl)}

                                                        {/* Feedback */}
                                                        {isSubmitted && showCorrectAnswer && result && !result.isCorrect && item.feedback && (
                                                            <p className="text-red-700 text-sm italic mt-2">
                                                                <strong>Açıklama:</strong> {item.feedback}
                                                            </p>
                                                        )}

                                                        {/* Show correct zone */}
                                                        {isSubmitted && showCorrectAnswer && result && !result.isCorrect && (
                                                            <p className="text-green-700 text-sm mt-2">
                                                                <strong>Doğru Alan:</strong> {getZoneById(result.correctZoneId)?.label || 'Bilinmiyor'}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Remove Button */}
                                                    {(!isSubmitted || isPreview) && (
                                                        <button
                                                            onClick={() => removeItemFromZone(itemId, zone.id)}
                                                            className="ml-3 p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded flex-shrink-0"
                                                            title="Kaldır"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Empty state */}
                                {(!placements[zone.id] || placements[zone.id].length === 0) && (
                                    <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-300 rounded">
                                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <p className="text-sm">Buraya öğe sürükleyin</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <button className={"btn btn-success"} onClick={handleSaveAnswer}>KAYDET</button>
            {/* Overall Explanation */}
            {isSubmitted && showCorrectAnswer && template.explanation && (
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <h4 className="font-semibold text-yellow-800 mb-2">Genel Açıklama:</h4>
                    <p className="text-yellow-700">{template.explanation}</p>
                </div>
            )}

            {/* Score Summary */}
            {isSubmitted && showCorrectAnswer && itemResults.length > 0 && (
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
                        {options.draggableItems && (
                            <div><strong>Öğe Sayısı:</strong> {options.draggableItems.length}</div>
                        )}
                        {options.dropZones && (
                            <div><strong>Alan Sayısı:</strong> {options.dropZones.length}</div>
                        )}
                        {template.allowMultipleItemsPerZone !== undefined && (
                            <div><strong>Çoklu Öğe:</strong> {template.allowMultipleItemsPerZone ? 'Evet' : 'Hayır'}</div>
                        )}
                        {template.shuffleDraggableItems !== undefined && (
                            <div><strong>Karıştırma:</strong> {template.shuffleDraggableItems ? 'Evet' : 'Hayır'}</div>
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
        - Support for snap-to-grid placement
        - Implement undo/redo functionality
        - Add animation for drag and drop feedback
        - Support for nested drop zones
        - Implement hint system
        - Add time tracking per placement
        - Support for conditional drop zones (only accept certain items)
        - Implement collaborative features (optional)
        - Add accessibility features for screen readers
        - Support for drag handles on specific areas
        - Implement partial credit scoring
      */}
        </div>
    );
};

export default DragAndDropQuestion;