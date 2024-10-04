import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = [];

  constructor(private studentRepository: InMemoryStudentsRepository) {}

  async save(answerComment: AnswerComment) {
    this.items.push(answerComment);
  }
  async delete(answerComment: AnswerComment) {
    const index = this.items.findIndex((item) => item.id === answerComment.id);

    this.items.splice(index, 1);
  }
  async findById(answerCommentId: string) {
    const answerComment = this.items.find(
      (item) => item.id.toString() === answerCommentId
    );

    if (!answerComment) return null;

    return answerComment;
  }

  async findManyByAnswerId(answerId: string, params: PaginationParams) {
    const answerComments = await this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice(20 * (params.page - 1), 20 * params.page);

    return answerComments;
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams
  ) {
    const answerComments = await this.items
      .filter((item) => item.answerId.toString() === answerId)
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
    return answerComments;
  }
}
