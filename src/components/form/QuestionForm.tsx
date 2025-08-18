'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {NumberInput} from "@/components/ui/number-input";
import {CreateQuestionOptionRequest, CreateQuestionPartRequest, CreateQuestionRequest} from "@/types/exam/examRequests";
import {QuestionDto, QuestionGroupDto, QuestionTemplateType} from "@/types/exam/examEntities";
import {Plus, Trash2} from "lucide-react";
import {EMediaType, EQuestionType} from "@/types/exam/enum";
import Checkbox from "@/components/ui/checkbox";
import BaseQuestionTemplateForm from "@/components/form/template/BaseQuestionTemplateForm";


interface QuestionFormData {
    name: string;
    questionGroupId: string;
    questionType: EQuestionType | '';
    orderNumber?: number;
    isAutomaticallyEvaluated?: boolean;
    maximumScore?: number;
    durationInSeconds?: number;
    questionTemplate: QuestionTemplateType | null;
    parts: CreateQuestionPartRequest[];
    options: CreateQuestionOptionRequest[];
}

interface QuestionFormErrors {
    name?: string;
    questionGroupId?: string;
    questionType?: string;
    orderNumber?: string;
    maximumScore?: string;
    durationInSeconds?: string;
    questionTemplate?: string;
    parts?: string;
    options?: string;
}

