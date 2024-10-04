import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { PrismaQuestionDetailsMapper } from "../mappers/prisma-question-details-mapper";
import { DomainEvents } from "@/core/events/domain-events";
import { CacheRepository } from "@/infra/cache/cache-repository";
@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}
  async save(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question);
    await this.prisma.question.create({
      data,
    });
    await this.questionAttachmentsRepository.saveMany(
      question.attachments.getItems()
    );
    DomainEvents.dispatchEventsForAggregate(question.id);
  }
  async delete(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question);
    await this.prisma.question.delete({
      where: {
        id: data.id,
      },
    });
    await this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString()
    );
  }
  async update(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question);

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.questionAttachmentsRepository.saveMany(
        question.attachments.getNewItems()
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems()
      ),
      this.cache.delete(`question:${data.slug}:details`),
    ]);
    DomainEvents.dispatchEventsForAggregate(question.id);
  }
  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheHit = await this.cache.get(`question:${slug}:details`);

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit);
      return cachedData;
    }

    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    });

    if (!question) {
      return null;
    }

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question);

    //salvamos com separações com 2 pontos que ai conseguimos deletar
    // um agrupamento de cashe EX: question:1 question:1:details question:1:infos -> consigo deletar com delete(question:*) e deleta tudo
    await this.cache.set(
      `question:${slug}:details`,
      JSON.stringify(questionDetails)
    );

    return questionDetails;
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findManyRecents(params: PaginationParams) {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }
}
