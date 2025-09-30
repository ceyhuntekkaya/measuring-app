'use client';

import React, {useEffect, useState} from 'react';
import {QuestionGroupDto, QuestionTemplateType} from "@/types/exam/examEntities";
import {useQuestion} from "@/hooks/exam/use-question";
import {EQuestionType} from "@/types/exam/enum";
import MultipleChoiceQuestion from "@/components/template/MultipleChoiceQuestion";
import {
    FillInTheBlanksTemplateDto,
    MultipleChoiceTemplateDto,
    TrueFalseTemplateDto
} from "@/types/exam/questionTemplates";
import TrueFalseQuestion from "@/components/template/TrueFalseQuestion";
import FillInTheBlanksQuestion from "@/components/template/FillInTheBlanksQuestion";
import {useQuestionGroup} from "@/hooks/exam/use-question-group";

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

    const renderTemplateSpecificForm = (type: EQuestionType, template: QuestionTemplateType) => {


        switch (type) {
            case 'MULTIPLE_CHOICE':
                return <MultipleChoiceQuestion template={template as MultipleChoiceTemplateDto}/>;

            case 'TRUE_FALSE':
                return <TrueFalseQuestion template={template as TrueFalseTemplateDto}/>;
            case 'FILL_IN_THE_BLANKS':
                return <FillInTheBlanksQuestion template={template as FillInTheBlanksTemplateDto}/>;
            /*  case 'SHORT_ANSWER':
                    return <ShortAnswerTemplateForm onChange={commonProps.onChange}
                                                    value={commonProps.value as ShortAnswerTemplateDto}/>;
                case 'ESSAY':
                    return <EssayTemplateForm onChange={commonProps.onChange}
                                              value={commonProps.value as EssayTemplateDto}/>;
                case 'MATCHING':
                    return <MatchingTemplateForm onChange={commonProps.onChange}
                                                 value={commonProps.value as MatchingTemplateDto}/>;
                case 'ORDERING':
                    return <OrderingTemplateForm onChange={commonProps.onChange}
                                                 value={commonProps.value as OrderingTemplateDto}/>;
                case 'MULTIPLE_RESPONSE':
                    return <MultipleResponseTemplateForm onChange={commonProps.onChange}
                                                         value={commonProps.value as MultipleResponseTemplateDto}/>;
                case 'HOT_SPOT':
                    return <HotSpotTemplateForm onChange={commonProps.onChange}
                                                value={commonProps.value as HotSpotTemplateDto}/>;
                case 'DRAG_AND_DROP':
                    return <DragAndDropTemplateForm onChange={commonProps.onChange}
                                                    value={commonProps.value as DragAndDropTemplateDto}/>;
                case 'AUDIO_RESPONSE':
                    return <AudioResponseTemplateForm onChange={commonProps.onChange}
                                                      value={commonProps.value as AudioResponseTemplateDto}/>;
                case 'VIDEO_RESPONSE':
                    return <VideoResponseTemplateForm onChange={commonProps.onChange}
                                                      value={commonProps.value as VideoResponseTemplateDto}/>;
                case 'IMAGE_RESPONSE':
                    return <ImageResponseTemplateForm onChange={commonProps.onChange}
                                                      value={commonProps.value as ImageResponseTemplateDto}/>;


                     */

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


    console.log(selectedQuestionGroup)

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
            <main className="flex-1 overflow-y-auto p-6">
                <div className="mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-8 min-h-[500px]">
                        {/* Buraya soru içeriği gelecek */}

                        {
                            /*
                            <div className="text-center text-gray-500">
                            <p className="text-lg font-medium">Soru Grubu {currentGroupIndex + 1}</p>
                            <p className="mt-2">Soru içeriği buraya gelecek</p>

                            {// Test butonu - daha sonra kaldırılacak }
                        <button
                            onClick={() => markAsCompleted(currentGroupIndex)}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Bu Grubu Tamamlandı Olarak İşaretle (Test)
                        </button>
                    </div>
                             */
                        }
                        {
                            selectedQuestionGroup?.headers?.map((header, key) => (
                                <div key={key}>{header.content}</div>
                            ))
                        }


                        {
                            questionsByGroup.map((question, key) => (
                                <div key={key} className="p-4 border-b">
                                    {
                                        question.questionType && question.questionTemplate &&
                                        renderTemplateSpecificForm(question.questionType, question.questionTemplate)
                                    }
                                </div>
                            ))
                            //<MultipleChoiceQuestion template={}/>
                        }
                    </div>
                </div>
            </main>

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