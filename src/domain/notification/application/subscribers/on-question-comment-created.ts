import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { QuestionCommentCreatedEvent } from "@/domain/forum/enterprise/events/question-comment-created-event";
import { SendNotificationUseCase } from "../use-cases/send-notification";

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      QuestionCommentCreatedEvent.name,
      this.sendQuestionCommentNotification.bind(this)
    );
  }
  private async sendQuestionCommentNotification({
    questionComment,
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString()
    );
    if (question) {
      this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Novo comentário em ${question.title
          .substring(0, 40)
          .concat("...")}`,
        content: questionComment.excerpt,
      });
    }
  }
}
