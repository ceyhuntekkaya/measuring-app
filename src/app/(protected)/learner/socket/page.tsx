'use client';

import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';

export default function WebSocketTest() {
    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: 'ws://localhost:8080/api/ws', // Native WebSocket
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => console.log('STOMP:', str),

            onConnect: () => {
                console.log('✅ Connected to WebSocket!');
                setConnected(true);

                stompClient.subscribe('/topic/messages', (message) => {
                    console.log('📨 Received:', message.body);
                    setMessages((prev) => [...prev, message.body]);
                });
            },

            onDisconnect: () => {
                console.log('❌ Disconnected!');
                setConnected(false);
            },

            onStompError: (frame) => {
                console.error('⚠️ STOMP error:', frame.headers['message']);
                console.error('Details:', frame.body);
            },

            onWebSocketError: (event) => {
                console.error('🔴 WebSocket error:', event);
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            if (stompClient.active) {
                stompClient.deactivate();
            }
        };
    }, []);

    const sendMessage = () => {
        if (client && connected && message) {
            console.log('📤 Sending:', message);
            client.publish({
                destination: '/app/test',
                body: message,
            });
            setMessage('');
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">WebSocket Test</h1>

            <div className="mb-6">
                <div className={`inline-flex items-center px-6 py-3 rounded-lg text-white font-semibold ${connected ? 'bg-green-500' : 'bg-red-500'}`}>
                    <span className="mr-2">{connected ? '●' : '○'}</span>
                    {connected ? 'Bağlı' : 'Bağlantı Yok'}
                </div>
            </div>

            <div className="mb-6 bg-white shadow rounded-lg p-4">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Mesaj yazın..."
                    className="border border-gray-300 p-3 w-full mb-3 rounded"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    disabled={!connected}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed w-full"
                >
                    Gönder
                </button>
            </div>

            <div className="bg-white shadow rounded-lg p-4">
                <h3 className="font-bold mb-3 text-lg">Gelen Mesajlar:</h3>
                <div className="space-y-2 h-64 overflow-y-auto">
                    {messages.length === 0 ? (
                        <p className="text-gray-400 italic">Henüz mesaj yok...</p>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                                {msg}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}