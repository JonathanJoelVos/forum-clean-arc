import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attatchment";

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = [];
  async findManyByAnswerId(answerId: string) {
    return this.items.filter((item) => item.answerId.toString() === answerId);
  }

  async createMany(attachments: AnswerAttachment[]) {
    attachments.forEach((attachment) => this.items.push(attachment));
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toString() !== answerId
    );
    this.items = answerAttachments;
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    const answerAttachments = this.items.filter(
      (item) => !attachments.some((a) => a.id.toString() === item.id.toString())
    );
    this.items = answerAttachments;
  }

  async saveMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }
}
