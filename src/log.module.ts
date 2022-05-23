import { Module, DynamicModule, Inject, Global } from '@nestjs/common';
import { LogService } from './providers/log-service';

@Global()
@Module({})
export class LogModule {
  static register(options): DynamicModule {
    return {
      module: LogModule,
      providers: [
        {
          provide: 'APP_CONFIG_DATA',
          useValue: options.AppConfigData,
        },
        {
          provide: 'CONFIG_SERVICE',
          useValue: options.ConfigService,
        },

        LogService,
      ],
      exports: [LogService],
    };
  }
}

/// Register NestJS HTTP module example
// static register(config: LogModuleOptions): DynamicModule {
//   return {
//     module: LogModule,
//     providers: [
//       {
//         provide: AXIOS_INSTANCE_TOKEN,
//         useValue: Axios.create(config),
//       },
//       {
//         provide: HTTP_MODULE_ID,
//         useValue: randomStringGenerator(),
//       },
//     ],
//   };
// }

/// Register Async NestJS HTTP module example

// static registerAsync(options: LogModuleAsyncOptions): DynamicModule {
//   return {
//     module: LogModule,
//     imports: options.imports,
//     providers: [
//       ...this.createAsyncProviders(options),
//       {
//         provide: AXIOS_INSTANCE_TOKEN,
//         useFactory: (config: LogModuleOptions) => Axios.create(config),
//         inject: [HTTP_MODULE_OPTIONS],
//       },
//       {
//         provide: HTTP_MODULE_ID,
//         useValue: randomStringGenerator(),
//       },
//       ...(options.extraProviders || []),
//     ],
//   };
// }
