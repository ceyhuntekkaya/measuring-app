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

export default function UserDashboard() {
    const {logout} = useAuth();
    const router = useRouter();
    const {application} = useExamApplicationContext();



    const renderContent = () => {
        if(application){
            if(!application?.voiceControl){
                return <AudioRecorder applicationId={application?.id} />
            } else if(!application?.cameraControl){
                return <PassportPhotoCamera applicationId={application?.id} title={"Vesikalık Fotoğraf"} uploadState={"faceControl"} updateState={EApplicationUpdateState.CAMERA} />
            }
            else if(!application?.idCartControl){
                return <PassportPhotoCamera applicationId={application?.id} title={"Kimlik Fotoğrafı"} uploadState={"idCartControl"} updateState={EApplicationUpdateState.ID_CART} />
            }
            else {
                return  <div>SINAVI BAŞLATMAYA HAZIRSIN....</div>
            }
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