import React, {useState} from "react";
import {ApplicationDto} from "@/types/management/brand";


export const ChatWindow = ({ participant, onClose }: {
    participant: ApplicationDto;
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
                            <img src={participant.photo.toString()} alt={participant.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-blue-500 text-sm font-semibold">
                                {participant.candidateName ? participant.candidateName.charAt(0) : 'X'}
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