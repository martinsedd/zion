#!/usr/bin/env bun

import { container } from "@shared/container";
import { TYPES } from "@shared/types/container-types";
import { render } from "ink";
import { useState } from "react";
import { TaskListView } from "ui/views/TaskListView";
import type { Logger } from "winston";

type AppView = "task-list" | "add-task";

function App() {
  const [currentView, setCurrentView] = useState<AppView>("task-list");
  const logger = container.get<Logger>(TYPES.Logger);

  const handleAddTask = () => {
    logger.info("Add task requested");
  };

  const handleExit = () => {
    logger.info("Zion Task Manager shutting down");
    process.exit(0);
  };

  switch (currentView) {
    case "task-list":
      return <TaskListView onAddTask={handleAddTask} onExit={handleExit} />;
    case "add-task":
      // TODO: Implement AddTaskView
      return <TaskListView onAddTask={handleAddTask} onExit={handleExit} />;
    default:
      return <TaskListView onAddTask={handleAddTask} onExit={handleExit} />;
  }
}

const logger = container.get<Logger>(TYPES.Logger);
logger.info("Zion Task Manager starting up...");

render(<App />);
