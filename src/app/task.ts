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
  listTodaysTasks(): Promise<Task[]>;
  listBacklogTasks(): Promise<Task[]>;
  listTaskEvents(): Promise<TaskEvent[]>;
  addTask(addTaskCommand: AddTaskCommand): Promise<Task>;
  addTaskEvent(addTaskEventCommand: AddTaskEventCommand): Promise<TaskEvent>;
  updateTaskEvent(taskEvent: TaskEvent): Promise<TaskEvent>;
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

  async addTaskEvent({ taskId }: AddTaskEventCommand): Promise<TaskEvent> {
    const taskEvent = new TaskEvent(cuid(), taskId, new Date());
    await this.taskEventRepository.add(taskEvent);
    return taskEvent;
  }

  async updateTaskEvent(taskEvent: TaskEvent): Promise<TaskEvent> {
    await this.taskEventRepository.update(taskEvent);
    return taskEvent;
  }

  async listTaskEvents(): Promise<TaskEvent[]> {
    const taskEvents = await this.taskEventRepository.findAll();
    return taskEvents;
  }
}
