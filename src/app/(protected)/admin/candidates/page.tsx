'use client';

import PageHeader from "@/components/layout/page-header";
import React, {useEffect, useState, useMemo} from "react";
import {useRouter} from "next/navigation";
import {Column, RecordType} from "@/types/ui/table";
import LoadingComp from "@/components/ui/loading-comp";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import DynamicTable from "@/components/ui/dynamic-table";
import {useGetAllCandidates} from "@/api/generated/candidate-management/candidate-management";
import type {CandidateDto, ApiResponseListCandidateDto} from "@/api/generated/model";
import {useCreateApplication} from "@/api/generated/application-management/application-management";
import {useGetAllExams} from "@/api/generated/exam-management/exam-management";
import type { ApiResponseListExamDto, CreateApplicationRequest, ApiResponseExamSessionListResponse, ExamSessionDto } from "@/api/generated/model";
import type {ExamDto} from "@/api/generated/model";
import {useGetUpcomingExamSessions} from "@/api/generated/exam-session-management/exam-session-management";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import siteConfig from '@/config/config.json';
import {useQueryClient} from "@tanstack/react-query";


export default function CandidatePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [selectedExamSession, setSelectedExamSession] = useState<ExamSessionDto | null>(null);
    const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
    const [filteredCandidates, setFilteredCandidates] = useState<CandidateDto[]>([]);
    const [showExamModal, setShowExamModal] = useState(false);
    const [filteredExams, setFilteredExams] = useState<ExamDto[]>([]);

    const LINK_URL = siteConfig.api.linkUrl;

    const {data: candidatesData, isLoading: loading} = useGetAllCandidates({
        query: {
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            staleTime: 0,
        }
    });
    
    const candidates = useMemo(() => {
        if (candidatesData && typeof candidatesData === 'object' && 'data' in candidatesData) {
            const apiData = (candidatesData as any).data;
            if (Array.isArray(apiData)) {
                return apiData as CandidateDto[];
            }
        }
        return (candidatesData as unknown as ApiResponseListCandidateDto)?.data || null;
    }, [candidatesData]);

    const { data: examsData } = useGetAllExams({
        query: {
            refetchOnMount: true,
            staleTime: 0,
        }
    });
    
    const exams = useMemo(() => {
        if (examsData && typeof examsData === 'object' && 'data' in examsData) {
            const apiData = (examsData as any).data;
            if (Array.isArray(apiData)) {
                return apiData as ExamDto[];
            }
        }
        return (examsData as unknown as ApiResponseListExamDto)?.data || null;
    }, [examsData]);

    const { data: sessionsData } = useGetUpcomingExamSessions({
        query: {
            refetchOnMount: true,
            refetchOnWindowFocus: false,
            staleTime: 0,
        }
    });
    
    const upcomingExamSessions = useMemo(() => {
        if (sessionsData && typeof sessionsData === 'object' && 'data' in sessionsData) {
            const apiData = (sessionsData as any).data;
            // Nested yapı: { data: { examSessions: [...] } }
            if (apiData && typeof apiData === 'object' && 'examSessions' in apiData) {
                return Array.isArray(apiData.examSessions) ? apiData.examSessions : [];
            }
            // Direct array: { data: [...] }
            if (Array.isArray(apiData)) {
                return apiData;
            }
        }
        // Fallback
        return ((sessionsData as unknown as ApiResponseExamSessionListResponse)?.data?.examSessions || []) as ExamSessionDto[];
    }, [sessionsData]);

    const createApplicationMutation = useCreateApplication();
    const createApplication = async (data: CreateApplicationRequest) => {
        await createApplicationMutation.mutateAsync({ data });
        queryClient.invalidateQueries({ queryKey: ['/candidates'] });
    };

    // ExamSession seçildiğinde candidate'leri filtrele
    useEffect(() => {
        if (selectedExamSession && candidates) {
            const filtered = candidates.filter(candidate =>
                candidate.examSessionId === selectedExamSession.id
            );
            setFilteredCandidates(filtered);
            setSelectedCandidates([]); // Seçimleri temizle
        }
    }, [selectedExamSession, candidates]);

    // İlk examSession'ı otomatik seç
    useEffect(() => {
        if (upcomingExamSessions && upcomingExamSessions.length > 0 && !selectedExamSession) {
            setSelectedExamSession(upcomingExamSessions[0]);
        }
    }, [upcomingExamSessions, selectedExamSession]);

    const handleExamSessionChange = (sessionId: string) => {
        const session = upcomingExamSessions?.find(s => s.id === sessionId);
        if (session) {
            setSelectedExamSession(session);
        }
    };


    /*
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedCandidates(filteredCandidates.map(c => c.id));
        } else {
            setSelectedCandidates([]);
        }
    };

     */

    const handleSelectCandidate = (candidateId: string, checked: boolean) => {
        if (checked) {
            setSelectedCandidates(prev => [...prev, candidateId]);
        } else {
            setSelectedCandidates(prev => prev.filter(id => id !== candidateId));
        }
    };

    const handleManualAssignment = () => {
        if (!selectedExamSession || !selectedExamSession.examType?.id) return;

        const examTypeId = selectedExamSession.examType.id;
        // Seçili examSession'ın examType'ına göre exam'ları filtrele
        const filtered = exams?.filter(exam =>
            exam.examType?.id === examTypeId
        ) || [];

        setFilteredExams(filtered);
        setShowExamModal(true);
    };

    const handleAutoAssignment = () => {
        handleAssignApplications(null);
    };

    const handleAssignApplications = async (selectedExam: ExamDto | null) => {


        if (!selectedExamSession || selectedCandidates.length === 0) return;

        // Kota kontrolü
        const currentApplicationCount = candidates?.filter(c =>
            c.examSessionId === selectedExamSession.id && c.application
        ).length || 0;

        const availableQuota = (selectedExamSession.quota || 0) - currentApplicationCount;

        if (selectedCandidates.length > availableQuota) {
            alert(`Kota yetersiz! Mevcut kota: ${availableQuota}, Seçili candidate sayısı: ${selectedCandidates.length}`);
            return;
        }

        try {
            // Her seçili candidate için application oluştur
            for (const candidateId of selectedCandidates) {
                await createApplication({
                    name: `Application for ${candidateId}`,
                    code: `APP-${Date.now()}-${candidateId.substring(0, 8)}`,
                    examId: selectedExam?.id || '',
                    examSessionId: selectedExamSession.id || '',
                    candidateId: candidateId,
                    username: `user_${candidateId.substring(0, 8)}`
                });
            }


            // İşlem tamamlandıktan sonra listeyi yenile
            queryClient.invalidateQueries({ queryKey: ['/candidates'] });
            setSelectedCandidates([]);
            setShowExamModal(false);

            alert(`${selectedCandidates.length} candidate'e başarıyla application atandı!`);
        } catch (error) {
            console.error('Application atama hatası:', error);
            alert('Application atama sırasında hata oluştu!');
        }
    };


    /*
    <input
                    type="checkbox"
                    checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                />
     */
    const columns: Column<RecordType>[] = [

        {
            key: 'checkbox',
            header: 'SEÇ',
            render: (value, record) => {
                const candidateId = (record as CandidateDto).id;
                if (!candidateId) return null;
                return (
                    <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidateId)}
                        onChange={(e) => handleSelectCandidate(candidateId, e.target.checked)}
                        className="rounded border-gray-300"
                    />
                );
            }
        },
        {
            key: 'name',
            header: 'Ad',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/candidates/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'lastName',
            header: 'Soyadı',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/candidates/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'identityNumber',
            header: 'Kimlik No',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/candidates/${record.id}`)}
                >
                    {value as string}
                </div>
            )
        },
        {
            key: 'examSession',
            header: 'Oturum',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/admin/candidates/${record.id}`)}
                >
                    {(record as CandidateDto).examSession?.name}
                </div>
            )
        },
        {
            key: 'application',
            header: 'Uygulama Kod',
            render: (value, record) => (
                <div
                    className="font-medium cursor-pointer hover:text-blue-600"

                >
                    {
                        (record as CandidateDto).application?.code ?
                        `${LINK_URL}${(record as CandidateDto).application?.code}`
                        : 'Atanmamış'

                    }
                </div>
            )
        }
    ];

    const handleAdd = () => {
        router.push('/admin/candidates/add');
    };

    if (loading) {
        return (
            <LoadingComp/>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    onAdd={handleAdd}
                    addButtonText="Yeni Katılımcı Tanımla"
                />
            }/>

            <div className="p-6 pt-1">
                <div className="mb-6">
                    <Label htmlFor="examType">Sınav Oturumu Seçin:</Label>
                    <Select
                        onValueChange={(value) => handleExamSessionChange(value as string)}
                        value={selectedExamSession?.id || ''}
                    >
                        <SelectTrigger className={'border-red-500'}>
                            <SelectValue placeholder="Sınav tipi seçin"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {upcomingExamSessions && upcomingExamSessions.map((session) => (
                                    <SelectItem key={session.id} value={session.id || ''}>
                                        {session.name} - {session.quota}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Application Atama Butonları */}
                {selectedExamSession && (
                    <div className="mb-4 flex gap-4">
                        <button
                            onClick={handleManualAssignment}
                            disabled={selectedCandidates.length === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Application Manuel Ata ({selectedCandidates.length})
                        </button>
                        <button
                            onClick={handleAutoAssignment}
                            disabled={selectedCandidates.length === 0}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Application Otomatik Ata ({selectedCandidates.length})
                        </button>
                    </div>
                )}

                {/* Candidate Tablosu */}
                {filteredCandidates.length > 0 ? (
                    <DynamicTable columns={columns} data={filteredCandidates as RecordType[]}/>
                ) : selectedExamSession ? (
                    <div className="text-center py-8 text-gray-500">
                        Bu oturuma ait katılımcı bulunamadı.
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Lütfen bir sınav oturumu seçiniz.
                    </div>
                )}
            </div>

            {/* Exam Seçim Modalı */}
            {showExamModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h2 className="text-lg font-semibold mb-4">Sınav Seçin</h2>

                        {filteredExams.length > 0 ? (
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {filteredExams.map((exam) => (
                                    <button
                                        key={exam.id}
                                        onClick={() => handleAssignApplications(exam)}
                                        className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <div className="font-medium">{exam.name}</div>
                                        <div className="text-sm text-gray-500">{exam.code}</div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4 text-gray-500">
                                Bu oturum türüne uygun sınav bulunamadı.
                            </div>
                        )}

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowExamModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                İptal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}