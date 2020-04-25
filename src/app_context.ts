import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

import { TaskUsecase, AppTaskUsecase } from "@/app";
import { InmemoryTaskRepository } from "@/infra/repository/inmemory/task";
import { TaskRepository } from "./domain/repository";

const container = new Container();
container
  .bind<TaskRepository>("TaskRepository")
  .toConstantValue(new InmemoryTaskRepository());

container
  .bind<TaskUsecase>("TaskUsecase")
  .to(AppTaskUsecase)
  .inSingletonScope();

const { lazyInject } = getDecorators(container);

export { lazyInject, container };
