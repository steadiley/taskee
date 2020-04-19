import dayjs from "dayjs";
import { injectable, inject } from "tsyringe";

import { Task } from "@/domain/entity";
import { TaskRepository } from "@/domain/repository";

@injectable()
export class TaskUsecase {
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
}
