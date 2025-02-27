import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { TokenPayload } from "@/infra/auth/jwt.strategy";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";

@Controller("/answers/comments/:id")
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param("id") answerCommentId: string,
    @CurrentUser() user: TokenPayload
  ) {
    const userId = user.sub;

    const result = await this.deleteAnswerComment.execute({
      authorId: userId,
      answerCommentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
