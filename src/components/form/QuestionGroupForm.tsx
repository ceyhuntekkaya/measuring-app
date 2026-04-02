'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NumberInput } from "@/components/ui/number-input";
import type { CreateQuestionGroupRequest, CreateQuestionGroupHeaderRequest, ExamTypeDto, ExamSectionDto, QuestionGroupTypeDto, QuestionGroupDto, CreateQuestionGroupHeaderRequestMediaType } from "@/api/generated/model";
import HtmlEditor from "@/components/ui/html-editor";
import { Trash2, Plus } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { CreateQuestionGroupHeaderRequestMediaType as GeneratedMediaType } from "@/api/generated/model";


interface QuestionGroupFormErrors {
    name?: string;
    examTypeId?: string;
    examSectionId?: string;
    questionGroupTypeId?: string;
    maximumScore?: string;
    durationInSeconds?: string;
    headers?: string;
}

interface QuestionGroupFormProps {
    onSubmit: (data: CreateQuestionGroupRequest) => void;
    questionGroup?: QuestionGroupDto | null;
    examTypes: ExamTypeDto[];
    examSections: ExamSectionDto[];
    questionGroupTypes: QuestionGroupTypeDto[];
    loading?: boolean;
    onExamTypeChange: (data: string) => void;
    onExamSectionChange: (data: string) => void;
}

// MediaType'a göre FileType belirleme
const getFileTypeFromMediaType = (mediaType: CreateQuestionGroupHeaderRequestMediaType | string): 'image' | 'video' | 'audio' | 'pdf' | 'file' => {
    const mediaTypeStr = typeof mediaType === 'string' ? mediaType : mediaType;
    switch (mediaTypeStr) {
        case GeneratedMediaType.IMAGE:
        case 'IMAGE':
            return 'image';
        case GeneratedMediaType.VIDEO:
        case 'VIDEO':
            return 'video';
        case GeneratedMediaType.AUDIO:
        case 'AUDIO':
            return 'audio';
        case GeneratedMediaType.PDF:
        case 'PDF':
            return 'pdf';
        case GeneratedMediaType.DOCUMENT:
        case 'DOCUMENT':
        case GeneratedMediaType.OTHER:
        case 'OTHER':
            return 'file';
        default:
            return 'file';
    }
};

// MediaType'a göre max file size (MB)
const getMaxFileSizeFromMediaType = (mediaType: CreateQuestionGroupHeaderRequestMediaType | string): number => {
    const mediaTypeStr = typeof mediaType === 'string' ? mediaType : mediaType;
    switch (mediaTypeStr) {
        case GeneratedMediaType.IMAGE:
        case 'IMAGE':
            return 5;
        case GeneratedMediaType.VIDEO:
        case 'VIDEO':
            return 100;
        case GeneratedMediaType.AUDIO:
        case 'AUDIO':
            return 20;
        case GeneratedMediaType.PDF:
        case 'PDF':
        case GeneratedMediaType.DOCUMENT:
        case 'DOCUMENT':
            return 10;
        case GeneratedMediaType.OTHER:
        case 'OTHER':
            return 50;
        default:
            return 10;
    }
};

