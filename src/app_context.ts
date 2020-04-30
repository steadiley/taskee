import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

import { TaskUsecase, AppTaskUsecase } from "@/app";
import {
  InmemoryTaskRepository,
  InmemoryTaskEventRepository,
} from "@/infra/repository/inmemory";
import { FirestoreTaskRepository } from "@/infra/repository/firestore/task";
import { TaskRepository, TaskEventRepository } from "./domain/repository";

const container = new Container();

if (process.env.NODE_ENV === "test") {
  container
    .bind<TaskRepository>("TaskRepository")
    .toConstantValue(new InmemoryTaskRepository());
} else {
  container
    .bind<TaskRepository>("TaskRepository")
    .toConstantValue(new FirestoreTaskRepository());
}

container
  .bind<TaskEventRepository>("TaskEventRepository")
  .toConstantValue(new InmemoryTaskEventRepository());

container
  .bind<TaskUsecase>("TaskUsecase")
  .to(AppTaskUsecase)
  .inSingletonScope();

const { lazyInject } = getDecorators(container);

export { lazyInject, container };
