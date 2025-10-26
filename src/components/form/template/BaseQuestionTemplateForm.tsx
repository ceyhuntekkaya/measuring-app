'use client';

import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from 'react';
import {Card, CardContent} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Checkbox from "@/components/ui/checkbox";
import {NumberInput} from "@/components/ui/number-input";
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
} from "@/types/exam/questionTemplates";
import {Trash2, Plus} from "lucide-react";

// Import template form components
import MultipleChoiceTemplateForm, {MultipleChoiceTemplateFormHandle} from './MultipleChoiceTemplateForm';
import TrueFalseTemplateForm, {TrueFalseTemplateFormHandle} from './TrueFalseTemplateForm';
import FillInTheBlanksTemplateForm, {FillInTheBlanksTemplateFormHandle} from './FillInTheBlanksTemplateForm';
import ShortAnswerTemplateForm, {ShortAnswerTemplateFormHandle} from './ShortAnswerTemplateForm';
import EssayTemplateForm, {EssayTemplateFormHandle} from './EssayTemplateForm';
import MatchingTemplateForm, {MatchingTemplateFormHandle} from './MatchingTemplateForm';
import {EDifficulty, EQuestionType} from "@/types/exam/enum";
import OrderingTemplateForm, {OrderingTemplateFormHandle} from "@/components/form/template/OrderingTemplateForm";
import MultipleResponseTemplateForm, { MultipleResponseTemplateFormHandle } from "@/components/form/template/MultipleResponseTemplateForm";
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
import {BaseQuestionTemplateFormData} from "@/types/exam/examEntities";

interface BaseQuestionTemplateFormErrors {
    title?: string;
    subject?: string;
    difficulty?: string;
    points?: string;
    timeLimit?: string;
    questionType?: string;
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
    const [tagInput, setTagInput] = useState('');

    // Template validation ref - her template'in validate fonksiyonunu tutar
    // Union type: Tüm template handle'ları
    type TemplateFormHandle = MultipleResponseTemplateFormHandle |
        MatchingTemplateFormHandle |
        HotSpotTemplateFormHandle |
        FillInTheBlanksTemplateFormHandle |
        AudioResponseTemplateFormHandle |
        DragAndDropTemplateFormHandle |
        EssayTemplateFormHandle |
        ImageResponseTemplateFormHandle; // Diğerleri eklenecek
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

    // Form data değiştiğinde parent'a bildir
    useEffect(() => {
        onChange(formData);
    }, [formData]);

