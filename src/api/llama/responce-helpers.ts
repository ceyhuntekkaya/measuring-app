// utils/llama-helpers.ts


import {ChatResponse} from "@/types/chat/chat";

/**
 * IELTS spesifik anahtar kelimeleri içeren Prompt güvenmesi
 * @param prompt Kullanıcı girdisi
 * @returns Temizlenmiş prompt
 */
export function sanitizePrompt(prompt: string): string {
    // Konu dışı içeriği tespit etmek için kontrol
    const ieltsKeywords = [
        'ielts', 'writing', 'reading', 'speaking', 'listening',
        'task', 'band', 'score', 'exam', 'test', 'academic', 'general',
        'essay', 'paragraph', 'introduction', 'conclusion', 'grammar'
    ];

    // Prompt IELTS ile ilgili mi kontrol et
    const hasIeltsContext = ieltsKeywords.some(keyword =>
        prompt.toLowerCase().includes(keyword)
    );

    // Eğer IELTS bağlamı bulunamadıysa, otomatik bağlam ekle
    if (!hasIeltsContext) {
        return `Help me with the following IELTS question: ${prompt}`;
    }

    return prompt;
}

/**
 * IELTS yanıtlarını işleyerek daha okunabilir bir formata çevirir
 * @param response API yanıtı
 * @returns İşlenmiş yanıt metni
 */
export function formatIeltsResponse(response: ChatResponse): string {
    if (!response || !response.message || !response.message.content) {
        return 'Yanıt alınamadı.';
    }

    let content = response.message.content;

    // Markdown formatını iyileştir
    content = content
        // Bölüm başlıklarının vurgusunu artır
        .replace(/## (.*)/g, '## 📝 $1')
        // Önemli notları vurgula
        .replace(/Note:/gi, '**Note:**')
        // IELTS band score vurgula
        .replace(/band (\d+\.?\d*)/gi, 'band **$1**')
        // Örnekleri vurgula
        .replace(/Example:/gi, '_Example:_');

    return content;
}

/**
 * Bir yanıtın IELTS konusuyla ilgili olup olmadığını kontrol eder
 * @param text Kontrol edilecek metin
 * @returns IELTS konusuyla ilgili ise true, değilse false
 */
export function isIeltsRelated(text: string): boolean {
    const ieltsKeywords = [
        'ielts', 'writing', 'reading', 'speaking', 'listening',
        'task', 'band', 'score', 'exam', 'test', 'academic', 'general'
    ];

    return ieltsKeywords.some(keyword =>
        text.toLowerCase().includes(keyword)
    );
}

/**
 * IELTS task tiplerini alır
 */
export function getIeltsTaskTypes(): { id: string; name: string; description: string }[] {
    return [
        {
            id: 'writing-task-1',
            name: 'Writing Task 1',
            description: 'Grafik, tablo veya süreci açıklama'
        },
        {
            id: 'writing-task-2',
            name: 'Writing Task 2',
            description: 'Argüman yazısı'
        },
        {
            id: 'speaking-part-1',
            name: 'Speaking Part 1',
            description: 'Kişisel sorular'
        },
        {
            id: 'speaking-part-2',
            name: 'Speaking Part 2',
            description: 'Uzun konuşma görevi'
        },
        {
            id: 'speaking-part-3',
            name: 'Speaking Part 3',
            description: 'Tartışma soruları'
        },
        {
            id: 'reading',
            name: 'Reading',
            description: 'Okuma stratejileri ve soru tipleri'
        },
        {
            id: 'listening',
            name: 'Listening',
            description: 'Dinleme stratejileri ve soru tipleri'
        }
    ];
}