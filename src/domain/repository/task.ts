import { Task } from "@/domain/entity";

export interface TaskRepository {
  /**
   * Fetch list of tasks whose due date is whithin the designated period
   * @param from start of period
   * @param to end of period
   */
  getTasksByDateRange(from: Date, to: Date): Promise<Task[]>;

  /**
   * Get tasks with no due date
   */
  getTasksWithNoDueDate(): Promise<Task[]>;

  /**
   *
   * @param task a task to add
   */
  addTask(task: Task): Promise<void>;

  /**
   * get currently running task
   */
  getRunningTask(): Promise<Task | null>;

  /**
   *
   * @param id set currently running task with `id`
   */
  updateRunningTask(id: string): Promise<void>;

  /**
   *
   * @param id task id for which to fetch corresponding task. returns null if not found.
   */
  getTaskById(id: string): Promise<Task | null>;
}
