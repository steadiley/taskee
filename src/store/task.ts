import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { injectable, inject } from "tsyringe";

import { Task } from "@/domain/entity";
import { TaskUsecase } from "@/app";

export interface TaskState {
  tasks: Task[];
}

@Module({ name: "task" })
@injectable()
export class TaskStore extends VuexModule {
  tasks: Task[] = [];

  constructor(@inject("TaskUsecase") private taskUsecase: TaskUsecase) {
    super({});
  }

  @Mutation
  addTasks(tasks: Task[]) {
    this.tasks.concat(tasks);
  }

  @Action
  async fetchBacklogTasks() {
    const tasks = await this.taskUsecase.listBacklogTasks();
    this.addTasks(tasks);
  }
}
