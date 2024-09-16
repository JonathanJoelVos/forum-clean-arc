import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";
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

const commentOnQuestionSchema = z.object({
  content: z.string(),
});

type CommentOnQuestionSchema = z.infer<typeof commentOnQuestionSchema>;

@Controller("/questions/:questionId/comments")
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  @HttpCode(204)
  async handler(
    @Body(new ZodValidationPipe(commentOnQuestionSchema))
    body: CommentOnQuestionSchema,
    @CurrentUser() user: TokenPayload,
    @Param("questionId") questionId: string
  ) {
    const { content } = body;
    const userId = user.sub;
    const result = await this.commentOnQuestion.execute({
      authorId: userId,
      content,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
