// QuestionTemplateType - Union type of all Orval-generated template DTOs
import type {
    MultipleChoiceTemplateDto,
    TrueFalseTemplateDto,
    FillInTheBlanksTemplateDto,
    ShortAnswerTemplateDto,
    MatchingTemplateDto,
    EssayTemplateDto,
    OrderingTemplateDto,
    MultipleResponseTemplateDto,
    HotSpotTemplateDto,
    DragAndDropTemplateDto,
    AudioResponseTemplateDto,
    VideoResponseTemplateDto,
    ImageResponseTemplateDto
} from "@/api/generated/model";

export type QuestionTemplateType =
    | MultipleChoiceTemplateDto
    | TrueFalseTemplateDto
    | FillInTheBlanksTemplateDto
    | ShortAnswerTemplateDto
    | MatchingTemplateDto
    | EssayTemplateDto
    | OrderingTemplateDto
    | MultipleResponseTemplateDto
    | HotSpotTemplateDto
    | DragAndDropTemplateDto
    | AudioResponseTemplateDto
    | VideoResponseTemplateDto
    | ImageResponseTemplateDto;
