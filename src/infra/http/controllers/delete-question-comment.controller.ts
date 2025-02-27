import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { TokenPayload } from "@/infra/auth/jwt.strategy";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";

@Controller("/questions/comments/:id")
export class DeleteQuestionCommentController {
  constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param("id") questionCommentId: string,
    @CurrentUser() user: TokenPayload
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestionComment.execute({
      authorId: userId,
      questionCommentId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
