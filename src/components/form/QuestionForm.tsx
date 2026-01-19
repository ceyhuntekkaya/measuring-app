'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {NumberInput} from "@/components/ui/number-input";
import type {CreateQuestionRequest} from "@/api/generated/model";
import type {QuestionDto} from "@/api/generated/model";
import type {QuestionTemplateType} from "@/types/exam/questionTemplateTypes";
import {EDifficulty, EMediaType, EQuestionType} from "@/types/exam/enum";

// Custom form data type for base template (UI only)
export interface BaseQuestionTemplateFormData {
    title: string;
    description?: string;
    subject: string;
    difficulty: EDifficulty;
    points: number;
    timeLimit: number;
    instructions?: string;
    tags: string[];
    isActive: boolean;
    questionType: EQuestionType | '';
    templateData?: QuestionTemplateType | null;
}

import {Plus, Trash2} from "lucide-react";
import Checkbox from "@/components/ui/checkbox";
import BaseQuestionTemplateForm, {
    BaseQuestionTemplateFormHandle
} from "@/components/form/template/BaseQuestionTemplateForm";
import {useParams} from "next/navigation";
import {getQuestionTypeLabel} from "@/utils/question-type-convert";
import {showNotification} from "@/lib/notification";

// Local types for parts and options (not part of API, used for UI only)
interface QuestionPart {
    orderNumber: number;
    mediaType: EMediaType;
    content: string;
    label: string;
    maximumScore?: number;
    durationInSeconds?: number;
    repetitionCount?: number;
}

interface QuestionOption {
    orderNumber: number;
    mediaType: EMediaType;
    content: string;
    baseContent: string;
    isTrueOption: boolean;
}

