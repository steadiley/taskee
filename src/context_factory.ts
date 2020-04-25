import { container } from "tsyringe";

import { AppTaskUsecase } from "@/app";
import { InmemoryTaskRepository } from "@/infra/repository/inmemory/task";
import { TaskStore } from "@/store/task";

export type Context = {
  taskStore: TaskStore;
};

export const getResolvedContext = (): Context => {
  // switching what repository to use is controlled here
  container.register("TaskRepository", {
    useValue: new InmemoryTaskRepository(),
  });

  container.register("TaskUsecase", {
    useClass: AppTaskUsecase,
  });

  return {
    taskStore: container.resolve(TaskStore),
  };
};
