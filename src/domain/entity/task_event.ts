import { InvalidArgumentError } from "@/errors";

export class TaskEvent {
  constructor(
    private _id: string,
    private _taskId: string,
    private _startedAt: Date,
    private _endedAt: Date | null = null
  ) {}

  get id() {
    return this._id;
  }

  get taskId() {
    return this._taskId;
  }

  get startedAt(): Date {
    return this._startedAt;
  }
  set startedAt(newDate: Date) {
    if (this.endedAt && newDate > this.endedAt) {
      throw new InvalidArgumentError(`startedAt should not be after endedAt`);
    }
    this._startedAt = newDate;
  }

  get endedAt(): Date | null {
    return this._endedAt;
  }
  set endedAt(newDate: Date | null) {
    if (newDate && newDate < this.startedAt) {
      throw new InvalidArgumentError(`endedAt should not be before startedAt`);
    }
    this._endedAt = newDate;
  }
}
