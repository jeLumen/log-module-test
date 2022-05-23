import { LogLevel } from '../enums/log-level';

export interface LogMessageBody {
  // UUID of message to log
  id: string;

  // Name of service logging the activity message
  service: string;

  // Environment logging the activity message
  environment: string;

  // Context source of log activity message
  context: string;

  // Datetime stamp of log activity message
  datetime: string;

  // Level of log activity message
  level: LogLevel;

  // Message of log activity message
  message: string;

  // Optional detail of log activity message
  detail?: string;

  // Optional stacktrace of runtime errors
  stacktrace?: string;
}
