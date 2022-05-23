import { LogLevel } from '@nestjs/common';

export interface LogRequest {
  // Message of log activity message
  message: string;

  // Context source of log activity message
  context: string;

  // Level of log activity message
  level: LogLevel;

  // Optional detail of log activity message
  detail?: string;

  // Optional stacktrace of runtime errors
  stacktrace?: string;
}
