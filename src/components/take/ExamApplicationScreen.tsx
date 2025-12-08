'use client';

import React, {useEffect, useState} from 'react';
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
    FillInTheBlanksTemplateDto, HotSpotTemplateDto, ImageResponseTemplateDto, MatchingTemplateDto,
    MultipleChoiceTemplateDto, MultipleResponseTemplateDto, OrderingTemplateDto, ShortAnswerTemplateDto,
    TrueFalseTemplateDto, VideoResponseTemplateDto
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
import siteConfig from "@/config/config.json";
const API_URL = siteConfig.api.invokeUrl + "/upload/serve";

interface ExamApplicationScreenProps {
    questionGroups: QuestionGroupDto[];
    onExitExam: () => void;
}

export default function ExamApplicationScreen({
                                                  questionGroups,
                                                  onExitExam
                                              }: ExamApplicationScreenProps) {
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
    const [completedGroups, setCompletedGroups] = useState<Set<number>>(new Set());
    const [showExitModal, setShowExitModal] = useState(false);
    const {application, evaluations} = useExamApplicationContext();
    const {saveAnswer} = useExamResult();



    console.log("ceyhun",setCompletedGroups)


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
    /*
        // Test için bir grubu tamamlanmış olarak işaretle
        const markAsCompleted = (index: number) => {
            setCompletedGroups(prev => new Set([...prev, index]));
        };

     */

    const {
        questionsByGroup,
        getQuestionsByGroup,
    } = useQuestion();


    const {
        selectedQuestionGroup,
        getQuestionGroupById,
    } = useQuestionGroup();

    useEffect(() => {
        if (questionGroups && questionGroups.length > 0) {
            getQuestionGroupById(questionGroups[currentGroupIndex].id);
            getQuestionsByGroup(questionGroups[currentGroupIndex].id)
        }
    }, [currentGroupIndex]);


    useEffect(() => {
        // alert(questionGroups.length)
        if (questionGroups && questionGroups.length > 0) {
            getQuestionGroupById(questionGroups[0].id);
            getQuestionsByGroup(questionGroups[0].id)
        }
    }, []);


    const onAnswerChange = (questionId: string, template: QuestionTemplateType, selectedOption: string, type: EQuestionType, mediaType: EMediaType, isEmptyAnswer: boolean) => {

        const evaluation = evaluations?.find(e => e.questionId === questionId);
        const answerData: QuestionAnswerRequest = {
            applicationId: application?.id || '',
            questionId: evaluation?.questionId || '',
            answer: selectedOption,
            mediaType: mediaType,
            questionType: type,
            evaluationId: evaluation?.id || '',
            isEmptyAnswer,
        }
      saveAnswer(answerData);
    };

    const renderTemplateSpecificForm = (questionId: string, type: EQuestionType, template: QuestionTemplateType) => {


        switch (type) {
            case 'MULTIPLE_CHOICE':
                return <MultipleChoiceQuestion template={template as MultipleChoiceTemplateDto}
                                               onAnswerChange={onAnswerChange} questionId={questionId}/>;
            case 'AUDIO_RESPONSE':
                return <AudioResponseQuestion template={template as AudioResponseTemplateDto} onAnswerChange={onAnswerChange} questionId={questionId}/>;
            case 'TRUE_FALSE':
                return <TrueFalseQuestion template={template as TrueFalseTemplateDto} onAnswerChange={onAnswerChange} questionId={questionId}/>;
            case 'FILL_IN_THE_BLANKS':
                return <FillInTheBlanksQuestion template={template as FillInTheBlanksTemplateDto} onAnswerChange={onAnswerChange} questionId={questionId}/>;
            case 'SHORT_ANSWER':
                return <ShortAnswerQuestion template={template as ShortAnswerTemplateDto} onAnswerChange={onAnswerChange} questionId={questionId}/>;
            case 'ESSAY':
                return <EssayQuestion template={template as EssayTemplateDto} onAnswerChange={onAnswerChange} questionId={questionId}/>;
            case 'VIDEO_RESPONSE':
                return <VideoResponseQuestion template={template as VideoResponseTemplateDto} onAnswerChange={onAnswerChange} questionId={questionId}/>;





            case 'MATCHING':
                return <MatchingQuestion template={template as MatchingTemplateDto} onAnswerChange={onAnswerChange} questionId={questionId}/>;
            case 'ORDERING':
                return <OrderingQuestion template={template as OrderingTemplateDto} onAnswerChange={onAnswerChange} questionId={questionId}/>;
            case 'MULTIPLE_RESPONSE':
                return <MultipleResponseQuestion template={template as MultipleResponseTemplateDto} onAnswerChange={onAnswerChange} questionId={questionId}/>;
            case 'HOT_SPOT':
                return <HotSpotQuestion template={template as HotSpotTemplateDto} onAnswerChange={onAnswerChange} questionId={questionId}/>;
            case 'DRAG_AND_DROP':
                return <DragAndDropQuestion template={template as DragAndDropTemplateDto} onAnswerChange={onAnswerChange} questionId={questionId}/>;
            case 'IMAGE_RESPONSE':
                return <ImageResponseQuestion template={template as ImageResponseTemplateDto} onAnswerChange={onAnswerChange} questionId={questionId}/>;
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



                // Normal video dosyaları için mevcut kod
                return (
                    <div className="ratio ratio-16x9 mb-4">
                        <video
                            className="w-100"
                            controls
                            src={ `${API_URL}/${material.content}`}
                        >
                            Your browser does not support the video file.
                        </video>
                    </div>
                );

            case "AUDIO":
                return (
                    <div className="mb-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                        Ses Dosyası
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Dinlemek için lütfen oynatma tuşuna basınız.
                                    </p>
                                </div>
                            </div>

                            {
                                /*
                                 <AudioPlayer
                                autoPlay
                                src="http://example.com/audio.mp3"
                                onPlay={e => console.log("onPlay")}
                                // other props here
                            />
                                 */
                            }



                            <audio
                                className="w-full h-10 outline-none"
                                controls
                                src={ `${API_URL}/${material.content}`}
                                style={{
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                }}
                            >
                                Your browser does not support the audio file.
                            </audio>
                        </div>
                    </div>
                );

            case "PDF":
                return (
                    <div className="mb-4 border border-4">
                        <iframe
                            src={material.content || ""}
                            className="w-100"
                            style={{ height: "600px" }}
                            title={`${material.name || 'title'}`}
                        ></iframe>
                    </div>
                );

            case "DOCUMENT":
                return (
                    <div className="mb-4">
                        <a

                            href={ `${API_URL}/${material.content}`}
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
                            src={ `${API_URL}/${material.content}`}
                            alt={`${material.name || 'images'}`}
                            className="img-fluid"
                            style={{ maxHeight: "500px" }}
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
                                <div dangerouslySetInnerHTML={{ __html: processContent(material.content) }} />
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
            {/* Header */}
            <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
                <div className="flex items-center gap-4 flex-1">
                    <h1 className="text-lg font-semibold text-gray-800">Sınav</h1>

                    {/* Progress Bar */}
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

                {/* Exit Button */}
                <button
                    onClick={handleExitClick}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    Sınavdan Çık
                </button>
            </header>

            {/* Main Content Area */}
            {
                selectedQuestionGroup &&
                <main className="flex-1 overflow-y-auto p-3">
                    <div className="mx-auto">
                        <div className="bg-white rounded-lg shadow-sm p-5 min-h-[500px]">
                            {/* Buraya soru içeriği gelecek */}

                            <h3 className="flex items-center gap-2">SORU GRUP: {currentGroupIndex + 1}</h3>
                            {
                                questionsByGroup && selectedQuestionGroup?.headers?.map((header, key) => (
                                    <div key={key}>{renderContent(header)}</div>


                                ))
                            }


                            {
                                questionsByGroup && questionsByGroup.map((question, key) => (
                                    <div key={key} className="p-4 border-b">
                                        <h3 className="flex items-center gap-2">SORU: {key + 1} </h3>
                                        {
                                            question.questionType && question.questionTemplate &&
                                            renderTemplateSpecificForm(question.id, question.questionType, question.questionTemplate)
                                        }
                                    </div>
                                ))
                                //<MultipleChoiceQuestion template={}/>
                            }
                        </div>
                    </div>
                </main>
            }


            {/* Bottom Navigation */}
            <footer className="bg-white border-t border-gray-200 p-4 shadow-lg">
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

            {/* Exit Confirmation Modal */}
            {showExitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Sınavdan Çıkmak İstediğinize Emin Misiniz?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Sınavdan çıkarsanız, yanıtlarınız kaydedilecektir ancak geri dönemezsiniz.
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