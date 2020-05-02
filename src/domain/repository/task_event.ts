import { TaskEvent } from "@/domain/entity";

export interface TaskEventRepository {
  /**
   * find all task events
   */
  findAll(): Promise<TaskEvent[]>;

  /**
   *
   * @param taskEvent a task event to add
   */
  add(taskEvent: TaskEvent): Promise<void>;

  /**
   *
   * @param taskEvent a task event to update
   */
  update(taskEvent: TaskEvent): Promise<void>;

  /**
   *
   * @param taskId task ID for which to find all associated events
   */
  findAllForTask(taskId: string): Promise<TaskEvent[]>;

  /**
   * find last adde event if any
   */
  findLastAdded(): Promise<TaskEvent | null>;
}
