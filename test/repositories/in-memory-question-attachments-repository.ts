import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = [];

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const questionAttachments = this.items.filter(
      (item) => !attachments.some((a) => a.id.toString() === item.id.toString())
    );
    this.items = questionAttachments;
  }

  async saveMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }

  async findManyByQuestionId(questionId: string) {
    return this.items.filter(
      (item) => item.questionId.toString() === questionId
    );
  }

  async createMany(attachments: QuestionAttachment[]) {
    attachments.forEach((attachment) => this.items.push(attachment));
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId
    );
    this.items = questionAttachments;
  }
}
