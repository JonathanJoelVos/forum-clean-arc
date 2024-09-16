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
import { ListQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/list-question-answers";

//o pipe valida como se tudo que viesse antes fosse o real input. Entao ele verifica se o valor que vem de .string().optional().default("1").transform(Number) é um numero com no mínimo 1

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller("/questions/:questionId/answers")
export class ListQuestionAnswersController {
  constructor(private listQuestionAnswers: ListQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Query("page", new ZodValidationPipe(pageQueryParamsSchema))
    page: PageQueryParamsSchema,
    @Param("questionId") questionId: string
  ) {
    const result = await this.listQuestionAnswers.execute({
      page,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const answers = result.value.answers;
    return { answers: answers.map(AnswerPresenter.toHttp) };
  }
}
