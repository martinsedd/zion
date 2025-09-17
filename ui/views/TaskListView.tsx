import { container, TYPES } from "@shared/container";
import { Box, Text, useInput } from "ink";
import { Task } from "contexts/task/domain/entities/Task";
import { CompleteTaskUseCase } from "contexts/task/domain/use-cases/CompleteTaskUseCase";
import { GetTasksUseCase } from "contexts/task/domain/use-cases/GetTasksUseCase";
import { useState, useEffect } from "react";
import { TaskList } from "ui/components/TaskList";

interface TaskListViewProps {
  onAddTask: () => void;
  onExit: () => void;
}

export function TaskListView({ onAddTask, onExit }: TaskListViewProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTasksUseCase = container.get<GetTasksUseCase>(TYPES.GetTasksUseCase);
  const completeTaskUseCase = container.get<CompleteTaskUseCase>(
    TYPES.CompleteTaskUseCase,
  );

  const loadTasks = async () => {
    setIsLoading(true);
    const result = await getTasksUseCase.execute();

    if (result.success) {
      setTasks(result.tasks);
      setError(null);

      if (result.tasks.length > 0 && selectedIndex >= result.tasks.length) {
        setSelectedIndex(result.tasks.length - 1);
      }
    } else {
      setError(result.error || "Failed to laod tasks");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useInput((input, key) => {
    if (isLoading) return;

    if (key.downArrow || input === "j") {
      setSelectedIndex((prev) =>
        tasks.length > 0 ? Math.min(prev + 1, tasks.length - 1) : 0,
      );
    }

    if (key.upArrow || input === "k") {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }

    if (input === "a") {
      onAddTask();
    }

    if (input === " " && tasks.length > 0) {
      const selectedTask = tasks[selectedIndex];
      if (selectedTask) {
        completeTaskUseCase.execute(selectedTask.id).then(() => {
          loadTasks();
        });
      }
    }

    if (key.ctrl && input === "c") {
      onExit();
    }
  });

  if (isLoading) {
    return (
      <Box padding={1}>
        <Text>Loading tasks...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding={1}>
        <Text color="red">Error: {error}</Text>
        <Text dimColor>Process Ctrl+C to exit</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          🏔️ Zion Task Manager
        </Text>
      </Box>

      <TaskList tasks={tasks} selectedIndex={selectedIndex} />

      <Box marginTop={1} borderStyle="single" borderColor="gray" padding={1}>
        <Text dimColor>
          j/k: navigate • space: complete • a: add task • Ctrl+C: exit
        </Text>
      </Box>
    </Box>
  );
}
