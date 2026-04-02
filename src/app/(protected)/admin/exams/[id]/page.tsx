'use client';

import React, { useEffect, useState } from 'react';
import {useParams, useRouter} from 'next/navigation';
import { Card, CardContent,  } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import LoadingComp from '@/components/ui/loading-comp';
import {useGetAllBranches} from "@/api/generated/branch-management/branch-management";
import {useGetAllBrands} from "@/api/generated/brand-management/brand-management";
import type {ExamTypeDto} from "@/api/generated/model";
import { getAllExamTypes } from "@/api/generated/exam-type-management/exam-type-management";
import type { ApiResponseExamTypeListResponse, ApiResponseListBrandDto, ApiResponseListBranchDto, ExamDto, QuestionGroupDto } from "@/api/generated/model";
import ExamForm from "@/components/form/exam-form";
import {useGetExamById} from "@/api/generated/exam-management/exam-management";
import type { ApiResponseExamDto, CreateExamRequest, UpdateExamRequest } from "@/api/generated/model";
import {useGetQuestionGroupsByExamType} from "@/api/generated/question-group-management/question-group-management";
import type {BranchDto} from "@/api/generated/model";
import PageHeader from "@/components/layout/page-header";


export default function ExamFormPage() {
    const params = useParams();
    const examId = params.id as string;
    const isEdit = Boolean(examId);
    const router = useRouter();

    const { data, isLoading: examLoading } = useGetExamById(examId, {
        query: { enabled: !!examId }
    });
    const selectedExam = (data as ApiResponseExamDto)?.data as ExamDto | undefined;

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

                // Exam data will be loaded automatically by useGetExamById

            } catch (error) {
                console.error('Error loading initial data:', error);
            } finally {
                setLoadingDependencies(false);
            }
        };

        loadInitialData();
    }, [examId, isEdit, loadExamTypes]);

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

    // Handle form submission - formData is already CreateExamRequest/UpdateExamRequest!
    // Note: This page doesn't have mutations, it's just a detail page
    const handleSubmit = async (_formData: CreateExamRequest | UpdateExamRequest) => {
        // This page is read-only, handleSubmit shouldn't be called
        console.warn(_formData);
        console.warn('handleSubmit called on detail page');
    };

    // Handle cancel
    const handleCancel = () => {
        if (isEdit && examId) {
            router.push(`/admin/exams/${examId}`);
        } else {
            router.push('/admin/exams');
        }
    };

    // Loading state
    if (loadingDependencies || examLoading || brandsLoading || branchesLoading || questionGroupsLoading) {
        return <LoadingComp />;
    }

    // Error state - if editing but no exam found
    if (isEdit && !selectedExam) {
        return (
            <div className="space-y-6">
                <PageHeader title="Sınav Bulunamadı" />
                <Card>
                    <CardContent className="text-center py-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Sınav Bulunamadı
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Düzenlemek istediğiniz sınav bulunamadı veya erişim yetkiniz bulunmuyor.
                        </p>
                        <Button onClick={() => router.push('/admin/exams')}>
                            Sınav Listesine Dön
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Sınav Detayı"
                actions={
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="flex items-center gap-2"
                    >
                        <X className="h-4 w-4" />
                        Kapat
                    </Button>
                }
            />

            <div className="p-1">
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

