'use client';


import {useAuth} from "@/hooks/use-auth";
import React from "react";
import {useExamApplicationContext} from "@/contexts/ExamApplicationContext";
import {ActionButtons} from "@/components/ui/simple-dropdown";
import PageFooter from "@/components/layout/page-footer";
import PageExamHeader from "@/components/layout/page-exam-header";
import {useRouter} from "next/navigation";
import PassportPhotoCamera from "@/components/take/PassportPhotoCamera";
import AudioRecorder from "@/components/take/AudioRecorder";
import {EApplicationUpdateState} from "@/types/exam/enum";

export default function UserStartPage() {
    const {logout} = useAuth();
    const router = useRouter();
    const {application} = useExamApplicationContext();



    const renderContent = () => {
        if(!application || !application.id) {
            return null;
        }
        
        const applicationId = application.id;
        
        if(!application.voiceControl){
            return <AudioRecorder applicationId={applicationId} />
        } else if(!application.cameraControl){
            return <PassportPhotoCamera applicationId={applicationId} title={"Vesikalık Fotoğraf"} uploadState={"faceControl"} updateState={EApplicationUpdateState.CAMERA} />
        }
        else if(!application.idCartControl){
            return <PassportPhotoCamera applicationId={applicationId} title={"Kimlik Fotoğrafı"} uploadState={"idCartControl"} updateState={EApplicationUpdateState.ID_CART} />
        }
        else {
            return (
                <div className="flex items-center justify-center">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-2xl border-4 border-green-400 p-6 max-w-2xl w-full mx-4">
                        <div className="text-center">
                            <div className="mb-6">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 animate-pulse">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight">
                                SINAVI BAŞLATMAYA HAZIRSIN
                            </h1>
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    };




    // Bugünün tarihini kontrol et (saat bilgisi olmadan sadece gün)




    return (
        <div className="space-y-6">
            <PageExamHeader actions={
                <ActionButtons
                    onAdd={logout}
                    addButtonText="Çıkış"
                />
            }/>
            <div>
                {renderContent()}
            </div>



            <PageFooter actions={
                !application?.idCartControl ? <></> :
                <ActionButtons
                    onAdd={() => {
                        router.push('/learner/check/start');
                    }}
                    addButtonText="SONRAKİ"
                />
            }/>
        </div>
    );
}