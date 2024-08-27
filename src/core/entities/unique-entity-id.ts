import { randomUUID } from "node:crypto";

export class UniqueEntityID {
  private _id: string;

  constructor(id?: string) {
    this._id = id ?? randomUUID();
  }

  toString() {
    return this._id;
  }

  toValue() {
    return this._id;
  }
}
