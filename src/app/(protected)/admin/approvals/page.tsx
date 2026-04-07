'use client';
import {Column, RecordType} from "@/types/ui/table";
import React, {useState, useMemo, useCallback} from "react";
import PageHeader from "@/components/layout/page-header";
import DynamicTable from "@/components/ui/dynamic-table";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {useRouter} from "next/navigation";
import LoadingComp from "@/components/ui/loading-comp";
import {useGetAllQuestionGroups} from "@/api/generated/question-group-management/question-group-management";
import {extractApiListData} from "@/utils/api-helpers/extract-api-data";
import type {QuestionGroupDto, QuestionDto} from "@/api/generated/model";
import {statusConverter, approvalStatusConverter} from "@/utils/enum-converter";
import {EStatus, EApprovalStatus} from "@/types/exam/enum";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";


export default function ApprovalsPage() {
    const router = useRouter();
    const {data, isLoading, error} = useGetAllQuestionGroups({
        query: {
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            staleTime: 0,
        }
    });
    const questionGroups = useMemo(() => extractApiListData<QuestionGroupDto>(data), [data]);
    
    const [filterStatus, setFilterStatus] = useState<EApprovalStatus | 'ALL'>(EApprovalStatus.PENDING);
    
    // Filtrelenmiş soru grupları
    const filteredQuestionGroups = useMemo(() => {
        if (filterStatus === 'ALL') {
            return questionGroups;
        }
        return questionGroups.filter(group => group.approvalStatus === filterStatus);
    }, [questionGroups, filterStatus]);

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
            key: 'approvalStatus',
            header: 'Onay Durumu',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/question-group/${record.id}`)}
                >
                    {approvalStatusConverter(value as string)}
                </div>
            )
        },
        {
            key: 'questions',
            header: 'Sorular',
            render: (value, record) => {
                const questionGroup = record as QuestionGroupDto;
                const questions = (questionGroup.questions || []) as QuestionDto[];
                
                if (questions.length === 0) {
                    return <div className="text-gray-400">Soru yok</div>;
                }
                
                // Status'e göre grupla
                const statusCounts = questions.reduce((acc: Record<string, number>, question: QuestionDto) => {
                    const status = question.status || 'ACTIVE';
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);
                
                // İstatistikleri göster
                return (
                    <div className="space-y-1 text-sm">
                        {Object.entries(statusCounts).map(([status, count]) => (
                            <div key={status}>
                                {count} {statusConverter(status as EStatus)} Soru
                            </div>
                        ))}
                    </div>
                );
            }
        },
        {
            key: 'id',
            header: ' ',
            render: (value, record) => (
                <div className="font-medium cursor-pointer hover:text-blue-600">
                    <button 
                        className="btn btn-success"
                        onClick={() => router.push(`/admin/approvals/${record.id}/preview`)}
                    >
                        Onay Bilgisi Gir
                    </button>
                </div>
            )
        }
    ], [router]);

    const handleAdd = useCallback(() => {
        router.push('/admin/question-group/add');
    }, [router]);


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
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Onay Durumuna Göre Filtrele
                    </label>
                    <Select
                        value={filterStatus}
                        onValueChange={(value) => setFilterStatus(value as EApprovalStatus | 'ALL')}
                        className="w-64"
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Durum seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tümü</SelectItem>
                            <SelectItem value={EApprovalStatus.PENDING}>
                                {approvalStatusConverter(EApprovalStatus.PENDING)}
                            </SelectItem>
                            <SelectItem value={EApprovalStatus.APPROVED}>
                                {approvalStatusConverter(EApprovalStatus.APPROVED)}
                            </SelectItem>
                            <SelectItem value={EApprovalStatus.REJECTED}>
                                {approvalStatusConverter(EApprovalStatus.REJECTED)}
                            </SelectItem>
                            <SelectItem value={EApprovalStatus.CANCELLED}>
                                {approvalStatusConverter(EApprovalStatus.CANCELLED)}
                            </SelectItem>
                            <SelectItem value={EApprovalStatus.EXPIRED}>
                                {approvalStatusConverter(EApprovalStatus.EXPIRED)}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {filteredQuestionGroups && filteredQuestionGroups.length > 0 && (
                    <DynamicTable columns={columns} data={filteredQuestionGroups as RecordType[]}/>
                )}
            </div>
        </div>
    );
}