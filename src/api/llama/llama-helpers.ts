// utils/response-helpers.ts

import {ChatResponse} from "@/types/chat/chat";

/**
 * IELTS spesifik anahtar kelimeleri içeren Prompt güvenmeesi
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
 * LLM yanıtlarını temizler ve formatlar
 * @param rawText Ham yanıt metni
 * @returns Temizlenmiş metin
 */
export function cleanLLMResponse(rawText: string): string {
    if (!rawText) return '';

    let cleaned = rawText;

    // Kod bloğu işaretlerini kaldır
    cleaned = cleaned.replace(/```[\w]*\n?/g, '');
    cleaned = cleaned.replace(/```/g, '');

    // Model spesifik etiketleri temizle
    cleaned = cleaned.replace(/^(Transition|Feedback|Note|Example|Response|Answer):\s*/gmi, '');

    // Fazla boşlukları temizle
    cleaned = cleaned.replace(/\n\s*\n/g, '\n\n');
    cleaned = cleaned.replace(/^\s+|\s+$/g, '');

    return cleaned;
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

    // Önce LLM yanıtını temizle
    content = cleanLLMResponse(content);

    // IELTS spesifik formatlamalar
    content = content
        // Bölüm başlıklarının vurgusunu artır
        .replace(/^## (.*)/gm, '## 📝 $1')
        .replace(/^### (.*)/gm, '### 📋 $1')

        // Önemli notları vurgula
        .replace(/\b(Note|Important|Warning|Tip):/gi, '**$1:**')

        // IELTS band score vurgula
        .replace(/\b(band|score)\s+(\d+\.?\d*)/gi, '$1 **$2**')

        // Task tiplerini vurgula
        .replace(/\b(Task\s+\d+|Part\s+\d+)/gi, '**$1**')

        // Örnekleri vurgula
        .replace(/^(Example|Sample):/gmi, '**$1:**')

        // Kriterleri vurgula
        .replace(/\b(Task Achievement|Coherence and Cohesion|Lexical Resource|Grammatical Range and Accuracy)/gi, '**$1**')

        // Zaman ifadelerini vurgula
        .replace(/(\d+)\s+(minutes?|hours?|seconds?)/gi, '**$1 $2**');

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
        'task', 'band', 'score', 'exam', 'test', 'academic', 'general',
        'coherence', 'cohesion', 'lexical', 'grammatical'
    ];

    return ieltsKeywords.some(keyword =>
        text.toLowerCase().includes(keyword)
    );
}

/**
 * Farklı LLM modellerinden gelen yanıtları standart formata çevirir
 * @param text Ham yanıt
 * @param modelType Model tipi (llama, qwen, etc.)
 * @returns Standart formatlı yanıt
 */
export function normalizeModelResponse(text: string, modelType: string = 'unknown'): string {
    let normalized = text;

    // Model spesifik temizlemeler
    switch (modelType.toLowerCase()) {
        case 'llama':
        case 'llama2':
        case 'llama3':
            normalized = normalized.replace(/^(Assistant|Human):\s*/gmi, '');
            break;
        case 'qwen':
        case 'qwen2.5':
            normalized = normalized.replace(/^(Response|Answer):\s*/gmi, '');
            break;
        case 'claude':
            normalized = normalized.replace(/^(Claude):\s*/gmi, '');
            break;
    }

    // Genel temizlik
    normalized = cleanLLMResponse(normalized);

    return normalized;
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