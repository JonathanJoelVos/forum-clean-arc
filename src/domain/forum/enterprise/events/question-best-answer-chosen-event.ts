import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { Question } from "../entities/question";

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocorredAt: Date;
  public question: Question;
  public bestAnswerId: UniqueEntityID;

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.question = question;
    this.bestAnswerId = bestAnswerId;
    this.ocorredAt = new Date();
  }
  getAggregateId() {
    return this.question.id;
  }
}
