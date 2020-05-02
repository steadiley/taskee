import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";

import { Task } from "@/domain/entity";
import { TaskUsecase } from "@/apps";
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

  @Action
  async addTask({ title, dueDate }: { title: string; dueDate?: Date }) {
    const newTask = await this.taskUsecase.addTask({ title, dueDate });
    this.setTasks(this.tasks.concat(newTask));
  }
}
