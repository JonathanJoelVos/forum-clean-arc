import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { ListQuestionAnswersUseCase } from "./list-question-answers";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: ListQuestionAnswersUseCase;

describe("Create Answer use case", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    );
    sut = new ListQuestionAnswersUseCase(
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository
    );
  });
  it("should be able to list recents answers", async () => {
    const question = makeQuestion({}, new UniqueEntityID("question-1"));
    inMemoryQuestionsRepository.save(question);
    inMemoryAnswersRepository.save(
      makeAnswer({
        questionId: question.id,
      })
    );
    inMemoryAnswersRepository.save(
      makeAnswer({
        questionId: question.id,
      })
    );
    inMemoryAnswersRepository.save(
      makeAnswer({
        questionId: question.id,
      })
    );

    const result = await sut.execute({
      page: 1,
      questionId: question.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.answers).toHaveLength(3);
    }
  });
  it("should be able to list paginated recents answers", async () => {
    const question = makeQuestion({}, new UniqueEntityID("question-1"));
    inMemoryQuestionsRepository.save(question);

    for (let i = 0; i < 22; i++) {
      inMemoryAnswersRepository.save(
        makeAnswer({
          questionId: question.id,
        })
      );
    }

    const result = await sut.execute({
      page: 2,
      questionId: question.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.answers).toHaveLength(2);
    }
  });
  it("not should be able to list recents answers with not exists question", async () => {
    const question = makeQuestion({}, new UniqueEntityID("question-2"));
    await inMemoryQuestionsRepository.save(question);

    await inMemoryAnswersRepository.save(
      makeAnswer({
        questionId: new UniqueEntityID("question-2"),
      })
    );
    const result = await sut.execute({
      page: 2,
      questionId: "question-1",
    });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
