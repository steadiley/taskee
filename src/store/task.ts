import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

import { Task, TaskEvent } from "@/domain/entity";
import { TaskUsecase } from "@/apps";
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
  async fetchInitData() {
    await this.fetchUnfinishedTasks();
    await this.fetchTaskEvents();
  }

  @Action
  async fetchUnfinishedTasks() {
    const tasks = await this.taskUsecase.listUnfinishedTasks(this.uid);
    this.setTasks(tasks);
  }

  @Action
  async addTask({ title, dueDate }: { title: string; dueDate?: Date }) {
    const newTask = await this.taskUsecase.addTask(this.uid, {
      title,
      dueDate,
    });
    this.setTasks(this.tasks.concat(newTask));
  }

  @Action
  async fetchTaskEvents() {
    this.context.rootState.user;
    const taskEvents = await this.taskUsecase.listTaskEvents(this.uid);
    this.setTaskEvents(taskEvents);
  }

  @Action
  async stopRunningTask() {
    const maybeIncompleteTaskEvent = this.incompleteTaskEvent;
    if (maybeIncompleteTaskEvent) {
      maybeIncompleteTaskEvent.endedAt = new Date();
      const updatedTaskEvent = await this.taskUsecase.updateTaskEvent(
        this.uid,
        maybeIncompleteTaskEvent
      );
      this.updateTaskEvent(updatedTaskEvent);
    }
  }

  @Action
  async startTask(id: string) {
    await this.stopRunningTask();
    const taskEvent = await this.taskUsecase.addTaskEvent(this.uid, {
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

  get calcTotalTimeSpentById() {
    return (taskId: string) => {
      return this.taskEvents
        .filter((event) => event.taskId === taskId && event.isEnded)
        .map((event) => event.duration)
        .reduce((a, b) => a + b, 0);
    };
  }

  get uid() {
    return this.context.rootState.user.userId;
  }
}
