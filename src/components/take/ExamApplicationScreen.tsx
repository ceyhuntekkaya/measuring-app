'use client';

import React, {useEffect, useRef, useState} from 'react';
import {
    QuestionAnswerRequest,
    QuestionGroupDto,
    QuestionGroupHeaderDto,
    QuestionTemplateType
} from "@/types/exam/examEntities";
import {useQuestion} from "@/hooks/exam/use-question";
import {EMediaType, EQuestionType} from "@/types/exam/enum";
import MultipleChoiceQuestion from "@/components/template/MultipleChoiceQuestion";
import {
    AudioResponseTemplateDto,
    DragAndDropTemplateDto,
    EssayTemplateDto,
    FillInTheBlanksTemplateDto,
    HotSpotTemplateDto,
    ImageResponseTemplateDto,
    MatchingTemplateDto,
    MultipleChoiceTemplateDto,
    MultipleResponseTemplateDto,
    OrderingTemplateDto,
    ShortAnswerTemplateDto,
    TrueFalseTemplateDto,
    VideoResponseTemplateDto
} from "@/types/exam/questionTemplates";
import TrueFalseQuestion from "@/components/template/TrueFalseQuestion";
import FillInTheBlanksQuestion from "@/components/template/FillInTheBlanksQuestion";
import {useQuestionGroup} from "@/hooks/exam/use-question-group";
import ShortAnswerQuestion from "@/components/template/ShortAnswerQuestion";
import EssayQuestion from "@/components/template/EssayQuestion";
import MatchingQuestion from "@/components/template/MatchingQuestion";
import OrderingQuestion from "@/components/template/OrderingQuestion";
import MultipleResponseQuestion from "@/components/template/MultipleResponseQuestion";
import HotSpotQuestion from "@/components/template/HotSpotQuestion";
import DragAndDropQuestion from "@/components/template/DragAndDropQuestion";
import AudioResponseQuestion from "@/components/template/AudioResponseQuestion";
import VideoResponseQuestion from "@/components/template/VideoResponseQuestion";
import ImageResponseQuestion from "@/components/template/ImageResponseQuestion";
import {useExamApplicationContext} from "@/contexts/ExamApplicationContext";
import {useExamResult} from "@/hooks/exam/use-exam-result";
import {UploadedFileDto} from "@/types/exam/miscDtos";
import {useApplication} from "@/hooks/exam/use-application";
import {ESessionState} from "@/types/exam/enum";
import siteConfig from "@/config/config.json";

const API_URL = siteConfig.api.invokeUrl + "/upload/serve";

interface AudioPlayerWithProgressProps {
    material: QuestionGroupHeaderDto;
}

