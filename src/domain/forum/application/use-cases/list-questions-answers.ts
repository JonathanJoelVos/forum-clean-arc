import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { QuestionsRepository } from "../repositories/questions-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface ListQuestionsAnswersUseCaseRequest {
  page: number;
  questionId: string;
}

type ListQuestionsAnswersUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answers: Answer[];
  }
>;

export class ListQuestionsAnswersUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private questionsRepository: QuestionsRepository
  ) {}

  async execute({
    page,
    questionId,
  }: ListQuestionsAnswersUseCaseRequest): Promise<ListQuestionsAnswersUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    const answers = await this.answersRepository.findManyByQuestionId(
      question.id.toString(),
      {
        page,
      }
    );

    return right({
      answers,
    });
  }
}
