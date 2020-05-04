import { TaskEvent } from "@/domain/entity";

export interface TaskEventRepository {
  /**
   * @param userId user ID
   * find all task events
   */
  findAll(userId: string): Promise<TaskEvent[]>;

  /**
   * @param userId user ID
   * @param taskEvent a task event to add
   */
  add(userId: string, taskEvent: TaskEvent): Promise<void>;

  /**
   * @param userId user ID
   * @param taskEvent a task event to update
   */
  update(userId: string, taskEvent: TaskEvent): Promise<void>;
}
