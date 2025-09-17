import type {
  ITaskRepository,
  TaskFilters,
} from "contexts/task/domain/entities/repositories/ITaskRepository";
import type { Task } from "contexts/task/domain/entities/Task";
import { injectable } from "inversify";

@injectable()
export class InMemoryTaskRepository implements ITaskRepository {
  private tasks = new Map<string, Task>();

  async save(task: Task): Promise<void> {
    this.tasks.set(task.id, task);
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) || null;
  }

  async findAll(filters?: TaskFilters): Promise<Task[]> {
    let tasks = Array.from(this.tasks.values());

    if (filters) {
      if (filters.status) {
        tasks = tasks.filter((task) => task.status === filters.status);
      }
      if (filters.category) {
        tasks = tasks.filter((task) => task.category === filters.category);
      }
      if (filters.titleContains) {
        const searchTerm = filters.titleContains.toLowerCase();
        tasks = tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(searchTerm) ||
            task.description?.toLowerCase().includes(searchTerm),
        );
      }
      if (filters.tags && filters.tags.length > 0) {
        tasks = tasks.filter((task) =>
          filters.tags!.some((tag) => task.tags.includes(tag.toLowerCase())),
        );
      }
    }

    return tasks.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async delete(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.tasks.has(id);
  }
}
