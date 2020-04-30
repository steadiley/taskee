import { injectable } from "inversify";

import { TaskEvent } from "@/domain/entity";
import { TaskEventRepository } from "@/domain/repository";

@injectable()
export class InmemoryTaskEventRepository implements TaskEventRepository {
  private _eventMap: Map<string, TaskEvent[]> = new Map();

  async add(taskId: string, taskEvent: TaskEvent): Promise<void> {
    if (!this._eventMap.has(taskId)) {
      this._eventMap.set(taskId, []);
    }
    this._eventMap.get(taskId)?.push(taskEvent);
  }

  async findAllForTask(taskId: string): Promise<TaskEvent[]> {
    const tasks = this._eventMap.get(taskId);
    if (!tasks) {
      throw new Error(`Task with ID ${taskId} not found`);
    }
    return tasks;
  }
}
