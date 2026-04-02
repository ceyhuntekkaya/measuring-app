'use client';
import {Column, RecordType} from "@/types/ui/table";
import React, {useMemo, useCallback} from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import {useGetAllExams} from "@/api/generated/exam-management/exam-management";
import {extractApiListData} from "@/utils/api-helpers/extract-api-data";
import type {ExamDto} from "@/api/generated/model";

export default function ExamPage() {
    const router = useRouter();
    const { data, isLoading, error } = useGetAllExams({
        query: {
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            staleTime: 0,
        }
    });
    
    const exams = useMemo(() => extractApiListData<ExamDto>(data), [data]);

    const getExamTypeName = useCallback((exam: ExamDto) => {
        return exam.examType?.name || '-';
    }, []);

    const getQuestionCount = useCallback((exam: ExamDto) => {
        const groups = exam.questionGroups;
        if (!Array.isArray(groups) || groups.length === 0) return '-';

        let hasQuestionsArray = false;
        const total = groups.reduce((sum, g) => {
            const qs = (g as { questions?: unknown[] }).questions;
            if (Array.isArray(qs)) {
                hasQuestionsArray = true;
                return sum + qs.length;
            }
            return sum;
        }, 0);

        return hasQuestionsArray ? String(total) : '-';
    }, []);

    const getApprovalStatusLabel = useCallback((exam: ExamDto) => {
        const groups = exam.questionGroups;
        if (!Array.isArray(groups) || groups.length === 0) return '-';

        const statuses = groups
            .map(g => (g as { approvalStatus?: string }).approvalStatus)
            .filter((s): s is string => Boolean(s));

        if (statuses.length === 0) return '-';

        // Derive a simple overall status
        const set = new Set(statuses);
        const overall =
            set.has('REJECTED') ? 'REJECTED' :
            set.has('PENDING') ? 'PENDING' :
            set.has('APPROVED') && set.size === 1 ? 'APPROVED' :
            set.has('CANCELLED') ? 'CANCELLED' :
            set.has('EXPIRED') ? 'EXPIRED' :
            'MIXED';

        switch (overall) {
            case 'APPROVED': return 'Onaylandı';
            case 'PENDING': return 'Onay Bekliyor';
            case 'REJECTED': return 'Reddedildi';
            case 'CANCELLED': return 'İptal';
            case 'EXPIRED': return 'Süresi Doldu';
            default: return 'Karışık';
        }
    }, []);

    const tableData = useMemo(() => {
        return (exams || []).map((exam) => ({
            ...exam,
            examTypeName: getExamTypeName(exam),
            approvalStatusLabel: getApprovalStatusLabel(exam),
            questionCount: getQuestionCount(exam),
        })) as RecordType[];
    }, [exams, getApprovalStatusLabel, getExamTypeName, getQuestionCount]);

    const columns: Column<RecordType>[] = useMemo(() => [
        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/exams/${record.id}`)}
                >
                    {String(value || '')}
                </div>
            )
        },
        {
            key: 'examTypeName',
            header: 'Sınav Tipi',
            sortable: true,
            render: (value) => String(value || '-')
        },
        {
            key: 'approvalStatusLabel',
            header: 'Onay',
            sortable: true,
            render: (value) => String(value || '-')
        },
        {
            key: 'questionCount',
            header: 'Soru Sayısı',
            sortable: true,
            render: (value) => String(value || '-')
        },
        {
            key: 'status',
            header: 'Durum',
            sortable: true,
            render: (value) => String(value || '-')
        },
        {
            key: 'code',
            header: 'Kod',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/exams/${record.id}`)}
                >
                    {String(value || '')}
                </div>
            )
        },
        {
            key: 'id',
            header: '',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/exam/${record.id}`)}
                >
                    ÖN İZLEME
                </div>
            )
        }
    ], [router]);

    const handleAdd = useCallback(() => {
        router.push('/admin/exams/add');
    }, [router]);


    if (isLoading) {
        return <LoadingComp/>;
    }

    if (error) {
        return (
            <div className="p-6">
                <p className="text-red-600">Sınavlar yüklenirken bir hata oluştu.</p>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                    addButtonText="Yeni Sınav Tanımla"
                />
            }/>
            <div className="p-6 pt-1">
                {exams && exams.length > 0 && (
                    <DynamicTable columns={columns} data={tableData}/>
                )}
            </div>
        </div>
    );
}