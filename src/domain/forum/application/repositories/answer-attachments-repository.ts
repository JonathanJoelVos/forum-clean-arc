import { AnswerAttachment } from "../../enterprise/entities/answer-attatchment";

export interface AnswerAttachmentsRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
  deleteManyByAnswerId(answerId: string): Promise<void>;
  createMany(attachments: AnswerAttachment[]): Promise<void>;
}
