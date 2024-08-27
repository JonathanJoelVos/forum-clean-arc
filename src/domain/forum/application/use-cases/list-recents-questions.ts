import { Either, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";

interface ListRecentsQuestionsUseCaseRequest {
  page: number;
}

type ListRecentsQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

export class ListRecentsQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: ListRecentsQuestionsUseCaseRequest): Promise<ListRecentsQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecents({
      page,
    });

    return right({
      questions,
    });
  }
}
