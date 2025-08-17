'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import Checkbox from "@/components/ui/checkbox";
import {NumberInput} from "@/components/ui/number-input";
import {
    BaseQuestionTemplateDto,
    MultipleChoiceTemplateDto,
    TrueFalseTemplateDto,
    FillInTheBlanksTemplateDto,
    ShortAnswerTemplateDto,
    EssayTemplateDto,
    MatchingTemplateDto,
    OrderingTemplateDto, MultipleResponseTemplateDto, HotSpotTemplateDto, DragAndDropTemplateDto,
    AudioResponseTemplateDto, VideoResponseTemplateDto, ImageResponseTemplateDto
} from "@/types/exam/questionTemplates";
import {Trash2, Plus} from "lucide-react";

// Import template form components
import MultipleChoiceTemplateForm from './MultipleChoiceTemplateForm';
import TrueFalseTemplateForm from './TrueFalseTemplateForm';
import FillInTheBlanksTemplateForm from './FillInTheBlanksTemplateForm';
import ShortAnswerTemplateForm from './ShortAnswerTemplateForm';
import EssayTemplateForm from './EssayTemplateForm';
import MatchingTemplateForm from './MatchingTemplateForm';
import {EQuestionType} from "@/types/exam/enum";
import OrderingTemplateForm from "@/components/form/template/OrderingTemplateForm";
import MultipleResponseTemplateForm from "@/components/form/template/MultipleResponseTemplateForm";
import HotSpotTemplateForm from "@/components/form/template/HotSpotTemplateForm";
import DragAndDropTemplateForm from "@/components/form/template/DragAndDropTemplate Form";
import AudioResponseTemplateForm from "@/components/form/template/AudioResponseTemplateForm";
import ImageResponseTemplateForm from "@/components/form/template/ImageResponseTemplateForm";
import VideoResponseTemplateForm from "@/components/form/template/VideoResponseTemplateForm";


interface BaseQuestionTemplateFormData {
    title: string;
    description?: string;
    subject: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD' | '';
    points: number;
    timeLimit: number;
    instructions?: string;
    tags: string[];
    isActive: boolean;
    questionType: EQuestionType | '';
    // Template specific data
    templateData?: MultipleChoiceTemplateDto | TrueFalseTemplateDto |
        FillInTheBlanksTemplateDto | ShortAnswerTemplateDto |
        MatchingTemplateDto | EssayTemplateDto | OrderingTemplateDto | MultipleResponseTemplateDto |
        HotSpotTemplateDto | DragAndDropTemplateDto | AudioResponseTemplateDto | VideoResponseTemplateDto | ImageResponseTemplateDto | null;
}


interface BaseQuestionTemplateFormErrors {
    title?: string;
    subject?: string;
    difficulty?: string;
    points?: string;
    timeLimit?: string;
    questionType?: string;
}

interface BaseQuestionTemplateFormProps {
    onSubmit: (data: BaseQuestionTemplateDto) => void;
    template?: BaseQuestionTemplateDto | null;
    loading?: boolean;
}

