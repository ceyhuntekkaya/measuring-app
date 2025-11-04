import {EQuestionType} from "@/types/exam/enum";

export const getQuestionTypeLabel = (questionType?: EQuestionType) => {
    const typeLabels = {
        MULTIPLE_CHOICE: 'Çoktan Seçmeli',
        TRUE_FALSE: 'Doğru/Yanlış',
        FILL_IN_THE_BLANKS: 'Boşluk Doldurma',
        SHORT_ANSWER: 'Kısa Cevap',
        MATCHING: 'Eşleştirme',
        ESSAY: 'Kompozisyon',
        ORDERING: 'Sıralama',
        MULTIPLE_RESPONSE: 'Çoklu Seçim',
        HOT_SPOT: 'Nokta İşaretleme',
        DRAG_AND_DROP: 'Sürükle Bırak',
        AUDIO_RESPONSE: 'Ses Cevabı',
        VIDEO_RESPONSE: 'Video Cevabı',
        IMAGE_RESPONSE: 'Resim Cevabı'
    };
    return questionType ? typeLabels[questionType] || questionType : 'Belirtilmedi';
};
