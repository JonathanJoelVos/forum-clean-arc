import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { ListQuestionCommentsUseCase } from "./list-question-comments";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: ListQuestionCommentsUseCase;

describe("Create Answer use case", () => {
  beforeEach(() => {
    const inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    sut = new ListQuestionCommentsUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository
    );
  });
  it("should be able to list recents answers", async () => {
    const question = makeQuestion({}, new UniqueEntityID("question-1"));
    inMemoryQuestionsRepository.save(question);

    inMemoryQuestionCommentsRepository.save(
      makeQuestionComment({
        questionId: question.id,
      })
    );
    inMemoryQuestionCommentsRepository.save(
      makeQuestionComment({
        questionId: question.id,
      })
    );
    inMemoryQuestionCommentsRepository.save(
      makeQuestionComment({
        questionId: question.id,
      })
    );

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.questionComments).toHaveLength(3);
    }
  });
  it("should be able to list paginated recents answers", async () => {
    const question = makeQuestion({}, new UniqueEntityID("question-1"));
    inMemoryQuestionsRepository.save(question);

    for (let i = 0; i < 22; i++) {
      inMemoryQuestionCommentsRepository.save(
        makeQuestionComment({
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
      expect(result.value.questionComments).toHaveLength(2);
    }
  });
  it("not should be able to list recents answers with not exists question", async () => {
    const question = makeQuestion({}, new UniqueEntityID("question-2"));
    await inMemoryQuestionsRepository.save(question);

    await inMemoryQuestionCommentsRepository.save(
      makeQuestionComment({
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
