import "reflect-metadata";
import { Container } from "inversify";
import { logger } from "./logger";
import { TYPES } from "./types/container-types";
import type { ITaskRepository } from "contexts/task/domain/entities/repositories/ITaskRepository";
import { InMemoryTaskRepository } from "../contexts/task/infra/repositories/InMemoryTaskRepository";
import { AddTaskUseCase } from "../contexts/task/domain/use-cases/AddTaskUseCase";
import { GetTasksUseCase } from "../contexts/task/domain/use-cases/GetTasksUseCase";
import { CompleteTaskUseCase } from "../contexts/task/domain/use-cases/CompleteTaskUseCase";

const container = new Container();

// Bind services
container.bind(TYPES.Logger).toConstantValue(logger);
container
  .bind<ITaskRepository>(TYPES.TaskRepository)
  .to(InMemoryTaskRepository)
  .inSingletonScope();

// Bind use cases
container.bind<AddTaskUseCase>(TYPES.AddTaskUseCase).to(AddTaskUseCase);
container.bind<GetTasksUseCase>(TYPES.GetTasksUseCase).to(GetTasksUseCase);
container
  .bind<CompleteTaskUseCase>(TYPES.CompleteTaskUseCase)
  .to(CompleteTaskUseCase);

export { container, TYPES };
