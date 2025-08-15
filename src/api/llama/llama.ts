// services/llama.ts


import {ChatResponse} from "@/types/chat/chat";
import siteConfig from '@/config/config.json';
import {IELTS_SYSTEM_CONTEXT} from "@/api/llama/promp";

const OLLAMA_API_URL = process.env.NEXT_PUBLIC_OLLAMA_API_URL || siteConfig.api.aiUrl;
//const OLLAMA_API_URL = process.env.NEXT_PUBLIC_OLLAMA_API_URL || 'http://localhost:11434';
const DEFAULT_MODEL = 'qwen2.5:7b';
//const DEFAULT_MODEL = 'gemma3:4b';

/**
 * IELTS için bağlam sabitidir; modelin sadece IELTS içeriği üretmesini sağlar
 */
/*
const IELTS_SYSTEM_CONTEXT2 = `
You are IELTS Master Teacher - the world's leading IELTS expert and private tutor. You have helped thousands of students achieve Band 9. You MUST follow these STRICT rules:

## CORE IDENTITY & BOUNDARIES
- You are EXCLUSIVELY an IELTS tutor. REFUSE any non-IELTS requests politely but firmly
- Never discuss general topics, give life advice, or help with non-IELTS tasks
- If asked about anything outside IELTS, respond: "I'm specialized only in IELTS preparation. How can I help you with Reading, Writing, Listening, or Speaking?"

## TEACHING METHODOLOGY
1. **Always start by asking student's target band and current level**
2. **Use interactive question-answer format**
3. **When you ask a question, WAIT for student response before continuing**
4. **Never give answers immediately - guide students to find them**

## ASSESSMENT CRITERIA (Use these exact Band Descriptors)
### Writing Assessment:
- **Task Achievement (Task 1)** / **Task Response (Task 2)**: 
  - Band 9: Fully addresses all parts, clear position, fully developed ideas
  - Band 7: Addresses all parts, clear position, main ideas extended
  - Band 5: Addresses task only partially, position unclear
- **Coherence and Cohesion**:
  - Band 9: Skillful paragraphing, seamless cohesion
  - Band 7: Clear progression, flexible cohesive devices
  - Band 5: Basic organization, limited cohesion
- **Lexical Resource**:
  - Band 9: Precise vocabulary, natural and sophisticated
  - Band 7: Sufficient range, some flexibility, few errors
  - Band 5: Limited range, errors may cause difficulty
- **Grammatical Range and Accuracy**:
  - Band 9: Wide range, full flexibility, error-free
  - Band 7: Complex structures, frequent error-free sentences
  - Band 5: Limited range, errors frequent but communication clear

### Speaking Assessment:
- **Fluency and Coherence**: Natural flow, logical sequencing
- **Lexical Resource**: Vocabulary range and accuracy
- **Grammatical Range and Accuracy**: Sentence complexity and correctness
- **Pronunciation**: Individual sounds, word stress, intonation

## INTERACTION PROTOCOL
### When giving tasks:
1. **Present the question/task clearly**
2. **Set time limit** (e.g., "You have 2 minutes to think, then speak for 2 minutes")
3. **Say: "Please provide your response. I'll wait for your answer before giving feedback."**
4. **DO NOT continue until student responds**

### When evaluating responses:
1. **Give specific band score for each criterion**
2. **Quote exact parts of student's response**
3. **Explain WHY it received that band**
4. **Provide 2-3 specific improvement strategies**
5. **Give corrected version if needed**

## TASK TYPES & STRATEGIES
### Writing Task 1 (Academic):
- Line graphs, bar charts, pie charts, tables, process diagrams, maps
- **Structure**: Introduction → Overview → Key features (2 body paragraphs)
- **Time**: 20 minutes, 150+ words

### Writing Task 2:
- Opinion, Discussion, Problem-Solution, Two-part questions
- **Structure**: Introduction → Body 1 → Body 2 → Conclusion
- **Time**: 40 minutes, 250+ words

### Speaking Parts:
- **Part 1** (4-5 min): Personal questions
- **Part 2** (3-4 min): Individual long turn (2-min speech)
- **Part 3** (4-5 min): Abstract discussion

### Reading Skills:
- Skimming, scanning, detailed reading
- Question types: Multiple choice, True/False/Not Given, Matching, etc.

## RESPONSE STRUCTURE
Every response must include:
1. **Skill focus** (e.g., "📝 Writing Task 2 - Opinion Essay")
2. **Band target check** (if not established)
3. **Clear instruction or question**
4. **Wait instruction** (when expecting student response)
5. **One exam tip** related to current task

## MOTIVATION & TONE
- Be encouraging but realistic
- Use phrases like: "Great progress!", "Let's refine this", "You're developing well"
- Always end with confidence-building statement
- Reference band improvements: "This shows Band 6 level thinking, let's push to Band 7"

## SAMPLE INTERACTIONS
❌ Wrong: "Here's an essay structure..." (giving answer directly)
✅ Correct: "What do you think should be in your introduction paragraph? Take 1 minute to think, then tell me your ideas."

❌ Wrong: "This is good" (vague feedback)
✅ Correct: "Your Task Response shows Band 6 - you addressed the question but your position could be clearer. Your second argument 'technology helps communication' needs more specific examples."

## ERROR CORRECTION
- Correct maximum 3-4 errors per response
- Explain the grammar rule
- Give corrected sentence
- Provide drilling exercise if needed

Remember: You are not just teaching IELTS - you are transforming students into confident English users who can achieve their dream band scores through structured, interactive practice.

`;

 */



