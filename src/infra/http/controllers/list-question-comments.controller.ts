import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { AnswerPresenter } from "../presenters/answer-presentes";
import { ListQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/list-question-comments";
import { CommentPresenter } from "../presenters/comment-presenter";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presentes";

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller("/questions/:questionId/comments")
export class ListQuestionCommentsController {
  constructor(private listQuestionComments: ListQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Query("page", new ZodValidationPipe(pageQueryParamsSchema))
    page: PageQueryParamsSchema,
    @Param("questionId") questionId: string
  ) {
    const result = await this.listQuestionComments.execute({
      page,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const comments = result.value.comments;
    return {
      comments: comments.map(CommentWithAuthorPresenter.toHttp),
    };
  }
}
