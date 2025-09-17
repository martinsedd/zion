import "reflect-metadata";
import { Container } from "inversify";
import { logger } from "./logger";

const container = new Container();

const TYPES = {
  Logger: Symbol.for("Logger"),
} as const;

container.bind(TYPES.Logger).toConstantValue(logger);

export { container, TYPES };
