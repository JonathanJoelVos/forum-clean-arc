import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { ListRecentsQuestionsUseCase } from "@/domain/forum/application/use-cases/list-recents-questions";
import { QuestionPresenter } from "../presenters/question-presenter";

//o pipe valida como se tudo que viesse antes fosse o real input. Entao ele verifica se o valor que vem de .string().optional().default("1").transform(Number) é um numero com no mínimo 1

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller("/questions")
export class FetchRecentQuestionsController {
  constructor(private listRecentQuestions: ListRecentsQuestionsUseCase) {}

  @Get()
  async handle(
    @Query("page", new ZodValidationPipe(pageQueryParamsSchema))
    page: PageQueryParamsSchema
  ) {
    const result = await this.listRecentQuestions.execute({
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const questions = result.value.questions;
    return { questions: questions.map(QuestionPresenter.toHttp) };
  }
}
