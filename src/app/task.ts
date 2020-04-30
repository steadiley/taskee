import dayjs from "dayjs";
import cuid from "cuid";

import { Task, TaskEvent } from "@/domain/entity";
import { TaskRepository, TaskEventRepository } from "@/domain/repository";
import { injectable, inject } from "inversify";
import { EventType } from "@/domain/entity/task_event";

interface AddTaskCommand {
  title: string;
  dueDate?: Date;
}

interface AddTaskEventCommand {
  taskId: string;
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
    const id = cuid();
    const task = new Task(id, title, dueDate);
    await this.taskRepository.addTask(task);
    return task;
  }

  async startTask(taskId: string) {
    const lastAddedEvent = await this.taskEventRepository.findLastAdded();
    if (lastAddedEvent && lastAddedEvent.type === EventType.START) {
      await this.taskEventRepository.add(
        lastAddedEvent.taskId,
        new TaskEvent(cuid(), lastAddedEvent.taskId, EventType.STOP)
      );
    }
    await this.taskEventRepository.add(
      taskId,
      new TaskEvent(cuid(), taskId, EventType.START)
    );
  }

  async stopTask(taskId: string) {
    const lastAddedEvent = await this.taskEventRepository.findLastAdded();
    if (
      !lastAddedEvent ||
      lastAddedEvent.taskId !== taskId ||
      lastAddedEvent.type === EventType.START
    ) {
      throw new Error(`Task ID ${taskId} is not running`);
    }
    await this.taskEventRepository.add(
      taskId,
      new TaskEvent(cuid(), taskId, EventType.STOP)
    );
  }
}
