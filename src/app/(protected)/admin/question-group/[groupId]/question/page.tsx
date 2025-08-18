'use client';
import {Column, RecordType} from "@/types/ui/table";
import React, {useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useParams, useRouter} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import Link from "next/link";
import {useQuestionGroup} from "@/hooks/exam/use-question-group";
import {QuestionDto, QuestionTemplateType} from "@/types/exam/examEntities";
import {useQuestion} from "@/hooks/exam/use-question";
import {EQuestionType} from "@/types/exam/enum";
import {
    FillInTheBlanksTemplateDto,
    MultipleChoiceTemplateDto,
    TrueFalseTemplateDto
} from "@/types/exam/questionTemplates";
import MultipleChoiceQuestion from "@/components/template/MultipleChoiceQuestion";
import TrueFalseQuestion from "@/components/template/TrueFalseQuestion";
import FillInTheBlanksQuestion from "@/components/template/FillInTheBlanksQuestion";

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


    console.log(selectedQuestionGroup)

    const columns: Column<RecordType>[] = [

        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }
        ,

        {
            key: 'orderNumber',
            header: 'Sıra',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        }


        ,
        {
            key: 'approvalStatus',
            header: 'Durum',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
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
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {(record as QuestionDto).questionGroup?.name}
                </div>
            )
        }
        ,
        {
            key: 'Grup',
            header: 'Grup',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
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
                    <Link href={`/admin/question-group/${value}/question`}>Düzenle</Link>
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push('/admin/question-group/${value}/question/add');
    };


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
                    <DynamicTable columns={columns} data={questionsByGroup}/>
                }

                <div className="pt-4">
                    <h3>SORU:</h3>
                    <hr/>
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
        </div>
    );
}