import { TaskStatus } from "@shared/types";
import type { Task } from "contexts/task/domain/entities/Task";
import { Box, Text } from "ink";

interface TaskListProps {
  tasks: Task[];
  selectedIndex: number;
}

export function TaskList({ tasks, selectedIndex }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Box padding={1}>
        <Text dimColor>No tasks found. Press 'a' to add a task.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          isSelected={index === selectedIndex}
        />
      ))}
    </Box>
  );
}

interface TaskItemProps {
  task: Task;
  isSelected: boolean;
}

function TaskItem({ task, isSelected }: TaskItemProps) {
  const getStatusIcon = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.TODO:
        return "○";
      case TaskStatus.IN_PROGRESS:
        return "◐";
      case TaskStatus.BLOCKED:
        return "⚫";
      case TaskStatus.REVIEW_NEEDED:
        return "◑";
      case TaskStatus.DONE:
        return "●";
      default:
        return "○";
    }
  };

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.TODO:
        return "white";
      case TaskStatus.IN_PROGRESS:
        return "yellow";
      case TaskStatus.BLOCKED:
        return "red";
      case TaskStatus.REVIEW_NEEDED:
        return "cyan";
      case TaskStatus.DONE:
        return "green";
      default:
        return "white";
    }
  };

  return (
    <Box backgroundColor={isSelected ? "blue" : undefined}>
      <Text color={getStatusColor(task.status)}>
        {getStatusIcon(task.status)}
      </Text>
      <Text> </Text>
      <Text bold={isSelected}>{task.title}</Text>
      <Text dimColor> [{task.category}]</Text>
      {task.tags.length > 0 && <Text dimColor> #(task.tags.join(' #'))</Text>}
    </Box>
  );
}
