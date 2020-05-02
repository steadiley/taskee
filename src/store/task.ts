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

  @Action
  async fetchBacklogTasks() {
    const tasks = await this.taskUsecase.listBacklogTasks();
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
    this.taskEvents = taskEvents;
  }

  @Action
  async stopRunningTask() {
    const maybeIncompleteTaskEvent = this.incompleteTaskEvent;
    if (maybeIncompleteTaskEvent) {
      maybeIncompleteTaskEvent.endedAt = new Date();
      await this.taskUsecase.updateTaskEvent(maybeIncompleteTaskEvent);
    }
  }

  @Action
  async startTask(id: string) {
    await this.stopRunningTask();
    await this.taskUsecase.addTaskEvent({
      taskId: id,
    });
  }

  get incompleteTaskEvent() {
    return this.taskEvents.find((event) => !event.endedAt);
  }

  get runningTask(): Task | null {
    const maybeIncompleteTaskEvent = this.incompleteTaskEvent;
    if (!maybeIncompleteTaskEvent) {
      return null;
    }
    return (
      this.tasks.find((task) => task.id === maybeIncompleteTaskEvent.taskId) ||
      null
    );
  }
}
