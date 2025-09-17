import { TaskStatus, TaskCategory, TaskType } from "@shared/types";

export interface TaskProperties {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  category: TaskCategory;
  type: TaskType;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class Task {
  private constructor(private props: TaskProperties) {}

  static create(
    data: Omit<TaskProperties, "id" | "createdAt" | "updatedAt">,
  ): Task {
    const now = new Date();
    return new Task({
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromProperties(props: TaskProperties): Task {
    return new Task(props);
  }

  // INFO: Getters
  get id(): string {
    return this.props.id;
  }
  get title(): string {
    return this.props.title;
  }
  get description(): string | undefined {
    return this.props.description;
  }
  get status(): TaskStatus {
    return this.props.status;
  }
  get category(): TaskCategory {
    return this.props.category;
  }
  get type(): TaskType {
    return this.props.type;
  }
  get tags(): string[] {
    return [...this.props.tags];
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // INFO: Business methods
  updateTitle(title: string): void {
    if (!title.trim()) {
      throw new Error("Task title cannot be empty");
    }
    this.props.title = title.trim();
    this.props.updatedAt = new Date();
  }

  updateDescription(description?: string): void {
    this.props.description = description?.trim() || undefined;
    this.props.updatedAt = new Date();
  }

  changeStatus(status: TaskStatus): void {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  addTag(tag: string): void {
    const normalizedTag = tag.trim().toLowerCase();
    if (normalizedTag && !this.props.tags.includes(normalizedTag)) {
      this.props.tags.push(normalizedTag);
      this.props.updatedAt = new Date();
    }
  }

  removeTag(tag: string): void {
    const normalizedTag = tag.trim().toLowerCase();
    const index = this.props.tags.indexOf(normalizedTag);
    if (index > -1) {
      this.props.tags.splice(index, 1);
      this.props.updatedAt = new Date();
    }
  }

  complete(): void {
    this.changeStatus(TaskStatus.DONE);
  }

  toJSON(): TaskProperties {
    return { ...this.props };
  }
}
