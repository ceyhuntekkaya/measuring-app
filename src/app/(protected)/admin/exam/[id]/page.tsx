'use client';
import React, {useContext, useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import AudioRecorder from "@/components/take/AudioRecorder";
import PassportPhotoCamera from "@/components/take/PassportPhotoCamera";
import {DataContext} from "@/contexts/data-context";
import { useExamContext } from '@/contexts/ExamContext';
import {useParams} from "next/navigation";
import {useExam} from "@/hooks/exam/use-exam";
import LoadingComp from "@/components/ui/loading-comp";
import WelcomeComponent from "@/components/take/WelcomeComponent";
import ExamSectionsList from "@/components/take/SectionList";
import {ExamSectionDto} from "@/types/exam/examTemplates";
import ExamApplicationScreen from "@/components/take/ExamApplicationScreen";

export default function ExamTypePage() {
    const params = useParams();
    const examId = params.id as string;
    const context = useContext(DataContext);
    const { state, setExam, setStep } = useExamContext();
    if (!context) {
        throw new Error("DataContext must be used within a DataContext.Provider");
    }


    const {
        selectedExam,
        loading,
        getExamById
    } = useExam();

    useEffect(() => {
        getExamById(examId)
        setStep('welcome')
    }, [examId]);

    useEffect(() => {
        if(selectedExam){
            setExam(selectedExam)
        }
    }, [selectedExam]);


const changeStep = (step: 'login' | 'welcome' | 'camera' | 'audio' | 'section-selection' | 'exam-taking' | 'completed') => {
    setStep(step);
}

    const onSectionSelect = (section: ExamSectionDto) => {
        setStep('exam-taking');
    }

    if (loading) {
        return (
            <LoadingComp/>
        );
    }
    function getUniqueSortedExamSections(): ExamSectionDto[] {
        if (!selectedExam || !selectedExam.questionGroups || selectedExam.questionGroups.length === 0) {
            return [];
        }

        // Tüm examSection'ları topla
        const allSections = selectedExam.questionGroups
            .map(qg => qg.examSection)
            .filter((section): section is ExamSectionDto => section != null);

        // Unique sections - id'ye göre
        const uniqueSectionsMap = new Map<string, ExamSectionDto>();

        allSections.forEach(section => {
            if (section.id && !uniqueSectionsMap.has(section.id)) {
                uniqueSectionsMap.set(section.id, section);
            }
        });

        // Map'ten array'e çevir ve orderNumber'a göre sırala
        const uniqueSections = Array.from(uniqueSectionsMap.values());

        return uniqueSections.sort((a, b) => {
            const orderA = a.orderNumber ?? Number.MAX_SAFE_INTEGER;
            const orderB = b.orderNumber ?? Number.MAX_SAFE_INTEGER;
            return orderA - orderB;
        });
    }


    const renderContent = () => {
        switch (state.currentStep) {
            case "welcome":
                return <WelcomeComponent setStep={changeStep}/>;
            case "camera":
                return <PassportPhotoCamera setStep={changeStep}/>;
            case "audio":
                return <AudioRecorder setStep={changeStep}/>;
            case 'section-selection' :
                return <ExamSectionsList sections={getUniqueSortedExamSections()} onSectionSelect={onSectionSelect}/>;
            case 'exam-taking' :
                return <ExamApplicationScreen questionGroups={selectedExam?.questionGroups || []} onExitExam={()=>{}} />;
            default:
                return <p>Bilinmeyen durum</p>;
        }
    };




    return (
        <div className="space-y-6">
            <PageHeader actions={
                <ActionButtons
                    addButtonText="Yeni Sınav Tipi Tanımla"
                />
            }/>
            <div className="p-6 pt-1">
                {renderContent()}
            </div>
        </div>
    );
}