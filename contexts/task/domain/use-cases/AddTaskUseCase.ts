import "reflect-metadata";
import { TaskStatus, type TaskCategory, type TaskType } from "@shared/types";
import { inject, injectable } from "inversify";
import { Task } from "../entities/Task";
import { TYPES } from "@shared/types/container-types";
import type { ITaskRepository } from "../entities/repositories/ITaskRepository";
import type { Logger } from "winston";

export interface AddTaskRequest {
  title: string;
  description?: string;
  category: TaskCategory;
  type: TaskType;
  tags?: string[];
}

export interface AddTaskResponse {
  success: boolean;
  task?: Task;
  error?: string;
}

@injectable()
export class AddTaskUseCase {
  constructor(
    @inject(TYPES.TaskRepository) private taskRepository: ITaskRepository,
    @inject(TYPES.Logger) private logger: Logger,
  ) {}

  async execute(request: AddTaskRequest): Promise<AddTaskResponse> {
    try {
      if (!request.title.trim()) {
        return { success: false, error: "Task title is required" };
      }

      const task = Task.create({
        title: request.title.trim(),
        description: request.description?.trim(),
        status: TaskStatus.TODO,
        category: request.category,
        type: request.type,
        tags:
          request.tags
            ?.map((tag) => tag.trim().toLowerCase())
            .filter((tag) => tag.length > 0) || [],
      });

      await this.taskRepository.save(task);

      this.logger.info(`Task created: ${task.id} - "${task.title}"`);

      return { success: true, task };
    } catch (error) {
      this.logger.error(`Failed to create task: ${error}`);
      return { success: false, error: "Failed to create task" };
    }
  }
}
