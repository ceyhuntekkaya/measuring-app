import React, {useEffect, useState} from 'react';
import {ApplicationDto, QuestionId} from "@/types/management/brand";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Column, RecordType} from "@/types/ui/table";
import {statusConverter} from "@/utils/enum-converter";
import {EStatus, EQuestionType, EMediaType} from "@/types/exam/enum";
import DynamicTable from "@/components/ui/dynamic-table";
import {useApplication} from "@/hooks/exam/use-application";
import {useQuestion} from "@/hooks/exam/use-question";
import {EvaluationDto, EvaluationGroup, EvaluationGroupData, QuestionDto, QuestionTemplateType} from "@/types/exam/examEntities";
import {EEvaluationStatus} from "@/types/auth";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
    AudioResponseTemplateDto,
    EssayTemplateDto,
    ImageResponseTemplateDto,
    ShortAnswerTemplateDto,
    VideoResponseTemplateDto,
    MultipleChoiceTemplateDto,
    TrueFalseTemplateDto,
    FillInTheBlanksTemplateDto,
    MatchingTemplateDto,
    OrderingTemplateDto,
    MultipleResponseTemplateDto,
    HotSpotTemplateDto,
    DragAndDropTemplateDto
} from "@/types/exam/questionTemplates";
import {useExamResult} from "@/hooks/exam/use-exam-result";
import {UploadedFileDto} from "@/types/exam/miscDtos";
import MultipleChoiceQuestion from "@/components/template/MultipleChoiceQuestion";
import TrueFalseQuestion from "@/components/template/TrueFalseQuestion";
import FillInTheBlanksQuestion from "@/components/template/FillInTheBlanksQuestion";
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

import siteConfig from "@/config/config.json";

interface ExamTypeFormProps {
    candidates: ApplicationDto[];
    sessionId: string;
}


