import React, { useState } from 'react';
import { Clock, MessageCircle, Pause, CheckCircle } from 'lucide-react';

interface Participant {
    id: number;
    name: string;
    photo?: string;
    status: 'not-started' | 'in-progress' | 'completed';
    startTime?: string;
    duration?: string;
    currentQuestion?: number;
    totalQuestions: number;
    completionTime?: string;
}

const ParticipantCard = ({ participant, onFreeze, onComplete, onChat }: {
    participant: Participant;
    onFreeze: (id: number) => void;
    onComplete: (id: number) => void;
    onChat: (participant: Participant) => void;
}) => {
    const getBorderColor = () => {
        switch (participant.status) {
            case 'not-started':
                return 'border-gray-300';
            case 'in-progress':
                return 'border-blue-500 bg-orange-50';
            case 'completed':
                return 'border-green-500 bg-purple-100';
            default:
                return 'border-gray-300';
        }
    };

    const getStatusText = () => {
        switch (participant.status) {
            case 'not-started':
                return 'Başlamadı';
            case 'in-progress':
                return 'Devam Ediyor';
            case 'completed':
                return 'Tamamlandı';
        }
    };

    return (
        <div className={`border-2 ${getBorderColor()} rounded-lg p-4  shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {participant.photo ? (
                            <img src={participant.photo} alt={participant.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-semibold">
                                {participant.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{participant.name}</h3>
                        <p className="text-sm text-gray-500">{getStatusText()}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 flex-1 justify-center">
                    {participant.status !== 'not-started' && (
                        <>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <div className="text-sm">
                                    <div className="text-gray-500">Başlangıç</div>
                                    <div className="font-medium">{participant.startTime}</div>
                                </div>
                            </div>

                            <div className="text-sm">
                                <div className="text-gray-500">Süre</div>
                                <div className="font-medium">{participant.duration}</div>
                            </div>

                            {participant.status === 'in-progress' && (
                                <div className="text-sm">
                                    <div className="text-gray-500">Soru</div>
                                    <div className="font-medium">{participant.currentQuestion}/{participant.totalQuestions}</div>
                                </div>
                            )}

                            {participant.status === 'completed' && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <div className="text-sm">
                                        <div className="text-gray-500">Bitiş</div>
                                        <div className="font-medium">{participant.completionTime}</div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {participant.status === 'in-progress' && (
                        <>
                            <button
                                onClick={() => onFreeze(participant.id)}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                            >
                                <Pause className="w-4 h-4" />
                                Dondur
                            </button>
                            <button
                                onClick={() => onComplete(participant.id)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Bitir
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => onChat(participant)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors text-sm"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Chat
                    </button>
                </div>
            </div>
        </div>
    );
};

const ChatWindow = ({ participant, onClose }: {
    participant: Participant;
    onClose: () => void;
}) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Array<{ from: string; text: string }>>([]);

    const handleSend = () => {
        if (message.trim()) {
            setMessages([...messages, { from: 'Siz', text: message }]);
            setMessage('');
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white border-2 border-gray-300 rounded-lg shadow-xl flex flex-col">
            <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white">
                        {participant.photo ? (
                            <img src={participant.photo} alt={participant.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-blue-500 text-sm font-semibold">
                                {participant.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <span className="font-semibold">{participant.name}</span>
                </div>
                <button onClick={onClose} className="text-white hover:text-gray-200 text-xl">×</button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">Henüz mesaj yok</div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`mb-2 ${msg.from === 'Siz' ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block px-4 py-2 rounded-lg ${msg.from === 'Siz' ? 'bg-blue-500 text-white' : 'bg-white border'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Mesaj yazın..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSend}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                        Gönder
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ExamParticipants() {
    const [participants] = useState<Participant[]>([
        {
            id: 1,
            name: 'Ahmet Yılmaz',
            status: 'in-progress',
            startTime: '14:30',
            duration: '25 dk',
            currentQuestion: 8,
            totalQuestions: 20
        },
        {
            id: 2,
            name: 'Ayşe Demir',
            status: 'completed',
            startTime: '14:25',
            duration: '45 dk',
            totalQuestions: 20,
            completionTime: '15:10'
        },
        {
            id: 3,
            name: 'Mehmet Kaya',
            status: 'not-started',
            totalQuestions: 20
        },
        {
            id: 4,
            name: 'Zeynep Şahin',
            status: 'in-progress',
            startTime: '14:35',
            duration: '15 dk',
            currentQuestion: 12,
            totalQuestions: 20
        },
        {
            id: 5,
            name: 'Can Öztürk',
            status: 'in-progress',
            startTime: '14:28',
            duration: '32 dk',
            currentQuestion: 15,
            totalQuestions: 20
        },
        {
            id: 6,
            name: 'Elif Arslan',
            status: 'completed',
            startTime: '14:20',
            duration: '40 dk',
            totalQuestions: 20,
            completionTime: '15:00'
        },
        {
            id: 7,
            name: 'Burak Çelik',
            status: 'not-started',
            totalQuestions: 20
        },
        {
            id: 8,
            name: 'Selin Koç',
            status: 'in-progress',
            startTime: '14:32',
            duration: '20 dk',
            currentQuestion: 5,
            totalQuestions: 20
        },
        {
            id: 9,
            name: 'Emre Aydın',
            status: 'not-started',
            totalQuestions: 20
        },
        {
            id: 10,
            name: 'Deniz Kurt',
            status: 'in-progress',
            startTime: '14:27',
            duration: '28 dk',
            currentQuestion: 18,
            totalQuestions: 20
        }
    ]);

    const [chatParticipant, setChatParticipant] = useState<Participant | null>(null);

    const handleFreeze = (id: number) => {
        console.log('Donduruldu:', id);
    };

    const handleComplete = (id: number) => {
        console.log('Bitirildi:', id);
    };

    const handleChat = (participant: Participant) => {
        setChatParticipant(participant);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-3">
            <div className="max-w-7xl mx-auto">
                <div className="space-y-3">
                    {participants.map((participant) => (
                        <ParticipantCard
                            key={participant.id}
                            participant={participant}
                            onFreeze={handleFreeze}
                            onComplete={handleComplete}
                            onChat={handleChat}
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