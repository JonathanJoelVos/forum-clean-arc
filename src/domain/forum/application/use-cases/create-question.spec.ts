import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CreateQuestionUseCase } from "./create-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: CreateQuestionUseCase;

describe("Create Question use case", () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });
  it("should be able to create an question", async () => {
    const result = await sut.execute({
      content: "teste",
      authorId: "test-id",
      title: "test-id",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryQuestionsRepository.items[0].id).toEqual(
        result.value.question.id
      );
      expect(
        inMemoryQuestionsRepository.items[0].attachments.currentItems
      ).toHaveLength(2);
      expect(
        inMemoryQuestionsRepository.items[0].attachments.currentItems
      ).toEqual([
        expect.objectContaining({
          attachmentId: new UniqueEntityID("1"),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID("2"),
        }),
      ]);
      expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2);
      expect(inMemoryQuestionAttachmentsRepository.items).toEqual([
        expect.objectContaining({
          attachmentId: new UniqueEntityID("1"),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID("2"),
        }),
      ]);
    }
  });
});
