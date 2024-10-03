import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attatchment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachment-mapper";

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}
  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const answerAttachements = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    });

    return answerAttachements.map(PrismaAnswerAttachmentMapper.toDomain);
  }
  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    });
  }

  async deleteMany(attachments: AnswerAttachment[]) {
    if (attachments.length === 0) {
      return;
    }
    const attachmentsIds = attachments.map((attachment) =>
      attachment.attachmentId.toString()
    );

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    });
  }
  async saveMany(attachments: AnswerAttachment[]) {
    if (attachments.length === 0) {
      return;
    }

    const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments);
    await this.prisma.attachment.updateMany(data);
  }
}
