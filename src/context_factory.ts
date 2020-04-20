import { container } from "tsyringe";

import { TaskUsecase, AppTaskUsecase } from "@/app";
import { InmemoryTaskRepository } from "@/infra/repository/inmemory/task";

type Context = {
  taskUsecase: TaskUsecase;
};

export const getResolvedContext = (): Context => {
  // switching what repository to use is controlled here
  container.register("TaskRepository", {
    useValue: new InmemoryTaskRepository(),
  });

  return {
    taskUsecase: container.resolve(AppTaskUsecase),
  };
};
