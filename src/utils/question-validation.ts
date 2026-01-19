import type {QuestionTemplateType} from "@/types/exam/questionTemplateTypes";
import {EQuestionType} from "@/types/exam/enum";
import type {
    MultipleChoiceTemplateDto,
    MultipleResponseTemplateDto,
    TrueFalseTemplateDto,
    FillInTheBlanksTemplateDto,
    ShortAnswerTemplateDto,
    MatchingTemplateDto,
    OrderingTemplateDto,
    HotSpotTemplateDto,
    DragAndDropTemplateDto
} from "@/api/generated/model";

/**
 * Bir sorunun doğru cevabının girilip girilmediğini kontrol eder
 * @param template Soru template'i
 * @param questionType Soru tipi
 * @returns true eğer doğru cevap girilmişse, false aksi halde
 */
export const hasCorrectAnswer = (
    template: QuestionTemplateType | null | undefined,
    questionType: EQuestionType | string | null | undefined
): boolean => {

    if (!template || !questionType) {
        return false;
    }

    switch (questionType) {
        case EQuestionType.MULTIPLE_CHOICE: {
            const mcTemplate = template as MultipleChoiceTemplateDto;
            const correctIndex = mcTemplate.correctOptionIndex;
            const choices = mcTemplate.options?.choices || [];
            
            if (correctIndex === undefined || correctIndex === null) {
                return false;
            }
            
            if (correctIndex < 0 || correctIndex >= choices.length) {
                return false;
            }
            
            if (choices.length < 2) {
                return false;
            }
            
            return true;
        }

        case EQuestionType.MULTIPLE_RESPONSE: {
            const mrTemplate = template as MultipleResponseTemplateDto;
            const correctIndices = mrTemplate.correctOptionIndices || [];
            const choices = mrTemplate.options?.choices || [];
            
            if (correctIndices.length === 0) {
                return false;
            }
            
            const invalidIndices = correctIndices.some(index => index < 0 || index >= choices.length);
            if (invalidIndices) {
                return false;
            }
            
            if (choices.length < 2) {
                return false;
            }
            
            return true;
        }

        case EQuestionType.TRUE_FALSE: {
            const tfTemplate = template as TrueFalseTemplateDto;
            // correctAnswer hem root'ta hem de options içinde olabilir
            // TrueFalseQuestion.tsx'te de aynı mantık kullanılıyor: template.correctAnswer ?? template.options?.correctAnswer
            const correctAnswer = tfTemplate.correctAnswer ?? tfTemplate.options?.correctAnswer;
            
            if (correctAnswer === undefined || correctAnswer === null) {
                return false;
            }
            
            return true;
        }

        case EQuestionType.FILL_IN_THE_BLANKS: {
            const fitbTemplate = template as FillInTheBlanksTemplateDto;
            const blanks = fitbTemplate.options?.blanks || [];
            
            if (blanks.length === 0) {
                return false;
            }
            
            const invalidBlanks = blanks.some(blank => {
                const acceptableAnswers = blank.acceptableAnswers || [];
                return acceptableAnswers.length === 0 || 
                       acceptableAnswers.every(answer => !answer || !answer.trim());
            });
            
            if (invalidBlanks) {
                return false;
            }
            
            return true;
        }

        case EQuestionType.SHORT_ANSWER: {
            const saTemplate = template as ShortAnswerTemplateDto;
            const acceptableAnswers = saTemplate.options?.acceptableAnswers || [];
            
            if (acceptableAnswers.length === 0) {
                return false;
            }
            
            const invalidAnswers = acceptableAnswers.some(answer => !answer.answer || !answer.answer.trim());
            if (invalidAnswers) {
                return false;
            }
            
            return true;
        }

        case EQuestionType.MATCHING: {
            const matchingTemplate = template as MatchingTemplateDto;
            const pairs = matchingTemplate.options?.pairs || [];
            
            if (pairs.length === 0) {
                return false;
            }
            
            return true;
        }

        case EQuestionType.ORDERING: {
            const orderingTemplate = template as OrderingTemplateDto;
            const items = orderingTemplate.options?.items || [];
            
            if (items.length < 2) {
                return false;
            }
            
            const invalidItems = items.some(item => 
                item.correctPosition === undefined || 
                item.correctPosition === null ||
                item.correctPosition < 1
            );
            
            if (invalidItems) {
                return false;
            }
            
            return true;
        }

        case EQuestionType.HOT_SPOT: {
            const hotSpotTemplate = template as HotSpotTemplateDto;
            const hotSpots = hotSpotTemplate.options?.hotSpots || [];
            
            if (hotSpots.length === 0) {
                return false;
            }
            
            const hasCorrectSpot = hotSpots.some(spot => spot.isCorrect === true);
            if (!hasCorrectSpot) {
                return false;
            }
            
            return true;
        }

        case EQuestionType.DRAG_AND_DROP: {
            const dndTemplate = template as DragAndDropTemplateDto;
            const draggableItems = dndTemplate.options?.draggableItems || [];
            const dropZones = dndTemplate.options?.dropZones || [];
            
            if (draggableItems.length === 0) {
                return false;
            }
            
            if (dropZones.length === 0) {
                return false;
            }
            
            return true;
        }

        // ESSAY, AUDIO_RESPONSE, VIDEO_RESPONSE, IMAGE_RESPONSE için doğru cevap kontrolü gerekmez (manuel değerlendirme)
        case EQuestionType.ESSAY:
        case EQuestionType.AUDIO_RESPONSE:
        case EQuestionType.VIDEO_RESPONSE:
        case EQuestionType.IMAGE_RESPONSE:
            return true;

        default:
            return true;
    }
};
