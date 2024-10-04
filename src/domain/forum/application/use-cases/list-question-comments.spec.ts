import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { ListQuestionCommentsUseCase } from "./list-question-comments";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

let sut: ListQuestionCommentsUseCase;

describe("Create Answer use case", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    const inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository
    );
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    );
    sut = new ListQuestionCommentsUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository
    );
  });
  it("should be able to list recents answers", async () => {
    const author = makeStudent({
      name: "Jojo",
    });
    const question = makeQuestion(
      {
        authorId: author.id,
      },
      new UniqueEntityID("question-1")
    );
    inMemoryStudentsRepository.save(author);
    inMemoryQuestionsRepository.save(question);

    const comment1 = makeQuestionComment({
      questionId: question.id,
      authorId: author.id,
    });
    const comment2 = makeQuestionComment({
      questionId: question.id,
      authorId: author.id,
    });
    const comment3 = makeQuestionComment({
      questionId: question.id,
      authorId: author.id,
    });

    inMemoryQuestionCommentsRepository.save(comment1);
    inMemoryQuestionCommentsRepository.save(comment2);
    inMemoryQuestionCommentsRepository.save(comment3);

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.comments).toHaveLength(3);
      expect(result.value.comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            author: "Jojo",
            commentId: comment1.id,
          }),
          expect.objectContaining({
            author: "Jojo",
            commentId: comment2.id,
          }),
          expect.objectContaining({
            author: "Jojo",
            commentId: comment3.id,
          }),
        ])
      );
    }
  });
  it("should be able to list paginated recents answers", async () => {
    const author = makeStudent();
    const question = makeQuestion(
      {
        authorId: author.id,
      },
      new UniqueEntityID("question-1")
    );
    inMemoryStudentsRepository.save(author);
    inMemoryQuestionsRepository.save(question);

    for (let i = 0; i < 22; i++) {
      inMemoryQuestionCommentsRepository.save(
        makeQuestionComment({
          questionId: question.id,
          authorId: author.id,
        })
      );
    }

    const result = await sut.execute({
      page: 2,
      questionId: question.id.toString(),
    });
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.comments).toHaveLength(2);
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
