import firebase, { firestore } from "firebase";
import { injectable } from "inversify";

import { assertIsDefined } from "@/lib/assert";
import { TaskEvent } from "@/domain/entity";
import { TaskEventRepository } from "@/domain/repository";

@injectable()
export class FirestoreTaskEventRepository implements TaskEventRepository {
  constructor(private db: firebase.firestore.Firestore) {}

  async findAll(userId: string): Promise<TaskEvent[]> {
    const { docs } = await this.getTaskEventsRef(userId).limit(50).get();
    return docs.map((doc) => this.fromDocToEntity(doc.data()));
  }

  async add(userId: string, taskEvent: TaskEvent): Promise<void> {
    await this.update(userId, taskEvent);
  }

  async update(userId: string, taskEvent: TaskEvent): Promise<void> {
    await this.getTaskEventsRef(userId)
      .doc(taskEvent.id)
      .set(this.toDocFromEntity(taskEvent));
  }

  async deleteAllTaskEvents(userId: string, taskId: string): Promise<void> {
    const batch = this.db.batch();
    const deleteTargets = (
      await this.getTaskEventsRef(userId).where("taskId", "==", taskId).get()
    ).docs;
    for (const taskEvent of deleteTargets) {
      batch.delete(taskEvent);
    }
    await batch.commit();
  }

  private toDocFromEntity(taskEvent: TaskEvent): firestore.DocumentData {
    return {
      id: taskEvent.id,
      taskId: taskEvent.taskId,
      startedAt: taskEvent.startedAt,
      endedAt: taskEvent.endedAt,
    };
  }

  private fromDocToEntity(data: firestore.DocumentData): TaskEvent {
    assertIsDefined(data.id);
    assertIsDefined(data.taskId);
    assertIsDefined(data.startedAt);
    return new TaskEvent(
      data.id,
      data.taskId,
      data.startedAt.toDate(),
      data.endedAt ? data.endedAt.toDate() : null
    );
  }

  private getTaskEventsRef(userId: string | null) {
    assertIsDefined(userId);
    return this.db.collection(`users/${userId}/task_events`);
  }
}
