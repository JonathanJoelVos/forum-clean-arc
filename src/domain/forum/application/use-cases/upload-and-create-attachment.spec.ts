import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";
import { FakeUploader } from "test/storage/fake-uploader";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let sut: UploadAndCreateAttachmentUseCase;
let fakeUploader: FakeUploader;

describe("Create Attachment use case", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader
    );
  });
  it("should be able to ", async () => {
    const result = await sut.execute({
      body: Buffer.from(""),
      fileName: "teste.png",
      fileType: "image/png",
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.attachment).toEqual(
        inMemoryAttachmentsRepository.items[0]
      );
      expect(fakeUploader.items[0].fileName).toEqual("teste.png");
    }
  });
});
