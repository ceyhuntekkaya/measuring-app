

import { useState, useRef, useEffect } from 'react';
import { Loader2, Send, AlertTriangle } from 'lucide-react';
import { streamChatWithLlama, checkLlamaHealth, clearChatHistory } from '@/api/llama/llama';
import { convertToHtml } from '@/api/llama/format-helpers';
import HtmlRender from '@/components/ui/html-render';

type Message = {
    role: 'user' | 'assistant';
    content: string;
    isComplete?: boolean;
    id: string; // Mesajlar için benzersiz ID
};

interface AIChatComponentProps {
    activeText: string;
}

export default function AIChatComponent({activeText}: AIChatComponentProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('Some people believe that universities should focus on providing academic skills rather than preparing students for employment. To what extent do you agree or disagree?');
    const [isLoading, setIsLoading] = useState(false);
    const [serviceStatus, setServiceStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const activeMessageId = useRef<string | null>(null);


    useEffect(() => {
        if(activeText && activeText.trim() !== '') {
            clearChatHistory();
            setMessages([]);
            setInput(activeText);

        }
    }, [activeText]);




    // Sayfa yüklendiğinde Llama servisinin durumunu kontrol et
    useEffect(() => {
        async function checkServiceHealth() {
            try {
                const health = await checkLlamaHealth();
                setServiceStatus(health.status as 'online' | 'offline');
            } catch (error) {
                console.error('Servis sağlık kontrolü başarısız:', error);
                setServiceStatus('offline');
            }
        }

        checkServiceHealth();
    }, []);

    const scrollToBottom = () => {
        //  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Mesajlar güncellendiğinde otomatik kaydırma
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Benzersiz ID oluşturucu
    const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (input.trim() === '' || isLoading || serviceStatus !== 'online') return;

        // Kullanıcı mesajını ekle
        const userMessage: Message = { role: 'user', content: input, isComplete: true, id: generateId() };
        setMessages(prev => [...prev, userMessage]);

        setIsLoading(true);
        setInput('');

        // Asistan için mesaj ID'si oluştur ve saklayalım
        const assistantMessageId = generateId();
        activeMessageId.current = assistantMessageId;

        // Asistan için başlangıç mesajı ekliyoruz
        const assistantPlaceholder: Message = {
            role: 'assistant',
            content: '',
            isComplete: false,
            id: assistantMessageId
        };

        setMessages(prev => [...prev, assistantPlaceholder]);

        try {
            // Her yeni parça geldiğinde mesajı güncelle
            await streamChatWithLlama(
                input,
                (chunk) => {
                    setMessages(prev => {
                        return prev.map(msg =>
                            msg.id === assistantMessageId
                                ? { ...msg, content: msg.content + chunk }
                                : msg
                        );
                    });
                },
                () => {
                    // Stream tamamlandığında
                    setMessages(prev => {
                        return prev.map(msg =>
                            msg.id === assistantMessageId
                                ? { ...msg, isComplete: true }
                                : msg
                        );
                    });
                    setIsLoading(false);
                    activeMessageId.current = null;
                }
            );
        } catch (error) {
            console.error('Hata:', error);

            // Hata durumunda son mesajı güncelle
            setMessages(prev => {
                return prev.map(msg =>
                    msg.id === assistantMessageId
                        ? {
                            ...msg,
                            content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
                            isComplete: true
                        }
                        : msg
                );
            });

            setIsLoading(false);
            activeMessageId.current = null;
        }
    };
/*
    const handleTemplateClick = (prompt: string) => {
        setInput(prompt);
    };

    const handleClearChat = () => {
        // Servis geçmişini temizle
        clearChatHistory();
        // UI geçmişini temizle
        setMessages([]);
    };

 */

    // Servis durumuna göre UI göster
    if (serviceStatus === 'checking') {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">AI servisi kontrol ediliyor...</p>
            </div>
        );
    }

    if (serviceStatus === 'offline') {
        return (
            <div className="flex flex-col items-center justify-center h-screen p-4">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Servis Çalışmıyor</h1>
                <p className="text-gray-600 text-center max-w-md mb-4">
                    AI servisine bağlanılamıyor. Lütfen Ollamanın çalıştığından ve
                    doğru adreste erişilebilir olduğundan emin olun.
                </p>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={() => window.location.reload()}
                >
                    Yeniden Dene
                </button>
            </div>
        );
    }

    // Service online ise (implicit olarak burada serviceStatus === 'online')
    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto">


            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`p-4 rounded-lg max-w-3xl ${
                                message.role === 'user'
                                    ? 'bg-blue-100 ml-auto'
                                    : 'bg-white border'
                            }`}
                        >
                            {message.role === 'assistant' ? (
                                <>
                                    <HtmlRender
                                      className="whitespace-pre-wrap markdown-content"
                                      html={convertToHtml(message.content)}
                                    />
                                    {/* Yükleniyor animasyonu - isComplete false ise göster */}
                                    {message.isComplete === false && (
                                        <div className="flex mt-2">
                                            <div className="loading-dots">
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="whitespace-pre-wrap">{message.content}</p>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-4 bg-white border-t">


                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="IELTS ile ilgili sorunuzu yazın..."
                        className="flex-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || input.trim() === '' || serviceStatus !== 'online'}
                        className={`p-3 rounded-md ${
                            isLoading || input.trim() === '' || serviceStatus !== 'online'
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        } transition-colors`}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                    </button>
                </form>
            </div>
        </div>
    );
}