import dayjs from "dayjs";
import cuid from "cuid";

import { Task, TaskEvent } from "@/domain/entity";
import { TaskFactory } from "@/domain/factory";
import { TaskRepository, TaskEventRepository } from "@/domain/repository";
import { injectable, inject } from "inversify";

interface AddTaskCommand {
  title: string;
  dueDate?: Date;
}

interface AddTaskEventCommand {
  taskId: string;
}

export interface TaskUsecase {
  listTodaysTasks(userId: string): Promise<Task[]>;
  listBacklogTasks(userId: string): Promise<Task[]>;
  listUpcomingTasks(userId: string, days: number): Promise<Task[]>;
  listTaskEvents(userId: string): Promise<TaskEvent[]>;
  addTask(userId: string, addTaskCommand: AddTaskCommand): Promise<Task>;
  addTaskEvent(
    userId: string,
    addTaskEventCommand: AddTaskEventCommand
  ): Promise<TaskEvent>;
  updateTaskEvent(userId: string, taskEvent: TaskEvent): Promise<TaskEvent>;
}

@injectable()
export class AppTaskUsecase implements TaskUsecase {
  constructor(
    @inject("TaskRepository") private taskRepository: TaskRepository,
    @inject("TaskEventRepository")
    private taskEventRepository: TaskEventRepository
  ) {}

  async listTodaysTasks(userId: string): Promise<Task[]> {
    const now = dayjs(); // TODO: deal with timezone setting of user
    const startOfDay = now.startOf("day").toDate();
    const endOfDay = now.endOf("day").toDate();

    const tasks = await this.taskRepository.getTasksByDateRange(
      userId,
      startOfDay,
      endOfDay
    );
    return tasks;
  }

  /**
   * Get upcoming tasks from today to `number` days after (including today)
   * @param userId
   * @param days
   */
  async listUpcomingTasks(userId: string, days: number): Promise<Task[]> {
    const now = dayjs(); // TODO: deal with timezone setting of user
    const startOfDay = now.startOf("day").toDate();
    const endOfDay = now
      .add(days - 1, "day")
      .endOf("day")
      .toDate();

    const tasks = await this.taskRepository.getTasksByDateRange(
      userId,
      startOfDay,
      endOfDay
    );
    return tasks;
  }

  async listBacklogTasks(userId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.getTasksWithNoDueDate(userId);
    return tasks;
  }

  async addTask(
    userId: string,
    { title, dueDate }: AddTaskCommand
  ): Promise<Task> {
    const task = TaskFactory.createTask(title, dueDate);
    await this.taskRepository.addTask(userId, task);
    return task;
  }

  async addTaskEvent(
    userId: string,
    { taskId }: AddTaskEventCommand
  ): Promise<TaskEvent> {
    const taskEvent = new TaskEvent(cuid(), taskId, new Date());
    await this.taskEventRepository.add(userId, taskEvent);
    return taskEvent;
  }

  async updateTaskEvent(
    userId: string,
    taskEvent: TaskEvent
  ): Promise<TaskEvent> {
    await this.taskEventRepository.update(userId, taskEvent);
    return taskEvent;
  }

  async listTaskEvents(userId: string): Promise<TaskEvent[]> {
    const taskEvents = await this.taskEventRepository.findAll(userId);
    return taskEvents;
  }
}
