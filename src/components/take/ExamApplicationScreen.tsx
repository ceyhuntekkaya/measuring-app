'use client';

import React, {useEffect, useState} from 'react';
import {QuestionAnswerRequest, QuestionGroupDto, QuestionTemplateType} from "@/types/exam/examEntities";
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
                                    <div key={key}>{header.content}</div>
                                ))
                            }


                            {
                                questionsByGroup && questionsByGroup.map((question, key) => (
                                    <div key={key} className="p-4 border-b">
                                        <h3 className="flex items-center gap-2">SORU: {key + 1} - {question.questionType} </h3>
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