import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

import { Task, TaskEvent } from "@/domain/entity";
import { TaskUsecase } from "@/app";
import { lazyInject } from "@/app_context";

export interface TaskState {
  tasks: Task[];
}

@Module({ name: "task" })
export class TaskStore extends VuexModule {
  tasks: Task[] = [];
  taskEvents: TaskEvent[] = [];

  @lazyInject("TaskUsecase") private taskUsecase!: TaskUsecase;

  @Mutation
  setTasks(tasks: Task[]) {
    this.tasks = tasks;
  }

  @Mutation
  setTaskEvents(taskEvents: TaskEvent[]) {
    this.taskEvents = taskEvents;
  }

  @Mutation
  addTaskEvent(taskEvent: TaskEvent) {
    this.taskEvents.push(taskEvent);
  }

  @Mutation
  updateTaskEvent(taskEvent: TaskEvent) {
    const index = this.taskEvents.findIndex(
      (event) => event.id === taskEvent.id
    );
    if (index === -1) {
      return;
    }
    this.taskEvents = [
      ...this.taskEvents.slice(0, index),
      taskEvent,
      ...this.taskEvents.slice(index + 1),
    ];
  }

  @Action
  async fetchTodaysTasks() {
    const tasks = await this.taskUsecase.listTodaysTasks();
    this.setTasks(tasks);
  }

  @Action
  async addTask({ title, dueDate }: { title: string; dueDate?: Date }) {
    const newTask = await this.taskUsecase.addTask({ title, dueDate });
    this.setTasks(this.tasks.concat(newTask));
  }

  @Action
  async fetchTaskEvents() {
    const taskEvents = await this.taskUsecase.listTaskEvents();
    this.setTaskEvents(taskEvents);
  }

  @Action
  async stopRunningTask() {
    const maybeIncompleteTaskEvent = this.incompleteTaskEvent;
    if (maybeIncompleteTaskEvent) {
      maybeIncompleteTaskEvent.endedAt = new Date();
      const updatedTaskEvent = await this.taskUsecase.updateTaskEvent(
        maybeIncompleteTaskEvent
      );
      this.updateTaskEvent(updatedTaskEvent);
    }
  }

  @Action
  async startTask(id: string) {
    await this.stopRunningTask();
    const taskEvent = await this.taskUsecase.addTaskEvent({
      taskId: id,
    });
    this.addTaskEvent(taskEvent);
  }

  get incompleteTaskEvent() {
    return this.taskEvents.find((event) => !event.endedAt);
  }

  get runningTask(): { task: Task; startedAt: Date } | null {
    const maybeIncompleteTaskEvent = this.incompleteTaskEvent;
    if (!maybeIncompleteTaskEvent) {
      return null;
    }
    const task = this.tasks.find(
      (task) => task.id === maybeIncompleteTaskEvent.taskId
    );
    return task
      ? {
          task,
          startedAt: maybeIncompleteTaskEvent.startedAt,
        }
      : null;
  }
}
