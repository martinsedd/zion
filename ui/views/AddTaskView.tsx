import { container, TYPES } from "@shared/container";
import { Box, Text, useInput } from "ink";
import { TaskCategory, TaskType } from "@shared/types";
import { AddTaskUseCase } from "contexts/task/domain/use-cases/AddTaskUseCase";
import { useState } from "react";

interface AddTaskViewProps {
  onTaskAdded: () => void;
  onCancel: () => void;
}

const categories = Object.values(TaskCategory);
const types = Object.values(TaskType);

export function AddTaskView({ onTaskAdded, onCancel }: AddTaskViewProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [typeIndex, setTypeIndex] = useState(0);
  const [currentField, setCurrentField] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTaskUseCase = container.get<AddTaskUseCase>(TYPES.AddTaskUseCase);

  const handleTextInput = (
    input: string,
    setter: (fn: (prev: string) => string) => void,
  ) => {
    if (input && input.length === 1) {
      setter((prev) => prev + input);
    }
  };

  const handleBackspace = (setter: (fn: (prev: string) => string) => void) => {
    setter((prev) => prev.slice(0, -1));
  };

  const handleNavigation = (
    direction: "left" | "right",
    currentIndex: number,
    maxLength: number,
    setter: (fn: (prev: number) => number) => void,
  ) => {
    if (direction === "left") {
      setter((prev) => Math.max(prev - 1, 0));
    } else {
      setter((prev) => Math.min(prev + 1, maxLength - 1));
    }
  };

  const submitTask = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const result = await addTaskUseCase.execute({
      title: title.trim(),
      description: description.trim() || undefined,
      category: categories[categoryIndex] ?? TaskCategory.PERSONAL,
      type: types[typeIndex] ?? TaskType.FEATURE,
    });

    if (result.success) {
      onTaskAdded();
    } else {
      setError(result.error || "Failed to create task");
      setIsSubmitting(false);
    }
  };

  useInput(async (input, key) => {
    if (isSubmitting) return;

    if (key.tab || key.downArrow) {
      setCurrentField((prev) => Math.min(prev + 1, 3));
      return;
    }
    if (key.upArrow) {
      setCurrentField((prev) => Math.max(prev - 1, 0));
      return;
    }
    if (key.escape) {
      onCancel();
      return;
    }
    if (key.return && title.trim()) {
      await submitTask();
      return;
    }

    // INFO: Field-specific handling
    if (currentField === 0 || currentField === 1) {
      // INFO: Text fields (title/description)
      const setter = currentField === 0 ? setTitle : setDescription;
      if (key.backspace) {
        handleBackspace(setter);
      } else {
        handleTextInput(input, setter);
      }
    } else if (currentField === 2) {
      // INFO: Category selection
      if (key.leftArrow || input === "h") {
        handleNavigation(
          "left",
          categoryIndex,
          categories.length,
          setCategoryIndex,
        );
      } else if (key.rightArrow || input === "l") {
        handleNavigation(
          "right",
          categoryIndex,
          categories.length,
          setCategoryIndex,
        );
      }
    } else if (currentField === 3) {
      // INFO: Type selection
      if (key.leftArrow || input === "h") {
        handleNavigation("left", typeIndex, types.length, setTypeIndex);
      } else if (key.rightArrow || input === "l") {
        handleNavigation("right", typeIndex, types.length, setTypeIndex);
      }
    }
  });
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          🏔️ Add New Task
        </Text>
      </Box>

      {error && (
        <Box marginBottom={1}>
          <Text color="red">Error: {error}</Text>
        </Box>
      )}

      <Box flexDirection="column" gap={1}>
        <Box>
          <Text
            color={currentField === 0 ? "yellow" : "white"}
            bold={currentField === 0}
          >
            Title:
          </Text>
          <Text> {title}</Text>
          {currentField === 0 && <Text color="yellow">|</Text>}
        </Box>

        <Box>
          <Text
            color={currentField === 1 ? "yellow" : "white"}
            bold={currentField === 1}
          >
            Description:
          </Text>
          <Text> {description}</Text>
          {currentField === 1 && <Text color="yellow">|</Text>}
        </Box>

        <Box>
          <Text
            color={currentField === 2 ? "yellow" : "white"}
            bold={currentField === 2}
          >
            Category:
          </Text>
          <Text> </Text>
          {categories.map((cat, index) => (
            <Text
              key={cat}
              color={index === categoryIndex ? "green" : "gray"}
              bold={index === categoryIndex}
            >
              {cat}
              {index < categories.length - 1 ? " | " : ""}
            </Text>
          ))}
        </Box>

        <Box>
          <Text
            color={currentField === 3 ? "yellow" : "white"}
            bold={currentField === 3}
          >
            Type:
          </Text>
          <Text> </Text>
          {types.map((type, index) => (
            <Text
              key={type}
              color={index === typeIndex ? "green" : "gray"}
              bold={index === typeIndex}
            >
              {type}
              {index < types.length - 1 ? " | " : ""}
            </Text>
          ))}
        </Box>
      </Box>

      <Box marginTop={2} borderStyle="single" borderColor="gray" padding={1}>
        <Text dimColor>
          {isSubmitting
            ? "Creating task..."
            : "Tab/↑↓: navigate fields • h/l/←→: select options • Enter: save • Esc: cancel"}
        </Text>
      </Box>
    </Box>
  );
}
