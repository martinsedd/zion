import type { TaskCategory, TaskStatus } from "@shared/types";
import type { Task } from "../Task";

export interface TaskFilters {
  status?: TaskStatus;
  category?: TaskCategory;
  titleContains?: string;
  tags?: string[];
}

export interface ITaskRepository {
  save(task: Task): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findAll(filters?: TaskFilters): Promise<Task[]>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}
