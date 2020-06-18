import { Task } from "@/domain/entity";
import { TaskRepository } from "@/domain/repository";
import { injectable } from "inversify";

const defaultTasks: Task[] = [];

@injectable()
export class InmemoryTaskRepository implements TaskRepository {
  private _tasks: Task[] = defaultTasks;
  constructor(tasks?: Task[]) {
    if (tasks) {
      this._tasks = tasks;
    }
  }

  async getUnfinishedTasks(): Promise<Task[]> {
    return this._tasks.filter((task) => !task.finishedAt);
  }

  async addTask(userId: string, task: Task): Promise<void> {
    this._tasks = this._tasks.concat(task);
  }

  async getTaskById(): Promise<Task | null> {
    // FIXME: not functioning
    return null;
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    this._tasks = this._tasks.filter((task) => task.id !== taskId);
  }
}
