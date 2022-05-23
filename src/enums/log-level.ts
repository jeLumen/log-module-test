export enum LogLevel {
  EMERGENCY = 'emerg', // syslog
  ALERT = 'alert', // syslog
  CRITICAL = 'crit', // syslog
  ERROR = 'error', // syslog, npm
  DEBUG = 'debug', // syslog, npm
  HTTP = 'http', // npm
  INFO = 'info', // syslog, npm
  WARN = 'warn', // npm
  WARNING = 'warning', // syslog
  VERBOSE = 'verbose', // npm
  NOTICE = 'notice', // syslog
  SILLY = 'silly', // npm
}
