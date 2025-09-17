#!/usr/bin/env bun
import "reflect-metadata";
import React, { useState, useRef } from "react";
import { render } from "ink";
import { TaskListView } from "../ui/views/TaskListView";
import type { TaskListViewRef } from "../ui/views/TaskListView";
import { AddTaskView } from "../ui/views/AddTaskView";
import { container, TYPES } from "@shared/container";
import type { Logger } from "winston";

type AppView = "task-list" | "add-task";

function App() {
  const [currentView, setCurrentView] = useState<AppView>("task-list");
  const taskListRef = useRef<TaskListViewRef>(null);
  const logger = container.get<Logger>(TYPES.Logger);

  const handleAddTask = () => {
    logger.info("Switching to add task view");
    setCurrentView("add-task");
  };

  const handleTaskAdded = () => {
    logger.info("Task added successfully, returning to task list");
    setCurrentView("task-list");
    // Refresh the task list
    setTimeout(() => taskListRef.current?.refresh(), 100);
  };

  const handleCancel = () => {
    logger.info("Add task cancelled, returning to task list");
    setCurrentView("task-list");
  };

  const handleExit = () => {
    logger.info("Zion Task Manager shutting down");
    process.exit(0);
  };

  switch (currentView) {
    case "task-list":
      return (
        <TaskListView
          ref={taskListRef}
          onAddTask={handleAddTask}
          onExit={handleExit}
        />
      );
    case "add-task":
      return (
        <AddTaskView onTaskAdded={handleTaskAdded} onCancel={handleCancel} />
      );
    default:
      return (
        <TaskListView
          ref={taskListRef}
          onAddTask={handleAddTask}
          onExit={handleExit}
        />
      );
  }
}

const logger = container.get<Logger>(TYPES.Logger);
logger.info("Zion Task Manager starting up...");

render(<App />);
