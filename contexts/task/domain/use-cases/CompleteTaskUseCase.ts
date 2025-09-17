import { inject, injectable } from "inversify";
import { Task } from "../entities/Task";
import { TYPES } from "@shared/types/container-types";
import type { ITaskRepository } from "../entities/repositories/ITaskRepository";
import type { Logger } from "winston";

export interface CompleteTaskResponse {
  success: boolean;
  task?: Task;
  error?: string;
}

@injectable()
export class CompleteTaskUseCase {
  constructor(
    @inject(TYPES.TaskRepository) private taskRepository: ITaskRepository,
    @inject(TYPES.Logger) private logger: Logger,
  ) {}

  async execute(taskId: string): Promise<CompleteTaskResponse> {
    try {
      const task = await this.taskRepository.findById(taskId);

      if (!task) {
        return { success: false, error: "Task not found" };
      }

      task.complete();
      await this.taskRepository.save(task);

      this.logger.info(`Task completed: ${task.id} - "${task.title}"`);

      return { success: true, task };
    } catch (error) {
      this.logger.error(`Failed to complete task: ${error}`);
      return { success: false, error: "Failed to complete task" };
    }
  }
}
