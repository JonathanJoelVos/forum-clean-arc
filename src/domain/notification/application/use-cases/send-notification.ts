import { Either, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface SendNotificationUseCaseRequest {
  content: string;
  title: string;
  recipientId: string;
}

type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    content,
    recipientId,
    title,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      content,
      recipentId: new UniqueEntityID(recipientId),
      title,
    });

    await this.notificationsRepository.save(notification);

    return right({
      notification,
    });
  }
}
