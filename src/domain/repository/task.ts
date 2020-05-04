import { Task } from "@/domain/entity";

export interface TaskRepository {
  /**
   * Fetch list of tasks whose due date is whithin the designated period
   * @param userId user ID
   * @param from start of period
   * @param to end of period
   */
  getTasksByDateRange(userId: string, from: Date, to?: Date): Promise<Task[]>;

  /**
   * @param userId user ID
   * Get tasks with no due date
   */
  getTasksWithNoDueDate(userId: string): Promise<Task[]>;

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
}
