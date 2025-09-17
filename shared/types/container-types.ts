export const TYPES = {
  Logger: Symbol.for("Logger"),
  TaskRepository: Symbol.for("TaskRepository"),
  AddTaskUseCase: Symbol.for("AddTaskUseCase"),
  GetTasksUseCase: Symbol.for("GetTasksUseCase"),
  CompleteTaskUseCase: Symbol.for("CompleteTaskUseCase"),
} as const;
