import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { TokenPayload } from "@/infra/auth/jwt.strategy";
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const anwserQuestionSchema = z.object({
  content: z.string(),
});

type AnwserQuestionSchema = z.infer<typeof anwserQuestionSchema>;

@Controller("/questions/:questionId/anwser")
export class AnswerQuestionController {
  constructor(private anwserQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(anwserQuestionSchema))
    body: AnwserQuestionSchema,
    @CurrentUser() user: TokenPayload,
    @Param("questionId") questionId: string
  ) {
    const { content } = body;

    const userId = user.sub;

    const result = await this.anwserQuestion.execute({
      attachmentsIds: [],
      content,
      authorId: userId,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
