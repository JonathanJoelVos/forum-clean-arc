import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { InMemoryQuestionAttachmentsRepository } from "./in-memory-question-attachments-repository";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private atachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository
  ) {}

  async save(question: Question) {
    this.items.push(question);
    await this.questionAttachmentsRepository.saveMany(
      question.attachments.currentItems
    );
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    return question;
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    const author = this.studentsRepository.items.find(
      (author) => author.id.toString() === question.authorId.toString()
    );

    if (!author) {
      throw new Error("Autor não existe");
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachment) =>
        questionAttachment.questionId.toString() === question.id.toString()
    );

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.atachmentsRepository.items.find(
        (a) => a.id.toString() === questionAttachment.attachmentId.toString()
      );

      if (!attachment) {
        throw new Error("Attachment não existe");
      }

      return attachment;
    });

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      bestAnswerId: question.bestAnswerId,
      attachments,
    });
  }

  async delete(question: Question) {
    const index = this.items.findIndex((item) => item.id === question.id);

    this.items.splice(index, 1);
    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString()
    );
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) {
      return null;
    }
    return question;
  }

  async update(question: Question) {
    const index = this.items.findIndex((item) => item.id === question.id);

    this.items[index] = question;
    await this.questionAttachmentsRepository.saveMany(
      question.attachments.getNewItems()
    );
    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems()
    );
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findManyRecents({ page }: PaginationParams) {
    return this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(20 * (page - 1), 20 * page);
  }
}
