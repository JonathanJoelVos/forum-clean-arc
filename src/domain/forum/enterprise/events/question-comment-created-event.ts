import { DomainEvent } from "@/core/events/domain-event";
import { QuestionComment } from "../entities/question-comment";

export class QuestionCommentCreatedEvent implements DomainEvent {
  public ocorredAt: Date;
  public questionComment: QuestionComment;

  constructor(questionComment: QuestionComment) {
    this.questionComment = questionComment;
    this.ocorredAt = new Date();
  }
  getAggregateId() {
    return this.questionComment.id;
  }
}
