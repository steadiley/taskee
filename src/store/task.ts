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

  @Mutation
  updateTask(currentTask: Task) {
    const index = this.tasks.findIndex((task) => task.id === currentTask.id);
    if (index === -1) {
      return;
    }
    this.tasks = [
      ...this.tasks.slice(0, index),
      currentTask,
      ...this.tasks.slice(index + 1),
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

  @Action
  async finishTask(id: string) {
    await this.stopRunningTask();
    const maybeCompleteTask = this.tasks.find((item) => item.id === id);
    if (maybeCompleteTask) {
      maybeCompleteTask.finishedAt = new Date();
      const updatedTask = await this.taskUsecase.updateTask(
        this.uid,
        maybeCompleteTask
      );
      this.updateTask(updatedTask);
    }
  }

  @Action
  async unfinishTask(id: string) {
    const maybeCompleteTask = this.tasks.find((item) => item.id === id);
    if (maybeCompleteTask?.finishedAt) {
      maybeCompleteTask.finishedAt = null;
      const updatedTask = await this.taskUsecase.updateTask(
        this.uid,
        maybeCompleteTask
      );
      this.updateTask(updatedTask);
    }
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

  @Action
  async deleteTask(id: string) {
    // Explicitly stop the running task if it is to be deleted, so that bulletin board
    if (this.runningTask?.task.id === id) {
      await this.stopRunningTask();
    }
    await this.taskUsecase.deleteTask(this.uid, id);
    const remainingTasks = this.tasks.filter((task) => task.id !== id);
    const remainingTaskEvents = this.taskEvents.filter(
      (event) => event.taskId !== id
    );
    this.setTasks(remainingTasks);
    this.setTaskEvents(remainingTaskEvents);
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
