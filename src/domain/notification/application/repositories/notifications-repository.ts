import { Notification } from "../../enterprise/entities/notification";

export abstract class NotificationsRepository {
  abstract findById(id: string): Promise<Notification | null>;
  abstract save(notification: Notification): Promise<void>;
  abstract update(notification: Notification): Promise<void>;
}
