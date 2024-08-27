import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete AnswerComment use case", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });
  it("should be able to delete an answer comment", async () => {
    const answercomment = makeAnswerComment({});

    await inMemoryAnswerCommentsRepository.save(answercomment);

    await sut.execute({
      authorId: answercomment.authorId.toString(),
      answerCommentId: answercomment.id.toString(),
    });

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });
  it("should not be able to delete a answer comment from another user", async () => {
    const answercomment = makeAnswerComment({
      authorId: new UniqueEntityID("author-1"),
    });

    await inMemoryAnswerCommentsRepository.save(answercomment);

    const result = await sut.execute({
      authorId: "author-2",
      answerCommentId: answercomment.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
