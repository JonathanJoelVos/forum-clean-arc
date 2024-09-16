import { PaginationParams } from "@/core/repositories/pagination-params";
import { Answer } from "../../enterprise/entities/answer";

export abstract class AnswersRepository {
  abstract save(answer: Answer): Promise<void>;
  abstract delete(question: Answer): Promise<void>;
  abstract findById(id: string): Promise<Answer | null>;
  abstract update(answer: Answer): Promise<void>;
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]>;
}
