'use client';
import {Column, RecordType} from "@/types/ui/table";
import React, {useMemo, useCallback, useState} from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import Link from "next/link";
import {useGetAllQuestionGroups} from "@/api/generated/question-group-management/question-group-management";
import {getQuestionsByGroup} from "@/api/generated/question-management/question-management";
import {extractApiListData} from "@/utils/api-helpers/extract-api-data";
import type {QuestionGroupDto, QuestionDto, ApiResponseListQuestionDto} from "@/api/generated/model";
import {statusConverter} from "@/utils/enum-converter";
import {EStatus} from "@/types/exam/enum";
import {hasCorrectAnswer} from "@/utils/question-validation";
import {parseBlobResponse} from "@/utils/api-helpers/parse-blob-response";

export default function QuestionGroupPage() {
    const router = useRouter();
    const {data, isLoading, error} = useGetAllQuestionGroups({
        query: {
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            staleTime: 0,
        }
    });
    
    const questionGroups = useMemo(() => extractApiListData<QuestionGroupDto>(data), [data]);
    const [answerStatusMap, setAnswerStatusMap] = useState<Record<string, 'HAZIR' | 'CEVAP EKSİK'>>({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const columns: Column<RecordType>[] = useMemo(() => [
        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {String(value || '')}
                </div>
            )
        },
        {
            key: 'status',
            header: 'Durum',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {statusConverter(value as EStatus)}
                </div>
            )
        },
        {
            key: 'Sınav Tipi',
            header: 'Sınav Tipi',
            render: (value, record) => {
                const group = record as QuestionGroupDto;
                return (
                    <div
                        className="font-medium cursor-pointer hover:text-blue-600"
                        onClick={() => router.push(`/admin/question-group/${record.id}`)}
                    >
                        {group.examType?.name}<br/>
                        {group.examSection?.name}<br/>
                        {group.questionGroupType?.name}
                    </div>
                );
            }
        },
        {
            key: 'answerStatus',
            header: 'Cevap Durumu',
            render: (value, record) => {
                const groupId = record.id as string;
                const status = answerStatusMap[groupId];
                if (!status) {
                    return <span className="text-gray-400">-</span>;
                }
                return (
                    <div
                        className={`font-medium ${
                            status === 'HAZIR' ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        {status}
                    </div>
                );
            }
        },
        {
            key: 'scoreStatus',
            header: 'Puan Durumu',
            render: (value, record) => {
                const group = record as QuestionGroupDto;
                const groupMaxScore = group.maximumScore || 0;
                const questions = (group.questions || []) as QuestionDto[];
                const questionsTotalScore = questions.reduce((sum, question) => {
                    return sum + (question.maximumScore || 0);
                }, 0);
                const isEqual = groupMaxScore === questionsTotalScore;
                
                return (
                    <div className={`font-medium ${!isEqual ? 'text-red-600' : ''}`}>
                        {groupMaxScore} / {questionsTotalScore}
                    </div>
                );
            }
        },
        {
            key: 'id',
            header: ' ',
            render: (value, record) => 
                {
                    const group = record as QuestionGroupDto;
                    const count = group.questions?.length || 0;
                
                    return( <div className="font-medium cursor-pointer hover:text-blue-600">
                    <Link className="btn btn-success" href={`/admin/question-group/${value}/question`}>
                    {count} {count === 0 ? 'Soru Yok' :  'Soru'  }
                    </Link>
                </div>
            )
        }}
    ], [router, answerStatusMap]);

    const handleAdd = useCallback(() => {
        router.push('/admin/question-group/add');
    }, [router]);

    const handleAnalyzeAnswers = useCallback(async () => {
        if (!questionGroups || questionGroups.length === 0) {
            return;
        }

        setIsAnalyzing(true);
        const statusMap: Record<string, 'HAZIR' | 'CEVAP EKSİK'> = {};

        try {
            // Her question group için soruları çek ve analiz et
            for (const group of questionGroups) {
                if (!group.id) continue;

                try {
                    // API'den soruları çek
                    const blob = await getQuestionsByGroup(group.id);
                    const questionsData = await parseBlobResponse<ApiResponseListQuestionDto>(blob);
                    const questions = questionsData?.data || [];
                    
                    if (questions.length === 0) {
                        statusMap[group.id] = 'CEVAP EKSİK';
                        continue;
                    }

                    // Tüm soruların cevabını kontrol et
                    let allHaveAnswers = true;
                    for (const question of questions) {
                        const hasAnswer = hasCorrectAnswer(
                            question.questionTemplate,
                            question.questionType
                        );
                        if (!hasAnswer) {
                            allHaveAnswers = false;
                            break;
                        }
                    }

                    statusMap[group.id] = allHaveAnswers ? 'HAZIR' : 'CEVAP EKSİK';
                } catch (error) {
                    console.error(`Error analyzing group ${group.id}:`, error);
                    statusMap[group.id] = 'CEVAP EKSİK';
                }
            }

            setAnswerStatusMap(statusMap);
        } catch (error) {
            console.error('Error during analysis:', error);
        } finally {
            setIsAnalyzing(false);
        }
    }, [questionGroups]);


    if (isLoading) {
        return <LoadingComp/>;
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-600">Soru grupları yüklenirken bir hata oluştu.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                    addButtonText="Yeni Soru Grubu"
                />
            }/>

            <div className="p-6 pt-1">
                <button
                    onClick={handleAnalyzeAnswers}
                    disabled={isAnalyzing || !questionGroups || questionGroups.length === 0}
                    className="btn btn-primary"
                >
                    {isAnalyzing ? 'Analiz Ediliyor...' : 'Cevap Durumunu Analiz Et'}
                </button>
            </div>


            <div className="p-6 pt-1">
                {questionGroups && questionGroups.length > 0 && (
                    <DynamicTable columns={columns} data={questionGroups as RecordType[]}/>
                )}
            </div>
        </div>
    );
}