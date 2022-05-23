import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LogService } from '../providers/log-service';
// import { ConfigService } from "../../config/providers/config.service";
import { Utils } from '../utils/utils';
import { inspect } from 'util';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  $util = new Utils();
  private readonly $config = this.ConfigService;

  constructor(
    private readonly $log: LogService,
    @Inject('CONFIG_SERVICE') private readonly ConfigService?,
  ) {
    const appName = this.$config.get('app.name');
    this.$log.setContext(`${appName} Endpoint Interceptor`);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((e) => {
        const message =
          this.$util.isError(e) && e.message ? e.message : inspect(e);
        const stack = this.$util.isError(e) && e.stack ? e.stack : null;
        this.$log.error(message, stack, LogInterceptor.name);

        return throwError(e);
      }),
      tap((r) => {
        const log = {
          request: '',
          response: '',
        };
        // request info
        // the same info gets passed before and after next()
        // otherwise, we should ideally put this before next() to catch the incoming request before handling it
        log.request = this.getDataFromHttpRequest(context);
        log.response = r;

        // response info
        this.$log.log(inspect(log), LogInterceptor.name);
      }),
    );
  }

  private getDataFromHttpRequest(context: ExecutionContext): any {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { url, method, body } = request;
    return {
      url,
      method,
      body,
      params: request['params'],
      query: request['query'],
    };
  }
}
