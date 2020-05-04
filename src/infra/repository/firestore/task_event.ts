import { firestore } from "firebase";
import { injectable } from "inversify";

import { assertIsDefined } from "@/lib/assert";
import { TaskEvent } from "@/domain/entity";
import { TaskEventRepository } from "@/domain/repository";
import firestoreClient from "./firestore_client";

@injectable()
export class FirestoreTaskEventRepository implements TaskEventRepository {
  private db: firebase.firestore.Firestore;
  constructor() {
    this.db = firestoreClient;
  }

  async findAll(): Promise<TaskEvent[]> {
    const { docs } = await this.getTaskEventsRef().limit(50).get();
    return docs.map((doc) => this.fromDocToEntity(doc.data()));
  }

  async add(taskEvent: TaskEvent): Promise<void> {
    await this.update(taskEvent);
  }

  async update(taskEvent: TaskEvent): Promise<void> {
    await this.getTaskEventsRef()
      .doc(taskEvent.id)
      .set(this.toDocFromEntity(taskEvent));
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

  private getTaskEventsRef() {
    const userId = "taro"; // TODO: will be replaced by currently logged in user id
    return this.db.collection(`users/${userId}/task_events`);
  }
}