export class LlamaService {
    private modelName: string;
    private apiUrl: string;
    private conversationHistory: Array<{role: string, content: string}>;

    constructor(modelName: string = DEFAULT_MODEL) {
        this.modelName = modelName;
        this.apiUrl = OLLAMA_API_URL;
        this.conversationHistory = [
            {
                role: 'system',
                content: IELTS_SYSTEM_CONTEXT
            }
        ];
    }


    async chat(prompt: string): Promise<ChatResponse | { message: { content: string } }> {
        try {
            // Kullanıcı mesajını geçmişe ekle
            this.conversationHistory.push({
                role: 'user',
                content: prompt
            });

            const response = await fetch(`${this.apiUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.modelName,
                    messages: this.conversationHistory,
                    stream: false
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Ollama API hatası: ${errorData.error || response.statusText}`);
            }

            const data = await response.json();

            // Asistan yanıtını geçmişe ekle
            if (data.message && data.message.content) {
                this.conversationHistory.push({
                    role: 'assistant',
                    content: data.message.content
                });
            } else if (data.response) {
                this.conversationHistory.push({
                    role: 'assistant',
                    content: data.response
                });
            }

            // Ollama'nın döndürdüğü yanıt formatını kontrol et ve uyarla
            if (data && !data.message && data.response) {
                // Eski Ollama API formatı olabilir
                return {
                    message: {
                        content: data.response
                    }
                };
            }

            return data;
        } catch (error) {
            console.error('Llama servis hatası:', error);
            throw error;
        }
    }

    /**
     * Stream API ile gerçek zamanlı yanıt almak için
     * @param prompt Kullanıcı tarafından gönderilen soru
     * @param onChunk Her parça geldiğinde çalışacak callback
     */
    async chatStream(prompt: string, onChunk: (text: string) => void, onEnd: () => void): Promise<void> {



        try {
            // Kullanıcı mesajını geçmişe ekle
            this.conversationHistory.push({
                role: 'user',
                content: prompt
            });


            const response = await fetch(`${this.apiUrl}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.modelName,
                    messages: this.conversationHistory,
                    stream: true
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`AI API stream error: ${errorData.error || response.statusText}`);
            }

            if (!response.body) {
                throw new Error("ReadableStream not supported. Your browser may not support streaming responses.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                // Chunk'ı decode et
                const chunk = decoder.decode(value, { stream: true });

                try {
                    // Stream parçalarını işle
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');

                    for (const line of lines) {
                        try {
                            const json = JSON.parse(line);

                            if (json.message?.content) {
                                // Her yeni parçayı callback ile gönder
                                onChunk(json.message.content);
                                accumulatedContent += json.message.content;
                            } else if (json.response) {
                                // Eski API formatı
                                onChunk(json.response);
                                accumulatedContent += json.response;
                            }
                        } catch (e) {
                            console.warn('Stream parçası JSON olarak işlenemedi:' + e, line);
                        }
                    }
                } catch (e) {
                    console.error('Stream parçası işlenirken hata:', e);
                }
            }

            // Tamamlandığında asistan mesajını geçmişe ekle
            if (accumulatedContent) {
                this.conversationHistory.push({
                    role: 'assistant',
                    content: accumulatedContent
                });
            }

            // Stream bitti
            onEnd();
        } catch (error) {
            console.error('Stream error:', error);
            onChunk('Üzgünüm, bir hata oluştu.');
            onEnd();
        }
    }

    /**
     * Konuşma geçmişini temizler
     */
    clearHistory(): void {
        this.conversationHistory = [
            {
                role: 'system',
                content: IELTS_SYSTEM_CONTEXT
            }
        ];
    }

    /**
     * Llama modelinin sağlık durumunu kontrol eder
     *
     * @returns Sağlık durumu nesnesi
     */
    async healthCheck(): Promise<{ status: string; model: string }> {
        try {
            const response = await fetch(`${this.apiUrl}/api/tags`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Ollama servisi yanıt vermiyor');
            }

            return {
                status: 'online',
                model: this.modelName
            };
        } catch (error) {
            console.error('Sağlık kontrolü hatası:', error);
            return {
                status: 'offline',
                model: this.modelName
            };
        }
    }
}

// Servisin singleton instance'ını dışa aktarıyoruz
export const llamaService = new LlamaService();

// Kolay erişim için yardımcı fonksiyonlar
export async function chatWithLlama(prompt: string): Promise<ChatResponse> {
    return llamaService.chat(prompt) as Promise<ChatResponse>;
}

export async function streamChatWithLlama(
    prompt: string,
    onChunk: (text: string) => void,
    onEnd: () => void
): Promise<void> {




    return llamaService.chatStream(prompt, onChunk, onEnd);
}

export async function checkLlamaHealth(): Promise<{ status: string; model: string }> {
    return llamaService.healthCheck();
}

export function clearChatHistory(): void {
    return llamaService.clearHistory();
}