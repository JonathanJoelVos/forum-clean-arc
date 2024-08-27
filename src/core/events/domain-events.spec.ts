import { AggregateRoot } from "../entities/aggregate-root";
import { DomainEvent } from "./domain-event";
import { DomainEvents } from "./domain-events";

class CustomAggregateCreatedEvent implements DomainEvent {
  public aggregate: unknown;
  public ocorredAt: Date;

  constructor(aggregate: CustomAggregate) {
    this.ocorredAt = new Date();
    this.aggregate = aggregate;
  }

  getAggregateId() {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<unknown> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvents(new CustomAggregateCreatedEvent(aggregate));

    return aggregate;
  }
}

describe("Domain Events", () => {
  it("should be able to dispatch and listen to events", () => {
    const callbackSpyFn = vi.fn();

    DomainEvents.register(CustomAggregateCreatedEvent.name, callbackSpyFn);

    const aggregate = CustomAggregate.create();
    expect(aggregate.domainEvents).toHaveLength(1);

    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    expect(callbackSpyFn).toHaveBeenCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
