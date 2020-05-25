import { injectable } from "inversify";
import firebase, { firestore } from "firebase";

import "@/lib/firebase";
import { Task } from "@/domain/entity";
import { TaskRepository } from "@/domain/repository";
import { assertIsDefined } from "@/lib/assert";

@injectable()
export class FirestoreTaskRepository implements TaskRepository {
  constructor(private db: firebase.firestore.Firestore) {}

  async getUnfinishedTasks(userId: string): Promise<Task[]> {
    const query = this.getTasksRef(userId).where("finishedAt", "==", null); // finishedAt is null
    const result = await query.get();

    const tasks = result.docs.map(doc => {
      const data: firestore.DocumentData = doc.data();
      return this.fromTaskDocToEntity(data);
    });
    return tasks;
  }

  async addTask(userId: string, task: Task): Promise<void> {
    await this.getTasksRef(userId)
      .doc(task.id)
      .set(this.toTaskDocFromEntity(task));
  }

  async getTaskById(userId: string, id: string): Promise<Task | null> {
    const result = await this.getTasksRef(userId).doc(id).get();
    const data = result.data();
    if (!data) {
      return null;
    }
    return this.fromTaskDocToEntity(data);
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    await this.getTasksRef(userId).doc(taskId).delete();
  }

  private toTaskDocFromEntity(task: Task): firestore.DocumentData {
    return {
      id: task.id,
      title: task.title,
      dueDate: task.dueDate,
      finishedAt: task.finishedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  }

  private fromTaskDocToEntity(data: firestore.DocumentData): Task {
    assertIsDefined(data.id);
    assertIsDefined(data.title);
    return new Task(
      data.id,
      data.title,
      data.dueDate ? data.dueDate.toDate() : null,
      data.finishedAt ? data.finishedAt.toDate() : null,
      data.createdAt ? data.createdAt.toDate() : null,
      data.updatedAt ? data.updatedAt.toDate() : null
    );
  }

  private getTasksRef(userId: string | null) {
    assertIsDefined(userId);
    return this.db.collection(`users/${userId}/tasks`);
  }
}
