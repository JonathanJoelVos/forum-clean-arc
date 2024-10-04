import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";
import { makeAttachment } from "test/factories/make-attachment";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Create Question use case", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });
  it("should be able to create an question", async () => {
    const student = makeStudent({
      name: "Jojo",
    });

    inMemoryStudentsRepository.items.push(student);
    const newQuestion = makeQuestion({
      slug: Slug.createFromText("example-slug"),
      authorId: student.id,
    });
    inMemoryQuestionsRepository.items.push(newQuestion);

    const attachement = makeAttachment({
      title: "Algum anexo",
    });

    inMemoryAttachmentsRepository.items.push(attachement);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachement.id,
        questionId: newQuestion.id,
      })
    );

    const result = await sut.execute({
      slug: "example-slug",
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.question.title).toEqual(newQuestion.title);
      expect(result.value).toMatchObject({
        question: expect.objectContaining({
          title: newQuestion.title,
          author: "Jojo",
          attachments: [
            expect.objectContaining({
              title: "Algum anexo",
            }),
          ],
        }),
      });
    }
  });
});
