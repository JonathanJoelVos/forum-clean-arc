import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { ListAnswerCommentsUseCase } from "./list-answer-comments";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { makeAnswer } from "test/factories/make-answer";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: ListAnswerCommentsUseCase;

describe("Create Answer use case", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new ListAnswerCommentsUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository
    );
  });
  it("should be able to list recents answers", async () => {
    const answer = makeAnswer({}, new UniqueEntityID("answer-1"));
    inMemoryAnswersRepository.save(answer);

    inMemoryAnswerCommentsRepository.save(
      makeAnswerComment({
        answerId: answer.id,
      })
    );
    inMemoryAnswerCommentsRepository.save(
      makeAnswerComment({
        answerId: answer.id,
      })
    );
    inMemoryAnswerCommentsRepository.save(
      makeAnswerComment({
        answerId: answer.id,
      })
    );

    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.answerComments).toHaveLength(3);
    }
  });
  it("should be able to list paginated recents answers", async () => {
    const answer = makeAnswer({}, new UniqueEntityID("answer-1"));
    inMemoryAnswersRepository.save(answer);

    for (let i = 0; i < 22; i++) {
      inMemoryAnswerCommentsRepository.save(
        makeAnswerComment({
          answerId: answer.id,
        })
      );
    }

    const result = await sut.execute({
      page: 2,
      answerId: answer.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.answerComments).toHaveLength(2);
    }
  });
  it("not should be able to list recents answers with not exists answer", async () => {
    const answer = makeAnswer({}, new UniqueEntityID("answer-2"));
    await inMemoryAnswersRepository.save(answer);

    await inMemoryAnswerCommentsRepository.save(
      makeAnswerComment({
        answerId: new UniqueEntityID("answer-2"),
      })
    );

    const result = await sut.execute({
      page: 2,
      answerId: "answer-1",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
