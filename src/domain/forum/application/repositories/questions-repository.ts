import { PaginationParams } from "@/core/repositories/pagination-params";
import { Question } from "../../enterprise/entities/question";
import { Slug } from "../../enterprise/entities/value-objects/slug";

export interface QuestionsRepository {
  save(question: Question): Promise<void>;
  delete(question: Question): Promise<void>;
  update(question: Question): Promise<void>;
  findBySlug(slug: Slug): Promise<Question | null>;
  findById(id: string): Promise<Question | null>;
  findManyRecents(params: PaginationParams): Promise<Question[]>;
}
