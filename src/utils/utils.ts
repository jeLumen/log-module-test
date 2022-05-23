import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { env } from 'process';

@Injectable()
export class Utils {
  public isError(item) {
    return Object.prototype.toString.call(item) === '[object Error]';
  }

  public getUUID(): string {
    return uuidv4();
  }

  public calculateRuntimeBranch(): string {
    const staticBranches = ['validation', 'staging', 'master'];
    return staticBranches.includes(env.BRANCH_NAME)
      ? env.BRANCH_NAME
      : 'validation';
  }
}
