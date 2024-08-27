import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async save(question: Question) {
    this.items.push(question);
    this.questionAttachmentsRepository.createMany(
      question.attachments.currentItems
    );
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: Slug) {
    const question = this.items.find((item) => item.slug.value === slug.value);

    if (!question) {
      return null;
    }

    return question;
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
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findManyRecents({ page }: PaginationParams) {
    return this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(20 * (page - 1), 20 * page);
  }
}
