//Essa classe é uma classe que todas entidades do nosso programa extendem
// usamos ela para manter e padronizar partes que se repetem em todas entidades como id, construtor...

import { DomainEvent } from "../events/domain-event";
import { DomainEvents } from "../events/domain-events";
import { UniqueEntityID } from "./unique-entity-id";

export class Entity<T> {
  private _id: UniqueEntityID;
  protected props: T;
  _domainEvents: DomainEvent[] = [];

  //colocamos protected para que só as classes que extendem possam usar ele isso faz com que se usarmos um Answer extends Entity e fizermos um método static create { return new Answer()} isso força com que seja obrigatório usar o método create para instanciar a Answer (já que não é possível instanciar a Answer pois ela usa o construtor de Entity apenas)
  protected constructor(props: T, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID();
    this.props = props;
  }

  get id() {
    return this._id;
  }

  get domainEvents() {
    return this._domainEvents;
  }

  protected addDomainEvents(domainEvent: DomainEvent) {
    this._domainEvents.push(domainEvent);
    DomainEvents.markAggregateForDispatch(this);
  }

  public clearEvents() {
    this._domainEvents = [];
  }
}
