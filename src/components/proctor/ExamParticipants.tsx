import React, {useEffect, useState} from 'react';
import {Clock, MessageCircle, Pause, CheckCircle, Play, XCircle} from 'lucide-react';
import {ChatWindow} from "@/components/proctor/ChatWindow";
import {ApplicationDto} from "@/types/management/brand";
import {ESessionState} from "@/types/exam/enum";
import OnlineStatusIndicator from '@/components/admin/OnlineStatusIndicator';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {useApplication} from "@/hooks/exam/use-application";
import {ESessionState as ESessionStateEnum} from "@/types/exam/enum";

const ParticipantCard = ({participant, onFreeze, onComplete, onChat, isOnline, onStart, onStop, onFinish}: {
    participant: ApplicationDto;
    onFreeze: (id: string) => void;
    onComplete: (id: string) => void;
    onChat: (participant: ApplicationDto) => void;
    isOnline: boolean;
    onStart?: (id: string) => void;
    onStop?: (id: string) => void;
    onFinish?: (id: string) => void;
}) => {

    const getBorderColor = () => {
        switch (participant.sessionState) {
            case ESessionState.NOT_STARTED:
                return 'border-gray-300';
            case ESessionState.IN_PROGRESS:
                return 'border-blue-500 bg-orange-50';
            case ESessionState.FINISHED:
                return 'border-green-500 bg-purple-100';
            case ESessionState.CANCELLED:
                return 'border-red-500 bg-purple-100';
            default:
                return 'border-gray-300';
        }
    };

    const getStatusText = () => {
        switch (participant.sessionState) {
            case ESessionState.NOT_STARTED:
                return 'Başlamadı';
            case ESessionState.IN_PROGRESS:
                return 'Devam Ediyor';
            case ESessionState.FINISHED:
                return 'Tamamlandı';
            case ESessionState.CANCELLED:
                return 'İptal Edildi';
            default:
                return 'Duraklatıldı';
        }
    };

    return (
        <div className={`border-2 ${getBorderColor()} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    {/* Online Status + Photo */}
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {participant.candidatePhotoUrl ? (
                                <img
                                    src={participant.candidatePhotoUrl}
                                    alt={participant.candidateName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-semibold">
                                    {participant.candidateName && participant.candidateName.charAt(0)}
                                </div>
                            )}
                        </div>
                        {/* Online Status Badge */}
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                            <OnlineStatusIndicator isOnline={isOnline} size="sm" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 truncate">
                                {participant.candidateName} {participant.candidateLastName}
                            </h3>
                            {isOnline && (
                                <span className="text-xs text-green-600 font-medium">
                                    • Online
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">{getStatusText()}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 flex-1 justify-center">
                    {participant.sessionState !== ESessionState.NOT_STARTED && (
                        <>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400"/>
                                <div className="text-sm">
                                    <div className="text-gray-500">Başlangıç</div>
                                    <div className="font-medium">{participant.startedAt?.toString()}</div>
                                </div>
                            </div>

                            <div className="text-sm">
                                <div className="text-gray-500">Süre</div>
                                <div className="font-medium">{participant.duration as string || ''}</div>
                            </div>

                            {participant.sessionState === ESessionState.IN_PROGRESS && (
                                <div className="text-sm">
                                    <div className="text-gray-500">Soru</div>
                                    <div className="font-medium">
                                        participant.currentQuestion/participant.totalQuestions
                                    </div>
                                </div>
                            )}

                            {participant.sessionState === ESessionState.FINISHED && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500"/>
                                    <div className="text-sm">
                                        <div className="text-gray-500">Bitiş</div>
                                        <div className="font-medium">{participant.endedAt?.toString()}</div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Başlat/Durdur butonu - isFinish false ise görünür */}
                    {!((participant as any).isFinish === true) && (
                        <>
                            {onStart && !participant.startedAt && (
                                <button
                                    onClick={() => onStart(participant.id || '')}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                                >
                                    <Play className="w-4 h-4"/>
                                    Başlat
                                </button>
                            )}
                            {onStop && participant.startedAt && !participant.endedAt && (
                                <button
                                    onClick={() => onStop(participant.id || '')}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                                >
                                    <XCircle className="w-4 h-4"/>
                                    Durdur
                                </button>
                            )}
                        </>
                    )}
                    {/* OTURUMU SONLANDIR butonu */}
                    {onFinish && (
                        <button
                            onClick={() => onFinish(participant.id || '')}
                            disabled={(participant as any).isFinish === true}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm ${
                                (participant as any).isFinish === true
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-red-500 hover:bg-red-600 text-white'
                            }`}
                        >
                            {(participant as any).isFinish === true ? (
                                <>
                                    <CheckCircle className="w-4 h-4"/>
                                    OTURUM SONLANDI
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-4 h-4"/>
                                    OTURUMU SONLANDIR
                                </>
                            )}
                        </button>
                    )}

                    {/* Chat butonu sadece online ise göster */}
                    {isOnline && (
                        <button
                            onClick={() => onChat(participant)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                        >
                            <MessageCircle className="w-4 h-4"/>
                            Chat
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

interface ExamTypeFormProps {
    candidates: ApplicationDto[];
}

const ExamParticipants: React.FC<ExamTypeFormProps> = ({ candidates }) => {
    const [chatParticipant, setChatParticipant] = useState<ApplicationDto | null>(null);
    const { isOnline ,onlineUsers} = useOnlineStatus();
    const {setApplicationStartedAt, setApplicationEndedAt, updateApplicationSessionState, loading} = useApplication();



    useEffect(() => {
        console.log('👥 All candidates:');
        candidates.forEach(c => {
            console.log('  -', {
                id: c.id,
                name: c.candidateName,
                username: c.username, // 🔑 Bu field var mı kontrol et
            });
        });
        console.log('🟢 Online users:', Array.from(onlineUsers));
    }, [candidates, onlineUsers]);


    const handleStart = async (id: string) => {
        try {
            await setApplicationStartedAt(id);
            await updateApplicationSessionState(id, ESessionStateEnum.IN_PROGRESS);
        } catch (err) {
            console.error('Error starting application:', err);
        }
    };

    const handleStop = async (id: string) => {
        try {
            await setApplicationEndedAt(id);
        } catch (err) {
            console.error('Error stopping application:', err);
        }
    };

    const handleFinish = async (id: string) => {
        if (window.confirm('Bu başvuruyu sonlandırmak istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
            try {
                // Application için isFinish endpoint'i yok gibi görünüyor, 
                // bu yüzden sessionState'i FINISHED yapıyoruz
                await updateApplicationSessionState(id, ESessionStateEnum.FINISHED);
                await setApplicationEndedAt(id);
            } catch (err) {
                console.error('Error finishing application:', err);
            }
        }
    };

    const handleFreeze = (id: string) => {
        console.log('Donduruldu:', id);
    };

    const handleComplete = (id: string) => {
        console.log('Bitirildi:', id);
    };

    const handleChat = (participant: ApplicationDto) => {
        setChatParticipant(participant);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-3">
            <div className="max-w-7xl mx-auto">
                <div className="space-y-3">

                    {candidates && candidates.map((participant) => (
                        <ParticipantCard
                            key={participant.id}
                            participant={participant}
                            onFreeze={handleFreeze}
                            onComplete={handleComplete}
                            onChat={handleChat}
                            isOnline={isOnline(participant.username || '')}
                            onStart={handleStart}
                            onStop={handleStop}
                            onFinish={handleFinish}
                        />
                    ))}
                </div>

                {chatParticipant && (
                    <ChatWindow
                        participant={chatParticipant}
                        onClose={() => setChatParticipant(null)}
                    />
                )}
            </div>
        </div>
    );
}

export default ExamParticipants;