const BaseQuestionTemplateForm: React.FC<BaseQuestionTemplateFormProps> = ({
                                                                               onSubmit,
                                                                               template,
                                                                               loading = false
                                                                           }) => {
    const [formData, setFormData] = useState<BaseQuestionTemplateFormData>({
        title: '',
        description: '',
        subject: '',
        difficulty: '',
        points: 10,
        timeLimit: 300,
        instructions: '',
        tags: [],
        isActive: true,
        questionType: '',
        templateData: null
    });

    const [errors, setErrors] = useState<BaseQuestionTemplateFormErrors>({});
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (template) {
            setFormData({
                title: template.title || '',
                description: template.description || '',
                subject: template.subject || '',
                difficulty: (template.difficulty as 'EASY' | 'MEDIUM' | 'HARD') || '',
                points: template.points || 10,
                timeLimit: template.timeLimit || 300,
                instructions: template.instructions || '',
                tags: template.tags || [],
                isActive: template.isActive ?? true,
                questionType: template.questionType || '',
                templateData: getTemplateSpecificData(template)
            });
        }
    }, [template]);

    // Template tipine göre özel veriyi çıkar
    const getTemplateSpecificData = (template: BaseQuestionTemplateDto) => {
        switch (template.questionType) {
            case 'MULTIPLE_CHOICE':
                return template as MultipleChoiceTemplateDto;
            case 'TRUE_FALSE':
                return template as TrueFalseTemplateDto;
            case 'FILL_IN_THE_BLANKS':
                return template as FillInTheBlanksTemplateDto;
            case 'SHORT_ANSWER':
                return template as ShortAnswerTemplateDto;
            case 'MATCHING':
                return template as MatchingTemplateDto;
            case 'ESSAY':
                return template as EssayTemplateDto;
            case 'ORDERING':
                return template as OrderingTemplateDto;
            case 'MULTIPLE_RESPONSE':
                return template as MultipleResponseTemplateDto;
            case 'HOT_SPOT':
                return template as HotSpotTemplateDto;
            case 'DRAG_AND_DROP':
                return template as DragAndDropTemplateDto;
            case 'AUDIO_RESPONSE':
                return template as AudioResponseTemplateDto;
            case 'VIDEO_RESPONSE':
                return template as VideoResponseTemplateDto;
            case 'IMAGE_RESPONSE':
                return template as ImageResponseTemplateDto;

            default:
                return null;
        }
    };

    const handleChange = <T extends keyof BaseQuestionTemplateFormData>(
        name: T,
        value: BaseQuestionTemplateFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Eğer question type değişirse template data'yı sıfırla
        if (name === 'questionType') {
            setFormData(prev => ({
                ...prev,
                templateData: null
            }));
        }
    };

    // Template-specific data değişikliklerini handle et
    const handleTemplateDataChange = (data: MultipleChoiceTemplateDto | TrueFalseTemplateDto |
        FillInTheBlanksTemplateDto | ShortAnswerTemplateDto |
        MatchingTemplateDto | EssayTemplateDto | OrderingTemplateDto | MultipleResponseTemplateDto |
        HotSpotTemplateDto | DragAndDropTemplateDto | AudioResponseTemplateDto | VideoResponseTemplateDto | ImageResponseTemplateDto) => {
        setFormData(prev => ({
            ...prev,
            templateData: {...prev.templateData, ...data}
        }));
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index)
        }));
    };

    const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const getQuestionTypeDisplayName = (questionType: string): string => {
        switch (questionType) {
            case 'MULTIPLE_CHOICE':
                return 'Çoktan Seçmeli';
            case 'TRUE_FALSE':
                return 'Doğru-Yanlış';
            case 'FILL_IN_THE_BLANKS':
                return 'Boşluk Doldurma';
            case 'SHORT_ANSWER':
                return 'Kısa Cevap';
            case 'MATCHING':
                return 'Eşleştirme';
            case 'ESSAY':
                return 'Kompozisyon';
            case 'ORDERING':
                return 'Sıralama';
            case 'MULTIPLE_RESPONSE':
                return 'Çoklu Yanıt';
            case 'HOT_SPOT':
                return 'Sıcak Nokta';
            case 'DRAG_AND_DROP':
                return 'Sürükle-Bırak';
            case 'AUDIO_RESPONSE':
                return 'Ses Yanıtı';
            case 'VIDEO_RESPONSE':
                return 'Video Yanıtı';
            case 'IMAGE_RESPONSE':
                return 'Resim Yanıtı';
            default:
                return questionType;
        }
    };

    const getDifficultyDisplayName = (difficulty: string): string => {
        switch (difficulty) {
            case 'EASY':
                return 'Kolay';
            case 'MEDIUM':
                return 'Orta';
            case 'HARD':
                return 'Zor';
            default:
                return difficulty;
        }
    };

    const validateForm = (): boolean => {
        const newErrors: BaseQuestionTemplateFormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Şablon başlığı zorunludur';
        } else if (formData.title.trim().length < 3) {
            newErrors.title = 'Şablon başlığı en az 3 karakter olmalıdır';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Konu alanı zorunludur';
        }

        if (!formData.difficulty) {
            newErrors.difficulty = 'Zorluk seviyesi seçimi zorunludur';
        }

        if (!formData.questionType) {
            newErrors.questionType = 'Soru tipi seçimi zorunludur';
        }

        if (formData.points <= 0) {
            newErrors.points = 'Puan 0\'dan büyük olmalıdır';
        } else if (formData.points > 1000) {
            newErrors.points = 'Puan 1000\'den büyük olamaz';
        }

        if (formData.timeLimit <= 0) {
            newErrors.timeLimit = 'Süre sınırı 0\'dan büyük olmalıdır';
        } else if (formData.timeLimit > 7200) { // 2 saat
            newErrors.timeLimit = 'Süre sınırı 2 saatten uzun olamaz';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const baseData: BaseQuestionTemplateDto = {
                id: template?.id,
                title: formData.title.trim(),
                subject: formData.subject.trim(),
                difficulty: formData.difficulty as string,
                points: formData.points,
                timeLimit: formData.timeLimit,
                isActive: formData.isActive,
                questionType: formData.questionType as EQuestionType,
                tags: formData.tags,
                ...(formData.description && formData.description.trim() && {description: formData.description.trim()}),
                ...(formData.instructions && formData.instructions.trim() && {instructions: formData.instructions.trim()}),
                createdAt: template?.createdAt,
                deletedAt: template?.deletedAt,
                status: template?.status,
                createdById: template?.createdById,
                deletedById: template?.deletedById
            };

            // Template-specific data'yı merge et
            const submitData = formData.templateData
                ? {...baseData, ...formData.templateData}
                : baseData;

            onSubmit(submitData);
        }
    };

    // Template tipine göre özel form render et
    const renderTemplateSpecificForm = () => {
        if (!formData.questionType) return null;

        const commonProps = {
            value: formData.templateData,
            onChange: handleTemplateDataChange
        };

        switch (formData.questionType) {
            case 'MULTIPLE_CHOICE':
                return <MultipleChoiceTemplateForm onChange={commonProps.onChange}
                                                   value={commonProps.value as MultipleChoiceTemplateDto}/>;
            case 'TRUE_FALSE':
                return <TrueFalseTemplateForm onChange={commonProps.onChange}
                                              value={commonProps.value as TrueFalseTemplateDto}/>;
            case 'FILL_IN_THE_BLANKS':
                return <FillInTheBlanksTemplateForm onChange={commonProps.onChange}
                                                    value={commonProps.value as FillInTheBlanksTemplateDto}/>;
            case 'SHORT_ANSWER':
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
        <Card>
            <CardHeader>
                <CardTitle>
                    {template ? "Soru Şablonu Güncelle" : "Yeni Soru Şablonu Oluştur"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Şablon Başlığı */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Şablon Başlığı *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className={errors.title ? 'border-red-500' : ''}
                                placeholder="Şablon başlığını giriniz"
                            />
                            {errors.title && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.title}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Konu */}
                        <div className="space-y-2">
                            <Label htmlFor="subject">Konu *</Label>
                            <Input
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => handleChange('subject', e.target.value)}
                                className={errors.subject ? 'border-red-500' : ''}
                                placeholder="Konu alanını giriniz"
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
                                onValueChange={(value) => handleChange('difficulty', value as 'EASY' | 'MEDIUM' | 'HARD')}
                                value={formData.difficulty}
                            >
                                <SelectTrigger className={errors.difficulty ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Zorluk seviyesi seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="EASY">{getDifficultyDisplayName('EASY')}</SelectItem>
                                        <SelectItem value="MEDIUM">{getDifficultyDisplayName('MEDIUM')}</SelectItem>
                                        <SelectItem value="HARD">{getDifficultyDisplayName('HARD')}</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.difficulty && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.difficulty}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Soru Tipi */}
                        <div className="space-y-2">
                            <Label htmlFor="questionType">Soru Tipi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('questionType', value as EQuestionType)}
                                value={formData.questionType}
                            >
                                <SelectTrigger className={errors.questionType ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Soru tipi seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem
                                            value="MULTIPLE_CHOICE">{getQuestionTypeDisplayName('MULTIPLE_CHOICE')}</SelectItem>
                                        <SelectItem
                                            value="TRUE_FALSE">{getQuestionTypeDisplayName('TRUE_FALSE')}</SelectItem>
                                        <SelectItem
                                            value="FILL_IN_THE_BLANKS">{getQuestionTypeDisplayName('FILL_IN_THE_BLANKS')}</SelectItem>
                                        <SelectItem
                                            value="SHORT_ANSWER">{getQuestionTypeDisplayName('SHORT_ANSWER')}</SelectItem>
                                        <SelectItem
                                            value="MATCHING">{getQuestionTypeDisplayName('MATCHING')}</SelectItem>
                                        <SelectItem value="ESSAY">{getQuestionTypeDisplayName('ESSAY')}</SelectItem>
                                        <SelectItem
                                            value="ORDERING">{getQuestionTypeDisplayName('ORDERING')}</SelectItem>
                                        <SelectItem
                                            value="MULTIPLE_RESPONSE">{getQuestionTypeDisplayName('MULTIPLE_RESPONSE')}</SelectItem>
                                        <SelectItem
                                            value="HOT_SPOT">{getQuestionTypeDisplayName('HOT_SPOT')}</SelectItem>
                                        <SelectItem
                                            value="DRAG_AND_DROP">{getQuestionTypeDisplayName('DRAG_AND_DROP')}</SelectItem>
                                        <SelectItem
                                            value="AUDIO_RESPONSE">{getQuestionTypeDisplayName('AUDIO_RESPONSE')}</SelectItem>
                                        <SelectItem
                                            value="VIDEO_RESPONSE">{getQuestionTypeDisplayName('VIDEO_RESPONSE')}</SelectItem>
                                        <SelectItem
                                            value="IMAGE_RESPONSE">{getQuestionTypeDisplayName('IMAGE_RESPONSE')}</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.questionType && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.questionType}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Puan */}
                        <div className="space-y-2">
                            <Label htmlFor="points">Puan *</Label>
                            <NumberInput
                                id="points"
                                value={formData.points}
                                onChange={(value) => handleChange('points', value)}
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
                                value={formData.timeLimit}
                                onChange={(value) => handleChange('timeLimit', value)}
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
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(checked) => handleChange('isActive', !!checked)}
                                />
                                <Label htmlFor="isActive">Şablon Aktif</Label>
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
                            placeholder="Şablon hakkında açıklama giriniz (opsiyonel)"
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
                    {renderTemplateSpecificForm()}

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "İşleniyor..." : template ? "Şablon Güncelle" : "Şablon Oluştur"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BaseQuestionTemplateForm;