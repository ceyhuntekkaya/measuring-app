'use client';

import React, { useEffect, useState } from 'react';
import {useRouter} from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from 'lucide-react';
import LoadingComp from '@/components/ui/loading-comp';
import {useGetAllBranches} from "@/api/generated/branch-management/branch-management";
import {useGetAllBrands} from "@/api/generated/brand-management/brand-management";
import type {ExamTypeDto} from "@/api/generated/model";
import { getAllExamTypes } from "@/api/generated/exam-type-management/exam-type-management";
import type { ApiResponseExamTypeListResponse, ApiResponseListBrandDto, ApiResponseListBranchDto, QuestionGroupDto } from "@/api/generated/model";
import ExamForm from "@/components/form/exam-form";
import {useCreateExam} from "@/api/generated/exam-management/exam-management";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";
import type { CreateExamRequest, UpdateExamRequest } from "@/api/generated/model";
import {useGetQuestionGroupsByExamType} from "@/api/generated/question-group-management/question-group-management";
import type {BranchDto} from "@/api/generated/model";


export default function ExamFormPage() {
    const router = useRouter();


    const queryClient = useQueryClient();
    
    const { mutate: createExam, isPending: examLoading } = useCreateExam({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/exams'] });
                showNotification.success('Sınav başarıyla oluşturuldu!');
                router.push('/admin/exams');
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Sınav oluşturulurken bir hata oluştu!');
            }
        }
    });

    const { data: brandsData, isLoading: brandsLoading } = useGetAllBrands();
    const brands = (brandsData as ApiResponseListBrandDto)?.data || null;

    const { data: branchesData, isLoading: branchesLoading } = useGetAllBranches();
    const branches = (branchesData as ApiResponseListBranchDto)?.data || null;

    const [selectedExamTypeId, setSelectedExamTypeId] = React.useState<string>('');
    const { data: questionGroupsData, isLoading: questionGroupsLoading } = useGetQuestionGroupsByExamType(selectedExamTypeId, {
        query: { enabled: !!selectedExamTypeId }
    });
    const questionGroups = (questionGroupsData as { data?: QuestionGroupDto[] })?.data || [];
    

    
    const getQuestionGroupsByExamType = React.useCallback((examTypeId: string) => {
        setSelectedExamTypeId(examTypeId);
    }, []);

    // Local state for form dependencies
    const [examTypes, setExamTypes] = useState<ExamTypeDto[]>([]);
    const [filteredBranches, setFilteredBranches] = useState<BranchDto[]>([]);
    const [loadingDependencies, setLoadingDependencies] = useState(true);

    // Load exam types
    const loadExamTypes = React.useCallback(async () => {
        try {
            const response = await getAllExamTypes({});
            const apiResponse = response as unknown as ApiResponseExamTypeListResponse;
            if (apiResponse.success && apiResponse.data) {
                setExamTypes(apiResponse.data.examTypes || []);
            }
        } catch (error) {
            console.error('Error loading exam types:', error);
        }
    }, []);

    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoadingDependencies(true);
                // Load all required data in parallel
                await Promise.all([
                    loadExamTypes()
                ]);

            } catch (error) {
                console.error('Error loading initial data:', error);
            } finally {
                setLoadingDependencies(false);
            }
        };

        loadInitialData();
    }, [loadExamTypes]);

    // Handle brand change
    const handleBrandChange = async (brandId: string) => {
        if (brandId && branches) {
            const filtered = branches.filter(branch => branch.brandId === brandId);
            setFilteredBranches(filtered);
        } else {
            setFilteredBranches([]);
        }
    };

    // Handle exam type change
    const handleExamTypeChange = (examTypeId: string) => {
        getQuestionGroupsByExamType(examTypeId);
    };

    // Handle form submission - formData is already CreateExamRequest!
    const handleSubmit = async (formData: CreateExamRequest | UpdateExamRequest) => {
        createExam({ data: formData as CreateExamRequest });
    };

    // Handle cancel
    const handleCancel = () => {
        router.push('/exams');
    };

    // Loading state
    if (loadingDependencies || examLoading || brandsLoading || branchesLoading || questionGroupsLoading) {
        return <LoadingComp />;
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
                            Yeni Sınav Oluştur
                        </h1>

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
                    <li>Yeni Sınav</li>
                </ol>
            </nav>

            {/* Form */}
            <div className="max-w-4xl">
                <ExamForm
                    exam={null}
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

