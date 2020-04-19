import "reflect-metadata";
import { container } from "tsyringe";

import { TaskUsecase } from "@/app";
import { InmemoryTaskRepository } from "@/infra/repository/inmemory/task";

type Context = {
  taskUsecase: TaskUsecase;
};

export const getResolvedContext = (): Context => {
  // switching what repository to use is controlled here
  container.register("TaskRepository", {
    useClass: InmemoryTaskRepository,
  });

  return {
    taskUsecase: container.resolve(TaskUsecase),
  };
};
