'use client';

import {useParams} from "next/navigation";
import React, {useState} from "react";
import {useGetQuestionGroupById, useGetQuestionGroupApprovals, useUpdateApproval} from "@/api/generated/question-group-management/question-group-management";
import PageHeader from "@/components/layout/page-header";
import LoadingComp from "@/components/ui/loading-comp";
import {useQueryClient} from "@tanstack/react-query";
import type {QuestionDto} from '@/api/generated/model/questionDto';
import type {QuestionTemplateType} from "@/types/exam/questionTemplateTypes";
import {EQuestionType, EMediaType, EApprovalStatus} from '@/types/exam/enum';
import {getQuestionTypeLabel} from '@/utils/question-type-convert';
import ModalPanel from "@/components/ui/ModalPanel";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {showNotification, getErrorMessage} from "@/lib/notification";
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
} from '@/api/generated/model';
import MultipleChoiceQuestion from '@/components/template/MultipleChoiceQuestion';
import TrueFalseQuestion from '@/components/template/TrueFalseQuestion';
import FillInTheBlanksQuestion from '@/components/template/FillInTheBlanksQuestion';
import ShortAnswerQuestion from '@/components/template/ShortAnswerQuestion';
import EssayQuestion from '@/components/template/EssayQuestion';
import MatchingQuestion from '@/components/template/MatchingQuestion';
import ImageResponseQuestion from '@/components/template/ImageResponseQuestion';
import VideoResponseQuestion from '@/components/template/VideoResponseQuestion';
import AudioResponseQuestion from '@/components/template/AudioResponseQuestion';
import DragAndDropQuestion from '@/components/template/DragAndDropQuestion';
import HotSpotQuestion from '@/components/template/HotSpotQuestion';
import MultipleResponseQuestion from '@/components/template/MultipleResponseQuestion';
import OrderingQuestion from '@/components/template/OrderingQuestion';
import FilePreview from '@/components/ui/file-preview';
import {approvalStatusConverter} from "@/utils/enum-converter";
import {formatDate} from "@/utils/date-formater";
import type {QuestionGroupApprovalResponse, ApprovalStatusRequest, QuestionGroupDto} from "@/api/generated/model";

