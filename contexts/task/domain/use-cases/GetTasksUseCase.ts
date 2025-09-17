import { inject, injectable } from "inversify";
import type { Task } from "../entities/Task";
import { TYPES } from "@shared/types/container-types";
import type {
  ITaskRepository,
  TaskFilters,
} from "../entities/repositories/ITaskRepository";
import type { Logger } from "winston";

export interface GetTasksResponse {
  success: boolean;
  tasks: Task[];
  error?: string;
}

@injectable()
export class GetTasksUseCase {
  constructor(
    @inject(TYPES.TaskRepository) private taskRepository: ITaskRepository,
    @inject(TYPES.Logger) private logger: Logger,
  ) {}

  async execute(filters?: TaskFilters): Promise<GetTasksResponse> {
    try {
      const tasks = await this.taskRepository.findAll(filters);
      return { success: true, tasks };
    } catch (error) {
      this.logger.error(`Failed to get tasks: ${error}`);
      return { success: false, tasks: [], error: "Failed to retrieve tasks" };
    }
  }
}