const QuestionGroupForm: React.FC<QuestionGroupFormProps> = ({
                                                                 onSubmit,
                                                                 questionGroup,
                                                                 examTypes = [],
                                                                 examSections = [],
                                                                 questionGroupTypes = [],
                                                                 loading = false,
                                                                 onExamTypeChange,
                                                                 onExamSectionChange
                                                             }) => {
    const [formData, setFormData] = useState<CreateQuestionGroupRequest>({
        name: '',
        examTypeId: '',
        examSectionId: '',
        questionGroupTypeId: '',
        maximumScore: undefined,
        durationInSeconds: undefined,
        headers: [] as CreateQuestionGroupHeaderRequest[]
    });

    const [errors, setErrors] = useState<QuestionGroupFormErrors>({});
    const [filteredSections, setFilteredSections] = useState<ExamSectionDto[]>([]);
    const [filteredGroupTypes, setFilteredGroupTypes] = useState<QuestionGroupTypeDto[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // QuestionGroup geldiğinde form verilerini doldur (sadece bir kez)
    useEffect(() => {
        if (questionGroup && !isInitialized) {
            const examType = questionGroup.examType as ExamTypeDto | undefined;
            setFormData({
                name: questionGroup.name || '',
                examTypeId: examType?.id || '',
                examSectionId: questionGroup.examSection?.id || '',
                questionGroupTypeId: questionGroup.questionGroupType?.id || '',
                maximumScore: questionGroup.maximumScore,
                durationInSeconds: questionGroup.durationInSeconds,
                headers: questionGroup.headers?.map((h, index) => ({
                    id: h.id || `temp-${index}`,
                    orderNumber: h.orderNumber || 1,
                    mediaType: (h.mediaType as CreateQuestionGroupHeaderRequestMediaType) || GeneratedMediaType.TEXT,
                    content: h.content || ''
                })) || []
            });
            setIsInitialized(true);
        }
    }, [questionGroup, isInitialized]);

    // Exam Type değiştiğinde sections'ı filtrele
    useEffect(() => {
        if (formData.examTypeId) {
            const filtered = examSections.filter(section => {
                const examType = section.examType as ExamTypeDto | undefined;
                return examType?.id === formData.examTypeId;
            });
            setFilteredSections(filtered);

            // Eğer seçili section filtered listede yoksa ve bu create modu ise temizle
            // Update modunda ise mevcut seçimi koru
            if (!questionGroup && formData.examSectionId && !filtered.find(s => s.id === formData.examSectionId)) {
                setFormData(prev => ({ ...prev, examSectionId: '', questionGroupTypeId: '' }));
            }
        } else {
            setFilteredSections([]);
            if (!questionGroup) {
                setFormData(prev => ({ ...prev, examSectionId: '', questionGroupTypeId: '' }));
            }
        }
    }, [formData.examTypeId, examSections, questionGroup]);

    // Exam Section değiştiğinde group types'ı filtrele
    useEffect(() => {
        if (formData.examSectionId) {
            const filtered = questionGroupTypes.filter(type => type.examSection?.id === formData.examSectionId);
            setFilteredGroupTypes(filtered);

            // Eğer seçili group type filtered listede yoksa ve bu create modu ise temizle
            // Update modunda ise mevcut seçimi koru
            if (!questionGroup && formData.questionGroupTypeId && !filtered.find(t => t.id === formData.questionGroupTypeId)) {
                setFormData(prev => ({ ...prev, questionGroupTypeId: '' }));
            }
        } else {
            setFilteredGroupTypes([]);
            if (!questionGroup) {
                setFormData(prev => ({ ...prev, questionGroupTypeId: '' }));
            }
        }
    }, [formData.examSectionId, questionGroupTypes, questionGroup]);


    const handleChange = <T extends keyof CreateQuestionGroupRequest>(
        name: T,
        value: CreateQuestionGroupRequest[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (errors[name as keyof QuestionGroupFormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }

        // Propagate changes to parent
        if (name === 'examTypeId') {
            onExamTypeChange(value as string);
        } else if (name === 'examSectionId') {
            onExamSectionChange(value as string);
        }
    };


    const addHeader = () => {
        setFormData(prev => ({
            ...prev,
            headers: [
                ...(prev.headers || []),
                {
                    id: `temp-${Date.now()}`,
                    orderNumber: (prev.headers?.length || 0) + 1,
                    mediaType: GeneratedMediaType.TEXT,
                    content: ''
                }
            ]
        }));
    };

    const removeHeaderById = (headerId: string) => {
        setFormData(prev => ({
            ...prev,
            headers: (prev.headers || []).filter(h => h.id !== headerId)
        }));
    };

    const updateHeaderById = <K extends keyof CreateQuestionGroupHeaderRequest>(
        headerId: string,
        field: K,
        value: CreateQuestionGroupHeaderRequest[K]
    ) => {
        setFormData(prev => ({
            ...prev,
            headers: (prev.headers || []).map((header) => {
                if (header.id === headerId) {
                    // MediaType değiştiğinde content'i temizle
                    if (field === 'mediaType' && header.mediaType !== value) {
                        return { ...header, [field]: value, content: '' };
                    }
                    return { ...header, [field]: value };
                }
                return header;
            })
        }));
    };

    const validate = (): boolean => {
        const newErrors: QuestionGroupFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Soru grubu adı zorunludur';
        }

        if (!formData.examTypeId) {
            newErrors.examTypeId = 'Sınav tipi seçimi zorunludur';
        }

        if (!formData.examSectionId) {
            newErrors.examSectionId = 'Sınav bölümü seçimi zorunludur';
        }

        if (!formData.questionGroupTypeId) {
            newErrors.questionGroupTypeId = 'Soru grubu tipi seçimi zorunludur';
        }

        if (!formData.headers || formData.headers.length === 0) {
            newErrors.headers = 'En az bir başlık eklemelisiniz';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) {
            return;
        }

        // Directly use formData - no manual mapping needed!
        onSubmit(formData);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{questionGroup ? "Soru Grubu Düzenle" : "Yeni Soru Grubu Oluştur"}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-3">
                        {/* Soru Grubu Adı */}
                        <div className="space-y-2 md:col-span-6">
                            <Label htmlFor="name">Soru Grubu Adı *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Soru grubu adını giriniz"
                                className={errors.name ? 'border-red-500' : ''}
                                disabled={loading}
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Maksimum Puan */}
                        <div className="space-y-2 md:col-span-3">
                            <Label htmlFor="maximumScore">Puan</Label>
                            <NumberInput
                                inputType={"number"}
                                id="maximumScore"
                                value={formData.maximumScore || 0}
                                onChange={(value) => handleChange('maximumScore', value || undefined)}
                                minValue={0}
                                decimalPlaces={0}
                                className={errors.maximumScore ? 'border-red-500' : ''}
                                placeholder="0"
                                disabled={loading}
                            />
                            {errors.maximumScore && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.maximumScore}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Süre */}
                        <div className="space-y-2 md:col-span-3">
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
                                disabled={loading}
                            />
                            {errors.durationInSeconds && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.durationInSeconds}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-3">
                        {/* Sınav Tipi */}
                        <div className="space-y-2">
                            <Label htmlFor="examTypeId">Sınav Tipi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('examTypeId', value as string)}
                                value={formData.examTypeId}
                                disabled={loading}
                                searchable={false}
                                sortable={false}
                            >
                                <SelectTrigger className={errors.examTypeId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Sınav tipi seçiniz" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {examTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id!}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.examTypeId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.examTypeId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Sınav Bölümü */}
                        <div className="space-y-2">
                            <Label htmlFor="examSectionId">Sınav Bölümü *</Label>
                            <Select
                                onValueChange={(value) => handleChange('examSectionId', value as string)}
                                value={formData.examSectionId}
                                disabled={loading || !formData.examTypeId}
                                searchable={false}
                                sortable={false}
                            >
                                <SelectTrigger className={errors.examSectionId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder={formData.examTypeId ? "Sınav bölümü seçiniz" : "Önce sınav tipi seçiniz"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {filteredSections.map((section) => (
                                            <SelectItem key={section.id} value={section.id!}>
                                                {section.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.examSectionId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.examSectionId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Soru Grubu Tipi */}
                        <div className="space-y-2">
                            <Label htmlFor="questionGroupTypeId">Soru Grubu Tipi *</Label>
                            <Select
                                onValueChange={(value) => handleChange('questionGroupTypeId', value as string)}
                                value={formData.questionGroupTypeId}
                                disabled={loading || !formData.examSectionId}
                                searchable={false}
                                sortable={false}
                            >
                                <SelectTrigger className={errors.questionGroupTypeId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder={formData.examSectionId ? "Soru grubu tipi seçiniz" : "Önce sınav bölümü seçiniz"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {filteredGroupTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.id!}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.questionGroupTypeId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.questionGroupTypeId}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>
                    {/* Headers Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Soru Gövdesi</Label>
                            <Button
                                type="button"
                                onClick={addHeader}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                                disabled={loading}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Başlık Ekle
                            </Button>
                        </div>

                        {(formData.headers || [])
                            .slice()
                            .sort((a, b) => {
                                const aOrder = a.orderNumber === undefined || a.orderNumber === null ? Number.POSITIVE_INFINITY : Number(a.orderNumber);
                                const bOrder = b.orderNumber === undefined || b.orderNumber === null ? Number.POSITIVE_INFINITY : Number(b.orderNumber);
                                return aOrder - bOrder;
                            })
                            .map((header, index) => (
                            <div key={header.id || index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                                <div className="col-span-11 space-y-3">
                                    <div className="grid grid-cols-12 gap-2 items-end">
                                        <div className="col-span-3">
                                            <Label>Sıra</Label>
                                            <NumberInput
                                                inputType={"number"}
                                                value={header.orderNumber}
                                                onChange={(value) => updateHeaderById(header.id || '', 'orderNumber', value)}
                                                minValue={1}
                                                decimalPlaces={0}
                                                disabled={loading}
                                            />
                                        </div>

                                        <div className="col-span-9">
                                            <Label>Medya Tipi</Label>
                                            <Select
                                                onValueChange={(value) => updateHeaderById(header.id || '', 'mediaType', value as CreateQuestionGroupHeaderRequestMediaType)}
                                                value={header.mediaType || GeneratedMediaType.TEXT}
                                                disabled={loading}
                                                searchable={false}
                                                sortable={false}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {Object.entries(GeneratedMediaType).map(([key, value]) => (
                                                            <SelectItem key={key} value={value}>
                                                                {key}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {(!header.mediaType || header.mediaType === (GeneratedMediaType.TEXT as CreateQuestionGroupHeaderRequestMediaType)) ? (
                                        <HtmlEditor
                                            value={header.content || ''}
                                            onChange={(nextHtml) => updateHeaderById(header.id || '', 'content', nextHtml)}
                                            placeholder="Başlık içeriğini giriniz"
                                            minHeightClassName="min-h-[120px]"
                                            disabled={loading}
                                        />
                                    ) : (
                                        <div className="space-y-2">
                                            <FileUpload
                                                acceptedFileTypes={[getFileTypeFromMediaType(header.mediaType || GeneratedMediaType.TEXT)]}
                                                maxFileSize={getMaxFileSizeFromMediaType(header.mediaType || GeneratedMediaType.TEXT)}
                                                entityId={questionGroup?.id || 'qg_new'}
                                                uploadType={`qg_header_${header.mediaType || GeneratedMediaType.TEXT}`}
                                                multiple={false}
                                                labelText={`${header.mediaType || GeneratedMediaType.TEXT} Dosyası Yükle`}
                                                existingFileUrl={header.content || ''}
                                                onUploadComplete={(files) => {
                                                    if (files && files.length > 0) {
                                                        updateHeaderById(header.id || '', 'content', files[0].path || '');
                                                    }
                                                }}
                                            />
                                            
                                        </div>
                                    )}
                                </div>

                                <div className="col-span-1">
                                    <Button
                                        type="button"
                                        onClick={() => removeHeaderById(header.id || '')}
                                        variant="destructive"
                                        size="sm"
                                        disabled={loading}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {errors.headers && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.headers}</AlertDescription>
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
                            {loading ? "İşleniyor..." : questionGroup ? "Soru Grubu Güncelle" : "Soru Grubu Oluştur"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default QuestionGroupForm;