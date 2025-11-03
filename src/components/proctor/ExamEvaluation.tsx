import React, {useEffect, useState} from 'react';
import {ApplicationDto, QuestionId} from "@/types/management/brand";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Column, RecordType} from "@/types/ui/table";
import {statusConverter} from "@/utils/enum-converter";
import {EStatus} from "@/types/exam/enum";
import DynamicTable from "@/components/ui/dynamic-table";
import {useApplication} from "@/hooks/exam/use-application";
import {useQuestion} from "@/hooks/exam/use-question";
import {EvaluationDto, EvaluationGroup, EvaluationGroupData, QuestionDto} from "@/types/exam/examEntities";
import {EEvaluationStatus} from "@/types/auth";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {
    AudioResponseTemplateDto,
    EssayTemplateDto,
    ImageResponseTemplateDto,
    ShortAnswerTemplateDto,
    VideoResponseTemplateDto
} from "@/types/exam/questionTemplates";
import {useExamResult} from "@/hooks/exam/use-exam-result";
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
    const [filterType, setFilterType] = useState<EEvaluationStatus | 'ALL'>('PENDING');

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

            setFilterType('PENDING')

            setApplicationQuestionDataWithEvaluation(evaluationGroup);
        }
    }, [selectedApplication]);

    const EvaluationPanel = () => {
        return (
            <>
                {
                    filteredApplicationQuestionDataWithEvaluation && filteredApplicationQuestionDataWithEvaluation.length > 0 &&

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

                                    <SelectItem value={'NOT_STARTED'}>
                                        NOT_STARTED
                                    </SelectItem>
                                    <SelectItem value={'EVALUATED'}>
                                        EVALUATED
                                    </SelectItem>
                                    <SelectItem value={'PENDING'}>
                                        PENDING
                                    </SelectItem>
                                    <SelectItem value={'CANCELLED'}>
                                        CANCELLED
                                    </SelectItem>
                                    <SelectItem value={'FINISHED'}>
                                        FINISHED
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

                    {/* Butonlar */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Kaydet
                        </button>
                    </div>
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
