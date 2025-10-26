'use client';

import React, {useEffect, useRef, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {NumberInput} from "@/components/ui/number-input";
import {CreateQuestionOptionRequest, CreateQuestionPartRequest, CreateQuestionRequest} from "@/types/exam/examRequests";
import {
    BaseQuestionTemplateFormData,
    QuestionDto,
    QuestionTemplateType
} from "@/types/exam/examEntities";
import {Plus, Trash2} from "lucide-react";
import {EDifficulty, EMediaType, EQuestionType} from "@/types/exam/enum";
import Checkbox from "@/components/ui/checkbox";
import BaseQuestionTemplateForm, {
    BaseQuestionTemplateFormHandle
} from "@/components/form/template/BaseQuestionTemplateForm";
import {useParams} from "next/navigation";

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
    baseTemplate?: string;
}

interface QuestionFormProps {
    onSubmit: (data: CreateQuestionRequest) => void;
    question?: QuestionDto | null;
    loading?: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
                                                       onSubmit,
                                                       question,
                                                       loading = false
                                                   }) => {

    const params = useParams();
    const questionGroupId = params.groupId as string;


    const [formData, setFormData] = useState<QuestionFormData>({
        name: '',
        questionGroupId: questionGroupId,
        questionType: '',
        orderNumber: undefined,
        isAutomaticallyEvaluated: true,
        maximumScore: undefined,
        durationInSeconds: undefined,
        questionTemplate: null,
        parts: [],
        options: []
    });

    const [baseFormData, setBaseFormData] = useState<BaseQuestionTemplateFormData>({
        title: '',
        description: '',
        subject: '',
        difficulty: EDifficulty.EASY,
        points: 10,
        timeLimit: 300,
        instructions: '',
        tags: [],
        isActive: true,
        questionType: '',
        templateData: null
    });


    const handleBaseFormUpdate = <T extends keyof BaseQuestionTemplateFormData>(
        name: T,
        newValue: BaseQuestionTemplateFormData[T]
    ) => {
        setBaseFormData(prev => ({
            ...prev,
            [name]: newValue
        }));




    };

    const [errors, setErrors] = useState<QuestionFormErrors>({});

    // BaseQuestionTemplateForm'un validate fonksiyonunu tetiklemek için ref
    const baseTemplateValidateRef = useRef<BaseQuestionTemplateFormHandle>(null);

    // Update modu için question data'yı form'a yükle
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

            // Eğer question template varsa baseFormData'yı doldur
            if (question.questionTemplate) {
                setBaseFormData({
                    title: question.questionTemplate.title || '',
                    description: question.questionTemplate.description || '',
                    subject: question.questionTemplate.subject || '',
                    difficulty: question.questionTemplate.difficulty || EDifficulty.EASY,
                    points: question.questionTemplate.points || 10,
                    timeLimit: question.questionTemplate.timeLimit || 300,
                    instructions: question.questionTemplate.instructions || '',
                    tags: question.questionTemplate.tags || [],
                    isActive: question.questionTemplate.isActive ?? true,
                    questionType: question.questionType || '',
                    templateData: question.questionTemplate
                });
            }
        }
    }, [question]);

    // QuestionType değiştiğinde baseFormData'yı güncelle
    useEffect(() => {
        if (formData.questionType && formData.questionType !== baseFormData.questionType) {
            setBaseFormData(prev => ({
                ...prev,
                questionType: formData.questionType as EQuestionType,
                templateData: null // Yeni tip seçildiğinde template data'yı temizle
            }));
        }
    }, [formData.questionType]);

    const handleChange = <T extends keyof QuestionFormData>(
        name: T,
        value: QuestionFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if(name === "name"){
            handleBaseFormUpdate("title", value as string)
        }
        if(name === "maximumScore"){
            handleBaseFormUpdate("points", value as number)
        }
        if(name === "durationInSeconds"){
            handleBaseFormUpdate("timeLimit", value as number)
        }

        // Hata varsa temizle
        if (errors[name as keyof QuestionFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleBaseFormChange = (data: BaseQuestionTemplateFormData) => {
        setBaseFormData(data);

        // BaseForm değiştiğinde questionTemplate'i güncelle
        // Type assertion: baseFormData zaten doğru template structure'a sahip
        setFormData(prev => ({
            ...prev,
            questionTemplate: data.templateData as QuestionTemplateType
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

    // Validation
    const validateForm = (): boolean => {
        const newErrors: QuestionFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Soru adı zorunludur';
        }

        if (!formData.questionType) {
            newErrors.questionType = 'Soru tipi seçilmelidir';
        }

        if (formData.orderNumber !== undefined && formData.orderNumber < 1) {
            newErrors.orderNumber = 'Sıra numarası 1\'den küçük olamaz';
        }

        if (formData.maximumScore !== undefined && formData.maximumScore < 0) {
            newErrors.maximumScore = 'Maksimum puan negatif olamaz';
        }

        if (formData.durationInSeconds !== undefined && formData.durationInSeconds < 0) {
            newErrors.durationInSeconds = 'Süre negatif olamaz';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Transform data to API request format
    const transformToCreateQuestionRequest = (): CreateQuestionRequest => {
        // Template data'yı doğru formata dönüştür
        let questionTemplate: QuestionTemplateType | null = null;

        if (baseFormData.templateData && baseFormData.questionType) {
            // BaseFormData ile templateData'yı birleştir
            questionTemplate = {
                ...baseFormData.templateData,
                // Base template fields
                title: baseFormData.title,
                description: baseFormData.description,
                subject: baseFormData.subject,
                difficulty: baseFormData.difficulty,
                points: baseFormData.points,
                timeLimit: baseFormData.timeLimit,
                instructions: baseFormData.instructions,
                tags: baseFormData.tags,
                isActive: baseFormData.isActive,
                questionType: baseFormData.questionType as EQuestionType
            } as QuestionTemplateType;
        }

        return {
            name: formData.name.trim(),
            questionGroupId: formData.questionGroupId,
            questionType: formData.questionType as EQuestionType,
            orderNumber: formData.orderNumber,
            isAutomaticallyEvaluated: formData.isAutomaticallyEvaluated,
            maximumScore: formData.maximumScore,
            durationInSeconds: formData.durationInSeconds,
            parts: formData.parts,
            options: formData.options,
            questionTemplate: questionTemplate
        };
    };

    // Master Submit Handler - TEK KAYIT NOKTASI
    const handleSubmit = () => {
        // 1. QuestionForm validation
        const isQuestionFormValid = validateForm();

        if (!isQuestionFormValid) {
            return;
        }

        // 2. BaseTemplate validation (BaseQuestionTemplateForm + Template Form)
        // BaseQuestionTemplateForm kendi içinde template validation'ını da çağırıyor
        const isBaseTemplateFormValid = baseTemplateValidateRef.current?.validate() ?? false;

        const isBaseTemplateFormValidData = baseTemplateValidateRef.current?.getErrors() ;


        console.log(isBaseTemplateFormValid)
        console.log(isBaseTemplateFormValidData)


        if (!isBaseTemplateFormValid) {
            setErrors(prev => ({
                ...prev,
                baseTemplate: 'Lütfen template bilgilerini eksiksiz doldurunuz'
            }));
            return;
        }

        // 3. Tüm validationlar başarılı - data transform ve submit
        const finalData = transformToCreateQuestionRequest();



        console.log(finalData)
        console.log(JSON.stringify(finalData, null, 2));
        onSubmit(finalData);
    };


    const QuestionPartForm = () => {

        return (

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

        )
    }

    const QuestionOptionForm = () => {

        return (

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

        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{question ? 'Soru Güncelle' : 'Yeni Soru Oluştur'}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Question Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Temel Bilgiler</h3>


                        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">

                            <div className="col-span-2 space-y-2">
                                <Label htmlFor="name">Soru Adı *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="Soru adını giriniz"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.name}</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="questionType">Soru Tipi *</Label>
                                <Select
                                    value={formData.questionType}
                                    onValueChange={(value) => handleChange('questionType', value as EQuestionType)}
                                >
                                    <SelectTrigger className={errors.questionType ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Soru tipi seçiniz"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {Object.entries(EQuestionType).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>
                                                    {value}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.questionType && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.questionType}</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="orderNumber">Sıra No</Label>
                                <NumberInput
                                    id="orderNumber"
                                    inputType={"number"}
                                    value={formData.orderNumber}
                                    onChange={(value) => handleChange('orderNumber', value)}
                                    minValue={1}
                                    decimalPlaces={0}
                                    placeholder="Otomatik"
                                    className={errors.orderNumber ? 'border-red-500' : ''}
                                />
                                {errors.orderNumber && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.orderNumber}</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maximumScore">Maksimum Puan</Label>
                                <NumberInput
                                    id="maximumScore"
                                    inputType={"number"}
                                    value={formData.maximumScore}
                                    onChange={(value) => handleChange('maximumScore', value)}
                                    minValue={0}
                                    decimalPlaces={2}
                                    placeholder="Puan giriniz"
                                    className={errors.maximumScore ? 'border-red-500' : ''}
                                />
                                {errors.maximumScore && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.maximumScore}</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="durationInSeconds">Süre (saniye)</Label>
                                <NumberInput
                                    id="durationInSeconds"
                                    inputType={"number"}
                                    value={formData.durationInSeconds}
                                    onChange={(value) => handleChange('durationInSeconds', value)}
                                    minValue={0}
                                    decimalPlaces={0}
                                    unit="sn"
                                    placeholder="Süre giriniz"
                                    className={errors.durationInSeconds ? 'border-red-500' : ''}
                                />
                                {errors.durationInSeconds && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{errors.durationInSeconds}</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                            {
                                /*
                                 <div className="space-y-2">
                                <div className="flex items-center space-x-2 mt-6">
                                    <Checkbox
                                        id="isAutomaticallyEvaluated"
                                        checked={formData.isAutomaticallyEvaluated}
                                        onChange={(checked) => handleChange('isAutomaticallyEvaluated', !!checked)}
                                    />
                                    <Label htmlFor="isAutomaticallyEvaluated">Otomatik Değerlendir</Label>
                                </div>
                            </div>
                                 */
                            }

                        </div>
                    </div>

                    <QuestionPartForm/>
                    <QuestionOptionForm/>

                    {/* Base Question Template Form - Alt componentler burada */}
                    {formData.questionType && (
                        <div className="space-y-4">
                            <BaseQuestionTemplateForm
                                ref={baseTemplateValidateRef}
                                value={baseFormData}
                                onChange={handleBaseFormChange}
                                questionType={formData.questionType as EQuestionType}
                                loading={loading}
                            />
                            {errors.baseTemplate && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.baseTemplate}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}

                    {/* TEK KAYDET BUTONU - Master Submit */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        <Button
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                            disabled={loading}
                            size="lg"
                        >
                            {loading ? "İşleniyor..." : question ? "Soru Güncelle" : "Soru Oluştur"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuestionForm;