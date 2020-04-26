import dayjs from "dayjs";
import cuid from "cuid";

import { Task } from "@/domain/entity";
import { TaskRepository } from "@/domain/repository";
import { injectable, inject } from "inversify";

interface AddTaskCommand {
  title: string;
  dueDate?: Date;
}

export interface TaskUsecase {
  listTodaysTasks(): Promise<Task[]>;
  listBacklogTasks(): Promise<Task[]>;
  addTask(addTaskCommand: AddTaskCommand): Promise<Task>;
}

@injectable()
export class AppTaskUsecase implements TaskUsecase {
  constructor(
    @inject("TaskRepository") private taskRepository: TaskRepository
  ) {}

  async listTodaysTasks(): Promise<Task[]> {
    const now = dayjs(); // TODO: deal with timezone setting of user
    const startOfDay = now.startOf("day").toDate();
    const endOfDay = now.endOf("day").toDate();

    const tasks = await this.taskRepository.getTasksByDateRange(
      startOfDay,
      endOfDay
    );
    return tasks;
  }

  async listBacklogTasks(): Promise<Task[]> {
    const tasks = await this.taskRepository.getTasksWithNoDueDate();
    return tasks;
  }

  async addTask({ title, dueDate }: AddTaskCommand): Promise<Task> {
    const id = cuid();
    const task = new Task(id, title, dueDate);
    await this.taskRepository.addTask(task);
    return task;
  }
}
