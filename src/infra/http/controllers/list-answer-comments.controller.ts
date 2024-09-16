import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { ListAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/list-answer-comments";
import { CommentPresenter } from "../presenters/comment-presenter";

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller("/answers/:answerId/comments")
export class ListAnswerCommentsController {
  constructor(private listAnswerComments: ListAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query("page", new ZodValidationPipe(pageQueryParamsSchema))
    page: PageQueryParamsSchema,
    @Param("answerId") answerId: string
  ) {
    const result = await this.listAnswerComments.execute({
      page,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const answerComments = result.value.answerComments;
    return {
      comments: answerComments.map(CommentPresenter.toHttp),
    };
  }
}
