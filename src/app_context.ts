import "reflect-metadata";
import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

import { TaskUsecase, AppTaskUsecase } from "@/apps";

import { TaskRepository, TaskEventRepository } from "./domain/repository";
import { createFirestoreClient } from "./infra/repository/firestore/firestore_client";

const container = new Container();

if (process.env.NODE_ENV === "test") {
  const {
    InmemoryTaskRepository,
    InmemoryTaskEventRepository,
  } = require("@/infra/repository/inmemory");
  container
    .bind<TaskRepository>("TaskRepository")
    .toConstantValue(new InmemoryTaskRepository());
  container
    .bind<TaskEventRepository>("TaskEventRepository")
    .toConstantValue(new InmemoryTaskEventRepository());
} else {
  const {
    FirestoreTaskRepository,
    FirestoreTaskEventRepository,
  } = require("@/infra/repository/firestore");
  const firestoreClient = createFirestoreClient();
  container
    .bind<TaskRepository>("TaskRepository")
    .toConstantValue(new FirestoreTaskRepository(firestoreClient));
  container
    .bind<TaskEventRepository>("TaskEventRepository")
    .toConstantValue(new FirestoreTaskEventRepository(firestoreClient));
}

container
  .bind<TaskUsecase>("TaskUsecase")
  .to(AppTaskUsecase)
  .inSingletonScope();

const { lazyInject } = getDecorators(container);

export { lazyInject, container };
