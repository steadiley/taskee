import cuid from "cuid";

import { Task } from "@/domain/entity";

export class TaskFactory {
  private static generateId(): string {
    return cuid();
  }

  static createTask(title: string, dueDate?: Date): Task {
    return new Task(this.generateId(), title, dueDate);
  }
}
