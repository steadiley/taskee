import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

import { TaskUsecase, AppTaskUsecase } from "@/app";
import { FirestoreTaskRepository } from "@/infra/repository/firestore/task";
import { TaskRepository } from "./domain/repository";

const container = new Container();
container
  .bind<TaskRepository>("TaskRepository")
  .toConstantValue(new FirestoreTaskRepository());

container
  .bind<TaskUsecase>("TaskUsecase")
  .to(AppTaskUsecase)
  .inSingletonScope();

const { lazyInject } = getDecorators(container);

export { lazyInject, container };
