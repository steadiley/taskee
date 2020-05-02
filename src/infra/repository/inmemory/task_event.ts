import { injectable } from "inversify";

import { TaskEvent } from "@/domain/entity";
import { TaskEventRepository } from "@/domain/repository";

@injectable()
export class InmemoryTaskEventRepository implements TaskEventRepository {
  private _eventMap: Map<string, TaskEvent[]> = new Map();

  async findAll(): Promise<TaskEvent[]> {
    const allEvents: TaskEvent[] = [];
    for (const events of this._eventMap.values()) {
      allEvents.concat(events);
    }
    return allEvents;
  }

  async add(taskEvent: TaskEvent): Promise<void> {
    if (!this._eventMap.has(taskEvent.taskId)) {
      this._eventMap.set(taskEvent.taskId, []);
    }
    this._eventMap.get(taskEvent.taskId)?.push(taskEvent);
  }

  async update(taskEvent: TaskEvent): Promise<void> {
    if (!this._eventMap.has(taskEvent.taskId)) {
      throw new Error(`No task with ID ${taskEvent.taskId}`);
    }
    const events = this._eventMap.get(taskEvent.taskId);
    if (!events) {
      throw new Error(`No task with ID ${taskEvent.taskId}`);
    }
    const maybeTaskEvent = events.find((event) => event.id === taskEvent.id);
    if (!maybeTaskEvent) {
      throw new Error("No task event found");
    }
    maybeTaskEvent.startedAt = taskEvent.startedAt;
    maybeTaskEvent.endedAt = taskEvent.endedAt;
  }
}
