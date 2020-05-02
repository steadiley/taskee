import dayjs from "dayjs";

import { Task } from "@/domain/entity";
import { TaskFactory, TaskEventFactoy } from "@/domain/factory";
import { TaskRepository, TaskEventRepository } from "@/domain/repository";
import { injectable, inject } from "inversify";

interface AddTaskCommand {
  title: string;
  dueDate?: Date;
}

export interface TaskUsecase {
  listTodaysTasks(): Promise<Task[]>;
  listBacklogTasks(): Promise<Task[]>;
  addTask(addTaskCommand: AddTaskCommand): Promise<Task>;
  startTask(taskId: string): Promise<void>;
  stopRunningTask(): Promise<void>;
}

@injectable()
export class AppTaskUsecase implements TaskUsecase {
  constructor(
    @inject("TaskRepository") private taskRepository: TaskRepository,
    @inject("TaskEventRepository")
    private taskEventRepository: TaskEventRepository
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
    const task = TaskFactory.createTask(title, dueDate);
    await this.taskRepository.addTask(task);
    return task;
  }

  async startTask(taskId: string) {
    await this.stopRunningTask();
    await this.taskRepository.updateRunningTask(taskId);
    await this.taskEventRepository.add(
      taskId,
      TaskEventFactoy.createStartEvent(taskId)
    );
  }

  async stopRunningTask() {
    const runningTask = await this.taskRepository.getRunningTask();
    if (runningTask) {
      await this.taskEventRepository.add(
        runningTask.id,
        TaskEventFactoy.createStopEvent(runningTask.id)
      );
    }
  }
}
