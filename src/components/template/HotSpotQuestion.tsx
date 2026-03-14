import React, {useState, useEffect, useRef, useMemo} from 'react';
import type { HotSpotTemplateDto, HotSpotArea } from '@/api/generated/model';
import type {QuestionTemplateType} from "@/types/exam/questionTemplateTypes";
import {EMediaType, EQuestionType} from "@/types/exam/enum";
import {difficultyConverter} from "@/utils/enum-converter";

interface HotSpotQuestionProps {
    template: HotSpotTemplateDto;
    isPreview?: boolean;
    onAnswerChange?: (questionId:string, template: QuestionTemplateType, selectedOption: string, type: EQuestionType, mediaType: EMediaType, isEmptyAnswer: boolean) => void;
    initialAnswer?: string[];
    isSubmitted?: boolean;
    showCorrectAnswer?: boolean;
    questionId: string;
}

interface Point {
    x: number;
    y: number;
}

interface HotSpotResult {
    id: string;
    isCorrect: boolean;
    feedback?: string;
    label?: string;
}

const HotSpotQuestion: React.FC<HotSpotQuestionProps> = ({
                                                             template,
                                                             isPreview = false,
                                                             onAnswerChange,
                                                             initialAnswer = [],
                                                             isSubmitted = false,
                                                             questionId,
                                                             showCorrectAnswer = false
                                                         }) => {
    const [selectedSpots, setSelectedSpots] = useState<string[]>(initialAnswer);
    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [hoveredSpotId, setHoveredSpotId] = useState<string | null>(null);
    const [spotResults, setSpotResults] = useState<HotSpotResult[]>([]);

    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const stableInitialAnswer = useMemo(() => initialAnswer, [JSON.stringify(initialAnswer)]);

    useEffect(() => {
        setSelectedSpots(stableInitialAnswer);
    }, [stableInitialAnswer]);

    useEffect(() => {
        if (isSubmitted && showCorrectAnswer) {
            evaluateSpots();
        }
    }, [isSubmitted, showCorrectAnswer, selectedSpots]);

    const handleImageLoad = (): void => {
        if (imageRef.current) {
            setImageLoaded(true);
        }
    };

    const handleSpotClick = (spotId: string): void => {
        if (isSubmitted && !isPreview) return;

        const isSelected = selectedSpots.includes(spotId);
        let newSelectedSpots: string[];

        if (isSelected) {
            // Deselect
            newSelectedSpots = selectedSpots.filter(id => id !== spotId);
        } else {
            // Select
            if (template.allowMultipleSpots) {
                // Check max selections
                if (template.maxSelections && selectedSpots.length >= template.maxSelections) {
                    // Remove first selection and add new one
                    newSelectedSpots = [...selectedSpots.slice(1), spotId];
                } else {
                    newSelectedSpots = [...selectedSpots, spotId];
                }
            } else {
                // Single selection
                newSelectedSpots = [spotId];
            }
        }

        setSelectedSpots(newSelectedSpots);


    };

    const handleSaveAnswer =()=>{
        if (onAnswerChange) {
            onAnswerChange(questionId, template, selectedSpots ? JSON.stringify(selectedSpots) : '', EQuestionType.HOT_SPOT, EMediaType.TEXT, false);
        }
    }

    const evaluateSpots = (): void => {
        if (!template.options?.hotSpots) return;

        const results: HotSpotResult[] = selectedSpots.map(spotId => {
            const spot = template.options?.hotSpots?.find(s => s.id === spotId);
            return {
                id: spotId,
                isCorrect: spot?.isCorrect || false,
                feedback: spot?.feedback,
                label: spot?.label
            };
        });

        setSpotResults(results);
    };

    const parseCoordinates = (coordinates: string): number[] => {
        return coordinates.split(',').map(coord => parseFloat(coord.trim()));
    };

    const isPointInShape = (point: Point, spot: HotSpotArea, imageWidth: number, imageHeight: number): boolean => {
        if (!spot.coordinates || !spot.shape) return false;

        const coords = parseCoordinates(spot.coordinates);

        switch (spot.shape.toLowerCase()) {
            case 'circle': {
                // coords: [centerX, centerY, radius] in percentages
                const centerX = (coords[0] / 100) * imageWidth;
                const centerY = (coords[1] / 100) * imageHeight;
                const radius = (coords[2] / 100) * Math.min(imageWidth, imageHeight);

                const distance = Math.sqrt(
                    Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2)
                );

                return distance <= radius;
            }

            case 'rectangle':
            case 'rect': {
                // coords: [x, y, width, height] in percentages
                const x = (coords[0] / 100) * imageWidth;
                const y = (coords[1] / 100) * imageHeight;
                const width = (coords[2] / 100) * imageWidth;
                const height = (coords[3] / 100) * imageHeight;

                return point.x >= x && point.x <= x + width &&
                    point.y >= y && point.y <= y + height;
            }

            case 'polygon': {
                // coords: [x1, y1, x2, y2, ...] in percentages
                const points: Point[] = [];
                for (let i = 0; i < coords.length; i += 2) {
                    points.push({
                        x: (coords[i] / 100) * imageWidth,
                        y: (coords[i + 1] / 100) * imageHeight
                    });
                }

                // Ray casting algorithm
                let inside = false;
                for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
                    const xi = points[i].x;
                    const yi = points[i].y;
                    const xj = points[j].x;
                    const yj = points[j].y;

                    const intersect = ((yi > point.y) !== (yj > point.y)) &&
                        (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);

                    if (intersect) inside = !inside;
                }

                return inside;
            }

            default:
                return false;
        }
    };

    const handleImageClick = (event: React.MouseEvent<HTMLDivElement>): void => {
        if (isSubmitted && !isPreview) return;
        if (!imageRef.current || !template.options?.hotSpots) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Find which spot was clicked
        for (const spot of template.options.hotSpots) {
            if (spot.id && isPointInShape({ x, y }, spot, rect.width, rect.height)) {
                handleSpotClick(spot.id);
                break;
            }
        }
    };

    const renderHotSpotOverlay = (spot: HotSpotArea): React.ReactNode => {
        if (!spot.coordinates || !spot.shape || !spot.id) return null;

        const coords = parseCoordinates(spot.coordinates);
        const isSelected = selectedSpots.includes(spot.id);
        const isHovered = hoveredSpotId === spot.id;
        const result = spotResults.find(r => r.id === spot.id);

        let svgElement: React.ReactNode = null;
        let overlayStyle: string = '';

        // Determine color based on state
        if (isSubmitted && showCorrectAnswer && result) {
            if (result.isCorrect) {
                overlayStyle = 'fill-green-500 fill-opacity-30 stroke-green-600 stroke-2';
            } else {
                overlayStyle = 'fill-red-500 fill-opacity-30 stroke-red-600 stroke-2';
            }
        } else if (isSelected) {
            overlayStyle = 'fill-blue-500 fill-opacity-30 stroke-blue-600 stroke-2';
        } else if (isHovered) {
            overlayStyle = 'fill-yellow-500 fill-opacity-20 stroke-yellow-600 stroke-2';
        } else {
            overlayStyle = 'fill-transparent stroke-gray-400 stroke-2 stroke-dashed';
        }

        switch (spot.shape.toLowerCase()) {
            case 'circle':
                svgElement = (
                    <circle
                        cx={`${coords[0]}%`}
                        cy={`${coords[1]}%`}
                        r={`${coords[2]}%`}
                        className={overlayStyle}
                    />
                );
                break;

            case 'rectangle':
            case 'rect':
                svgElement = (
                    <rect
                        x={`${coords[0]}%`}
                        y={`${coords[1]}%`}
                        width={`${coords[2]}%`}
                        height={`${coords[3]}%`}
                        className={overlayStyle}
                    />
                );
                break;

            case 'polygon': {
                const points = [];
                for (let i = 0; i < coords.length; i += 2) {
                    points.push(`${coords[i]}%,${coords[i + 1]}%`);
                }
                svgElement = (
                    <polygon
                        points={points.join(' ')}
                        className={overlayStyle}
                    />
                );
                break;
            }

            default:
                return null;
        }

        return (
            <g
                key={spot.id}
                onMouseEnter={() => !isSubmitted && setHoveredSpotId(spot.id || null)}
                onMouseLeave={() => setHoveredSpotId(null)}
                className="cursor-pointer"
            >
                {svgElement}

                {/* Label */}
                {spot.label && (isSelected || isHovered || (isSubmitted && showCorrectAnswer)) && (
                    <text
                        x={`${spot.shape.toLowerCase() === 'circle' ? coords[0] : coords[0] + coords[2] / 2}%`}
                        y={`${spot.shape.toLowerCase() === 'circle' ? coords[1] : coords[1] + coords[3] / 2}%`}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-white text-sm font-bold pointer-events-none"
                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                    >
                        {spot.label}
                    </text>
                )}

                {/* Checkmark or X for submitted state */}
                {isSubmitted && showCorrectAnswer && result && (
                    <g>
                        {result.isCorrect ? (
                            <path
                                d={`M ${coords[0] + (coords[2] || 5) / 2 - 2},${coords[1] + (coords[3] || 5) / 2} 
                                   L ${coords[0] + (coords[2] || 5) / 2},${coords[1] + (coords[3] || 5) / 2 + 2} 
                                   L ${coords[0] + (coords[2] || 5) / 2 + 3},${coords[1] + (coords[3] || 5) / 2 - 3}`}
                                fill="none"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        ) : (
                            <>
                                <line
                                    x1={`${coords[0] + (coords[2] || 5) / 2 - 2}%`}
                                    y1={`${coords[1] + (coords[3] || 5) / 2 - 2}%`}
                                    x2={`${coords[0] + (coords[2] || 5) / 2 + 2}%`}
                                    y2={`${coords[1] + (coords[3] || 5) / 2 + 2}%`}
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <line
                                    x1={`${coords[0] + (coords[2] || 5) / 2 + 2}%`}
                                    y1={`${coords[1] + (coords[3] || 5) / 2 - 2}%`}
                                    x2={`${coords[0] + (coords[2] || 5) / 2 - 2}%`}
                                    y2={`${coords[1] + (coords[3] || 5) / 2 + 2}%`}
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </>
                        )}
                    </g>
                )}
            </g>
        );
    };

    const renderCorrectSpots = (): React.ReactNode => {
        if (!isSubmitted || !showCorrectAnswer || !template.options?.hotSpots) return null;

        const correctSpots = template.options.hotSpots.filter(spot => spot.isCorrect);
        const missedSpots = correctSpots.filter(spot => !selectedSpots.includes(spot.id || ''));

        return (
            <>
                {/* Show missed correct spots */}
                {missedSpots.length > 0 && (
                    <svg
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        style={{ zIndex: 2 }}
                    >
                        {missedSpots.map(spot => {
                            if (!spot.coordinates || !spot.shape || !spot.id) return null;

                            const coords = parseCoordinates(spot.coordinates);
                            let element: React.ReactNode = null;

                            switch (spot.shape.toLowerCase()) {
                                case 'circle':
                                    element = (
                                        <circle
                                            key={`missed-${spot.id}`}
                                            cx={`${coords[0]}%`}
                                            cy={`${coords[1]}%`}
                                            r={`${coords[2]}%`}
                                            className="fill-green-500 fill-opacity-20 stroke-green-600 stroke-2 stroke-dashed"
                                        />
                                    );
                                    break;

                                case 'rectangle':
                                case 'rect':
                                    element = (
                                        <rect
                                            key={`missed-${spot.id}`}
                                            x={`${coords[0]}%`}
                                            y={`${coords[1]}%`}
                                            width={`${coords[2]}%`}
                                            height={`${coords[3]}%`}
                                            className="fill-green-500 fill-opacity-20 stroke-green-600 stroke-2 stroke-dashed"
                                        />
                                    );
                                    break;

                                case 'polygon': {
                                    const points = [];
                                    for (let i = 0; i < coords.length; i += 2) {
                                        points.push(`${coords[i]}%,${coords[i + 1]}%`);
                                    }
                                    element = (
                                        <polygon
                                            key={`missed-${spot.id}`}
                                            points={points.join(' ')}
                                            className="fill-green-500 fill-opacity-20 stroke-green-600 stroke-2 stroke-dashed"
                                        />
                                    );
                                    break;
                                }
                            }

                            return element;
                        })}
                    </svg>
                )}
            </>
        );
    };

    const calculateScore = (): { correct: number; incorrect: number; missed: number; total: number; percentage: number } => {
        if (!template.options?.hotSpots) {
            return { correct: 0, incorrect: 0, missed: 0, total: 0, percentage: 0 };
        }

        const correctSpots = template.options.hotSpots.filter(spot => spot.isCorrect);
        const totalCorrect = correctSpots.length;

        const correct = spotResults.filter(r => r.isCorrect).length;
        const incorrect = spotResults.filter(r => !r.isCorrect).length;
        const missed = totalCorrect - correct;

        const percentage = totalCorrect > 0 ? (correct / totalCorrect) * 100 : 0;

        return { correct, incorrect, missed, total: totalCorrect, percentage };
    };

    const getImageUrl = (): string => {
        return template.options?.backgroundImageUrl || template.imageUrl || '';
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
                                Görseldeki doğru bölgeleri tıklayarak seçin.
                            </p>
                            <div className="mt-2 space-y-1 text-xs text-blue-700">
                                {template.allowMultipleSpots && (
                                    <p>• Birden fazla bölge seçebilirsiniz</p>
                                )}
                                {template.maxSelections && (
                                    <p>• Maksimum {template.maxSelections} bölge seçebilirsiniz</p>
                                )}
                                {!template.allowMultipleSpots && (
                                    <p>• Sadece bir bölge seçebilirsiniz</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Selection Info */}
            {!isSubmitted && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-300 rounded">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 font-medium">Seçim Durumu:</span>
                        <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600">
                                {selectedSpots.length}
                                {template.maxSelections && ` / ${template.maxSelections}`} seçildi
                            </span>
                            {template.maxSelections && (
                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${
                                            selectedSpots.length >= template.maxSelections
                                                ? 'bg-green-500'
                                                : 'bg-blue-500'
                                        }`}
                                        style={{
                                            width: `${(selectedSpots.length / template.maxSelections) * 100}%`
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Hot Spot Image */}
            <div
                ref={containerRef}
                className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100"
            >
                {/* Background Image */}
                <img
                    ref={imageRef}
                    src={getImageUrl()}
                    alt="Hot spot question"
                    onLoad={handleImageLoad}
                    className="w-full h-auto block"
                />

                {/* Hot Spot Overlays */}
                {imageLoaded && (
                    <div
                        className="absolute top-0 left-0 w-full h-full"
                        onClick={handleImageClick}
                        style={{ cursor: isSubmitted && !isPreview ? 'default' : 'pointer' }}
                    >
                        <svg className="w-full h-full">
                            {template.options?.hotSpots?.map(spot => renderHotSpotOverlay(spot))}
                        </svg>

                        {/* Show correct spots that were missed */}
                        {renderCorrectSpots()}
                    </div>
                )}

                {/* Loading State */}
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>

            {/* Selected Spots Info */}
            {selectedSpots.length > 0 && !isSubmitted && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Seçili Bölgeler:</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedSpots.map(spotId => {
                            const spot = template.options?.hotSpots?.find(s => s.id === spotId);
                            return (
                                <div
                                    key={spotId}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-2"
                                >
                                    <span>{spot?.label || spotId}</span>
                                    <button
                                        onClick={() => handleSpotClick(spotId)}
                                        className="hover:text-blue-900"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {!isPreview && (
                <button className={"btn btn-success"} onClick={handleSaveAnswer}>KAYDET</button>
            )}
            {/* Feedback for Selected Spots */}
            {isSubmitted && showCorrectAnswer && spotResults.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 text-lg">Seçimleriniz:</h4>
                    {spotResults.map((result, index) => (
                        <div
                            key={`result-${result.id}`}
                            className={`p-4 border-l-4 rounded ${
                                result.isCorrect
                                    ? 'bg-green-50 border-green-400'
                                    : 'bg-red-50 border-red-400'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className={`font-medium ${
                                        result.isCorrect ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                        {result.label || `Bölge ${index + 1}`}
                                    </p>
                                    {result.feedback && (
                                        <p className={`text-sm mt-2 ${
                                            result.isCorrect ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                            <strong>Açıklama:</strong> {result.feedback}
                                        </p>
                                    )}
                                </div>
                                <svg className={`w-6 h-6 flex-shrink-0 ${
                                    result.isCorrect ? 'text-green-600' : 'text-red-600'
                                }`} fill="currentColor" viewBox="0 0 20 20">
                                    {result.isCorrect ? (
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    ) : (
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    )}
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Overall Explanation */}
            {isSubmitted && showCorrectAnswer && template.explanation && (
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <h4 className="font-semibold text-yellow-800 mb-2">Genel Açıklama:</h4>
                    <p className="text-yellow-700">{template.explanation}</p>
                </div>
            )}

            {/* Score Summary */}
            {isSubmitted && showCorrectAnswer && spotResults.length > 0 && (
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
                        <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-300">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {calculateScore().correct}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">Doğru</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {calculateScore().incorrect}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">Yanlış</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {calculateScore().missed}
                                </div>
                                <div className="text-xs text-gray-600 mt-1">Kaçırılan</div>
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
                            <div><strong>Zorluk:</strong> {difficultyConverter(template.difficulty)}</div>
                        )}
                        {template.points && (
                            <div><strong>Puan:</strong> {template.points}</div>
                        )}
                        {template.timeLimit && (
                            <div><strong>Süre:</strong> {template.timeLimit} saniye</div>
                        )}
                        {template.options?.hotSpots && (
                            <div><strong>Hot Spot Sayısı:</strong> {template.options.hotSpots.length}</div>
                        )}
                        {template.maxSelections && (
                            <div><strong>Maks. Seçim:</strong> {template.maxSelections}</div>
                        )}
                        {template.allowMultipleSpots !== undefined && (
                            <div><strong>Çoklu Seçim:</strong> {template.allowMultipleSpots ? 'Evet' : 'Hayır'}</div>
                        )}
                        {template.options?.selectionType && (
                            <div><strong>Seçim Türü:</strong> {template.options.selectionType}</div>
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
        - Add zoom functionality for detailed viewing
        - Implement touch device support for mobile
        - Add keyboard shortcuts for accessibility
        - Support for animated hotspots
        - Implement hint system showing hotspot areas
        - Add time tracking per selection
        - Support for video hotspots
        - Implement undo/redo functionality
        - Add drawing tools for complex shapes
        - Support for 3D image hotspots
        - Implement collaborative features (optional)
        - Add accessibility features for screen readers
        - Support for timed hotspot reveals
        - Implement partial credit scoring
      */}
        </div>
    );
};

export default HotSpotQuestion;