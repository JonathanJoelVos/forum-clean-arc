import { Notification } from "../../enterprise/entities/notification";

export interface NotificationsRepository {
  findById(id: string): Promise<Notification | null>;
  save(notification: Notification): Promise<void>;
  update(notification: Notification): Promise<void>;
}
