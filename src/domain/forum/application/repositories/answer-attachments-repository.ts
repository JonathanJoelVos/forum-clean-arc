import { AnswerAttachment } from "../../enterprise/entities/answer-attatchment";

export abstract class AnswerAttachmentsRepository {
  abstract saveMany(attachments: AnswerAttachment[]): Promise<void>;
  abstract deleteMany(attachments: AnswerAttachment[]): Promise<void>;
  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
  abstract deleteManyByAnswerId(answerId: string): Promise<void>;
}
