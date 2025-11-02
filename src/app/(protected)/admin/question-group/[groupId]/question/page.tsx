'use client';
import {Column, RecordType} from "@/types/ui/table";
import React, {useEffect, useState} from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useParams, useRouter} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import Link from "next/link";
import {useQuestionGroup} from "@/hooks/exam/use-question-group";
import {QuestionDto, QuestionTemplateType} from "@/types/exam/examEntities";
import {useQuestion} from "@/hooks/exam/use-question";
import {EMediaType, EQuestionType} from "@/types/exam/enum";
import {
    AudioResponseTemplateDto,
    DragAndDropTemplateDto,
    EssayTemplateDto,
    FillInTheBlanksTemplateDto, HotSpotTemplateDto, ImageResponseTemplateDto, MatchingTemplateDto,
    MultipleChoiceTemplateDto, MultipleResponseTemplateDto, OrderingTemplateDto, ShortAnswerTemplateDto,
    TrueFalseTemplateDto, VideoResponseTemplateDto
} from "@/types/exam/questionTemplates";
import MultipleChoiceQuestion from "@/components/template/MultipleChoiceQuestion";
import TrueFalseQuestion from "@/components/template/TrueFalseQuestion";
import FillInTheBlanksQuestion from "@/components/template/FillInTheBlanksQuestion";
import ShortAnswerQuestion from "@/components/template/ShortAnswerQuestion";
import EssayQuestion from "@/components/template/EssayQuestion";
import MatchingQuestion from "@/components/template/MatchingQuestion";
import ImageResponseQuestion from "@/components/template/ImageResponseQuestion";
import VideoResponseQuestion from "@/components/template/VideoResponseQuestion";
import AudioResponseQuestion from "@/components/template/AudioResponseQuestion";
import DragAndDropQuestion from "@/components/template/DragAndDropQuestion";
import HotSpotQuestion from "@/components/template/HotSpotQuestion";
import MultipleResponseQuestion from "@/components/template/MultipleResponseQuestion";
import OrderingQuestion from "@/components/template/OrderingQuestion";
import Checkbox from "@/components/ui/checkbox";
import FilePreview from "@/components/ui/file-preview";

export default function QuestionPage() {
    const router = useRouter();
    const params = useParams();
    const groupId = params.groupId as string;
    const {
        selectedQuestionGroup,
        getQuestionGroupById,
    } = useQuestionGroup();

    const {
        questionsByGroup,
        getQuestionsByGroup,
        loading
    } = useQuestion();

    useEffect(() => {
        getQuestionGroupById(groupId);
        getQuestionsByGroup(groupId)
    }, []);


    const [selectedQuestionForPreview, setSelectedQuestionForPreview] = useState<string | null>(null);


    const columns: Column<RecordType>[] = [
        {
            key: 'id',
            header: ' ',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => {
                        if (selectedQuestionForPreview == value as string) {
                            setSelectedQuestionForPreview(null)
                        } else {
                            setSelectedQuestionForPreview(value as string)
                        }
                    }}
                >
                    <Checkbox checked={selectedQuestionForPreview == value as string}/>
                </div>
            )
        },
        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${groupId}/question/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'orderNumber',
            header: 'Sıra',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${groupId}/question/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'approvalStatus',
            header: 'Durum',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${groupId}/question/${record.id}`)}
                >
                    {(record as QuestionDto).currentApprovalCount} / {(record as QuestionDto).requiredApprovalCount} {value as string}
                </div>
            )
        }
        ,
        {
            key: 'approvalCompletedDate',
            header: 'Bölüm',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${groupId}/question/${record.id}`)}
                >
                    {(record as QuestionDto).questionGroup?.name}
                </div>
            )
        },
        {
            key: 'Grup',
            header: 'Grup',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${groupId}/question/${record.id}`)}
                >
                    {(record as QuestionDto).questionType}
                </div>
            )
        },
        {
            key: 'id',
            header: ' ',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    <Link href={`/admin/question-group/${groupId}/question/${value}`}>Düzenle</Link>
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push(`/admin/question-group/${groupId}/question/add`);
    };

    const renderTemplateSpecificForm = (type: EQuestionType, template: QuestionTemplateType) => {
        switch (type) {
            case 'MULTIPLE_CHOICE':
                return <MultipleChoiceQuestion template={template as MultipleChoiceTemplateDto} questionId={''}/>;

            case 'TRUE_FALSE':
                return <TrueFalseQuestion template={template as TrueFalseTemplateDto} questionId={''}/>;
            case 'FILL_IN_THE_BLANKS':
                return <FillInTheBlanksQuestion template={template as FillInTheBlanksTemplateDto} questionId={''}/>;
            case 'SHORT_ANSWER':
                return <ShortAnswerQuestion template={template as ShortAnswerTemplateDto} questionId={''}/>;
            case 'ESSAY':
                return <EssayQuestion template={template as EssayTemplateDto} questionId={''}/>;
            case 'MATCHING':
                return <MatchingQuestion template={template as MatchingTemplateDto} questionId={''}/>;
            case 'ORDERING':
                return <OrderingQuestion template={template as OrderingTemplateDto} questionId={''}/>;
            case 'MULTIPLE_RESPONSE':
                return <MultipleResponseQuestion template={template as MultipleResponseTemplateDto} questionId={''}/>;
            case 'HOT_SPOT':
                return <HotSpotQuestion template={template as HotSpotTemplateDto} questionId={''}/>;
            case 'DRAG_AND_DROP':
                return <DragAndDropQuestion template={template as DragAndDropTemplateDto} questionId={''}/>;
            case 'AUDIO_RESPONSE':
                return <AudioResponseQuestion template={template as AudioResponseTemplateDto} questionId={''}/>;
            case 'VIDEO_RESPONSE':
                return <VideoResponseQuestion template={template as VideoResponseTemplateDto} questionId={''}/>;
            case 'IMAGE_RESPONSE':
                return <ImageResponseQuestion template={template as ImageResponseTemplateDto} questionId={''}/>;
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

    if (loading) {
        return (
            <LoadingComp/>
        );
    }
    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                    addButtonText="Yeni Soru Ekle"
                />
            }/>
            <div className="p-6 pt-1">
                {
                    questionsByGroup &&
                    <DynamicTable searchable={false} columns={columns} data={questionsByGroup}/>
                }

                <div className="pt-4">

                    <hr/>
                    {
                        selectedQuestionGroup?.headers?.map((header, key) => (

                            header.mediaType === EMediaType.TEXT ?
                                <div key={key}>{header.content}</div> :


                                <div  key={key} className="flex justify-center">
                                    <FilePreview size={"medium"} fileUrl={header.content || ''} alt="Logo" />
                                </div>



                        ))
                    }




                    {
                        questionsByGroup.map((question, key) => (
                            question.questionType && question.questionTemplate && (selectedQuestionForPreview === null || selectedQuestionForPreview === question.id) &&
                            <div key={key}
                                 className="p-4 border-b">  {renderTemplateSpecificForm(question.questionType, question.questionTemplate)} </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}