import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { TokenPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const commentOnAnswerSchema = z.object({
  content: z.string(),
});

type CommentOnAnswerSchema = z.infer<typeof commentOnAnswerSchema>;

@Controller("/answers/:answerId/comments")
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  @HttpCode(204)
  async handler(
    @Body(new ZodValidationPipe(commentOnAnswerSchema))
    body: CommentOnAnswerSchema,
    @CurrentUser() user: TokenPayload,
    @Param("answerId") answerId: string
  ) {
    const { content } = body;
    const userId = user.sub;
    const result = await this.commentOnAnswer.execute({
      authorId: userId,
      content,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
