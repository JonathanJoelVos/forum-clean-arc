import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { SendNotificationUseCase } from "./send-notification";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;
describe("Send notification use case", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });
  it("should be able to send notification", async () => {
    const result = await sut.execute({
      content: "content",
      recipientId: "id",
      title: "title",
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(inMemoryNotificationsRepository.items[0].id).toEqual(
        result.value.notification.id
      );
    }
  });
});
