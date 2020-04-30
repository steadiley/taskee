import { InvalidArgumentError } from "@/errors";

export enum EventType {
  START = "START",
  STOP = "STOP",
}

export class TaskEvent {
  private _updatedAt: Date;
  private _createdAt: Date;

  constructor(
    private _id: string,
    private _taskId: string,
    private _type: EventType
  ) {
    const now = new Date();
    this._updatedAt = now;
    this._createdAt = now;
  }

  get id() {
    return this._id;
  }

  get taskId() {
    return this._taskId;
  }

  get type() {
    return this._type;
  }
  set type(newType: EventType) {
    this._type = newType;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
  set updatedAt(newDate: Date) {
    const now = new Date();

    if (newDate > now) {
      throw new InvalidArgumentError(`updatedAt should be before now`);
    }
    this._updatedAt = newDate;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
  set createdAt(newDate: Date) {
    const now = new Date();

    if (newDate > now) {
      throw new InvalidArgumentError(`createdAt should be before now`);
    }
    this._createdAt = newDate;
  }
}
