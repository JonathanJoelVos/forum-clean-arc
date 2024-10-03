import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";
import { PrismaService } from "../prisma.service";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}
  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);
    await this.prisma.answer.create({
      data,
    });

    await this.answerAttachmentsRepository.saveMany(
      answer.attachments.getItems()
    );
  }
  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toString(),
      },
    });
  }
  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });

    if (!answer) {
      return null;
    }
    return PrismaAnswerMapper.toDomain(answer);
  }
  async update(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await Promise.all([
      this.prisma.answer.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.answerAttachmentsRepository.deleteMany(
        answer.attachments.getRemovedItems()
      ),
      this.answerAttachmentsRepository.saveMany(
        answer.attachments.getNewItems()
      ),
    ]);
  }
  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<Answer[]> {
    const perPage = 20;
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: perPage,
      skip: (page - 1) * perPage,
    });

    return answers.map(PrismaAnswerMapper.toDomain);
  }
}