const ExamEvaluationPanel: React.FC<ExamTypeFormProps> = ({
                                                              candidates,
                                                              sessionId
                                                          }) => {
    const [allQuestionIdList, setAllQuestionIdList] = useState<QuestionId[] | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
    const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationGroupData | null>(null);
    const [filterType, setFilterType] = useState<EEvaluationStatus | 'ALL'>('ALL');

    const [applicationQuestionDataWithEvaluation, setApplicationQuestionDataWithEvaluation] = useState<EvaluationGroup | null>(null);
    const [filteredApplicationQuestionDataWithEvaluation, setFilteredApplicationQuestionDataWithEvaluation] = useState<EvaluationGroupData[] | null>(null);

    const {
        sessionEvaluations,
        getApplicationEvaluationsBySession,
    } = useApplication();

    const {
        getAllQuestionByIdList,
        sessionQuestions,
    } = useQuestion();

    const {
        saveEvaluation
    } = useExamResult();

    useEffect(() => {
        getApplicationEvaluationsBySession(sessionId)
    }, []);

    useEffect(() => {
        if (sessionEvaluations && sessionEvaluations.length > 0) {
            const uniqueQuestionIds = Array.from(
                new Set(sessionEvaluations.map(evaluation => evaluation.questionId))
            ).map(questionId => ({questionId}));

            setAllQuestionIdList(uniqueQuestionIds);

        }
    }, [sessionEvaluations]);

    useEffect(() => {
        if (allQuestionIdList && allQuestionIdList.length > 0) {
            getAllQuestionByIdList(allQuestionIdList);
        }
    }, [allQuestionIdList]);


    useEffect(() => {
        if (sessionQuestions && sessionQuestions.length > 0) {

        }
    }, [sessionQuestions]);


    useEffect(() => {
        if (selectedApplication && sessionEvaluations && sessionQuestions) {
            // Seçili application'a ait evaluation'ları filtrele
            const filteredEvaluations = sessionEvaluations.filter(
                ev => ev.applicationId === selectedApplication
            );

            // Application bilgisini bul
            const application = candidates.find(
                app => app.id === selectedApplication
            );

            if (!application) return;

            // Her evaluation için ilgili question'ı bul ve EvaluationGroupData array'i oluştur
            const evaluationGroupDataArray: EvaluationGroupData[] = filteredEvaluations.map(ev => {
                const question = sessionQuestions.find(
                    q => q.id === ev.questionId
                );

                return {
                    question: question!,
                    evaluation: ev
                };
            }).filter(data => data.question); // Null kontrolü

            // Tek bir EvaluationGroup objesi oluştur
            const evaluationGroup: EvaluationGroup = {
                data: evaluationGroupDataArray,
                application: application
            };

            setFilterType('ALL')

            setApplicationQuestionDataWithEvaluation(evaluationGroup);
        }
    }, [selectedApplication]);

    const EvaluationPanel = () => {
        return (
            <>
                {
                    filteredApplicationQuestionDataWithEvaluation  &&

                    <div>
                        <Label htmlFor="examType">Sınav Durumu Seçin:</Label>
                        <Select
                            onValueChange={(value) => setFilterType(value as EEvaluationStatus)}
                            value={filterType || ''}
                        >
                            <SelectTrigger className={'border-red-500'}>
                                <SelectValue placeholder="Sınav tipi seçin"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>

                                    <SelectItem value={'ALL'}>
                                        TÜMÜ
                                    </SelectItem>
                                    <SelectItem value={'NOT_STARTED'}>
                                        BAŞLANMAMIŞ
                                    </SelectItem>
                                    <SelectItem value={'EVALUATED'}>
                                        DEĞERLENDİRİLMİŞ
                                    </SelectItem>
                                    <SelectItem value={'PENDING'}>
                                        BEKLEMEDE
                                    </SelectItem>
                                    <SelectItem value={'CANCELLED'}>
                                        İPTAL EDİLMİŞ
                                    </SelectItem>
                                    <SelectItem value={'FINISHED'}>
                                        BİTMİŞ
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                }

                {
                    filteredApplicationQuestionDataWithEvaluation && filteredApplicationQuestionDataWithEvaluation.length > 0 &&
                    <DynamicTable searchable={false} pageSize={200} columns={columnsEvaluation}
                                  data={filteredApplicationQuestionDataWithEvaluation}/>

                }
            </>
        )
    }

    const EvaluationDetail = () => {
        const [description, setDescription] = useState<string>('');
        const [score, setScore] = useState<number>(0);

        useEffect(() => {
            if (selectedEvaluation) {
                setDescription(selectedEvaluation.evaluation.description || '');
                setScore(selectedEvaluation.evaluation.score || 0);
            }
        }, [selectedEvaluation]);

        const handleSave = () => {
            if (selectedEvaluation) {
                const data = {...selectedEvaluation.evaluation, score: score, description};
                saveEvaluation(selectedEvaluation.evaluation.id, data).then(() =>
                    getApplicationEvaluationsBySession(sessionId)
                )
            }

        };

        const handleCancel = () => {
            setSelectedEvaluation(null);
        };

        // Evaluation'dan initialAnswer'ı parse et
        const getInitialAnswer = (): unknown => {
            if (!selectedEvaluation || !selectedEvaluation.evaluation.answer || typeof selectedEvaluation.evaluation.answer !== 'string') {
                return null;
            }

            const answerString = selectedEvaluation.evaluation.answer;
            const type = selectedEvaluation.question.questionType as EQuestionType;

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

        // Soruyu template'ine göre render et
        const renderQuestion = () => {
            if (!selectedEvaluation || !selectedEvaluation.question.questionType || !selectedEvaluation.question.questionTemplate) {
                return null;
            }

            const questionId = selectedEvaluation.question.id;
            const type = selectedEvaluation.question.questionType as EQuestionType;
            const template = selectedEvaluation.question.questionTemplate as QuestionTemplateType;
            const initialAnswer = getInitialAnswer();

            // Boş bir onAnswerChange fonksiyonu (değişiklik yapılmasın)
            const emptyOnAnswerChange = () => {};

            switch (type) {
                case 'MULTIPLE_CHOICE':
                    return <MultipleChoiceQuestion 
                        key={questionId}
                        template={template as MultipleChoiceTemplateDto}
                        isPreview={true}
                        isSubmitted={true}
                        showLearnerEvaluation={true}
                        questionId={questionId}
                        initialAnswer={initialAnswer as string | null}
                    />;
                case 'TRUE_FALSE':
                    return <TrueFalseQuestion 
                        key={questionId}
                        template={template as TrueFalseTemplateDto}
                        isPreview={true}
                        isSubmitted={true}
                        showLearnerEvaluation={true}
                        questionId={questionId}
                        initialAnswer={initialAnswer as boolean | null}
                    />;
                case 'FILL_IN_THE_BLANKS':
                    return <FillInTheBlanksQuestion 
                        key={questionId}
                        template={template as FillInTheBlanksTemplateDto}
                        isPreview={true}
                        isSubmitted={true}
                        showLearnerEvaluation={true}
                        questionId={questionId}
                        initialAnswer={initialAnswer as { [blankId: string]: string } | undefined}
                    />;
                case 'SHORT_ANSWER':
                    return <ShortAnswerQuestion 
                        key={questionId}
                        template={template as ShortAnswerTemplateDto}
                        isPreview={true}
                        isSubmitted={true}
                        questionId={questionId}
                        initialAnswer={initialAnswer as string || ''}
                    />;
                case 'ESSAY':
                    return <EssayQuestion 
                        key={questionId}
                        template={template as EssayTemplateDto}
                        isPreview={true}
                        isSubmitted={true}
                        questionId={questionId}
                        initialAnswer={initialAnswer as { text: string; wordCount: number; characterCount: number } | null}
                    />;
                case 'MULTIPLE_RESPONSE':
                    return <MultipleResponseQuestion 
                        key={questionId}
                        template={template as MultipleResponseTemplateDto}
                        isPreview={true}
                        isSubmitted={true}
                        showLearnerEvaluation={true}
                        questionId={questionId}
                        initialAnswer={initialAnswer as string[]}
                    />;
                case 'MATCHING':
                    return <MatchingQuestion 
                        key={questionId}
                        template={template as MatchingTemplateDto}
                        isPreview={true}
                        isSubmitted={true}
                        questionId={questionId}
                        initialAnswer={initialAnswer as { [leftId: string]: string } | undefined}
                    />;
                case 'ORDERING':
                    return <OrderingQuestion 
                        key={questionId}
                        template={template as OrderingTemplateDto}
                        isPreview={true}
                        isSubmitted={true}
                        questionId={questionId}
                        initialAnswer={initialAnswer as string[] | null | undefined}
                    />;
                case 'HOT_SPOT':
                    return <HotSpotQuestion 
                        key={questionId}
                        template={template as HotSpotTemplateDto}
                        isPreview={true}
                        isSubmitted={true}
                        questionId={questionId}
                        initialAnswer={initialAnswer as string[]}
                    />;
                case 'DRAG_AND_DROP':
                    return <DragAndDropQuestion 
                        key={questionId}
                        template={template as DragAndDropTemplateDto}
                        isPreview={true}
                        isSubmitted={true}
                        questionId={questionId}
                        initialAnswer={initialAnswer as { [zoneId: string]: string[] } | undefined}
                    />;
                case 'AUDIO_RESPONSE':
                    return <AudioResponseQuestion 
                        key={questionId}
                        template={template as AudioResponseTemplateDto}
                        isPreview={true}
                        isSubmitted={true}
                        questionId={questionId}
                        initialAnswer={(initialAnswer as unknown) as {
                            audioUrl?: string;
                            audioBlob?: Blob;
                            duration?: number;
                            recordedAt?: string;
                            fileName?: string;
                            uploadedFileData?: UploadedFileDto
                        } | null}
                    />;
                case 'VIDEO_RESPONSE':
                    return <VideoResponseQuestion 
                        key={questionId}
                        template={template as VideoResponseTemplateDto}
                        isPreview={true}
                        isSubmitted={true}
                        questionId={questionId}
                        initialAnswer={(initialAnswer as unknown) as {
                            videoUrl?: string;
                            videoBlob?: Blob;
                            duration?: number;
                            recordedAt?: string;
                            fileName?: string;
                            uploadedFileData?: UploadedFileDto
                        } | null}
                    />;
                case 'IMAGE_RESPONSE':
                    return <ImageResponseQuestion 
                        key={questionId}
                        template={template as ImageResponseTemplateDto}
                        isPreview={true}
                        isSubmitted={true}
                        questionId={questionId}
                        initialAnswer={(initialAnswer as unknown) as {
                            imageUrl?: string;
                            imageBlob?: Blob;
                            fileName?: string;
                            fileSize?: number;
                            uploadedAt?: string;
                            isDrawing?: boolean;
                            uploadedFileData?: UploadedFileDto
                        } | null}
                    />;
                default:
                    return <div className="p-4 bg-gray-50 rounded-lg">Soru tipi desteklenmiyor: {type}</div>;
            }
        };

        const renderAnswer = () => {
            if (selectedEvaluation) {
                const {mediaType, answer} = selectedEvaluation.evaluation;
                const API_URL = siteConfig.api.invokeUrl + "/upload/serve";
                switch (mediaType) {
                    case 'AUDIO':
                        return (
                            <div>
                                <Label>Ses Kaydı:</Label>
                                <audio controls className="w-full mt-2">
                                    <source src={`${API_URL}/${answer}`}/>
                                    Tarayıcınız ses öğesini desteklemiyor.
                                </audio>
                            </div>
                        );
                    case 'VIDEO':
                        return (
                            <div>
                                <Label>Video Kaydı:</Label>
                                <video controls className="w-full mt-2">
                                    <source src={`${API_URL}/${answer}`}/>
                                    Tarayıcınız video öğesini desteklemiyor.
                                </video>
                            </div>
                        );
                    case 'IMAGE':
                        return (
                            <div>
                                <Label>Görsel:</Label>
                                <img src={`${API_URL}/${answer}`} alt="Cevap görseli"
                                     className="w-full mt-2 rounded-lg"/>
                            </div>
                        );
                    case 'TEXT':
                        return (
                            <div>
                                <Label>Metin Cevabı:</Label>
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                                    {answer}
                                </div>
                            </div>
                        );
                    default:
                        return (
                            <div>
                                <Label>Cevap:</Label>
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                                    {answer}
                                </div>
                            </div>
                        );
                }
            }
        };

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Değerlendirme Detayı</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                        {/* Sol Kolon - Cevap ve Değerlendirme */}
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-lg mb-4">Aday Cevabı</h3>
                                {renderAnswer()}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="description">Açıklama:</Label>
                                    <textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full mt-2 p-3 border rounded-lg min-h-[120px]"
                                        placeholder="Değerlendirme açıklaması girin..."
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="score">Puan:</Label>
                                    <input
                                        id="score"
                                        type="number"
                                        value={score}
                                        onChange={(e) => setScore(Number(e.target.value))}
                                        className="w-full mt-2 p-3 border rounded-lg"
                                        placeholder="Puan girin..."
                                    />
                                </div>

                                {/* Butonlar - Puan bölümünün altında */}
                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        onClick={handleCancel}
                                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Kaydet
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sağ Kolon - Soru Bilgileri */}
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h3 className="font-semibold text-lg mb-4">Soru Bilgileri</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label className="font-semibold">Soru Metin:</Label>
                                    <div className="mt-2 p-3 bg-white rounded-lg border">
                                        {selectedEvaluation &&
                                        selectedEvaluation.question.questionType === 'SHORT_ANSWER' ?
                                            <div> {(selectedEvaluation.question.questionTemplate as ShortAnswerTemplateDto).question}</div> :
                                            selectedEvaluation && selectedEvaluation.question.questionType === 'ESSAY' ?
                                                <div>{(selectedEvaluation.question.questionTemplate as EssayTemplateDto).prompt}</div> :
                                                selectedEvaluation && selectedEvaluation.question.questionType === 'AUDIO_RESPONSE' ?
                                                    <div>{(selectedEvaluation.question.questionTemplate as AudioResponseTemplateDto).prompt}</div> :
                                                    selectedEvaluation && selectedEvaluation.question.questionType === 'VIDEO_RESPONSE' ?
                                                        <div> {(selectedEvaluation.question.questionTemplate as VideoResponseTemplateDto).prompt}</div> :
                                                        selectedEvaluation && selectedEvaluation.question.questionType === 'IMAGE_RESPONSE' ?
                                                            <div> {(selectedEvaluation.question.questionTemplate as ImageResponseTemplateDto).prompt}</div> :
                                                            <div></div>
                                        }
                                    </div>
                                </div>

                                <div>
                                    <Label className="font-semibold">Rubrik:</Label>
                                    <div className="mt-2 p-3 bg-white rounded-lg border">
                                        {selectedEvaluation &&
                                        selectedEvaluation.question.questionType === 'SHORT_ANSWER' ?
                                            <div> {(selectedEvaluation.question.questionTemplate as ShortAnswerTemplateDto).rubric}</div> :
                                            selectedEvaluation && selectedEvaluation.question.questionType === 'ESSAY' ?
                                                <div>{(selectedEvaluation.question.questionTemplate as EssayTemplateDto).rubric}</div> :
                                                selectedEvaluation && selectedEvaluation.question.questionType === 'AUDIO_RESPONSE' ?
                                                    <div>{(selectedEvaluation.question.questionTemplate as AudioResponseTemplateDto).rubric}</div> :
                                                    selectedEvaluation && selectedEvaluation.question.questionType === 'VIDEO_RESPONSE' ?
                                                        <div> {(selectedEvaluation.question.questionTemplate as VideoResponseTemplateDto).rubric}</div> :
                                                        selectedEvaluation && selectedEvaluation.question.questionType === 'IMAGE_RESPONSE' ?
                                                            <div> {(selectedEvaluation.question.questionTemplate as ImageResponseTemplateDto).rubric}</div> :
                                                            <div></div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Soru ve Öğrenci Cevabı - Alt Row */}
                    {selectedEvaluation && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="font-semibold text-lg mb-4">Soru ve Öğrenci Cevabı</h3>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                {renderQuestion()}
                            </div>
                        </div>
                    )}

                    {/* Önceki ve Sonraki Soru Butonları */}
                    {selectedEvaluation && filteredApplicationQuestionDataWithEvaluation && (
                        <div className="flex justify-between items-center gap-4 mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    const currentIndex = filteredApplicationQuestionDataWithEvaluation.findIndex(
                                        item => item.evaluation.id === selectedEvaluation.evaluation.id
                                    );
                                    if (currentIndex > 0) {
                                        setSelectedEvaluation(filteredApplicationQuestionDataWithEvaluation[currentIndex - 1]);
                                    }
                                }}
                                disabled={
                                    !filteredApplicationQuestionDataWithEvaluation ||
                                    filteredApplicationQuestionDataWithEvaluation.findIndex(
                                        item => item.evaluation.id === selectedEvaluation.evaluation.id
                                    ) === 0
                                }
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Önceki Soru
                            </button>
                            
                            <div className="text-sm text-gray-600">
                                {filteredApplicationQuestionDataWithEvaluation && selectedEvaluation && (
                                    <span>
                                        {filteredApplicationQuestionDataWithEvaluation.findIndex(
                                            item => item.evaluation.id === selectedEvaluation.evaluation.id
                                        ) + 1} / {filteredApplicationQuestionDataWithEvaluation.length}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    const currentIndex = filteredApplicationQuestionDataWithEvaluation.findIndex(
                                        item => item.evaluation.id === selectedEvaluation.evaluation.id
                                    );
                                    if (currentIndex < filteredApplicationQuestionDataWithEvaluation.length - 1) {
                                        setSelectedEvaluation(filteredApplicationQuestionDataWithEvaluation[currentIndex + 1]);
                                    }
                                }}
                                disabled={
                                    !filteredApplicationQuestionDataWithEvaluation ||
                                    filteredApplicationQuestionDataWithEvaluation.findIndex(
                                        item => item.evaluation.id === selectedEvaluation.evaluation.id
                                    ) === filteredApplicationQuestionDataWithEvaluation.length - 1
                                }
                                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                Sonraki Soru
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }


    useEffect(() => {
        if (applicationQuestionDataWithEvaluation) {
            if (filterType === 'ALL') {
                setFilteredApplicationQuestionDataWithEvaluation(applicationQuestionDataWithEvaluation.data);
            } else {
                const filteredData =
                    applicationQuestionDataWithEvaluation.data.filter(data => data.evaluation.evaluationStatus == filterType)
                setFilteredApplicationQuestionDataWithEvaluation(filteredData);
            }

        }
    }, [applicationQuestionDataWithEvaluation, filterType]);


    const EmptyCandidates = () => {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Değerlendirme</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center p-6 bg-gray-100">
                        <div className="border border-gray-300 rounded-2xl p-6 shadow-lg bg-white text-center">
                            Sınav uygulaması tamamlanmadan değerlendirme açılmamatadır.
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }


    const columns: Column<RecordType>[] = [

        {
            key: 'candidateName',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => {
                        setSelectedApplication((record as ApplicationDto).id)
                        setSelectedEvaluation(null)
                    }}
                >
                    {(record as ApplicationDto).candidateName} {(record as ApplicationDto).candidateLastName}
                </div>
            )
        }
        ,
        {
            key: 'examName',
            header: 'Sınav Adı',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => {
                        setSelectedApplication((record as ApplicationDto).id)
                        setSelectedEvaluation(null)
                    }}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'sessionState',
            header: 'Oturum Durumu',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => {
                        setSelectedApplication((record as ApplicationDto).id)
                        setSelectedEvaluation(null)
                    }}
                >
                    {value as string}

                </div>
            )
        }
        ,
        {
            key: 'startedAt',
            header:
                'Başlama',
            render:
                (value, record) => (
                    <div
                        className="font-medium cursor-pointer hover:text-blue-600"
                        onClick={() => {
                            setSelectedApplication((record as ApplicationDto).id)
                            setSelectedEvaluation(null)
                        }}
                    >
                        {statusConverter(value as EStatus)}
                    </div>
                )
        }

    ];


    const columnsEvaluation: Column<RecordType> [] = [

        {
            key: 'id',
            header: 'Soru',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => setSelectedEvaluation(record as EvaluationGroupData)}
                >
                    {((record as EvaluationGroupData).question as QuestionDto).name}
                </div>
            )
        },

        {
            key: 'id',
            header:
                'Durum',
            render:
                (value, record) => (
                    <div
                        className="font-medium cursor-pointer hover:text-blue-600"
                        onClick={() => setSelectedEvaluation(record as EvaluationGroupData)}
                    >
                        {((record as EvaluationGroupData).evaluation as EvaluationDto).evaluationStatus}
                    </div>
                )
        },

        {
            key: 'id',
            header:
                'Veri Tipi',
            render:
                (value, record) => (
                    <div
                        className="font-medium cursor-pointer hover:text-blue-600"
                        onClick={() => setSelectedEvaluation(record as EvaluationGroupData)}
                    >
                        {((record as EvaluationGroupData).evaluation as EvaluationDto).mediaType}
                    </div>
                )
        },
        {
            key: 'id',
            header:
                'PUAN',
            render:
                (value, record) => (
                    <div
                        className="font-medium cursor-pointer hover:text-blue-600"
                        onClick={() => setSelectedEvaluation(record as EvaluationGroupData)}
                    >
                        {((record as EvaluationGroupData).evaluation as EvaluationDto).score}
                    </div>
                )
        },


    ];
    return (
        <div className="grid grid-cols-1 gap-4 mb-8">
            {
                candidates && candidates.length > 0 ? <DynamicTable columns={columns} data={candidates}/> :
                    <EmptyCandidates/>
            }

            {selectedEvaluation ? <EvaluationDetail/> : <EvaluationPanel/>}

        </div>
    );
}
export default ExamEvaluationPanel;
