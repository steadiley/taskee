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
  listUnfinishedTasks(userId: string): Promise<Task[]>;
  listTaskEvents(userId: string): Promise<TaskEvent[]>;
  addTask(userId: string, addTaskCommand: AddTaskCommand): Promise<Task>;
  deleteTask(userId: string, taskId: string): Promise<void>;
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

  async listUnfinishedTasks(userId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.getUnfinishedTasks(userId);
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

  async deleteTask(userId: string, taskId: string): Promise<void> {
    await this.taskRepository.deleteTask(userId, taskId);
    await this.taskEventRepository.deleteAllTaskEvents(userId, taskId);
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
