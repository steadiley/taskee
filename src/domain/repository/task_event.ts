import { TaskEvent } from "@/domain/entity";

export interface TaskEventRepository {
  /**
   *
   * @param taskEvent a task event to add
   */
  add(taskId: string, taskEvent: TaskEvent): Promise<void>;

  /**
   *
   * @param taskId task ID for which to find all associated events
   */
  findAllForTask(taskId: string): Promise<TaskEvent[]>;
}
