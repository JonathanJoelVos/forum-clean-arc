import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { makeQuestion } from "test/factories/make-question";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { MockInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sendNotification: SendNotificationUseCase;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;

let sendNotificationSpyOn: MockInstance;

describe("On question best answer chosen", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    );
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );

    sendNotificationSpyOn = vi.spyOn(sendNotification, "execute");
    new OnQuestionBestAnswerChosen(inMemoryAnswersRepository, sendNotification);
  });

  it("should send a notification when topic has new best answer chosen ", async () => {
    const question = makeQuestion();
    const answer = makeAnswer({
      questionId: question.id,
    });
    inMemoryQuestionsRepository.save(question);
    inMemoryAnswersRepository.save(answer);
    question.bestAnswerId = answer.id;
    inMemoryQuestionsRepository.update(question);
    await waitFor(() => {
      expect(sendNotificationSpyOn).toHaveBeenCalled();
    });
  });
});
