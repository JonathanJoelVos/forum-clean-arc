import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = [];

  constructor(private studentRepository: InMemoryStudentsRepository) {}

  async save(questionComment: QuestionComment) {
    this.items.push(questionComment);
    DomainEvents.dispatchEventsForAggregate(questionComment.id);
  }

  async delete(questionComment: QuestionComment) {
    const index = this.items.findIndex(
      (item) => item.id === questionComment.id
    );

    this.items.splice(index, 1);
  }
  async findById(questionCommentId: string) {
    const questionComment = this.items.find(
      (item) => item.id.toString() === questionCommentId
    );

    if (!questionComment) return null;

    return questionComment;
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams) {
    const questionComments = await this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice(20 * (params.page - 1), 20 * params.page);

    return questionComments;
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams
  ) {
    const questionComments = await this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice(20 * (params.page - 1), 20 * params.page)
      .map((comment) => {
        const author = this.studentRepository.items.find(
          (a) => a.id.toString() === comment.authorId.toString()
        );

        if (!author) {
          throw new Error("Aluno não encontrado");
        }

        return CommentWithAuthor.create({
          author: author.name,
          authorId: author.id,
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        });
      });
    return questionComments;
  }
}
