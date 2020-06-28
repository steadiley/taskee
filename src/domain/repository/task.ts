import { Task } from "@/domain/entity";

export interface TaskRepository {
  /**
   * Fetch list of unfinished tasks
   * @param userId user ID
   */
  getUnfinishedTasks(userId: string): Promise<Task[]>;

  /**
   * @param userId user ID
   * @param task a task to add
   */
  addTask(userId: string, task: Task): Promise<void>;

  /**
   * @param userId user ID
   * @param id task id for which to fetch corresponding task. returns null if not found.
   */
  getTaskById(userId: string, id: string): Promise<Task | null>;

  /**
   * @param userId user ID
   * @param task a task to update
   */
  updateTask(userId: string, task: Task): Promise<void>;
}
