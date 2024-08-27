import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueEntityID } from "../entities/unique-entity-id";
import { DomainEvent } from "./domain-event";

type DomainEventCallback = (event: unknown) => void;

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {};
  private static markedAggregates: AggregateRoot<unknown>[] = [];

  public static register(
    eventClassName: string,
    callback: DomainEventCallback
  ) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap;
    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = [];
    }
    this.handlersMap[eventClassName].push(callback);
  }
  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const aggregateFound = !!this.findMarkedAggregateById(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  private static findMarkedAggregateById(
    aggregateId: UniqueEntityID
  ): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find(
      (aggregate) => aggregate.id === aggregateId
    );
  }

  public static dispatchEventsForAggregate(id: UniqueEntityID) {
    const aggregate = this.findMarkedAggregateById(id);
    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>
  ) {
    const index = this.markedAggregates.findIndex(
      (item) => item.id === aggregate.id
    );

    this.markedAggregates.splice(index, 1);
  }

  public static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    aggregate.domainEvents.forEach((domainEvent) => this.dispatch(domainEvent));
  }

  private static dispatch(event: DomainEvent) {
    const eventClassName = event.constructor.name;
    const isEventRegistered = eventClassName in this.handlersMap;

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName];
      for (const handler of handlers) {
        handler(event);
      }
    }
  }
}
