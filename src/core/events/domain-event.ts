import { UniqueEntityID } from "../entities/unique-entity-id";

export interface DomainEvent {
  ocorredAt: Date;
  getAggregateId(): UniqueEntityID;
}
