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
}
