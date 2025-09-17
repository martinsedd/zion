import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({
      filename: "logs/zion.log",
      format: winston.format.printf(({ level, message }) => {
        const time = new Date().toISOString();
        return `## ${level.toUpperCase()} - ${time}\n\n${message}\n\n---\n`;
      }),
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

export { logger };
