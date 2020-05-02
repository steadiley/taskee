import { injectable } from "inversify";
import firebase, { firestore } from "firebase";

import "@/lib/firebase";
import { Task } from "@/domain/entity";
import { TaskRepository } from "@/domain/repository";
import { assertIsDefined } from "@/lib/assert";

@injectable()
export class FirestoreTaskRepository implements TaskRepository {
  private db: firebase.firestore.Firestore;
  constructor() {
    this.db = firebase.firestore();
    if (
      process.env.VUE_APP_FIREBASE_FIRESTORE_USE_REAL !== "true" &&
      location.hostname === "localhost"
    ) {
      this.db.settings({
        host: `localhost:${process.env.VUE_APP_FIREBASE_FIRESTORE_EMULATOR_PORT}`,
        ssl: false,
      });
    }
  }

  async getTasksByDateRange(from: Date, to: Date): Promise<Task[]> {
    const result = await this.getTasksCollectionRef()
      .where("dueDate", ">=", from)
      .where("dueDate", "<=", to)
      .get();

    const tasks = result.docs.map((doc) => {
      const data: firestore.DocumentData = doc.data();
      return this.fromTaskDocToEntity(data);
    });
    return tasks;
  }

  async getTasksWithNoDueDate(): Promise<Task[]> {
    const result = await this.getTasksCollectionRef()
      .where("dueDate", "==", null)
      .get();

    const tasks = result.docs.map((doc) => {
      const data: firestore.DocumentData = doc.data();
      return this.fromTaskDocToEntity(data);
    });
    return tasks;
  }

  async addTask(task: Task): Promise<void> {
    await this.getTasksCollectionRef()
      .doc(task.id)
      .set(this.toTaskDocFromEntity(task));
  }

  async getTaskById(id: string): Promise<Task | null> {
    const result = await this.getTasksCollectionRef().doc(id).get();
    const data = result.data();
    if (!data) {
      return null;
    }
    return this.fromTaskDocToEntity(data);
  }

  private toTaskDocFromEntity(task: Task): firestore.DocumentData {
    return {
      id: task.id,
      title: task.title,
      dueDate: task.dueDate,
      finishdedAt: task.finishedAt,
    };
  }

  private fromTaskDocToEntity(data: firestore.DocumentData): Task {
    assertIsDefined(data.id);
    assertIsDefined(data.title);
    return new Task(data.id, data.title, data.dueDate, data.finishdedAt);
  }

  private getTasksCollectionRef() {
    return this.getTasksRef().collection("collection");
  }

  private getTasksRef() {
    const userId = "taro"; // TODO: will be replaced by currently logged in user id
    return this.db.collection(`users/${userId}`).doc("tasks");
  }
}
