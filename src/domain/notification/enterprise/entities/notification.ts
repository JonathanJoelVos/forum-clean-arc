import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface NotificationProps {
  recipentId: UniqueEntityID;
  title: string;
  content: string;
  createdAt: Date;
  readAt?: Date;
}

export class Notification extends Entity<NotificationProps> {
  static create(
    props: Optional<NotificationProps, "createdAt">,
    id?: UniqueEntityID
  ) {
    return new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }

  get recipientId() {
    return this.props.recipentId;
  }

  get title() {
    return this.props.title;
  }
  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get readAt() {
    return this.props.readAt;
  }

  read() {
    this.props.readAt = new Date();
  }
}