export default function ApprovalPreviewPage() {
    const params = useParams();
    const groupId = params.id as string;
    const queryClient = useQueryClient();
    
    const {data: questionGroupData, isLoading: loading} = useGetQuestionGroupById(groupId, {
        query: { enabled: !!groupId }
    });
    const selectedQuestionGroup = (questionGroupData as { data?: QuestionGroupDto })?.data;
    
    const {data: approvalsData} = useGetQuestionGroupApprovals(groupId, {
        query: { enabled: !!groupId }
    });
    const questionGroupApprovals = (approvalsData as { data?: QuestionGroupApprovalResponse[] })?.data || [];
    
    const updateApprovalMutation = useUpdateApproval();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedApproval, setSelectedApproval] = useState<QuestionGroupApprovalResponse | null>(null);
    const [approvalStatus, setApprovalStatus] = useState<EApprovalStatus | ''>('');
    const [comment, setComment] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleButtonClick = (approval: QuestionGroupApprovalResponse) => {
        setSelectedApproval(approval);
        setApprovalStatus((approval.approvalStatus as EApprovalStatus) || EApprovalStatus.PENDING);
        setComment(approval.comment || '');
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!selectedApproval?.objectApprovalId || !approvalStatus) {
            showNotification.error('Lütfen onay durumunu seçin!');
            return;
        }

        try {
            setIsSaving(true);
            const updateRequest: ApprovalStatusRequest = {
                approvalStatus: approvalStatus as EApprovalStatus,
                comment: comment || undefined,
                questionGroupId: groupId
            } as ApprovalStatusRequest;

            await updateApprovalMutation.mutateAsync({
                approvalId: selectedApproval.objectApprovalId,
                data: updateRequest
            });
            
            showNotification.success('Onay başarıyla güncellendi!');
            setIsModalOpen(false);
            // Verileri yeniden yükle
            queryClient.invalidateQueries({ queryKey: [`/question-groups/${groupId}/approvals`] });
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            showNotification.error(errorMessage || 'Onay güncellenirken bir hata oluştu!');
            console.error('Error updating approval:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedApproval(null);
        setApprovalStatus('');
        setComment('');
    };


    const formatDuration = (seconds?: number) => {
        if (!seconds) return 'Belirtilmedi';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        let result = '';
        if (hours > 0) result += `${hours} saat `;
        if (minutes > 0) result += `${minutes} dakika `;
        if (remainingSeconds > 0) result += `${remainingSeconds} saniye`;

        return result.trim() || '0 saniye';
    };

    const renderQuestionTemplate = (question: QuestionDto) => {
        if (!question.questionType || !question.questionTemplate) {
            return (
                <div className="text-gray-500 text-sm p-4 bg-gray-50 rounded">
                    Soru şablonu bulunamadı
                </div>
            );
        }

        const type = question.questionType as EQuestionType;
        const template = question.questionTemplate as QuestionTemplateType;

        switch (type) {
            case 'MULTIPLE_CHOICE':
                return (
                    <MultipleChoiceQuestion
                        template={template as MultipleChoiceTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'TRUE_FALSE':
                return (
                    <TrueFalseQuestion
                        template={template as TrueFalseTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'FILL_IN_THE_BLANKS':
                return (
                    <FillInTheBlanksQuestion
                        template={template as FillInTheBlanksTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'SHORT_ANSWER':
                return (
                    <ShortAnswerQuestion
                        template={template as ShortAnswerTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'ESSAY':
                return (
                    <EssayQuestion
                        template={template as EssayTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'MATCHING':
                return (
                    <MatchingQuestion
                        template={template as MatchingTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'ORDERING':
                return (
                    <OrderingQuestion
                        template={template as OrderingTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'MULTIPLE_RESPONSE':
                return (
                    <MultipleResponseQuestion
                        template={template as MultipleResponseTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'HOT_SPOT':
                return (
                    <HotSpotQuestion
                        template={template as HotSpotTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'DRAG_AND_DROP':
                return (
                    <DragAndDropQuestion
                        template={template as DragAndDropTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'AUDIO_RESPONSE':
                return (
                    <AudioResponseQuestion
                        template={template as AudioResponseTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'VIDEO_RESPONSE':
                return (
                    <VideoResponseQuestion
                        template={template as VideoResponseTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            case 'IMAGE_RESPONSE':
                return (
                    <ImageResponseQuestion
                        template={template as ImageResponseTemplateDto}
                        questionId={question.id || ''}
                        isPreview={true}
                        isSubmitted={true}
                        showCorrectAnswer={true}
                    />
                );
            default:
                return (
                    <div className="text-gray-500 text-sm p-4 bg-gray-50 rounded">
                        Desteklenmeyen soru tipi: {getQuestionTypeLabel(type)}
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <LoadingComp/>
        );
    }

    if (!selectedQuestionGroup) {
        return (
            <div className="space-y-6">
                <PageHeader/>
                <div className="p-6">
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg">Soru grubu bulunamadı.</p>
                    </div>
                </div>
            </div>
        );
    }

    const sortedQuestions = [...(selectedQuestionGroup.questions || [])] as QuestionDto[];
    sortedQuestions.sort((a, b) => {
        return (a.orderNumber ?? 0) - (b.orderNumber ?? 0);
    });

    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-6 pt-0">
       

                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    {/* Question Group Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {selectedQuestionGroup.name || 'Soru Grubu'}
                                        </h2>
                                        {selectedQuestionGroup.examSection && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                Bölüm: {selectedQuestionGroup.examSection.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="ml-12 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mt-3">
                                    <div>
                                        <span className="text-gray-500">Maksimum Puan:</span>
                                        <span className="ml-2 font-medium">{selectedQuestionGroup.maximumScore || 'Belirtilmedi'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Süre:</span>
                                        <span className="ml-2 font-medium">{formatDuration(selectedQuestionGroup.durationInSeconds)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Soru Sayısı:</span>
                                        <span className="ml-2 font-medium">{sortedQuestions.length}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Onay Durumu:</span>
                                        <span className="ml-2 font-medium">
                                            {approvalStatusConverter(selectedQuestionGroup.approvalStatus)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Question Group Approval Row */}
                    {(() => {
                        // QuestionGroup için approval'ları filtrele ve createdAt'e göre sırala
                        const groupApprovals = (questionGroupApprovals || [])
                            .filter((approval: QuestionGroupApprovalResponse) => 
                                approval.objectType === 'QUESTION_GROUP' && approval.objectId === selectedQuestionGroup.id
                            )
                            .sort((a, b) => {
                                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                                return dateA - dateB;
                            });

                        if (groupApprovals.length === 0) return null;

                        return (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mx-6 mt-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {groupApprovals.map((approval, index) => {
                                            const isDisabled = approval.approvalStatus !== EApprovalStatus.PENDING;

                                            return (
                                                <button
                                                    key={approval.objectApprovalId || index}
                                                    disabled={isDisabled}
                                                    onClick={() => handleButtonClick(approval)}
                                                    className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                                                        isDisabled
                                                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                                    }`}
                                                >
                                                    {index + 1}. ONAY - {approval.approvalStatus || 'PENDING'}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        {selectedQuestionGroup.approvalStatus && (
                                            <div>
                                                <span className="text-gray-500">Durum: </span>
                                                <span className="font-medium">
                                                    {approvalStatusConverter(selectedQuestionGroup.approvalStatus)}
                                                </span>
                                            </div>
                                        )}
                                        {selectedQuestionGroup.approvalCompletedDate && (
                                            <div>
                                                <span className="text-gray-500">Tamamlanma: </span>
                                                <span className="font-medium">
                                                    {formatDate(selectedQuestionGroup.approvalCompletedDate, 'dateTime')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Question Group Headers */}
                    {selectedQuestionGroup.headers && selectedQuestionGroup.headers.length > 0 && (
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            {selectedQuestionGroup.headers.map((header, headerIndex) => (
                                <div key={header.id || headerIndex} className="mb-2 last:mb-0">
                                    {header.mediaType === EMediaType.TEXT ? (
                                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: header.content || '' }} />
                                    ) : (
                                        <div className="flex justify-center">
                                            <FilePreview size="medium" fileUrl={header.content || ''} alt="Header" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Questions */}
                    <div className="p-6 space-y-6">
                        {sortedQuestions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>Bu soru grubunda henüz soru bulunmamaktadır.</p>
                            </div>
                        ) : (
                            sortedQuestions.map((question: QuestionDto, questionIndex: number) => {

                                // Bu soruya ait approval'ları filtrele ve createdAt'e göre sırala
                                const questionApprovals = (questionGroupApprovals || [])
                                    .filter((approval: QuestionGroupApprovalResponse) => approval.objectId === question.id)
                                    .sort((a, b) => {
                                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                                        return dateA - dateB;
                                    });
                                
                                return (
                                <div key={question.id || questionIndex} className="space-y-4">
                                    {/* Approval Row */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {questionApprovals.map((approval, index) => {
                                                    const isDisabled = approval.approvalStatus !== EApprovalStatus.PENDING ;

                                                    return (
                                                        <button
                                                            key={approval.objectApprovalId || index}
                                                            disabled={isDisabled}
                                                            onClick={() => handleButtonClick(approval)}
                                                            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                                                                isDisabled
                                                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                                            }`}
                                                        >
                                                            { index + 1}. ONAY - {approval.approvalStatus || 'PENDING'}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                {question.approvalStatus && (
                                                    <div>
                                                        <span className="text-gray-500">Durum: </span>
                                                        <span className="font-medium">
                                                            {approvalStatusConverter(question.approvalStatus)}
                                                        </span>
                                                    </div>
                                                )}
                                                {question.approvalCompletedDate && (
                                                    <div>
                                                        <span className="text-gray-500">Tamamlanma: </span>
                                                        <span className="font-medium">
                                                            {formatDate(question.approvalCompletedDate, 'dateTime')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Question Card */}
                                    <div className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                                        {/* Question Header */}
                                    <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">
                                                {question.orderNumber || questionIndex + 1}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {question.name || `Soru ${questionIndex + 1}`}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {getQuestionTypeLabel(question.questionType as EQuestionType)}
                                                </div>
                                                {question.approvalStatus && (
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        Onay Durumu: {approvalStatusConverter(question.approvalStatus)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm">
                                                <span className="text-gray-500">Puan:</span>
                                                <span className="ml-1 font-medium">{question.maximumScore || 'Belirtilmedi'}</span>
                                            </div>
                                            {question.durationInSeconds && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {formatDuration(question.durationInSeconds)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                        {/* Question Template */}
                                        <div className="mt-4">
                                            {renderQuestionTemplate(question)}
                                        </div>
                                    </div>
                                </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Approval Update Modal */}
            <ModalPanel
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Onay Durumu Güncelle"
                confirmText="Kaydet"
                cancelText="İptal"
                onConfirm={handleSave}
                onCancel={handleCloseModal}
                size="medium"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Onay Durumu
                        </label>
                        <Select
                            value={approvalStatus}
                            onValueChange={(value) => setApprovalStatus(value as EApprovalStatus)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Onay durumu seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={EApprovalStatus.PENDING}>
                                    {approvalStatusConverter(EApprovalStatus.PENDING)}
                                </SelectItem>
                                <SelectItem value={EApprovalStatus.APPROVED}>
                                    {approvalStatusConverter(EApprovalStatus.APPROVED)}
                                </SelectItem>
                                <SelectItem value={EApprovalStatus.REJECTED}>
                                    {approvalStatusConverter(EApprovalStatus.REJECTED)}
                                </SelectItem>
                                <SelectItem value={EApprovalStatus.CANCELLED}>
                                    {approvalStatusConverter(EApprovalStatus.CANCELLED)}
                                </SelectItem>
                                <SelectItem value={EApprovalStatus.EXPIRED}>
                                    {approvalStatusConverter(EApprovalStatus.EXPIRED)}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Yorum
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            placeholder="Yorum yazın (opsiyonel)"
                        />
                    </div>

                    {isSaving && (
                        <div className="text-sm text-gray-500 text-center">
                            Kaydediliyor...
                        </div>
                    )}
                </div>
            </ModalPanel>
        </div>
    );
}

