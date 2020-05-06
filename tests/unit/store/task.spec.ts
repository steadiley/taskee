import { getModule } from "vuex-module-decorators";
import firebase from "firebase";
import * as firebaseTest from "@firebase/testing";

import { TaskStore } from "@/store/task";
import { container } from "@/app_context";
import createStore from "@/store";
import { TaskRepository, TaskEventRepository } from "@/domain/repository";
import {
  FirestoreTaskEventRepository,
  FirestoreTaskRepository,
} from "@/infra/repository/firestore";
import { UserStore } from "@/store/user";

const PROJECT_ID = "my-test-project";
const USER_ID = "taskee-user";
const EMAIL = "taskee-user@example.com";

describe("TaskList.vue", () => {
  let taskStore: TaskStore;
  let userStore: UserStore;
  let firestoreClient: firebase.firestore.Firestore;
  let adminFirestoreClient: firebase.firestore.Firestore;

  const setupFirestore = () => {
    /* Setup firestore */
    const firebaseApp = firebaseTest.initializeTestApp({
      projectId: PROJECT_ID,
      auth: { uid: USER_ID, email: EMAIL },
    });
    firestoreClient = firebaseApp.firestore();
    container.unbind("TaskRepository");
    container.unbind("TaskEventRepository");
    container
      .bind<TaskRepository>("TaskRepository")
      .toConstantValue(new FirestoreTaskRepository(firestoreClient));
    container
      .bind<TaskEventRepository>("TaskEventRepository")
      .toConstantValue(new FirestoreTaskEventRepository(firestoreClient));
    const firebaseAdminApp = firebaseTest.initializeAdminApp({
      projectId: PROJECT_ID,
    });
    adminFirestoreClient = firebaseAdminApp.firestore();
  };

  beforeAll(() => {
    setupFirestore();

    /* Setup Vuex store */
    const store = createStore();
    taskStore = getModule(TaskStore, store);
    userStore = getModule(UserStore, store);
    userStore.login({ userId: USER_ID, email: EMAIL });
  });

  beforeEach(async () => {
    container.snapshot();
    await firebaseTest.clearFirestoreData({ projectId: PROJECT_ID });
  });

  afterEach(() => {
    container.restore();
  });

  it("can add tasks", async () => {
    await taskStore.addTask({ title: "go to bookstore", dueDate: new Date() });
    await taskStore.fetchTodaysTasks();
    expect(taskStore.tasks).toHaveLength(1);
    await taskStore.addTask({
      title: "go to grocery store",
      dueDate: new Date(),
    });
    await taskStore.fetchTodaysTasks();
    expect(taskStore.tasks).toHaveLength(1);
  });
});
