import { describe, it, expect } from "vitest";
import { container, TYPES } from "@shared/container";
import type { Logger } from "winston";

describe("Dependency Injection Container", () => {
  it("should resolve logger from container", () => {
    const logger = container.get<Logger>(TYPES.Logger);
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe("function");
  });

  it("should maintain singleton instance", () => {
    const logger1 = container.get<Logger>(TYPES.Logger);
    const logger2 = container.get<Logger>(TYPES.Logger);
    expect(logger1).toBe(logger2);
  });
});
