'use client';

import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";
import {X} from "lucide-react";
import {BranchDto, BrandDto} from "@/types/management/brand";
import {EStatus} from "@/types/exam/enum";
import {ExamDto, ExamFormData, QuestionGroupDto} from "@/types/exam/examEntities";
import {ExamTypeDto} from "@/types/exam/examTemplates";
import {Column, RecordType} from "@/types/ui/table";
import DynamicTable from "@/components/ui/dynamic-table";

interface ExamFormErrors {
    name?: string;
    code?: string;
    examTypeId?: string;
    questionGroupIds?: string;
    branchId?: string;
    brandId?: string;
}

interface ExamFormProps {
    onSubmit: (data: ExamFormData) => Promise<void>;
    exam?: ExamDto | null;
    loading?: boolean;
    examTypes?: ExamTypeDto[];
    questionGroups?: QuestionGroupDto[];
    branches?: BranchDto[];
    brands?: BrandDto[];
    onExamTypeChange?: (examTypeId: string) => void;
    onBrandChange?: (brandId: string) => void;
}

const ExamForm: React.FC<ExamFormProps> = ({
                                               onSubmit,
                                               exam,
                                               loading = false,
                                               examTypes = [],
                                               questionGroups = [],
                                               branches = [],
                                               brands = [],
                                               onExamTypeChange,
                                               onBrandChange
                                           }) => {
    const [formData, setFormData] = useState<ExamFormData>({
        id: '',
        name: '',
        code: '',
        examTypeId: '',
        questionGroupIds: [],
        branchId: '',
        brandId: '',
        createdAt: new Date(),
        deletedAt: null,
        status: EStatus.ACTIVE,
        createdById: '',
        deletedById: ''
    });

    const [errors, setErrors] = useState<ExamFormErrors>({});
    const [selectedQuestionGroups, setSelectedQuestionGroups] = useState<QuestionGroupDto[]>([]);
    const [availableQuestionGroups, setAvailableQuestionGroups] = useState<QuestionGroupDto[]>([]);


    console.log(questionGroups)

    // Filter question groups based on selected exam type
    useEffect(() => {
        if (formData.examTypeId) {
            const filtered = questionGroups.filter(qg =>
                !qg.examType || qg.examType.id === formData.examTypeId
            );
            setAvailableQuestionGroups(filtered);

            // Remove question groups that are not compatible with selected exam type
            const compatibleSelectedGroups = selectedQuestionGroups.filter(qg =>
                !qg.examType || qg.examType.id === formData.examTypeId
            );

            if (compatibleSelectedGroups.length !== selectedQuestionGroups.length) {
                setSelectedQuestionGroups(compatibleSelectedGroups);
                setFormData(prev => ({
                    ...prev,
                    questionGroupIds: compatibleSelectedGroups.map(qg => qg.id)
                }));
            }
        } else {
            setAvailableQuestionGroups(questionGroups);
        }
    }, [formData.examTypeId, questionGroups, selectedQuestionGroups]);

    // Filter branches based on selected brand
    const availableBranches = formData.brandId
        ? branches.filter(branch => branch.brandId === formData.brandId)
        : branches;

    useEffect(() => {
        if (exam) {
            setFormData({
                id: exam.id || '',
                createdAt: exam.createdAt ? new Date(exam.createdAt) : new Date(),
                deletedAt: exam.deletedAt ? new Date(exam.deletedAt) : null,
                status: exam.status,
                createdById: exam.createdById || '',
                deletedById: exam.deletedById || '',
                name: exam.name || '',
                code: exam.code || '',
                examTypeId: exam.examType?.id || '',
                questionGroupIds: exam.questionGroups?.map(qg => qg.id) || [],
                branchId: exam.branch?.id || '',
                brandId: exam.brand?.id || ''
            });

            if (exam.questionGroups) {
                setSelectedQuestionGroups(exam.questionGroups);
            }
        }
    }, [exam]);

    const handleChange = <T extends keyof ExamFormData>(
        name: T,
        value: ExamFormData[T]
    ) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear related fields when parent changes
        if (name === 'examTypeId' && onExamTypeChange) {
            onExamTypeChange(value as string);
        }

        if (name === 'brandId') {
            setFormData(prev => ({...prev, branchId: ''}));
            if (onBrandChange) {
                onBrandChange(value as string);
            }
        }
    };

    const addQuestionGroup = (questionGroupId: string) => {
        const questionGroup = availableQuestionGroups.find(qg => qg.id === questionGroupId);
        if (questionGroup && !selectedQuestionGroups.find(qg => qg.id === questionGroupId)) {
            const newSelectedGroups = [...selectedQuestionGroups, questionGroup];
            setSelectedQuestionGroups(newSelectedGroups);
            setFormData(prev => ({
                ...prev,
                questionGroupIds: newSelectedGroups.map(qg => qg.id)
            }));
        }
    };

    const removeQuestionGroup = (questionGroupId: string) => {
        const newSelectedGroups = selectedQuestionGroups.filter(qg => qg.id !== questionGroupId);
        setSelectedQuestionGroups(newSelectedGroups);
        setFormData(prev => ({
            ...prev,
            questionGroupIds: newSelectedGroups.map(qg => qg.id)
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: ExamFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Sınav adı zorunludur';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Sınav adı en az 2 karakter olmalıdır';
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Sınav kodu zorunludur';
        } else if (formData.code.trim().length < 2) {
            newErrors.code = 'Sınav kodu en az 2 karakter olmalıdır';
        } else if (!/^[A-Z0-9_-]+$/i.test(formData.code.trim())) {
            newErrors.code = 'Sınav kodu sadece harf, rakam, tire ve alt çizgi içerebilir';
        }

        if (!formData.examTypeId) {
            newErrors.examTypeId = 'Sınav tipi seçimi zorunludur';
        }

        if (!formData.questionGroupIds.length) {
            newErrors.questionGroupIds = 'En az bir soru grubu seçimi zorunludur';
        }

        if (!formData.branchId) {
            newErrors.branchId = 'Şube seçimi zorunludur';
        }

        if (!formData.brandId) {
            newErrors.brandId = 'Marka seçimi zorunludur';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const submitData: ExamFormData = {
                id: formData.id || '',
                createdAt: formData.createdAt || new Date(),
                deletedAt: formData.deletedAt || null,
                status: formData.status,
                createdById: formData.createdById || '',
                deletedById: formData.deletedById || '',
                name: formData.name.trim(),
                code: formData.code.trim().toUpperCase(),
                examTypeId: formData.examTypeId,
                questionGroupIds: formData.questionGroupIds,
                branchId: formData.branchId,
                brandId: formData.brandId
            };

            onSubmit(submitData);
        }
    };


    const columns: Column<RecordType>[] = [
        {
            key: 'id',
            header: ' ',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    <button onClick={() => addQuestionGroup(record.id as string)}>EKLE</button>
                </div>
            )
        },
        {
            key: 'name',
            header: 'Ad',
            render: (value) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {value as string}
                </div>
            )
        },

        {
            key: 'Grup',
            header: 'Grup',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                >
                    {(record as QuestionGroupDto).questionGroupType?.name}
                </div>
            )
        },

    ];

    const getUnselectedQuestionGroups = () => {
        return availableQuestionGroups.filter(qg =>
            !selectedQuestionGroups.find(selected => selected.id === qg.id)
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {exam ? "Sınav Güncelle" : "Yeni Sınav Oluştur"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Sınav Adı */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Sınav Adı *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                placeholder="Sınav adını giriniz"
                            />
                            {errors.name && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.name}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Sınav Kodu */}
                        <div className="space-y-2">
                            <Label htmlFor="code">Sınav Kodu *</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                                className={errors.code ? 'border-red-500' : ''}
                                placeholder="Sınav kodunu giriniz"
                            />
                            {errors.code && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.code}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Marka Seçimi */}
                        <div className="space-y-2">
                            <Label>Marka *</Label>
                            <Select
                                value={formData.brandId}
                                onValueChange={(value) => handleChange('brandId', value as string)}
                            >
                                <SelectTrigger className={errors.brandId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Marka seçiniz"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {brands.map((brand) => (
                                        <SelectItem key={brand.id} value={brand.id}>
                                            {brand.name} ({brand.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.brandId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.brandId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Şube Seçimi */}
                        <div className="space-y-2">
                            <Label>Şube *</Label>
                            <Select
                                value={formData.branchId}
                                onValueChange={(value) => handleChange('branchId', value as string)}
                                disabled={!formData.brandId}
                            >
                                <SelectTrigger className={errors.branchId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder={
                                        formData.brandId ? "Şube seçiniz" : "Önce marka seçiniz"
                                    }/>
                                </SelectTrigger>
                                <SelectContent>
                                    {availableBranches.map((branch) => (
                                        <SelectItem key={branch.id} value={branch.id}>
                                            {branch.branchName} ({branch.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.branchId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.branchId}</AlertDescription>
                                </Alert>
                            )}
                        </div>

                        {/* Sınav Tipi */}
                        <div className="space-y-2 col-span-2">
                            <Label>Sınav Tipi *</Label>
                            <Select
                                value={formData.examTypeId}
                                onValueChange={(value) => handleChange('examTypeId', value as string)}
                            >
                                <SelectTrigger className={errors.examTypeId ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Sınav tipi seçiniz"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {examTypes.map((examType) => (
                                        <SelectItem key={examType.id} value={examType.id}>
                                            {examType.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.examTypeId && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.examTypeId}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>

                    {/* Soru Grupları Seçimi */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Soru Grupları *</Label>

                            {/* Seçili Soru Grupları */}
                            <div className="min-h-[60px] p-3 border rounded-md bg-gray-50">
                                {selectedQuestionGroups.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedQuestionGroups.map((qg) => (
                                            <Badge
                                                key={qg.id}
                                                variant="secondary"
                                                className="flex items-center gap-1 px-3 py-1"
                                            >
                                                {qg.name}
                                                <X
                                                    className="h-3 w-3 cursor-pointer hover:text-red-500"
                                                    onClick={() => removeQuestionGroup(qg.id)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">Henüz soru grubu seçilmedi</p>
                                )}
                            </div>

                            {/* Soru Grubu Ekleme */}
                            {getUnselectedQuestionGroups().length > 0 && (
                                <>
                                    {
                                        /*
                                         <div className="flex gap-2">
                                        <Select value="" onValueChange={(value) => addQuestionGroup(value as string)}>
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Soru grubu ekle"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getUnselectedQuestionGroups().map((qg) => (
                                                    <SelectItem key={qg.id} value={qg.id}>
                                                        <div className="flex flex-col">
                                                            <span>{qg.name}</span>
                                                            {qg.examType && (
                                                                <span className="text-xs text-gray-500">
                                                                {qg.examType.name}
                                                            </span>
                                                            )}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                         */
                                    }


                                    <div className="flex gap-2">
                                        <DynamicTable columns={columns} data={getUnselectedQuestionGroups()}/>
                                    </div>
                                </>
                            )}

                            {errors.questionGroupIds && (
                                <Alert variant="destructive">
                                    <AlertDescription>{errors.questionGroupIds}</AlertDescription>
                                </Alert>
                            )}
                        </div>


                        {/* Soru Grubu İstatistikleri */}
                        {selectedQuestionGroups.length > 0 && (
                            <div className="bg-blue-50 p-3 rounded-md">
                                <h4 className="font-medium text-sm text-blue-800 mb-2">Sınav Özeti:</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                    <div>
                                        <span className="text-blue-600">Soru Grupları:</span>
                                        <span className="ml-1 font-medium">{selectedQuestionGroups.length}</span>
                                    </div>
                                    <div>
                                        <span className="text-blue-600">Toplam Soru:</span>
                                        <span className="ml-1 font-medium">
                                            {selectedQuestionGroups.reduce((total, qg) =>
                                                total + (qg.questions?.length || 0), 0
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-blue-600">Max Puan:</span>
                                        <span className="ml-1 font-medium">
                                            {selectedQuestionGroups.reduce((total, qg) =>
                                                total + (qg.maximumScore || 0), 0
                                            )}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-blue-600">Süre (dk):</span>
                                        <span className="ml-1 font-medium">
                                            {Math.round(selectedQuestionGroups.reduce((total, qg) =>
                                                total + (qg.durationInSeconds || 0), 0
                                            ) / 60)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? "İşleniyor..." : exam ? "Sınav Güncelle" : "Sınav Oluştur"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ExamForm;