#!/usr/bin/env bun

import { container, TYPES } from "../shared/container";
import { render, Text, Box } from "ink";
import type { Logger } from "winston";

function App() {
  const logger = container.get<Logger>(TYPES.Logger);

  logger.info("Zion Task Manager starting up...");

  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan" bold>
        🏔️ Welcome to Zion Task Manager! 🏔️
      </Text>
      <Text color="green">✓ Dependency Injection: Working</Text>
      <Text color="green">✓ Logging: Working (check logs/zion.log)</Text>
      <Text color="yellow" dimColor>
        Press Ctrl+C to exit
      </Text>
    </Box>
  );
}

render(<App />);