const AudioPlayerWithProgress: React.FC<AudioPlayerWithProgressProps> = ({material}) => {
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playCount, setPlayCount] = useState(0);
    const [showProgress, setShowProgress] = useState(true);
    const [audioReady, setAudioReady] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const MAX_PLAYS = 3;
    const PROGRESS_DURATION = 10; // 10 saniye

    // İlk progress bar (10 saniye)
    useEffect(() => {
        if (!audioReady && !isDisabled) {
            setProgress(0);
            setShowProgress(true);

            progressIntervalRef.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        if (progressIntervalRef.current) {
                            clearInterval(progressIntervalRef.current);
                        }
                        setShowProgress(false);
                        setAudioReady(true);
                        return 100;
                    }
                    return prev + (100 / PROGRESS_DURATION);
                });
            }, 1000);
        }

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [audioReady, isDisabled]);

    // Audio hazır olduğunda otomatik başlat
    useEffect(() => {
        if (audioReady && audioRef.current && playCount < MAX_PLAYS && !isDisabled) {
            audioRef.current.play().catch((err: Error) => {
                console.error('Audio play error:', err);
            });
            setIsPlaying(true);
        }
    }, [audioReady, playCount, isDisabled]);

    // Audio bittiğinde progress bar göster ve tekrar başlat
    const handleAudioEnded = () => {
        setIsPlaying(false);
        const newPlayCount = playCount + 1;
        setPlayCount(newPlayCount);

        if (newPlayCount >= MAX_PLAYS) {
            setIsDisabled(true);
            setShowProgress(false);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            return;
        }

        // 10 saniye progress bar göster
        setShowProgress(true);
        setProgress(0);
        setAudioReady(false);

        progressIntervalRef.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    if (progressIntervalRef.current) {
                        clearInterval(progressIntervalRef.current);
                    }
                    setShowProgress(false);
                    setAudioReady(true);
                    return 100;
                }
                return prev + (100 / PROGRESS_DURATION);
            });
        }, 1000);
    };

    return (
        <div className="mb-4">
            <div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                            Ses Dosyası
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {isDisabled
                                ? `Ses ${MAX_PLAYS} kez dinlendi. Artık dinlenemez.`
                                : isPlaying
                                    ? `Dinleniyor... (${playCount + 1}/${MAX_PLAYS})`
                                    : showProgress
                                        ? 'Hazırlanıyor...'
                                        : 'Dinleniyor...'}
                        </p>
                    </div>
                </div>

                {showProgress && (
                    <div className="mb-4">
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-300 ease-linear"
                                style={{width: `${progress}%`}}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            {Math.round(progress)}% - Hazırlanıyor...
                        </p>
                    </div>
                )}

                <audio
                    ref={audioRef}
                    className="w-full h-10 outline-none"
                    src={`${API_URL}/${material.content}`}
                    onEnded={handleAudioEnded}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    style={{
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                        pointerEvents: isDisabled ? 'none' : 'auto'
                    }}
                    controls={false}
                >
                    Your browser does not support the audio file.
                </audio>

                {!showProgress && !isDisabled && (
                    <div className="mt-4 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
                            <div
                                className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                            <span className="text-sm text-blue-700 font-medium">
                                {isPlaying ? 'Dinleniyor...' : 'Bekleniyor...'}
                            </span>
                        </div>
                    </div>
                )}

                {isDisabled && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                        <p className="text-sm text-yellow-800 font-medium">
                            ⚠️ Ses dosyası {MAX_PLAYS} kez dinlendi. Artık dinlenemez.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

interface ExamApplicationScreenProps {
    questionGroups: QuestionGroupDto[];
    onExitExam: () => void;
}

export default function ExamApplicationScreen({
                                                  questionGroups,
                                                  onExitExam
                                              }: ExamApplicationScreenProps) {
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
    const [completedGroups] = useState<Set<number>>(new Set());
    const [showExitModal, setShowExitModal] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
    const {application, evaluations} = useExamApplicationContext();
    const {saveAnswer} = useExamResult();
    const {setApplicationStartedAt, updateApplicationSessionState} = useApplication();

    const totalGroups = questionGroups.length;
    const progressPercentage = (completedGroups.size / totalGroups) * 100;

    const handleGroupClick = (index: number) => {
        setCurrentGroupIndex(index);
    };

    const handleExitClick = () => {
        setShowExitModal(true);
    };

    const handleConfirmExit = () => {
        setShowExitModal(false);
        onExitExam();
    };

    const handleCancelExit = () => {
        setShowExitModal(false);
    };

    const {
        questionsByGroup,
        getQuestionsByGroup,
    } = useQuestion();


    const {
        selectedQuestionGroup,
        getQuestionGroupById,
    } = useQuestionGroup();

    // Sınav başladığında API çağrıları (sadece bir kez çalışsın)
    const hasInitializedRef = useRef(false);
    useEffect(() => {
        if (application?.id && !hasInitializedRef.current) {
            hasInitializedRef.current = true;
            
            // startedAt null ise setApplicationStartedAt çağır
            if (!application.startedAt) {
                setApplicationStartedAt(application.id);
            }
            
            // Sınav durumunu IN_PROGRESS yap
            updateApplicationSessionState(application.id, ESessionState.IN_PROGRESS);
        }
    }, [application?.id, application?.startedAt, setApplicationStartedAt, updateApplicationSessionState]);

    useEffect(() => {
        if (questionGroups && questionGroups.length > 0) {
            getQuestionGroupById(questionGroups[currentGroupIndex].id);
            getQuestionsByGroup(questionGroups[currentGroupIndex].id);
            setCurrentQuestionIndex(0);
            setAnsweredQuestions(new Set());
        }
    }, [currentGroupIndex]);


    useEffect(() => {
        if (questionGroups && questionGroups.length > 0) {
            getQuestionGroupById(questionGroups[0].id);
            getQuestionsByGroup(questionGroups[0].id);
            setCurrentQuestionIndex(0);
            setAnsweredQuestions(new Set());
        }
    }, []);

    useEffect(() => {
        setCurrentQuestionIndex(0);
        setAnsweredQuestions(new Set());
    }, [questionsByGroup?.length]);


    const isConversationSection = (): boolean => {
        const sectionName = selectedQuestionGroup?.examSection?.name?.toUpperCase() || '';
        return sectionName.includes('KARŞILIKLI') && sectionName.includes('KONUŞMA');
    };

    const onAnswerChange = (questionId: string, template: QuestionTemplateType, selectedOption: string, type: EQuestionType, mediaType: EMediaType, isEmptyAnswer: boolean) => {

        const evaluation = evaluations?.find(e => e.questionId === questionId);
        const finalQuestionId = evaluation?.questionId || questionId;

        if (!finalQuestionId) {
            console.error('onAnswerChange: questionId is required but was not provided');
            return;
        }

        const answerData: QuestionAnswerRequest = {
            applicationId: application?.id || '',
            questionId: finalQuestionId,
            answer: selectedOption,
            mediaType: mediaType,
            questionType: type,
            evaluationId: evaluation?.id || '',
            isEmptyAnswer,
        }
      saveAnswer(answerData);

        if (isConversationSection() && !isEmptyAnswer && !answeredQuestions.has(questionId)) {
            setAnsweredQuestions(prev => new Set([...prev, questionId]));
            if (questionsByGroup && currentQuestionIndex < questionsByGroup.length - 1) {
                setTimeout(() => {
                    setCurrentQuestionIndex(prev => prev + 1);
                }, 500);
            }
        }
    };

    const getInitialAnswer = (questionId: string, type: EQuestionType): unknown => {
        const evaluation = evaluations?.find(e => e.questionId === questionId);
        if (!evaluation || !evaluation.answer || typeof evaluation.answer !== 'string') {
            return null;
        }

        const answerString = evaluation.answer;

        try {
            if (type === 'TRUE_FALSE') {
                if (answerString === 'true' || answerString === 'TRUE') return true;
                if (answerString === 'false' || answerString === 'FALSE') return false;
                return null;
            }

            if (answerString.startsWith('{') || answerString.startsWith('[')) {
                const parsed = JSON.parse(answerString);

                if (type === 'MULTIPLE_CHOICE') {
                    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                        if ('optionId' in parsed && typeof parsed.optionId === 'string') {
                            return parsed.optionId;
                        }
                        const values = Object.values(parsed);
                        if (values.length === 1 && typeof values[0] === 'string') {
                            return values[0];
                        }
                        return null;
                    }
                    if (typeof parsed === 'string') {
                        return parsed;
                    }
                    return null;
                }

                if (type === 'ESSAY' && typeof parsed === 'string') {
                    const text = parsed;
                    return {
                        text: text,
                        wordCount: text.trim().split(/\s+/).filter(word => word.length > 0).length,
                        characterCount: text.replace(/\s/g, '').length
                    };
                }
                if (type === 'MULTIPLE_RESPONSE' && Array.isArray(parsed)) {
                    const optionsArray = parsed.map(item => String(item)).filter(item => item.length > 0);
                    return optionsArray;
                }

                if (type === 'FILL_IN_THE_BLANKS') {
                    if (Array.isArray(parsed)) {
                        const blankAnswers: { [blankId: string]: string } = {};
                        parsed.forEach((item: { blankId?: string; answer?: string }) => {
                            if (item.blankId && item.answer !== undefined) {
                                blankAnswers[item.blankId] = item.answer;
                            }
                        });
                        return blankAnswers;
                    }
                    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                        const blankAnswers: { [blankId: string]: string } = {};
                        Object.entries(parsed).forEach(([key, value]) => {
                            if (typeof value === 'string') {
                                blankAnswers[key] = value;
                            }
                        });
                        return blankAnswers;
                    }
                    return null;
                }
                return parsed;
            }

            if (type === 'MULTIPLE_CHOICE') {
                if (!answerString || answerString.trim() === '') {
                    return null;
                }
                return answerString;
            }
            if (type === 'ESSAY') {
                const text = answerString;
                return {
                    text: text,
                    wordCount: text.trim().split(/\s+/).filter(word => word.length > 0).length,
                    characterCount: text.replace(/\s/g, '').length
                };
            }
            if (type === 'FILL_IN_THE_BLANKS') {
                return null;
            }
            if (type === 'AUDIO_RESPONSE' || type === 'VIDEO_RESPONSE' || type === 'IMAGE_RESPONSE') {
                if (answerString && answerString.trim() !== '') {
                    return {
                        uploadedFileData: {
                            path: answerString.trim()
                        }
                    };
                }
                return null;
            }
            if (type === 'MULTIPLE_RESPONSE') {
                if (!answerString || answerString.trim() === '') {
                    return [];
                }
                const optionsArray = answerString.split(',').map(option => option.trim()).filter(option => option.length > 0);
                return optionsArray;
            }
            return answerString;
        } catch (e) {
            console.log('Parse error:', e);
            if (type === 'ESSAY') {
                const text = answerString;
                return {
                    text: text,
                    wordCount: text.trim().split(/\s+/).filter(word => word.length > 0).length,
                    characterCount: text.replace(/\s/g, '').length
                };
            }
            if (type === 'MULTIPLE_CHOICE') {
                return answerString || null;
            }
            if (type === 'MULTIPLE_RESPONSE') {
                if (!answerString || answerString.trim() === '') {
                    return [];
                }
                const optionsArray = answerString.split(',').map(option => option.trim()).filter(option => option.length > 0);
                return optionsArray;
            }
            return answerString;
        }
    };


    const renderTemplateSpecificForm = (questionId: string, type: EQuestionType, template: QuestionTemplateType) => {
        const initialAnswer = getInitialAnswer(questionId, type);

        switch (type) {
            case 'MULTIPLE_CHOICE':
                return <MultipleChoiceQuestion key={questionId}
                                               template={template as MultipleChoiceTemplateDto}
                                               onAnswerChange={onAnswerChange}
                                               questionId={questionId}
                                               initialAnswer={initialAnswer as string | null}/>;
            case 'AUDIO_RESPONSE':
                return <AudioResponseQuestion key={questionId}
                                              template={template as AudioResponseTemplateDto}
                                              onAnswerChange={onAnswerChange}
                                              questionId={questionId}
                                              initialAnswer={(initialAnswer as unknown) as {
                                                  audioUrl?: string;
                                                  audioBlob?: Blob;
                                                  duration?: number;
                                                  recordedAt?: string;
                                                  fileName?: string;
                                                  uploadedFileData?: UploadedFileDto
                                              } | null}/>;
            case 'TRUE_FALSE':
                return <TrueFalseQuestion key={questionId}
                                          template={template as TrueFalseTemplateDto}
                                          onAnswerChange={onAnswerChange}
                                          questionId={questionId}
                                          initialAnswer={initialAnswer as boolean | null}/>;
            case 'FILL_IN_THE_BLANKS':
                return <FillInTheBlanksQuestion key={questionId}
                                                template={template as FillInTheBlanksTemplateDto}
                                                onAnswerChange={onAnswerChange}
                                                questionId={questionId}
                                                initialAnswer={initialAnswer as {
                                                    [blankId: string]: string
                                                } | undefined}/>;
            case 'SHORT_ANSWER':
                return <ShortAnswerQuestion key={questionId}
                                            template={template as ShortAnswerTemplateDto}
                                            onAnswerChange={onAnswerChange}
                                            questionId={questionId}
                                            initialAnswer={initialAnswer as string || ''}/>;
            case 'ESSAY':
                return <EssayQuestion key={questionId}
                                      template={template as EssayTemplateDto}
                                      onAnswerChange={onAnswerChange}
                                      questionId={questionId}
                                      initialAnswer={initialAnswer as {
                                          text: string;
                                          wordCount: number;
                                          characterCount: number
                                      } | null}/>;
            case 'VIDEO_RESPONSE':
                return <VideoResponseQuestion key={questionId}
                                              template={template as VideoResponseTemplateDto}
                                              onAnswerChange={onAnswerChange}
                                              questionId={questionId}
                                              initialAnswer={(initialAnswer as unknown) as {
                                                  videoUrl?: string;
                                                  videoBlob?: Blob;
                                                  duration?: number;
                                                  recordedAt?: string;
                                                  fileName?: string;
                                                  uploadedFileData?: UploadedFileDto
                                              } | null}/>;


            case 'MATCHING':
                return <MatchingQuestion key={questionId}
                                         template={template as MatchingTemplateDto}
                                         onAnswerChange={onAnswerChange}
                                         questionId={questionId}
                                         initialAnswer={initialAnswer as { [leftId: string]: string } | undefined}/>;
            case 'ORDERING':
                return <OrderingQuestion key={questionId}
                                         template={template as OrderingTemplateDto}
                                         onAnswerChange={onAnswerChange}
                                         questionId={questionId}
                                         initialAnswer={initialAnswer as string[] | null | undefined}/>;
            case 'MULTIPLE_RESPONSE':
                return <MultipleResponseQuestion key={questionId}
                                                 template={template as MultipleResponseTemplateDto}
                                                 onAnswerChange={onAnswerChange}
                                                 questionId={questionId}
                                                 initialAnswer={initialAnswer as string[]}/>;
            case 'HOT_SPOT':
                return <HotSpotQuestion key={questionId}
                                        template={template as HotSpotTemplateDto}
                                        onAnswerChange={onAnswerChange}
                                        questionId={questionId}
                                        initialAnswer={initialAnswer as string[]}/>;
            case 'DRAG_AND_DROP':
                return <DragAndDropQuestion key={questionId}
                                            template={template as DragAndDropTemplateDto}
                                            onAnswerChange={onAnswerChange}
                                            questionId={questionId}
                                            initialAnswer={initialAnswer as {
                                                [zoneId: string]: string[]
                                            } | undefined}/>;
            case 'IMAGE_RESPONSE':
                return <ImageResponseQuestion key={questionId}
                                              template={template as ImageResponseTemplateDto}
                                              onAnswerChange={onAnswerChange}
                                              questionId={questionId}
                                              initialAnswer={(initialAnswer as unknown) as {
                                                  imageUrl?: string;
                                                  imageBlob?: Blob;
                                                  fileName?: string;
                                                  uploadedFileData?: UploadedFileDto
                                              } | null}/>;
            default:
                return (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-yellow-800">
                            Bu soru tipi için henüz özel form komponenti hazırlanmamıştır.
                        </p>
                    </div>
                );
        }
    };


    const renderContent = (material: QuestionGroupHeaderDto) => {

        switch (material.mediaType) {
            case "VIDEO":
                return (
                    <div className="ratio ratio-16x9 mb-4">
                        <video
                            className="w-100"
                            controls
                            src={`${API_URL}/${material.content}`}
                        >
                            Your browser does not support the video file.
                        </video>
                    </div>
                );

            case "AUDIO":
                return <AudioPlayerWithProgress material={material}/>;

            case "PDF":
                return (
                    <div className="mb-4 border-4">
                        <iframe
                            src={material.content || ""}
                            className="w-100"
                            style={{height: "600px"}}
                            title={`${material.name || 'title'}`}
                        ></iframe>
                    </div>
                );

            case "DOCUMENT":
                return (
                    <div className="mb-4">
                        <a

                            href={`${API_URL}/${material.content}`}
                            className="btn btn-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                            download={material.uploadedFileName || undefined}
                        >
                            <i className="bi bi-file-earmark-text me-2"></i>
                            Download Document
                        </a>
                    </div>
                );

            case "IMAGE":
                return (
                    <div className="mb-4 text-center">
                        <img
                            src={`${API_URL}/${material.content}`}
                            alt={`${material.name || 'images'}`}
                            className="img-fluid"
                            style={{maxHeight: "500px"}}
                        />
                    </div>
                );


            case "TEXT":
            default:
                const processContent = (content: string): string => {
                    if (!content) return '';
                    return /<\/?[a-z][\s\S]*>/i.test(content)
                        ? content
                        : content.replace(/\n/g, '<br/>').replace(/\\n/g, '<br/>');
                };

                return (
                    <div className="mb-4 card">
                        <div className="card-body">
                            {material.content ? (
                                <div dangerouslySetInnerHTML={{__html: processContent(material.content)}}/>
                            ) : (
                                <div className="alert alert-warning">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    No content found.
                                </div>
                            )}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-50"
             style={{height: "calc(100vh - 100px)"}}>
            <header className="flex-shrink-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
                <div className="flex items-center gap-4 flex-1">
                    <h1 className="text-lg font-semibold text-gray-800">Sınav</h1>
                    <div className="flex-1 max-w-md">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-300"
                                    style={{width: `${progressPercentage}%`}}
                                />
                            </div>
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                {completedGroups.size}/{totalGroups}
              </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleExitClick}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    Bölüm Listesine Dön.
                </button>
            </header>

            {
                selectedQuestionGroup &&
                <main className="flex-1 overflow-y-auto p-3">
                    <div className="mx-auto">
                        <div className="bg-white rounded-lg shadow-sm p-5 min-h-[500px]">
                            {
                                questionsByGroup && selectedQuestionGroup?.headers?.map((header, key) => (
                                    <div key={key}>{renderContent(header)}</div>
                                ))
                            }
                            {
                                questionsByGroup && (isConversationSection() ? (
                                    currentQuestionIndex < questionsByGroup.length ? (
                                        <div className="p-4 border-b">
                                            <h3 className="flex items-center gap-2">
                                                SORU: {currentQuestionIndex + 1} / {questionsByGroup.length}
                                            </h3>
                                            {
                                                questionsByGroup[currentQuestionIndex].questionType &&
                                                questionsByGroup[currentQuestionIndex].questionTemplate &&
                                                renderTemplateSpecificForm(
                                                    questionsByGroup[currentQuestionIndex].id,
                                                    questionsByGroup[currentQuestionIndex].questionType!,
                                                    questionsByGroup[currentQuestionIndex].questionTemplate!
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <div className="p-4 border-b text-center">
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                                <h3 className="text-xl font-semibold text-green-800 mb-2">
                                                    Tüm Sorular Tamamlandı!
                                                </h3>
                                                <p className="text-green-600">
                                                    Bu bölümdeki tüm soruları cevapladınız.
                                                </p>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    questionsByGroup.map((question, key) => (
                                    <div key={key} className="p-4 border-b">
                                            <h3 className="flex items-center gap-2">
                                                SORU: {key + 1}

                                            </h3>
                                        {
                                            question.questionType && question.questionTemplate &&
                                            renderTemplateSpecificForm(question.id, question.questionType, question.questionTemplate)
                                        }
                                    </div>
                                ))
                                ))
                            }
                        </div>
                    </div>
                </main>
            }

            <footer className="flex-shrink-0 bg-white border-t border-gray-200 p-4 shadow-lg mt-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                        {questionGroups.map((_, index) => {
                            const isCompleted = completedGroups.has(index);
                            const isCurrent = index === currentGroupIndex;

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleGroupClick(index)}
                                    className={`
                    w-10 h-10 rounded-lg font-medium text-sm transition-all
                    ${isCurrent
                                        ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2'
                                        : isCompleted
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }
                  `}
                                    aria-label={`Soru grubu ${index + 1}`}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </footer>

            {showExitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Bölümden Çıkmak İstediğinize Emin Misiniz?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Bölümden çıkarsanız, yanıtlarınız kaydedilecektir ancak geri dönemezsiniz.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancelExit}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleConfirmExit}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            >
                                Evet, Çık
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}