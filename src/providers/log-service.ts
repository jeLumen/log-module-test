import {
  ConsoleLogger,
  Inject,
  Injectable,
  Request,
  Scope,
} from '@nestjs/common';
import { config, createLogger, format, transports } from 'winston';
import { LogResponse } from '../interfaces/log-response';
import { LogMessageBody } from '../interfaces/log-message-body';
import { LogRequest } from '../interfaces/log-request';
import { LogLevel } from '../enums/log-level';
// import AppConfigData from '../../config/data';
import { TransformableInfo } from 'logform';
import { Utils } from '../utils/utils';

@Injectable({ scope: Scope.TRANSIENT })
export class LogService extends ConsoleLogger {
  private winstonLogger;
  private readonly $util = new Utils();
  private logLevel: string;

  constructor(
    @Inject('APP_CONFIG_DATA') private readonly AppConfigData,
    @Inject(Request) private readonly request?: Request,
  ) {
    super();

    this.logLevel =
      this.AppConfigData()?.app?.log?.logLevel?.toUpperCase() ||
      this.AppConfigData()?.app?.log?.defaultLogLevel[
        this.$util.calculateRuntimeBranch()
      ]?.toUpperCase() ||
      'WARNING';

    this.winstonLogger = createLogger({
      level: this.logLevel.toLowerCase(),
      levels: config.syslog.levels,
      transports: [
        new transports.Console({
          handleExceptions: true,
          format: format.combine(
            format((info) => (info.private ? false : info))(),
            format.colorize(),
            // format.label({ label: this.config.app.name }),
            // format.timestamp(),
            // format.simple(),
            format.printf((log) => this.formatLogForSplunk(log)),
            // format.json(),
          ),
        }),
      ],
    });
  }

  public log(message: string, context: string): LogResponse {
    return this.addLog(LogLevel.INFO, { message, context });
  }

  public error(
    message: string | Error,
    trace?: string,
    context?: string,
  ): LogResponse {
    return this.addLog(LogLevel.ERROR, {
      message: `${message}${trace ? ' - ' + trace : ''}`,
      context,
    });
  }

  public warn(message: string, context: string): LogResponse {
    return this.addLog(LogLevel.WARNING, { message, context });
  }

  public debug(message: string, context: string): LogResponse {
    return this.addLog(LogLevel.DEBUG, { message, context });
  }

  public notice(message: string, context: string): LogResponse {
    return this.addLog(LogLevel.NOTICE, { message, context });
  }

  private addLog(level: LogLevel, log): LogResponse {
    const logEntry = this.createLog(level, log);
    // const consoleOutput = this.formatLogForSplunk(logEntry);
    this.winstonLogger.log(level, logEntry);
    return this.generateLogResponse(logEntry);
  }

  private createLog(
    level: LogLevel,
    { message, context }: LogRequest,
  ): LogMessageBody {
    const id = this.$util.getUUID();
    const datetime = new Date(Date.now()).toISOString();
    return {
      id,
      level,
      service: this.AppConfigData()?.app.name,
      environment: this.AppConfigData()?.server.env,
      context,
      datetime,
      message,
    };
  }

  private generateLogResponse(response: LogMessageBody): LogResponse {
    const { id } = response;
    return {
      log: {
        id,
      },
    };
  }

  private formatLogForConsole(log: LogMessageBody): string {
    const { context, id, datetime, message } = log;
    return `[ ${context} | ${id} | ${datetime} ] \n${message}\n`;
  }

  private formatLogForSplunk(log: LogMessageBody | TransformableInfo): string {
    let logOutput = `${log.datetime} `;
    for (const k in log) {
      logOutput += `${k}="${log[k]}" `;
    }
    return logOutput;
  }
}