interface QuestionFormProps {
    onSubmit: (data: CreateQuestionRequest) => void;
    question?: QuestionDto | null;
    questionGroups: QuestionGroupDto[];
    loading?: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
                                                       onSubmit,
                                                       question,
                                                       questionGroups = [],
                                                       loading = false
                                                   }) => {
    const [formData, setFormData] = useState<QuestionFormData>({
        name: '',
        questionGroupId: '',
        questionType: '',
        orderNumber: undefined,
        isAutomaticallyEvaluated: true,
        maximumScore: undefined,
        durationInSeconds: undefined,
        questionTemplate: null,
        parts: [],
        options: []
    });

    const [errors, setErrors] = useState<QuestionFormErrors>({});

    useEffect(() => {
        if (question) {
            setFormData({
                name: question.name || '',
                questionGroupId: question.questionGroup?.id || '',
                questionType: question.questionType || '',
                orderNumber: question.orderNumber,
                isAutomaticallyEvaluated: question.isAutomaticallyEvaluated ?? true,
                maximumScore: question.maximumScore,
                durationInSeconds: question.durationInSeconds,
                questionTemplate: question.questionTemplate || null,
                parts: [],
                options: []
            });
        }
    }, [question]);

    const handleChange = <T extends keyof QuestionFormData>(
        name: T,
        value: QuestionFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Question Parts Management
    const addPart = () => {
        const newPart: CreateQuestionPartRequest = {
            orderNumber: formData.parts.length + 1,
            mediaType: EMediaType.TEXT,
            content: '',
            label: '',
            maximumScore: undefined,
            durationInSeconds: undefined,
            repetitionCount: undefined
        };

        setFormData(prev => ({
            ...prev,
            parts: [...prev.parts, newPart]
        }));
    };

    const removePart = (index: number) => {
        setFormData(prev => ({
            ...prev,
            parts: prev.parts.filter((_, i) => i !== index)
        }));
    };

    const updatePart = <K extends keyof CreateQuestionPartRequest>(
        index: number,
        field: K,
        value: CreateQuestionPartRequest[K]
    ) => {
        setFormData(prev => ({
            ...prev,
            parts: prev.parts.map((part, i) =>
                i === index ? {...part, [field]: value} : part
            )
        }));
    };

    // Question Options Management
    const addOption = () => {
        const newOption: CreateQuestionOptionRequest = {
            orderNumber: formData.options.length + 1,
            mediaType: EMediaType.TEXT,
            content: '',
            baseContent: '',
            isTrueOption: false
        };

        setFormData(prev => ({
            ...prev,
            options: [...prev.options, newOption]
        }));
    };

    const removeOption = (index: number) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };

    const updateOption = <K extends keyof CreateQuestionOptionRequest>(
        index: number,
        field: K,
        value: CreateQuestionOptionRequest[K]
    ) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.map((option, i) =>
                i === index ? {...option, [field]: value} : option
            )
        }));
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


    const validateForm = (): boolean => {
        const newErrors: QuestionFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Soru adı zorunludur';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Soru adı en az 3 karakter olmalıdır';
        }

        if (!formData.questionGroupId) {
            newErrors.questionGroupId = 'Soru grubu seçimi zorunludur';
        }

        if (!formData.questionType) {
            newErrors.questionType = 'Soru tipi seçimi zorunludur';
        }

        if (!formData.questionTemplate) {
            newErrors.questionTemplate = 'Soru şablonu ID zorunludur';
        }

        if (formData.orderNumber !== undefined && formData.orderNumber <= 0) {
            newErrors.orderNumber = 'Sıra numarası 0\'dan büyük olmalıdır';
        }

        if (formData.maximumScore !== undefined && formData.maximumScore <= 0) {
            newErrors.maximumScore = 'Maksimum puan 0\'dan büyük olmalıdır';
        }

        if (formData.durationInSeconds !== undefined && formData.durationInSeconds <= 0) {
            newErrors.durationInSeconds = 'Süre 0\'dan büyük olmalıdır';
        }

        // Parts validation
        const invalidParts = formData.parts.some(part => !part.content?.trim());
        if (invalidParts) {
            newErrors.parts = 'Tüm soru parçası içerikleri doldurulmalıdır';
        }

        // Options validation
        const invalidOptions = formData.options.some(option => !option.content?.trim());
        if (invalidOptions) {
            newErrors.options = 'Tüm seçenek içerikleri doldurulmalıdır';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const submitData: CreateQuestionRequest = {
                name: formData.name.trim(),
                questionGroupId: formData.questionGroupId,
                questionType: formData.questionType as EQuestionType,
                questionTemplate: formData.questionTemplate || null,
                ...(formData.orderNumber !== undefined && {orderNumber: formData.orderNumber}),
                ...(formData.isAutomaticallyEvaluated !== undefined && {isAutomaticallyEvaluated: formData.isAutomaticallyEvaluated}),
                ...(formData.maximumScore !== undefined && {maximumScore: formData.maximumScore}),
                ...(formData.durationInSeconds !== undefined && {durationInSeconds: formData.durationInSeconds}),
                ...(formData.parts.length > 0 && {parts: formData.parts}),
                ...(formData.options.length > 0 && {options: formData.options})
            };

            onSubmit(submitData);
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {question ? "Soru Güncelle" : "Yeni Soru Oluştur"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Soru Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Soru Adı *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Soru adını giriniz"
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Soru Grubu */}
                        <div className="space-y-2">
                            <Label htmlFor="questionGroup">Soru Grubu *</Label>
                            <Select
                                onValueChange={(value) => handleChange('questionGroupId', value as string)}
                                value={formData.questionGroupId}
                            >
                                <SelectTrigger className={errors.questionGroupId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Soru grubu seçin"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {questionGroups.map(group => (
                                            <SelectItem key={group.id} value={group.id || ''}>
                                                {group.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.questionGroupId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.questionGroupId}</AlertDescription>
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


                        {/* Sıra Numarası */}
                        <div className="space-y-2">
                            <Label htmlFor="orderNumber">Sıra Numarası</Label>
                            <NumberInput
                                inputType={"number"}
                                id="orderNumber"
                                value={formData.orderNumber || 0}
                                onChange={(value) => handleChange('orderNumber', value || undefined)}
                                minValue={1}
                                decimalPlaces={0}
                                className={errors.orderNumber ? 'border-red-500' : ''}
                                placeholder="0"
                            />
                            {errors.orderNumber && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.orderNumber}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Maksimum Puan */}
                        <div className="space-y-2">
                            <Label htmlFor="maximumScore">Maksimum Puan</Label>
                            <NumberInput
                                id="maximumScore"
                                inputType={"number"}
                                value={formData.maximumScore || 0}
                                onChange={(value) => handleChange('maximumScore', value || undefined)}
                                minValue={0}
                                decimalPlaces={0}
                                className={errors.maximumScore ? 'border-red-500' : ''}
                                placeholder="0"
                            />
                            {errors.maximumScore && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.maximumScore}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Süre */}
                        <div className="space-y-2">
                            <Label htmlFor="durationInSeconds">Süre (saniye)</Label>
                            <NumberInput
                                id="durationInSeconds"
                                inputType={"number"}
                                value={formData.durationInSeconds || 0}
                                onChange={(value) => handleChange('durationInSeconds', value || undefined)}
                                minValue={0}
                                decimalPlaces={0}
                                unit="saniye"
                                className={errors.durationInSeconds ? 'border-red-500' : ''}
                                placeholder="0"
                            />
                            {errors.durationInSeconds && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.durationInSeconds}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Otomatik Değerlendirme */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isAutomaticallyEvaluated"
                                    checked={formData.isAutomaticallyEvaluated}
                                    onChange={(checked) => handleChange('isAutomaticallyEvaluated', !!checked)}
                                />
                                <Label htmlFor="isAutomaticallyEvaluated">Otomatik Değerlendirme</Label>
                            </div>
                        </div>
                    </div>

                    {/* Question Parts Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Soru Parçaları</Label>
                            <Button
                                type="button"
                                onClick={addPart}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2"/>
                                Parça Ekle
                            </Button>
                        </div>

                        {formData.parts.map((part, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                                <div className="col-span-1">
                                    <Label>Sıra</Label>
                                    <NumberInput
                                        inputType={"number"}
                                        value={part.orderNumber}
                                        onChange={(value) => updatePart(index, 'orderNumber', value)}
                                        minValue={1}
                                        decimalPlaces={0}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label>Medya Tipi</Label>
                                    <Select
                                        onValueChange={(value) => updatePart(index, 'mediaType', value as EMediaType)}
                                        value={part.mediaType || "TEXT"}
                                    >
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Object.entries(EMediaType).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-2">
                                    <Label>Etiket</Label>
                                    <Input
                                        value={part.label || ''}
                                        onChange={(e) => updatePart(index, 'label', e.target.value)}
                                        placeholder="Etiket"
                                    />
                                </div>

                                <div className="col-span-5">
                                    <Label>İçerik</Label>
                                    <Textarea
                                        value={part.content || ''}
                                        onChange={(e) => updatePart(index, 'content', e.target.value)}
                                        placeholder="Parça içeriğini giriniz"
                                        className="min-h-[60px]"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        onClick={() => removePart(index)}
                                        variant="primary"
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {errors.parts && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.parts}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Question Options Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Soru Seçenekleri</Label>
                            <Button
                                type="button"
                                onClick={addOption}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2"/>
                                Seçenek Ekle
                            </Button>
                        </div>

                        {formData.options.map((option, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                                <div className="col-span-1">
                                    <Label>Sıra</Label>
                                    <NumberInput
                                        inputType={"number"}
                                        value={option.orderNumber}
                                        onChange={(value) => updateOption(index, 'orderNumber', value)}
                                        minValue={1}
                                        decimalPlaces={0}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label>Medya Tipi</Label>
                                    <Select
                                        onValueChange={(value) => updateOption(index, 'mediaType', value as EMediaType)}
                                        value={option.mediaType || "TEXT"}
                                    >
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Object.entries(EMediaType).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {value}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-3">
                                    <Label>İçerik</Label>
                                    <Textarea
                                        value={option.content}
                                        onChange={(e) => updateOption(index, 'content', e.target.value)}
                                        placeholder="Seçenek içeriğini giriniz"
                                        className="min-h-[60px]"
                                    />
                                </div>

                                <div className="col-span-3">
                                    <Label>Temel İçerik</Label>
                                    <Textarea
                                        value={option.baseContent || ''}
                                        onChange={(e) => updateOption(index, 'baseContent', e.target.value)}
                                        placeholder="Temel içerik"
                                        className="min-h-[60px]"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={option.isTrueOption}
                                            onChange={(checked) => updateOption(index, 'isTrueOption', !!checked)}
                                        />
                                        <Label>Doğru</Label>
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        onClick={() => removeOption(index)}
                                        variant="primary"
                                        size="sm"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {errors.options && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.options}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "İşleniyor..." : question ? "Soru Güncelle" : "Soru Oluştur"}
                        </Button>
                    </div>
                </div>


                <BaseQuestionTemplateForm onSubmit={() => {
                }} questionType={formData.questionType || EQuestionType.MULTIPLE_CHOICE}/>
            </CardContent>
        </Card>
    );
};

export default QuestionForm;