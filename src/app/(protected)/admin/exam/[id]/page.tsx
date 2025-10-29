'use client';
import React, {useContext, useEffect} from "react";
import PageHeader from "@/components/layout/page-header";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import {DataContext} from "@/contexts/data-context";
import { useExamContext } from '@/contexts/ExamContext';
import {useParams} from "next/navigation";
import {useExam} from "@/hooks/exam/use-exam";
import LoadingComp from "@/components/ui/loading-comp";
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
        setStep('section-selection')
    }, [examId]);

    useEffect(() => {
        if(selectedExam){
            setExam(selectedExam)
        }
    }, [selectedExam]);






    if (loading) {
        return (
            <LoadingComp/>
        );
    }



    const renderContent = () => {
        switch (state.currentStep) {

            case 'section-selection' :
                return null // <ExamSectionsList sections={getUniqueSortedExamSections()} onSectionSelect={onSectionSelect}/>;
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