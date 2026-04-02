'use client';

import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle, useCallback} from 'react';
import {Alert, AlertDescription} from "@/components/ui/alert";
import {
    MultipleChoiceTemplateDto,
    TrueFalseTemplateDto,
    FillInTheBlanksTemplateDto,
    ShortAnswerTemplateDto,
    EssayTemplateDto,
    MatchingTemplateDto,
    OrderingTemplateDto,
    MultipleResponseTemplateDto,
    HotSpotTemplateDto,
    DragAndDropTemplateDto,
    AudioResponseTemplateDto,
    VideoResponseTemplateDto,
    ImageResponseTemplateDto
} from "@/api/generated/model";

// Import template form components
import MultipleChoiceTemplateForm, {MultipleChoiceTemplateFormHandle} from './MultipleChoiceTemplateForm';
import TrueFalseTemplateForm, {TrueFalseTemplateFormHandle} from './TrueFalseTemplateForm';
import FillInTheBlanksTemplateForm, {FillInTheBlanksTemplateFormHandle} from './FillInTheBlanksTemplateForm';
import ShortAnswerTemplateForm, {ShortAnswerTemplateFormHandle} from './ShortAnswerTemplateForm';
import EssayTemplateForm, {EssayTemplateFormHandle} from './EssayTemplateForm';
import MatchingTemplateForm, {MatchingTemplateFormHandle} from './MatchingTemplateForm';
import {EQuestionType} from "@/types/exam/enum";
import OrderingTemplateForm, {OrderingTemplateFormHandle} from "@/components/form/template/OrderingTemplateForm";
import MultipleResponseTemplateForm, {
    MultipleResponseTemplateFormHandle
} from "@/components/form/template/MultipleResponseTemplateForm";
import HotSpotTemplateForm, {HotSpotTemplateFormHandle} from "@/components/form/template/HotSpotTemplateForm";
import DragAndDropTemplateForm, {
    DragAndDropTemplateFormHandle
} from "@/components/form/template/DragAndDropTemplateForm";
import AudioResponseTemplateForm, {
    AudioResponseTemplateFormHandle
} from "@/components/form/template/AudioResponseTemplateForm";
import ImageResponseTemplateForm, {
    ImageResponseTemplateFormHandle
} from "@/components/form/template/ImageResponseTemplateForm";
import VideoResponseTemplateForm, {
    VideoResponseTemplateFormHandle
} from "@/components/form/template/VideoResponseTemplateForm";
import type {BaseQuestionTemplateFormData} from "@/components/form/QuestionForm";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import HtmlEditor from "@/components/ui/html-editor";

const STEM_QUESTION_TYPES: EQuestionType[] = [
    EQuestionType.ESSAY,
    EQuestionType.AUDIO_RESPONSE,
    EQuestionType.VIDEO_RESPONSE,
    EQuestionType.IMAGE_RESPONSE,
];

