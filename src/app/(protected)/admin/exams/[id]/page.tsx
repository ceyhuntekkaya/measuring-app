'use client';

import React, { useEffect, useState } from 'react';
import {useParams, useRouter} from 'next/navigation';
import { Card, CardContent,  } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from 'lucide-react';
import LoadingComp from '@/components/ui/loading-comp';
import {useBranch} from "@/hooks/exam/use-branch";
import {ExamTypeDto} from "@/types/exam/examTemplates";
import {ExamFormData, QuestionGroupDto} from "@/types/exam/examEntities";
import {examTypeService} from "@/services/api/exam/exam-type-service";
import {questionGroupService} from "@/services/api/exam/question-grup-service";
import ExamForm from "@/components/form/exam-form";
import {useExam} from "@/hooks/exam/use-exam";
import {useBrand} from "@/hooks/exam/use-brand";
import {BranchDto} from "@/types/management/brand";


export default function ExamFormPage() {
    const params = useParams();
    const examId = params.id as string;
    const isEdit = Boolean(examId);
    const router = useRouter();

    // Hooks
    const {
        selectedExam,
        loading: examLoading,
        createExam,
        updateExam,
        getExamById
    } = useExam();

    const {
        brands,
        loading: brandsLoading,
        getAllBrands
    } = useBrand();

    const {
        branches,
        loading: branchesLoading,
        getAllBranches,
    } = useBranch();

    // Local state for form dependencies
    const [examTypes, setExamTypes] = useState<ExamTypeDto[]>([]);
    const [questionGroups, setQuestionGroups] = useState<QuestionGroupDto[]>([]);
    const [filteredBranches, setFilteredBranches] = useState<BranchDto[]>([]);
    const [loadingDependencies, setLoadingDependencies] = useState(true);

    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoadingDependencies(true);

                // Load all required data in parallel
                await Promise.all([
                    getAllBrands(),
                    getAllBranches(),
                    loadExamTypes(),
                    loadQuestionGroups()
                ]);

                // If editing, load exam data
                if (isEdit && examId) {
                    await getExamById(examId);
                }

            } catch (error) {
                console.error('Error loading initial data:', error);
            } finally {
                setLoadingDependencies(false);
            }
        };

        loadInitialData();
    }, [examId, isEdit]);

    // Load exam types
    const loadExamTypes = async () => {
        try {
            const response = await examTypeService.getAllExamTypes();
            if (response.success && response.data) {
                setExamTypes(response.data.examTypes);
            }
        } catch (error) {
            console.error('Error loading exam types:', error);
        }
    };

    // Load question groups
    const loadQuestionGroups = async (examTypeId?: string) => {
        try {
            let response;
            if (examTypeId) {
                response = await questionGroupService.getQuestionGroupsByExamType(examTypeId);
            } else {
                response = await questionGroupService.getAllQuestionGroup();
            }

            if (response.success && response.data) {
                setQuestionGroups(response.data);
            }
        } catch (error) {
            console.error('Error loading question groups:', error);
        }
    };

    // Handle brand change
    const handleBrandChange = async (brandId: string) => {
        if (brandId && branches) {
            const filtered = branches.filter(branch => branch.brandid === brandId);
            setFilteredBranches(filtered);
        } else {
            setFilteredBranches([]);
        }
    };

    // Handle exam type change
    const handleExamTypeChange = async (examTypeId: string) => {
        await loadQuestionGroups(examTypeId);
    };

    // Handle form submission
    const handleSubmit = async (formData: ExamFormData) => {
        try {
            if (isEdit && examId) {
                await updateExam({ ...formData, id: examId });
            } else {
                await createExam(formData);
            }

            // Navigate back to exam list or detail page
            if (isEdit) {
                router.push(`/exams/${examId}`);
            } else {
                router.push('/exams');
            }
        } catch (error) {
            console.error('Error submitting exam form:', error);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (isEdit && examId) {
            router.push(`/exams/${examId}`);
        } else {
            router.push('/exams');
        }
    };

    // Loading state
    if (loadingDependencies || examLoading || brandsLoading || branchesLoading) {
        return <LoadingComp />;
    }

    // Error state - if editing but no exam found
    if (isEdit && !selectedExam) {
        return (
            <div className="container mx-auto py-6">
                <Card>
                    <CardContent className="text-center py-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Sınav Bulunamadı
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Düzenlemek istediğiniz sınav bulunamadı veya erişim yetkiniz bulunmuyor.
                        </p>
                        <Button onClick={() => router.push('/exams')}>
                            Sınav Listesine Dön
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Geri
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {isEdit ? 'Sınav Düzenle' : 'Yeni Sınav Oluştur'}
                        </h1>
                        {isEdit && selectedExam && (
                            <p className="text-gray-500">
                                {selectedExam.name} ({selectedExam.code})
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="flex items-center gap-2"
                    >
                        <X className="h-4 w-4" />
                        İptal
                    </Button>
                </div>
            </div>

            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500">
                <ol className="flex items-center space-x-2">
                    <li>
                        <button
                            onClick={() => router.push('/exams')}
                            className="hover:text-gray-700"
                        >
                            Sınavlar
                        </button>
                    </li>
                    <li>/</li>
                    <li>{isEdit ? 'Düzenle' : 'Yeni Sınav'}</li>
                </ol>
            </nav>

            {/* Form */}
            <div className="max-w-4xl">
                <ExamForm
                    exam={selectedExam}
                    onSubmit={handleSubmit}
                    loading={examLoading}
                    examTypes={examTypes}
                    questionGroups={questionGroups}
                    branches={filteredBranches.length > 0 ? filteredBranches : branches || []}
                    brands={brands || []}
                    onExamTypeChange={handleExamTypeChange}
                    onBrandChange={handleBrandChange}
                />
            </div>



        </div>
    );
};

