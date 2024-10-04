import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

describe("Delete QuestionComment use case", () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository
    );
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });
  it("should be able to delete an question comment", async () => {
    const questioncomment = makeQuestionComment({});

    await inMemoryQuestionCommentsRepository.save(questioncomment);

    await sut.execute({
      authorId: questioncomment.authorId.toString(),
      questionCommentId: questioncomment.id.toString(),
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });
  it("should not be able to delete a question comment from another user", async () => {
    const questioncomment = makeQuestionComment({
      authorId: new UniqueEntityID("author-1"),
    });

    await inMemoryQuestionCommentsRepository.save(questioncomment);

    const result = await sut.execute({
      authorId: "author-2",
      questionCommentId: questioncomment.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