function hasStemText(description: string | undefined, instructions: string | undefined): boolean {
    const d = (description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const i = (instructions || '').trim();
    return d.length > 0 || i.length > 0;
}

interface BaseQuestionTemplateFormErrors {
    title?: string;
    subject?: string;
    difficulty?: string;
    points?: string;
    timeLimit?: string;
    questionType?: string;
    description?: string;
}

// Validation handle interface for parent
export interface BaseQuestionTemplateFormHandle {
    validate: () => boolean;
    getErrors: () => BaseQuestionTemplateFormErrors;
}

interface BaseQuestionTemplateFormProps {
    value: BaseQuestionTemplateFormData;
    onChange: (data: BaseQuestionTemplateFormData) => void;
    questionType: EQuestionType;
    loading?: boolean;
}


const BaseQuestionTemplateForm = forwardRef<BaseQuestionTemplateFormHandle, BaseQuestionTemplateFormProps>(({
                                                                                                                value,
                                                                                                                onChange,
                                                                                                                questionType,
                                                                                                                loading = false
                                                                                                            }, ref) => {

    const [formData, setFormData] = useState<BaseQuestionTemplateFormData>(value);
    const [errors, setErrors] = useState<BaseQuestionTemplateFormErrors>({});

    // Template validation ref - her template'in validate fonksiyonunu tutar
    // Union type: Tüm template handle'ları
    type TemplateFormHandle = MultipleResponseTemplateFormHandle |
        MatchingTemplateFormHandle |
        HotSpotTemplateFormHandle |
        FillInTheBlanksTemplateFormHandle |
        AudioResponseTemplateFormHandle |
        DragAndDropTemplateFormHandle |
        EssayTemplateFormHandle |
        ImageResponseTemplateFormHandle |
        VideoResponseTemplateFormHandle;
    const templateValidateRef = useRef<TemplateFormHandle>(null);

    // Value prop'u değiştiğinde form data'yı güncelle
    useEffect(() => {
        setFormData(value);
    }, [value]);

    // QuestionType değiştiğinde template data'yı sıfırla
    useEffect(() => {
        if (questionType !== formData.questionType) {
            setFormData(prev => ({
                ...prev,
                questionType: questionType,
                templateData: null // Yeni template tipi seçildiğinde eski data'yı temizle
            }));
        }
    }, [questionType]);


    const lastSentRef = useRef<BaseQuestionTemplateFormData>(value);
    // Form data değiştiğinde parent'a bildir
    useEffect(() => {
        if (JSON.stringify(formData) !== JSON.stringify(lastSentRef.current)) {
            lastSentRef.current = formData;
            onChange(formData);
        }
    }, [formData]);


    const handleTemplateDataChange = useCallback((templateData: MultipleChoiceTemplateDto | TrueFalseTemplateDto |
        FillInTheBlanksTemplateDto | ShortAnswerTemplateDto |
        MatchingTemplateDto | EssayTemplateDto | OrderingTemplateDto | MultipleResponseTemplateDto |
        HotSpotTemplateDto | DragAndDropTemplateDto | AudioResponseTemplateDto | VideoResponseTemplateDto | ImageResponseTemplateDto) => {
        setFormData(prev => {
            // ÖNEMLİ: Mevcut templateData'daki base field'ları koru (id, title, description, vb.)
            // Sadece template-specific field'ları merge et
            const mergedTemplateData = prev.templateData ? {
                ...prev.templateData, // Mevcut base field'ları koru (id, title, description, subject, difficulty, points, timeLimit, instructions, tags, isActive, vb.)
                ...templateData // Template-specific field'ları override et (question, options, correctOptionIndex, vb.)
            } : templateData;
            
            return {
                ...prev,
                templateData: mergedTemplateData
            };
        });
    }, []);



    // Base form validation
    const validateBaseForm = (): boolean => {
        const newErrors: BaseQuestionTemplateFormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Başlık zorunludur';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Konu zorunludur';
        }

        if (!formData.difficulty) {
            newErrors.difficulty = 'Zorluk seviyesi seçilmelidir';
        }

        if (!formData.points || formData.points < 1) {
            newErrors.points = 'Geçerli bir puan giriniz';
        }

        if (!formData.timeLimit || formData.timeLimit < 1) {
            newErrors.timeLimit = 'Geçerli bir süre sınırı giriniz';
        }

        if (!formData.questionType) {
            newErrors.questionType = 'Soru tipi seçilmelidir';
        }

        if (STEM_QUESTION_TYPES.includes(questionType) &&
            !hasStemText(formData.description, formData.instructions)) {
            newErrors.description = 'Soru metni (açıklama) veya talimatlar zorunludur';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Tüm form validation (base + template)
    const validateAll = (): boolean => {
        const baseValid = validateBaseForm();
        const templateValid = templateValidateRef.current?.validate() ?? true;

        const isValid = baseValid && templateValid;

        return isValid;
    };

    // Parent component bu fonksiyonu çağırabilir
    useImperativeHandle(ref, () => ({
        validate: validateAll,
        getErrors: () => errors
    }));


    // Template-specific form render
    const renderTemplateSpecificForm = () => {
        switch (formData.questionType) {
            case 'MULTIPLE_CHOICE':
                return (
                    <MultipleChoiceTemplateForm
                        ref={templateValidateRef as React.Ref<MultipleChoiceTemplateFormHandle>}
                        value={formData.templateData as MultipleChoiceTemplateDto}
                        onChange={handleTemplateDataChange}
                        loading={loading}
                    />
                );
            case 'TRUE_FALSE':
                return (
                    <TrueFalseTemplateForm
                        ref={templateValidateRef as React.Ref<TrueFalseTemplateFormHandle>}
                        value={formData.templateData as TrueFalseTemplateDto}
                        onChange={handleTemplateDataChange}
                        loading={loading}
                    />
                );
            case 'FILL_IN_THE_BLANKS':
                return (
                    <FillInTheBlanksTemplateForm
                        ref={templateValidateRef as React.Ref<FillInTheBlanksTemplateFormHandle>}
                        value={formData.templateData as FillInTheBlanksTemplateDto}
                        onChange={handleTemplateDataChange}
                        loading={loading}
                    />
                );
            case 'SHORT_ANSWER':
                return (
                    <ShortAnswerTemplateForm
                        ref={templateValidateRef as React.Ref<ShortAnswerTemplateFormHandle>}
                        value={formData.templateData as ShortAnswerTemplateDto}
                        onChange={handleTemplateDataChange}
                        loading={loading}
                    />
                );
            case 'ESSAY':
                return (
                    <EssayTemplateForm
                        ref={templateValidateRef as React.Ref<EssayTemplateFormHandle>}
                        value={formData.templateData as EssayTemplateDto}
                        onChange={handleTemplateDataChange}
                        loading={loading}
                    />
                );
            case 'MATCHING':
                return (
                    <MatchingTemplateForm
                        ref={templateValidateRef as React.Ref<MatchingTemplateFormHandle>}
                        value={formData.templateData as MatchingTemplateDto}
                        onChange={handleTemplateDataChange}
                        loading={loading}
                    />
                );
            case 'ORDERING':
                return (
                    <OrderingTemplateForm
                        ref={templateValidateRef as React.Ref<OrderingTemplateFormHandle>}
                        value={formData.templateData as OrderingTemplateDto}
                        onChange={handleTemplateDataChange}
                        loading={loading}
                    />
                );
            case 'MULTIPLE_RESPONSE':
                return (
                    <MultipleResponseTemplateForm
                        ref={templateValidateRef as React.Ref<MultipleResponseTemplateFormHandle>}
                        value={formData.templateData as MultipleResponseTemplateDto}
                        onChange={handleTemplateDataChange}
                        loading={loading}
                    />
                );
            case 'HOT_SPOT':
                return (
                    <HotSpotTemplateForm
                        ref={templateValidateRef as React.Ref<HotSpotTemplateFormHandle>}
                        value={formData.templateData as HotSpotTemplateDto}
                        onChange={handleTemplateDataChange}
                        loading={loading}
                    />
                );
            case 'DRAG_AND_DROP':
                return (
                    <DragAndDropTemplateForm
                        ref={templateValidateRef as React.Ref<DragAndDropTemplateFormHandle>}
                        value={formData.templateData as DragAndDropTemplateDto}
                        onChange={handleTemplateDataChange}
                        loading={loading}
                    />
                );
            case 'AUDIO_RESPONSE':
                return (
                    <AudioResponseTemplateForm
                        ref={templateValidateRef as React.Ref<AudioResponseTemplateFormHandle>}
                        value={formData.templateData as AudioResponseTemplateDto}
                        onChange={handleTemplateDataChange}
                        loading={loading}
                    />
                );
            case 'VIDEO_RESPONSE':
                return (
                    <VideoResponseTemplateForm
                        ref={templateValidateRef as React.Ref<VideoResponseTemplateFormHandle>}
                        value={formData.templateData as VideoResponseTemplateDto}
                        onChange={handleTemplateDataChange}
                        loading={loading}
                    />
                );
            case 'IMAGE_RESPONSE':
                return (
                    <ImageResponseTemplateForm
                        ref={templateValidateRef as React.Ref<ImageResponseTemplateFormHandle>}
                        value={formData.templateData as ImageResponseTemplateDto}
                        onChange={handleTemplateDataChange}
                        loading={loading}
                    />
                );
            default:
                return (
                    <Alert>
                        <AlertDescription>
                            Lütfen bir soru tipi seçiniz
                        </AlertDescription>
                    </Alert>
                );
        }
    };

    return (
        <div>
            <div className="space-y-0">
                {STEM_QUESTION_TYPES.includes(questionType) && (
                    <div className="space-y-4 mb-6">
                        <div className="space-y-2">
                            <Label htmlFor="template-description">Soru metni (açıklama) *</Label>
                            <HtmlEditor
                                id="template-description"
                                value={formData.description || ''}
                                onChange={(html) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        description: html,
                                    }))
                                }
                                error={!!errors.description}
                                minHeightClassName="min-h-[120px]"
                                placeholder="Öğrenciye gösterilecek soru metnini giriniz"
                            />
                            {errors.description && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.description}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="template-instructions">Talimatlar</Label>
                            <Textarea
                                id="template-instructions"
                                value={formData.instructions || ''}
                                onChange={(e) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        instructions: e.target.value,
                                    }))
                                }
                                className="min-h-[80px]"
                                placeholder="Ek talimatlar (isteğe bağlı)"
                            />
                        </div>
                    </div>
                )}
                <div className="mt-1">
                    {renderTemplateSpecificForm()}
                </div>
            </div>
        </div>
    );
});

BaseQuestionTemplateForm.displayName = 'BaseQuestionTemplateForm';

export default BaseQuestionTemplateForm;