    const handleChange = <T extends keyof BaseQuestionTemplateFormData>(
        name: T,
        newValue: BaseQuestionTemplateFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Hata varsa temizle
        if (errors[name as keyof BaseQuestionTemplateFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    // Template-specific data değişikliklerini handle et
    const handleTemplateDataChange = (templateData: MultipleChoiceTemplateDto | TrueFalseTemplateDto |
        FillInTheBlanksTemplateDto | ShortAnswerTemplateDto |
        MatchingTemplateDto | EssayTemplateDto | OrderingTemplateDto | MultipleResponseTemplateDto |
        HotSpotTemplateDto | DragAndDropTemplateDto | AudioResponseTemplateDto | VideoResponseTemplateDto | ImageResponseTemplateDto) => {
        setFormData(prev => ({
            ...prev,
            templateData: templateData
        }));
    };

    // Tag yönetimi
    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            handleChange('tags', [...formData.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        handleChange('tags', formData.tags.filter((_, i) => i !== index));
    };

    const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

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

    const getQuestionTypeDisplayName = (type: string): string => {
        const displayNames: Record<string, string> = {
            'MULTIPLE_CHOICE': 'Çoktan Seçmeli',
            'TRUE_FALSE': 'Doğru/Yanlış',
            'FILL_IN_THE_BLANKS': 'Boşluk Doldurma',
            'SHORT_ANSWER': 'Kısa Cevap',
            'ESSAY': 'Kompozisyon',
            'MATCHING': 'Eşleştirme',
            'ORDERING': 'Sıralama',
            'MULTIPLE_RESPONSE': 'Çoklu Yanıt',
            'HOT_SPOT': 'Sıcak Nokta',
            'DRAG_AND_DROP': 'Sürükle Bırak',
            'AUDIO_RESPONSE': 'Sesli Yanıt',
            'VIDEO_RESPONSE': 'Video Yanıt',
            'IMAGE_RESPONSE': 'Resim Yanıtı'
        };
        return displayNames[type] || type;
    };

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
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-6">
                    {/* Başlık */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Soru Başlığı *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className={errors.title ? 'border-red-500' : ''}
                            placeholder="Soru başlığını giriniz"
                        />
                        {errors.title && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.title}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Grid Layout: Konu, Zorluk, Soru Tipi */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Konu */}
                        <div className="space-y-2">
                            <Label htmlFor="subject">Konu *</Label>
                            <Input
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => handleChange('subject', e.target.value)}
                                className={errors.subject ? 'border-red-500' : ''}
                                placeholder="Örn: Matematik, Fizik"
                            />
                            {errors.subject && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.subject}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Zorluk Seviyesi */}
                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Zorluk Seviyesi *</Label>
                            <Select
                                value={formData.difficulty}
                                onValueChange={(val) => handleChange('difficulty', val as EDifficulty)}
                            >
                                <SelectTrigger className={errors.difficulty ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Zorluk seçiniz"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="EASY">Kolay</SelectItem>
                                        <SelectItem value="MEDIUM">Orta</SelectItem>
                                        <SelectItem value="HARD">Zor</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.difficulty && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.difficulty}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Soru Tipi - QuestionForm'dan geldiği için disabled */}
                        <div className="space-y-2">
                            <Label htmlFor="questionType">Soru Tipi *</Label>
                            <Select
                                value={formData.questionType}
                                onValueChange={(val) => handleChange('questionType', val as EQuestionType)}
                                disabled={true} // QuestionForm'dan kontrol ediliyor
                            >
                                <SelectTrigger className={errors.questionType ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Soru tipi seçiniz"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="MULTIPLE_CHOICE">
                                            {getQuestionTypeDisplayName('MULTIPLE_CHOICE')}
                                        </SelectItem>
                                        <SelectItem value="TRUE_FALSE">
                                            {getQuestionTypeDisplayName('TRUE_FALSE')}
                                        </SelectItem>
                                        <SelectItem value="FILL_IN_THE_BLANKS">
                                            {getQuestionTypeDisplayName('FILL_IN_THE_BLANKS')}
                                        </SelectItem>
                                        <SelectItem value="SHORT_ANSWER">
                                            {getQuestionTypeDisplayName('SHORT_ANSWER')}
                                        </SelectItem>
                                        <SelectItem value="ESSAY">
                                            {getQuestionTypeDisplayName('ESSAY')}
                                        </SelectItem>
                                        <SelectItem value="MATCHING">
                                            {getQuestionTypeDisplayName('MATCHING')}
                                        </SelectItem>
                                        <SelectItem value="ORDERING">
                                            {getQuestionTypeDisplayName('ORDERING')}
                                        </SelectItem>
                                        <SelectItem value="MULTIPLE_RESPONSE">
                                            {getQuestionTypeDisplayName('MULTIPLE_RESPONSE')}
                                        </SelectItem>
                                        <SelectItem value="HOT_SPOT">
                                            {getQuestionTypeDisplayName('HOT_SPOT')}
                                        </SelectItem>
                                        <SelectItem value="DRAG_AND_DROP">
                                            {getQuestionTypeDisplayName('DRAG_AND_DROP')}
                                        </SelectItem>
                                        <SelectItem value="AUDIO_RESPONSE">
                                            {getQuestionTypeDisplayName('AUDIO_RESPONSE')}
                                        </SelectItem>
                                        <SelectItem value="VIDEO_RESPONSE">
                                            {getQuestionTypeDisplayName('VIDEO_RESPONSE')}
                                        </SelectItem>
                                        <SelectItem value="IMAGE_RESPONSE">
                                            {getQuestionTypeDisplayName('IMAGE_RESPONSE')}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.questionType && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.questionType}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    {/* Grid Layout: Puan, Süre, Aktif Durumu */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Puan */}
                        <div className="space-y-2">
                            <Label htmlFor="points">Puan *</Label>
                            <NumberInput
                                id="points"
                                inputType={"number"}
                                value={formData.points}
                                onChange={(val) => handleChange('points', val)}
                                minValue={1}
                                maxValue={1000}
                                decimalPlaces={0}
                                className={errors.points ? 'border-red-500' : ''}
                            />
                            {errors.points && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.points}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Süre Sınırı */}
                        <div className="space-y-2">
                            <Label htmlFor="timeLimit">Süre Sınırı (saniye) *</Label>
                            <NumberInput
                                id="timeLimit"
                                inputType={"number"}
                                value={formData.timeLimit}
                                onChange={(val) => handleChange('timeLimit', val)}
                                minValue={1}
                                maxValue={7200}
                                decimalPlaces={0}
                                unit="saniye"
                                className={errors.timeLimit ? 'border-red-500' : ''}
                            />
                            {errors.timeLimit && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.timeLimit}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Aktif Durumu */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 mt-6">
                                <Checkbox
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(checked) => handleChange('isActive', !!checked)}
                                />
                                <Label htmlFor="isActive">Soru Aktif</Label>
                            </div>
                        </div>
                    </div>

                    {/* Açıklama */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="min-h-[100px]"
                            placeholder="Soru hakkında açıklama giriniz (opsiyonel)"
                        />
                    </div>

                    {/* Talimatlar */}
                    <div className="space-y-2">
                        <Label htmlFor="instructions">Talimatlar</Label>
                        <Textarea
                            id="instructions"
                            value={formData.instructions}
                            onChange={(e) => handleChange('instructions', e.target.value)}
                            className="min-h-[100px]"
                            placeholder="Soru çözüm talimatlarını giriniz (opsiyonel)"
                        />
                    </div>

                    {/* Etiketler */}
                    <div className="space-y-4">
                        <Label>Etiketler</Label>

                        {/* Etiket Ekleme */}
                        <div className="flex gap-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={handleTagInputKeyPress}
                                placeholder="Etiket eklemek için yazın ve Enter'a basın"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={addTag}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2"/>
                                Ekle
                            </Button>
                        </div>

                        {/* Mevcut Etiketler */}
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                                    >
                                        <span>{tag}</span>
                                        <Button
                                            type="button"
                                            onClick={() => removeTag(index)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 hover:bg-blue-200"
                                        >
                                            <Trash2 className="w-3 h-3"/>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Template-Specific Form */}
                    <div className="mt-6">
                        {renderTemplateSpecificForm()}
                    </div>

                    {/* KAYDET BUTONU KALDIRILDI - QuestionForm'da olacak */}
                </div>
            </CardContent>
        </Card>
    );
});

BaseQuestionTemplateForm.displayName = 'BaseQuestionTemplateForm';

export default BaseQuestionTemplateForm;