import { DomainEvent } from "@/core/events/domain-event";
import { Answer } from "../entities/answer";

export class AnswerCreatedEvent implements DomainEvent {
  public ocorredAt: Date;
  public answer: Answer;

  constructor(answer: Answer) {
    this.answer = answer;
    this.ocorredAt = new Date();
  }

  getAggregateId() {
    return this.answer.id;
  }
}
