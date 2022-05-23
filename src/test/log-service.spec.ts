import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from '../providers/log-service';

describe('LogService', () => {
  let provider: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogService],
    }).compile();

    provider = await module.resolve<LogService>(LogService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