// Use ORVAL Request types directly - parts and options are UI-only

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


    const [formData, setFormData] = useState<Omit<CreateQuestionRequest, 'questionTemplate'>>({
        name: '',
        questionGroupId: questionGroupId,
        questionType: '' as CreateQuestionRequest['questionType'],
        orderNumber: undefined,
        isAutomaticallyEvaluated: true,
        maximumScore: undefined,
        durationInSeconds: undefined
    });
    
    // UI-only state for template
    const [questionTemplate, setQuestionTemplate] = useState<QuestionTemplateType | null>(null);
    
    // UI-only state for parts and options (not sent to API)
    const [parts, setParts] = useState<QuestionPart[]>([]);
    const [options, setOptions] = useState<QuestionOption[]>([]);


    const [baseFormData, setBaseFormData] = useState<BaseQuestionTemplateFormData>({
        title: '',
        description: '',
        subject: 'NOT_SET',
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
                questionType: question.questionType as CreateQuestionRequest['questionType'] || '' as CreateQuestionRequest['questionType'],
                orderNumber: question.orderNumber,
                isAutomaticallyEvaluated: question.isAutomaticallyEvaluated ?? true,
                maximumScore: question.maximumScore,
                durationInSeconds: question.durationInSeconds
            });
            setQuestionTemplate(question.questionTemplate || null);
            setParts([]);
            setOptions([]);

            // Eğer question template varsa baseFormData'yı doldur
            if (question.questionTemplate) {
                // ÖNEMLİ: questionTemplate'in id'sini koru (update modu için gerekli)
                const templateDataWithId = {
                    ...question.questionTemplate,
                    id: question.questionTemplate.id // id'yi açıkça koru
                };
                
                setBaseFormData({
                    title: question.questionTemplate.title || '',
                    description: question.questionTemplate.description || '',
                    subject: question.questionTemplate.subject || 'NOT_SET',
                    difficulty: (question.questionTemplate.difficulty as EDifficulty) || EDifficulty.EASY,
                    points: question.questionTemplate.points || 10,
                    timeLimit: question.questionTemplate.timeLimit || 300,
                    instructions: question.questionTemplate.instructions || '',
                    tags: question.questionTemplate.tags || [],
                    isActive: question.questionTemplate.isActive ?? true,
                    questionType: (question.questionType as EQuestionType) || '',
                    templateData: templateDataWithId // id'yi içeren template data
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

    const handleChange = <T extends keyof Omit<CreateQuestionRequest, 'questionTemplate'>>(
        name: T,
        value: Omit<CreateQuestionRequest, 'questionTemplate'>[T]
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
        setQuestionTemplate(data.templateData as QuestionTemplateType);
    };

    // Question Parts Management (UI-only state)
    const addPart = () => {
        const newPart: QuestionPart = {
            orderNumber: parts.length + 1,
            mediaType: EMediaType.TEXT,
            content: '',
            label: '',
            maximumScore: undefined,
            durationInSeconds: undefined,
            repetitionCount: undefined
        };
        setParts(prev => [...prev, newPart]);
    };

    const removePart = (index: number) => {
        setParts(prev => prev.filter((_, i) => i !== index));
    };

    const updatePart = useCallback(<K extends keyof QuestionPart>(
        index: number,
        field: K,
        value: QuestionPart[K]
    ) => {
        setParts(prev => prev.map((part, i) =>
            i === index ? {...part, [field]: value} : part
        ));
    }, []);

    // Question Options Management (UI-only state)
    const addOption = () => {
        const newOption: QuestionOption = {
            orderNumber: options.length + 1,
            mediaType: EMediaType.TEXT,
            content: '',
            baseContent: '',
            isTrueOption: false
        };

        setOptions(prev => [...prev, newOption]);
    };

    const removeOption = (index: number) => {
        setOptions(prev => prev.filter((_, i) => i !== index));
    };

    const updateOption = useCallback(<K extends keyof QuestionOption>(
        index: number,
        field: K,
        value: QuestionOption[K]
    ) => {
        setOptions(prev => prev.map((option, i) =>
            i === index ? {...option, [field]: value} : option
        ));
    }, []);

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

    // NOT: Template-specific validasyonlar artık template form'ların kendi validate() fonksiyonlarında yapılıyor
    // validateCorrectAnswer() fonksiyonu kaldırıldı - tekrarlı validasyon yönetim sorununa yol açıyordu
    // BaseQuestionTemplateForm.validateAll() zaten templateValidateRef.current?.validate() çağırarak
    // tüm template form validasyonlarını yapıyor

    // Transform data to API request format
    const transformToCreateQuestionRequest = (): CreateQuestionRequest => {
        // Template data'yı doğru formata dönüştür
        let finalQuestionTemplate: CreateQuestionRequest['questionTemplate'] | null = null;

        if (questionTemplate && baseFormData.questionType) {
            // BaseFormData ile templateData'yı birleştir
            // ÖNEMLİ: templateData içindeki tüm field'ları koru (id, correctOptionIndex, correctOptionIndices, vb.)
            const templateId = questionTemplate.id; // id'yi önce sakla
            
            finalQuestionTemplate = {
                ...questionTemplate, // Template-specific field'ları koru (correctOptionIndex, correctOptionIndices, vb.)
                // Base template fields (eğer baseFormData'da varsa override et)
                ...(baseFormData.title && { title: baseFormData.title }),
                // Açıklama ve Talimatlar her zaman boş string olarak gönderiliyor (UI'dan kaldırıldı)
                description: '', // UI'dan kaldırıldı, her zaman boş string
                ...(baseFormData.subject && { subject: baseFormData.subject }),
                ...(baseFormData.difficulty && { difficulty: baseFormData.difficulty }),
                ...(baseFormData.points !== undefined && { points: baseFormData.points }),
                ...(baseFormData.timeLimit !== undefined && { timeLimit: baseFormData.timeLimit }),
                instructions: '', // UI'dan kaldırıldı, her zaman boş string
                ...(baseFormData.tags && { tags: baseFormData.tags }),
                ...(baseFormData.isActive !== undefined && { isActive: baseFormData.isActive }),
                questionType: baseFormData.questionType as EQuestionType,
                // ÖNEMLİ: id'yi en son ekle ki override edilmesin (update modu için gerekli)
                ...(templateId && { id: templateId })
            } as CreateQuestionRequest['questionTemplate'];
        }

        // Directly use formData - no manual mapping needed!
        if (!finalQuestionTemplate) {
            throw new Error('Question template is required');
        }
        
        return {
            name: formData.name.trim(),
            questionGroupId: formData.questionGroupId,
            questionType: formData.questionType as CreateQuestionRequest['questionType'],
            orderNumber: formData.orderNumber,
            isAutomaticallyEvaluated: formData.isAutomaticallyEvaluated,
            maximumScore: formData.maximumScore,
            durationInSeconds: formData.durationInSeconds,
            questionTemplate: finalQuestionTemplate
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

        if (!isBaseTemplateFormValid) {
            setErrors(prev => ({
                ...prev,
                baseTemplate: 'Lütfen template bilgilerini eksiksiz doldurunuz'
            }));
            return;
        }

        // 3. Template data kontrolü
        // NOT: Template-specific validasyonlar artık template form'ların kendi validate() fonksiyonlarında yapılıyor
        // Bu yüzden validateCorrectAnswer() fonksiyonunu kaldırdık - tekrarlı validasyon yönetim sorununa yol açıyordu
        if (!baseFormData.templateData && formData.questionType) {
            showNotification.error('Template bilgileri eksik! Lütfen template formunu doldurunuz.');
            return;
        }

        // 4. Tüm validationlar başarılı - data transform ve submit
        const finalData = transformToCreateQuestionRequest();
        if(question){
            finalData.id = question.id;
        }
        onSubmit(finalData);
    };



    const QuestionPartAndOptions =()=>{
        return(
            <>
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

                    {parts.map((part, index) => (
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

                    {options.map((option, index) => (
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

            </>
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
                                                    {getQuestionTypeLabel(value)}
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

                    {
                        formData.questionGroupId && formData.questionGroupId === "yedek_alani" &&
                        <QuestionPartAndOptions/>
                    }

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