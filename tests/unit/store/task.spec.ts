import { getModule } from "vuex-module-decorators";
import firebase from "firebase";
import * as firebaseTest from "@firebase/testing";
import dayjs from "dayjs";

import { TaskStore } from "@/store/task";
import { container } from "@/app_context";
import createStore from "@/store";
import { TaskRepository, TaskEventRepository } from "@/domain/repository";
import {
  FirestoreTaskEventRepository,
  FirestoreTaskRepository,
} from "@/infra/repository/firestore";
import { UserStore } from "@/store/user";
import { TaskEvent } from "@/domain/entity";

const PROJECT_ID = "my-test-project";
const USER_ID = "taskee-user";
const EMAIL = "taskee-user@example.com";

describe("task store", () => {
  let taskStore: TaskStore;
  let userStore: UserStore;
  let firestoreClient: firebase.firestore.Firestore;

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
  };

  const teardownFirestore = () => {
    firestoreClient.terminate();
  };

  beforeAll(async () => {
    setupFirestore();
  });

  afterAll(() => {
    teardownFirestore();
  });

  beforeEach(async () => {
    container.snapshot();
    await firebaseTest.clearFirestoreData({ projectId: PROJECT_ID });

    /* Setup Vuex store */
    const store = createStore();
    taskStore = getModule(TaskStore, store);
    userStore = getModule(UserStore, store);
    userStore.login({ userId: USER_ID, email: EMAIL });
    // FIXME: Because store is initialized before each test, its state should be
    // empty but it is not..., so initializing the state with the line below for now
    await taskStore.fetchInitData();
  });

  afterEach(() => {
    container.restore();
  });

  describe("addTask", () => {
    it("can add tasks", async () => {
      await taskStore.addTask({
        title: "go to bookstore",
        dueDate: new Date(),
      });
      await taskStore.fetchUnfinishedTasks();
      expect(taskStore.tasks).toHaveLength(1);
      await taskStore.addTask({
        title: "go to grocery store",
        dueDate: new Date(),
      });
      await taskStore.fetchUnfinishedTasks();
      expect(taskStore.tasks).toHaveLength(2);
    });
  });

  describe("fetchUnfinishedTasks", () => {
    it("fetches unfinished tasks", async () => {
      // TODO: once finish/unfinish toggle feature is implemented, test that it really fetches only unfinished tasks
      const tasks = [
        { title: "today's task 1", dueDate: new Date() },
        { title: "tomorrow's task", dueDate: dayjs().add(1, "day").toDate() },
        { title: "today's task 2", dueDate: new Date() },
      ];
      for (const task of tasks) {
        await taskStore.addTask(task);
      }
      await taskStore.fetchUnfinishedTasks();
      expect(taskStore.tasks).toHaveLength(3);
    });
  });

  describe("start and stop tasks", () => {
    beforeEach(async () => {
      const tasks = [
        { title: "today's task 1", dueDate: new Date() },
        { title: "today's task 2", dueDate: new Date() },
      ];
      for (const task of tasks) {
        await taskStore.addTask(task);
      }
    });
    it(`
    1. sets running task and accosciate incomplete event to the started task once task is started
    2. clears running task and incomplete event once running task is stopped
    `, async () => {
      const firstTask = taskStore.tasks[0];
      await taskStore.startTask(firstTask.id);
      expect(taskStore.runningTask?.task.id).toBe(firstTask.id);
      expect(taskStore.incompleteTaskEvent).not.toBe(null);
      expect(taskStore.incompleteTaskEvent?.taskId).toBe(firstTask.id);

      await taskStore.stopRunningTask();
      expect(taskStore.runningTask).toBe(null);
      expect(taskStore.incompleteTaskEvent).toBe(undefined);
    });

    it("stops running task when another task is started", async () => {
      const firstTask = taskStore.tasks[0];
      await taskStore.startTask(firstTask.id);
      expect(taskStore.runningTask?.task.id).toBe(firstTask.id);
      expect(taskStore.incompleteTaskEvent).not.toBe(null);
      expect(taskStore.incompleteTaskEvent?.taskId).toBe(firstTask.id);
      const taskEventIdForFirstEvent = taskStore.incompleteTaskEvent?.id;

      const secondTask = taskStore.tasks[1];
      await taskStore.startTask(secondTask.id);
      expect(taskStore.runningTask?.task.id).toBe(secondTask.id);
      expect(taskStore.incompleteTaskEvent).not.toBe(null);
      expect(taskStore.incompleteTaskEvent?.taskId).toBe(secondTask.id);

      expect(
        taskStore.taskEvents.find(
          (taskEvent) => taskEvent.id === taskEventIdForFirstEvent
        )?.isEnded
      ).toBeTruthy();
    });
  });

  describe("calcTotalTimeSpentById", () => {
    it("retuns the total millisec spent for given task ID", async () => {
      await taskStore.addTask({ title: "task" });
      const addedTask = taskStore.tasks[0];

      taskStore.addTaskEvent(
        new TaskEvent(
          "1",
          addedTask.id,
          new Date(2020, 5, 6, 5, 12, 30),
          new Date(2020, 5, 6, 5, 12, 31)
        )
      ); // 1 sec
      taskStore.addTaskEvent(
        new TaskEvent(
          "2",
          addedTask.id,
          new Date(2020, 5, 6, 5, 15, 0),
          new Date(2020, 5, 6, 5, 16, 0)
        )
      ); // 1 minute
      taskStore.addTaskEvent(
        new TaskEvent(
          "1",
          addedTask.id,
          new Date(2020, 5, 6, 6, 12, 30),
          new Date(2020, 5, 6, 7, 12, 30)
        )
      ); // 1 hour
      taskStore.addTaskEvent(
        new TaskEvent(
          "3",
          addedTask.id,
          new Date(2020, 5, 6, 6, 12, 30),
          new Date(2020, 5, 7, 6, 12, 30)
        )
      ); // 1 day

      expect(taskStore.calcTotalTimeSpentById(addedTask.id)).toBe(
        (1 + 60 + 60 * 60 + 60 * 60 * 24) * 1000
      );
    });
  });

  describe("deleteTask", () => {
    beforeEach(async () => {
      const tasks = [
        { title: "today's task 1", dueDate: new Date() },
        { title: "tomorrow's task", dueDate: dayjs().add(1, "day").toDate() },
        { title: "today's task 2", dueDate: new Date() },
      ];
      for (const task of tasks) {
        await taskStore.addTask(task);
      }
    });

    it("delete only specified task", async () => {
      const targetId = taskStore.tasks[0].id;
      await taskStore.deleteTask(targetId);
      const targetTask = taskStore.tasks.find((task) => task.id === targetId);
      expect(targetTask).toBeUndefined();
      const remainingTasks = taskStore.tasks;
      expect(remainingTasks).toHaveLength(2);
    });

    it("does nothing when specified task does not exist", async () => {
      const targetId = "non-existent-id";
      expect(taskStore.deleteTask(targetId)).resolves.toBeUndefined();
      const remainingTasks = taskStore.tasks;
      expect(remainingTasks).toHaveLength(3);
    });
  });
});
