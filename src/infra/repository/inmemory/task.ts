import { Task } from "@/domain/entity";
import { TaskRepository } from "@/domain/repository";
import { injectable } from "inversify";

const defaultTasks: Task[] = [
  new Task("1", "read a book", null, null),
  new Task("2", "go to gym", null, null),
  new Task("3", "cook oyakodon", null, null),
];

@injectable()
export class InmemoryTaskRepository implements TaskRepository {
  private _tasks: Task[] = defaultTasks;
  constructor(tasks?: Task[]) {
    if (tasks) {
      this._tasks = tasks;
    }
  }

  async getTasksByDateRange(from: Date, to: Date): Promise<Task[]> {
    return this._tasks.filter(
      (task) => task.dueDate && task.dueDate >= from && task.dueDate <= to
    );
  }

  async getTasksWithNoDueDate(): Promise<Task[]> {
    return this._tasks.filter((task) => !task.dueDate);
  }

  async addTask(task: Task): Promise<void> {
    this._tasks.concat(task);
  }

  async getRunningTask(): Promise<Task | null> {
    // FIXME: not functioning
    return null;
  }

  async updateRunningTask(): Promise<void> {
    // FIXME: not functioning
    return;
  }

  async getTaskById(): Promise<Task | null> {
    // FIXME: not functioning
    return null;
  }
}
