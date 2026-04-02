'use client';

import React from "react";
import type {ApplicationDto} from "@/api/generated/model";
import {X} from "lucide-react";

export const ChatWindow = ({ participant, onClose }: {
    participant: ApplicationDto;
    onClose: () => void;
}) => {

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white border-2 border-gray-300 rounded-lg shadow-xl flex flex-col z-50">
            {/* Header */}
            <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white">
                        {participant.candidatePhotoUrl ? (
                            <img 
                                src={participant.candidatePhotoUrl} 
                                alt={participant.candidateName} 
                                className="w-full h-full object-cover" 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-blue-500 text-sm font-semibold">
                                {participant.candidateName ? participant.candidateName.charAt(0) : 'X'}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold">
                            {participant.candidateName} {participant.candidateLastName}
                        </span>
                    </div>
                </div>
                <button 
                    onClick={onClose} 
                    className="text-white hover:text-gray-200 text-xl transition-colors"
                    aria-label="Kapat"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Disabled Message */}
            <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
                <div className="text-center text-gray-500">
                    <p className="text-sm font-medium mb-2">Chat özelliği devre dışı</p>
                    <p className="text-xs">Bu özellik şu an kapalı</p>
                </div>
            </div>
        </div>
    );
};