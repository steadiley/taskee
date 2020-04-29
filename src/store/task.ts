import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

import { Task } from "@/domain/entity";
import { TaskUsecase } from "@/app";
import { lazyInject } from "@/app_context";

export interface TaskState {
  tasks: Task[];
}

@Module({ name: "task" })
export class TaskStore extends VuexModule {
  tasks: Task[] = [];
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
}
