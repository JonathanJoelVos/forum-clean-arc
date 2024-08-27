import { PaginationParams } from "@/core/repositories/pagination-params";
import { Answer } from "../../enterprise/entities/answer";

export interface AnswersRepository {
  save(answer: Answer): Promise<void>;
  delete(question: Answer): Promise<void>;
  findById(id: string): Promise<Answer | null>;
  update(answer: Answer): Promise<void>;
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]>;
}
