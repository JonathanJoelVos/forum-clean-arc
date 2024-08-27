import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";
import { SendNotificationUseCase } from "../use-cases/send-notification";

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      QuestionBestAnswerChosenEvent.name,
      this.sendQuestionBestAnswerChosenNotification.bind(this)
    );
  }

  private async sendQuestionBestAnswerChosenNotification({
    bestAnswerId,
    question,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString()
    );
    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        content: `A resposta que voce enviou em "${question.title
          .substring(0, 40)
          .concat("...")}" foi escolhida pelo autor!`,
        title: "Sua resposta foi escolhida!",
      });
    }
  }
}
