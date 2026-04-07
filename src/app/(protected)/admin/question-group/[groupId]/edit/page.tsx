'use client';


import PageHeader from "@/components/layout/page-header";
import React, {useEffect} from "react";
import QuestionGroupForm from "@/components/form/QuestionGroupForm";
import {useGetAllExamTypes} from "@/api/generated/exam-type-management/exam-type-management";
import type { ApiResponseExamTypeListResponse } from "@/api/generated/model";
import {useGetQuestionGroupTypesByExamSection} from "@/api/generated/question-group-type-management/question-group-type-management";
import {useGetExamSectionsByExamType} from "@/api/generated/exam-section-management/exam-section-management";
import {useGetQuestionGroupById, useUpdateQuestionGroup} from "@/api/generated/question-group-management/question-group-management";
import {useParams, useRouter} from "next/navigation";
import type {ApiResponseListExamSectionDto, ApiResponseListQuestionGroupTypeDto, CreateQuestionGroupRequest, ApiResponseQuestionGroupDto} from "@/api/generated/model";
import { useQueryClient } from "@tanstack/react-query";
import { showNotification, getErrorMessage } from "@/lib/notification";

export default function QuestionGroupUpdate() {

    const params = useParams();
    const groupId = params.groupId as string;
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: examTypesData } = useGetAllExamTypes<ApiResponseExamTypeListResponse>(undefined);
    const examTypes = examTypesData?.data || null;

    const {data: questionGroupData, isLoading: loading} = useGetQuestionGroupById<ApiResponseQuestionGroupDto>(groupId, {
        query: { enabled: !!groupId }
    });
    const selectedQuestionGroup = questionGroupData?.data;
    
    const { mutate: updateQuestionGroup, isPending: updating } = useUpdateQuestionGroup({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['/question-groups'] });
                queryClient.invalidateQueries({ queryKey: [`/question-groups/${groupId}`] });
                showNotification.success('Soru grubu başarıyla güncellendi!');
                router.push(`/admin/question-group/${groupId}`);
            },
            onError: (error) => {
                const errorMessage = getErrorMessage(error);
                showNotification.error(errorMessage || 'Soru grubu güncellenirken bir hata oluştu!');
            }
        }
    });
    
    const handleSubmit = async (data: CreateQuestionGroupRequest) => {
        updateQuestionGroup({ id: groupId, data });
    };

    const [selectedExamTypeId, setSelectedExamTypeId] = React.useState<string>('');
    const { data: sectionsData } = useGetExamSectionsByExamType<ApiResponseListExamSectionDto>(selectedExamTypeId, {
        query: { enabled: !!selectedExamTypeId }
    });
    const sectionsByExamType = sectionsData?.data || [];

    const [selectedExamSectionId, setSelectedExamSectionId] = React.useState<string>('');
    const { data: typesData } = useGetQuestionGroupTypesByExamSection<ApiResponseListQuestionGroupTypeDto>(selectedExamSectionId, {
        query: { enabled: !!selectedExamSectionId }
    });
    const typesByExamSection = typesData?.data || [];

    const onExamTypeChange = (examTypeId: string) => {
        setSelectedExamTypeId(examTypeId);
    }

    const onExamSectionChange = (examSectionId: string) => {
        setSelectedExamSectionId(examSectionId);
    }

    useEffect(() => {
        if (selectedQuestionGroup) {
            onExamTypeChange(selectedQuestionGroup.examType?.id || '')
            onExamSectionChange(selectedQuestionGroup.examSection?.id || '')
        }
    }, [selectedQuestionGroup]);




    return (
        <div className="space-y-6">
            <PageHeader/>
            <div className="p-1">
                {
                    selectedQuestionGroup && sectionsByExamType.length>0 && typesByExamSection.length>0 &&
                    <QuestionGroupForm questionGroup={selectedQuestionGroup} onExamSectionChange={onExamSectionChange}
                                       onExamTypeChange={onExamTypeChange}
                                       onSubmit={handleSubmit}
                                       examTypes={examTypes?.examTypes || []}
                                       examSections={sectionsByExamType}
                                       questionGroupTypes={typesByExamSection}
                                       loading={loading || updating}/>
                }


            </div>
        </div>


    )
}