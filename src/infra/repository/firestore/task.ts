import { injectable } from "inversify";
import firebase from "firebase";

import "@/lib/firebase";
import { Task } from "@/domain/entity";
import { TaskRepository } from "@/domain/repository";

@injectable()
export class FirestoreTaskRepository implements TaskRepository {
  private db: firebase.firestore.Firestore;
  constructor() {
    this.db = firebase.firestore();
  }

  async getTasksByDateRange(from: Date, to: Date): Promise<Task[]> {
    throw new Error("not implemented");
  }

  async getTasksWithNoDueDate(): Promise<Task[]> {
    throw new Error("not implemented");
  }

  async addTask(task: Task): Promise<void> {
    throw new Error("not implemented");
  }
}
