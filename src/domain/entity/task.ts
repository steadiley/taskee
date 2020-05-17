import { InvalidArgumentError } from "@/errors";

export class Task {
  private _updatedAt!: Date;
  private _createdAt!: Date;

  constructor(
    private _id: string,
    private _title: string,
    private _dueDate: Date | null = null,
    private _finishedAt: Date | null = null,
    _updatedAt: Date | null = null,
    _createdAt: Date | null = null
  ) {
    const now = new Date();
    if (!_updatedAt) {
      this._updatedAt = now;
    }
    if (!_createdAt) {
      this._createdAt = now;
    }
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }
  set title(newTitle: string) {
    if (newTitle.length > 50) {
      throw new InvalidArgumentError(`title length should not be more than 50`);
    }
    this._title = newTitle;
  }

  get dueDate(): Date | null {
    return this._dueDate;
  }
  set dueDate(newDate: Date | null) {
    const now = new Date();
    if (newDate && newDate <= now) {
      throw new InvalidArgumentError(`due date should be later than now`);
    }
    this._dueDate = newDate;
  }

  get finishedAt(): Date | null {
    return this._finishedAt;
  }
  set finishedAt(newDate: Date | null) {
    const now = new Date();

    if (newDate && newDate <= now) {
      throw new InvalidArgumentError(`due date should be later than now`);
    }
    this._finishedAt = newDate;
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

export default Task;
