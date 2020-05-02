import cuid from "cuid";

import { TaskEvent } from "@/domain/entity";
import { EventType } from "@/domain/entity/task_event";

export class TaskEventFactoy {
  private static generateId(): string {
    return cuid();
  }
  static createStopEvent(taskId: string): TaskEvent {
    return new TaskEvent(this.generateId(), taskId, EventType.STOP);
  }
  static createStartEvent(taskId: string): TaskEvent {
    return new TaskEvent(this.generateId(), taskId, EventType.START);
  }
}
