import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { Comment, CommentProps } from "./comment";
import { QuestionCommentCreatedEvent } from "../events/question-comment-created-event";

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityID;
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  static create(
    props: Optional<QuestionCommentProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
    const isNewQuestionComment = !id;

    if (isNewQuestionComment) {
      questionComment.addDomainEvents(
        new QuestionCommentCreatedEvent(questionComment)
      );
    }

    return questionComment;
  }

  get questionId() {
    return this.props.questionId;
  }
}
